# Copyright (c) 2020, Frappe Technologies and contributors
# License: MIT. See LICENSE

import frappe
from frappe.model.document import Document
from frappe.query_builder import Interval
from frappe.query_builder.functions import Now

class ConsoleLog(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		committed: DF.Check
		script: DF.Code | None
		type: DF.Data | None
	# end: auto-generated types

	def after_delete(self):
		# because on_trash can be bypassed
		frappe.throw(frappe._("Console Logs can not be deleted"))

	@staticmethod
	def clear_old_logs(days=30):
		table = frappe.qb.DocType("Console Log")
		frappe.db.delete(table, filters=(table.modified < (Now() - Interval(days=days))))

