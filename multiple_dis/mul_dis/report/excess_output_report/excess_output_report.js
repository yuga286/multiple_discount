

frappe.query_reports["Excess Output Report"] = {
    tree: true,
    name_field: "name",
    parent_field: "parent",
    initial_depth: 2,


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