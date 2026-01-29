app_name = "multiple_uom"
app_title = "adding the discount"
app_publisher = "exm"
app_description = "multiple discount"
app_email = "exm@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []
doctype_js = {
    "Sales Order": "public/js/sales_order_item.js"
}


# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "multiple_uom",
# 		"logo": "/assets/multiple_uom/logo.png",
# 		"title": "adding the discount",
# 		"route": "/multiple_uom",
# 		"has_permission": "multiple_uom.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/multiple_uom/css/multiple_uom.css"
# app_include_js = "/assets/multiple_uom/js/multiple_uom.js"

# include js, css files in header of web template
# web_include_css = "/assets/multiple_uom/css/multiple_uom.css"
# web_include_js = "/assets/multiple_uom/js/multiple_uom.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "multiple_uom/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "multiple_uom/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "multiple_uom.utils.jinja_methods",
# 	"filters": "multiple_uom.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "multiple_uom.install.before_install"
# after_install = "multiple_uom.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "multiple_uom.uninstall.before_uninstall"
# after_uninstall = "multiple_uom.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "multiple_uom.utils.before_app_install"
# after_app_install = "multiple_uom.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "multiple_uom.utils.before_app_uninstall"
# after_app_uninstall = "multiple_uom.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "multiple_uom.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"multiple_uom.tasks.all"
# 	],
# 	"daily": [
# 		"multiple_uom.tasks.daily"
# 	],
# 	"hourly": [
# 		"multiple_uom.tasks.hourly"
# 	],
# 	"weekly": [
# 		"multiple_uom.tasks.weekly"
# 	],
# 	"monthly": [
# 		"multiple_uom.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "multiple_uom.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "multiple_uom.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "multiple_uom.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["multiple_uom.utils.before_request"]
# after_request = ["multiple_uom.utils.after_request"]

# Job Events
# ----------
# before_job = ["multiple_uom.utils.before_job"]
# after_job = ["multiple_uom.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"multiple_uom.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

