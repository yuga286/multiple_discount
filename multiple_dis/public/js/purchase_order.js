
function handle_po_series_change(frm) {
    console.log("Handling PO series change...");
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
            // console.log("PO API response:", r.message);
            // if (!r.message) return;

            // if (r.message.company_address) {
            //     frm.set_value("company_address", r.message.company_address);
            //     frm.set_value("shipping_address", r.message.shipping_address);
            //     frm.set_value("billing_address", r.message.dispatch_address);
            // }

            // if (r.message.dispatch_address) {
            //     frm.set_value("supplier_address", r.message.dispatch_address);
            // }

            frappe.run_serially([
                () => {
                    if (r.message.company_address) {
                        return frm.set_value("billing_address", r.message.company_address);
                    }
                },
                () => {
                    if (r.message.shipping_address) {
                        return frm.set_value("shipping_address", r.message.shipping_address);
                    }
                },
                () => {
                    if (r.message.dispatch_address) {
                        return frm.set_value("dispatch_address", r.message.dispatch_address);
                    }
                },
                () => {
                    frm.refresh_fields([
                        "billing_address",
                        "shipping_address",
                        "dispatch_address"
                    ]);
                }
            ]);
        }
    });
}

function get_city_from_po_series(series) {
    series = series.trim();

    if (series.startsWith("PO/GZB/")) return "Ghaziabad";
    if (series.startsWith("PO/NOIDA/")) return "Noida";
    if (series.startsWith("PO/MFP/")) return "Muzaffarpur";

    return null;
}

frappe.ui.form.on("Purchase Order", {
    refresh(frm) {
        handle_po_series_change(frm);
    },
    naming_series(frm) {
        handle_po_series_change(frm);
    },
    supplier(frm) {
        handle_po_series_change(frm);
    }
});