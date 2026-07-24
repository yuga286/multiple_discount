import frappe

from erpnext.stock.report.stock_balance.stock_balance import (
    execute as stock_balance_execute
)


def execute(filters=None):

    # columns, data = stock_balance_execute(filters)
    
    base_columns, data = stock_balance_execute(filters)

    # =====================================================
    # ADD COLUMNS
    # =====================================================
    columns = [
        {
            "label": "Item Name",
            "fieldname": "item_name",
            "fieldtype": "Data",
            "width": 180,
        },
        {
            "label": "Item Group",
            "fieldname": "item_group",
            "fieldtype": "Link",
            "options": "Item Group",
            "width": 140,
        },
        {
            "label": "Warehouse",
            "fieldname": "warehouse",
            "fieldtype": "Link",
            "options": "Warehouse",
            "width": 180,
        },
        {
            "label": "Opening Qty",
            "fieldname": "opening_qty",
            "fieldtype": "Float",
            "width": 130,
        },
        {
            "label": "Stock UOM",
            "fieldname": "stock_uom",
            "fieldtype": "Link",
            "options": "UOM",
            "width": 110,
        },
        {
            "label": "In Qty",
            "fieldname": "in_qty",
            "fieldtype": "Float",
            "width": 120,
        },
        {
            "label": "Out Qty",
            "fieldname": "out_qty",
            "fieldtype": "Float",
            "width": 120,
        },
        {
            "label": "Balance Qty",
            "fieldname": "bal_qty",
            "fieldtype": "Float",
            "width": 130,
        },
        {
        "label": "Reorder Qty Fixed",
        "fieldname": "warehouse_reorder_level",
        "fieldtype": "Float",
        # "options": "Warehouse",
        "width": 160,
        },
        {
        "label": "Reorder Qty Fixed Manifacturing",
        "fieldname": "warehouse_reorder_qty",
        "fieldtype": "Float",
        "width": 180,
        }
    ]
    

    # =====================================================
    # GET ITEM CODES
    # =====================================================
    item_codes = list({
        d.get("item_code")
        for d in data
        if d.get("item_code")
    })

    if not item_codes:
        return columns, data

    # =====================================================
    # FETCH REORDER DATA
    # =====================================================
    # reorder_rows = frappe.get_all(
    #     "Item Reorder",
    #     filters={
    #         "parent": ["in", item_codes],
    #         "parenttype": "Item",
    #         "parentfield": "warehouse_reorder_level",
    #     },
    #     fields=[
    #         "parent",
    #         "warehouse",
    #         "warehouse_reorder_qty",
    #     ]
    # )

    # reorder_map = {}

    # for d in reorder_rows:

    #     reorder_map[(d.parent, d.warehouse)] = {
    #         "warehouse": d.warehouse or "",
    #         "warehouse_reorder_level": (
    #             d.warehouse_reorder_level or 0
    #         )
    #     }

    # # =====================================================
    # # APPEND VALUES
    # # =====================================================
    # for row in data:

    #     key = (
    #         row.get("item_code"),
    #         row.get("warehouse"),
    #     )

    #     reorder_data = reorder_map.get(key, {})

    #     row["reorder_warehouse_custom"] = (
    #         reorder_data.get("warehouse", "")
    #     )

    #     row["warehouse_reorder_level_custom"] = (
    #         reorder_data.get(
    #             "warehouse_reorder_level",
    #             0
    #         )
    #     )

    # return columns, data
    
    
    reorder_rows = frappe.get_all(
        "Item Reorder",
        filters={
            "parent": ["in", item_codes],
            "parenttype": "Item",
            "parentfield": "reorder_levels",
        },
        fields=[
            "parent",
            "warehouse",
            "warehouse_reorder_level",
            "warehouse_reorder_qty",
        ]
    )
    
    reorder_map = {}

    for d in reorder_rows:

        reorder_map[(d.parent, d.warehouse)] = {
            "warehouse_reorder_level": (
                d.warehouse_reorder_level or 0
            ),
            "warehouse_reorder_qty": (
                d.warehouse_reorder_qty or 0
            )
        }
    
    for row in data:

        key = (
            row.get("item_code"),
            row.get("warehouse"),
        )

        reorder_data = reorder_map.get(key, {})

        row["warehouse_reorder_level"] = (
            reorder_data.get(
                "warehouse_reorder_level",
                0
            )
        )

        row["warehouse_reorder_qty"] = (
            reorder_data.get(
                "warehouse_reorder_qty",
                0
            )
        )
        
    return columns, data