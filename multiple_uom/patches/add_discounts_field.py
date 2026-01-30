import frappe

def execute():
    doctypes = [
        "Sales Order Item",
        "Sales Invoice Item",
        "Delivery Note Item"
    ]

    fields = [
        {
            "fieldname": "discount_1",
            "label": "Discount 1 (%)",
            "fieldtype": "Percent",
            "insert_after": "price_list_rate",
            "read_only": 1
        },
        {
            "fieldname": "discount_amount_1",
            "label": "Discount Amount 1",
            "fieldtype": "Currency",
            "insert_after": "discount_1",
            "read_only": 1
        },
        {
            "fieldname": "discount_2",
            "label": "Discount 2 (%)",
            "fieldtype": "Percent",
            "insert_after": "discount_amount_1"
        },
        {
            "fieldname": "discount_amount_2",
            "label": "Discount Amount 2",
            "fieldtype": "Currency",
            "insert_after": "discount_2",
            "read_only": 1
        },
        {
            "fieldname": "base_rate",
            "label": "Base Rate (After Discount 1)",
            "fieldtype": "Currency",
            "insert_after": "price_list_rate",
            "read_only": 1
        }
    ]

    for dt in doctypes:
        for f in fields:
            field_name = f"{dt}-{f['fieldname']}"

            if not frappe.db.exists("Custom Field", field_name):
                frappe.get_doc({
                    "doctype": "Custom Field",
                    "dt": dt,
                    **f
                }).insert(ignore_permissions=True)

    frappe.db.commit()
