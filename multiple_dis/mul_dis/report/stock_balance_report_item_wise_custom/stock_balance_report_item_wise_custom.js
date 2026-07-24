// Copyright (c) 2026, vigisolvo and contributors
// For license information, please see license.txt

frappe.query_reports["Stock Balance Report Item-Wise Custom"] = {
	filters: [

        {
            fieldname: "company",
            label: "Company",
            fieldtype: "Link",
            options: "Company",
            default: frappe.defaults.get_user_default("Company"),
            reqd: 1
        },

        {
            fieldname: "from_date",
            label: "From Date",
            fieldtype: "Date",
            reqd: 1,
            default: frappe.datetime.month_start()
        },

        {
            fieldname: "to_date",
            label: "To Date",
            fieldtype: "Date",
            reqd: 1,
            default: frappe.datetime.get_today()
        },

        {
            fieldname: "item_group",
            label: "Item Group",
            fieldtype: "Link",
            options: "Item Group"
        },

        {
            fieldname: "item_code",
            label: "Item",
            fieldtype: "Link",
            options: "Item"
        },

        {
            fieldname: "warehouse",
            label: "Warehouse",
            fieldtype: "Link",
            options: "Warehouse"
        },

        {
            fieldname: "include_uom",
            label: "Include UOM",
            fieldtype: "Link",
            options: "UOM"
        }
    ],

	formatter: function(value, row, column, data, default_formatter) {

        value = default_formatter(value, row, column, data);

        // =====================================================
        // IN QTY -> GREEN
        // =====================================================
        if (
            column.fieldname === "in_qty"
            && data
            && data.in_qty > 0
        ) {

            value = `<span style="color:green;font-weight:bold;">
                        ${value}
                     </span>`;
        }

        // =====================================================
        // OUT QTY -> RED
        // =====================================================
        if (
            column.fieldname === "out_qty"
            && data
            && data.out_qty > 0
        ) {

            value = `<span style="color:red;font-weight:bold;">
                        ${value}
                     </span>`;
        }

        return value;
    }
};

