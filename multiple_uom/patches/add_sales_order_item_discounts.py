import frappe

def execute():
    fields = [
        dict(
            fieldname="discount_1_",
            label="Discount 1 (%)",
            fieldtype="Percent",
            insert_after="discount_percentage"
        ),
        dict(
            fieldname="custom_discount_amount_1",
            label="Discount Amount 1",
            fieldtype="Currency",
            insert_after="discount_1",
            read_only=1
        ),
        dict(
            fieldname="discount_2",
            label="Discount 2 (%)",
            fieldtype="Percent",
            insert_after="discount_amount_1"
        ),
        dict(
            fieldname="custom_discount_amount_2",
            label="Discount Amount 2",
            fieldtype="Currency",
            insert_after="discount_2",
            read_only=1
        ),
        dict(
            fieldname="amount_after_discount_1",
            label="Amount After Discount 1",
            fieldtype="Currency",
            insert_after="discount_amount_2",
            read_only=1
        ),
        dict(
            fieldname="amount_after_discount_2",
            label="Amount After Discount 2",
            fieldtype="Currency",
            insert_after="amount_after_discount_1",
            read_only=1
        ),
    ]

    for f in fields:
        if not frappe.db.exists("Custom Field", f"Sales Order Item-{f['fieldname']}"):
            frappe.get_doc({
                "doctype": "Custom Field",
                "dt": "Sales Order Item",
                **f
            }).insert(ignore_permissions=True)

    frappe.db.commit()

