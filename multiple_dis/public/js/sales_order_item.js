// // ======================================================
// // GLOBAL REQUEST LOCK
// // ======================================================
// let discount_request_token = {};
// let discount_timer;

// // console.log("Script Loaded");


// // ======================================================
// // SALES ORDER ITEM
// // ======================================================
// frappe.ui.form.on("Sales Order Item", {

//     item_code(frm, cdt, cdn) {
//         set_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         // fetch_mrp(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         recalc_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     },

//     alternate_qty(frm, cdt, cdn) {
//         reverse_qty_from_alternate(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     },

//     discount_1_(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });


// // ======================================================
// // DELIVERY NOTE ITEM
// // ======================================================
// frappe.ui.form.on("Delivery Note Item", {

//     item_code(frm, cdt, cdn) {
//         set_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         // fetch_mrp(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         recalc_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     },

//     alternate_qty(frm, cdt, cdn) {
//         reverse_qty_from_alternate(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     },

//     discount_1_(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });


// // ======================================================
// // SALES INVOICE ITEM
// // ======================================================
// frappe.ui.form.on("Sales Invoice Item", {

//     item_code(frm, cdt, cdn) {
//         set_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         // fetch_mrp(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         recalc_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     },

//     alternate_qty(frm, cdt, cdn) {
//         reverse_qty_from_alternate(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     },

//     discount_1_(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });

// function reverse_qty_from_alternate(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row) return;

//     let alt_qty = flt(row.alternate_qty);
//     let cf = flt(row.alternate_uom_conversion_factor);
//     if (!alt_qty || !cf) return;

//     let qty = Math.round(alt_qty * cf);
    
//     // qty event will handle everything else
//     frappe.model.set_value(cdt, cdn, "qty", qty);
// }



// function recalc_secondary_uom(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row || !row.item_code) return;

//     let qty = flt(row.qty);
//     if (!qty) {
//         frappe.model.set_value(cdt, cdn, "alternate_qty", 0);
//         return;
//     }

//     let cf = flt(row.alternate_uom_conversion_factor);
//     if (!cf) return;
//     console.log("Recalc Secondary UOM → Qty:", qty, "CF:", cf);
//     frappe.model.set_value(
//         cdt,
//         cdn,
//         "alternate_qty",
//         qty / cf
//     );
// }

// // // // mrp auto filling


// frappe.ui.form.on("Sales Order Item", {
//     item_code: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         if (!row.item_code) return;

//         frappe.db.get_list("Item Price", {
//             filters: {
//                 item_code: row.item_code
//             },
//             fields: ["name", "price_list", "custom_mrp"],
//         }).then(res => {

//             //  Take first record OR filter by MRP
//             let mrp_row = res.find(d => d.price_list === "MRP") || res[0];

//             frappe.model.set_value(cdt, cdn, "custom_mrp", mrp_row.custom_mrp || 0);

        

//         }).catch(err => {
//             console.error("Error:", err);
//         });
//     }
// });


// frappe.ui.form.on("Delivery Note Item", {
//     item_code: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         if (!row.item_code) return;

//         frappe.db.get_list("Item Price", {
//             filters: {
//                 item_code: row.item_code
//             },
//             fields: ["name", "price_list", "custom_mrp"],
//         }).then(res => {

//             //  Take first record OR filter by MRP
//             let mrp_row = res.find(d => d.price_list === "MRP") || res[0];

//             frappe.model.set_value(cdt, cdn, "custom_mrp", mrp_row.custom_mrp || 0);

        

//         }).catch(err => {
//             console.error("Error:", err);
//         });
//     }
// });


// frappe.ui.form.on("Sales Invoice Item", {
//     item_code: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         if (!row.item_code) return;

//         frappe.db.get_list("Item Price", {
//             filters: {
//                 item_code: row.item_code
//             },
//             fields: ["name", "price_list", "custom_mrp"],
//         }).then(res => {

//             //  Take first record OR filter by MRP
//             let mrp_row = res.find(d => d.price_list === "MRP") || res[0];

//             frappe.model.set_value(cdt, cdn, "custom_mrp", mrp_row.custom_mrp || 0);

        

//         }).catch(err => {
//             console.error("Error:", err);
//         });
//     }
// });








