// Patch ERPNext's client-side calculate_item_values so our custom "discount"
// field is applied every time ERPNext runs its full calculation chain.
// This mirrors DiscountedTaxesAndTotals on the server side: rate is never
// touched; only amount / net_amount / base_* are adjusted.
(function () {
    const PURCHASE_DOCTYPES = ["Purchase Order", "Purchase Receipt", "Purchase Invoice"];

    function patch() {
        if (!window.erpnext?.taxes_and_totals) return false;

        const proto = erpnext.taxes_and_totals.prototype;
        if (proto.calculate_item_values?._discount_patched) return true;

        const _orig = proto.calculate_item_values;

        function patched_calculate_item_values() {
            // Step 1: original ERPNext logic → amount = rate * qty
            _orig.call(this);

            if (!PURCHASE_DOCTYPES.includes(this.frm?.doc?.doctype)) return;
            if (this.discount_amount_applied) return;

            const conv = flt(this.frm.doc.conversion_rate) || 1.0;

            for (const item of this.frm.doc.items || []) {
                const discount = flt(item.discount);
                if (!discount) continue;

                const qty  = flt(item.qty);
                const rate = flt(item.rate);
                if (!qty || !rate) continue;

                const orig_amt  = flt(rate * qty);
                const final_amt = flt(orig_amt * (1.0 - discount / 100.0), precision("amount", item));

                item.amount          = final_amt;
                item.net_amount      = flt(final_amt, precision("net_amount", item));
                item.net_rate        = flt(final_amt / qty, precision("net_rate", item));
                item.base_amount     = flt(final_amt * conv, precision("base_amount", item));
                item.base_net_amount = flt(final_amt * conv, precision("base_net_amount", item));
                item.base_net_rate   = flt(item.net_rate * conv, precision("base_net_rate", item));
            }
        }

        patched_calculate_item_values._discount_patched = true;
        proto.calculate_item_values = patched_calculate_item_values;
        return true;
    }

    // Patch immediately if ERPNext bundle is already loaded, otherwise defer
    if (!patch()) {
        frappe.after_ajax(patch);
    }
})();


// ── PO address auto-fill based on naming series ───────────────────────────

function handle_po_series_change(frm) {
    if (!frm.doc.naming_series || !frm.doc.company) return;

    let city = get_city_from_po_series(frm.doc.naming_series);
    if (!city) return;

    frappe.call({
        method: "multiple_dis.api.get_addresses_for_purchase_order",
        args: {
            city: city,
            company: frm.doc.company,
            supplier: frm.doc.supplier || null
        },
        callback(r) {
            frappe.run_serially([
                () => r.message.company_address  && frm.set_value("billing_address",  r.message.company_address),
                () => r.message.shipping_address && frm.set_value("shipping_address", r.message.shipping_address),
                () => r.message.dispatch_address && frm.set_value("dispatch_address", r.message.dispatch_address),
                () => frm.refresh_fields(["billing_address", "shipping_address", "dispatch_address"])
            ]);
        }
    });
}

function get_city_from_po_series(series) {
    series = series.trim();
    if (series.startsWith("PO/GZB/"))   return "Ghaziabad";
    if (series.startsWith("PO/NOIDA/")) return "Noida";
    if (series.startsWith("PO/MFP/"))   return "Muzaffarpur";
    return null;
}

frappe.ui.form.on("Purchase Order", {
    refresh(frm)       { handle_po_series_change(frm); },
    naming_series(frm) { handle_po_series_change(frm); },
    supplier(frm)      { handle_po_series_change(frm); }
});


// ── Purchase Invoice: auto-fill bill_no / bill_date from linked PR ─────────

frappe.ui.form.on("Purchase Invoice", {
    refresh(frm) {
        if (!frm.doc.items?.length) return;
        const pr = frm.doc.items[0].purchase_receipt;
        if (!pr || (frm.doc.bill_no && frm.doc.bill_date)) return;
        frappe.db.get_value("Purchase Receipt", pr, ["supplier_delivery_note", "posting_date"])
            .then(r => {
                if (!r.message) return;
                if (!frm.doc.bill_no  && r.message.supplier_delivery_note) frm.set_value("bill_no",   r.message.supplier_delivery_note);
                if (!frm.doc.bill_date && r.message.posting_date)          frm.set_value("bill_date", r.message.posting_date);
            });
    }
});


// ── Delivery Note: GST treatment based on sale type ───────────────────────

frappe.ui.form.on("Delivery Note", {
    refresh(frm)              { set_dn_gst(frm); },
    onload(frm)               { set_dn_gst(frm); },
    custom_sale_order_type(frm) { set_dn_gst(frm); }
});

function set_dn_gst(frm) {
    if (frm.doc.custom_sale_order_type === "Bill of Supply") {
        frm.set_value("custom_gst_treatment", "Exempted");
    }
}


// ── Purchase discount: trigger full recalculation when discount changes ────
// qty / rate changes are handled by ERPNext's own built-in handlers, which
// call calculate_taxes_and_totals → our patched calculate_item_values runs
// automatically inside that call, so no extra handlers are needed for them.

["Purchase Order Item", "Purchase Receipt Item", "Purchase Invoice Item"].forEach(doctype => {
    frappe.ui.form.on(doctype, {
        discount(frm, cdt, cdn) {
            frm.cscript.calculate_taxes_and_totals();
            frm.dirty();
        }
    });
});

// On form load, recalculate to fix any stale amounts from pre-restart saves
["Purchase Order", "Purchase Receipt", "Purchase Invoice"].forEach(doctype => {
    frappe.ui.form.on(doctype, {
        onload_post_render(frm) {
            if (frm.doc.docstatus !== 0) return;
            setTimeout(() => {
                frm.cscript.calculate_taxes_and_totals();
            }, 500);
        }
    });
});