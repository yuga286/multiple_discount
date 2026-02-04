import frappe

def execute():
    doctypes = [
        "Sales Order Item",
        "Sales Invoice Item",
        "Delivery Note Item"
    ]

    def get_insert_after(dt):
        # price_list_rate exists ONLY in Sales Order & Invoice
        if dt in ("Sales Order Item", "Sales Invoice Item"):
            return "price_list_rate"
        return "rate"  # safe fallback for Delivery Note Item

    fields_template = [
        # Discount 1
        {
            "fieldname": "discount_1_",
            "label": "Discount 1 (%)",
            "fieldtype": "Percent",
            "read_only": 1
        },
        {
            "fieldname": "custom_discount_amount_1",
            "label": "Discount Amount 1",
            "fieldtype": "Currency",
            "options": "currency",
            "read_only": 1
        },
        {
            "fieldname": "amount_after_discount_1",
            "label": "Amount After Discount 1",
            "fieldtype": "Currency",
            "options": "currency",
            "read_only": 1
        },

        # Discount 2
        {
            "fieldname": "discount_2",
            "label": "Discount 2 (%)",
            "fieldtype": "Percent"
        },
        {
            "fieldname": "custom_discount_amount_2",
            "label": "Discount Amount 2",
            "fieldtype": "Currency",
            "options": "currency",
            "read_only": 1
        },
        {
            "fieldname": "amount_after_discount_2",
            "label": "Amount After Discount 2",
            "fieldtype": "Currency",
            "options": "currency",
            "read_only": 1
        },

        # Secondary UOM
        {
            "fieldname": "alternate_qty",
            "label": "Secondary UOM Qty",
            "fieldtype": "Float",
            "insert_after": "qty",
            "read_only": 1
        },
        {
            "fieldname": "alternate_uom",
            "label": "Secondary UOM",
            "fieldtype": "Link",
            "options": "UOM",
            "insert_after": "alternate_qty",
            "read_only": 1
        },
        {
            "fieldname": "alternate_uom_conversion_factor",
            "label": "Secondary UOM Conversion Factor",
            "fieldtype": "Float",
            "precision": 6,
            "insert_after": "alternate_uom",
            "read_only": 1
        }
    ]

    for dt in doctypes:
        anchor = get_insert_after(dt)
        last_field = anchor

        for f in fields_template:
            f = f.copy()

            if "insert_after" not in f:
                f["insert_after"] = last_field

            field_id = f"{dt}-{f['fieldname']}"

            if not frappe.db.exists("Custom Field", field_id):
                frappe.get_doc({
                    "doctype": "Custom Field",
                    "dt": dt,
                    **f
                }).insert(ignore_permissions=True)

            last_field = f["fieldname"]

    frappe.db.commit()
