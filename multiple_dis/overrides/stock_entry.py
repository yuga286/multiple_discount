
# from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry
# from frappe.utils import flt

# class CustomStockEntry(StockEntry):

#     def validate(self):

#         # If freeze not enabled → run full ERP validation
#         if not self.custom_bom_quantity_fixed:
#             return super().validate()

#         #  Freeze mode enabled

#         # 1️ Force FG row to match fg_completed_qty
#         for row in self.items:
#             if row.is_finished_item:
#                 row.qty = self.fg_completed_qty
#                 row.transfer_qty = self.fg_completed_qty

#         # 2️ Now call ONLY safe validations
#         self.validate_posting_time()
#         self.validate_purpose()
#         self.validate_uom_is_integer("qty")
#         self.validate_serialized_batch()

#         # Skip:
#         # - FG strict qty check
#         # - BOM validation
#         # - Work Order validation

#         # 3️ Continue remaining core logic without strict manufacturing checks
#         self.calculate_rate_and_amount()


# from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry

# class CustomStockEntry(StockEntry):

#     def update_raw_materials(self):

#         # If freeze enabled → do NOT recalculate RM qty
#         if self.custom_bom_quantity_fixed:
#             return

#         # Otherwise normal ERP behaviour
#         super().update_raw_materials()

# from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry

# class CustomStockEntry(StockEntry):

#     def update_raw_materials(self):

#         if self.custom_bom_quantity_fixed:
#             return

#         super().update_raw_materials()
    
#     def validate_finished_goods(self):

#         #  If freeze enabled → completely skip FG strict validation
#         if self.custom_bom_quantity_fixed:
#             return

#         # Otherwise normal ERP behaviour
#         super().validate_finished_goods()

#     # def validate(self):

#     #     if self.custom_bom_quantity_fixed:
#     #         for row in self.items:
#     #             if row.is_finished_item:
#     #                 self.fg_completed_qty = row.qty
#     #                 row.transfer_qty = row.qty

#         super().validate()

from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry
from frappe.utils import flt

class CustomStockEntry(StockEntry):

    def validate(self):

        if not self.custom_bom_quantity_fixed:
            # Normal ERP behaviour
            return super().validate()

        #  Freeze mode: skip FG qty mismatch validation

        # Temporarily make values equal so ERP doesn't throw error
        original_fg_qty = self.fg_completed_qty

        for row in self.items:
            if row.is_finished_item:
                self.fg_completed_qty = row.qty

        # Run full ERP validation
        super().validate()

        # Restore original fg_completed_qty (NEW VALUE STAYS)
        self.fg_completed_qty = original_fg_qty
