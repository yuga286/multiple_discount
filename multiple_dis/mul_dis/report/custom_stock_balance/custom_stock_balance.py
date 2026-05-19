# from erpnext.stock.report.stock_balance.stock_balance import execute as stock_balance_execute


# import frappe

# def execute(filters=None):

#     columns, data = stock_balance_execute(filters)

#     columns.extend([
#         {
#             "label": "Reorder Qty Fixed",
#             "fieldname": "reorder_qty_fixed",
#             "fieldtype": "Float",
#             "width": 140
#         },
#         {
#             "label": "Reorder Qty Fix Manufacturing",
#             "fieldname": "reorder_qty_fix_manufacturing",
#             "fieldtype": "Float",
#             "width": 180
#         }
#     ])

#     for row in data:

#         work_order = frappe.db.sql("""
#             SELECT
#                 SUM(reorder_qty_fixed) as reorder_qty_fixed,
#                 SUM(reorder_qty_fix_manufacturing) as reorder_qty_fix_manufacturing
#             FROM `tabWork Order`
#             WHERE production_item = %s
#             AND docstatus < 2
#         """, row.get("item_code"), as_dict=1)

#         if work_order:
#             row["reorder_qty_fixed"] = work_order[0].reorder_qty_fixed or 0
#             row["reorder_qty_fix_manufacturing"] = (
#                 work_order[0].reorder_qty_fix_manufacturing or 0
#             )

#     return columns, data







# from erpnext.stock.report.stock_balance.stock_balance import execute as stock_balance_execute

# import frappe


# def execute(filters=None):

#     columns, data = stock_balance_execute(filters)

#     columns.extend([
#         {
#             "label": "Reorder Qty Fixed",
#             "fieldname": "reorder_qty_fixed",
#             "fieldtype": "Float",
#             "width": 140
#         },
#         {
#             "label": "Reorder Qty Fix Manufacturing",
#             "fieldname": "reorder_qty_fix_manufacturing",
#             "fieldtype": "Float",
#             "width": 180
#         }
#     ])

#     item_codes = [row.get("item_code") for row in data if row.get("item_code")]

#     work_order_map = {}

#     if item_codes:

#         work_orders = frappe.db.sql("""
#             SELECT
#                 production_item,

#                 SUM(reorder_qty_fixed) as reorder_qty_fixed,

#                 SUM(reorder_qty_fix_manufacturing)
#                     as reorder_qty_fix_manufacturing

#             FROM `tabWork Order`

#             WHERE production_item IN %(item_codes)s
#             AND docstatus < 2

#             GROUP BY production_item
#         """, {
#             "item_codes": tuple(item_codes)
#         }, as_dict=True)

#         work_order_map = {
#             d.production_item: d for d in work_orders
#         }

#     for row in data:

#         work_order = work_order_map.get(row.get("item_code"))

#         row["reorder_qty_fixed"] = (
#             work_order.reorder_qty_fixed
#             if work_order else 0
#         )

#         row["reorder_qty_fix_manufacturing"] = (
#             work_order.reorder_qty_fix_manufacturing
#             if work_order else 0
#         )

#     return columns, data



# from erpnext.stock.report.stock_balance.stock_balance import execute as stock_balance_execute

# import frappe


# def execute(filters=None):

#     columns, data = stock_balance_execute(filters)

#     # INSERT columns after Balance Qty
#     balance_qty_index = next(
#         (
#             i for i, col in enumerate(columns)
#             if col.get("fieldname") == "bal_qty"
#         ),
#         len(columns)
#     )

#     columns.insert(balance_qty_index + 1, {
#         "label": "Reorder Qty Fixed",
#         "fieldname": "warehouse_reorder_level",
#         "fieldtype": "Float",
#         "width": 150
#     })

#     columns.insert(balance_qty_index + 2, {
#         "label": "Reorder Qty Fixed Manufacturing",
#         "fieldname": "warehouse_reorder_qty",
#         "fieldtype": "Float",
#         "width": 220
#     })

#     item_codes = [
#         row.get("item_code")
#         for row in data
#         if row.get("item_code")
#     ]

#     # FETCH WORK ORDER DATA
#     # work_orders = frappe.db.sql("""
#     #     SELECT
#     #         production_item,

#     #         SUM(reorder_qty_fix_manufacturing)
#     #             AS reorder_qty_fix_manufacturing

#     #     FROM `tabWork Order`

#     #     WHERE production_item IN %(item_codes)s
#     #     AND docstatus < 2

#     #     GROUP BY production_item
#     # """, {
#     #     "item_codes": tuple(item_codes)
#     # }, as_dict=True)

#     # work_order_map = {
#     #     d.production_item: d
#     #     for d in work_orders
#     # }
#     work_order_map = {}

#     if item_codes:

#         work_orders = frappe.db.sql("""
#             SELECT
#                 item,

#                 SUM(warehouse_reorder_qty)
#                     AS warehouse_reorder_qty

#             FROM `tabItem Reorder`

#             WHERE item IN %(item_codes)s
#             AND docstatus < 2

#             GROUP BY item
#         """, {
#             "item_codes": item_codes
#         }, as_dict=True)

#         work_order_map = {
#             d.item: d
#             for d in work_orders
#         }

#     for row in data:

#         item_code = row.get("item_code")

#         # ITEM MASTER VALUE
#         row["reorder_qty_fixed"] = frappe.db.get_value(
#             "Item",
#             item_code,
#             "reorder_qty_fixed"
#         ) or 0

#         # WORK ORDER VALUE
#         work_order = work_order_map.get(item_code)

#         row["reorder_qty_fix_manufacturing"] = (
#             work_order.reorder_qty_fix_manufacturing
#             if work_order else 0
#         )

#     return columns, data





from erpnext.stock.report.stock_balance.stock_balance import execute as stock_balance_execute

import frappe


def execute(filters=None):

    columns, data = stock_balance_execute(filters)

    # INSERT COLUMNS AFTER BALANCE QTY
    balance_qty_index = next(
        (
            i for i, col in enumerate(columns)
            if col.get("fieldname") == "bal_qty"
        ),
        len(columns)
    )

    columns.insert(balance_qty_index + 1, {
        "label": "Reorder Qty Fixed",
        "fieldname": "warehouse_reorder_level",
        "fieldtype": "Float",
        "width": 150
    })

    columns.insert(balance_qty_index + 2, {
        "label": "Reorder Qty Fixed Manufacturing",
        "fieldname": "warehouse_reorder_qty",
        "fieldtype": "Float",
        "width": 220
    })

    item_codes = [
        row.get("item_code")
        for row in data
        if row.get("item_code")
    ]

    reorder_map = {}

    if item_codes:

        reorder_data = frappe.db.sql("""
            SELECT
                SUM(warehouse_reorder_level)
                    AS warehouse_reorder_level,

                SUM(warehouse_reorder_qty)
                    AS warehouse_reorder_qty

            FROM `tabItem Reorder`
        """, {
            "item_codes": item_codes
        }, as_dict=True)

        reorder_map = {
            d.item: d
            for d in reorder_data
        }

    for row in data:

        item_code = row.get("item_code")

        reorder = reorder_map.get(item_code)

        row["warehouse_reorder_level"] = (
            reorder.warehouse_reorder_level
            if reorder else 0
        )

        row["warehouse_reorder_qty"] = (
            reorder.warehouse_reorder_qty
            if reorder else 0
        )

    return columns, data