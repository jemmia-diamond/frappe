import frappe


def execute():
	for doctype, column in [
		("DocField", "mask"),
		("DocPerm", "mask"),
		("Custom DocPerm", "mask"),
	]:
		table = frappe.db.get_table_name(doctype)
		if not frappe.db.has_column(table, column):
			frappe.db.add_column(doctype, column, "Check", default=0)
