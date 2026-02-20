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

    def update_raw_materials(self):

        if self.custom_bom_quantity_fixed:
            return

        super().update_raw_materials()
        
    def validate_bom(self):
        if self.custom_bom_quantity_fixed:
            return
        super().validate_bom()
    def validate_material_consumption(self):
        if self.custom_bom_quantity_fixed:
            return
        super().validate_material_consumption()
        
    def validate_material_consumption_for_manufacture(self):
        if self.custom_bom_quantity_fixed:
            return
        return super().validate_material_consumption_for_manufacture()

      