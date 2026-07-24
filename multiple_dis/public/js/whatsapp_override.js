// frappe.ui.form.on('*', {

//     refresh(frm) {

//         // Avoid duplicate button
//         if (frm.custom_whatsapp_loaded) {
//             return;
//         }

//         frm.custom_whatsapp_loaded = true;

//         // Wait until frappe_whatsapp adds its menu
//         setTimeout(() => {

//             // =========================================
//             // REMOVE ORIGINAL MENU ITEM
//             // =========================================

//             frm.page.menu.find('.dropdown-item').each(function () {

//                 let label = $(this).text().trim();

//                 if (label === 'Send to WhatsApp') {
                
//                     $(this).remove();
//                 }
//             });

//             // =========================================
//             // ADD CUSTOM MENU ITEM
//             // =========================================

//             frm.page.add_menu_item(__('Send to WhatsApp'), () => {

//                 let d = new frappe.ui.Dialog({

//                     title: __('Send WhatsApp Message'),

//                     size: 'small',

//                     fields: [

//                         {
//                             fieldtype: 'Link',
//                             fieldname: 'whatsapp_account',
//                             label: __('WhatsApp Account'),
//                             options: 'WhatsApp Account',
//                             reqd: 1
//                         },

//                         {
//                             fieldtype: 'Data',
//                             fieldname: 'mobile_no',
//                             label: __('Mobile No'),
//                             reqd: 1
//                         },

//                         {
//                             fieldtype: 'Link',
//                             fieldname: 'template_name',
//                             label: __('Template'),
//                             options: 'WhatsApp Template',
//                             reqd: 1
//                         },

//                         // =================================
//                         // CUSTOM FIELD
//                         // =================================

//                         {
//                             fieldtype: 'Check',
//                             fieldname: 'send_pdf_on_whatsapp',
//                             label: __('Send PDF Attachment'),
//                             default: 1
//                         },

//                         {
//                             fieldtype: 'Link',
//                             fieldname: 'print_format',
//                             label: __('Print Format'),
//                             options: 'Print Format',

//                             depends_on:
//                                 'eval:doc.send_pdf_on_whatsapp == 1'
//                         }
//                     ],

//                     primary_action_label: __('Send'),

//                     primary_action(values) {

//                         frappe.call({

//                             method:
//                                 'multiple_dis.api.send_whatsapp_with_pdf',

//                             args: {

//                                 doctype: frm.doctype,
//                                 docname: frm.docname,

//                                 mobile_no:
//                                     values.mobile_no,

//                                 whatsapp_account:
//                                     values.whatsapp_account,

//                                 template_name:
//                                     values.template_name,

//                                 send_pdf:
//                                     values.send_pdf_on_whatsapp,

//                                 print_format:
//                                     values.print_format
//                             },

//                             freeze: true,

//                             freeze_message:
//                                 __('Sending WhatsApp'),

//                             callback(r) {

//                                 if (!r.exc) {

//                                     frappe.show_alert({
//                                         message:
//                                             __('WhatsApp Sent'),
//                                         indicator: 'green'
//                                     });

//                                     d.hide();
//                                 }
//                             }
//                         });
//                     }
//                 });

//                 d.show();
//             });

//         }, 500);
//     }
// });

console.log("WhatsApp Override Loaded");

// $(document).on('app_ready', function () {

//     frappe.router.on("change", () => {

//         let route = frappe.get_route();

//         if (!route || route[0] !== "Form") {
//             return;
//         }

//         setTimeout(() => {

//             let frm = cur_frm;

//             if (!frm || frm.whatsapp_overridden) {
//                 return;
//             }

//             frm.whatsapp_overridden = true;

//             // ==========================================
//             // STORE ORIGINAL add_menu_item
//             // ==========================================

//             const original_add_menu_item =
//                 frm.page.add_menu_item.bind(frm.page);

//             // ==========================================
//             // OVERRIDE add_menu_item
//             // ==========================================

//             frm.page.add_menu_item = function(label, action, standard) {

//                 // ======================================
//                 // INTERCEPT ORIGINAL WHATSAPP BUTTON
//                 // ======================================

//                 if (
//                     label === "Send To Whatsapp"
//                     || label === __("Send To Whatsapp")
//                 ) {

//                     // REPLACE ORIGINAL ACTION

//                     action = function () {

//                         let dialog = new frappe.ui.Dialog({

//                             title: __("Send WhatsApp Message"),

//                             fields: [

//                                 {
//                                     label: "Select Template",
//                                     fieldname: "template",
//                                     fieldtype: "Link",
//                                     options: "WhatsApp Templates",
//                                     reqd: 1
//                                 },

//                                 {
//                                     label: "Send to",
//                                     fieldname: "contact",
//                                     fieldtype: "Link",
//                                     options: "Contact",
//                                     reqd: 1,

//                                     change() {

//                                         let contact =
//                                             dialog.get_value("contact");

//                                         if (contact) {

//                                             frappe.call({

//                                                 method:
//                                                     "frappe.client.get_value",

//                                                 args: {

//                                                     doctype: "Contact",

//                                                     filters: {
//                                                         name: contact
//                                                     },

//                                                     fieldname: [
//                                                         "mobile_no"
//                                                     ]
//                                                 },

//                                                 callback(r) {

//                                                     if (r.message) {

//                                                         dialog.set_value(
//                                                             "mobile_no",
//                                                             r.message.mobile_no
//                                                         );
//                                                     }
//                                                 }
//                                             });
//                                         }
//                                     }
//                                 },

