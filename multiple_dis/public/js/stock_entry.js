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




frappe.ui.form.on("Stock Entry", {

    fg_completed_qty: function(frm) {

        if (!frm.doc.custom_bom_quantity_fixed) {
            return;  // normal ERP behaviour
        }

        let fg_qty = frm.doc.fg_completed_qty;

        (frm.doc.items || []).forEach(function(row) {

            if (row.is_finished_item) {
                frappe.model.set_value(row.doctype, row.name, "qty", fg_qty);
                frappe.model.set_value(row.doctype, row.name, "transfer_qty", fg_qty);
            }

        });

        frm.refresh_field("items");
    }

});