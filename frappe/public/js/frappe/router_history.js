frappe.route_history_queue = [];
const routes_to_skip = ["Form", "social", "setup-wizard", "recorder"];

const save_routes = frappe.utils.debounce(() => {
	// Check if user is logged in and session is valid
	if (!frappe.session || frappe.session.user === "Guest") return;
	
	// Double check session is still valid before making API call
	if (!frappe.session.sid) return;
	
	const routes = frappe.route_history_queue;
	if (!routes.length) return;

	frappe.route_history_queue = [];

	frappe
		.xcall("frappe.desk.doctype.route_history.route_history.deferred_insert", {
			routes: routes,
		})
		.catch((error) => {
			// If permission error, don't retry (session might be invalid)
			if (error && error.exc_type === "PermissionError") {
				console.warn("Route history: Permission denied, skipping save");
				return;
			}
			// For other errors, add routes back to queue
			frappe.route_history_queue = frappe.route_history_queue.concat(routes);
		});
}, 10000);

frappe.router.on("change", () => {
	// Only track routes if user is logged in
	if (!frappe.session || frappe.session.user === "Guest") return;
	
	const route = frappe.get_route();
	if (is_route_useful(route)) {
		frappe.route_history_queue.push({
			creation: frappe.datetime.now_datetime(),
			route: frappe.get_route_str(),
		});

		save_routes();
	}
});

function is_route_useful(route) {
	if (!route[1]) {
		return false;
	} else if ((route[0] === "List" && !route[2]) || routes_to_skip.includes(route[0])) {
		return false;
	} else {
		return true;
	}
}
