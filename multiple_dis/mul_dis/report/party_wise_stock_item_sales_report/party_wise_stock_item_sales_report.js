frappe.query_reports["Party Wise Stock item Sales Reprot"] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date"
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date"
        },
        {
            "fieldname": "customer",
            "label": "Customer",
            "fieldtype": "Link",
            "options": "Customer"
        }
    ]
};



frappe.query_reports["Party Wise Stock item Sales Reprot"] = {
    onload: function(report) {
        setTimeout(() => {
            // force header height
            document.querySelectorAll(".dt-header .dt-cell").forEach(cell => {
                cell.style.height = "80px";
                cell.style.verticalAlign = "middle";
            });

            document.querySelectorAll(".dt-header .dt-cell__content").forEach(cell => {
                cell.style.display = "flex";
                cell.style.alignItems = "center";
                cell.style.justifyContent = "center";
            });

        }, 500); // wait for table render
    }
};