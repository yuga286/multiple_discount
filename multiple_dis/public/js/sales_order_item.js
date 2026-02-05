// frappe.ui.form.on("Sales Order Item", {

//     item_code(frm, cdt, cdn) {
//         set_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         //  BOTH must happen
//         recalc_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     alternate_qty(frm, cdt, cdn) {
//         reverse_qty_from_alternate(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     discount_1_(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });


// frappe.ui.form.on("Delivery Note Item", {

//     item_code(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_1_(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });


// frappe.ui.form.on("Sales Invoice Item", {

//     item_code(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_1_(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });

// function recalc_row(cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row) return;

//     let qty = flt(row.qty);
//     let pl_rate = flt(row.price_list_rate);
//     if (!qty || !pl_rate) return;

//     let d1_pct = flt(row.discount_1_);
//     let d2_pct = flt(row.discount_2);

//     let rate_after_d1 = pl_rate - (pl_rate * d1_pct / 100);
//     let final_rate = rate_after_d1 - (rate_after_d1 * d2_pct / 100);

//     let amount_after_d1 = rate_after_d1 * qty;
//     let amount_after_d2 = final_rate * qty;

//     let d1_amt = (pl_rate - rate_after_d1) * qty;
//     let d2_amt = (rate_after_d1 - final_rate) * qty;

//     frappe.model.set_value(cdt, cdn, "rate", final_rate);
//     frappe.model.set_value(cdt, cdn, "basic_rate", final_rate);
//     frappe.model.set_value(cdt, cdn, "discount_1_", d1_pct);
//     frappe.model.set_value(cdt, cdn, "custom_discount_amount_1", d1_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_1", amount_after_d1);

//     frappe.model.set_value(cdt, cdn, "custom_discount_amount_2", d2_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_2", amount_after_d2);

//     frappe.model.set_value(cdt, cdn, "discount_amount", d1_amt + d2_amt);

//     force_grid_refresh(cdn);
// }

// function force_grid_refresh(cdn) {
//     let grid = cur_frm.fields_dict.items.grid;
//     let row = grid.grid_rows_by_docname[cdn];
//     if (!row) return;

//     [
//         "discount_1_",
//         "custom_discount_amount_1",
//         "amount_after_discount_1",
//         "custom_discount_amount_2",
//         "amount_after_discount_2",
//         "discount_amount",
//         "alternate_qty"
//     ].forEach(f => row.refresh_field(f));
// }

// function set_secondary_uom(frm, cdt, cdn) {
//     setTimeout(() => {
//         let row = locals[cdt][cdn];
//         if (!row || !row.item_code) return;

//         frappe.call({
//             method: "frappe.client.get",
//             args: {
//                 doctype: "Item",
//                 name: row.item_code
//             },
//             callback(r) {
//                 if (!r.message || !Array.isArray(r.message.uoms)) {
//                     clear_alternate_fields(cdt, cdn);
//                     return;
//                 }

//                 let sec = r.message.uoms.find(u => u.secondary_uom === 1);
//                 if (!sec) {
//                     clear_alternate_fields(cdt, cdn);
//                     return;
//                 }

//                 let qty = flt(row.qty);
//                 let cf  = flt(sec.conversion_factor);

//                 frappe.model.set_value(cdt, cdn, "alternate_uom", sec.uom);
//                 frappe.model.set_value(cdt, cdn, "alternate_uom_conversion_factor", cf);
//                 frappe.model.set_value(
//                     cdt,
//                     cdn,
//                     "alternate_qty",
//                     qty ? qty / cf : 0
//                 );

//                 console.log("RECALC → Qty:", qty, "CF:", cf);
//             }
//         });
//     }, 200); //  critical
// }

// function recalc_secondary_uom(frm, cdt, cdn) {
//     // wait until grid commits qty
//     setTimeout(() => {
//         let row = locals[cdt][cdn];
//         if (!row || !row.item_code) return;

//         let qty = cint(row.qty);
//         if (!qty) {
//             frappe.model.set_value(cdt, cdn, "alternate_qty", 0);
//             return;
//         }

//         // ERPNext already has this from Item master
//         let cf = flt(row.alternate_uom_conversion_factor);
//         if (!cf) return;

//         let alt_qty = qty / cf;

//         frappe.model.set_value(
//             cdt,
//             cdn,
//             "alternate_qty",
//             alt_qty
//         );

//         console.log("UPDATED → Qty:", qty, "CF:", cf, "Alt Qty:", alt_qty);
//     }, 200); // <-- THIS is the key
// }


// function fetch_pricing_discount(frm, cdt, cdn) {
//     setTimeout(() => {
//         let row = locals[cdt][cdn];
//         if (!row || !row.item_code) return;

//         let qty = flt(row.qty);
//         let rate = flt(row.price_list_rate);
//         if (!qty || !rate) return;

