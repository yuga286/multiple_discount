from frappe.utils import flt


def apply_discount(doc, method):

    total = 0

    for row in doc.items:

        qty = flt(row.qty)
        rate = flt(row.rate)
        discount = flt(row.discount)

        original_amount = qty * rate

        final_amount = (
            original_amount -
            (original_amount * discount / 100)
        )

        # FINAL overwrite
        row.amount = final_amount
        row.base_amount = final_amount
        row.net_amount = final_amount
        row.base_net_amount = final_amount

        total += final_amount

    # overwrite parent totals
    doc.total = total
    doc.net_total = total
    doc.base_total = total
    doc.base_net_total = total

    doc.grand_total = total
    doc.base_grand_total = total
    doc.rounded_total = total