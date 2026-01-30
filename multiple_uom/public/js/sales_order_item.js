function fetch_pricing_discount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    if (!row.item_code || !row.price_list_rate || !row.qty) return;

    frappe.call({
        method: "multiple_uom.api.get_base_price_discount",
        args: {
            item_code: row.item_code,
            price_list: frm.doc.selling_price_list,
            price_list_rate: row.price_list_rate,
            qty: row.qty,
            customer: frm.doc.customer,
            company: frm.doc.company
        },
        callback(r) {
            let d1_pct = flt(r.message?.discount_percentage || 0);
            frappe.model.set_value(cdt, cdn, "discount_1_", d1_pct);
            recalc_row(cdt, cdn);
        }
    });
}


frappe.ui.form.on("Sales Order Item", {

    item_code(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    price_list_rate(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    qty(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_1_(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_2(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    }
});


frappe.ui.form.on("Delivery Note Item", {

    item_code(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    price_list_rate(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    qty(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_1_(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_2(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    }
});


frappe.ui.form.on("Sales Invoice Item", {

    item_code(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    price_list_rate(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    qty(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_1_(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_2(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    }
});


function recalc_row(cdt, cdn) {
    let row = locals[cdt][cdn];

    let qty = flt(row.qty);
    if (!qty || !row.price_list_rate) return;

    let pl_rate = flt(row.price_list_rate);

    // -------------------------
    // Discount 1 (Pricing Rule – on RATE)
    // -------------------------
    let d1_pct = flt(row.discount_1_);
    let d1_rate_amt = pl_rate * d1_pct / 100;
    let rate_after_d1 = pl_rate - d1_rate_amt;

    let amount_after_d1 = rate_after_d1 * qty;

    // -------------------------
    // Discount 2 (Manual – on RATE)
    // -------------------------
    let d2_pct = flt(row.discount_2);
    let d2_rate_amt = rate_after_d1 * d2_pct / 100;
    let final_rate = rate_after_d1 - d2_rate_amt;

    let amount_after_d2 = final_rate * qty;

    // -------------------------
    // Discount totals
    // -------------------------
    let d1_amt = d1_rate_amt * qty;
    let d2_amt = d2_rate_amt * qty;

    // -------------------------
    // SET EVERYTHING EXPLICITLY
    // -------------------------
    frappe.model.set_value(cdt, cdn, {
        rate: final_rate,
        basic_rate: final_rate,

        custom_discount_amount_1: d1_amt,
        amount_after_discount_1: amount_after_d1,

        custom_discount_amount_2: d2_amt,
        amount_after_discount_2: amount_after_d2,

        discount_amount: d1_amt + d2_amt
    });
}
