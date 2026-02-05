# import frappe

# @frappe.whitelist()
# def get_base_price_discount(
#     item_code,
#     selling_price_list,
#     company
# ):
#     if not item_code or not selling_price_list or not company:
#         return {
#             "pricing_rule": None,
#             "discount_percentage": 0
#         }

#     # 1️ Find applicable Pricing Rule (Discount based)
#     pricing_rule = frappe.db.get_value(
#         "Pricing Rule",
#         {
#             "apply_on": "Item Code",
#             "selling": 1,
#             "rate_or_discount": "Discount Percentage",
#             "for_price_list": selling_price_list,
#             "company": company,
#             "disable": 0
#         },
#         ["name", "discount_percentage"],
#         as_dict=True
#         filters=[
#             ["Pricing Rule Item", "item_code", "=", item_code]
#         ]
#     )
#     # frappe.msgprint(f"Queried Pricing Rule: {pricing_rule}")

#     if not pricing_rule:
#         return {
#             "pricing_rule": None,
#             # "discount_percentage": 0,
#             "discount_percentage": pricing_rule.discount_percentage
#         }

#     # 2️ Verify item exists in Pricing Rule Items table
#     item_exists = frappe.db.exists(
#         "Pricing Rule Item",
#         {
#             "parent": pricing_rule.name,
#             "item_code": item_code,
            
#         }
#     )

#     if not item_exists:
#         return {
#             "pricing_rule": None,
#             # "discount_percentage": 0
#             "discount_percentage": pricing_rule.discount_percentage
#         }

#     # 3️ Return discount
#     return {
#         "pricing_rule": pricing_rule.name,
#         "discount_percentage": pricing_rule.discount_percentage
#     }



import frappe
@frappe.whitelist()
def get_base_price_discount(item_code, selling_price_list, company):

    pricing_rule = frappe.db.sql("""
        SELECT
            pr.name,
            pr.rate,
            pr.discount_percentage,
            pr.rate_or_discount
        FROM
            `tabPricing Rule` pr
        INNER JOIN
            `tabPricing Rule Item Code` prd
            ON prd.parent = pr.name
        WHERE
            pr.selling = 1
            AND pr.disable = 0
            AND pr.company = %s
            AND pr.for_price_list = %s
            AND prd.item_code = %s
        ORDER BY
            pr.priority DESC,
            pr.creation DESC
        LIMIT 1
    """, (company, selling_price_list, item_code), as_dict=True)
    
    # frappe.log_error(
    #     title="Pricing Rule Debug",
    #     message=pricing_rule
    # )

    if not pricing_rule:
        return None

    return pricing_rule[0]
