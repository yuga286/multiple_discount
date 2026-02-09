


// --------------------------------------------------
// GLOBAL REQUEST LOCK (per row)
// --------------------------------------------------
let discount_request_token = {};

// --------------------------------------------------
// SALES ORDER ITEM
// --------------------------------------------------
frappe.ui.form.on("Sales Order Item", {

    item_code(frm, cdt, cdn) {
        set_secondary_uom(frm, cdt, cdn);
        fetch_pricing_discount(frm, cdt, cdn);
    },

    qty(frm, cdt, cdn) {
        recalc_secondary_uom(frm, cdt, cdn);
        fetch_pricing_discount(frm, cdt, cdn);
    },

    alternate_qty(frm, cdt, cdn) {
        reverse_qty_from_alternate(frm, cdt, cdn);
    },

    price_list_rate(frm, cdt, cdn) {
        fetch_pricing_discount(frm, cdt, cdn);
    },

    discount_1_(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    },

    discount_2(frm, cdt, cdn) {
        recalc_row(cdt, cdn);
    }
});


// --------------------------------------------------
// DELIVERY NOTE ITEM
// --------------------------------------------------
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


// --------------------------------------------------
// SALES INVOICE ITEM
// --------------------------------------------------
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


// --------------------------------------------------
// CORE CALCULATION
// --------------------------------------------------
function recalc_row(cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row) return;

    let qty = flt(row.qty);
    let pl_rate = flt(row.price_list_rate);
    if (!qty || !pl_rate) return;

    let d1_pct = flt(row.discount_1_);
    let d2_pct = flt(row.discount_2);

    let rate_after_d1 = pl_rate - (pl_rate * d1_pct / 100);
    let final_rate = rate_after_d1 - (rate_after_d1 * d2_pct / 100);

    let amount_after_d1 = rate_after_d1 * qty;
    let amount_after_d2 = final_rate * qty;

    let d1_amt = (pl_rate - rate_after_d1) * qty;
    let d2_amt = (rate_after_d1 - final_rate) * qty;

    frappe.model.set_value(cdt, cdn, "rate", final_rate);
    frappe.model.set_value(cdt, cdn, "basic_rate", final_rate);

    frappe.model.set_value(cdt, cdn, "custom_discount_amount_1", d1_amt);
    frappe.model.set_value(cdt, cdn, "amount_after_discount_1", amount_after_d1);

    frappe.model.set_value(cdt, cdn, "custom_discount_amount_2", d2_amt);
    frappe.model.set_value(cdt, cdn, "amount_after_discount_2", amount_after_d2);

    frappe.model.set_value(cdt, cdn, "discount_amount", d1_amt + d2_amt);

    refresh_row_fields(cdn);
}


// --------------------------------------------------
// GRID REFRESH
// --------------------------------------------------
function refresh_row_fields(cdn) {
    let grid = cur_frm.fields_dict.items?.grid;
    let row = grid?.grid_rows_by_docname?.[cdn];
    if (!row) return;

    [
        "discount_1_",
        "custom_discount_amount_1",
        "amount_after_discount_1",
        "custom_discount_amount_2",
        "amount_after_discount_2",
        "discount_amount",
        "alternate_qty"
    ].forEach(f => row.refresh_field(f));
}



// --------------------------------------------------
// PRICING DISCOUNT (ASYNC-SAFE)
// --------------------------------------------------
function fetch_pricing_discount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row || !row.item_code) return;

    let qty = flt(row.qty);
    let rate = flt(row.price_list_rate);
    if (!qty || !rate) return;

    let token = frappe.utils.get_random(10);
    discount_request_token[cdn] = token;

    frappe.call({
        method: "multiple_dis.api.get_base_price_discount",
        args: {
            item_code: row.item_code,
            price_list: frm.doc.selling_price_list,
            selling_price_list: frm.doc.selling_price_list,
            price_list_rate: rate,
            qty: qty,
            customer: frm.doc.customer,
            company: frm.doc.company
        },
        callback(r) {
            if (discount_request_token[cdn] !== token) return;

            let d1_pct = flt(r.message?.discount_percentage || 0);

            frappe.model.set_value(cdt, cdn, "discount_1_", d1_pct);

            frappe.after_ajax(() => {
                recalc_row(cdt, cdn);
            });
        }
    });
}
 



function recalc_secondary_uom(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row || !row.item_code) return;
    // console.log("Recalc Secondary UOM → Item:", row.item_code);
    let qty = cint(row.qty);
    if (!qty) {
        frappe.model.set_value(cdt, cdn, "alternate_qty", 0);
        return;
    }

    let cf = flt(row.alternate_uom_conversion_factor);
    if (!cf) return;
    console.log("Recalc Secondary UOM → CF:", cf);
    frappe.model.set_value(
        cdt,
        cdn,
        "alternate_qty",
        qty / cf
    );
}
function reverse_qty_from_alternate(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row) return;

    let alt_qty = flt(row.alternate_qty);
    let cf = flt(row.alternate_uom_conversion_factor);
    if (!alt_qty || !cf) return;

    let qty = Math.round(alt_qty * cf);
    // console.log("Reverse Qty from Alternate → Alt Qty:", alt_qty, "CF:", cf, "Qty:", qty);
    // IMPORTANT: only set qty
    // qty event will handle everything else
    frappe.model.set_value(cdt, cdn, "qty", alt_qty * cf);
}

