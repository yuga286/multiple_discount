// // // frappe.pages['party_wise_stock_ite'].on_page_load = function(wrapper) {
// // // 	var page = frappe.ui.make_app_page({
// // // 		parent: wrapper,
// // // 		title: 'Party Wise Stock Item Sales',
// // // 		single_column: true
// // // 	});
// // // }

// frappe.pages["party_wise_stock_ite"].on_page_load = function (wrapper) {

//     // define function properly
//     function add_styles() {
//         if (!document.getElementById("custom-report-style")) {
//             const style = document.createElement("style");
//             style.id = "custom-report-style";

//             style.innerHTML = `
//                 .table-scroll {
//                     overflow-x: auto;
//                     border: 1px solid #ddd;
//                 }

//                 .table-scroll table {
//                     min-width: 1200px;
//                     border-collapse: collapse;
//                 }

//                 .table-scroll th,
//                 .table-scroll td {
//                     min-width: 120px;
//                     text-align: center;
//                     white-space: nowrap;
//                 }

//                 .table-scroll thead th {
//                     position: sticky;
//                     top: 0;
//                     background: #f8f9fa;
//                     z-index: 2;
//                 }
//             `;

//             document.head.appendChild(style);
//         }
//     }

//     // CALL IT (you forgot this)
//     add_styles();

//     // load page
//     new PartyWiseSalesPage(wrapper);
// };

// class PartyWiseSalesPage {

// 	constructor(wrapper) {
// 		this.wrapper = $(wrapper);

// 		this.page = frappe.ui.make_app_page({
// 			parent: wrapper,
// 			title: "Party Wise Stock Item Sales Report",
// 			single_column: true,
// 		});
// 		this.current_page = 1;
// 		this.page_size = 15;
// 		this.search_text = "";

// 		this.page.add_inner_button("Download", () => {
// 			window.open(
// 				"/api/method/multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.download_excel"
// 			);
// 		});

// 		this.container = $('<div class="sales-container"></div>').appendTo(this.page.main);

// 		this.search_customer = "";
// 		this.search_item = "";

// 		// this.controls = $(`
// 		// 	<div style="margin-bottom:10px; display:flex; gap:10px;">
// 		// 		<input type="text" placeholder="Search Customer / Item" class="form-control" style="width:250px;">
// 		// 		<button class="btn btn-default prev">Prev</button>
// 		// 		<button class="btn btn-default next">Next</button>
// 		// 		<span class="page-info"></span>
// 		// 	</div>
// 		// `).appendTo(this.page.main);

// 		this.controls = $(`
// 			<div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;">
// 				<input type="text" placeholder="Search Customer" class="form-control search-cust" style="width:200px;">
// 				<input type="text" placeholder="Search Item" class="form-control search-item" style="width:200px;">
// 				<button class="btn btn-default prev">Prev</button>
// 				<button class="btn btn-default next">Next</button>
// 				<span class="page-info"></span>
// 			</div>
// 		`).appendTo(this.page.main);

// 		// search
// 		// this.controls.find("input").on("input", (e) => {
// 		// 	this.search_text = e.target.value.toLowerCase();
// 		// 	this.current_page = 1;
// 		// 	this.render_table();
// 		// });

// 		// // prev
// 		// this.controls.find(".prev").on("click", () => {
// 		// 	if (this.current_page > 1) {
// 		// 		this.current_page--;
// 		// 		this.render_table();
// 		// 	}
// 		// });

// 		// // next
// 		// this.controls.find(".next").on("click", () => {
// 		// 	this.current_page++;
// 		// 	this.render_table();
// 		// });

// 		// customer search
// 		this.controls.find(".search-cust").on("input", (e) => {
// 			this.search_customer = e.target.value.toLowerCase();
// 			this.current_page = 1;
// 			this.render_table();
// 		});

// 		// item search
// 		this.controls.find(".search-item").on("input", (e) => {
// 			this.search_item = e.target.value.toLowerCase();
// 			this.render_table();
// 		});

// 		this.render();
// 	}

// 	async render() {
// 		try {
// 			let res = await frappe.xcall(
// 				 "multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.get_data"
// 			);

