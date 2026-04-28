# # multiple_dis/overrides/sales_controller.py

# import frappe
# from frappe.utils import flt

# def recalc_discounts(doc, method):

#     if doc.get("is_return"):
#         return
#     if doc.get("amended_from"):
#         return

#     doc.ignore_pricing_rule = 1
#     doc.flags.ignore_pricing_rule = True

#     # ── Fetch precisions once, not inside loop ────────────────────────────
#     rate_precision   = frappe.get_precision("Sales Order Item", "rate") or 2
#     amount_precision = frappe.get_precision("Sales Order Item", "amount") or 2
#     disc_precision   = frappe.get_precision("Sales Order Item", "discount_percentage") or 2

#     for row in doc.items:
#         qty     = flt(row.qty)
#         pl_rate = flt(row.price_list_rate)

#         if not qty or not pl_rate:
#             continue

#         d1_pct = flt(row.discount_1_)
#         d2_pct = flt(row.discount_2)

#         # ── Cascading discount with precision at each step ────────────────
#         rate_after_d1 = flt(
#             pl_rate - (pl_rate * d1_pct / 100),
#             rate_precision
#         )
#         final_rate = flt(
#             rate_after_d1 - (rate_after_d1 * d2_pct / 100),
#             rate_precision
#         )

#         # ── Effective combined discount ────────────────────────────────────
#         effective_discount = flt(
#             ((pl_rate - final_rate) / pl_rate) * 100 if pl_rate else 0,
#             disc_precision
#         )

#         # ── Amount with precision ──────────────────────────────────────────
#         final_amount = flt(final_rate * qty, amount_precision)

#         # ── Set row values ─────────────────────────────────────────────────
#         row.rate                = final_rate
#         row.basic_rate          = final_rate
#         row.discount_percentage = effective_discount
#         row.amount              = final_amount
#         row.base_amount         = final_amount
#         row.net_amount          = final_amount
#         row.base_net_amount     = final_amount

#         # ── Reset GST ─────────────────────────────────────────────────────
#         row.igst_amount   = 0
#         row.cgst_amount   = 0
#         row.sgst_amount   = 0
#         row.pricing_rules = None

#     doc.set_missing_values()
#     doc.calculate_taxes_and_totals()



# multiple_dis/overrides/sales_controller.py

import frappe
from frappe.utils import flt

def recalc_discounts(doc, method):

    if doc.get("is_return"):
        return
    if doc.get("amended_from"):
        return

    doc.ignore_pricing_rule = 1
    doc.flags.ignore_pricing_rule = True

    # ── Fetch precisions once, not inside loop ────────────────────────────
    rate_precision   = frappe.get_precision("Sales Order Item", "rate") or 2
    amount_precision = frappe.get_precision("Sales Order Item", "amount") or 2
    disc_precision   = frappe.get_precision("Sales Order Item", "discount_percentage") or 2

    for row in doc.items:
        qty     = flt(row.qty)
        pl_rate = flt(row.price_list_rate)

        if not qty or not pl_rate:
            continue

        d1_pct = flt(row.discount_1_)
        d2_pct = flt(row.discount_2)

        # ── Cascading discount with precision at each step ────────────────
        rate_after_d1 = flt(
            pl_rate - (pl_rate * d1_pct / 100),
            rate_precision
        )
        final_rate = flt(
            rate_after_d1 - (rate_after_d1 * d2_pct / 100),
            rate_precision
        )

        # ── Effective combined discount ────────────────────────────────────
        effective_discount = flt(
            ((pl_rate - final_rate) / pl_rate) * 100 if pl_rate else 0,
            disc_precision
        )

        # ── Amount with precision ──────────────────────────────────────────
        final_amount = flt(final_rate * qty, amount_precision)

        # ── Set row values ─────────────────────────────────────────────────
        row.rate                        = final_rate
        row.base_rate                   = final_rate
        row.basic_rate                  = final_rate
        row.net_rate                    = final_rate
        row.base_net_rate               = final_rate
        row.stock_uom_rate              = final_rate
        row.discount_percentage         = effective_discount
        row.discount_amount             = 0
        row.distributed_discount_amount = 0
        row.amount                      = final_amount
        row.base_amount                 = final_amount
        row.net_amount                  = final_amount
        row.base_net_amount             = final_amount
        row.pricing_rules               = None

    doc.set_missing_values()
    doc.calculate_taxes_and_totals()
 