function set_secondary_uom(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row || !row.item_code) return;

    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Item",
            name: row.item_code
        },
        callback(r) {
            // console.log("r value",r)
            // if (!r.message || !Array.isArray(r.message.uoms)) {
            //     clear_alternate_fields(cdt, cdn);
            //     return;
            // }

            let sec = r.message.uoms.find(u => u.secondary_uom === 1);
            // if (!sec) {
            //     clear_alternate_fields(cdt, cdn);
            //     return;
            // }
            // console.log("Secondary UOM:", sec);

            let cf = flt(sec.conversion_factor);
            let qty = flt(r.qty);
            // console.log("Set Secondary UOM → CF:", cf, "Qty:", 1/cf);

            frappe.model.set_value(cdt, cdn, "alternate_uom", sec.uom);
            frappe.model.set_value(cdt, cdn, "alternate_uom_conversion_factor", cf);

            // IMPORTANT: qty may not exist yet
            frappe.model.set_value(cdt, cdn, "alternate_qty", 1/cf);
        }
    });
}


function recalc_secondary_uom(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row || !row.item_code) return;

    let qty = flt(row.qty);
    if (!qty) {
        frappe.model.set_value(cdt, cdn, "alternate_qty", 0);
        return;
    }

    let cf = flt(row.alternate_uom_conversion_factor);
    if (!cf) return;
    // console.log("Recalc Secondary UOM → Qty:", qty, "CF:", cf);
    frappe.model.set_value(
        cdt,
        cdn,
        "alternate_qty",
        qty / cf
    );
}



// frappe.ui.form.on("Sales Order", {
//     naming_series(frm) {
//         if (!frm.doc.naming_series || !frm.doc.company) return;

//         frappe.call({
//             method: "multiple_dis.api.get_address_by_series",
//             args: {
//                 naming_series: frm.doc.naming_series,
//                 company: frm.doc.company
//             },
//             callback(r) {
//                 if (!r.message) return;

//                 frm.set_value("dispatch_address_name", r.message.dispatch_address);
//                 frm.set_value("company_address", r.message.company_address);
//             }
//         });
//     }
// });

// frappe.ui.form.on("Sales Order", {
//     naming_series(frm) {
//         if (!frm.doc.naming_series || !frm.doc.company) return;

//         const series_city_map = {
//             "SO/G/FY/.#####": "Ghaziabad",
//             "SO/N/FY/.#####": "Noida",
//             "SO/M/FY/.#####": "Muzaffarpur"
//         };

//         let city = series_city_map[frm.doc.naming_series];
//         if (!city) return;

//         frappe.call({
//             method: "multiple_dis.api.get_company_addresses_by_city",
//             args: {
//                 city: city,
//                 company: frm.doc.company
//             },
//             callback(r) {
//                 console.log("API response:", r.message);

//                 if (!r.message) return;

//                 frm.set_value("dispatch_address_name", r.message.dispatch_address);
//                 frm.set_value("company_address", r.message.company_address);
//             }
//         });
//         console.log("Naming Series changed to:", frm.doc.naming_series, "City:", city);
//         console.log("Dispatch Address:", frm.doc.dispatch_address_name, "Company Address:", frm.doc.company_address);
//     }
// });


frappe.ui.form.on("Sales Order", {

    refresh(frm) {
        handle_series_change(frm);
    },

    naming_series(frm) {
        handle_series_change(frm);
    },

    onload_post_render(frm) {
        handle_series_change(frm);
    }
});


function handle_series_change(frm) {
    if (!frm.doc.naming_series || !frm.doc.company) return;
    console.log("Handling series change → Naming Series:", frm.doc.naming_series, "Company:", frm.doc.company);
    const series_city_map = {
        "SO/G/FY/.#####": "Ghaziabad",
        "SO/N/FY/.#####": "Noida",
        "SO/M/FY/.#####": "Muzaffarpur"
    };
    console.log("Series to City Map:", series_city_map);
    let city = series_city_map[frm.doc.naming_series];
    if (!city) return;

    frappe.call({
        method: "multiple_dis.api.get_company_addresses_by_city",
        args: {
            city: city,
            company: frm.doc.company
        },
        callback(r) {
            console.log("API response:", r.message);
            if (!r.message) return;

            frm.set_value("dispatch_address_name", r.message.dispatch_address);
            frm.set_value("company_address", r.message.company_address);
        }
    });
}