// 			this.items = res.items;
// 			this.data = res.data;
// 			this.uoms = res.uoms || {};

// 			this.render_table();

// 		} catch (err) {
// 			console.error(err);
// 			frappe.msgprint("Failed to load data");
// 		}
// 	}

// 	render_table() {
// 		this.container.empty();

// 		const uoms = this.uoms || {};

// 		// ===== FILTER ITEMS (COLUMN FILTER) =====
// 		let filtered_items = this.items.filter(item =>
// 			item.toLowerCase().includes(this.search_item || "")
// 		);

// 		let html = `<table class="table table-bordered text-center">`;

// 		// ===== HEADER =====

// 		html += `<thead>
// 			<tr>
// 				<th rowspan="2">Customer</th>
// 				${filtered_items.map(item => `<th colspan="2">${item}</th>`).join("")}
// 			</tr>
// 			<tr>
// 				${filtered_items.map(() => `<th>Qty</th><th>Amount</th>`).join("")}
// 			</tr>
// 		</thead>`;



// 		// html += `<thead>
// 		// 	<tr>
// 		// 		${this.items.map(item => `<th colspan="2">${item}</th>`).join("")}
// 		// 		${filtered_items.map(item => `<th colspan="2">${item}</th>`).join("")}
// 		// 	</tr>
// 		// 	<tr>
// 		// 		${filtered_items.map(() => `<th>Qty</th><th>Amount</th>`).join("")}
// 		// 	</tr>
// 		// </thead>`;

// 		// // ===== FILTER DATA =====
// 		// let filtered_data = {};

// 		// Object.entries(this.data || {}).forEach(([cust, itemData]) => {
// 		// 	let match_customer = cust.toLowerCase().includes(this.search_text || "");

// 		// 	let match_item = Object.keys(itemData).some(item =>
// 		// 		item.toLowerCase().includes(this.search_text || "")
// 		// 	);

// 		// 	if (!this.search_text || match_customer || match_item) {
// 		// 		filtered_data[cust] = itemData;
// 		// 	}
// 		// });

// 		// ===== FILTER DATA (CUSTOMER) =====
// 		let filtered_data = {};

// 		Object.entries(this.data || {}).forEach(([cust, itemData]) => {
// 			let match_customer = cust.toLowerCase().includes(this.search_customer || "");

// 			if (!this.search_customer || match_customer) {
// 				filtered_data[cust] = itemData;
// 			}
// 		});

// 		// ===== FILTER ITEMS (COLUMN FILTER) =====
// 		let filtered_items = this.items.filter(item =>
// 			item.toLowerCase().includes(this.search_item || "")
// 		);

// 		// ===== PAGINATION =====
// 		let customers = Object.keys(filtered_data);

// 		let total_pages = Math.ceil(customers.length / this.page_size) || 1;

// 		if (this.current_page > total_pages) {
// 			this.current_page = total_pages;
// 		}

// 		let start = (this.current_page - 1) * this.page_size;
// 		let end = start + this.page_size;

// 		let page_customers = customers.slice(start, end);

// 		// ===== TOTAL INIT =====
// 		let totals = {};
// 		filtered_items.forEach(item => {
// 			totals[item] = { qty: 0, amt: 0 };
// 		});

// 		// ===== BODY =====
// 		html += `<tbody>`;

// 		page_customers.forEach(cust => {
// 			let itemData = filtered_data[cust];

// 			html += `<tr><td>${cust}</td>`;

// 			filtered_items.forEach(item => {
// 				let d = itemData[item] || { qty: 0, amt: 0 };

// 				let qty = Number(d.qty) || 0;
// 				let amt = Number(d.amt) || 0;

// 				// 👉 totals based on FILTERED DATA (not just page)
// 				totals[item].qty += qty;
// 				totals[item].amt += amt;

// 				html += `<td>${qty}</td>`;
// 				html += `<td>${amt}</td>`;
// 			});

// 			html += `</tr>`;
// 		});

// 		// ===== TOTAL ROW =====
// 		html += `<tr style="font-weight:bold; background:#e9ecef;">`;
// 		html += `<td>Total</td>`;

