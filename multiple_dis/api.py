import frappe
from frappe.utils import nowdate

@frappe.whitelist()
def get_base_price_discount(
    item_code,
    price_list,
    price_list_rate=None,
    qty=None,
    customer=None,
    company=None
):
    # 1️ Find matching Pricing Rule (Discount based only)
    qty = float(qty or 1)
    price_list_rate = float(price_list_rate or 0)
    pricing_rule_name = frappe.db.get_value(
        "Pricing Rule",
        {
            "apply_on": "Item Code",
            "selling": 1,
            "rate_or_discount": "Discount Percentage",
            # "price_list": price_list,
            "company": company,
            "disable": 0
        },
        "name"
    )

    if not pricing_rule_name:
        return {
            "pricing_rule": None,
            "discount_percentage": 0
        }

    # 2 Fetch full Pricing Rule doc
    pr = frappe.get_doc("Pricing Rule", pricing_rule_name)

    # 3Verify item is part of rule
    valid_items = [d.item_code for d in pr.items]
    if item_code not in valid_items:
        return {
            "pricing_rule": None,
            "discount_percentage": 0
        }

    return {
        "pricing_rule": pr.name,
        "discount_percentage": pr.discount_percentage
    }
