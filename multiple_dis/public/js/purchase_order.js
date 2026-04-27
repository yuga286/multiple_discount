
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




frappe.ui.form.on('Purchase Invoice', {
    refresh(frm) {
        if (frm.doc.items && frm.doc.items.length > 0) {
            let pr = frm.doc.items[0].purchase_receipt;

            if (pr && (!frm.doc.bill_no || !frm.doc.bill_date)) {
                frappe.db.get_value('Purchase Receipt', pr, [
                    'supplier_delivery_note',
                    'posting_date'
                ]).then(r => {

                    if (r.message) {

                        // bill_no mapping
                        if (!frm.doc.bill_no && r.message.supplier_delivery_note) {
                            frm.set_value('bill_no', r.message.supplier_delivery_note);
                        }

                        // bill_date mapping
                        if (!frm.doc.bill_date && r.message.posting_date) {
                            frm.set_value('bill_date', r.message.posting_date);
                        }

                    }
                });
            }
        }
    }
});



// frappe.ui.form.on('Delivery Note', {
    
//     refresh: function(frm) {
//         // console.log("start");
//         if (frm.doc.custom_sale_order_type === "Bill of Supply") {
//             frm.set_value("custom_gst_treatment", "Exempted");
//         }
//     },

//     custom_sale_order_type: function(frm) {
//         if (frm.doc.custom_sale_order_type === "Bill of Supply") {
//             frm.set_value("custom_gst_treatment", "Exempted");
//         }
//     }
// });



frappe.ui.form.on('Delivery Note', {
    refresh: function(frm) {
        set_gst(frm);
    },

    onload: function(frm) {
        set_gst(frm);
    },

    custom_sale_order_type: function(frm) {
        set_gst(frm);
    }
});

function set_gst(frm) {
    if (frm.doc.custom_sale_order_type === "Bill of Supply") {
        frm.set_value("custom_gst_treatment", "Exempted");
    }
}