//                                 {
//                                     label: "Mobile No",
//                                     fieldname: "mobile_no",
//                                     fieldtype: "Data"
//                                 },

//                                 // ==================================
//                                 // YOUR CUSTOM FIELD
//                                 // ==================================

//                                 {
//                                     label: "Send PDF Attachment",
//                                     fieldname:
//                                         "send_pdf_on_whatsapp",

//                                     fieldtype: "Check",

//                                     default: 1
//                                 },

//                                 {
//                                     label: "Print Format",
//                                     fieldname: "print_format",
//                                     fieldtype: "Link",
//                                     options: "Print Format",

//                                     depends_on:
//                                         "eval:doc.send_pdf_on_whatsapp==1"
//                                 }
//                             ],

//                             primary_action_label: __("Send"),

//                             primary_action(values) {

//                                 frappe.call({

//                                     method:
//                                         "multiple_dis.api.send_whatsapp_with_pdf",

//                                     args: {

//                                         doctype: frm.doc.doctype,

//                                         docname: frm.doc.name,

//                                         mobile_no:
//                                             values.mobile_no,

//                                         template_name:
//                                             values.template,

//                                         send_pdf:
//                                             values.send_pdf_on_whatsapp,

//                                         print_format:
//                                             values.print_format
//                                     },

//                                     freeze: true,

//                                     callback(r) {

//                                         frappe.msgprint(
//                                             __("WhatsApp Sent")
//                                         );

//                                         dialog.hide();
//                                     }
//                                 });
//                             }
//                         });

//                         // ======================================
//                         // FILTER TEMPLATE
//                         // ======================================

//                         let template =
//                             dialog.fields_dict.template;

//                         if (template) {

//                             template.get_query = function() {

//                                 return {

//                                     filters: {
//                                         for_doctype:
//                                             frm.doc.doctype
//                                     }
//                                 };
//                             };

//                             template.refresh();
//                         }

//                         dialog.show();
//                     };
//                 }

//                 // ======================================
//                 // CALL ORIGINAL METHOD
//                 // ======================================

//                 return original_add_menu_item(
//                     label,
//                     action,
//                     standard
//                 );
//             };

//         }, 500);
//     });
// });


$(document).on('app_ready', function () {

    // ==========================================
    // OVERRIDE GLOBALLY
    // ==========================================

    const original_add_menu_item =
        frappe.ui.Page.prototype.add_menu_item;

    frappe.ui.Page.prototype.add_menu_item =
        function(label, action, standard) {

            // ======================================
            // INTERCEPT ORIGINAL BUTTON
            // ======================================

            if (
                label === "Send To Whatsapp"
                || label === __("Send To Whatsapp")
            ) {

                // REPLACE ACTION

                action = function () {

                    let frm = cur_frm;

                    let dialog = new frappe.ui.Dialog({

                        title: __("Send WhatsApp Message"),

                        fields: [

                            {
                                label: "Select Template",
                                fieldname: "template",
                                fieldtype: "Link",
                                options: "WhatsApp Templates",
                                reqd: 1
                            },

                            {
                                label: "Send to",
                                fieldname: "contact",
                                fieldtype: "Link",
                                options: "Contact",
                                reqd: 1,

                                change() {

                                    let contact =
                                        dialog.get_value("contact");

                                    if (contact) {

                                        frappe.call({

                                            method:
                                                "frappe.client.get_value",

                                            args: {

                                                doctype: "Contact",

                                                filters: {
                                                    name: contact
                                                },

                                                fieldname: [
                                                    "mobile_no"
                                                ]
                                            },

                                            callback(r) {

                                                if (r.message) {

                                                    dialog.set_value(
                                                        "mobile_no",
                                                        r.message.mobile_no
                                                    );
                                                }
                                            }
                                        });
                                    }
                                }
                            },

                            {
                                label: "Mobile No",
                                fieldname: "mobile_no",
                                fieldtype: "Data"
                            },

                            // ==================================
                            // CUSTOM FIELD
                            // ==================================

                            {
                                label: "Send PDF Attachment",

                                fieldname:
                                    "send_pdf_on_whatsapp",

                                fieldtype: "Check",

                                default: 1
                            },

                            {
                                label: "Print Format",

                                fieldname: "print_format",

                                fieldtype: "Link",

                                options: "Print Format",

                                depends_on:
                                    "eval:doc.send_pdf_on_whatsapp==1"
                            }
                        ],

                        primary_action_label: __("Send"),

                        primary_action(values) {

                            frappe.call({

                                method:
                                    "multiple_dis.api.send_whatsapp_with_pdf",

                                args: {

                                    doctype: frm.doc.doctype,

                                    docname: frm.doc.name,

                                    mobile_no:
                                        values.mobile_no,

                                    template_name:
                                        values.template,

                                    send_pdf:
                                        values.send_pdf_on_whatsapp,

                                    print_format:
                                        values.print_format
                                },

                                freeze: true,

                                callback(r) {

                                    frappe.msgprint(
                                        __("WhatsApp Sent")
                                    );

                                    dialog.hide();
                                }
                            });
                        }
                    });

                    // ==================================
                    // TEMPLATE FILTER
                    // ==================================

                    let template =
                        dialog.fields_dict.template;

                    if (template) {

                        template.get_query = function() {

                            return {

                                filters: {
                                    for_doctype:
                                        frm.doc.doctype
                                }
                            };
                        };

                        template.refresh();
                    }

                    dialog.show();
                };
            }

            // ======================================
            // CALL ORIGINAL METHOD
            // ======================================

            return original_add_menu_item.call(
                this,
                label,
                action,
                standard
            );
        };
});