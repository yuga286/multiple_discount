# import frappe
# from frappe import _

# def execute(filters=None):
#     columns = []
#     data = []

#     # 🔹 Step 1: Get all items (you can filter if needed)
#     items = frappe.db.sql("""
#         SELECT DISTINCT sii.item_code
#         FROM `tabSales Invoice Item` sii
#         INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
#         WHERE si.docstatus = 1
#     """, as_dict=1)

#     item_list = [d.item_code for d in items]

#     # 🔹 Step 2: Define columns
#     # columns.append({
#     #     "label": "Customer",
#     #     "fieldname": "customer",
#     #     "fieldtype": "Link",
#     #     "options": "Customer",
#     #     "width": 200
#     # })

#     # for item in item_list:
#     #     columns.append({
#     #         "label": f"{item} Qty",
#     #         "fieldname": f"{item}_qty",
#     #         "fieldtype": "Float",
#     #         "width": 120
#     #     })
#     #     columns.append({
#     #         "label": f"{item} Amount",
#     #         "fieldname": f"{item}_amount",
#     #         "fieldtype": "Currency",
#     #         "width": 120
#     #     })
    
#     columns.append({
#         "label": "Customer",
#         "fieldname": "customer",
#         "fieldtype": "Link",
#         "options": "Customer",
#         "width": 200
#     })

#     for item in item_list:
#         columns.append({
#             "label": item,   # item only once
#             "fieldname": item,
#             "fieldtype": "Data",   # IMPORTANT
#             "width": 180
#         })
#     for item in item_list:
#         columns.append({
#             "label": f"""<div style="text-align:center">
#                             <b>{item}</b><br>
#                             <span style="font-size:11px">Qty</span>
#                         </div>""",
#             "fieldname": f"{item}_qty",
#             "fieldtype": "Float",
#             "width": 120
#         })

#         columns.append({
#             "label": f"""<div style="text-align:center">
#                             <b>{item}</b><br>
#                             <span style="font-size:11px">Value</span>
#                         </div>""",
#             "fieldname": f"{item}_amount",
#             "fieldtype": "Currency",
#             "width": 120
#         })

#     # 🔹 Step 3: Fetch data
#     raw_data = frappe.db.sql("""
#         SELECT
#             si.customer,
#             sii.item_code,
#             SUM(sii.qty) as qty,
#             SUM(sii.amount) as amount
#         FROM `tabSales Invoice` si
#         INNER JOIN `tabSales Invoice Item` sii ON si.name = sii.parent
#         WHERE si.docstatus = 1
#         GROUP BY si.customer, sii.item_code
#     """, as_dict=1)

#     # 🔹 Step 4: Transform (Pivot)
#     customer_map = {}

#     for row in raw_data:
#         customer = row.customer

#         if customer not in customer_map:
#             customer_map[customer] = {"customer": customer}

#             # initialize all fields
#             for item in item_list:
#                 customer_map[customer][f"{item}_qty"] = 0
#                 customer_map[customer][f"{item}_amount"] = 0

#         # customer_map[customer][f"{row.item_code}_qty"] = row.qty
#         # customer_map[customer][f"{row.item_code}_amount"] = row.amount
        
#         customer_map[customer][f"{row.item_code}_qty"] += row.qty or 0
#         customer_map[customer][f"{row.item_code}_amount"] += row.amount or 0
        
#         customer_map[customer][row.item_code] = f"""
#         <div style='display:flex; justify-content:space-between'>
#             <span>{qty}</span>
#             <span>{amt}</span>
#         </div>
#         """

#     data = list(customer_map.values())

#     return columns, data






import frappe

def execute(filters=None):
    columns = []
    data = []

    #  Step 1: Get all items
    items = frappe.db.sql("""
        SELECT DISTINCT sii.item_code
        FROM `tabSales Invoice Item` sii
        INNER JOIN `tabSales Invoice` si ON si.name = sii.parent
        WHERE si.docstatus = 1
    """, as_dict=1)

    item_list = [d.item_code for d in items]

    # Step 2: Columns
    columns.append({
        "label": "Customer",
        "fieldname": "customer",
        "fieldtype": "Link",
        "options": "Customer",
        "width": 200
    })

    #  ONE column per item
    for item in item_list:
        columns.append({
            "label": item,
            "fieldname": item,
            "fieldtype": "Data",
            "width": 180
        })
    
    # for item in item_list:
    #     columns.append({
    #         "label": f"""
    #             <div style="text-align:center;">
    #                 <div><b>{item}</b></div>
    #                 <div style="font-size:11px; margin-top:4px;">
    #                     Qty &nbsp;&nbsp;&nbsp; Amt
    #                 </div>
    #             </div>
    #         """,
    #         "fieldname": item,
    #         "fieldtype": "Data",
    #         "width": 180
    #     })
    
    
    #  Step 3: Fetch data
    raw_data = frappe.db.sql("""
        SELECT
            si.customer,
            sii.item_code,
            SUM(IFNULL(sii.qty, 0)) as qty,
            SUM(IFNULL(sii.amount, 0)) as amount
        FROM `tabSales Invoice` si
        INNER JOIN `tabSales Invoice Item` sii ON si.name = sii.parent
        WHERE si.docstatus = 1
        GROUP BY si.customer, sii.item_code
    """, as_dict=1)

    #  Step 4: Pivot
    customer_map = {}

    for row in raw_data:
        customer = row.customer

        if customer not in customer_map:
            customer_map[customer] = {"customer": customer}

            # initialize
            for item in item_list:
                customer_map[customer][f"{item}_qty"] = 0
                customer_map[customer][f"{item}_amount"] = 0

        # accumulate
        customer_map[customer][f"{row.item_code}_qty"] += row.qty
        customer_map[customer][f"{row.item_code}_amount"] += row.amount

    #  Step 5: Build HTML (CORRECT PLACE)
    for customer in customer_map:
        for item in item_list:
            qty = customer_map[customer].get(f"{item}_qty", 0)
            amt = customer_map[customer].get(f"{item}_amount", 0)

            customer_map[customer][item] = f"""
            <div style='display:flex; justify-content:space-between'>
                <span>{qty}</span>
                <span>{amt}</span>
            </div>
            """
            
    data = list(customer_map.values())

    return columns, data