// 		filtered_items.forEach(item => {
// 			let qty = totals[item].qty;
// 			let uom = uoms[item] || "";

// 			html += `<td>${qty}${uom ? " " + uom : ""}</td>`;
// 			html += `<td>${totals[item].amt}</td>`;
// 		});

// 		html += `</tr>`;
// 		html += `</tbody></table>`;

// 		this.container.html(`<div class="table-scroll">${html}</div>`);

// 		// ===== PAGE INFO =====
// 		this.controls.find(".page-info").text(
// 			`Page ${this.current_page} of ${total_pages}`
// 		);
// 	}
// 	// }
// }










// frappe.pages["party_wise_stock_ite"].on_page_load = function (wrapper) {

//     function add_styles() {
//         if (!document.getElementById("custom-report-style")) {
//             const style = document.createElement("style");
//             style.id = "custom-report-style";

//             style.innerHTML = `
//                 .table-scroll {
//                     overflow-x: auto;
//                     border: 1px solid #ddd;
//                 }
//                 .table-scroll table {
//                     min-width: 1200px;
//                     border-collapse: collapse;
//                 }
//                 .table-scroll th,
//                 .table-scroll td {
//                     min-width: 120px;
//                     text-align: center;
//                     white-space: nowrap;
//                 }
//                 .table-scroll thead th {
//                     position: sticky;
//                     top: 0;
//                     background: #f8f9fa;
//                     z-index: 2;
//                 }
//             `;
//             document.head.appendChild(style);
//         }
//     }

//     add_styles();
//     new PartyWiseSalesPage(wrapper);
// };


// class PartyWiseSalesPage {

//     constructor(wrapper) {
//         this.wrapper = $(wrapper);

//         this.page = frappe.ui.make_app_page({
//             parent: wrapper,
//             title: "Party Wise Stock Item Sales Report",
//             single_column: true,
//         });

//         this.current_page = 1;
//         this.page_size = 15;
//         this.search_customer = "";
//         this.search_item = "";

//         this.page.add_inner_button("Download", () => {
//             window.open(
//                 "/api/method/multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.download_excel"
//             );
//         });

//         this.container = $('<div class="sales-container"></div>').appendTo(this.page.main);

//         // ===== CONTROLS =====
//         // this.controls = $(`
//         //     <div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;">
//         //         <input type="text" placeholder="Search Customer" class="form-control search-cust" style="width:200px;">
//         //         <input type="text" placeholder="Search Item" class="form-control search-item" style="width:200px;">
//         //         <button class="btn btn-default prev">Prev</button>
//         //         <button class="btn btn-default next">Next</button>
//         //         <span class="page-info"></span>
//         //     </div>
//         // `).appendTo(this.page.main);

// 		this.controls = $(`
// 			<div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;">
// 				<div class="customer-link"></div>
// 				<div class="item-link"></div>
// 				<button class="btn btn-default prev">Prev</button>
// 				<button class="btn btn-default next">Next</button>
// 				<span class="page-info"></span>
// 			</div>
// 		`).appendTo(this.page.main);

// 		this.customer_link = frappe.ui.form.make_control({
// 			parent: this.controls.find(".customer-link"),
// 			df: {
// 				fieldtype: "Link",
// 				label: "Customer",
// 				options: "Customer",
// 				placeholder: "Select Customer"
// 			},
// 			render_input: true
// 		});


// 		// ==============================
// 		// STEP 3 → ITEM LINK FIELD
// 		// ==============================
// 		this.item_link = frappe.ui.form.make_control({
// 			parent: this.controls.find(".item-link"),
// 			df: {
// 				fieldtype: "Link",
// 				label: "Item",
// 				options: "Item",
// 				placeholder: "Select Item"
// 			},
// 			render_input: true
// 		});


// 		// ==============================
// 		// STEP 4 → EVENTS
// 		// ==============================

// 		// Customer filter
// 		this.customer_link.$input.on("change", () => {
// 			this.search_customer = this.customer_link.get_value() || "";
// 			this.current_page = 1;
// 			this.render_table();
// 		});

// 		// Item filter
// 		this.item_link.$input.on("change", () => {
// 			this.search_item = this.item_link.get_value() || "";
// 			this.render_table();
// 		});

