# import frappe
# from erpnext.accounts.doctype.pricing_rule.pricing_rule import (
#     get_pricing_rule_for_item
# )

# @frappe.whitelist()
# def get_base_price_discount(
#     item_code,
#     price_list,
#     price_list_rate,
#     qty,
#     customer=None,
#     company=None
# ):
#     args = frappe._dict(args)

#     pricing_rule = get_pricing_rule_for_item(
#         args,
#         args.price_list_rate,
#         args.qty,
#         args.transaction_type,
#         args.customer or None
#     )

#     if pricing_rule and pricing_rule.get("discount_percentage"):
#         return {
#             "pricing_rule": pricing_rule.name,
#             "discount_percentage": pricing_rule.discount_percentage
#         }

#     return {
#         "pricing_rule": None,
#         "discount_percentage": 0
#     }

# import frappe
# from erpnext.accounts.doctype.pricing_rule.pricing_rule import get_pricing_rule_for_item

# @frappe.whitelist()
# def get_base_price_discount(args):
#     args = frappe._dict(args)

#     pricing_rule = get_pricing_rule_for_item(
#         args,
#         args.price_list_rate,
#         args.qty,
#         "selling",
#         args.customer
#     )

#     if pricing_rule and pricing_rule.get("discount_percentage"):
#         return {
#             "discount_percentage": pricing_rule.discount_percentage,
#             "pricing_rule": pricing_rule.name
#         }

#     return {
#         "discount_percentage": 0,
#         "pricing_rule": None
#     }

# @frappe.whitelist()
# def get_base_price_discount(
#     item_code,
#     price_list,
#     price_list_rate,
#     qty,
#     customer=None,
#     company=None
# ):
#     #  HARD SAFETY
#     if not args or not isinstance(args, dict):
#         frappe.throw(f"Invalid args type received: {type(args)}")

#     args = frappe._dict(args)

   

# @frappe.whitelist()
# def get_base_price_discount(
#     item_code,
#     price_list,
#     price_list_rate,
#     qty,
#     customer=None,
#     company=None
# ):
#     # Optional safety
#     if not item_code or not price_list:
#         frappe.throw("Missing mandatory pricing inputs")

 


# import frappe
# from erpnext.accounts.doctype.pricing_rule.pricing_rule import get_pricing_rule_for_item


# @frappe.whitelist()
# def get_base_price_discount(
#     item_code,
#     price_list,
#     price_list_rate,
#     qty,
#     customer=None,
#     company=None
# ):
#     # -----------------------------
#     # BASIC SAFETY CHECKS
#     # -----------------------------
    

    
#     if not item_code:
#         frappe.throw("item_code is required")

#     if not price_list:
#         frappe.throw("price_list is required")

#     # if not price_list_rate or not qty:
#     #     return {
#     #         "pricing_rule": None,
#     #         "discount_percentage": 0
#     #     }

#     # -----------------------------
#     # BUILD ARGS DICT (THIS IS KEY)
#     # -----------------------------
#     args = frappe._dict({
#         # "doctype": "Sales Order", 
#         "item_code": item_code,
#         "price_list": price_list,
#         "price_list_rate": price_list_rate,
#         "qty": qty, 
#         "transaction_type": "selling",
#         "customer": customer,
#         "company": company
#     })

#     # -----------------------------
#     # FETCH PRICING RULE
#     # -----------------------------
#     pricing_rule = get_pricing_rule_for_item(args)
    
    
#     # pricing_rule = get_pricing_rule_for_item(args)

#     if pricing_rule and pricing_rule.get("discount_percentage"):
        
#         return {
#             "pricing_rule": pricing_rule.name,
#             "discount_percentage": pricing_rule.discount_percentage
#         }

#     frappe.log_error(
#         title="PRICING RULE DEBUG",
#         message={
#             "pricing_rule": pricing_rule
#         }
#     )
#     return {
#         "pricing_rule": pricing_rule.name,
#         "discount_percentage": pricing_rule.discount_percentage
#     }



#     if pricing_rule and pricing_rule.get("discount_percentage"):
#         return {
#             "pricing_rule": pricing_rule.name,
#             "discount_percentage": pricing_rule.discount_percentage
#         }

#     return {
#         "pricing_rule": None,
#         "discount_percentage": 0
#     }


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
