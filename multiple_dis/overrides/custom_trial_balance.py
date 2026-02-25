# import frappe
# from frappe import _
# from frappe.utils import flt, getdate
# import erpnext

# from erpnext.accounts.report.trial_balance.trial_balance import (
#     validate_filters,
#     get_columns,
#     get_data as original_get_data
# )
# frappe.msgprint("Custom Trial Balance Loaded")

# def execute(filters=None):
#     frappe.msgprint("Override Working")
#     validate_filters(filters)

#     columns = get_columns()

#     # Get original data
#     data = original_get_data(filters)

#     # Rebuild debtors subtree
#     data = rebuild_debtors_tree(data, filters)

#     return columns, data

# def rebuild_debtors_tree(data, filters):

#     company_currency = (
#         filters.presentation_currency
#         or frappe.get_cached_value("Company", filters.company, "default_currency")
#     )

#     result = []
#     debtors_account_name = None
#     debtors_indent = 0

#     # Step 1: Locate Debtors account
#     for row in data:
#         result.append(row)

#         if row.get("account_name") == "Debtors":
#             debtors_account_name = row["account"]
#             debtors_indent = row["indent"]

#     if not debtors_account_name:
#         return data

#     # Step 2: Remove existing children of Debtors
#     cleaned = []
#     skip = False

#     for row in result:
#         if row["account"] == debtors_account_name:
#             skip = True
#             cleaned.append(row)
#             continue

#         if skip:
#             if row["indent"] > debtors_indent:
#                 continue
#             else:
#                 skip = False

#         cleaned.append(row)

#     result = cleaned

#     # Step 3: Fetch grouped customer balances
#     customers = frappe.db.sql("""
#         SELECT 
#             c.name,
#             c.customer_group,
#             SUM(gle.debit - gle.credit) as balance
#         FROM `tabGL Entry` gle
#         JOIN `tabCustomer` c ON gle.party = c.name
#         WHERE gle.company = %s
#         AND gle.party_type = 'Customer'
#         GROUP BY c.name, c.customer_group
#         HAVING balance != 0
#     """, filters.company, as_dict=True)

#     group_map = {}
#     for cust in customers:
#         group_map.setdefault(cust.customer_group, []).append(cust)

#     insert_index = next(
#         i for i, r in enumerate(result)
#         if r["account"] == debtors_account_name
#     ) + 1

#     for group, cust_list in group_map.items():

#         group_account_key = f"{debtors_account_name}::{group}"

#         group_row = {
#             "account": group_account_key,
#             "parent_account": debtors_account_name,
#             "indent": debtors_indent + 1,
#             "account_name": group,
#             "is_group_account": 1,
#             "opening_debit": 0,
#             "opening_credit": 0,
#             "debit": 0,
#             "credit": 0,
#             "closing_debit": 0,
#             "closing_credit": 0,
#             "currency": company_currency,
#             "has_value": True
#         }

#         result.insert(insert_index, group_row)
#         insert_index += 1

#         for cust in cust_list:

#             balance = cust.balance or 0

#             customer_row = {
#                 "account": f"{group_account_key}::{cust.name}",
#                 "parent_account": group_account_key,
#                 "indent": debtors_indent + 2,
#                 "account_name": cust.name,
#                 "is_group_account": 0,
#                 "opening_debit": 0,
#                 "opening_credit": 0,
#                 "debit": 0,
#                 "credit": 0,
#                 "closing_debit": balance if balance > 0 else 0,
#                 "closing_credit": abs(balance) if balance < 0 else 0,
#                 "currency": company_currency,
#                 "has_value": True
#             }

#             result.insert(insert_index, customer_row)
#             insert_index += 1

#     return result