//         // events
//         // this.controls.find(".search-cust").on("input", (e) => {
//         //     this.search_customer = e.target.value.toLowerCase();
//         //     this.current_page = 1;
//         //     this.render_table();
//         // });

//         // this.controls.find(".search-item").on("input", (e) => {
//         //     this.search_item = e.target.value.toLowerCase();
//         //     this.render_table();
//         // });

//         this.controls.find(".prev").on("click", () => {
//             if (this.current_page > 1) {
//                 this.current_page--;
//                 this.render_table();
//             }
//         });

//         this.controls.find(".next").on("click", () => {
//             this.current_page++;
//             this.render_table();
//         });

//         this.render();
//     }

//     async render() {
//         try {
//             let res = await frappe.xcall(
//                 "multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.get_data"
//             );

// 			this.item_map = {};
// 			(this.items || []).forEach(item => {
// 				this.item_map[item] = item;  // fallback
// 			});
// 			this.item_map = res.item_map || {};

//             this.items = res.items;
//             this.data = res.data;
//             this.uoms = res.uoms || {};

//             this.render_table();

//         } catch (err) {
//             console.error(err);
//             frappe.msgprint("Failed to load data");
//         }
//     }

//     render_table() {
//         this.container.empty();

//         const uoms = this.uoms || {};

//         // ===== FILTER ITEMS FIRST (IMPORTANT ORDER) =====
//         // let filtered_items = this.items.filter(item =>
//         //     // item.toLowerCase().includes(this.search_item || "")
// 		// 	!this.search_item || item === this.search_item
//         // );

// 		let filtered_items = this.items.filter(item => {
// 			if (!this.search_item) return true;

// 			// match using mapping
// 			let item_code = this.search_item;
// 			let item_name = this.item_map[item_code];

// 			return item === item_name;
// 		});

//         // ===== FILTER CUSTOMERS =====
//         let filtered_data = {};
//         Object.entries(this.data || {}).forEach(([cust, itemData]) => {
//             // let match_customer = cust.toLowerCase().includes(this.search_customer || "");
// 			let match_customer = !this.search_customer || cust === this.search_customer;
//             if (!this.search_customer || match_customer) {
//                 filtered_data[cust] = itemData;
//             }
//         });

//         // ===== PAGINATION =====
//         let customers = Object.keys(filtered_data);
//         let total_pages = Math.ceil(customers.length / this.page_size) || 1;

//         if (this.current_page > total_pages) {
//             this.current_page = total_pages;
//         }

//         let start = (this.current_page - 1) * this.page_size;
//         let end = start + this.page_size;
//         let page_customers = customers.slice(start, end);

//         // ===== TOTAL INIT =====
//         let totals = {};
//         filtered_items.forEach(item => {
//             totals[item] = { qty: 0, amt: 0 };
//         });

//         // ===== TABLE START =====
//         let html = `<table class="table table-bordered text-center">`;

//         // ===== HEADER =====
//         html += `<thead>
//             <tr>
//                 <th rowspan="2">Customer</th>
//                 ${filtered_items.map(item => `<th colspan="2">${item}</th>`).join("")}
//             </tr>
//             <tr>
//                 ${filtered_items.map(() => `<th>Qty</th><th>Amount</th>`).join("")}
//             </tr>
//         </thead>`;

//         // ===== BODY =====
//         html += `<tbody>`;

//         page_customers.forEach(cust => {
//             let itemData = filtered_data[cust];

//             html += `<tr><td>${cust}</td>`;

//             filtered_items.forEach(item => {
//                 let d = itemData[item] || { qty: 0, amt: 0 };

//                 let qty = Number(d.qty) || 0;
//                 let amt = Number(d.amt) || 0;

//                 totals[item].qty += qty;
//                 totals[item].amt += amt;

//                 html += `<td>${qty}</td>`;
//                 html += `<td>${amt}</td>`;
//             });

//             html += `</tr>`;
//         });

//         // ===== TOTAL ROW =====
//         html += `<tr style="font-weight:bold; background:#e9ecef;">`;
//         html += `<td>Total</td>`;