//         frappe.call({
//             method: "multiple_uom.api.get_base_price_discount",
//             args: {
//                 item_code: row.item_code,
//                 price_list: frm.doc.selling_price_list,
//                 selling_price_list: frm.doc.selling_price_list,
//                 price_list_rate: rate,
//                 qty: qty,
//                 customer: frm.doc.customer,
//                 company: frm.doc.company
//             },
//             callback(r) {
//                 // console.log("Pricing Response:", r);
//                 let d1_pct = flt(r.message?.discount_percentage || 0);
//                 frappe.model.set_value(cdt, cdn, "discount_1_", d1_pct);

//                 recalc_row(cdt, cdn);
//             }
//         });
//     }, 200); //  critical
// }

// function reverse_qty_from_alternate(frm, cdt, cdn) {
//     setTimeout(() => {
//         let row = locals[cdt][cdn];
//         if (!row) return;

//         let alt_qty = flt(row.alternate_qty);
//         let cf = flt(row.alternate_uom_conversion_factor);
//         if (!alt_qty || !cf) return;

//         // let qty = alt_qty * cf;
//         let qty = Math.round(alt_qty * cf);
//         frappe.model.set_value(cdt, cdn, "qty", qty);

//         // trigger full recalculation
//         run_full_recalc(frm, cdt, cdn);
//     }, 200);
// }

// function run_full_recalc(frm, cdt, cdn) {
//     setTimeout(() => {
//         recalc_secondary_uom(frm, cdt, cdn);
//         fetch_pricing_discount(frm, cdt, cdn);
//         recalc_row(cdt, cdn);
//     }, 200);
// }



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
// SECONDARY UOM HANDLING
// --------------------------------------------------
// function set_secondary_uom(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row || !row.item_code) return;

//     frappe.call({
//         method: "frappe.client.get",
//         args: {
//             doctype: "Item",
//             name: row.item_code
//         },
//         callback(r) {
//             if (!r.message?.uoms) {
//                 clear_alternate_fields(cdt, cdn);
//                 return;
//             }

//             let sec = r.message.uoms.find(u => u.secondary_uom === 1);
//             if (!sec) {
//                 clear_alternate_fields(cdt, cdn);
//                 return;
//             }

//             let qty = flt(row.qty);
//             let cf = flt(sec.conversion_factor);

//             frappe.model.set_value(cdt, cdn, "alternate_uom", sec.uom);
//             frappe.model.set_value(cdt, cdn, "alternate_uom_conversion_factor", cf);
//             frappe.model.set_value(cdt, cdn, "alternate_qty", qty ? qty / cf : 0);
//         }
//     });
// }


// function recalc_secondary_uom(frm, cdt, cdn) {
//     setTimeout(() => {
//         let row = locals[cdt][cdn];
//         if (!row) return;

//         let qty = flt(row.qty);
//         let cf = flt(row.alternate_uom_conversion_factor);
//         if (!qty || !cf) return;

//         frappe.model.set_value(cdt, cdn, "alternate_qty", qty / cf);
//     }, 100);
// }


// function reverse_qty_from_alternate(frm, cdt, cdn) {
//     setTimeout(() => {
//         let row = locals[cdt][cdn];
//         if (!row) return;

//         let alt_qty = flt(row.alternate_qty);
//         let cf = flt(row.alternate_uom_conversion_factor);
//         if (!alt_qty || !cf) return;

//         frappe.model.set_value(cdt, cdn, "qty", alt_qty * cf);
//         recalc_row(cdt, cdn);
//     }, 100);
// }


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

    let qty = cint(row.qty);
    if (!qty) {
        frappe.model.set_value(cdt, cdn, "alternate_qty", 0);
        return;
    }

    let cf = flt(row.alternate_uom_conversion_factor);
    if (!cf) return;

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

    // IMPORTANT: only set qty
    // qty event will handle everything else
    frappe.model.set_value(cdt, cdn, "qty", qty);
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
            if (!r.message || !Array.isArray(r.message.uoms)) {
                clear_alternate_fields(cdt, cdn);
                return;
            }

            let sec = r.message.uoms.find(u => u.secondary_uom === 1);
            if (!sec) {
                clear_alternate_fields(cdt, cdn);
                return;
            }

            let cf = flt(sec.conversion_factor);
            let qty = flt(r.qty);
            console.log("Set Secondary UOM → CF:", cf, "Qty:", qty);

            frappe.model.set_value(cdt, cdn, "alternate_uom", sec.uom);
            frappe.model.set_value(cdt, cdn, "alternate_uom_conversion_factor", cf);

            // IMPORTANT: qty may not exist yet
            frappe.model.set_value(cdt, cdn, "alternate_qty", qty);
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
    console.log("Recalc Secondary UOM → Qty:", qty, "CF:", cf);
    frappe.model.set_value(
        cdt,
        cdn,
        "alternate_qty",
        qty / cf
    );
}
