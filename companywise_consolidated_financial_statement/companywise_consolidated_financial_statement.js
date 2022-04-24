// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.require("assets/erpnext/js/financial_statements.js", function() {
	frappe.query_reports["Companywise Consolidated Financial Statement"] = {
		"filters": [
			{
				"fieldname":"company",
				"label": __("Company"),
				"fieldtype": "Link",
				"options": "Company",
				"default": frappe.defaults.get_user_default("Company"),
				"reqd": 1,
				"hidden":1
			},
			{
				"fieldname":"filter_based_on",
				"label": __("Filter Based On"),
				"fieldtype": "Select",
				"options": ["Fiscal Year", "Date Range"],
				"default": ["Fiscal Year"],
				"reqd": 1,
				on_change: function() {
					let filter_based_on = frappe.query_report.get_filter_value('filter_based_on');
					frappe.query_report.toggle_filter_display('from_fiscal_year', filter_based_on === 'Date Range');
					frappe.query_report.toggle_filter_display('to_fiscal_year', filter_based_on === 'Date Range');
					frappe.query_report.toggle_filter_display('period_start_date', filter_based_on === 'Fiscal Year');
					frappe.query_report.toggle_filter_display('period_end_date', filter_based_on === 'Fiscal Year');

					frappe.query_report.refresh();
				}
			},
			{
				"fieldname":"period_start_date",
				"label": __("Start Date"),
				"fieldtype": "Date",
				"hidden": 1,
				"reqd": 1
			},
			{
				"fieldname":"period_end_date",
				"label": __("End Date"),
				"fieldtype": "Date",
				"hidden": 1,
				"reqd": 1
			},
			{
				"fieldname":"from_fiscal_year",
				"label": __("Start Year"),
				"fieldtype": "Link",
				"options": "Fiscal Year",
				"default": frappe.defaults.get_user_default("fiscal_year"),
				"reqd": 1
			},
			{
				"fieldname":"to_fiscal_year",
				"label": __("End Year"),
				"fieldtype": "Link",
				"options": "Fiscal Year",
				"default": frappe.defaults.get_user_default("fiscal_year"),
				"reqd": 1
			},
			{
				"fieldname":"report",
				"label": __("Report"),
				"fieldtype": "Select",
				"options": ["Profit and Loss Statement", "Balance Sheet"],
				"default": "Balance Sheet",
				"reqd": 1
			}
		],
		"formatter": function(value, row, column, data, default_formatter) {
			if (data && column.fieldname=="account") {
				value = data.account || value;

				column.is_tree = true;
			}

			if (data && data.account && column.apply_currency_formatter) {
				data.currency = erpnext.get_currency(column.company_name);
			}

			value = default_formatter(value, row, column, data);
			if (!data.parent_account) {
				value = $(`<span>${value}</span>`);

				var $value = $(value).css("font-weight", "bold");

				value = $value.wrap("<p></p>").parent().html();
			}
			return value;
		},
		onload: function() {
			let fiscal_year = frappe.defaults.get_user_default("fiscal_year")

			frappe.model.with_doc("Fiscal Year", fiscal_year, function(r) {
				var fy = frappe.model.get_doc("Fiscal Year", fiscal_year);
				frappe.query_report.set_filter_value({
					period_start_date: fy.year_start_date,
					period_end_date: fy.year_end_date
				});
			});
		}
	}
});
