# Copyright (c) 2026, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class AssignmentLog(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assign_to: DF.Link | None
		assign_to_docname: DF.DynamicLink | None
		assign_to_doctype: DF.Link | None
		assigned_at: DF.Datetime | None
		next_user: DF.Link | None
		previous_user: DF.Link | None
	# end: auto-generated types

	@staticmethod
	def clear_old_logs(days: int = 3):
		import frappe
		from frappe.query_builder import Interval
		from frappe.query_builder.functions import Now

		table = frappe.qb.DocType("Assignment Log")
		frappe.db.delete(table, filters=(table.creation < (Now() - Interval(days=days))))
