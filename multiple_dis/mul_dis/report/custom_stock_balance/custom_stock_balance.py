import frappe

from gc_foods.stock.report.stock_balance_report_item_wise.stock_balance_report_item_wise import (
    execute as stock_balance_report_item_wise_execute
)


def execute(filters=None):

    # GET EXISTING REPORT
    columns, data = stock_balance_report_item_wise_execute(filters)

    # ---------------------------------------------------------
    # APPEND NEW COLUMNS
    # ---------------------------------------------------------
    columns.extend([
        {
            "label": "Reorder Warehouse",
            "fieldname": "reorder_warehouse_custom",
            "fieldtype": "Link",
            "options": "Warehouse",
            "width": 160,
        },
        {
            "label": "Warehouse Reorder Level",
            "fieldname": "warehouse_reorder_level_custom",
            "fieldtype": "Float",
            "width": 180,
        },
    ])

    # ---------------------------------------------------------
    # GET ITEM CODES
    # ---------------------------------------------------------
    item_codes = list({
        row.get("item_code")
        for row in data
        if row.get("item_code")
    })

    if not item_codes:
        return columns, data

    # ---------------------------------------------------------
    # FETCH REORDER DATA
    # ---------------------------------------------------------
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
        ]
    )

    # ---------------------------------------------------------
    # MAP DATA
    # ---------------------------------------------------------
    reorder_map = {}

    for d in reorder_rows:

        reorder_map[(d.parent, d.warehouse)] = {
            "warehouse": d.warehouse or "",
            "warehouse_reorder_level": (
                d.warehouse_reorder_level or 0
            ),
        }

    # ---------------------------------------------------------
    # ADD VALUES TO ROWS
    # ---------------------------------------------------------
    for row in data:

        key = (
            row.get("item_code"),
            row.get("warehouse"),
        )

        reorder_data = reorder_map.get(key, {})

        row["reorder_warehouse_custom"] = (
            reorder_data.get("warehouse", "")
        )

        row["warehouse_reorder_level_custom"] = (
            reorder_data.get(
                "warehouse_reorder_level",
                0
            )
        )

    return columns, data