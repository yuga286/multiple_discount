"""
Custom TaxesAndTotals for Purchase Order, Purchase Receipt, Purchase Invoice.

Design
------
  original_amount  = qty * rate                          ← always recomputed
  discount_amount  = original_amount * discount / 100
  final_amount     = original_amount - discount_amount

  When discount = 0  →  final_amount = qty * rate        (fully restored)
  When discount changes  →  always based on original qty*rate, never cumulative

Fields NEVER modified
---------------------
  rate, price_list_rate, base_rate  and all other rate/price fields

Fields updated by this module
-----------------------------
  amount           = final_amount
  net_amount       = final_amount
  base_amount      = final_amount * conversion_rate
  base_net_amount  = final_amount * conversion_rate
  net_rate         = final_amount / qty   (kept consistent with net_amount)
  base_net_rate    = net_rate * conversion_rate

Everything downstream — taxes, TDS, grand_total, outstanding_amount,
base_grand_total, GL entry amounts — is then computed correctly by
ERPNext's own pipeline which reads net_amount / net_total as its tax base.
"""

import frappe
from frappe.utils import flt

from erpnext.controllers.taxes_and_totals import calculate_taxes_and_totals as _Base
from erpnext.buying.doctype.purchase_order.purchase_order import PurchaseOrder
from erpnext.stock.doctype.purchase_receipt.purchase_receipt import PurchaseReceipt
from erpnext.accounts.doctype.purchase_invoice.purchase_invoice import PurchaseInvoice


# ---------------------------------------------------------------------------
# Custom tax / total calculator
# ---------------------------------------------------------------------------

class DiscountedTaxesAndTotals(_Base):
    """
    Extends ERPNext's TaxesAndTotals so that a custom ``discount`` percentage
    on each item row reduces amount / net_amount without touching rate.

    Injected via override_doctype_class for all three purchase doctypes so
    every call to doc.calculate_taxes_and_totals() uses our version.
    """

    def calculate_item_values(self):
        # Step 1 – standard ERPNext calculation.
        # After this: rate unchanged, amount = rate * qty, net_amount = amount.
        super().calculate_item_values()

        # Step 2 – skip the second _calculate pass that ERPNext makes when
        # distributing a document-level discount_amount across items.
        # discount_amount_applied is True during that pass; applying our
        # per-item discount a second time would double-discount.
        if self.discount_amount_applied:
            return

        conv = flt(self.doc.conversion_rate) or 1.0

        for item in self._items:
            discount_pct = flt(item.get("discount"))

            if not discount_pct:
                # Discount is 0 — amount already equals rate * qty (correct).
                # No action needed; previous discounts are automatically undone
                # because super() always resets amount = rate * qty first.
                continue

            # ── Gross (original) amount ──────────────────────────────────────
            # Derived from the live rate × qty so the result is always
            # idempotent: changing discount back to 0 or to any other value
            # uses the unmodified rate, never a previously-discounted amount.
            qty = flt(item.qty)
            if qty:
                original_amount = flt(item.rate) * qty
            else:
                # Edge-case: debit notes / return rows where qty = 0.
                # super() already handled the correct amount for these; apply
                # our percentage on top of that computed value.
                original_amount = flt(item.amount)

            if not original_amount:
                continue

            # ── Final discounted amount ──────────────────────────────────────
            prec_a  = item.precision("amount")
            prec_na = item.precision("net_amount")

            final_amount = flt(
                original_amount * (1.0 - discount_pct / 100.0), prec_a
            )

            # ── Overwrite amount fields; never touch rate / base_rate ────────
            item.amount          = final_amount
            item.net_amount      = flt(final_amount, prec_na)

            item.base_amount     = flt(final_amount * conv, item.precision("base_amount"))
            item.base_net_amount = flt(final_amount * conv, item.precision("base_net_amount"))

            # Keep net_rate consistent with net_amount / qty so that the tax
            # engine's per-item tax breakdown is correct.
            # item.rate and item.base_rate are intentionally left unchanged.
            if qty:
                item.net_rate      = flt(final_amount / qty, item.precision("net_rate"))
                item.base_net_rate = flt(item.net_rate * conv, item.precision("base_net_rate"))


# ---------------------------------------------------------------------------
# Custom doctype controllers
# ---------------------------------------------------------------------------

class CustomPurchaseOrder(PurchaseOrder):
    def calculate_taxes_and_totals(self):
        DiscountedTaxesAndTotals(self)


class CustomPurchaseReceipt(PurchaseReceipt):
    def calculate_taxes_and_totals(self):
        DiscountedTaxesAndTotals(self)


class CustomPurchaseInvoice(PurchaseInvoice):
    def calculate_taxes_and_totals(self):
        DiscountedTaxesAndTotals(self)