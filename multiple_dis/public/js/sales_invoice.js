// frappe.ui.form.on('Sales Invoice', {
//     refresh(frm) {
//         if (frm.doc.docstatus === 1) { // Only show on submitted docs
//             frm.add_custom_button(__('Send PDF on WhatsApp'), function() {

//                 // Prompt for mobile number & template
//                 let d = new frappe.ui.Dialog({
//                     title: 'Send PDF via WhatsApp',
//                     fields: [
//                         {
//                             label: 'Mobile Number',
//                             fieldname: 'mobile_no',
//                             fieldtype: 'Data',
//                             default: frm.doc.contact_mobile || '',
//                             reqd: 1
//                         },
//                         {
//                             label: 'WhatsApp Template',
//                             fieldname: 'template_name',
//                             fieldtype: 'Link',
//                             options: 'WhatsApp Templates',
//                             reqd: 1
//                         }
//                     ],
//                     primary_action_label: 'Send',
//                     primary_action(values) {
//                         frappe.call({
//                             method: 'multiple_dis.api.send_pdf_on_whatsapp',
//                             args: {
//                                 doctype: frm.doctype,
//                                 docname: frm.docname,
//                                 mobile_no: values.mobile_no,
//                                 template_name: values.template_name
//                             },
//                             callback(r) {
//                                 if (r.message.status === 'success') {
//                                     frappe.msgprint('✅ PDF sent on WhatsApp!');
//                                 }
//                             }
//                         });
//                         d.hide();
//                     }
//                 });
//                 d.show();
//             }, __('WhatsApp'));
//         }
//     }
// });



frappe.ui.form.on('Sales Invoice', {
    refresh(frm) {
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__('Send PDF on WhatsApp'), function () {

                let d = new frappe.ui.Dialog({
                    title: 'Send PDF via WhatsApp',
                    fields: [
                        {
                            label: 'Mobile Number',
                            fieldname: 'mobile_no',
                            fieldtype: 'Data',
                            default: frm.doc.contact_mobile || '',
                            reqd: 1,
                            description: 'Include country code e.g. +919876543210'
                        },
                        {
                            label: 'WhatsApp Template',
                            fieldname: 'template_name',
                            fieldtype: 'Link',
                            options: 'WhatsApp Templates',
                            reqd: 1
                        },
                        {
                            label: 'Template Parameters (comma separated)',
                            fieldname: 'parameters',
                            fieldtype: 'Small Text',
                            description: 'e.g. John Doe, INV-0001, 5000'
                        }
                    ],
                    primary_action_label: 'Send',
                    primary_action(values) {
                        // Convert comma-separated params to JSON array
                        let params = values.parameters
                            ? JSON.stringify(values.parameters.split(',').map(p => p.trim()))
                            : '[]';

                        frappe.call({
                            method: 'multiple_dis.api.send_pdf_whatsapp',
                            args: {
                                doctype: frm.doctype,
                                docname: frm.docname,
                                mobile_no: values.mobile_no,
                                template_name: values.template_name,
                                parameters: params
                            },
                            freeze: true,
                            freeze_message: 'Sending PDF on WhatsApp...',
                            callback(r) {
                                if (!r.exc) {
                                    frappe.msgprint({
                                        title: 'Success',
                                        message: '✅ PDF sent successfully on WhatsApp!',
                                        indicator: 'green'
                                    });
                                }
                            }
                        });
                        d.hide();
                    }
                });
                d.show();

            }, __('WhatsApp'));
        }
    }
});