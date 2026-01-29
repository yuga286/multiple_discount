// demo

// function recalc_discounts_from_price_list_rate(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let base_amount = flt(row.price_list_rate) * flt(row.qty);

//     // Discount 1 (from pricing rule)
//     let d1_pct = flt(row.discount_1);
//     let d1_amt = (base_amount * d1_pct) / 100;
//     let amt_after_d1 = base_amount - d1_amt;

//     // Discount 2 (manual, STILL on price_list_rate)
//     let d2_pct = flt(row.discount_2);
//     let d2_amt = (base_amount * d2_pct) / 100;
//     let amt_after_d2 = amt_after_d1 - d2_amt;
//     let rate_after_discount_1 =
//         amount_after_discount_1 / qty;

//     frappe.model.set_value(cdt, cdn, "discount_amount_1", d1_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_1", amt_after_d1);
//     // frappe.model.set_value(cdt, cdn, "rate", amt_after_d1);
//     // frappe.model.set_value(cdt, cdn, "base_rate", rate_after_discount_1);
//     frappe.msgprint("recalc from price list rate:", amt_after_d1);
  
// }


// frappe.ui.form.on("Sales Order Item", {
//     rate: recalc_discounts,
//     qty: recalc_discounts,
//     discount_1: recalc_discounts,
//     discount_2: recalc_discounts
// });

// function recalc_discounts(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let rate = flt(row.rate);
//     let qty = flt(row.qty);
//     let base_amount = rate * qty;

//     // Discount 1 (on amount)
//     let d1_pct = flt(row.discount_1);
//     let d1_amt = (base_amount * d1_pct) / 100;
//     let amt_after_d1 = base_amount - d1_amt;

//     // Discount 2 (STRICTLY on RATE × QTY)
//     let d2_pct = flt(row.discount_2);
//     let d2_amt = (base_amount * d2_pct) / 100;
//     let amt_after_d2 = amt_after_d1 - d2_amt;
//     let rate_after_discount_1 =
//         amount_after_discount_1 / qty;

//     frappe.model.set_value(cdt, cdn, "discount_amount_1", d1_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_1", amt_after_d1);

//     frappe.model.set_value(cdt, cdn, "discount_amount_2", d2_amt);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_2", amt_after_d2);

//     // frappe.model.set_value(cdt, cdn, "rate", amt_after_d1);
//     // frappe.model.set_value(cdt, cdn, "base_rate", rate_after_discount_1);
// }




// frappe.ui.form.on("Sales Order Item", {
//     item_code: fetch_base_discount,
//     price_list_rate: fetch_base_discount,
//     qty: fetch_base_discount
// });

// function fetch_base_discount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     if (!row.item_code || !row.price_list_rate || !row.qty) return;

//     frappe.call({
//         method: "multiple_uom.api.get_base_price_discount",
//         args: {
//             item_code: row.item_code,
//             price_list: frm.doc.selling_price_list,
//             price_list_rate: row.price_list_rate,
//             qty: row.qty,
//             customer: frm.doc.customer,
//             company: frm.doc.company
//         },
//         callback(r) {
//             console.log(r.message);
//             let d_pct = flt(r.message.discount_percentage);

//             frappe.model.set_value(cdt, cdn, "discount_1", d_pct);

//             apply_discount_1(frm, cdt, cdn);
//             calculate_discount_1(frm, cdt, cdn);
//         }
//     });
// }


// function calculate_discount_1(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let base_amount =
//         flt(row.price_list_rate) * flt(row.qty);

//     let discount_amount_1 =
//         (base_amount * flt(row.discount_1)) / 100;

//     // let amount_after_discount =
//     //     base_amount - discount_amount_1;
    
//     // let rate_after_discount_1 =
//     //     amount_after_discount_1 / qty;

//     frappe.model.set_value(cdt, cdn, "discount_amount_1", discount_amount_1);
//     // frappe.model.set_value(cdt, cdn, "rate", amount_after_discount);
//     // frappe.model.set_value(cdt, cdn, "base_rate", rate_after_discount_1);

//     //  final value 
//     frappe.model.set_value(
//         cdt,
//         cdn,
//         "amount_after_discount_2",
//         amount_after_discount_1,
//         amount_after_discount_1 / flt(row.qty),
//         rate
//     );
// }



// frappe.ui.form.on("Sales Order Item", {
//     item_code: fetch_pricing_rule_discount,
//     price_list_rate: fetch_pricing_rule_discount,
//     qty: fetch_pricing_rule_discount
// });


// function apply_discount_1(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let base_amount =
//         flt(row.price_list_rate) * flt(row.qty);

//     let discount_amount_1 =
//         (base_amount * flt(row.discount_1)) / 100;

//     let amount_after_discount_1 =
//         base_amount - discount_amount_1;
    
//     let rate_after_discount_1 =
//         amount_after_discount_1 / qty;

//     frappe.model.set_value(cdt, cdn, "discount_amount_1", discount_amount_1);
//     frappe.model.set_value(cdt, cdn, "amount_after_discount_1", amount_after_discount_1);
//     frappe.model.set_value(cdt, cdn, "rate", amount_after_discount_1);
//     frappe.model.set_value(cdt, cdn, "base_rate", rate_after_discount_1);
//     frappe.msgprint("apply discount 1:", amount_after_discount_1);
// }


// function fetch_pricing_rule_discount(frm, cdt, cdn) {

