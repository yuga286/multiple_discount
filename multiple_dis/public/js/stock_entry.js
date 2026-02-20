frappe.ui.form.on("Stock Entry", {

    refresh(frm) {
        patch_get_items(frm);
    },

    custom_bom_quantity_fixed(frm) {
        patch_get_items(frm);
    }

});


function patch_get_items(frm) {

    if (frm._patched_get_items) return;

    frm._patched_get_items = true;

    let original_get_items = frm.cscript.get_items;

    frm.cscript.get_items = function () {

        console.log("get_items triggered");

        if (frm.doc.custom_bom_quantity_fixed) {
            console.log("BOM recalculation blocked.");
            return;
        }

        if (original_get_items) {
            return original_get_items.apply(this, arguments);
        }
    };
}


// frappe.ui.form.on("Stock Entry", {
//     fg_completed_qty: function(frm) {
//         if (frm.doc.custom_bom_quantity_fixed) {
//             frappe.msgprint("Freeze enabled. Raw material will not auto update.");
//             return;
//         }
//     }
// });





// frappe.ui.form.on("Stock Entry", {

//     refresh(frm) {
//         stop_bom_behaviour(frm);
//     },

//     custom_bom_quantity_fixed(frm) {
//         stop_bom_behaviour(frm);
//     }
// });

// function stop_bom_behaviour(frm) {
//     console.log("start1");

//     if (!frm.doc.custom_bom_quantity_fixed) return;
//     console.log("start2");
//     // Stop get_items from firing
//     if (frm.events.get_items) {
//         console.log("start3");
//         frm.events.get_items = function () {
//             console.log("BOM blocked");
//         };
//     }
//     console.log("start4");
//     // Stop finished goods recalculation
//     if (frm.stock_entry_controller) {
//         frm.stock_entry_controller.update_finished_goods = function () {};
//         frm.stock_entry_controller.set_basic_rate = function () {};
//     }
//     console.log("start5");
//     frm.refresh_field("items");
// }
