# import frappe

# @frappe.whitelist()
# def get_data():
#     # 🔹 Get items
#     items = frappe.db.sql("""
#         SELECT DISTINCT sii.item_code
#         FROM `tabSales Invoice Item` sii
#         INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
#         WHERE si.docstatus = 1
#     """, as_dict=1)

#     item_list = [d.item_code for d in items]

#     # 🔹 Get sales data
#     raw = frappe.db.sql("""
#         SELECT
#             si.customer,
#             sii.item_code,
#             SUM(IFNULL(sii.qty,0)) as qty,
#             SUM(IFNULL(sii.amount,0)) as amount
#         FROM `tabSales Invoice` si
#         JOIN `tabSales Invoice Item` sii ON si.name = sii.parent
#         WHERE si.docstatus = 1
#         GROUP BY si.customer, sii.item_code
#     """, as_dict=1)

#     # 🔹 Pivot
#     customer_map = {}

#     for row in raw:
#         cust = row.customer

#         if cust not in customer_map:
#             customer_map[cust] = {"customer": cust}
#             for item in item_list:
#                 customer_map[cust][item] = {"qty": 0, "amt": 0}

#         customer_map[cust][row.item_code]["qty"] += row.qty
#         customer_map[cust][row.item_code]["amt"] += row.amount

#     return {
#         "items": item_list,
#         "data": customer_map
#     }


import frappe

@frappe.whitelist()
def get_data():

    items = frappe.db.sql("""
        SELECT DISTINCT sii.item_code
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        WHERE si.docstatus = 1
    """, as_dict=1)

    item_list = [d.item_code for d in items]

    raw = frappe.db.sql("""
        SELECT
            si.customer,
            sii.item_code,
            SUM(IFNULL(sii.qty,0)) as qty,
            SUM(IFNULL(sii.amount,0)) as amount
        FROM `tabSales Invoice` si
        JOIN `tabSales Invoice Item` sii ON si.name = sii.parent
        WHERE si.docstatus = 1
        GROUP BY si.customer, sii.item_code
    """, as_dict=1)

    customer_map = {}

    for row in raw:
        cust = row.customer

        if cust not in customer_map:
            customer_map[cust] = {}
            for item in item_list:
                customer_map[cust][item] = {"qty": 0, "amt": 0}

        customer_map[cust][row.item_code]["qty"] += row.qty
        customer_map[cust][row.item_code]["amt"] += row.amount

    return {
        "items": item_list,
        "data": customer_map
    }
    
    
import frappe
import csv
import io

@frappe.whitelist()
def download_excel():
    data = get_data()  # reuse your function

    items = data["items"]
    customers = data["data"]

    output = io.StringIO()
    writer = csv.writer(output)

    # header row 1
    row1 = ["Customer"]
    for item in items:
        row1.extend([item, ""])
    writer.writerow(row1)

    # header row 2
    row2 = [""]
    for item in items:
        row2.extend(["Qty", "Amount"])
    writer.writerow(row2)

    # data
    for cust, row in customers.items():
        r = [cust]
        for item in items:
            d = row.get(item, {"qty": 0, "amt": 0})
            r.extend([d["qty"], d["amt"]])
        writer.writerow(r)

    frappe.response["filename"] = "Party_Wise_Report.csv"
    frappe.response["filecontent"] = output.getvalue()
    frappe.response["type"] = "download"