// // // ======================================================
// // // COMMON EVENTS (ALL ITEM DOCTYPES)
// // // ======================================================


// // // ======================================================
// // // CORE CALCULATION
// // // ======================================================
// function recalc_row(cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row) return;

//     let qty = flt(row.qty);
//     let pl_rate = flt(row.price_list_rate);

//     if (!qty || !pl_rate) return;

//     let d1 = flt(row.discount_1_);
//     let d2 = flt(row.discount_2);

//     let rate_after_d1 = pl_rate - (pl_rate * d1 / 100);
//     let final_rate = rate_after_d1 - (rate_after_d1 * d2 / 100);

//     let amount_after_d1 = rate_after_d1 * qty;
//     let amount_after_d2 = final_rate * qty;

//     let d1_amt = (pl_rate - rate_after_d1) * qty;
//     let d2_amt = (rate_after_d1 - final_rate) * qty;
//     let d_amt = d1 + d2;

//     frappe.model.set_value(cdt, cdn, "rate", final_rate);
//     frappe.model.set_value(cdt, cdn, "basic_rate", final_rate);
//     frappe.model.set_value(cdt, cdn, "discount_amount", d_amt);


//     frappe.model.set_value(cdt, cdn, "custom_discount_amount_1", d1_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_1", amount_after_d1);

//     frappe.model.set_value(cdt, cdn, "custom_discount_amount_2", d2_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_2", amount_after_d2);
// }


// // ======================================================
// // PRICING DISCOUNT (SAFE + DEBOUNCE)
// // ======================================================
// function fetch_pricing_discount(frm, cdt, cdn) {

//     clearTimeout(discount_timer);

//     discount_timer = setTimeout(() => {

//         let row = locals[cdt][cdn];
//         if (!row || !row.item_code) return;

//         let token = frappe.utils.get_random(10);
//         discount_request_token[cdn] = token;

//         frappe.call({
//             method: "multiple_dis.api.get_base_price_discount",
//             args: {
//                 item_code: row.item_code,
//                 price_list: frm.doc.selling_price_list,
//                 selling_price_list: frm.doc.selling_price_list,
//                 price_list_rate: flt(row.price_list_rate),
//                 qty: flt(row.qty),
//                 customer: frm.doc.customer,
//                 company: frm.doc.company
//             },
//             callback(r) {
//                 console.log("Pricing Discount Response:", r.message);

//                 if (discount_request_token[cdn] !== token) return;

//                 let d1 = flt(r.message?.discount_percentage || 0);

//                 frappe.model.set_value(cdt, cdn, "discount_1_", d1);

//                 frappe.after_ajax(() => {
//                     recalc_row(cdt, cdn);
//                 });
//             }
//         });

//     }, 300);
// }



// function set_secondary_uom(frm, cdt, cdn) {

//     let row = locals[cdt][cdn];
//     if (!row || !row.item_code) return;

//     frappe.call({
//         method: "multiple_dis.api.get_secondary_uom",
//         args: {
//             item_code: row.item_code
//         },
//         callback(r) {

//             if (!r.message) {
//                 console.log("No secondary UOM found");
//                 return;
//             }

//             let uom = r.message.uom;
//             let cf = flt(r.message.conversion_factor);

//             if (!uom || !cf) return;

//             frappe.model.set_value(cdt, cdn, "alternate_uom", uom);
//             frappe.model.set_value(cdt, cdn, "alternate_uom_conversion_factor", cf);

//             let qty = flt(row.qty) || 1;
//             frappe.model.set_value(cdt, cdn, "alternate_qty", qty / cf);

//             console.log("Secondary UOM SET:", uom, cf);
//         }
//     });
// }

// // // ======================================================
// // // ADDRESS AUTO SET
// // // ======================================================
// frappe.ui.form.on("Sales Order", {

//     refresh(frm) {
//         handle_series_change(frm);
//     },

//     naming_series(frm) {
//         handle_series_change(frm);
//     },

//     customer(frm) {
//         handle_series_change(frm);
//     }
// });


// function handle_series_change(frm) {

//     if (!frm.doc.naming_series || !frm.doc.company) return;

//     let city = get_city_from_series(frm.doc.naming_series);
//     if (!city) return;

