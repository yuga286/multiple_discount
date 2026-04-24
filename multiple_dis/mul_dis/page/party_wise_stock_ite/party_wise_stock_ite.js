// frappe.pages['party_wise_stock_ite'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Party Wise Stock Item Sales',
// 		single_column: true
// 	});
// }

frappe.pages["party_wise_stock_ite"].on_page_load = function (wrapper) {

    // 🔥 define function properly
    function add_styles() {
        if (!document.getElementById("custom-report-style")) {
            const style = document.createElement("style");
            style.id = "custom-report-style";

            style.innerHTML = `
                .table-scroll {
                    overflow-x: auto;
                    border: 1px solid #ddd;
                }

                .table-scroll table {
                    min-width: 1200px;
                    border-collapse: collapse;
                }

                .table-scroll th,
                .table-scroll td {
                    min-width: 120px;
                    text-align: center;
                    white-space: nowrap;
                }

                .table-scroll thead th {
                    position: sticky;
                    top: 0;
                    background: #f8f9fa;
                    z-index: 2;
                }
            `;

            document.head.appendChild(style);
        }
    }

    // 🔥 CALL IT (you forgot this)
    add_styles();

    // load page
    new PartyWiseSalesPage(wrapper);
};

class PartyWiseSalesPage {

	constructor(wrapper) {
		this.wrapper = $(wrapper);

		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: "Party Wise Stock Item Sales Report",
			single_column: true,
		});

		this.page.add_inner_button("Download", () => {
			window.open(
				"/api/method/multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.download_excel"
			);
		});

		this.container = $('<div class="sales-container"></div>').appendTo(this.page.main);

		this.render();
	}

	async render() {
		try {
			let res = await frappe.xcall(
				 "multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.get_data"
			);

			this.items = res.items;
			this.data = res.data;

			this.render_table();

		} catch (err) {
			console.error(err);
			frappe.msgprint("Failed to load data");
		}
	}

	render_table() {
		this.container.empty();

		let html = `<table class="table table-bordered">`;

		// 🔥 HEADER
		html += `<thead>`;

		// row 1
		html += `<tr>`;
		html += `<th rowspan="2">Customer</th>`;

		this.items.forEach(item => {
			// html += `<th colspan="2">${item}</th>`;
			html += `<th colspan="2" style="min-width:180px">${item}</th>`;
		});

		html += `</tr>`;

		// row 2
		html += `<tr>`;
		this.items.forEach(item => {
			// html += `<th>Qty</th><th>Amount</th>`;
			html += `<th style="width:90px">Qty</th>
        	<th style="width:120px">Amount</th>`;
		});
		html += `</tr>`;

		html += `</thead>`;

		// 🔥 BODY
		html += `<tbody>`;

		Object.keys(this.data).forEach(cust => {
			html += `<tr>`;
			html += `<td>${cust}</td>`;

			this.items.forEach(item => {
				let d = this.data[cust][item] || { qty: 0, amt: 0 };

				html += `<td>${d.qty}</td>`;
				html += `<td>${d.amt}</td>`;
			});

			html += `</tr>`;
		});

		html += `</tbody></table>`;

		// this.container.html(html);
		this.container.html(`
			<div class="table-scroll">
				${html}
			</div>
		`);

		
	}
}