//         filtered_items.forEach(item => {
//             let qty = totals[item].qty;
//             let uom = uoms[item] || "";

//             html += `<td>${qty}${uom ? " " + uom : ""}</td>`;
//             html += `<td>${totals[item].amt}</td>`;
//         });

//         html += `</tr>`;
//         html += `</tbody></table>`;

//         this.container.html(`<div class="table-scroll">${html}</div>`);

//         // ===== PAGE INFO =====
//         this.controls.find(".page-info").text(
//             `Page ${this.current_page} of ${total_pages}`
//         );
//     }
// }








// frappe.pages["party_wise_stock_ite"].on_page_load = function (wrapper) {

//     function add_styles() {
//         if (!document.getElementById("custom-report-style")) {
//             const style = document.createElement("style");
//             style.id = "custom-report-style";

//             style.innerHTML = `
//                 .table-scroll { overflow-x: auto; border: 1px solid #ddd; }
//                 .table-scroll table { min-width: 1200px; border-collapse: collapse; }
//                 .table-scroll th, .table-scroll td {
//                     min-width: 120px; text-align: center; white-space: nowrap;
//                 }
//                 .table-scroll thead th {
//                     position: sticky; top: 0; background: #f8f9fa; z-index: 2;
//                 }
//             `;
//             document.head.appendChild(style);
//         }
//     }

//     add_styles();
//     new PartyWiseSalesPage(wrapper);
// };


// class PartyWiseSalesPage {

//     constructor(wrapper) {
//         this.wrapper = $(wrapper);

//         this.page = frappe.ui.make_app_page({
//             parent: wrapper,
//             title: "Party Wise Stock Item Sales Report",
//             single_column: true,
//         });

//         this.current_page = 1;
//         this.page_size = 15;

//         this.search_customer = "";
//         this.search_item = "";

//         this.container = $('<div></div>').appendTo(this.page.main);

//         // ===== CONTROLS =====
//         this.controls = $(`
//             <div style="margin-bottom:10px; display:flex; gap:10px;">
//                 <div class="customer-link"></div>
//                 <div class="item-link"></div>
//                 <button class="btn btn-default prev">Prev</button>
//                 <button class="btn btn-default next">Next</button>
//                 <span class="page-info"></span>
//             </div>
//         `).appendTo(this.page.main);

//         // ===== LINK: CUSTOMER =====
//         this.customer_link = frappe.ui.form.make_control({
//             parent: this.controls.find(".customer-link"),
//             df: {
//                 fieldtype: "Link",
//                 label: "Customer",
//                 options: "Customer"
//             },
//             render_input: true
//         });

//         // ===== LINK: ITEM =====
//         this.item_link = frappe.ui.form.make_control({
//             parent: this.controls.find(".item-link"),
//             df: {
//                 fieldtype: "Link",
//                 label: "Item",
//                 options: "Item"
//             },
//             render_input: true
//         });

//         // ===== EVENTS =====
//         this.customer_link.$input.on("change", () => {
//             this.search_customer = this.customer_link.get_value() || "";
//             this.current_page = 1;
//             this.render_table();
//         });

//         this.item_link.$input.on("change", () => {
//             this.search_item = this.item_link.get_value() || "";
//             this.render_table();
//         });

//         this.controls.find(".prev").on("click", () => {
//             if (this.current_page > 1) {
//                 this.current_page--;
//                 this.render_table();
//             }
//         });

//         this.controls.find(".next").on("click", () => {
//             this.current_page++;
//             this.render_table();
//         });

//         this.render();
//     }

//     async render() {
//         let res = await frappe.xcall(
//             "multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.get_data"
//         );

//         this.items = res.items;
//         this.data = res.data;
//         this.uoms = res.uoms || {};
//         this.item_map = res.item_map || {};  // 👈 IMPORTANT

//         this.render_table();
//     }

//     render_table() {
//         this.container.empty();

//         const uoms = this.uoms || {};

//         // ===== FILTER ITEMS USING MAP =====
//         let filtered_items = this.items.filter(item => {
//             if (!this.search_item) return true;

//             let selected_name = this.item_map[this.search_item]; // map code → name
//             return item === selected_name;
//         });