//     frappe.call({
//         method: "multiple_dis.api.get_addresses_for_sales_order",
//         args: {
//             city: city,
//             company: frm.doc.company,
//             customer: frm.doc.customer || null
//         },
//         callback(r) {

//             if (!r.message) return;

//             if (r.message.dispatch_address) {
//                 frm.set_value("dispatch_address_name", r.message.dispatch_address);
//                 frm.set_value("company_address", r.message.company_address);
//             }
//         }
//     });
// }


// function get_city_from_series(series) {

//     series = series.trim();

//     if (series.startsWith("SO/G/")) return "Ghaziabad";
//     if (series.startsWith("SO/N/")) return "Noida";
//     if (series.startsWith("SO/M/")) return "Muzaffarpur";

//     return null;
// }



// second



// ======================================================
// GLOBAL STATE
// ======================================================
let item_detail_timers = {};
let item_detail_tokens = {};
let qty_discount_timers = {};
let qty_discount_tokens = {};


// ======================================================
// CHILD TABLE EVENTS — Sales Order, Delivery Note, Invoice
// ======================================================
["Sales Order Item", "Delivery Note Item", "Sales Invoice Item"].forEach(doctype => {
    frappe.ui.form.on(doctype, {

        // When item is selected → fetch everything in ONE api call
        item_code(frm, cdt, cdn) {
            let row = locals[cdt][cdn];
            if (!row || !row.item_code) return;
            fetch_item_details(frm, cdt, cdn);
        },

        // When qty changes → recalc UOM + re-fetch discount + recalc row
        qty(frm, cdt, cdn) {
            recalc_secondary_uom(frm, cdt, cdn);
            fetch_pricing_discount_only(frm, cdt, cdn);
            recalc_row(cdt, cdn);
        },

        // When alternate qty changes → reverse calculate main qty
        alternate_qty(frm, cdt, cdn) {
            reverse_qty_from_alternate(frm, cdt, cdn);
        },

        // When price list rate changes → only local recalc, no API
        price_list_rate(frm, cdt, cdn) {
            recalc_row(cdt, cdn);
        },

        // Discount fields → only local recalc
        discount_1_(frm, cdt, cdn) {
            recalc_row(cdt, cdn);
        },

        discount_2(frm, cdt, cdn) {
            recalc_row(cdt, cdn);
        }
    });
});


// ======================================================
// SALES ORDER FORM EVENTS
// ======================================================
frappe.ui.form.on("Sales Order", {

    refresh(frm) {
        handle_series_change(frm);
    },

    naming_series(frm) {
        handle_series_change(frm);
    },

    customer(frm) {
        handle_series_change(frm);
    }
});


// ======================================================
// FETCH EVERYTHING IN ONE CALL (item_code trigger)
// Calls: multiple_dis.api.get_item_details
// Returns: discount + secondary UOM + MRP
// ======================================================
function fetch_item_details(frm, cdt, cdn) {
    clearTimeout(item_detail_timers[cdn]);

    item_detail_timers[cdn] = setTimeout(() => {
        let row = locals[cdt][cdn];
        if (!row || !row.item_code) return;

        // Token prevents stale responses overwriting fresh ones
        let token = frappe.utils.get_random(10);
        item_detail_tokens[cdn] = token;

        frappe.call({
            method: "multiple_dis.api.get_item_details",
            args: {
                item_code: row.item_code,
                selling_price_list: frm.doc.selling_price_list,
                company: frm.doc.company
            },
            callback(r) {
                // Ignore if a newer request already came in
                if (item_detail_tokens[cdn] !== token) return;
                if (!r.message) return;

                let { discount_percentage, uom, conversion_factor, mrp } = r.message;

                // Set MRP
                if (mrp !== undefined) {
                    frappe.model.set_value(cdt, cdn, "custom_mrp", mrp);
                }

                // Set Secondary UOM
                if (uom && conversion_factor) {
                    frappe.model.set_value(cdt, cdn, "alternate_uom", uom);
                    frappe.model.set_value(cdt, cdn, "alternate_uom_conversion_factor", flt(conversion_factor));
                    let qty = flt(row.qty) || 1;
                    frappe.model.set_value(cdt, cdn, "alternate_qty", qty / flt(conversion_factor));
                }

                // Set Discount → then recalculate row
                frappe.model.set_value(cdt, cdn, "discount_1_", flt(discount_percentage || 0));
                frappe.after_ajax(() => recalc_row(cdt, cdn));
            }
        });

    }, 300); // 300ms debounce
}


