


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
        return {"discount_percentage": 0}

    return {
        "discount_percentage": pricing_rule[0].get("discount_percentage", 0)
    }


@frappe.whitelist()
def get_secondary_uom(item_code):
    if not item_code:
        return {}
 
    row = frappe.db.get_value(
        "UOM Conversion Detail",
        {
            "parent": item_code,
            "secondary_uom": 1
        },
        ["uom", "conversion_factor"],
        as_dict=1
    )
 
    return row or {}


# working code perfect

@frappe.whitelist()
def get_addresses_for_sales_order(city=None, company=None, customer=None):
    result = {}

    # Company Address
    if city:
        company_addr = frappe.db.get_all(
            "Address",
            filters={
                "city": city,
                "is_your_company_address": 1,
                "disabled": 0
            },
            fields=["name"],
            order_by="creation desc",
            limit=1
        )

        if company_addr:
            result["dispatch_address"] = company_addr[0].name
            result["company_address"] = company_addr[0].name

    # Customer Shipping Address
    if customer:
        customer_links = frappe.get_all(
            "Dynamic Link",
            filters={
                "link_doctype": "Customer",
                "link_name": customer,
                "parenttype": "Address"
            },
            fields=["parent"],
            limit=1
        )

        if customer_links:
            result["shipping_address"] = customer_links[0].parent

    return result







# import frappe

# def freeze_item_qty(doc, method):
#     if not doc.custom_bom_quantity_fixed:
#         return

#     if not doc.get("items"):
#         return

#     # Fetch previous version from DB
#     old_doc = None
#     if doc.name:
#         old_doc = frappe.get_doc("Stock Entry", doc.name)

#     if not old_doc:
#         return

#     # Restore item qty from old saved version
#     old_qty_map = {}
#     for d in old_doc.items:
#         old_qty_map[d.name] = d.qty

#     for d in doc.items:
#         if d.name in old_qty_map:
#             d.qty = old_qty_map[d.name]


import frappe

def freeze_item_qty(doc, method):
    if not doc.custom_bom_quantity_fixed:
        return

    if not doc.name:
        return
    
    # fetch previous saved version
    old_doc = frappe.get_doc("Stock Entry", doc.name)
    # frappe.msgprint(f"old data: {old_doc}")
    
    # if not self.is_new():
    #     old_doc = self.get_doc_before_save()
        
    frappe.log_error(
        title="Stock Entry Debug",
        message=str(old_doc)
    )



    old_qty_map = {}
    for row in old_doc.items:
        old_qty_map[row.name] = row.qty

    for row in doc.items:
        if row.name in old_qty_map:
            row.qty = old_qty_map[row.name]