//         // ===== FILTER CUSTOMERS =====
//         let filtered_data = {};
//         Object.entries(this.data || {}).forEach(([cust, itemData]) => {
//             if (!this.search_customer || cust === this.search_customer) {
//                 filtered_data[cust] = itemData;
//             }
//         });

//         // ===== PAGINATION =====
//         let customers = Object.keys(filtered_data);
//         let total_pages = Math.ceil(customers.length / this.page_size) || 1;

//         if (this.current_page > total_pages) {
//             this.current_page = total_pages;
//         }

//         let start = (this.current_page - 1) * this.page_size;
//         let page_customers = customers.slice(start, start + this.page_size);

//         // ===== TOTAL INIT =====
//         let totals = {};
//         filtered_items.forEach(item => {
//             totals[item] = { qty: 0, amt: 0 };
//         });

//         // ===== TABLE =====
//         let html = `<table class="table table-bordered text-center">`;

//         html += `<thead>
//             <tr>
//                 <th rowspan="2">Customer</th>
//                 ${filtered_items.map(i => `<th colspan="2">${i}</th>`).join("")}
//             </tr>
//             <tr>
//                 ${filtered_items.map(() => `<th>Qty</th><th>Amount</th>`).join("")}
//             </tr>
//         </thead>`;

//         html += `<tbody>`;

//         page_customers.forEach(cust => {
//             let itemData = filtered_data[cust];

//             html += `<tr><td>${cust}</td>`;

//             filtered_items.forEach(item => {
//                 let d = itemData[item] || { qty: 0, amt: 0 };

//                 let qty = Number(d.qty) || 0;
//                 let amt = Number(d.amt) || 0;

//                 totals[item].qty += qty;
//                 totals[item].amt += amt;

//                 html += `<td>${qty}</td><td>${amt}</td>`;
//             });

//             html += `</tr>`;
//         });

//         // ===== TOTAL ROW =====
//         html += `<tr style="font-weight:bold; background:#eee;">
//             <td>Total</td>`;

//         filtered_items.forEach(item => {
//             let uom = uoms[item] || "";
//             html += `<td>${totals[item].qty} ${uom}</td>
//                      <td>${totals[item].amt}</td>`;
//         });

//         html += `</tr></tbody></table>`;

//         this.container.html(`<div class="table-scroll">${html}</div>`);

//         this.controls.find(".page-info").text(
//             `Page ${this.current_page} of ${total_pages}`
//         );
//     }
// }