//     let row = locals[cdt][cdn];

//     if (!row.item_code) return;


//     frappe.call({
//         method: "multiple_uom.api.get_base_price_discount",
//         args: {
//             item_code: row.item_code,
//             price_list: frm.doc.selling_price_list,
//             price_list_rate: row.price_list_rate,
//             qty: row.qty,
//             customer: frm.doc.customer,
//             company: frm.doc.company
//         },
//         callback(r) {

//             let pricing_discount = flt(r.message?.discount_percentage || 0);

//             frappe.model.set_value(cdt, cdn, "discount_1", pricing_discount);
//             apply_discount_1(frm, cdt, cdn);
//         }
//     });
// }

// working code

// function recalc_row(cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let qty = flt(row.qty);
//     if (!qty) return;

//     let base_amount = flt(row.price_list_rate) * qty;

//     // Discount 1 (Pricing Rule)
//     let d1_pct = flt(row.discount_1);
//     let d1_amt = base_amount * d1_pct / 100;
//     let amt_after_d1 = base_amount - d1_amt;

//     // Discount 2 (Manual – still on base)
//     let d2_pct = flt(row.discount_2);
//     let d2_amt = base_amount * d2_pct / 100;
//     let amt_after_d2 = amt_after_d1 - d2_amt;

//     let rate_after_d1 = amt_after_d1 / qty;

//     frappe.model.set_value(cdt, cdn, {
//         discount_amount_1: d1_amt,
//         amount_after_discount_1: amt_after_d1,
//         discount_amount_2: d2_amt,
//         amount_after_discount_2: amt_after_d2,
//         rate: rate_after_d1,
//         base_rate: rate_after_d1
//     });
// }





// function fetch_pricing_discount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];

//     if (!row.item_code || !row.price_list_rate || !row.qty) return;

//     frappe.call({
//         method: "multiple_uom.api.get_base_price_discount",
//         args: {
//             item_code: row.item_code,
//             price_list: frm.doc.selling_price_list,
//             price_list_rate: row.price_list_rate,
//             qty: row.qty,
//             customer: frm.doc.customer,
//             company: frm.doc.company
//         },
//         callback(r) {
//             let d1_pct = flt(r.message?.discount_percentage || 0);
//             frappe.model.set_value(cdt, cdn, "discount_1", d1_pct);
//             recalc_row(cdt, cdn);
//         }
//     });
// }
// frappe.ui.form.on("Sales Order Item", {

//     item_code(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     price_list_rate(frm, cdt, cdn) {
//         fetch_pricing_discount(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_1(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     },

//     discount_2(frm, cdt, cdn) {
//         recalc_row(cdt, cdn);
//     }
// });


// // updated code
// function recalc_row(cdt, cdn) {
//     let row = locals[cdt][cdn];

//     let qty = flt(row.qty);
//     if (!qty) return;

//     let base_rate = flt(row.price_list_rate);
//     let base_amount = base_rate * qty;

//     // -----------------------
//     // Discount 1 (Pricing Rule – on amount)
//     // -----------------------
//     let d1_pct = flt(row.discount_1);
//     let d1_amt = base_amount * d1_pct / 100;
//     let amt_after_d1 = base_amount - d1_amt;

//     let rate_after_d1 = amt_after_d1 / qty;

//     // -----------------------
//     // Discount 2 (Manual – ONLY on rate)
//     // -----------------------
//     let d2_pct = flt(row.discount_2);
//     let d2_rate_amt = rate_after_d1 * d2_pct / 100;
//     let final_rate = rate_after_d1 - d2_rate_amt;

//     let final_amount = final_rate * qty;

//     // -----------------------
//     // Set values
//     // -----------------------
//     frappe.model.set_value(cdt, cdn, {
//         discount_amount_1: d1_amt,
//         amount_after_discount_1: amt_after_d1,

//         // informational only
//         discount_amount_2: d2_rate_amt * qty,

//         rate: final_rate,
//         base_rate: final_rate,
//         amount_after_discount_2: final_amount
//     });
// }
// // end updated code





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
function recalc_row(cdt, cdn) {
    let row = locals[cdt][cdn];

    let qty = flt(row.qty);
    if (!qty) return;

    let base_rate = flt(row.price_list_rate);
    let base_amount = base_rate * qty;

    // -------------------------
    // Discount 1 (Pricing Rule – on amount)
    // -------------------------
    let d1_pct = flt(row.discount_1_);
    let d1_amt = base_amount * d1_pct / 100;
    let amt_after_d1 = base_amount - d1_amt;

    let rate_after_d1 = amt_after_d1 / qty;

    // -------------------------
    // Discount 2 (Manual – ONLY on rate)
    // -------------------------
    let d2_pct = flt(row.discount_2);
    let d2_rate_amt = rate_after_d1 * d2_pct / 100;
    let final_rate = rate_after_d1 - d2_rate_amt;

    let final_amount = final_rate * qty;

    let total_discount = d1_amt + d2_rate_amt * qty;

    // -------------------------
    // Set values (CORRECT FIELDS)
    // -------------------------
    frappe.model.set_value(cdt, cdn, {
        custom_discount_amount_1: d1_amt,
        amount_after_discount_1: amt_after_d1,

        custom_discount_amount_2: d2_rate_amt * qty,
        amount_after_discount_2: final_amount,
        discount_amount: total_discount,

        rate: final_rate
    });
}
