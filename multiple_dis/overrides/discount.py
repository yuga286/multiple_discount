"""
DEPRECATED — no longer contains executable code.

The previous before_validate hook here incorrectly modified item.rate:
    rate = price_list_rate * (1 - discount / 100)

That caused:
  1. rate changed permanently → "Maintain Same Rate" error on PI
  2. changing discount back to 0% did not restore the original amount
  3. taxes calculated before the hook ran, so they used the pre-discount base
  4. base_grand_total, outstanding_amount were manually overwritten incorrectly

The correct implementation is in:
    multiple_dis/overrides/purchase_controller.py  →  DiscountedTaxesAndTotals

Registered via override_doctype_class in hooks.py.
No doc_event hooks are needed for purchase documents.
"""