frappe.pages["party_wise_stock_ite"].on_page_load = function (wrapper) {

    function add_styles() {
        if (!document.getElementById("custom-report-style")) {
            const style = document.createElement("style");
            style.id = "custom-report-style";

            style.innerHTML = `
                .table-scroll { overflow-x: auto; border: 1px solid #ddd; }
                .table-scroll table { min-width: 1200px; border-collapse: collapse; }
                .table-scroll th, .table-scroll td {
                    min-width: 120px; text-align: center; white-space: nowrap;
                }
                .table-scroll thead th {
                    position: sticky; top: 0; background: #f8f9fa; z-index: 2;
                }
            `;
            document.head.appendChild(style);
        }
    }

    add_styles();
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

        this.current_page = 1;
        this.page_size = 15;

        this.search_customer = "";
        this.search_item = "";

        // ===== FRAPPE FILTERS (LIKE REPORTS) =====
        this.customer_filter = this.page.add_field({
            label: "Customer",
            fieldtype: "Link",
            fieldname: "customer",
            options: "Customer",
            change: () => {
                this.search_customer = this.customer_filter.get_value() || "";
                this.current_page = 1;
                this.render_table();
            }
        });

        this.item_filter = this.page.add_field({
            label: "Item",
            fieldtype: "Link",
            fieldname: "item",
            options: "Item",
            change: () => {
                this.search_item = this.item_filter.get_value() || "";
                this.render_table();
            }
        });

        // ===== PAGINATION BUTTONS =====
        // this.controls = $(`
        //     <div style="margin:10px 0; display:flex; gap:10px;">
        //         <button class="btn btn-default prev">Prev</button>
        //         <button class="btn btn-default next">Next</button>
        //         <span class="page-info"></span>
        //     </div>
        // `).appendTo(this.page.main);

        // this.controls.find(".prev").on("click", () => {
        //     if (this.current_page > 1) {
        //         this.current_page--;
        //         this.render_table();
        //     }
        // });

        // this.controls.find(".next").on("click", () => {
        //     this.current_page++;
        //     this.render_table();
        // });

		// container (TABLE)
		this.container = $('<div></div>').appendTo(this.page.main);

		// footer (BUTTONS)
		this.footer_controls = $(`
			<div style="margin-top:10px; display:flex; gap:10px; align-items:center;">
				<button class="btn btn-default prev">Prev</button>
				<button class="btn btn-default next">Next</button>
				<span class="page-info"></span>
			</div>
		`).appendTo(this.page.main);

		// EVENTS (NOW SAFE)
		this.footer_controls.find(".prev").on("click", () => {
			if (this.current_page > 1) {
				this.current_page--;
				this.render_table();
			}
		});

		this.footer_controls.find(".next").on("click", () => {
			this.current_page++;
			this.render_table();
		});

        

        this.render();
    }

    async render() {
        let res = await frappe.xcall(
            "multiple_dis.mul_dis.page.party_wise_stock_ite.party_wise_stock_ite.get_data"
        );

        this.items = res.items;
        this.data = res.data;
        this.uoms = res.uoms || {};

        this.render_table();
    }

    render_table() {
        this.container.empty();

        const uoms = this.uoms || {};

        // ===== ITEM FILTER (FIXED LOGIC) =====
        let filtered_items = this.items.filter(item => {
            if (!this.search_item) return true;

            let search = this.search_item.trim().toLowerCase();
            let current = item.trim().toLowerCase();

            return current.includes(search);
        });

        // ===== CUSTOMER FILTER =====
        let filtered_data = {};
        Object.entries(this.data || {}).forEach(([cust, itemData]) => {
            if (
                !this.search_customer ||
                cust.trim().toLowerCase().includes(this.search_customer.trim().toLowerCase())
            ) {
                filtered_data[cust] = itemData;
            }
        });

        // ===== PAGINATION =====
        let customers = Object.keys(filtered_data);
        let total_pages = Math.ceil(customers.length / this.page_size) || 1;

        if (this.current_page > total_pages) {
            this.current_page = total_pages;
        }

        let start = (this.current_page - 1) * this.page_size;
        let page_customers = customers.slice(start, start + this.page_size);

        // ===== TOTAL INIT =====
        let totals = {};
        filtered_items.forEach(item => {
            totals[item] = { qty: 0, amt: 0 };
        });

        // ===== TABLE =====
        let html = `<table class="table table-bordered text-center">`;

        html += `<thead>
            <tr>
                <th rowspan="2">Customer</th>
                ${filtered_items.map(i => `<th colspan="2">${i}</th>`).join("")}
            </tr>
            <tr>
                ${filtered_items.map(() => `<th>Qty</th><th>Amount</th>`).join("")}
            </tr>
        </thead>`;

        html += `<tbody>`;

        page_customers.forEach(cust => {
            let itemData = filtered_data[cust];

            html += `<tr><td>${cust}</td>`;

            filtered_items.forEach(item => {
                let d = itemData[item] || { qty: 0, amt: 0 };

                let qty = Number(d.qty) || 0;
                let amt = Number(d.amt) || 0;

                totals[item].qty += qty;
                totals[item].amt += amt;

                html += `<td>${qty}</td><td>${amt}</td>`;
            });

            html += `</tr>`;
        });

        // ===== TOTAL ROW =====
        html += `<tr style="font-weight:bold; background:#eee;">
            <td>Total</td>`;

        filtered_items.forEach(item => {
            let uom = uoms[item] || "";
            html += `<td>${totals[item].qty} ${uom}</td>
                     <td>${totals[item].amt}</td>`;
        });

        html += `</tr></tbody></table>`;

        this.container.html(`<div class="table-scroll">${html}</div>`);
		

        // ===== PAGE INFO =====
        this.footer_controls.find(".page-info").text(
            `Page ${this.current_page} of ${total_pages}`
        );
    }
}