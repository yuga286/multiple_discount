// frappe.query_reports["BOM Work Order Tree"] = {
//     tree: true,
//     name_field: "name",
//     parent_field: "parent",
//     initial_depth: 3,

//     filters: [
//         {
//             fieldname: "bom",
//             label: "BOM",
//             fieldtype: "Link",
//             options: "BOM"
//         }
//     ]
// };


frappe.query_reports["BOM Work Order Tree"] = {
    tree: true,
    name_field: "name",
    parent_field: "parent",
    initial_depth: 2,

    // formatter: function(value, row, column, data, default_formatter) {
    //     value = default_formatter(value, row, column, data);

    //     if (column.fieldname === "difference" && data) {

    //         let actual = Math.abs(data.actual_qty || 0);
    //         let se_qty = data.se_qty || 0;

    //         if (se_qty > actual) {
    //             value = `<span style="color: red; font-weight: bold;">${value}</span>`;
    //         } else {
    //             value = `<span style="color: green; font-weight: bold;">${value}</span>`;
    //         }
    //     }

    //     return value;
    // }

    // formatter: function(value, row, column, data, default_formatter) {
    //     value = default_formatter(value, row, column, data);

    //     if (column.fieldname === "actual_qty" && data) {

    //         let actual = Math.abs(data.actual_qty || 0);
    //         let se_qty = data.se_qty || 0;

    //         if (actual_qty > 0) {
    //             value = `<span style="color: green; font-weight: bold;">${value}</span>`;
    //         } else if (actual_qty < 0) {
    //             value = `<span style="color: red; font-weight: bold;">${value}</span>`;
    //         } else{
    //             value = `<span style="color: gray; font-weight: bold;">${value}</span>`;
    //         }
    //     }

    //     return value;
    // }

    formatter: function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);

        if (column.fieldname === "actual_qty" && data) {

            let actual = data.actual_qty || 0;

            if (actual > 0) {
                value = `<span style="color: green; font-weight: bold;">${value}</span>`;
            } else if (actual < 0) {
                value = `<span style="color: red; font-weight: bold;">${value}</span>`;
            } else {
                value = `<span style="color: black;">${value}</span>`;
            }
        }

        return value;
    }
};