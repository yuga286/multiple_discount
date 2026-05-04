import frappe
@frappe.whitelist()
def get_data():

    raw = frappe.db.sql("""
        SELECT
            si.customer,
            sii.item_code,
            sii.item_name,
            SUM(IFNULL(sii.qty,0)) as qty,
            SUM(IFNULL(sii.amount,0)) as amount
        FROM `tabSales Invoice` si
        JOIN `tabSales Invoice Item` sii ON si.name = sii.parent
        WHERE si.docstatus = 1
        GROUP BY si.customer, sii.item_code, sii.item_name
    """, as_dict=1)

    # items (item_name)
    item_list = list(set([row.item_name for row in raw if row.item_name]))

    # item_code → uom
    item_codes = list(set([row.item_code for row in raw if row.item_code]))

    item_uoms = frappe.get_all(
        "Item",
        filters={"name": ["in", item_codes]},
        fields=["name", "stock_uom"]
    )

    code_uom_map = {d["name"]: d["stock_uom"] for d in item_uoms}

    # item_name → uom
    item_uom_map = {}
    for row in raw:
        uom = code_uom_map.get(row.item_code)
        if uom:
            item_uom_map[row.item_name] = uom

    #  CORRECT: build ONCE (outside loop)
    item_code_name_map = {}
    for row in raw:
        if row.item_code and row.item_name:
            item_code_name_map[row.item_code] = row.item_name

    # customer data
    customer_map = {}

    for row in raw:
        cust = row.customer
        item = row.item_name

        if cust not in customer_map:
            customer_map[cust] = {}
            for i in item_list:
                customer_map[cust][i] = {"qty": 0, "amt": 0}

        customer_map[cust][item]["qty"] += row.qty
        customer_map[cust][item]["amt"] += row.amount

    return {
        "items": item_list,
        "data": customer_map,
        "uoms": item_uom_map,
        "item_map": item_code_name_map   # ✅ now correct
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