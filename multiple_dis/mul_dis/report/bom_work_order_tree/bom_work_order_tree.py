import frappe

def execute(filters=None):
    columns = [
        {"label": "Name", "fieldname": "label", "fieldtype": "Data", "width": 400},
        {"label": "Stock Entry Qty", "fieldname": "se_qty", "fieldtype": "Float", "width": 150},
        {"label": "Excess Output Qty", "fieldname": "difference", "fieldtype": "Float", "width": 150},
        {"label": "Difference", "fieldname": "actual_qty", "fieldtype": "Float", "width": 150},
    ]

    data = []

    boms = frappe.get_all("BOM", fields=["name"])

    for bom in boms:
        #  BOM
        data.append({
            "name": bom.name,
            "parent": "",
            "label": f"BOM: {bom.name}",
            "indent": 0
        })

        work_orders = frappe.get_all(
            "Work Order",
            filters={"bom_no": bom.name},
            fields=["name"]
        )

        for wo in work_orders:
            #  Work Order
            data.append({
                "name": wo.name,
                "parent": bom.name,
                "label": f"WO: {wo.name}",
                "indent": 1
            })

            #  Adjustment Data
            adjustments = frappe.get_all(
                "Work Order Adjustment",
                filters={"parent": wo.name},
                fields=["name", "item_code", "qty"]
            )

            #  Stock Entry Data
            se_data = frappe.db.sql("""
                SELECT
                    sed.item_code,
                    SUM(sed.qty) as qty
                FROM
                    `tabStock Entry Detail` sed
                INNER JOIN
                    `tabStock Entry` se ON se.name = sed.parent
                WHERE
                    se.work_order = %s
                GROUP BY
                    sed.item_code
            """, wo.name, as_dict=1)

            se_map = {d.item_code: d.qty for d in se_data}

            # #  SINGLE LOOP (correct)
            # for adj in adjustments:
            #     actual = adj.qty or 0
            #     se_qty = se_map.get(adj.item_code, 0)

            #     data.append({
            #         "name": adj.name,
            #         "parent": wo.name,
            #         "label": adj.item_code,
            #         "actual_qty": actual,
            #         "se_qty": se_qty,
            #         "difference": se_qty + actual,
            #         "indent": 2
            #     })
            
            adj_map = {d.item_code: d.qty for d in adjustments}

            all_items = set(list(adj_map.keys()) + list(se_map.keys()))

            for item in all_items:
                se_qty = se_map.get(item, 0)

                #  ONLY from adjustment
                actual = adj_map.get(item)  # don't default here

                data.append({
                    "name": f"{wo.name}-{item}",
                    "parent": wo.name,
                    "label": item,
                    "actual_qty": actual if actual is not None else 0,  # 🔥 strict 0
                    "se_qty": se_qty,
                    "difference": (actual + se_qty) if actual is not None else 0,
                    "indent": 2
                })
    
    
    
    return columns, data





# import frappe

# def execute(filters=None):
#     columns = [
#         {"label": "Name", "fieldname": "label", "fieldtype": "Data", "width": 400},
#         {"label": "Stock Entry Qty", "fieldname": "se_qty", "fieldtype": "Float", "width": 150},
#         {"label": "Excess Output Qty", "fieldname": "difference", "fieldtype": "Float", "width": 150},
#         {"label": "Difference", "fieldname": "actual_qty", "fieldtype": "Float", "width": 150},
#     ]

#     data = []

#     boms = frappe.get_all("BOM", fields=["name"])

#     for bom in boms:
#         #  BOM Row
#         data.append({
#             "name": bom.name,
#             "parent": "",
#             "label": f"BOM: {bom.name}",
#             "indent": 0
#         })

#         work_orders = frappe.get_all(
#             "Work Order",
#             filters={"bom_no": bom.name},
#             fields=["name"]
#         )

#         for wo in work_orders:
#             #  Work Order Row
#             data.append({
#                 "name": wo.name,
#                 "parent": bom.name,
#                 "label": f"WO: {wo.name}",
#                 "indent": 1
#             })

#             #  Adjustment Data
#             adjustments = frappe.get_all(
#                 "Work Order Adjustment",
#                 filters={"parent": wo.name},
#                 fields=["item_code", "qty"]
#             )

#             # Convert to map → item_code : qty
#             adj_map = {}
#             for adj in adjustments:
#                 adj_map[adj.item_code] = adj.qty or 0

#             #  Stock Entry Data
#             se_data = frappe.db.sql("""
#                 SELECT
#                     sed.item_code,
#                     SUM(sed.qty) as qty
#                 FROM
#                     `tabStock Entry Detail` sed
#                 INNER JOIN
#                     `tabStock Entry` se ON se.name = sed.parent
#                 WHERE
#                     se.work_order = %s
#                 GROUP BY
#                     sed.item_code
#             """, wo.name, as_dict=1)

#             se_map = {}
#             for d in se_data:
#                 se_map[d.item_code] = d.qty or 0

#             # MAIN LOGIC → LOOP ON STOCK ENTRY ITEMS
#             for item_code, se_qty in se_map.items():

#                 actual = adj_map.get(item_code, 0)  # if no adjustment → 0

#                 data.append({
#                     "name": f"{wo.name}-{item_code}",
#                     "parent": wo.name,
#                     "label": item_code,
#                     "actual_qty": actual,
#                     "se_qty": se_qty,
#                     "difference": se_qty + actual,
#                     "indent": 2
#                 })
            
#             # #  MERGE BOTH ITEM SOURCES
#             # all_items = set(se_map.keys()) | set(adj_map.keys())

#             # for item_code in all_items:
#             #     se_qty = se_map.get(item_code, 0)
#             #     actual = adj_map.get(item_code, 0)  # no adjustment → 0

#             #     data.append({
#             #         "name": f"{wo.name}-{item_code}",
#             #         "parent": wo.name,
#             #         "label": item_code,
#             #         "actual_qty": actual,
#             #         "se_qty": se_qty,
#             #         "difference": actual,  # THIS is your "Excess Output Qty"
#             #         "indent": 2
#             #     })

#     return columns, data