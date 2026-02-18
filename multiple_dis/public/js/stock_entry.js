frappe.ui.form.on("Stock Entry", {

    refresh(frm) {
        patch_get_items(frm);
    },

    custom_bom_quantity_fixed(frm) {
        patch_get_items(frm);
    }

});


function patch_get_items(frm) {
    console.log("start1");

    if (frm._patched_get_items) return;

    frm._patched_get_items = true;
    console.log("start2");

    let original_get_items = frm.cscript.get_items;
    console.log("start3");

    frm.cscript.get_items = function () {

        console.log("get_items triggered");

        if (frm.doc.custom_bom_quantity_fixed) {
            console.log("BOM recalculation blocked.");
            return;
        }
        console.log("start4");

        if (original_get_items) {
            return original_get_items.apply(this, arguments);
        }
    };
}