// ======================================================
// FETCH DISCOUNT ONLY (qty change trigger)
// Calls: multiple_dis.api.get_base_price_discount
// ======================================================
function fetch_pricing_discount_only(frm, cdt, cdn) {
    clearTimeout(qty_discount_timers[cdn]);

    qty_discount_timers[cdn] = setTimeout(() => {
        let row = locals[cdt][cdn];
        if (!row || !row.item_code) return;

        let token = frappe.utils.get_random(10);
        qty_discount_tokens[cdn] = token;

        frappe.call({
            method: "multiple_dis.api.get_base_price_discount",
            args: {
                item_code: row.item_code,
                selling_price_list: frm.doc.selling_price_list,
                company: frm.doc.company
            },
            callback(r) {
                if (qty_discount_tokens[cdn] !== token) return;
                if (!r.message) return;

                frappe.model.set_value(
                    cdt, cdn,
                    "discount_1_",
                    flt(r.message.discount_percentage || 0)
                );
                frappe.after_ajax(() => recalc_row(cdt, cdn));
            }
        });

    }, 300);
}


// ======================================================
// LOCAL RECALCULATION (no API call)
// Calculates rate, amount after discounts
// ======================================================
function recalc_row(cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row) return;

    let qty     = flt(row.qty);
    let pl_rate = flt(row.price_list_rate);
    if (!qty || !pl_rate) return;

    let d1 = flt(row.discount_1_);
    let d2 = flt(row.discount_2);

    let rate_after_d1 = pl_rate - (pl_rate * d1 / 100);
    let final_rate    = rate_after_d1 - (rate_after_d1 * d2 / 100);

    let d1_amt = (pl_rate - rate_after_d1) * qty;
    let d2_amt = (rate_after_d1 - final_rate) * qty;

    // Write non-trigger fields directly to locals (no re-render)
    row.discount_amount          = d1 + d2;
    row.custom_discount_amount_1 = d1_amt;
    row.amount_after_discount_1  = rate_after_d1 * qty;
    row.custom_discount_amount_2 = d2_amt;
    row.amount_after_discount_2  = final_rate * qty;
    row.basic_rate               = final_rate;

    // Only set_value for 'rate' — triggers Frappe's amount recalc
    frappe.model.set_value(cdt, cdn, "rate", final_rate);
}


// ======================================================
// SECONDARY UOM HELPERS
// ======================================================
function recalc_secondary_uom(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row || !row.item_code) return;

    let qty = flt(row.qty);
    let cf  = flt(row.alternate_uom_conversion_factor);
    if (!cf) return;

    frappe.model.set_value(
        cdt, cdn,
        "alternate_qty",
        qty ? qty / cf : 0
    );
}

function reverse_qty_from_alternate(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row) return;

    let alt_qty = flt(row.alternate_qty);
    let cf      = flt(row.alternate_uom_conversion_factor);
    if (!alt_qty || !cf) return;

    // Setting qty will trigger qty event which handles everything else
    frappe.model.set_value(cdt, cdn, "qty", Math.round(alt_qty * cf));
}


// ======================================================
// ADDRESS AUTO SET
// Calls: multiple_dis.api.get_addresses_for_sales_order
// ======================================================
function handle_series_change(frm) {
    if (!frm.doc.naming_series || !frm.doc.company) return;

    let city = get_city_from_series(frm.doc.naming_series);
    if (!city) return;

    frappe.call({
        method: "multiple_dis.api.get_addresses_for_sales_order",
        args: {
            city: city,
            company: frm.doc.company,
            customer: frm.doc.customer || null
        },
        callback(r) {
            if (!r.message) return;
            if (r.message.dispatch_address) {
                frm.set_value("dispatch_address_name", r.message.dispatch_address);
                frm.set_value("company_address", r.message.company_address);
            }
        }
    });
}

function get_city_from_series(series) {
    series = series.trim();
    if (series.startsWith("SO/G/")) return "Ghaziabad";
    if (series.startsWith("SO/N/")) return "Noida";
    if (series.startsWith("SO/M/")) return "Muzaffarpur";
    return null;
}