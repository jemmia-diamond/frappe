import frappe


SUPPORTED_FIELD_TYPES = [
	"Data",
	"Date",
	"Datetime",
	"Time",
	"Int",
	"Float",
	"Currency",
	"Percent",
	"Phone",
	"Link",
	"Dynamic Link",
	"Duration",
	"Select",
	"Read Only",
]


def mask_field_value(field, val):
	if val is None or val == "":
		return val

	val = str(val)
	fieldtype = getattr(field, "fieldtype", None)
	options = getattr(field, "options", None)

	if fieldtype == "Data" and options == "Phone":
		return val[:3] + "X" * max(len(val) - 3, 6) if len(val) > 3 else "X" * len(val)
	elif fieldtype == "Data" and options == "Email":
		parts = val.split("@")
		return "XXXXXX@" + parts[1] if len(parts) > 1 else "XXXXXX"
	elif fieldtype == "Date":
		return "XX-XX-XXXX"
	elif fieldtype == "Time":
		return "XX:XX"
	else:
		return "XXXXXXXX"


def mask_dict_results(result, masked_fields):
	if not result or not masked_fields:
		return result

	masked_fieldnames = {df.fieldname for df in masked_fields}
	field_map = {df.fieldname: df for df in masked_fields}

	for row in result:
		for fieldname in masked_fieldnames:
			if fieldname in row:
				row[fieldname] = mask_field_value(field_map[fieldname], row[fieldname])

	return result


def mask_list_results(result, masked_fields, field_index_map):
	if not result or not masked_fields:
		return result

	field_map = {df.fieldname: df for df in masked_fields}
	indices = {
		field_index_map[df.fieldname]: df
		for df in masked_fields
		if df.fieldname in field_index_map
	}

	if not indices:
		return result

	masked = []
	for row in result:
		row = list(row)
		for idx, df in indices.items():
			if idx < len(row):
				row[idx] = mask_field_value(df, row[idx])
		masked.append(row)

	return masked
