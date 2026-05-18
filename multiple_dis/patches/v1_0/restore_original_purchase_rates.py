"""
Restores item.rate values that were incorrectly modified by the old
before_validate discount hook (which set rate = price_list_rate * (1-disc/100)).

Safe to run multiple times (idempotent).
Only touches draft (docstatus = 0) documents; submitted docs are left alone
— cancel and re-create them via the standard ERPNext amendment workflow.

Detection heuristic
-------------------
  A row was corrupted when ALL of:
    • discount > 0
    • price_list_rate > 0
    • rate ≈ price_list_rate * (1 - discount/100)   within 0.01 tolerance

  For such rows we restore: rate = price_list_rate
"""

import frappe
from frappe.utils import flt


def execute():
    targets = [
        ("Purchase Order",   "Purchase Order Item",   "tabPurchase Order Item"),
        ("Purchase Receipt", "Purchase Receipt Item", "tabPurchase Receipt Item"),
        ("Purchase Invoice", "Purchase Invoice Item", "tabPurchase Invoice Item"),
    ]

    for parent_dt, child_dt, child_table in targets:
        rows = frappe.db.sql(
            f"""
            SELECT
                child.name,
                child.parent,
                child.discount,
                child.rate,
                child.price_list_rate
            FROM `{child_table}` child
            INNER JOIN `tab{parent_dt}` par ON par.name = child.parent
            WHERE par.docstatus = 0
              AND child.discount > 0
              AND child.price_list_rate > 0
              AND ABS(
                    child.rate
                    - (child.price_list_rate * (1.0 - child.discount / 100.0))
                  ) < 0.01
            """,
            as_dict=True,
        )

        count = 0
        for row in rows:
            original_rate = flt(row.price_list_rate)
            frappe.db.set_value(
                child_dt,
                row.name,
                "rate",
                original_rate,
                update_modified=False,
            )
            count += 1

        if count:
            frappe.db.commit()
            frappe.logger().info(
                f"[restore_original_purchase_rates] Restored rate on {count} rows in {child_dt}"
            )
            print(f"  {child_dt}: restored {count} rows")
