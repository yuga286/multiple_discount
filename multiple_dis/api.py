


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


# @frappe.whitelist()
# def get_secondary_uom(item_code):
#     if not item_code:
#         return {}
 
#     row = frappe.db.get_value(
#         "UOM Conversion Detail",
#         {
#             "parent": item_code,
#             "secondary_uom": 1
#         },
#         ["uom", "conversion_factor"],
#         as_dict=1
#     )
 
#     return row or {}


import frappe
 
@frappe.whitelist()
def get_secondary_uom(item_code):
    if not item_code:
        return {}
 
    rows = frappe.get_all(
        "UOM Conversion Detail",
        filters={"parent": item_code},
        fields=["uom", "conversion_factor", "secondary_uom", "custom_secondary_uom"],
        order_by="idx asc"
    )
 
    for row in rows:
        if row.get("custom_secondary_uom") or row.get("secondary_uom"):
            return {
                "uom": row.uom,
                "conversion_factor": row.conversion_factor
            }
 
    # fallback first factor > 1
    for row in rows:
        if float(row.conversion_factor or 0) != 1:
            return {
                "uom": row.uom,
                "conversion_factor": row.conversion_factor
            }
 
    return {}


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


import frappe

@frappe.whitelist()
def get_addresses_for_purchase_order(city=None, company=None, supplier=None):
    result = {}

    # ----------------------------
    # 1️ Company Address (City Based)
    # ----------------------------
    if city:
        company_address = frappe.db.get_all(
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

        if company_address:
            result["company_address"] = company_address[0].name
            result["shipping_address"] = company_address[0].name

    # ----------------------------
    # 2️ Supplier Address → Dispatch
    # ----------------------------
    if supplier:
        supplier_address = frappe.db.sql("""
            SELECT addr.name
            FROM `tabAddress` addr
            INNER JOIN `tabDynamic Link` dl
                ON dl.parent = addr.name
            WHERE dl.link_doctype = 'Supplier'
              AND dl.link_name = %s
              AND addr.disabled = 0
            ORDER BY addr.creation DESC
            LIMIT 1
        """, (supplier,), as_dict=True)

        if supplier_address:
            result["dispatch_address"] = supplier_address[0].name

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


# import frappe

# def freeze_item_qty(doc, method):
#     if not doc.custom_bom_quantity_fixed:
#         return

#     if not doc.name:
#         return
    
#     # fetch previous saved version
#     old_doc = frappe.get_doc("Stock Entry", doc.name)
#     # frappe.msgprint(f"old data: {old_doc}")
    
#     # if not self.is_new():
#     #     old_doc = self.get_doc_before_save()

#     old_qty_map = {}
#     for row in old_doc.items:
#         old_qty_map[row.name] = row.qty

#     for row in doc.items:
#         if row.name in old_qty_map:
#             row.qty = old_qty_map[row.name]


import frappe

def freeze_item_qty(doc, method):
    if not doc.custom_bom_quantity_fixed:
        return

    # Only run for existing docs
    old_doc = doc.get_doc_before_save()
    if not old_doc:
        return

    old_qty_map = {row.name: row.qty for row in old_doc.items}

    for row in doc.items:
        # If qty was NOT changed by user, keep old value
        if row.name in old_qty_map and row.qty != old_qty_map[row.name]:
            # User changed it → allow it
            continue







import frappe

@frappe.whitelist()
def get_debtor_summary(company, from_date, to_date):

    data = frappe.db.sql("""
        SELECT 
            party AS customer,
            SUM(debit) AS debit,
            SUM(credit) AS credit,
            SUM(debit - credit) AS closing
        FROM `tabGL Entry`
        WHERE company = %s
        AND posting_date BETWEEN %s AND %s
        AND account_type = 'Receivable'
        GROUP BY party
    """, (company, from_date, to_date), as_dict=True)

    html = "<table class='table table-bordered'>"
    html += "<tr><th>Customer</th><th>Debit</th><th>Credit</th><th>Closing</th></tr>"

    for row in data:
        html += f"""
        <tr>
            <td>{row.customer}</td>
            <td>{row.debit}</td>
            <td>{row.credit}</td>
            <td>{row.closing}</td>
        </tr>
        """

    html += "</table>"

    return html






import frappe
 
@frappe.whitelist()
def get_item_details(item_code, selling_price_list, company):
    """
    Returns discount + secondary UOM + MRP in a single DB round trip.
    Replaces: get_base_price_discount + get_secondary_uom + Item Price fetch
    """
    result = {
        "discount_percentage": 0,
        "uom": None,
        "conversion_factor": None,
        "mrp": 0
    }
 
    if not item_code:
        return result
 
    # ── 1. Pricing Rule (your existing SQL, unchanged) ──────────────────
    pricing_rule = frappe.db.sql("""
        SELECT
            pr.discount_percentage,
            pr.rate_or_discount
        FROM `tabPricing Rule` pr
        INNER JOIN `tabPricing Rule Item Code` prd
            ON prd.parent = pr.name
        WHERE
            pr.selling = 1
            AND pr.disable = 0
            AND pr.company = %s
            AND pr.for_price_list = %s
            AND prd.item_code = %s
        ORDER BY pr.priority DESC, pr.creation DESC
        LIMIT 1
    """, (company, selling_price_list, item_code), as_dict=True)
 
    if pricing_rule:
        result["discount_percentage"] = pricing_rule[0].get("discount_percentage", 0)
 
    # ── 2. Secondary UOM (stop at first match, no full scan) ────────────
    uom_rows = frappe.db.sql("""
        SELECT uom, conversion_factor, secondary_uom, custom_secondary_uom
        FROM `tabUOM Conversion Detail`
        WHERE parent = %s
        ORDER BY idx ASC
    """, (item_code,), as_dict=True)
 
    secondary_uom = None
    fallback_uom = None
 
    for row in uom_rows:
        if row.get("custom_secondary_uom") or row.get("secondary_uom"):
            secondary_uom = row
            break
        if not fallback_uom and float(row.conversion_factor or 0) != 1:
            fallback_uom = row
 
    chosen = secondary_uom or fallback_uom
    if chosen:
        result["uom"] = chosen["uom"]
        result["conversion_factor"] = chosen["conversion_factor"]
 
    # ── 3. MRP (single targeted query) ──────────────────────────────────
    mrp = frappe.db.get_value(
        "Item Price",
        {"item_code": item_code, "price_list": "MRP"},
        "custom_mrp"
    )
    if mrp is None:
        # fallback: first available price
        mrp = frappe.db.get_value(
            "Item Price",
            {"item_code": item_code},
            "custom_mrp"
        )
 
    result["mrp"] = mrp or 0
 
    return result






