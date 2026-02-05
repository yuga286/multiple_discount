import frappe

@frappe.whitelist()
def get_base_price_discount(
    item_code,
    selling_price_list,
    company
):
    if not item_code or not selling_price_list or not company:
        return {
            "pricing_rule": None,
            "discount_percentage": 0
        }

    # 1️ Find applicable Pricing Rule (Discount based)
    pricing_rule = frappe.db.get_value(
        "Pricing Rule",
        {
            "apply_on": "Item Code",
            "selling": 1,
            "rate_or_discount": "Discount Percentage",
            "for_price_list": selling_price_list,
            "company": company,
            "disable": 0
        },
        ["name", "discount_percentage"],
        as_dict=True
    )
    # frappe.msgprint(f"Queried Pricing Rule: {pricing_rule}")

    if not pricing_rule:
        return {
            "pricing_rule": None,
            # "discount_percentage": 0,
            "discount_percentage": pricing_rule.discount_percentage
        }

    # 2️ Verify item exists in Pricing Rule Items table
    item_exists = frappe.db.exists(
        "Pricing Rule Item",
        {
            "parent": pricing_rule.name,
            "item_code": item_code,
            
        }
    )

    if not item_exists:
        return {
            "pricing_rule": None,
            # "discount_percentage": 0
            "discount_percentage": pricing_rule.discount_percentage
        }

    # 3️ Return discount
    return {
        "pricing_rule": pricing_rule.name,
        "discount_percentage": pricing_rule.discount_percentage
    }