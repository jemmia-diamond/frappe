// Copyright (c) 2016, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Address", {
	refresh: function (frm) {
		if (frm.doc.__islocal) {
			const last_doc = frappe.contacts.get_last_doc(frm);
			if (
				frappe.dynamic_link &&
				frappe.dynamic_link.doc &&
				frappe.dynamic_link.doc.name == last_doc.docname
			) {
				frm.set_value("links", "");
				frm.add_child("links", {
					link_doctype: frappe.dynamic_link.doctype,
					link_name: frappe.dynamic_link.doc[frappe.dynamic_link.fieldname],
				});
			}
		}
		frm.set_query("link_doctype", "links", function () {
			return {
				query: "frappe.contacts.address_and_contact.filter_dynamic_link_doctypes",
				filters: {
					fieldtype: "HTML",
					fieldname: "address_html",
				},
			};
		});
		frm.refresh_field("links");

		if (frm.doc.links) {
			for (let i in frm.doc.links) {
				let link = frm.doc.links[i];
				frm.add_custom_button(
					__("{0}: {1}", [__(link.link_doctype), __(link.link_name)]),
					function () {
						frappe.set_route("Form", link.link_doctype, link.link_name);
					},
					__("Links")
				);
			}
		}
	},
	validate: function (frm) {
		// clear linked customer / supplier / sales partner on saving...
		if (frm.doc.links) {
			frm.doc.links.forEach(function (d) {
				frappe.model.remove_from_locals(d.link_doctype, d.link_name);
			});
		}
	},
	after_save: function (frm) {
		frappe.run_serially([
			() => frappe.timeout(1),
			() => {
				const last_doc = frappe.contacts.get_last_doc(frm);
				if (
					frappe.dynamic_link &&
					frappe.dynamic_link.doc &&
					frappe.dynamic_link.doc.name == last_doc.docname
				) {
					for (let i in frm.doc.links) {
						let link = frm.doc.links[i];
						if (
							last_doc.doctype == link.link_doctype &&
							last_doc.docname == link.link_name
						) {
							frappe.set_route("Form", last_doc.doctype, last_doc.docname);
						}
					}
				}
			},
		]);
	},

	onload: function (frm) {
		frm.set_df_property("province", "options", provinces);
		frm.set_df_property("district", "options", frm.doc.district ? [frm.doc.district] : [])
		frm.set_df_property("ward", "options", frm.doc.ward ? [frm.doc.ward] : [])
	},

	province: function (frm) {
		let cur_province = frm.doc.province;
		let districts = districts_by_province.find(p => p.province == cur_province).districts;
		frm.set_df_property("district", "options", districts);
		frm.set_df_property("ward", "options", []);
		frm.set_value("district", ""); // Clear district when province changes
		frm.set_value("ward", ""); // Clear ward when province changes
	},

	district: function (frm) {
		let cur_district = frm.doc.district;
		let districtData = ward_by_district.find(d => d.district == cur_district);
    	let wards = districtData ? districtData.wards : [];
		frm.set_df_property("ward", "options", wards);
		frm.set_value("ward", ""); // Clear ward when district changes
	},
});

provinces = [
	"An Giang",
	"Bà Rịa - Vũng Tàu",
	"Bình Dương",
	"Bình Phước",
	"Bình Thuận",
	"Bình Định",
	"Bạc Liêu",
	"Bắc Giang",
	"Bắc Kạn",
	"Bắc Ninh",
	"Bến Tre",
	"Cao Bằng",
	"Cà Mau",
	"Cần Thơ",
	"Gia Lai",
	"Hoà Bình",
	"Huế",
	"Hà Giang",
	"Hà Nam",
	"Hà Nội",
	"Hà Tĩnh",
	"Hưng Yên",
	"Hải Dương",
	"Hải Phòng",
	"Hậu Giang",
	"Hồ Chí Minh",
	"Khánh Hòa",
	"Kiên Giang",
	"Kon Tum",
	"Lai Châu",
	"Long An",
	"Lào Cai",
	"Lâm Đồng",
	"Lạng Sơn",
	"Nam Định",
	"Nghệ An",
	"Ninh Bình",
	"Ninh Thuận",
	"Phú Thọ",
	"Phú Yên",
	"Quảng Bình",
	"Quảng Nam",
	"Quảng Ngãi",
	"Quảng Ninh",
	"Quảng Trị",
	"Sóc Trăng",
	"Sơn La",
	"Thanh Hóa",
	"Thái Bình",
	"Thái Nguyên",
	"Tiền Giang",
	"Trà Vinh",
	"Tuyên Quang",
	"Tây Ninh",
	"Vĩnh Long",
	"Vĩnh Phúc",
	"Yên Bái",
	"Điện Biên",
	"Đà Nẵng",
	"Đắk Lắk",
	"Đắk Nông",
	"Đồng Nai",
	"Đồng Tháp"
]

districts_by_province = [
	{
		"province": "An Giang",
		"districts": [
			"An Phú",
			"Châu Phú",
			"Châu Thành",
			"Châu Đốc",
			"Chợ Mới",
			"Long Xuyên",
			"Phú Tân",
			"Thoại Sơn",
			"Tri Tôn",
			"Tân Châu",
			"Tịnh Biên"
		]
	},
	{
		"province": "Bà Rịa - Vũng Tàu",
		"districts": [
			"Bà Rịa",
			"Châu Đức",
			"Côn Đảo",
			"Long Đất",
			"Phú Mỹ",
			"Vũng Tàu",
			"Xuyên Mộc"
		]
	},
	{
		"province": "Bình Dương",
		"districts": [
			"Bàu Bàng",
			"Bắc Tân Uyên",
			"Bến Cát",
			"Dĩ An",
			"Dầu Tiếng",
			"Phú Giáo",
			"Thuận An",
			"Thủ Dầu Một",
			"Tân Uyên"
		]
	},
	{
		"province": "Bình Phước",
		"districts": [
			"Bình Long",
			"Bù Gia Mập",
			"Bù Đăng",
			"Bù Đốp",
			"Chơn Thành",
			"Hớn Quản",
			"Lộc Ninh",
			"Phú Riềng",
			"Phước Long",
			"Đồng Phú",
			"Đồng Xoài"
		]
	},
	{
		"province": "Bình Thuận",
		"districts": [
			"Bắc Bình",
			"Hàm Thuận Bắc",
			"Hàm Thuận Nam",
			"Hàm Tân",
			"La Gi",
			"Phan Thiết",
			"Phú Quí",
			"Tuy Phong",
			"Tánh Linh",
			"Đức Linh"
		]
	},
	{
		"province": "Bình Định",
		"districts": [
			"An Lão",
			"An Nhơn",
			"Hoài Nhơn",
			"Hoài Ân",
			"Phù Cát",
			"Phù Mỹ",
			"Quy Nhơn",
			"Tuy Phước",
			"Tây Sơn",
			"Vân Canh",
			"Vĩnh Thạnh"
		]
	},
	{
		"province": "Bạc Liêu",
		"districts": [
			"Bạc Liêu",
			"Giá Rai",
			"Hoà Bình",
			"Hồng Dân",
			"Phước Long",
			"Vĩnh Lợi",
			"Đông Hải"
		]
	},
	{
		"province": "Bắc Giang",
		"districts": [
			"Bắc Giang",
			"Chũ",
			"Hiệp Hòa",
			"Lạng Giang",
			"Lục Nam",
			"Lục Ngạn",
			"Sơn Động",
			"Tân Yên",
			"Việt Yên",
			"Yên Thế"
		]
	},
	{
		"province": "Bắc Kạn",
		"districts": [
			"Ba Bể",
			"Bạch Thông",
			"Bắc Kạn",
			"Chợ Mới",
			"Chợ Đồn",
			"Na Rì",
			"Ngân Sơn",
			"Pác Nặm"
		]
	},
	{
		"province": "Bắc Ninh",
		"districts": [
			"Bắc Ninh",
			"Gia Bình",
			"Lương Tài",
			"Quế Võ",
			"Thuận Thành",
			"Tiên Du",
			"Từ Sơn",
			"Yên Phong"
		]
	},
	{
		"province": "Bến Tre",
		"districts": [
			"Ba Tri",
			"Bình Đại",
			"Bến Tre",
			"Châu Thành",
			"Chợ Lách",
			"Giồng Trôm",
			"Mỏ Cày Bắc",
			"Mỏ Cày Nam",
			"Thạnh Phú"
		]
	},
	{
		"province": "Cao Bằng",
		"districts": [
			"Bảo Lâm",
			"Bảo Lạc",
			"Cao Bằng",
			"Hoà An",
			"Hà Quảng",
			"Hạ Lang",
			"Nguyên Bình",
			"Quảng Hòa",
			"Thạch An",
			"Trùng Khánh"
		]
	},
	{
		"province": "Cà Mau",
		"districts": [
			"Cà Mau",
			"Cái Nước",
			"Ngọc Hiển",
			"Năm Căn",
			"Phú Tân",
			"Thới Bình",
			"Trần Văn Thời",
			"U Minh",
			"Đầm Dơi"
		]
	},
	{
		"province": "Cần Thơ",
		"districts": [
			"Bình Thuỷ",
			"Cái Răng",
			"Cờ Đỏ",
			"Ninh Kiều",
			"Phong Điền",
			"Thốt Nốt",
			"Thới Lai",
			"Vĩnh Thạnh",
			"Ô Môn"
		]
	},
	{
		"province": "Gia Lai",
		"districts": [
			"An Khê",
			"Ayun Pa",
			"Chư Prông",
			"Chư Păh",
			"Chư Pưh",
			"Chư Sê",
			"Ia Grai",
			"Ia Pa",
			"KBang",
			"Krông Pa",
			"Kông Chro",
			"Mang Yang",
			"Phú Thiện",
			"Pleiku",
			"Đăk Pơ",
			"Đăk Đoa",
			"Đức Cơ"
		]
	},
	{
		"province": "Hoà Bình",
		"districts": [
			"Cao Phong",
			"Hòa Bình",
			"Kim Bôi",
			"Lương Sơn",
			"Lạc Sơn",
			"Lạc Thủy",
			"Mai Châu",
			"Tân Lạc",
			"Yên Thủy",
			"Đà Bắc"
		]
	},
	{
		"province": "Huế",
		"districts": [
			"A Lưới",
			"Hương Thủy",
			"Hương Trà",
			"Phong Điền",
			"Phú Lộc",
			"Phú Vang",
			"Phú Xuân",
			"Quảng Điền",
			"Thuận Hóa"
		]
	},
	{
		"province": "Hà Giang",
		"districts": [
			"Bắc Mê",
			"Bắc Quang",
			"Hoàng Su Phì",
			"Hà Giang",
			"Mèo Vạc",
			"Quang Bình",
			"Quản Bạ",
			"Vị Xuyên",
			"Xín Mần",
			"Yên Minh",
			"Đồng Văn"
		]
	},
	{
		"province": "Hà Nam",
		"districts": [
			"Bình Lục",
			"Duy Tiên",
			"Kim Bảng",
			"Lý Nhân",
			"Phủ Lý",
			"Thanh Liêm"
		]
	},
	{
		"province": "Hà Nội",
		"districts": [
			"Ba Vì",
			"Ba Đình",
			"Bắc Từ Liêm",
			"Chương Mỹ",
			"Cầu Giấy",
			"Gia Lâm",
			"Hai Bà Trưng",
			"Hoài Đức",
			"Hoàn Kiếm",
			"Hoàng Mai",
			"Hà Đông",
			"Long Biên",
			"Mê Linh",
			"Mỹ Đức",
			"Nam Từ Liêm",
			"Phú Xuyên",
			"Phúc Thọ",
			"Quốc Oai",
			"Sóc Sơn",
			"Sơn Tây",
			"Thanh Oai",
			"Thanh Trì",
			"Thanh Xuân",
			"Thường Tín",
			"Thạch Thất",
			"Tây Hồ",
			"Đan Phượng",
			"Đông Anh",
			"Đống Đa",
			"Ứng Hòa"
		]
	},
	{
		"province": "Hà Tĩnh",
		"districts": [
			"Can Lộc",
			"Cẩm Xuyên",
			"Hà Tĩnh",
			"Hương Khê",
			"Hương Sơn",
			"Hồng Lĩnh",
			"Kỳ Anh",
			"Kỳ Anh",
			"Nghi Xuân",
			"Thạch Hà",
			"Vũ Quang",
			"Đức Thọ"
		]
	},
	{
		"province": "Hưng Yên",
		"districts": [
			"Hưng Yên",
			"Khoái Châu",
			"Kim Động",
			"Mỹ Hào",
			"Phù Cừ",
			"Tiên Lữ",
			"Văn Giang",
			"Văn Lâm",
			"Yên Mỹ",
			"Ân Thi"
		]
	},
	{
		"province": "Hải Dương",
		"districts": [
			"Bình Giang",
			"Chí Linh",
			"Cẩm Giàng",
			"Gia Lộc",
			"Hải Dương",
			"Kim Thành",
			"Kinh Môn",
			"Nam Sách",
			"Ninh Giang",
			"Thanh Hà",
			"Thanh Miện",
			"Tứ Kỳ"
		]
	},
	{
		"province": "Hải Phòng",
		"districts": [
			"An Dương",
			"An Lão",
			"Bạch Long Vĩ",
			"Cát Hải",
			"Dương Kinh",
			"Hải An",
			"Hồng Bàng",
			"Kiến An",
			"Kiến Thuỵ",
			"Lê Chân",
			"Ngô Quyền",
			"Thuỷ Nguyên",
			"Tiên Lãng",
			"Vĩnh Bảo",
			"Đồ Sơn"
		]
	},
	{
		"province": "Hậu Giang",
		"districts": [
			"Châu Thành",
			"Châu Thành A",
			"Long Mỹ",
			"Long Mỹ",
			"Ngã Bảy",
			"Phụng Hiệp",
			"Vị Thanh",
			"Vị Thuỷ"
		]
	},
	{
		"province": "Hồ Chí Minh",
		"districts": [
			"Quận 1",
			"Quận 10",
			"Quận 11",
			"Quận 12",
			"Quận 3",
			"Quận 4",
			"Quận 5",
			"Quận 6",
			"Quận 7",
			"Quận 8",
			"Bình Chánh",
			"Bình Thạnh",
			"Bình Tân",
			"Cần Giờ",
			"Củ Chi",
			"Gò Vấp",
			"Hóc Môn",
			"Nhà Bè",
			"Phú Nhuận",
			"Thủ Đức",
			"Tân Bình",
			"Tân Phú"
		]
	},
	{
		"province": "Khánh Hòa",
		"districts": [
			"Cam Lâm",
			"Cam Ranh",
			"Diên Khánh",
			"Khánh Sơn",
			"Khánh Vĩnh",
			"Nha Trang",
			"Ninh Hòa",
			"Trường Sa",
			"Vạn Ninh"
		]
	},
	{
		"province": "Kiên Giang",
		"districts": [
			"An Biên",
			"An Minh",
			"Châu Thành",
			"Giang Thành",
			"Giồng Riềng",
			"Gò Quao",
			"Hà Tiên",
			"Hòn Đất",
			"Kiên Hải",
			"Kiên Lương",
			"Phú Quốc",
			"Rạch Giá",
			"Tân Hiệp",
			"U Minh Thượng",
			"Vĩnh Thuận"
		]
	},
	{
		"province": "Kon Tum",
		"districts": [
			"Ia H' Drai",
			"Kon Plông",
			"Kon Rẫy",
			"Kon Tum",
			"Ngọc Hồi",
			"Sa Thầy",
			"Tu Mơ Rông",
			"Đắk Glei",
			"Đắk Hà",
			"Đắk Tô"
		]
	},
	{
		"province": "Lai Châu",
		"districts": [
			"Lai Châu",
			"Mường Tè",
			"Nậm Nhùn",
			"Phong Thổ",
			"Sìn Hồ",
			"Tam Đường",
			"Than Uyên",
			"Tân Uyên"
		]
	},
	{
		"province": "Long An",
		"districts": [
			"Bến Lức",
			"Châu Thành",
			"Cần Giuộc",
			"Cần Đước",
			"Kiến Tường",
			"Mộc Hóa",
			"Thạnh Hóa",
			"Thủ Thừa",
			"Tân An",
			"Tân Hưng",
			"Tân Thạnh",
			"Tân Trụ",
			"Vĩnh Hưng",
			"Đức Huệ",
			"Đức Hòa"
		]
	},
	{
		"province": "Lào Cai",
		"districts": [
			"Bát Xát",
			"Bảo Thắng",
			"Bảo Yên",
			"Bắc Hà",
			"Lào Cai",
			"Mường Khương",
			"Sa Pa",
			"Si Ma Cai",
			"Văn Bàn"
		]
	},
	{
		"province": "Lâm Đồng",
		"districts": [
			"Bảo Lâm",
			"Bảo Lộc",
			"Di Linh",
			"Lâm Hà",
			"Lạc Dương",
			"Đam Rông",
			"Đà Lạt",
			"Đơn Dương",
			"Đạ Tẻh",
			"Đức Trọng"
		]
	},
	{
		"province": "Lạng Sơn",
		"districts": [
			"Bình Gia",
			"Bắc Sơn",
			"Cao Lộc",
			"Chi Lăng",
			"Hữu Lũng",
			"Lạng Sơn",
			"Lộc Bình",
			"Tràng Định",
			"Văn Lãng",
			"Văn Quan",
			"Đình Lập"
		]
	},
	{
		"province": "Nam Định",
		"districts": [
			"Giao Thủy",
			"Hải Hậu",
			"Nam Trực",
			"Nam Định",
			"Nghĩa Hưng",
			"Trực Ninh",
			"Vụ Bản",
			"Xuân Trường",
			"Ý Yên"
		]
	},
	{
		"province": "Nghệ An",
		"districts": [
			"Anh Sơn",
			"Con Cuông",
			"Diễn Châu",
			"Hoàng Mai",
			"Hưng Nguyên",
			"Kỳ Sơn",
			"Nam Đàn",
			"Nghi Lộc",
			"Nghĩa Đàn",
			"Quế Phong",
			"Quỳ Châu",
			"Quỳ Hợp",
			"Quỳnh Lưu",
			"Thanh Chương",
			"Thái Hoà",
			"Tân Kỳ",
			"Tương Dương",
			"Vinh",
			"Yên Thành",
			"Đô Lương"
		]
	},
	{
		"province": "Ninh Bình",
		"districts": [
			"Gia Viễn",
			"Hoa Lư",
			"Kim Sơn",
			"Nho Quan",
			"Tam Điệp",
			"Yên Khánh",
			"Yên Mô"
		]
	},
	{
		"province": "Ninh Thuận",
		"districts": [
			"Bác Ái",
			"Ninh Hải",
			"Ninh Phước",
			"Ninh Sơn",
			"Phan Rang-Tháp Chàm",
			"Thuận Bắc",
			"Thuận Nam"
		]
	},
	{
		"province": "Phú Thọ",
		"districts": [
			"Cẩm Khê",
			"Hạ Hoà",
			"Lâm Thao",
			"Phù Ninh",
			"Phú Thọ",
			"Tam Nông",
			"Thanh Ba",
			"Thanh Sơn",
			"Thanh Thuỷ",
			"Tân Sơn",
			"Việt Trì",
			"Yên Lập",
			"Đoan Hùng"
		]
	},
	{
		"province": "Phú Yên",
		"districts": [
			"Phú Hoà",
			"Sông Cầu",
			"Sông Hinh",
			"Sơn Hòa",
			"Tuy An",
			"Tuy Hoà",
			"Tây Hoà",
			"Đông Hòa",
			"Đồng Xuân"
		]
	},
	{
		"province": "Quảng Bình",
		"districts": [
			"Ba Đồn",
			"Bố Trạch",
			"Lệ Thủy",
			"Minh Hóa",
			"Quảng Ninh",
			"Quảng Trạch",
			"Tuyên Hóa",
			"Đồng Hới"
		]
	},
	{
		"province": "Quảng Nam",
		"districts": [
			"Bắc Trà My",
			"Duy Xuyên",
			"Hiệp Đức",
			"Hội An",
			"Nam Giang",
			"Nam Trà My",
			"Núi Thành",
			"Phú Ninh",
			"Phước Sơn",
			"Quế Sơn",
			"Tam Kỳ",
			"Thăng Bình",
			"Tiên Phước",
			"Tây Giang",
			"Điện Bàn",
			"Đông Giang",
			"Đại Lộc"
		]
	},
	{
		"province": "Quảng Ngãi",
		"districts": [
			"Ba Tơ",
			"Bình Sơn",
			"Lý Sơn",
			"Minh Long",
			"Mộ Đức",
			"Nghĩa Hành",
			"Quảng Ngãi",
			"Sơn Hà",
			"Sơn Tây",
			"Sơn Tịnh",
			"Trà Bồng",
			"Tư Nghĩa",
			"Đức Phổ"
		]
	},
	{
		"province": "Quảng Ninh",
		"districts": [
			"Ba Chẽ",
			"Bình Liêu",
			"Cô Tô",
			"Cẩm Phả",
			"Hạ Long",
			"Hải Hà",
			"Móng Cái",
			"Quảng Yên",
			"Tiên Yên",
			"Uông Bí",
			"Vân Đồn",
			"Đông Triều",
			"Đầm Hà"
		]
	},
	{
		"province": "Quảng Trị",
		"districts": [
			"Cam Lộ",
			"Cồn Cỏ",
			"Gio Linh",
			"Hướng Hóa",
			"Hải Lăng",
			"Quảng Trị",
			"Triệu Phong",
			"Vĩnh Linh",
			"Đa Krông",
			"Đông Hà"
		]
	},
	{
		"province": "Sóc Trăng",
		"districts": [
			"Châu Thành",
			"Cù Lao Dung",
			"Kế Sách",
			"Long Phú",
			"Mỹ Tú",
			"Mỹ Xuyên",
			"Ngã Năm",
			"Sóc Trăng",
			"Thạnh Trị",
			"Trần Đề",
			"Vĩnh Châu"
		]
	},
	{
		"province": "Sơn La",
		"districts": [
			"Bắc Yên",
			"Mai Sơn",
			"Mường La",
			"Mộc Châu",
			"Phù Yên",
			"Quỳnh Nhai",
			"Sông Mã",
			"Sơn La",
			"Sốp Cộp",
			"Thuận Châu",
			"Vân Hồ",
			"Yên Châu"
		]
	},
	{
		"province": "Thanh Hóa",
		"districts": [
			"Bá Thước",
			"Bỉm Sơn",
			"Cẩm Thủy",
			"Hoằng Hóa",
			"Hà Trung",
			"Hậu Lộc",
			"Lang Chánh",
			"Mường Lát",
			"Nga Sơn",
			"Nghi Sơn",
			"Ngọc Lặc",
			"Như Thanh",
			"Như Xuân",
			"Nông Cống",
			"Quan Hóa",
			"Quan Sơn",
			"Quảng Xương",
			"Sầm Sơn",
			"Thanh Hóa",
			"Thiệu Hóa",
			"Thường Xuân",
			"Thạch Thành",
			"Thọ Xuân",
			"Triệu Sơn",
			"Vĩnh Lộc",
			"Yên Định"
		]
	},
	{
		"province": "Thái Bình",
		"districts": [
			"Hưng Hà",
			"Kiến Xương",
			"Quỳnh Phụ",
			"Thái Bình",
			"Thái Thụy",
			"Tiền Hải",
			"Vũ Thư",
			"Đông Hưng"
		]
	},
	{
		"province": "Thái Nguyên",
		"districts": [
			"Phú Bình",
			"Phú Lương",
			"Phổ Yên",
			"Sông Công",
			"Thái Nguyên",
			"Võ Nhai",
			"Đại Từ",
			"Định Hóa",
			"Đồng Hỷ"
		]
	},
	{
		"province": "Tiền Giang",
		"districts": [
			"Cai Lậy",
			"Cai Lậy",
			"Châu Thành",
			"Chợ Gạo",
			"Cái Bè",
			"Gò Công",
			"Gò Công Tây",
			"Gò Công Đông",
			"Mỹ Tho",
			"Tân Phú Đông",
			"Tân Phước"
		]
	},
	{
		"province": "Trà Vinh",
		"districts": [
			"Châu Thành",
			"Càng Long",
			"Cầu Kè",
			"Cầu Ngang",
			"Duyên Hải",
			"Duyên Hải",
			"Tiểu Cần",
			"Trà Cú",
			"Trà Vinh"
		]
	},
	{
		"province": "Tuyên Quang",
		"districts": [
			"Chiêm Hóa",
			"Hàm Yên",
			"Lâm Bình",
			"Na Hang",
			"Sơn Dương",
			"Tuyên Quang",
			"Yên Sơn"
		]
	},
	{
		"province": "Tây Ninh",
		"districts": [
			"Bến Cầu",
			"Châu Thành",
			"Dương Minh Châu",
			"Gò Dầu",
			"Hòa Thành",
			"Trảng Bàng",
			"Tân Biên",
			"Tân Châu",
			"Tây Ninh"
		]
	},
	{
		"province": "Vĩnh Long",
		"districts": [
			"Bình Minh",
			"Bình Tân",
			"Long Hồ",
			"Mang Thít",
			"Tam Bình",
			"Trà Ôn",
			"Vĩnh Long",
			"Vũng Liêm"
		]
	},
	{
		"province": "Vĩnh Phúc",
		"districts": [
			"Bình Xuyên",
			"Lập Thạch",
			"Phúc Yên",
			"Sông Lô",
			"Tam Dương",
			"Tam Đảo",
			"Vĩnh Tường",
			"Vĩnh Yên",
			"Yên Lạc"
		]
	},
	{
		"province": "Yên Bái",
		"districts": [
			"Lục Yên",
			"Mù Căng Chải",
			"Nghĩa Lộ",
			"Trạm Tấu",
			"Trấn Yên",
			"Văn Chấn",
			"Văn Yên",
			"Yên Bái",
			"Yên Bình"
		]
	},
	{
		"province": "Điện Biên",
		"districts": [
			"Mường Chà",
			"Mường Lay",
			"Mường Nhé",
			"Mường Ảng",
			"Nậm Pồ",
			"Tuần Giáo",
			"Tủa Chùa",
			"Điện Biên",
			"Điện Biên Phủ",
			"Điện Biên Đông"
		]
	},
	{
		"province": "Đà Nẵng",
		"districts": [
			"Cẩm Lệ",
			"Hoàng Sa",
			"Hòa Vang",
			"Hải Châu",
			"Liên Chiểu",
			"Ngũ Hành Sơn",
			"Sơn Trà",
			"Thanh Khê"
		]
	},
	{
		"province": "Đắk Lắk",
		"districts": [
			"Buôn Hồ",
			"Buôn Ma Thuột",
			"Buôn Đôn",
			"Cư Kuin",
			"Cư M'gar",
			"Ea H'leo",
			"Ea Kar",
			"Ea Súp",
			"Krông A Na",
			"Krông Bông",
			"Krông Búk",
			"Krông Năng",
			"Krông Pắc",
			"Lắk",
			"M'Đrắk"
		]
	},
	{
		"province": "Đắk Nông",
		"districts": [
			"Cư Jút",
			"Gia Nghĩa",
			"Krông Nô",
			"Tuy Đức",
			"Đăk Glong",
			"Đắk Mil",
			"Đắk R'Lấp",
			"Đắk Song"
		]
	},
	{
		"province": "Đồng Nai",
		"districts": [
			"Biên Hòa",
			"Cẩm Mỹ",
			"Long Khánh",
			"Long Thành",
			"Nhơn Trạch",
			"Thống Nhất",
			"Trảng Bom",
			"Tân Phú",
			"Vĩnh Cửu",
			"Xuân Lộc",
			"Định Quán"
		]
	},
	{
		"province": "Đồng Tháp",
		"districts": [
			"Cao Lãnh",
			"Cao Lãnh",
			"Châu Thành",
			"Hồng Ngự",
			"Hồng Ngự",
			"Lai Vung",
			"Lấp Vò",
			"Sa Đéc",
			"Tam Nông",
			"Thanh Bình",
			"Tháp Mười",
			"Tân Hồng"
		]
	}
]


ward_by_district = [
	{
		"wards": [
			"Bến Nghé",
			"Bến Thành",
			"Cô Giang",
			"Cầu Kho",
			"Cầu Ông Lãnh",
			"Nguyễn Cư Trinh",
			"Nguyễn Thái Bình",
			"Phạm Ngũ Lão",
			"Tân Định",
			"Đa Kao"
		],
		"district": "Quận 1"
	},
	{
		"wards": [
			"Phường 1",
			"Phường 10",
			"Phường 12",
			"Phường 13",
			"Phường 14",
			"Phường 15",
			"Phường 2",
			"Phường 4",
			"Phường 6",
			"Phường 8",
			"Phường 9"
		],
		"district": "Quận 10"
	},
	{
		"wards": [
			"Phường 1",
			"10",
			"11",
			"14",
			"15",
			"16",
			"3",
			"5",
			"7",
			"8"
		],
		"district": "Quận 11"
	},
	{
		"wards": [
			"An Phú Đông",
			"Hiệp Thành",
			"Thạnh Lộc",
			"Thạnh Xuân",
			"Thới An",
			"Trung Mỹ Tây",
			"Tân Chánh Hiệp",
			"Tân Hưng Thuận",
			"Tân Thới Hiệp",
			"Tân Thới Nhất",
			"Đông Hưng Thuận"
		],
		"district": "Quận 12"
	},
	{
		"wards": [
			"Phường 1",
			"Phường 11",
			"Phường 12",
			"Phường 14",
			"Phường 2",
			"Phường 3",
			"Phường 4",
			"Phường 5",
			"Phường 9",
			"Phường Võ Thị Sáu"
		],
		"district": "Quận 3"
	},
	{
		"wards": [
			"Phường 1",
			"Phường 13",
			"Phường 15",
			"Phường 16",
			"Phường 18",
			"Phường 2",
			"Phường 3",
			"Phường 4",
			"Phường 8",
			"Phường 9"
		],
		"district": "Quận 4"
	},
	{
		"wards": [
			"Phường 1",
			"Phường 11",
			"Phường 12",
			"Phường 13",
			"Phường 14",
			"Phường 2",
			"Phường 4",
			"Phường 5",
			"Phường 7",
			"Phường 9"
		],
		"district": "Quận 5"
	},
	{
		"wards": [
			"Phường 1",
			"Phường 10",
			"Phường 11",
			"Phường 12",
			"Phường 13",
			"Phường 14",
			"Phường 2",
			"Phường 7",
			"Phường 8",
			"Phường 9"
		],
		"district": "Quận 6"
	},
	{
		"wards": [
			"Bình Thuận",
			"Phú Mỹ",
			"Phú Thuận",
			"Tân Hưng",
			"Tân Kiểng",
			"Tân Phong",
			"Tân Phú",
			"Tân Quy",
			"Tân Thuận Tây",
			"Tân Thuận Đông"
		],
		"district": "Quận 7"
	},
	{
		"wards": [
			"Phường 14",
			"Phường 15",
			"Phường 16",
			"Phường 4",
			"Phường 5",
			"Phường 6",
			"Phường 7",
			"Phường Hưng Phú",
			"Phường Rạch Ông",
			"Phường Xóm Củi"
		],
		"district": "Quận 8"
	},
	{
		"wards": [
			"A Lưới",
			"A Ngo",
			"A Roàng",
			"Hương Nguyên",
			"Hương Phong",
			"Hồng Bắc",
			"Hồng Hạ",
			"Hồng Kim",
			"Hồng Thái",
			"Hồng Thượng",
			"Hồng Thủy",
			"Hồng Vân",
			"Lâm Đớt",
			"Phú Vinh",
			"Quảng Nhâm",
			"Sơn Thủy",
			"Trung Sơn",
			"Đông Sơn"
		],
		"district": "A Lưới"
	},
	{
		"wards": [
			"Hưng Yên",
			"Nam Thái",
			"Nam Thái A",
			"Nam Yên",
			"Thứ Ba",
			"Tây Yên",
			"Tây Yên A",
			"Đông Thái",
			"Đông Yên"
		],
		"district": "An Biên"
	},
	{
		"wards": [
			"An Hoà",
			"An Hải",
			"An Đồng",
			"Hồng Phong",
			"Hồng Thái",
			"Lê Lợi",
			"Lê Thiện",
			"Nam Sơn",
			"Tân Tiến",
			"Đồng Thái"
		],
		"district": "An Dương"
	},
	{
		"wards": [
			"An Bình",
			"An Phú",
			"An Phước",
			"An Tân",
			"Cửu An",
			"Ngô Mây",
			"Song An",
			"Thành An",
			"Tây Sơn",
			"Tú An",
			"Xuân An"
		],
		"district": "An Khê"
	},
	{
		"wards": [
			"An Dũng",
			"An Hòa",
			"An Hưng",
			"An Lão",
			"An Lão",
			"An Nghĩa",
			"An Quang",
			"An Thái",
			"An Thắng",
			"An Thọ",
			"An Tiến",
			"An Toàn",
			"An Trung",
			"An Tân",
			"An Vinh",
			"Bát Trang",
			"Chiến Thắng",
			"Mỹ Đức",
			"Quang Hưng",
			"Quang Trung",
			"Quốc Tuấn",
			"Thái Sơn",
			"Trường Sơn",
			"Trường Thành",
			"Trường Thọ",
			"Tân Dân",
			"Tân Viên"
		],
		"district": "An Lão"
	},
	{
		"wards": [
			"Thuận Hoà",
			"Thứ Mười Một",
			"Tân Thạnh",
			"Vân Khánh",
			"Vân Khánh Tây",
			"Vân Khánh Đông",
			"Đông Hòa",
			"Đông Hưng",
			"Đông Hưng A",
			"Đông Hưng B",
			"Đông Thạnh"
		],
		"district": "An Minh"
	},
	{
		"wards": [
			"Bình Định",
			"Nhơn An",
			"Nhơn Hoà",
			"Nhơn Hưng",
			"Nhơn Hạnh",
			"Nhơn Hậu",
			"Nhơn Khánh",
			"Nhơn Lộc",
			"Nhơn Mỹ",
			"Nhơn Phong",
			"Nhơn Phúc",
			"Nhơn Thành",
			"Nhơn Thọ",
			"Nhơn Tân",
			"Đập Đá"
		],
		"district": "An Nhơn"
	},
	{
		"wards": [
			"An Phú",
			"Khánh An",
			"Khánh Bình",
			"Long Bình",
			"Nhơn Hội",
			"Phú Hội",
			"Phú Hữu",
			"Phước Hưng",
			"Quốc Thái",
			"Vĩnh Hậu",
			"Vĩnh Hội Đông",
			"Vĩnh Lộc",
			"Vĩnh Trường",
			"Đa Phước"
		],
		"district": "An Phú"
	},
	{
		"wards": [
			"Bình Sơn",
			"Cao Sơn",
			"Cẩm Sơn",
			"Hoa Sơn",
			"Hùng Sơn",
			"Hội Sơn",
			"Khai Sơn",
			"Kim Nhan",
			"Long Sơn",
			"Lĩnh Sơn",
			"Lạng Sơn",
			"Phúc Sơn",
			"Tam Đỉnh",
			"Thành Sơn",
			"Thọ Sơn",
			"Tào Sơn",
			"Tường Sơn",
			"Vĩnh Sơn",
			"Đức Sơn"
		],
		"district": "Anh Sơn"
	},
	{
		"wards": [
			"Cheo Reo",
			"Chư Băh",
			"Hòa Bình",
			"Ia RBol",
			"Ia RTô",
			"Ia Sao",
			"Sông Bờ",
			"Đoàn Kết"
		],
		"district": "Ayun Pa"
	},
	{
		"wards": [
			"Bành Trạch",
			"Cao Thượng",
			"Chu Hương",
			"Chợ Rã",
			"Hoàng Trĩ",
			"Hà Hiệu",
			"Khang Ninh",
			"Mỹ Phương",
			"Nam Mẫu",
			"Phúc Lộc",
			"Quảng Khê",
			"Thượng Giáo",
			"Yến Dương",
			"Địa Linh",
			"Đồng Phúc"
		],
		"district": "Ba Bể"
	},
	{
		"wards": [
			"Ba Chẽ",
			"Lương Minh",
			"Nam Sơn",
			"Thanh Lâm",
			"Thanh Sơn",
			"Đạp Thanh",
			"Đồn Đạc"
		],
		"district": "Ba Chẽ"
	},
	{
		"wards": [
			"An Bình Tây",
			"An Hiệp",
			"An Hòa Tây",
			"An Ngãi Trung",
			"An Ngãi Tây",
			"An Phú Trung",
			"An Đức",
			"Ba Tri",
			"Bảo Thuận",
			"Bảo Thạnh",
			"Mỹ Chánh",
			"Mỹ Hòa",
			"Mỹ Nhơn",
			"Mỹ Thạnh",
			"Phú Lễ",
			"Phước Ngãi",
			"Tiệm Tôm",
			"Tân Hưng",
			"Tân Thủy",
			"Tân Xuân",
			"Vĩnh An",
			"Vĩnh Hòa"
		],
		"district": "Ba Tri"
	},
	{
		"wards": [
			"Ba Bích",
			"Ba Cung",
			"Ba Dinh",
			"Ba Giang",
			"Ba Khâm",
			"Ba Liên",
			"Ba Lế",
			"Ba Nam",
			"Ba Ngạc",
			"Ba Thành",
			"Ba Tiêu",
			"Ba Trang",
			"Ba Tô",
			"Ba Tơ",
			"Ba Vinh",
			"Ba Vì",
			"Ba Xa",
			"Ba Điền",
			"Ba Động"
		],
		"district": "Ba Tơ"
	},
	{
		"wards": [
			"Ba Trại",
			"Ba Vì",
			"Cam Thượng",
			"Chu Minh",
			"Cẩm Lĩnh",
			"Cổ Đô",
			"Khánh Thượng",
			"Minh Châu",
			"Minh Quang",
			"Phong Vân",
			"Phú Châu",
			"Phú Cường",
			"Phú Hồng",
			"Phú Sơn",
			"Phú Đông",
			"Sơn Đà",
			"Thuần Mỹ",
			"Thái Hòa",
			"Thụy An",
			"Tiên Phong",
			"Tây Đằng",
			"Tòng Bạt",
			"Tản Lĩnh",
			"Vân Hòa",
			"Vạn Thắng",
			"Vật Lại",
			"Yên Bài",
			"Đông Quang",
			"Đồng Thái"
		],
		"district": "Ba Vì"
	},
	{
		"wards": [
			"Cống Vị",
			"Giảng Võ",
			"Kim Mã",
			"Liễu Giai",
			"Ngọc Hà",
			"Ngọc Khánh",
			"Phúc Xá",
			"Quán Thánh",
			"Thành Công",
			"Trúc Bạch",
			"Vĩnh Phúc",
			"Điện Biên",
			"Đội Cấn"
		],
		"district": "Ba Đình"
	},
	{
		"wards": [
			"Ba Đồn",
			"Quảng Hòa",
			"Quảng Hải",
			"Quảng Long",
			"Quảng Lộc",
			"Quảng Minh",
			"Quảng Phong",
			"Quảng Phúc",
			"Quảng Sơn",
			"Quảng Thuận",
			"Quảng Thọ",
			"Quảng Thủy",
			"Quảng Tiên",
			"Quảng Trung",
			"Quảng Tân",
			"Quảng Văn"
		],
		"district": "Ba Đồn"
	},
	{
		"wards": [
			"An Bình",
			"An Hòa",
			"Bình Đa",
			"Bửu Hòa",
			"Bửu Long",
			"Hiệp Hòa",
			"Hóa An",
			"Hố Nai",
			"Long Bình",
			"Long Bình Tân",
			"Long Hưng",
			"Phước Tân",
			"Quang Vinh",
			"Tam Hiệp",
			"Tam Phước",
			"Thống Nhất",
			"Trung Dũng",
			"Trảng Dài",
			"Tân Biên",
			"Tân Hiệp",
			"Tân Hòa",
			"Tân Hạnh",
			"Tân Mai",
			"Tân Phong",
			"Tân Vạn"
		],
		"district": "Biên Hòa"
	},
	{
		"wards": [
			"An Bình",
			"An Lạc",
			"Bình Thuận",
			"Bình Tân",
			"Cư Bao",
			"Ea Drông",
			"Ea Siên",
			"Thiện An",
			"Thống Nhất",
			"Đoàn Kết",
			"Đạt Hiếu"
		],
		"district": "Buôn Hồ"
	},
	{
		"wards": [
			"Cư ÊBur",
			"Ea Kao",
			"Ea Tam",
			"Ea Tu",
			"Hòa Khánh",
			"Hòa Phú",
			"Hòa Thuận",
			"Hòa Thắng",
			"Hòa Xuân",
			"Khánh Xuân",
			"Thành Công",
			"Thành Nhất",
			"Tân An",
			"Tân Hòa",
			"Tân Lập",
			"Tân Lợi",
			"Tân Thành",
			"Tân Tiến",
			"Tự An"
		],
		"district": "Buôn Ma Thuột"
	},
	{
		"wards": [
			"Cuôr KNia",
			"Ea Bar",
			"Ea Huar",
			"Ea Nuôl",
			"Ea Wer",
			"Krông Na",
			"Tân Hoà"
		],
		"district": "Buôn Đôn"
	},
	{
		"wards": [
			"Hoà Long",
			"Kim Dinh",
			"Long Hương",
			"Long Phước",
			"Long Toàn",
			"Long Tâm",
			"Phước Hưng",
			"Phước Nguyên",
			"Phước Trung",
			"Tân Hưng"
		],
		"district": "Bà Rịa"
	},
	{
		"wards": [
			"Cây Trường II",
			"Hưng Hòa",
			"Lai Hưng",
			"Lai Uyên",
			"Long Nguyên",
			"Trừ Văn Thố",
			"Tân Hưng"
		],
		"district": "Bàu Bàng"
	},
	{
		"wards": [
			"Ban Công",
			"Cành Nàng",
			"Cổ Lũng",
			"Hạ Trung",
			"Kỳ Tân",
			"Lũng Cao",
			"Lũng Niêm",
			"Lương Ngoại",
			"Lương Nội",
			"Lương Trung",
			"Thiết Kế",
			"Thiết Ống",
			"Thành Lâm",
			"Thành Sơn",
			"Văn Nho",
			"Ái Thượng",
			"Điền Hạ",
			"Điền Lư",
			"Điền Quang",
			"Điền Thượng",
			"Điền Trung"
		],
		"district": "Bá Thước"
	},
	{
		"wards": [
			"Phước Bình",
			"Phước Chính",
			"Phước Hòa",
			"Phước Thành",
			"Phước Thắng",
			"Phước Tiến",
			"Phước Trung",
			"Phước Tân",
			"Phước Đại"
		],
		"district": "Bác Ái"
	},
	{
		"wards": [
			"A Lù",
			"A Mú Sung",
			"Bát Xát",
			"Bản Qua",
			"Bản Vược",
			"Bản Xèo",
			"Cốc Mỳ",
			"Dền Sáng",
			"Dền Thàng",
			"Mường Hum",
			"Mường Vi",
			"Nậm Chạc",
			"Nậm Pung",
			"Pa Cheo",
			"Phìn Ngan",
			"Quang Kim",
			"Sàng Ma Sáo",
			"Trung Lèng Hồ",
			"Trịnh Tường",
			"Tòng Sành",
			"Y Tý"
		],
		"district": "Bát Xát"
	},
	{
		"wards": [
			"An Phú Tây",
			"Bình Chánh",
			"Bình Hưng",
			"Bình Lợi",
			"Hưng Long",
			"Lê Minh Xuân",
			"Phong Phú",
			"Phạm Văn Hai",
			"Quy Đức",
			"Tân Kiên",
			"Tân Nhựt",
			"Tân Quý Tây",
			"Tân Túc",
			"Vĩnh Lộc A",
			"Vĩnh Lộc B",
			"Đa Phước"
		],
		"district": "Bình Chánh"
	},
	{
		"wards": [
			"Bình Gia",
			"Bình La",
			"Hoa Thám",
			"Hoàng Văn Thụ",
			"Hòa Bình",
			"Hưng Đạo",
			"Hồng Phong",
			"Hồng Thái",
			"Minh Khai",
			"Mông Ân",
			"Quang Trung",
			"Quý Hòa",
			"Thiện Hòa",
			"Thiện Long",
			"Thiện Thuật",
			"Tân Hòa",
			"Tân Văn",
			"Vĩnh Yên",
			"Yên Lỗ"
		],
		"district": "Bình Gia"
	},
	{
		"wards": [
			"Bình Xuyên",
			"Cổ Bì",
			"Hùng Thắng",
			"Hồng Khê",
			"Kẻ Sặt",
			"Long Xuyên",
			"Nhân Quyền",
			"Thái Dương",
			"Thái Hòa",
			"Thái Minh",
			"Thúc Kháng",
			"Tân Hồng",
			"Tân Việt",
			"Vĩnh Hưng",
			"Vĩnh Hồng"
		],
		"district": "Bình Giang"
	},
	{
		"wards": [
			"Bình Liêu",
			"Hoành Mô",
			"Húc Động",
			"Lục Hồn",
			"Vô Ngại",
			"Đồng Tâm",
			"Đồng Văn"
		],
		"district": "Bình Liêu"
	},
	{
		"wards": [
			"An Lộc",
			"Hưng Chiến",
			"Phú Thịnh",
			"Phú Đức",
			"Thanh Lương",
			"Thanh Phú"
		],
		"district": "Bình Long"
	},
	{
		"wards": [
			"An Lão",
			"An Ninh",
			"An Đổ",
			"Bình An",
			"Bình Mỹ",
			"Bình Nghĩa",
			"Bồ Đề",
			"La Sơn",
			"Ngọc Lũ",
			"Tiêu Động",
			"Trung Lương",
			"Tràng An",
			"Vũ Bản",
			"Đồn Xá",
			"Đồng Du"
		],
		"district": "Bình Lục"
	},
	{
		"wards": [
			"Cái Vồn",
			"Mỹ Hòa",
			"Thuận An",
			"Thành Phước",
			"Đông Bình",
			"Đông Thuận",
			"Đông Thành",
			"Đông Thạnh"
		],
		"district": "Bình Minh"
	},
	{
		"wards": [
			"Bình An",
			"Bình Chánh",
			"Bình Châu",
			"Bình Chương",
			"Bình Dương",
			"Bình Hiệp",
			"Bình Hòa",
			"Bình Hải",
			"Bình Khương",
			"Bình Long",
			"Bình Minh",
			"Bình Mỹ",
			"Bình Nguyên",
			"Bình Phước",
			"Bình Thanh",
			"Bình Thuận",
			"Bình Thạnh",
			"Bình Trung",
			"Bình Trị",
			"Bình Tân Phú",
			"Bình Đông",
			"Châu Ổ"
		],
		"district": "Bình Sơn"
	},
	{
		"wards": [
			"An Thới",
			"Bình Thủy",
			"Bùi Hữu Nghĩa",
			"Long Hòa",
			"Long Tuyền",
			"Thới An Đông",
			"Trà An",
			"Trà Nóc"
		],
		"district": "Bình Thuỷ"
	},
	{
		"wards": [
			"1",
			"11",
			"12",
			"13",
			"14",
			"17",
			"19",
			"2",
			"22",
			"25",
			"26",
			"27",
			"28",
			"5",
			"7"
		],
		"district": "Bình Thạnh"
	},
	{
		"wards": [
			"An Lạc",
			"An Lạc A",
			"Bình Hưng Hoà A",
			"Bình Hưng Hoà B",
			"Bình Hưng Hòa",
			"Bình Trị Đông",
			"Bình Trị Đông A",
			"Bình Trị Đông B",
			"Mỹ Thuận",
			"Nguyễn Văn Thảnh",
			"Thành Lợi",
			"Thành Trung",
			"Tân An Thạnh",
			"Tân Bình",
			"Tân Lược",
			"Tân Quới",
			"Tân Thành",
			"Tân Tạo",
			"Tân Tạo A"
		],
		"district": "Bình Tân"
	},
	{
		"wards": [
			"Bá Hiến",
			"Gia Khánh",
			"Hương Canh",
			"Hương Sơn",
			"Phú Xuân",
			"Quất Lưu",
			"Sơn Lôi",
			"Tam Hợp",
			"Thanh Lãng",
			"Thiện Kế",
			"Trung Mỹ",
			"Tân Phong",
			"Đạo Đức"
		],
		"district": "Bình Xuyên"
	},
	{
		"wards": [
			"Bình Thắng",
			"Bình Thới",
			"Bình Đại",
			"Châu Hưng",
			"Long Hòa",
			"Long Định",
			"Lộc Thuận",
			"Phú Long",
			"Phú Thuận",
			"Tam Hiệp",
			"Thạnh Phước",
			"Thạnh Trị",
			"Thới Lai",
			"Thới Thuận",
			"Thừa Đức",
			"Vang Quới Tây",
			"Vang Quới Đông",
			"Đại Hòa Lộc",
			"Định Trung"
		],
		"district": "Bình Đại"
	},
	{
		"wards": [
			"Bình Thắng",
			"Bù Gia Mập",
			"Phú Nghĩa",
			"Phú Văn",
			"Phước Minh",
			"Đa Kia",
			"Đak Ơ",
			"Đức Hạnh"
		],
		"district": "Bù Gia Mập"
	},
	{
		"wards": [
			"Bom Bo",
			"Bình Minh",
			"Minh Hưng",
			"Nghĩa Bình",
			"Nghĩa Trung",
			"Phú Sơn",
			"Phước Sơn",
			"Thọ Sơn",
			"Thống Nhất",
			"Đak Nhau",
			"Đoàn Kết",
			"Đăng Hà",
			"Đường 10",
			"Đồng Nai",
			"Đức Liễu",
			"Đức Phong"
		],
		"district": "Bù Đăng"
	},
	{
		"wards": [
			"Hưng Phước",
			"Phước Thiện",
			"Thanh Bình",
			"Thanh Hòa",
			"Thiện Hưng",
			"Tân Thành",
			"Tân Tiến"
		],
		"district": "Bù Đốp"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"5",
			"7",
			"8",
			"Hiệp Thành",
			"Nhà Mát",
			"Vĩnh Trạch",
			"Vĩnh Trạch Đông"
		],
		"district": "Bạc Liêu"
	},
	{
		"wards": [
			"Cao Sơn",
			"Cẩm Giàng",
			"Dương Phong",
			"Lục Bình",
			"Mỹ Thanh",
			"Nguyên Phúc",
			"Phủ Thông",
			"Quang Thuận",
			"Quân Hà",
			"Sĩ Bình",
			"Tân Tú",
			"Vi Hương",
			"Vũ Muộn",
			"Đôn Phong"
		],
		"district": "Bạch Thông"
	},
	{
		"wards": [
			"B' Lá",
			"Lý Bôn",
			"Lộc An",
			"Lộc Bảo",
			"Lộc Bắc",
			"Lộc Lâm",
			"Lộc Nam",
			"Lộc Ngãi",
			"Lộc Phú",
			"Lộc Quảng",
			"Lộc Thành",
			"Lộc Thắng",
			"Lộc Tân",
			"Lộc Đức",
			"Mông Ân",
			"Nam Cao",
			"Nam Quang",
			"Pác Miầu",
			"Quảng Lâm",
			"Thái Học",
			"Thái Sơn",
			"Thạch Lâm",
			"Tân Lạc",
			"Vĩnh Phong",
			"Vĩnh Quang",
			"Yên Thổ",
			"Đức Hạnh"
		],
		"district": "Bảo Lâm"
	},
	{
		"wards": [
			"Bảo Lạc",
			"Bảo Toàn",
			"Cô Ba",
			"Cốc Pàng",
			"Huy Giáp",
			"Hưng Thịnh",
			"Hưng Đạo",
			"Hồng An",
			"Hồng Trị",
			"Khánh Xuân",
			"Kim Cúc",
			"Phan Thanh",
			"Sơn Lập",
			"Sơn Lộ",
			"Thượng Hà",
			"Xuân Trường",
			"Đình Phùng"
		],
		"district": "Bảo Lạc"
	},
	{
		"wards": [
			"1",
			"2",
			"B'lao",
			"Lộc Châu",
			"Lộc Nga",
			"Lộc Phát",
			"Lộc Sơn",
			"Lộc Thanh",
			"Lộc Tiến",
			"Đại Lào",
			"Đạm Bri"
		],
		"district": "Bảo Lộc"
	},
	{
		"wards": [
			"Bản Cầm",
			"Bản Phiệt",
			"Gia Phú",
			"N.T Phong Hải",
			"Phong Niên",
			"Phú Nhuận",
			"Phố Lu",
			"Sơn Hà",
			"Sơn Hải",
			"Thái Niên",
			"Trì Quang",
			"Tằng Loỏng",
			"Xuân Giao",
			"Xuân Quang"
		],
		"district": "Bảo Thắng"
	},
	{
		"wards": [
			"Bảo Hà",
			"Cam Cọn",
			"Kim Sơn",
			"Lương Sơn",
			"Minh Tân",
			"Nghĩa Đô",
			"Phúc Khánh",
			"Phố Ràng",
			"Thượng Hà",
			"Tân Dương",
			"Tân Tiến",
			"Việt Tiến",
			"Vĩnh Yên",
			"Xuân Hoà",
			"Xuân Thượng",
			"Yên Sơn",
			"Điện Quan"
		],
		"district": "Bảo Yên"
	},
	{
		"wards": [
			"Bình An",
			"Bình Tân",
			"Chợ Lầu",
			"Hòa Thắng",
			"Hải Ninh",
			"Hồng Phong",
			"Hồng Thái",
			"Lương Sơn",
			"Phan Hiệp",
			"Phan Hòa",
			"Phan Lâm",
			"Phan Rí Thành",
			"Phan Sơn",
			"Phan Thanh",
			"Phan Tiến",
			"Phan Điền",
			"Sông Bình",
			"Sông Lũy"
		],
		"district": "Bắc Bình"
	},
	{
		"wards": [
			"Cảnh Thụy",
			"Dĩnh Kế",
			"Dĩnh Trì",
			"Hoàng Văn Thụ",
			"Hương Gián",
			"Lãng Sơn",
			"Mỹ Độ",
			"Ngô Quyền",
			"Nham Biền",
			"Nội Hoàng",
			"Quỳnh Sơn",
			"Song Khê",
			"Song Mai",
			"Thọ Xương",
			"Tiến Dũng",
			"Tiền Phong",
			"Trí Yên",
			"Trần Phú",
			"Tân An",
			"Tân Liễu",
			"Tân Mỹ",
			"Tân Tiến",
			"Tư Mại",
			"Xuân Phú",
			"Xương Giang",
			"Yên Lư",
			"Đa Mai",
			"Đồng Phúc",
			"Đồng Sơn",
			"Đồng Việt",
			"Đức Giang"
		],
		"district": "Bắc Giang"
	},
	{
		"wards": [
			"Bản Cái",
			"Bản Liền",
			"Bản Phố",
			"Bảo Nhai",
			"Bắc Hà",
			"Cốc Ly",
			"Cốc Lầu",
			"Hoàng Thu Phố",
			"Lùng Cải",
			"Lùng Phình",
			"Na Hối",
			"Nậm Khánh",
			"Nậm Lúc",
			"Nậm Mòn",
			"Nậm Đét",
			"Thải Giàng Phố",
			"Tả Củ Tỷ",
			"Tả Van Chư"
		],
		"district": "Bắc Hà"
	},
	{
		"wards": [
			"Dương Quang",
			"Huyền Tụng",
			"Nguyễn Thị Minh Khai",
			"Nông Thượng",
			"Phùng Chí Kiên",
			"Sông Cầu",
			"Xuất Hóa",
			"Đức Xuân"
		],
		"district": "Bắc Kạn"
	},
	{
		"wards": [
			"Giáp Trung",
			"Lạc Nông",
			"Minh Ngọc",
			"Minh Sơn",
			"Phiêng Luông",
			"Phú Nam",
			"Thượng Tân",
			"Yên Cường",
			"Yên Phong",
			"Yên Phú",
			"Yên Định",
			"Đường Hồng",
			"Đường Âm"
		],
		"district": "Bắc Mê"
	},
	{
		"wards": [
			"Hòa Long",
			"Hạp Lĩnh",
			"Khúc Xuyên",
			"Khắc Niệm",
			"Kim Chân",
			"Kinh Bắc",
			"Nam Sơn",
			"Phong Khê",
			"Suối Hoa",
			"Thị Cầu",
			"Tiền Ninh Vệ",
			"Vân Dương",
			"Võ Cường",
			"Vũ Ninh",
			"Vạn An",
			"Đáp Cầu",
			"Đại Phúc"
		],
		"district": "Bắc Ninh"
	},
	{
		"wards": [
			"Bằng Hành",
			"Hùng An",
			"Hữu Sản",
			"Kim Ngọc",
			"Liên Hiệp",
			"Quang Minh",
			"Thượng Bình",
			"Tiên Kiều",
			"Tân Lập",
			"Tân Quang",
			"Tân Thành",
			"Việt Hồng",
			"Việt Quang",
			"Việt Vinh",
			"Vô Điếm",
			"Vĩnh Hảo",
			"Vĩnh Phúc",
			"Vĩnh Tuy",
			"Đông Thành",
			"Đồng Tiến",
			"Đồng Tâm",
			"Đồng Yên",
			"Đức Xuân"
		],
		"district": "Bắc Quang"
	},
	{
		"wards": [
			"Bắc Quỳnh",
			"Bắc Sơn",
			"Chiêu Vũ",
			"Chiến Thắng",
			"Hưng Vũ",
			"Long Đống",
			"Nhất Hòa",
			"Nhất Tiến",
			"Trấn Yên",
			"Tân Hương",
			"Tân Lập",
			"Tân Thành",
			"Tân Tri",
			"Vũ Lăng",
			"Vũ Lễ",
			"Vũ Sơn",
			"Vạn Thủy",
			"Đồng ý"
		],
		"district": "Bắc Sơn"
	},
	{
		"wards": [
			"Trà Bui",
			"Trà Dương",
			"Trà Giang",
			"Trà Giác",
			"Trà Giáp",
			"Trà Ka",
			"Trà Kót",
			"Trà My",
			"Trà Nú",
			"Trà Sơn",
			"Trà Tân",
			"Trà Đông",
			"Trà Đốc"
		],
		"district": "Bắc Trà My"
	},
	{
		"wards": [
			"Bình Mỹ",
			"Hiếu Liêm",
			"Lạc An",
			"Thường Tân",
			"Tân Bình",
			"Tân Lập",
			"Tân Mỹ",
			"Tân Thành",
			"Tân Định",
			"Đất Cuốc"
		],
		"district": "Bắc Tân Uyên"
	},
	{
		"wards": [
			"Cổ Nhuế 1",
			"Cổ Nhuế 2",
			"Liên Mạc",
			"Minh Khai",
			"Phú Diễn",
			"Phúc Diễn",
			"Thượng Cát",
			"Thụy Phương",
			"Tây Tựu",
			"Xuân Tảo",
			"Xuân Đỉnh",
			"Đông Ngạc",
			"Đức Thắng"
		],
		"district": "Bắc Từ Liêm"
	},
	{
		"wards": [
			"Bắc Yên",
			"Chim Vàn",
			"Chiềng Sại",
			"Hang Chú",
			"Hua Nhàn",
			"Háng Đồng",
			"Hồng Ngài",
			"Làng Chếu",
			"Mường Khoa",
			"Phiêng Ban",
			"Phiêng Côn",
			"Pắc Ngà",
			"Song Pe",
			"Tà Xùa",
			"Tạ Khoa",
			"Xím Vàng"
		],
		"district": "Bắc Yên"
	},
	{
		"wards": [
			"An Tây",
			"An Điền",
			"Chánh Phú Hòa",
			"Hòa Lợi",
			"Mỹ Phước",
			"Phú An",
			"Thới Hòa",
			"Tân Định"
		],
		"district": "Bến Cát"
	},
	{
		"wards": [
			"An Thạnh",
			"Bến Cầu",
			"Long Chữ",
			"Long Giang",
			"Long Khánh",
			"Long Phước",
			"Long Thuận",
			"Lợi Thuận",
			"Tiên Thuận"
		],
		"district": "Bến Cầu"
	},
	{
		"wards": [
			"An Thạnh",
			"Bình Đức",
			"Bến Lức",
			"Long Hiệp",
			"Lương Bình",
			"Lương Hòa",
			"Mỹ Yên",
			"Nhựt Chánh",
			"Phước Lợi",
			"Thanh Phú",
			"Thạnh Hòa",
			"Thạnh Lợi",
			"Thạnh Đức",
			"Tân Bửu"
		],
		"district": "Bến Lức"
	},
	{
		"wards": [
			"6",
			"7",
			"8",
			"An Hội",
			"Bình Phú",
			"Mỹ Thạnh An",
			"Nhơn Thạnh",
			"Phú Hưng",
			"Phú Khương",
			"Phú Nhuận",
			"Phú Tân",
			"Sơn Đông"
		],
		"district": "Bến Tre"
	},
	{
		"wards": [
			"Ba Đình",
			"Bắc Sơn",
			"Lam Sơn",
			"Ngọc Trạo",
			"Phú Sơn",
			"Quang Trung",
			"Đông Sơn"
		],
		"district": "Bỉm Sơn"
	},
	{
		"wards": [
			"Bắc Trạch",
			"Cự Nẫm",
			"Hoàn Lão",
			"Hòa Trạch",
			"Hưng Trạch",
			"Hạ Mỹ",
			"Hải Phú",
			"Liên Trạch",
			"Lâm Trạch",
			"Lý Nam",
			"NT Việt Trung",
			"Nhân Trạch",
			"Phong Nha",
			"Phú Định",
			"Phúc Trạch",
			"Sơn Lộc",
			"Thanh Trạch",
			"Thượng Trạch",
			"Trung Trạch",
			"Tân Trạch",
			"Tây Trạch",
			"Vạn Trạch",
			"Xuân Trạch",
			"Đại Trạch",
			"Đồng Trạch",
			"Đức Trạch"
		],
		"district": "Bố Trạch"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"4",
			"5",
			"Bình Phú",
			"Cẩm Sơn",
			"Hiệp Đức",
			"Hội Xuân",
			"Long Khánh",
			"Long Tiên",
			"Long Trung",
			"Mỹ Hạnh Trung",
			"Mỹ Hạnh Đông",
			"Mỹ Long",
			"Mỹ Phước Tây",
			"Mỹ Thành Bắc",
			"Mỹ Thành Nam",
			"Ngũ Hiệp",
			"Nhị Mỹ",
			"Nhị Quý",
			"Phú An",
			"Phú Cường",
			"Phú Nhuận",
			"Phú Quý",
			"Tam Bình",
			"Thanh Hòa",
			"Thạnh Lộc",
			"Tân Bình",
			"Tân Hội",
			"Tân Phong",
			"Tân Phú"
		],
		"district": "Cai Lậy"
	},
	{
		"wards": [
			"Cam An Bắc",
			"Cam An Nam",
			"Cam Hiệp Bắc",
			"Cam Hiệp Nam",
			"Cam Hòa",
			"Cam Hải Tây",
			"Cam Hải Đông",
			"Cam Phước Tây",
			"Cam Thành Bắc",
			"Cam Tân",
			"Cam Đức",
			"Suối Cát",
			"Suối Tân",
			"Sơn Tân"
		],
		"district": "Cam Lâm"
	},
	{
		"wards": [
			"Cam Chính",
			"Cam Hiếu",
			"Cam Lộ",
			"Cam Nghĩa",
			"Cam Thành",
			"Cam Thủy",
			"Cam Tuyền",
			"Thanh An"
		],
		"district": "Cam Lộ"
	},
	{
		"wards": [
			"Ba Ngòi",
			"Cam Bình",
			"Cam Linh",
			"Cam Lập",
			"Cam Lộc",
			"Cam Lợi",
			"Cam Nghĩa",
			"Cam Phú",
			"Cam Phúc Bắc",
			"Cam Phúc Nam",
			"Cam Phước Đông",
			"Cam Thuận",
			"Cam Thành Nam",
			"Cam Thịnh Tây",
			"Cam Thịnh Đông"
		],
		"district": "Cam Ranh"
	},
	{
		"wards": [
			"Gia Hanh",
			"Khánh Vĩnh Yên",
			"Kim Song Trường",
			"Mỹ Lộc",
			"Nghèn",
			"Phú Lộc",
			"Quang Lộc",
			"Sơn Lộc",
			"Thanh Lộc",
			"Thiên Lộc",
			"Thuần Thiện",
			"Thường Nga",
			"Thượng Lộc",
			"Tùng Lộc",
			"Vượng Lộc",
			"Xuân Lộc",
			"Đồng Lộc"
		],
		"district": "Can Lộc"
	},
	{
		"wards": [
			"Chu Trinh",
			"Duyệt Trung",
			"Hoà Chung",
			"Hưng Đạo",
			"Hợp Giang",
			"Ngọc Xuân",
			"Sông Bằng",
			"Sông Hiến",
			"Tân Giang",
			"Vĩnh Quang",
			"Đề Thám"
		],
		"district": "Cao Bằng"
	},
	{
		"wards": [
			"1",
			"3",
			"4",
			"6",
			"An Bình",
			"Ba Sao",
			"Bình Hàng Trung",
			"Bình Hàng Tây",
			"Bình Thạnh",
			"Gáo Giồng",
			"Hoà Thuận",
			"Hòa An",
			"Mỹ Hiệp",
			"Mỹ Hội",
			"Mỹ Long",
			"Mỹ Ngãi",
			"Mỹ Phú",
			"Mỹ Thọ",
			"Mỹ Thọ",
			"Mỹ Trà",
			"Mỹ Tân",
			"Mỹ Xương",
			"Nhị Mỹ",
			"Phong Mỹ",
			"Phương Thịnh",
			"Phương Trà",
			"Tân Hội Trung",
			"Tân Nghĩa",
			"Tân Thuận Tây",
			"Tân Thuận Đông",
			"Tịnh Thới"
		],
		"district": "Cao Lãnh"
	},
	{
		"wards": [
			"Bình Trung",
			"Bảo Lâm",
			"Cao Lâu",
			"Cao Lộc",
			"Công Sơn",
			"Gia Cát",
			"Hòa Cư",
			"Hải Yến",
			"Hồng Phong",
			"Hợp Thành",
			"Lộc Yên",
			"Mẫu Sơn",
			"Phú Xá",
			"Thanh Lòa",
			"Thạch Đạn",
			"Thụy Hùng",
			"Tân Liên",
			"Tân Thành",
			"Xuân Long",
			"Xuất Lễ",
			"Yên Trạch",
			"Đồng Đăng"
		],
		"district": "Cao Lộc"
	},
	{
		"wards": [
			"Bình Thanh",
			"Bắc Phong",
			"Cao Phong",
			"Dũng Phong",
			"Hợp Phong",
			"Nam Phong",
			"Thu Phong",
			"Thung Nai",
			"Thạch Yên",
			"Tây Phong"
		],
		"district": "Cao Phong"
	},
	{
		"wards": [
			"Bắc Thủy",
			"Bằng Hữu",
			"Bằng Mạc",
			"Chi Lăng",
			"Chi Lăng",
			"Chiến Thắng",
			"Gia Lộc",
			"Hòa Bình",
			"Hữu Kiên",
			"Liên Sơn",
			"Lâm Sơn",
			"Mai Sao",
			"Nhân Lý",
			"Quan Sơn",
			"Thượng Cường",
			"Vân An",
			"Vân Thủy",
			"Vạn Linh",
			"Y Tịch",
			"Đồng Mỏ"
		],
		"district": "Chi Lăng"
	},
	{
		"wards": [
			"Bình Nhân",
			"Bình Phú",
			"Hà Lang",
			"Hòa An",
			"Hòa Phú",
			"Hùng Mỹ",
			"Kim Bình",
			"Kiên Đài",
			"Linh Phú",
			"Ngọc Hội",
			"Nhân Lý",
			"Phú Bình",
			"Phúc Thịnh",
			"Tri Phú",
			"Trung Hà",
			"Trung Hòa",
			"Tân An",
			"Tân Mỹ",
			"Tân Thịnh",
			"Vinh Quang",
			"Vĩnh Lộc",
			"Xuân Quang",
			"Yên Lập",
			"Yên Nguyên"
		],
		"district": "Chiêm Hóa"
	},
	{
		"wards": [
			"Bình Chánh",
			"Bình Long",
			"Bình Mỹ",
			"Bình Phú",
			"Bình Thủy",
			"Cái Dầu",
			"Khánh Hòa",
			"Mỹ Phú",
			"Mỹ Đức",
			"Thạnh Mỹ Tây",
			"Vĩnh Thạnh Trung",
			"Ô Long Vỹ",
			"Đào Hữu Cảnh"
		],
		"district": "Châu Phú"
	},
	{
		"wards": [
			"An Bình",
			"An Châu",
			"An Cơ",
			"An Hiệp",
			"An Hiệp",
			"An Hòa",
			"An Khánh",
			"An Lục Long",
			"An Nhơn",
			"An Ninh",
			"An Phú Thuận",
			"An Phước",
			"Biên Giới",
			"Bàn Long",
			"Bình An",
			"Bình Hòa",
			"Bình Quới",
			"Bình Thạnh",
			"Bình Trưng",
			"Bình Đức",
			"Châu Thành",
			"Châu Thành",
			"Châu Thành",
			"Châu Thành",
			"Cái Tàu Hạ",
			"Cần Đăng",
			"Dương Xuân Hội",
			"Giao Long",
			"Giục Tượng",
			"Hiệp Thạnh",
			"Hòa Bình Thạnh",
			"Hòa Hội",
			"Hòa Lợi",
			"Hòa Minh",
			"Hòa Phú",
			"Hòa Thuận",
			"Hòa Thạnh",
			"Hòa Tân",
			"Hưng Mỹ",
			"Hảo Đước",
			"Hồ Đắc Kiện",
			"Hữu Định",
			"Kim Sơn",
			"Long An",
			"Long Hòa",
			"Long Hưng",
			"Long Trì",
			"Long Vĩnh",
			"Long Định",
			"Lương Hoà A",
			"Lương Hòa",
			"Minh Hòa",
			"Minh Lương",
			"Mong Thọ",
			"Mong Thọ A",
			"Mong Thọ B",
			"Mái Dầm",
			"Mỹ Chánh",
			"Nguyệt Hóa",
			"Ngã Sáu",
			"Nhị Bình",
			"Ninh Điền",
			"Phú Hữu",
			"Phú Hựu",
			"Phú Long",
			"Phú Ngãi Trị",
			"Phú Phong",
			"Phú Tâm",
			"Phú Tân",
			"Phú Tân",
			"Phú Túc",
			"Phú Đức",
			"Phước Hảo",
			"Phước Thạnh",
			"Phước Tân Hưng",
			"Phước Vinh",
			"Quới Thành",
			"Qưới Sơn",
			"Song Lộc",
			"Song Thuận",
			"Tam Hiệp",
			"Tam Phước",
			"Thanh Mỹ",
			"Thanh Phú Long",
			"Thanh Vĩnh Đông",
			"Thanh Điền",
			"Thiện Mỹ",
			"Thuận Hòa",
			"Thuận Mỹ",
			"Thành Long",
			"Thành Triệu",
			"Thái Bình",
			"Thân Cửu Nghĩa",
			"Thạnh Lộc",
			"Thạnh Phú",
			"Tiên Long",
			"Tiên Thủy",
			"Trí Bình",
			"Tân Bình",
			"Tân Hiệp",
			"Tân Hương",
			"Tân Hội Đông",
			"Tân Lý Đông",
			"Tân Nhuận Đông",
			"Tân Phú",
			"Tân Phú",
			"Tân Phú",
			"Tân Phú Trung",
			"Tân Thạch",
			"Tường Đa",
			"Tầm Vu",
			"Vĩnh An",
			"Vĩnh Bình",
			"Vĩnh Công",
			"Vĩnh Hanh",
			"Vĩnh Hoà Phú",
			"Vĩnh Hòa Hiệp",
			"Vĩnh Kim",
			"Vĩnh Lợi",
			"Vĩnh Nhuận",
			"Vĩnh Thành",
			"Đa Lộc",
			"Điềm Hy",
			"Đông Hòa",
			"Đông Phú",
			"Đông Phước",
			"Đông Phước A",
			"Đông Thạnh",
			"Đồng Khởi"
		],
		"district": "Châu Thành"
	},
	{
		"wards": [
			"Bảy Ngàn",
			"Cái Tắc",
			"Một Ngàn",
			"Nhơn Nghĩa A",
			"Rạch Gòi",
			"Thạnh Xuân",
			"Trường Long A",
			"Trường Long Tây",
			"Tân Hoà",
			"Tân Phú Thạnh"
		],
		"district": "Châu Thành A"
	},
	{
		"wards": [
			"Châu Phú A",
			"Châu Phú B",
			"Núi Sam",
			"Vĩnh Châu",
			"Vĩnh Mỹ",
			"Vĩnh Ngươn",
			"Vĩnh Tế"
		],
		"district": "Châu Đốc"
	},
	{
		"wards": [
			"Bàu Chinh",
			"Bình Ba",
			"Bình Giã",
			"Bình Trung",
			"Cù Bị",
			"Kim Long",
			"Láng Lớn",
			"Nghĩa Thành",
			"Ngãi Giao",
			"Quảng Thành",
			"Suối Nghệ",
			"Suối Rao",
			"Sơn Bình",
			"Xuân Sơn",
			"Xà Bang",
			"Đá Bạc"
		],
		"district": "Châu Đức"
	},
	{
		"wards": [
			"An Lạc",
			"Bắc An",
			"Bến Tắm",
			"Chí Minh",
			"Cổ Thành",
			"Cộng Hoà",
			"Hoàng Hoa Thám",
			"Hoàng Tiến",
			"Hoàng Tân",
			"Hưng Đạo",
			"Lê Lợi",
			"Nhân Huệ",
			"Phả Lại",
			"Sao Đỏ",
			"Thái Học",
			"Tân Dân",
			"Văn An",
			"Văn Đức",
			"Đồng Lạc"
		],
		"district": "Chí Linh"
	},
	{
		"wards": [
			"Chũ",
			"Hồng Giang",
			"Kiên Lao",
			"Kiên Thành",
			"Mỹ An",
			"Nam Dương",
			"Phượng Sơn",
			"Quý Sơn",
			"Thanh Hải",
			"Trù Hựu"
		],
		"district": "Chũ"
	},
	{
		"wards": [
			"Hưng Long",
			"Minh Hưng",
			"Minh Long",
			"Minh Lập",
			"Minh Thành",
			"Minh Thắng",
			"Nha Bích",
			"Quang Minh",
			"Thành Tâm"
		],
		"district": "Chơn Thành"
	},
	{
		"wards": [
			"Bàu Cạn",
			"Bình Giáo",
			"Chư Prông",
			"Ia Bang",
			"Ia Boòng",
			"Ia Băng",
			"Ia Drăng",
			"Ia Ga",
			"Ia Kly",
			"Ia Lâu",
			"Ia Me",
			"Ia Mơ",
			"Ia O",
			"Ia Phìn",
			"Ia Pia",
			"Ia Piơr",
			"Ia Púch",
			"Ia Tôr",
			"Ia Vê",
			"Thăng Hưng"
		],
		"district": "Chư Prông"
	},
	{
		"wards": [
			"Chư Đăng Ya",
			"Hà Tây",
			"Hòa Phú",
			"Ia Ka",
			"Ia Khươl",
			"Ia Kreng",
			"Ia Ly",
			"Ia Mơ Nông",
			"Ia Nhin",
			"Ia Phí",
			"Nghĩa Hòa",
			"Nghĩa Hưng",
			"Phú Hòa",
			"Đăk Tơ Ver"
		],
		"district": "Chư Păh"
	},
	{
		"wards": [
			"Chư Don",
			"Ia BLứ",
			"Ia Dreng",
			"Ia Hla",
			"Ia Hrú",
			"Ia Le",
			"Ia Phang",
			"Ia Rong",
			"Nhơn Hoà"
		],
		"district": "Chư Pưh"
	},
	{
		"wards": [
			"AL Bá",
			"AYun",
			"Bar Măih",
			"Bờ Ngoong",
			"Chư Pơng",
			"Chư Sê",
			"Dun",
			"H Bông",
			"Ia Blang",
			"Ia Glai",
			"Ia HLốp",
			"Ia Ko",
			"Ia Pal",
			"Ia Tiêm",
			"Kông HTok"
		],
		"district": "Chư Sê"
	},
	{
		"wards": [
			"Chúc Sơn",
			"Hoàng Diệu",
			"Hoàng Văn Thụ",
			"Hòa Phú",
			"Hồng Phú",
			"Hợp Đồng",
			"Hữu Văn",
			"Lam Điền",
			"Mỹ Lương",
			"Nam Phương Tiến",
			"Ngọc Hòa",
			"Phú Nghĩa",
			"Phụng Châu",
			"Quảng Bị",
			"Thanh Bình",
			"Thượng Vực",
			"Thụy Hương",
			"Thủy Xuân Tiên",
			"Tiên Phương",
			"Trung Hòa",
			"Trường Yên",
			"Trần Phú",
			"Tân Tiến",
			"Tốt Động",
			"Văn Võ",
			"Xuân Mai",
			"Đông Phương Yên",
			"Đông Sơn",
			"Đại Yên",
			"Đồng Lạc"
		],
		"district": "Chương Mỹ"
	},
	{
		"wards": [
			"An Thạnh Thủy",
			"Bình Ninh",
			"Bình Phan",
			"Bình Phục Nhứt",
			"Chợ Gạo",
			"Hòa Tịnh",
			"Hòa Định",
			"Long Bình Điền",
			"Lương Hòa Lạc",
			"Mỹ Tịnh An",
			"Phú Kiết",
			"Quơn Long",
			"Song Bình",
			"Thanh Bình",
			"Trung Hòa",
			"Tân Bình Thạnh",
			"Tân Thuận Bình",
			"Xuân Đông",
			"Đăng Hưng Phước"
		],
		"district": "Chợ Gạo"
	},
	{
		"wards": [
			"Chợ Lách",
			"Hòa Nghĩa",
			"Hưng Khánh Trung B",
			"Long Thới",
			"Phú Phụng",
			"Phú Sơn",
			"Sơn Định",
			"Tân Thiềng",
			"Vĩnh Bình",
			"Vĩnh Hòa",
			"Vĩnh Thành"
		],
		"district": "Chợ Lách"
	},
	{
		"wards": [
			"An Thạnh Trung",
			"Bình Phước Xuân",
			"Bình Văn",
			"Cao Kỳ",
			"Chợ Mới",
			"Hoà Mục",
			"Hòa An",
			"Hòa Bình",
			"Hội An",
			"Kiến An",
			"Kiến Thành",
			"Long Giang",
			"Long Kiến",
			"Long Điền A",
			"Long Điền B",
			"Mai Lạp",
			"Mỹ An",
			"Mỹ Hiệp",
			"Mỹ Hội Đông",
			"Mỹ Luông",
			"Nhơn Mỹ",
			"Như Cố",
			"Nông Hạ",
			"Quảng Chu",
			"Thanh Mai",
			"Thanh Thịnh",
			"Thanh Vận",
			"Tân Sơn",
			"Tấn Mỹ",
			"Yên Cư",
			"Yên Hân",
			"Đồng Tâm"
		],
		"district": "Chợ Mới"
	},
	{
		"wards": [
			"Bình Trung",
			"Bản Thi",
			"Bằng Lãng",
			"Bằng Lũng",
			"Bằng Phúc",
			"Lương Bằng",
			"Nam Cường",
			"Nghĩa Tá",
			"Ngọc Phái",
			"Phương Viên",
			"Quảng Bạch",
			"Tân Lập",
			"Xuân Lạc",
			"Yên Mỹ",
			"Yên Phong",
			"Yên Thượng",
			"Yên Thịnh",
			"Đại Sảo",
			"Đồng Lạc",
			"Đồng Thắng"
		],
		"district": "Chợ Đồn"
	},
	{
		"wards": [
			"Bình Chuẩn",
			"Cam Lâm",
			"Chi Khê",
			"Châu Khê",
			"Lạng Khê",
			"Lục Dạ",
			"Môn Sơn",
			"Mậu Đức",
			"Thạch Ngàn",
			"Trà Lân",
			"Yên Khê",
			"Đôn Phục"
		],
		"district": "Con Cuông"
	},
	{
		"wards": [
			"1",
			"2",
			"5",
			"6",
			"7",
			"8",
			"9",
			"An Xuyên",
			"Hòa Thành",
			"Hòa Tân",
			"Lý Văn Lâm",
			"Tân Thành",
			"Tân Thành",
			"Tân Xuyên",
			"Tắc Vân",
			"Định Bình"
		],
		"district": "Cà Mau"
	},
	{
		"wards": [
			"An Trường",
			"An Trường A",
			"Bình Phú",
			"Càng Long",
			"Huyền Hội",
			"Mỹ Cẩm",
			"Nhị Long",
			"Nhị Long Phú",
			"Phương Thạnh",
			"Tân An",
			"Tân Bình",
			"Đại Phúc",
			"Đại Phước",
			"Đức Mỹ"
		],
		"district": "Càng Long"
	},
	{
		"wards": [
			"An Cư",
			"An Hữu",
			"An Thái Trung",
			"An Thái Đông",
			"Cái Bè",
			"Hòa Hưng",
			"Hòa Khánh",
			"Hậu Mỹ Bắc A",
			"Hậu Mỹ Bắc B",
			"Hậu Mỹ Phú",
			"Hậu Mỹ Trinh",
			"Hậu Thành",
			"Mỹ Hội",
			"Mỹ Lương",
			"Mỹ Lợi A",
			"Mỹ Lợi B",
			"Mỹ Trung",
			"Mỹ Tân",
			"Mỹ Đức Tây",
			"Mỹ Đức Đông",
			"Thiện Trung",
			"Thiện Trí",
			"Tân Hưng",
			"Tân Thanh",
			"Đông Hòa Hiệp"
		],
		"district": "Cái Bè"
	},
	{
		"wards": [
			"Cái Nước",
			"Hoà Mỹ",
			"Hưng Mỹ",
			"Lương Thế Trân",
			"Phú Hưng",
			"Thạnh Phú",
			"Trần Thới",
			"Tân Hưng",
			"Tân Hưng Đông",
			"Đông Hưng",
			"Đông Thới"
		],
		"district": "Cái Nước"
	},
	{
		"wards": [
			"Ba Láng",
			"Hưng Phú",
			"Hưng Thạnh",
			"Lê Bình",
			"Phú Thứ",
			"Thường Thạnh",
			"Tân Phú"
		],
		"district": "Cái Răng"
	},
	{
		"wards": [
			"Cát Bà",
			"Cát Hải",
			"Gia Luận",
			"Hiền Hào",
			"Hoàng Châu",
			"Nghĩa Lộ",
			"Phù Long",
			"Trân Châu",
			"Việt Hải",
			"Văn Phong",
			"Xuân Đám",
			"Đồng Bài"
		],
		"district": "Cát Hải"
	},
	{
		"wards": [
			"Cô Tô",
			"Thanh Lân",
			"Đồng Tiến"
		],
		"district": "Cô Tô"
	},
	{
		"wards": [
			"An Thạnh 1",
			"An Thạnh 2",
			"An Thạnh 3",
			"An Thạnh Nam",
			"An Thạnh Tây",
			"An Thạnh Đông",
			"Cù Lao Dung",
			"Đại Ân 1"
		],
		"district": "Cù Lao Dung"
	},
	{
		"wards": [
			"Cư Knia",
			"Ea Pô",
			"Ea T'Ling",
			"Nam Dong",
			"Trúc Sơn",
			"Tâm Thắng",
			"Đắk DRông",
			"Đắk Wil"
		],
		"district": "Cư Jút"
	},
	{
		"wards": [
			"Cư Ê Wi",
			"Dray Bhăng",
			"Ea BHốk",
			"Ea Hu",
			"Ea Ktur",
			"Ea Ning",
			"Ea Tiêu",
			"Hòa Hiệp"
		],
		"district": "Cư Kuin"
	},
	{
		"wards": [
			"Cuor Đăng",
			"Cư Dliê M'nông",
			"Cư M'gar",
			"Cư Suê",
			"Ea D'Rơng",
			"Ea H'đinh",
			"Ea KPam",
			"Ea Kiết",
			"Ea Kuêh",
			"Ea M'DRóh",
			"Ea M'nang",
			"Ea Pốk",
			"Ea Tar",
			"Ea Tul",
			"Quảng Hiệp",
			"Quảng Phú",
			"Quảng Tiến"
		],
		"district": "Cư M'gar"
	},
	{
		"wards": [
			"Cần Giuộc",
			"Long An",
			"Long Hậu",
			"Long Phụng",
			"Long Thượng",
			"Mỹ Lộc",
			"Phước Hậu",
			"Phước Lâm",
			"Phước Lý",
			"Phước Lại",
			"Phước Vĩnh Tây",
			"Phước Vĩnh Đông",
			"Thuận Thành",
			"Tân Tập",
			"Đông Thạnh"
		],
		"district": "Cần Giuộc"
	},
	{
		"wards": [
			"An Thới Đông",
			"Bình Khánh",
			"Cần Thạnh",
			"Long Hòa",
			"Lý Nhơn",
			"Tam Thôn Hiệp",
			"Thạnh An"
		],
		"district": "Cần Giờ"
	},
	{
		"wards": [
			"Cần Đước",
			"Long Cang",
			"Long Hòa",
			"Long Hựu Tây",
			"Long Hựu Đông",
			"Long Khê",
			"Long Sơn",
			"Long Trạch",
			"Long Định",
			"Mỹ Lệ",
			"Phước Tuy",
			"Phước Vân",
			"Phước Đông",
			"Tân Chánh",
			"Tân Lân",
			"Tân Trạch",
			"Tân Ân"
		],
		"district": "Cần Đước"
	},
	{
		"wards": [
			"Dịch Vọng",
			"Dịch Vọng Hậu",
			"Mai Dịch",
			"Nghĩa Tân",
			"Nghĩa Đô",
			"Quan Hoa",
			"Trung Hoà",
			"Yên Hoà"
		],
		"district": "Cầu Giấy"
	},
	{
		"wards": [
			"An Phú Tân",
			"Châu Điền",
			"Cầu Kè",
			"Hoà Tân",
			"Hòa Ân",
			"Ninh Thới",
			"Phong Phú",
			"Phong Thạnh",
			"Tam Ngãi",
			"Thông Hòa",
			"Thạnh Phú"
		],
		"district": "Cầu Kè"
	},
	{
		"wards": [
			"Cầu Ngang",
			"Hiệp Hòa",
			"Hiệp Mỹ Tây",
			"Hiệp Mỹ Đông",
			"Kim Hòa",
			"Long Sơn",
			"Mỹ Hòa",
			"Mỹ Long",
			"Mỹ Long Bắc",
			"Mỹ Long Nam",
			"Nhị Trường",
			"Thuận Hòa",
			"Thạnh Hòa Sơn",
			"Trường Thọ",
			"Vĩnh Kim"
		],
		"district": "Cầu Ngang"
	},
	{
		"wards": [
			"Cao An",
			"Cẩm Giang",
			"Cẩm Hoàng",
			"Cẩm Hưng",
			"Cẩm Văn",
			"Cẩm Vũ",
			"Cẩm Đoài",
			"Cẩm Đông",
			"Lai Cách",
			"Lương Điền",
			"Ngọc Liên",
			"Phúc Điền",
			"Tân Trường",
			"Định Sơn",
			"Đức Chính"
		],
		"district": "Cẩm Giàng"
	},
	{
		"wards": [
			"Cẩm Khê",
			"Hùng Việt",
			"Hương Lung",
			"Minh Thắng",
			"Minh Tân",
			"Nhật Tiến",
			"Phong Thịnh",
			"Phú Khê",
			"Phượng Vĩ",
			"Tam Sơn",
			"Tiên Lương",
			"Tùng Khê",
			"Văn Bán",
			"Yên Dưỡng",
			"Điêu Lương",
			"Đồng Lương"
		],
		"district": "Cẩm Khê"
	},
	{
		"wards": [
			"Hòa An",
			"Hòa Phát",
			"Hòa Thọ Tây",
			"Hòa Thọ Đông",
			"Hòa Xuân",
			"Khuê Trung"
		],
		"district": "Cẩm Lệ"
	},
	{
		"wards": [
			"Bảo Bình",
			"Long Giao",
			"Lâm San",
			"Nhân Nghĩa",
			"Sông Nhạn",
			"Sông Ray",
			"Thừa Đức",
			"Xuân Bảo",
			"Xuân Mỹ",
			"Xuân Quế",
			"Xuân Tây",
			"Xuân Đông",
			"Xuân Đường"
		],
		"district": "Cẩm Mỹ"
	},
	{
		"wards": [
			"Cẩm Bình",
			"Cẩm Phú",
			"Cẩm Sơn",
			"Cẩm Thành",
			"Cẩm Thạch",
			"Cẩm Thịnh",
			"Cẩm Thủy",
			"Cẩm Trung",
			"Cẩm Tây",
			"Cẩm Đông",
			"Cửa Ông",
			"Dương Huy",
			"Hải Hòa",
			"Mông Dương",
			"Quang Hanh"
		],
		"district": "Cẩm Phả"
	},
	{
		"wards": [
			"Cẩm Bình",
			"Cẩm Châu",
			"Cẩm Giang",
			"Cẩm Liên",
			"Cẩm Long",
			"Cẩm Lương",
			"Cẩm Ngọc",
			"Cẩm Phú",
			"Cẩm Quý",
			"Cẩm Thành",
			"Cẩm Thạch",
			"Cẩm Tâm",
			"Cẩm Tân",
			"Cẩm Tú",
			"Cẩm Vân",
			"Cẩm Yên",
			"Phong Sơn"
		],
		"district": "Cẩm Thủy"
	},
	{
		"wards": [
			"Cẩm Duệ",
			"Cẩm Dương",
			"Cẩm Hà",
			"Cẩm Hưng",
			"Cẩm Lĩnh",
			"Cẩm Lạc",
			"Cẩm Lộc",
			"Cẩm Minh",
			"Cẩm Mỹ",
			"Cẩm Nhượng",
			"Cẩm Quan",
			"Cẩm Quang",
			"Cẩm Sơn",
			"Cẩm Thành",
			"Cẩm Thạch",
			"Cẩm Thịnh",
			"Cẩm Trung",
			"Cẩm Xuyên",
			"Nam Phúc Thăng",
			"Thiên Cầm",
			"Yên Hòa"
		],
		"district": "Cẩm Xuyên"
	},
	{
		"wards": [
			"Cờ Đỏ",
			"Thạnh Phú",
			"Thới Hưng",
			"Thới Xuân",
			"Thới Đông",
			"Trung An",
			"Trung Hưng",
			"Trung Thạnh",
			"Đông Hiệp",
			"Đông Thắng"
		],
		"district": "Cờ Đỏ"
	},
	{
		"wards": [
			"An Nhơn Tây",
			"An Phú",
			"Bình Mỹ",
			"Củ Chi",
			"Hòa Phú",
			"Nhuận Đức",
			"Phú Hòa Đông",
			"Phú Mỹ Hưng",
			"Phước Hiệp",
			"Phước Thạnh",
			"Phước Vĩnh An",
			"Phạm Văn Cội",
			"Thái Mỹ",
			"Trung An",
			"Trung Lập Hạ",
			"Trung Lập Thượng",
			"Tân An Hội",
			"Tân Phú Trung",
			"Tân Thông Hội",
			"Tân Thạnh Tây",
			"Tân Thạnh Đông"
		],
		"district": "Củ Chi"
	},
	{
		"wards": [
			"Bảo Thuận",
			"Di Linh",
			"Gia Bắc",
			"Gia Hiệp",
			"Gung Ré",
			"Hòa Bắc",
			"Hòa Nam",
			"Hòa Ninh",
			"Hòa Trung",
			"Liên Đầm",
			"Sơn Điền",
			"Tam Bố",
			"Tân Châu",
			"Tân Lâm",
			"Tân Nghĩa",
			"Tân Thượng",
			"Đinh Lạc",
			"Đinh Trang Hòa",
			"Đinh Trang Thượng"
		],
		"district": "Di Linh"
	},
	{
		"wards": [
			"Bình Lộc",
			"Diên An",
			"Diên Hòa",
			"Diên Khánh",
			"Diên Lâm",
			"Diên Lạc",
			"Diên Phú",
			"Diên Phước",
			"Diên Sơn",
			"Diên Thạnh",
			"Diên Thọ",
			"Diên Toàn",
			"Diên Tân",
			"Diên Điền",
			"Suối Hiệp",
			"Suối Tiên",
			"Xuân Đồng"
		],
		"district": "Diên Khánh"
	},
	{
		"wards": [
			"Diễn An",
			"Diễn Cát",
			"Diễn Hoa",
			"Diễn Hoàng",
			"Diễn Hồng",
			"Diễn Kim",
			"Diễn Kỷ",
			"Diễn Liên",
			"Diễn Lâm",
			"Diễn Lộc",
			"Diễn Lợi",
			"Diễn Mỹ",
			"Diễn Nguyên",
			"Diễn Phong",
			"Diễn Phú",
			"Diễn Phúc",
			"Diễn Thành",
			"Diễn Thái",
			"Diễn Thịnh",
			"Diễn Thọ",
			"Diễn Trung",
			"Diễn Trường",
			"Diễn Tân",
			"Diễn Vạn",
			"Diễn Yên",
			"Diễn Đoài",
			"Diễn Đồng",
			"Hùng Hải",
			"Hạnh Quảng",
			"Minh Châu",
			"Ngọc Bích",
			"Xuân Tháp"
		],
		"district": "Diễn Châu"
	},
	{
		"wards": [
			"Bạch Thượng",
			"Chuyên Ngoại",
			"Châu Giang",
			"Duy Hải",
			"Duy Minh",
			"Hoàng Đông",
			"Hòa Mạc",
			"Mộc Hoàn",
			"Tiên Ngoại",
			"Tiên Nội",
			"Tiên Sơn",
			"Trác Văn",
			"Yên Bắc",
			"Yên Nam",
			"Đồng Văn"
		],
		"district": "Duy Tiên"
	},
	{
		"wards": [
			"Duy Châu",
			"Duy Hòa",
			"Duy Hải",
			"Duy Nghĩa",
			"Duy Phú",
			"Duy Phước",
			"Duy Sơn",
			"Duy Thành",
			"Duy Trinh",
			"Duy Trung",
			"Duy Tân",
			"Duy Vinh",
			"Nam Phước"
		],
		"district": "Duy Xuyên"
	},
	{
		"wards": [
			"1",
			"2",
			"Dân Thành",
			"Hiệp Thạnh",
			"Long Hữu",
			"Long Khánh",
			"Long Thành",
			"Long Toàn",
			"Long Vĩnh",
			"Ngũ Lạc",
			"Trường Long Hòa",
			"Đôn Châu",
			"Đôn Xuân",
			"Đông Hải"
		],
		"district": "Duyên Hải"
	},
	{
		"wards": [
			"An Bình",
			"Bình An",
			"Bình Thắng",
			"Dĩ An",
			"Tân Bình",
			"Tân Đông Hiệp",
			"Đông Hòa"
		],
		"district": "Dĩ An"
	},
	{
		"wards": [
			"Anh Dũng",
			"Hoà Nghĩa",
			"Hưng Đạo",
			"Hải Thành",
			"Tân Thành",
			"Đa Phúc"
		],
		"district": "Dương Kinh"
	},
	{
		"wards": [
			"Bàu Năng",
			"Bến Củi",
			"Chà Là",
			"Cầu Khởi",
			"Dương Minh Châu",
			"Lộc Ninh",
			"Phan",
			"Phước Minh",
			"Phước Ninh",
			"Suối Đá",
			"Truông Mít"
		],
		"district": "Dương Minh Châu"
	},
	{
		"wards": [
			"An Lập",
			"Dầu Tiếng",
			"Long Hoà",
			"Long Tân",
			"Minh Hoà",
			"Minh Thạnh",
			"Minh Tân",
			"Thanh An",
			"Thanh Tuyền",
			"Định An",
			"Định Hiệp",
			"Định Thành"
		],
		"district": "Dầu Tiếng"
	},
	{
		"wards": [
			"Cư A Mung",
			"Cư Mốt",
			"Dliê Yang",
			"Ea Drăng",
			"Ea H'leo",
			"Ea Hiao",
			"Ea Khal",
			"Ea Nam",
			"Ea Ral",
			"Ea Sol",
			"Ea Tir",
			"Ea Wy"
		],
		"district": "Ea H'leo"
	},
	{
		"wards": [
			"Cư Bông",
			"Cư ELang",
			"Cư Huê",
			"Cư Jang",
			"Cư Ni",
			"Cư Prông",
			"Ea Kar",
			"Ea Kmút",
			"Ea Knốp",
			"Ea Păl",
			"Ea Sar",
			"Ea Sô",
			"Ea Tih",
			"Ea Ô",
			"Ea Đar",
			"Xuân Phú"
		],
		"district": "Ea Kar"
	},
	{
		"wards": [
			"Cư KBang",
			"Cư M'Lan",
			"Ea Bung",
			"Ea Lê",
			"Ea Rốk",
			"Ea Súp",
			"Ia JLơi",
			"Ia Lốp",
			"Ia RVê",
			"Ya Tờ Mốt"
		],
		"district": "Ea Súp"
	},
	{
		"wards": [
			"Bình Dương",
			"Cao Đức",
			"Gia Bình",
			"Giang Sơn",
			"Lãng Ngâm",
			"Nhân Thắng",
			"Quỳnh Phú",
			"Song Giang",
			"Thái Bảo",
			"Vạn Ninh",
			"Xuân Lai",
			"Đông Cứu",
			"Đại Bái",
			"Đại Lai"
		],
		"district": "Gia Bình"
	},
	{
		"wards": [
			"Bát Tràng",
			"Cổ Bi",
			"Dương Quang",
			"Dương Xá",
			"Kim Đức",
			"Kiêu Kỵ",
			"Lệ Chi",
			"Ninh Hiệp",
			"Phù Đổng",
			"Phú Sơn",
			"Thiên Đức",
			"Trâu Quỳ",
			"Yên Thường",
			"Yên Viên",
			"Yên Viên",
			"Đa Tốn",
			"Đặng Xá"
		],
		"district": "Gia Lâm"
	},
	{
		"wards": [
			"Gia Lộc",
			"Gia Phúc",
			"Gia Tiến",
			"Hoàng Diệu",
			"Hồng Hưng",
			"Lê Lợi",
			"Nhật Quang",
			"Phạm Trấn",
			"Quang Đức",
			"Thống Kênh",
			"Thống Nhất",
			"Toàn Thắng",
			"Yết Kiêu",
			"Đoàn Thượng"
		],
		"district": "Gia Lộc"
	},
	{
		"wards": [
			"Nghĩa Phú",
			"Nghĩa Thành",
			"Nghĩa Trung",
			"Nghĩa Tân",
			"Nghĩa Đức",
			"Quảng Thành",
			"Đăk R'Moan",
			"Đắk Nia"
		],
		"district": "Gia Nghĩa"
	},
	{
		"wards": [
			"Gia Hòa",
			"Gia Hưng",
			"Gia Lạc",
			"Gia Lập",
			"Gia Minh",
			"Gia Phong",
			"Gia Phú",
			"Gia Phương",
			"Gia Sinh",
			"Gia Thanh",
			"Gia Trung",
			"Gia Trấn",
			"Gia Tân",
			"Gia Vân",
			"Gia Xuân",
			"Liên Sơn",
			"Thịnh Vượng",
			"Tiến Thắng"
		],
		"district": "Gia Viễn"
	},
	{
		"wards": [
			"Phú Lợi",
			"Phú Mỹ",
			"Tân Khánh Hòa",
			"Vĩnh Phú",
			"Vĩnh Điều"
		],
		"district": "Giang Thành"
	},
	{
		"wards": [
			"Bình Hòa",
			"Bạch Long",
			"Giao An",
			"Giao Châu",
			"Giao Hà",
			"Giao Hương",
			"Giao Hải",
			"Giao Long",
			"Giao Lạc",
			"Giao Nhân",
			"Giao Phong",
			"Giao Thanh",
			"Giao Thiện",
			"Giao Thịnh",
			"Giao Thủy",
			"Giao Tân",
			"Giao Xuân",
			"Giao Yến",
			"Hồng Thuận",
			"Quất Lâm"
		],
		"district": "Giao Thủy"
	},
	{
		"wards": [
			"Cửa Việt",
			"Gio An",
			"Gio Hải",
			"Gio Linh",
			"Gio Mai",
			"Gio Mỹ",
			"Gio Quang",
			"Gio Sơn",
			"Hải Thái",
			"Linh Trường",
			"Phong Bình",
			"Trung Giang",
			"Trung Hải",
			"Trung Sơn"
		],
		"district": "Gio Linh"
	},
	{
		"wards": [
			"1",
			"Hộ Phòng",
			"Láng Tròn",
			"Phong Thạnh",
			"Phong Thạnh A",
			"Phong Thạnh Tây",
			"Phong Thạnh Đông",
			"Phong Tân",
			"Tân Phong",
			"Tân Thạnh"
		],
		"district": "Giá Rai"
	},
	{
		"wards": [
			"Bàn Thạch",
			"Bàn Tân Định",
			"Giồng Riềng",
			"Hoà An",
			"Hoà Lợi",
			"Hòa Hưng",
			"Hòa Thuận",
			"Long Thạnh",
			"Ngọc Chúc",
			"Ngọc Hoà",
			"Ngọc Thuận",
			"Ngọc Thành",
			"Thạnh Bình",
			"Thạnh Hòa",
			"Thạnh Hưng",
			"Thạnh Lộc",
			"Thạnh Phước",
			"Vĩnh Phú",
			"Vĩnh Thạnh"
		],
		"district": "Giồng Riềng"
	},
	{
		"wards": [
			"Bình Hoà",
			"Bình Thành",
			"Châu Bình",
			"Châu Hòa",
			"Giồng Trôm",
			"Hưng Lễ",
			"Hưng Nhượng",
			"Hưng Phong",
			"Long Mỹ",
			"Lương Hòa",
			"Lương Phú",
			"Lương Quới",
			"Mỹ Thạnh",
			"Phong Nẫm",
			"Phước Long",
			"Sơn Phú",
			"Thuận Điền",
			"Thạnh Phú Đông",
			"Tân Hào",
			"Tân Lợi Thạnh",
			"Tân Thanh"
		],
		"district": "Giồng Trôm"
	},
	{
		"wards": [
			"1",
			"2",
			"5",
			"Bình Xuân",
			"Bình Đông",
			"Long Chánh",
			"Long Hòa",
			"Long Hưng",
			"Long Thuận",
			"Tân Trung"
		],
		"district": "Gò Công"
	},
	{
		"wards": [
			"Bình Nhì",
			"Bình Phú",
			"Bình Tân",
			"Long Bình",
			"Long Vĩnh",
			"Thành Công",
			"Thạnh Nhựt",
			"Thạnh Trị",
			"Vĩnh Bình",
			"Vĩnh Hựu",
			"Yên Luông",
			"Đồng Sơn",
			"Đồng Thạnh"
		],
		"district": "Gò Công Tây"
	},
	{
		"wards": [
			"Bình Nghị",
			"Bình Ân",
			"Gia Thuận",
			"Kiểng Phước",
			"Phước Trung",
			"Tân Hòa",
			"Tân Phước",
			"Tân Thành",
			"Tân Tây",
			"Tân Điền",
			"Tân Đông",
			"Tăng Hoà",
			"Vàm Láng"
		],
		"district": "Gò Công Đông"
	},
	{
		"wards": [
			"Bàu Đồn",
			"Cẩm Giang",
			"Gò Dầu",
			"Hiệp Thạnh",
			"Phước Thạnh",
			"Phước Trạch",
			"Phước Đông",
			"Thanh Phước",
			"Thạnh Đức"
		],
		"district": "Gò Dầu"
	},
	{
		"wards": [
			"Gò Quao",
			"Thới Quản",
			"Thủy Liễu",
			"Vĩnh Hòa Hưng Bắc",
			"Vĩnh Hòa Hưng Nam",
			"Vĩnh Phước A",
			"Vĩnh Phước B",
			"Vĩnh Thắng",
			"Vĩnh Tuy",
			"Định An",
			"Định Hòa"
		],
		"district": "Gò Quao"
	},
	{
		"wards": [
			"1",
			"10",
			"11",
			"12",
			"14",
			"15",
			"16",
			"17",
			"3",
			"5",
			"6",
			"8"
		],
		"district": "Gò Vấp"
	},
	{
		"wards": [
			"Bách Khoa",
			"Bạch Mai",
			"Bạch Đằng",
			"Lê Đại Hành",
			"Minh Khai",
			"Nguyễn Du",
			"Phạm Đình Hổ",
			"Phố Huế",
			"Quỳnh Mai",
			"Thanh Lương",
			"Thanh Nhàn",
			"Trương Định",
			"Vĩnh Tuy",
			"Đồng Nhân",
			"Đồng Tâm"
		],
		"district": "Hai Bà Trưng"
	},
	{
		"wards": [
			"Bắc Lý",
			"Châu Minh",
			"Danh Thắng",
			"Hoàng Vân",
			"Hùng Thái",
			"Hương Lâm",
			"Hợp Thịnh",
			"Lương Phong",
			"Mai Trung",
			"Mai Đình",
			"Ngọc Sơn",
			"Sơn Thịnh",
			"Thường Thắng",
			"Thắng",
			"Toàn Thắng",
			"Xuân Cẩm",
			"Đoan Bái",
			"Đông Lỗ",
			"Đồng Tiến"
		],
		"district": "Hiệp Hòa"
	},
	{
		"wards": [
			"Bình Lâm",
			"Bình Sơn",
			"Phước Gia",
			"Phước Trà",
			"Quế Lưu",
			"Quế Thọ",
			"Quế Tân",
			"Sông Trà",
			"Thăng Phước",
			"Tân Bình"
		],
		"district": "Hiệp Đức"
	},
	{
		"wards": [
			"Bích Đào",
			"Nam Bình",
			"Nam Thành",
			"Ninh An",
			"Ninh Giang",
			"Ninh Hòa",
			"Ninh Hải",
			"Ninh Khang",
			"Ninh Khánh",
			"Ninh Mỹ",
			"Ninh Nhất",
			"Ninh Phong",
			"Ninh Phúc",
			"Ninh Sơn",
			"Ninh Tiến",
			"Ninh Vân",
			"Trường Yên",
			"Tân Thành",
			"Vân Giang",
			"Đông Thành"
		],
		"district": "Hoa Lư"
	},
	{
		"wards": [
			"Bình Dương",
			"Bạch Đằng",
			"Dân Chủ",
			"Hoàng Tung",
			"Hồng Nam",
			"Hồng Việt",
			"Lê Chung",
			"Nam Tuấn",
			"Nguyễn Huệ",
			"Ngũ Lão",
			"Nước Hai",
			"Quang Trung",
			"Trương Lương",
			"Đại Tiến",
			"Đức Long"
		],
		"district": "Hoà An"
	},
	{
		"wards": [
			"Hòa Bình",
			"Minh Diệu",
			"Vĩnh Bình",
			"Vĩnh Hậu",
			"Vĩnh Hậu A",
			"Vĩnh Mỹ A",
			"Vĩnh Mỹ B",
			"Vĩnh Thịnh"
		],
		"district": "Hoà Bình"
	},
	{
		"wards": [
			"Bồng Sơn",
			"Hoài Châu",
			"Hoài Châu Bắc",
			"Hoài Hương",
			"Hoài Hải",
			"Hoài Hảo",
			"Hoài Mỹ",
			"Hoài Phú",
			"Hoài Sơn",
			"Hoài Thanh",
			"Hoài Thanh Tây",
			"Hoài Tân",
			"Hoài Xuân",
			"Hoài Đức",
			"Tam Quan",
			"Tam Quan Bắc",
			"Tam Quan Nam"
		],
		"district": "Hoài Nhơn"
	},
	{
		"wards": [
			"Bok Tới",
			"Tăng Bạt Hổ",
			"Ân Hảo Tây",
			"Ân Hảo Đông",
			"Ân Hữu",
			"Ân Mỹ",
			"Ân Nghĩa",
			"Ân Phong",
			"Ân Sơn",
			"Ân Thạnh",
			"Ân Tín",
			"Ân Tường Tây",
			"Ân Tường Đông",
			"Ân Đức",
			"Đak Mang"
		],
		"district": "Hoài Ân"
	},
	{
		"wards": [
			"An Khánh",
			"An Thượng",
			"Cát Quế",
			"Di Trạch",
			"Dương Liễu",
			"Kim Chung",
			"La Phù",
			"Lại Yên",
			"Minh Khai",
			"Song Phương",
			"Sơn Đồng",
			"Tiền Yên",
			"Trạm Trôi",
			"Vân Canh",
			"Vân Côn",
			"Yên Sở",
			"Đông La",
			"Đắc Sở",
			"Đức Giang",
			"Đức Thượng"
		],
		"district": "Hoài Đức"
	},
	{
		"wards": [
			"Chương Dương",
			"Cửa Nam",
			"Cửa Đông",
			"Hàng Buồm",
			"Hàng Bài",
			"Hàng Bông",
			"Hàng Bạc",
			"Hàng Bồ",
			"Hàng Gai",
			"Hàng Mã",
			"Hàng Trống",
			"Hàng Đào",
			"Lý Thái Tổ",
			"Phan Chu Trinh",
			"Phúc Tân",
			"Tràng Tiền",
			"Trần Hưng Đạo",
			"Đồng Xuân"
		],
		"district": "Hoàn Kiếm"
	},
	{
		"wards": [
			"Giáp Bát",
			"Hoàng Liệt",
			"Hoàng Văn Thụ",
			"Lĩnh Nam",
			"Mai Hùng",
			"Mai Động",
			"Quỳnh Dị",
			"Quỳnh Liên",
			"Quỳnh Lập",
			"Quỳnh Lộc",
			"Quỳnh Phương",
			"Quỳnh Thiện",
			"Quỳnh Trang",
			"Quỳnh Vinh",
			"Quỳnh Xuân",
			"Thanh Trì",
			"Thịnh Liệt",
			"Trần Phú",
			"Tân Mai",
			"Tương Mai",
			"Vĩnh Hưng",
			"Yên Sở",
			"Đại Kim",
			"Định Công"
		],
		"district": "Hoàng Mai"
	},
	{
		"wards": [
			"Bản Luốc",
			"Bản Máy",
			"Bản Nhùng",
			"Bản Phùng",
			"Chiến Phố",
			"Hồ Thầu",
			"Nam Sơn",
			"Ngàm Đăng Vài",
			"Nàng Đôn",
			"Nậm Dịch",
			"Nậm Khòa",
			"Nậm Tỵ",
			"Pố Lồ",
			"Pờ Ly Ngài",
			"Sán Xả Hồ",
			"Thàng Tín",
			"Thèn Chu Phìn",
			"Thông Nguyên",
			"Tân Tiến",
			"Túng Sán",
			"Tả Sử Choóng",
			"Tụ Nhân",
			"Vinh Quang",
			"Đản Ván"
		],
		"district": "Hoàng Su Phì"
	},
	{
		"wards": [
			"Bút Sơn",
			"Hoằng Châu",
			"Hoằng Cát",
			"Hoằng Giang",
			"Hoằng Hà",
			"Hoằng Hải",
			"Hoằng Hợp",
			"Hoằng Kim",
			"Hoằng Lưu",
			"Hoằng Lộc",
			"Hoằng Ngọc",
			"Hoằng Phong",
			"Hoằng Phú",
			"Hoằng Phụ",
			"Hoằng Quý",
			"Hoằng Quỳ",
			"Hoằng Sơn",
			"Hoằng Thanh",
			"Hoằng Thành",
			"Hoằng Thái",
			"Hoằng Thắng",
			"Hoằng Thịnh",
			"Hoằng Tiến",
			"Hoằng Trinh",
			"Hoằng Trung",
			"Hoằng Trường",
			"Hoằng Trạch",
			"Hoằng Tân",
			"Hoằng Xuyên",
			"Hoằng Xuân",
			"Hoằng Yến",
			"Hoằng Đông",
			"Hoằng Đạo",
			"Hoằng Đạt",
			"Hoằng Đồng",
			"Hoằng Đức"
		],
		"district": "Hoằng Hóa"
	},
	{
		"wards": [
			"Minh Khai",
			"Nguyễn Trãi",
			"Ngọc Hà",
			"Ngọc Đường",
			"Phương Thiện",
			"Phương Độ",
			"Quang Trung",
			"Trần Phú"
		],
		"district": "Hà Giang"
	},
	{
		"wards": [
			"Cải Viên",
			"Cần Nông",
			"Cần Yên",
			"Hồng Sỹ",
			"Lũng Nặm",
			"Lương Can",
			"Lương Thông",
			"Mã Ba",
			"Ngọc Đào",
			"Ngọc Động",
			"Nội Thôn",
			"Quý Quân",
			"Sóc Hà",
			"Thanh Long",
			"Thông Nông",
			"Thượng Thôn",
			"Trường Hà",
			"Tổng Cọt",
			"Xuân Hòa",
			"Yên Sơn",
			"Đa Thông"
		],
		"district": "Hà Quảng"
	},
	{
		"wards": [
			"Bình San",
			"Mỹ Đức",
			"Pháo Đài",
			"Thuận Yên",
			"Tiên Hải",
			"Tô Châu",
			"Đông Hồ"
		],
		"district": "Hà Tiên"
	},
	{
		"wards": [
			"Hoạt Giang",
			"Hà Bình",
			"Hà Bắc",
			"Hà Châu",
			"Hà Giang",
			"Hà Hải",
			"Hà Long",
			"Hà Lĩnh",
			"Hà Ngọc",
			"Hà Sơn",
			"Hà Tiến",
			"Hà Trung",
			"Hà Tân",
			"Hà Vinh",
			"Hà Đông",
			"Lĩnh Toại",
			"Thái Lai",
			"Yên Dương",
			"Yến Sơn"
		],
		"district": "Hà Trung"
	},
	{
		"wards": [
			"Bắc Hà",
			"Cẩm Bình",
			"Cẩm Vịnh",
			"Hà Huy Tập",
			"Hộ Độ",
			"Nam Hà",
			"Thạch Bình",
			"Thạch Hưng",
			"Thạch Hạ",
			"Thạch Hải",
			"Thạch Hội",
			"Thạch Khê",
			"Thạch Lạc",
			"Thạch Quý",
			"Thạch Thắng",
			"Thạch Trung",
			"Thạch Trị",
			"Thạch Văn",
			"Thạch Đài",
			"Trần Phú",
			"Tân Giang",
			"Tân Lâm Hương",
			"Tượng Sơn",
			"Văn Yên",
			"Đại Nài",
			"Đỉnh Bàn",
			"Đồng Môn"
		],
		"district": "Hà Tĩnh"
	},
	{
		"wards": [
			"Biên Giang",
			"Dương Nội",
			"Hà Cầu",
			"Kiến Hưng",
			"La Khê",
			"Mộ Lao",
			"Phú La",
			"Phú Lãm",
			"Phú Lương",
			"Phúc La",
			"Quang Trung",
			"Văn Quán",
			"Vạn Phúc",
			"Yên Nghĩa",
			"Đồng Mai"
		],
		"district": "Hà Đông"
	},
	{
		"wards": [
			"Hàm Chính",
			"Hàm Hiệp",
			"Hàm Liêm",
			"Hàm Phú",
			"Hàm Thắng",
			"Hàm Trí",
			"Hàm Đức",
			"Hồng Liêm",
			"Hồng Sơn",
			"La Dạ",
			"Ma Lâm",
			"Phú Long",
			"Thuận Hòa",
			"Thuận Minh",
			"Đa Mi",
			"Đông Giang",
			"Đông Tiến"
		],
		"district": "Hàm Thuận Bắc"
	},
	{
		"wards": [
			"Hàm Cường",
			"Hàm Cần",
			"Hàm Kiệm",
			"Hàm Minh",
			"Hàm Mỹ",
			"Hàm Thạnh",
			"Mương Mán",
			"Mỹ Thạnh",
			"Thuận Nam",
			"Thuận Quí",
			"Tân Lập",
			"Tân Thuận",
			"Tân Thành"
		],
		"district": "Hàm Thuận Nam"
	},
	{
		"wards": [
			"Sông Phan",
			"Sơn Mỹ",
			"Thắng Hải",
			"Tân Hà",
			"Tân Minh",
			"Tân Nghĩa",
			"Tân Phúc",
			"Tân Thắng",
			"Tân Xuân",
			"Tân Đức"
		],
		"district": "Hàm Tân"
	},
	{
		"wards": [
			"Bình Xa",
			"Bạch Xa",
			"Bằng Cốc",
			"Hùng Đức",
			"Minh Dân",
			"Minh Hương",
			"Minh Khương",
			"Nhân Mục",
			"Phù Lưu",
			"Thành Long",
			"Thái Hòa",
			"Thái Sơn",
			"Tân Thành",
			"Tân Yên",
			"Yên Lâm",
			"Yên Phú",
			"Yên Thuận",
			"Đức Ninh"
		],
		"district": "Hàm Yên"
	},
	{
		"wards": [
			"Dân Chủ",
			"Hòa Bình",
			"Hợp Thành",
			"Hữu Nghị",
			"Kỳ Sơn",
			"Mông Hóa",
			"Phương Lâm",
			"Quang Tiến",
			"Quỳnh Lâm",
			"Thái Bình",
			"Thịnh Lang",
			"Thịnh Minh",
			"Thống Nhất",
			"Trung Minh",
			"Tân Hòa",
			"Tân Thịnh",
			"Yên Mông",
			"Đồng Tiến",
			"Độc Lập"
		],
		"district": "Hòa Bình"
	},
	{
		"wards": [
			"Hiệp Tân",
			"Long Hoa",
			"Long Thành Bắc",
			"Long Thành Nam",
			"Long Thành Trung",
			"Trường Hòa",
			"Trường Tây",
			"Trường Đông"
		],
		"district": "Hòa Thành"
	},
	{
		"wards": [
			"Hòa Bắc",
			"Hòa Châu",
			"Hòa Khương",
			"Hòa Liên",
			"Hòa Nhơn",
			"Hòa Ninh",
			"Hòa Phong",
			"Hòa Phú",
			"Hòa Phước",
			"Hòa Sơn",
			"Hòa Tiến"
		],
		"district": "Hòa Vang"
	},
	{
		"wards": [
			"Bình Giang",
			"Bình Sơn",
			"Hòn Đất",
			"Lình Huỳnh",
			"Mỹ Hiệp Sơn",
			"Mỹ Lâm",
			"Mỹ Phước",
			"Mỹ Thuận",
			"Mỹ Thái",
			"Nam Thái Sơn",
			"Sóc Sơn",
			"Sơn Bình",
			"Sơn Kiên",
			"Thổ Sơn"
		],
		"district": "Hòn Đất"
	},
	{
		"wards": [
			"Bà Điểm",
			"Hóc Môn",
			"Nhị Bình",
			"Thới Tam Thôn",
			"Trung Chánh",
			"Tân Hiệp",
			"Tân Thới Nhì",
			"Tân Xuân",
			"Xuân Thới Sơn",
			"Xuân Thới Thượng",
			"Xuân Thới Đông",
			"Đông Thạnh"
		],
		"district": "Hóc Môn"
	},
	{
		"wards": [
			"Bắc Sơn",
			"Canh Tân",
			"Chi Lăng",
			"Chí Hòa",
			"Cộng Hòa",
			"Duyên Hải",
			"Hòa Bình",
			"Hòa Tiến",
			"Hưng Hà",
			"Hưng Nhân",
			"Hồng An",
			"Hồng Lĩnh",
			"Hồng Minh",
			"Kim Chung",
			"Liên Hiệp",
			"Minh Hòa",
			"Minh Khai",
			"Minh Tân",
			"Phúc Khánh",
			"Quang Trung",
			"Thái Hưng",
			"Thái Phương",
			"Thống Nhất",
			"Tiến Đức",
			"Tân Hòa",
			"Tân Lễ",
			"Tân Tiến",
			"Tây Đô",
			"Văn Cẩm",
			"Văn Lang",
			"Đoan Hùng",
			"Đông Đô",
			"Độc Lập"
		],
		"district": "Hưng Hà"
	},
	{
		"wards": [
			"Châu Nhân",
			"Hưng Lĩnh",
			"Hưng Nghĩa",
			"Hưng Nguyên",
			"Hưng Thành",
			"Hưng Trung",
			"Hưng Tây",
			"Hưng Yên",
			"Hưng Yên Bắc",
			"Hưng Đạo",
			"Long Xá",
			"Phúc Lợi",
			"Thông Tân",
			"Thịnh Mỹ",
			"Xuân Lam"
		],
		"district": "Hưng Nguyên"
	},
	{
		"wards": [
			"An Tảo",
			"Bảo Khê",
			"Hiến Nam",
			"Hoàng Hanh",
			"Hùng Cường",
			"Hồng Châu",
			"Lam Sơn",
			"Liên Phương",
			"Lê Lợi",
			"Minh Khai",
			"Phú Cường",
			"Phương Nam",
			"Quảng Châu",
			"Trung Nghĩa",
			"Tân Hưng"
		],
		"district": "Hưng Yên"
	},
	{
		"wards": [
			"Gia Phố",
			"Hà Linh",
			"Hòa Hải",
			"Hương Bình",
			"Hương Giang",
			"Hương Khê",
			"Hương Liên",
			"Hương Long",
			"Hương Lâm",
			"Hương Thủy",
			"Hương Trà",
			"Hương Trạch",
			"Hương Vĩnh",
			"Hương Xuân",
			"Hương Đô",
			"Lộc Yên",
			"Phú Gia",
			"Phúc Trạch",
			"Phúc Đồng",
			"Điền Mỹ"
		],
		"district": "Hương Khê"
	},
	{
		"wards": [
			"An Hòa Thịnh",
			"Châu Bình",
			"Hàm Trường",
			"Kim Hoa",
			"Mỹ Long",
			"Phố Châu",
			"Quang Diệm",
			"Sơn Bằng",
			"Sơn Giang",
			"Sơn Hồng",
			"Sơn Kim 1",
			"Sơn Kim 2",
			"Sơn Lâm",
			"Sơn Lĩnh",
			"Sơn Lễ",
			"Sơn Ninh",
			"Sơn Phú",
			"Sơn Tiến",
			"Sơn Trung",
			"Sơn Tây",
			"Tân Mỹ Hà",
			"Tây Sơn"
		],
		"district": "Hương Sơn"
	},
	{
		"wards": [
			"Dương Hòa",
			"Phú Bài",
			"Phú Sơn",
			"Thủy Châu",
			"Thủy Dương",
			"Thủy Lương",
			"Thủy Phù",
			"Thủy Phương",
			"Thủy Thanh",
			"Thủy Tân"
		],
		"district": "Hương Thủy"
	},
	{
		"wards": [
			"Bình Thành",
			"Bình Tiến",
			"Hương Bình",
			"Hương Chữ",
			"Hương Toàn",
			"Hương Vân",
			"Hương Văn",
			"Hương Xuân",
			"Tứ Hạ"
		],
		"district": "Hương Trà"
	},
	{
		"wards": [
			"A Dơi",
			"Ba Tầng",
			"Húc",
			"Hướng Linh",
			"Hướng Lập",
			"Hướng Lộc",
			"Hướng Phùng",
			"Hướng Sơn",
			"Hướng Tân",
			"Hướng Việt",
			"Khe Sanh",
			"Lao Bảo",
			"Lìa",
			"Thanh",
			"Thuận",
			"Tân Hợp",
			"Tân Liên",
			"Tân Long",
			"Tân Lập",
			"Tân Thành",
			"Xy"
		],
		"district": "Hướng Hóa"
	},
	{
		"wards": [
			"Bằng Giã",
			"Gia Điền",
			"Hiền Lương",
			"Hà Lương",
			"Hương Xạ",
			"Hạ Hoà",
			"Lang Sơn",
			"Minh Côi",
			"Minh Hạc",
			"Phương Viên",
			"Tứ Hiệp",
			"Vô Tranh",
			"Văn Lang",
			"Vĩnh Chân",
			"Xuân Áng",
			"Yên Kỳ",
			"Yên Luật",
			"Đan Thượng",
			"Đại Phạm",
			"Ấm Hạ"
		],
		"district": "Hạ Hoà"
	},
	{
		"wards": [
			"An Lạc",
			"Cô Ngân",
			"Kim Loan",
			"Lý Quốc",
			"Minh Long",
			"Quang Long",
			"Thanh Nhật",
			"Thắng Lợi",
			"Thị Hoa",
			"Thống Nhất",
			"Vinh Quý",
			"Đồng Loan",
			"Đức Quang"
		],
		"district": "Hạ Lang"
	},
	{
		"wards": [
			"Bãi Cháy",
			"Bạch Đằng",
			"Bằng Cả",
			"Cao Thắng",
			"Cao Xanh",
			"Dân Chủ",
			"Giếng Đáy",
			"Hoành Bồ",
			"Hà Khánh",
			"Hà Khẩu",
			"Hà Lầm",
			"Hà Phong",
			"Hà Trung",
			"Hà Tu",
			"Hòa Bình",
			"Hùng Thắng",
			"Hồng Gai",
			"Hồng Hà",
			"Hồng Hải",
			"Kỳ Thượng",
			"Lê Lợi",
			"Quảng La",
			"Sơn Dương",
			"Thống Nhất",
			"Trần Hưng Đạo",
			"Tuần Châu",
			"Tân Dân",
			"Việt Hưng",
			"Vũ Oai",
			"Đại Yên",
			"Đồng Lâm",
			"Đồng Sơn"
		],
		"district": "Hạ Long"
	},
	{
		"wards": [
			"Cát Bi",
			"Nam Hải",
			"Thành Tô",
			"Tràng Cát",
			"Đông Hải 1",
			"Đông Hải 2",
			"Đằng Hải",
			"Đằng Lâm"
		],
		"district": "Hải An"
	},
	{
		"wards": [
			"Bình Thuận",
			"Hòa Cường Bắc",
			"Hòa Cường Nam",
			"Hòa Thuận Tây",
			"Hải Châu",
			"Phước Ninh",
			"Thanh Bình",
			"Thuận Phước",
			"Thạch Thang"
		],
		"district": "Hải Châu"
	},
	{
		"wards": [
			"An Thượng",
			"Bình Hàn",
			"Cẩm Thượng",
			"Gia Xuyên",
			"Hải Tân",
			"Liên Hồng",
			"Lê Thanh Nghị",
			"Nam Đồng",
			"Nguyễn Trãi",
			"Ngọc Châu",
			"Ngọc Sơn",
			"Nhị Châu",
			"Quang Trung",
			"Quyết Thắng",
			"Thanh Bình",
			"Thạch Khôi",
			"Tiền Tiến",
			"Trần Hưng Đạo",
			"Trần Phú",
			"Tân Bình",
			"Tân Hưng",
			"Tứ Minh",
			"Việt Hoà",
			"Ái Quốc"
		],
		"district": "Hải Dương"
	},
	{
		"wards": [
			"Cái Chiên",
			"Quảng Chính",
			"Quảng Hà",
			"Quảng Long",
			"Quảng Minh",
			"Quảng Phong",
			"Quảng Sơn",
			"Quảng Thành",
			"Quảng Thịnh",
			"Quảng Đức",
			"Đường Hoa"
		],
		"district": "Hải Hà"
	},
	{
		"wards": [
			"Cồn",
			"Hải An",
			"Hải Anh",
			"Hải Châu",
			"Hải Giang",
			"Hải Hòa",
			"Hải Hưng",
			"Hải Long",
			"Hải Lộc",
			"Hải Minh",
			"Hải Nam",
			"Hải Ninh",
			"Hải Phong",
			"Hải Phú",
			"Hải Quang",
			"Hải Sơn",
			"Hải Trung",
			"Hải Tân",
			"Hải Tây",
			"Hải Xuân",
			"Hải Đông",
			"Hải Đường",
			"Thịnh Long",
			"Yên Định"
		],
		"district": "Hải Hậu"
	},
	{
		"wards": [
			"Diên Sanh",
			"Hải An",
			"Hải Bình",
			"Hải Chánh",
			"Hải Dương",
			"Hải Hưng",
			"Hải Khê",
			"Hải Lâm",
			"Hải Phong",
			"Hải Phú",
			"Hải Quy",
			"Hải Sơn",
			"Hải Thượng",
			"Hải Trường",
			"Hải Định"
		],
		"district": "Hải Lăng"
	},
	{
		"wards": [
			"Cầu Lộc",
			"Hoa Lộc",
			"Hòa Lộc",
			"Hưng Lộc",
			"Hải Lộc",
			"Hậu Lộc",
			"Liên Lộc",
			"Lộc Sơn",
			"Minh Lộc",
			"Mỹ Lộc",
			"Ngư Lộc",
			"Phú Lộc",
			"Quang Lộc",
			"Thuần Lộc",
			"Thành Lộc",
			"Tiến Lộc",
			"Triệu Lộc",
			"Tuy Lộc",
			"Xuân Lộc",
			"Đa Lộc",
			"Đại Lộc",
			"Đồng Lộc"
		],
		"district": "Hậu Lộc"
	},
	{
		"wards": [
			"An Hưng",
			"An Hồng",
			"Hoàng Văn Thụ",
			"Hùng Vương",
			"Minh Khai",
			"Phan Bội Châu",
			"Quán Toan",
			"Sở Dầu",
			"Thượng Lý",
			"Đại Bản"
		],
		"district": "Hồng Bàng"
	},
	{
		"wards": [
			"Lộc Ninh",
			"Ngan Dừa",
			"Ninh Hòa",
			"Ninh Quới",
			"Ninh Quới A",
			"Ninh Thạnh Lợi",
			"Ninh Thạnh Lợi A",
			"Vĩnh Lộc",
			"Vĩnh Lộc A"
		],
		"district": "Hồng Dân"
	},
	{
		"wards": [
			"Bắc Hồng",
			"Nam Hồng",
			"Thuận Lộc",
			"Trung Lương",
			"Đậu Liêu",
			"Đức Thuận"
		],
		"district": "Hồng Lĩnh"
	},
	{
		"wards": [
			"An Bình A",
			"An Bình B",
			"An Lạc",
			"An Lộc",
			"An Thạnh",
			"Bình Thạnh",
			"Long Khánh A",
			"Long Khánh B",
			"Long Thuận",
			"Phú Thuận A",
			"Phú Thuận B",
			"Thường Lạc",
			"Thường Phước 1",
			"Thường Phước 2",
			"Thường Thới Hậu A",
			"Thường Thới Tiền",
			"Tân Hội"
		],
		"district": "Hồng Ngự"
	},
	{
		"wards": [
			"Cẩm An",
			"Cẩm Châu",
			"Cẩm Hà",
			"Cẩm Kim",
			"Cẩm Nam",
			"Cẩm Phô",
			"Cẩm Thanh",
			"Cửa Đại",
			"Minh An",
			"Sơn Phong",
			"Thanh Hà",
			"Tân An",
			"Tân Hiệp"
		],
		"district": "Hội An"
	},
	{
		"wards": [
			"An Khương",
			"An Phú",
			"Minh Tâm",
			"Minh Đức",
			"Phước An",
			"Thanh An",
			"Thanh Bình",
			"Tân Hiệp",
			"Tân Hưng",
			"Tân Khai",
			"Tân Lợi",
			"Tân Quan",
			"Đồng Nơ"
		],
		"district": "Hớn Quản"
	},
	{
		"wards": [
			"Cai Kinh",
			"Hòa Bình",
			"Hòa Lạc",
			"Hòa Sơn",
			"Hòa Thắng",
			"Hồ Sơn",
			"Hữu Liên",
			"Hữu Lũng",
			"Minh Hòa",
			"Minh Sơn",
			"Minh Tiến",
			"Nhật Tiến",
			"Quyết Thắng",
			"Thanh Sơn",
			"Thiện Tân",
			"Tân Thành",
			"Vân Nham",
			"Yên Bình",
			"Yên Sơn",
			"Yên Thịnh",
			"Yên Vượng",
			"Đồng Tiến",
			"Đồng Tân"
		],
		"district": "Hữu Lũng"
	},
	{
		"wards": [
			"Ia Bă",
			"Ia Chia",
			"Ia Dêr",
			"Ia Grăng",
			"Ia Hrung",
			"Ia KRai",
			"Ia Kha",
			"Ia Khai",
			"Ia O",
			"Ia Pếch",
			"Ia Sao",
			"Ia Tô",
			"Ia Yok"
		],
		"district": "Ia Grai"
	},
	{
		"wards": [
			"Ia Dom",
			"Ia Tơi",
			"Ia Đal"
		],
		"district": "Ia H' Drai"
	},
	{
		"wards": [
			"Chư Mố",
			"Chư Răng",
			"Ia Broăi",
			"Ia KDăm",
			"Ia Ma Rơn",
			"Ia Trok",
			"Ia Tul",
			"Kim Tân",
			"Pờ Tó"
		],
		"district": "Ia Pa"
	},
	{
		"wards": [
			"KBang",
			"KRong",
			"Kon Pne",
			"Kông Bơ La",
			"Kông Lơng Khơng",
			"Lơ Ku",
			"Nghĩa An",
			"Sơ Pai",
			"Sơn Lang",
			"Tơ Tung",
			"Đak SMar",
			"Đông",
			"Đăk Roong"
		],
		"district": "KBang"
	},
	{
		"wards": [
			"An Vĩ",
			"Bình Minh",
			"Chí Minh",
			"Dân Tiến",
			"Khoái Châu",
			"Liên Khê",
			"Nguyễn Huệ",
			"Phùng Hưng",
			"Phạm Hồng Thái",
			"Thuần Hưng",
			"Tân Châu",
			"Tân Dân",
			"Tứ Dân",
			"Việt Hòa",
			"Ông Đình",
			"Đông Kết",
			"Đông Ninh",
			"Đông Tảo",
			"Đại Tập",
			"Đồng Tiến"
		],
		"district": "Khoái Châu"
	},
	{
		"wards": [
			"Ba Cụm Bắc",
			"Ba Cụm Nam",
			"Sơn Bình",
			"Sơn Hiệp",
			"Sơn Lâm",
			"Sơn Trung",
			"Thành Sơn",
			"Tô Hạp"
		],
		"district": "Khánh Sơn"
	},
	{
		"wards": [
			"Cầu Bà",
			"Giang Ly",
			"Khánh Bình",
			"Khánh Hiệp",
			"Khánh Nam",
			"Khánh Phú",
			"Khánh Thành",
			"Khánh Thượng",
			"Khánh Trung",
			"Khánh Vĩnh",
			"Khánh Đông",
			"Liên Sang",
			"Sông Cầu",
			"Sơn Thái"
		],
		"district": "Khánh Vĩnh"
	},
	{
		"wards": [
			"Bo",
			"Bình Sơn",
			"Cuối Hạ",
			"Hùng Sơn",
			"Hợp Tiến",
			"Kim Bôi",
			"Kim Lập",
			"Mi Hòa",
			"Nam Thượng",
			"Nuông Dăm",
			"Sào Báy",
			"Tú Sơn",
			"Vĩnh Tiến",
			"Vĩnh Đồng",
			"Xuân Thủy",
			"Đông Bắc",
			"Đú Sáng"
		],
		"district": "Kim Bôi"
	},
	{
		"wards": [
			"Ba Sao",
			"Hoàng Tây",
			"Khả Phong",
			"Liên Sơn",
			"Lê Hồ",
			"Nguyễn Úy",
			"Ngọc Sơn",
			"Quế",
			"Thanh Sơn",
			"Thi Sơn",
			"Thụy Lôi",
			"Tân Sơn",
			"Tân Tựu",
			"Tượng Lĩnh",
			"Văn Xá",
			"Đại Cương",
			"Đồng Hóa"
		],
		"district": "Kim Bảng"
	},
	{
		"wards": [
			"Bình Minh",
			"Chất Bình",
			"Cồn Thoi",
			"Hùng Tiến",
			"Hồi Ninh",
			"Kim Chính",
			"Kim Mỹ",
			"Kim Trung",
			"Kim Tân",
			"Kim Đông",
			"Kim Định",
			"Lai Thành",
			"Như Hòa",
			"Phát Diệm",
			"Quang Thiện",
			"Thượng Kiệm",
			"Tân Thành",
			"Văn Hải",
			"Xuân Chính",
			"Yên Lộc",
			"Ân Hòa",
			"Định Hóa",
			"Đồng Hướng"
		],
		"district": "Kim Sơn"
	},
	{
		"wards": [
			"Hòa Bình",
			"Kim Anh",
			"Kim Liên",
			"Kim Tân",
			"Kim Xuyên",
			"Kim Đính",
			"Lai Khê",
			"Ngũ Phúc",
			"Phú Thái",
			"Tam Kỳ",
			"Tuấn Việt",
			"Vũ Dũng",
			"Đại Đức",
			"Đồng Cẩm"
		],
		"district": "Kim Thành"
	},
	{
		"wards": [
			"Chính Nghĩa",
			"Diên Hồng",
			"Hiệp Cường",
			"Hùng An",
			"Lương Bằng",
			"Mai Động",
			"Nghĩa Dân",
			"Ngọc Thanh",
			"Phú Thọ",
			"Phạm Ngũ Lão",
			"Song Mai",
			"Toàn Thắng",
			"Vĩnh Xá",
			"Đồng Thanh",
			"Đức Hợp"
		],
		"district": "Kim Động"
	},
	{
		"wards": [
			"An Lưu",
			"An Phụ",
			"An Sinh",
			"Bạch Đằng",
			"Duy Tân",
			"Hiến Thành",
			"Hiệp An",
			"Hiệp Hòa",
			"Hiệp Sơn",
			"Long Xuyên",
			"Lê Ninh",
			"Lạc Long",
			"Minh Hòa",
			"Minh Tân",
			"Phú Thứ",
			"Phạm Thái",
			"Quang Thành",
			"Thái Thịnh",
			"Thăng Long",
			"Thượng Quận",
			"Thất Hùng",
			"Tân Dân"
		],
		"district": "Kinh Môn"
	},
	{
		"wards": [
			"An Sơn",
			"Hòn Tre",
			"Lại Sơn",
			"Nam Du"
		],
		"district": "Kiên Hải"
	},
	{
		"wards": [
			"Bình An",
			"Bình Trị",
			"Dương Hòa",
			"Hòa Điền",
			"Hòn Nghệ",
			"Kiên Bình",
			"Kiên Lương",
			"Sơn Hải"
		],
		"district": "Kiên Lương"
	},
	{
		"wards": [
			"Bắc Hà",
			"Bắc Sơn",
			"Nam Sơn",
			"Ngọc Sơn",
			"Trần Thành Ngọ",
			"Văn Đẩu",
			"Đồng Hoà"
		],
		"district": "Kiến An"
	},
	{
		"wards": [
			"Du Lễ",
			"Hữu Bằng",
			"Kiến Hưng",
			"Kiến Quốc",
			"Minh Tân",
			"Ngũ Phúc",
			"Núi Đối",
			"Thanh Sơn",
			"Thuận Thiên",
			"Tân Phong",
			"Tân Trào",
			"Tú Sơn",
			"Đoàn Xá",
			"Đông Phương",
			"Đại Hợp",
			"Đại Đồng"
		],
		"district": "Kiến Thuỵ"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"Bình Hiệp",
			"Bình Tân",
			"Thạnh Hưng",
			"Thạnh Trị",
			"Tuyên Thạnh"
		],
		"district": "Kiến Tường"
	},
	{
		"wards": [
			"An Bình",
			"Bình Minh",
			"Bình Nguyên",
			"Bình Thanh",
			"Bình Định",
			"Hòa Bình",
			"Hồng Thái",
			"Hồng Tiến",
			"Hồng Vũ",
			"Kiến Xương",
			"Lê Lợi",
			"Minh Quang",
			"Minh Tân",
			"Nam Bình",
			"Quang Bình",
			"Quang Lịch",
			"Quang Minh",
			"Quang Trung",
			"Quốc Tuấn",
			"Thanh Tân",
			"Thống Nhất",
			"Trà Giang",
			"Tây Sơn",
			"Vũ An",
			"Vũ Công",
			"Vũ Lễ",
			"Vũ Ninh",
			"Vũ Quí",
			"Vũ Trung"
		],
		"district": "Kiến Xương"
	},
	{
		"wards": [
			"Hiếu",
			"Măng Buk",
			"Măng Cành",
			"Măng Đen",
			"Ngok Tem",
			"Pờ Ê",
			"Đắk Nên",
			"Đắk Ring",
			"Đắk Tăng"
		],
		"district": "Kon Plông"
	},
	{
		"wards": [
			"Tân Lập",
			"Đắk Kôi",
			"Đắk Pne",
			"Đắk Ruồng",
			"Đắk Rve",
			"Đắk Tơ Lung",
			"Đắk Tờ Re"
		],
		"district": "Kon Rẫy"
	},
	{
		"wards": [
			"Chư Hreng",
			"Duy Tân",
			"Hòa Bình",
			"Ia Chim",
			"Kroong",
			"Lê Lợi",
			"Nguyễn Trãi",
			"Ngô Mây",
			"Ngọk Bay",
			"Quang Trung",
			"Quyết Thắng",
			"Thắng Lợi",
			"Thống Nhất",
			"Trường Chinh",
			"Trần Hưng Đạo",
			"Vinh Quang",
			"Đoàn Kết",
			"Đăk Năng",
			"Đắk Blà",
			"Đắk Cấm",
			"Đắk Rơ Wa"
		],
		"district": "Kon Tum"
	},
	{
		"wards": [
			"Buôn Trấp",
			"Bình Hòa",
			"Băng A Drênh",
			"Dray Sáp",
			"Dur KMăl",
			"Ea Bông",
			"Ea Na",
			"Quảng Điền"
		],
		"district": "Krông A Na"
	},
	{
		"wards": [
			"Cư Drăm",
			"Cư KTy",
			"Cư Pui",
			"Dang Kang",
			"Ea Trul",
			"Hòa Lễ",
			"Hòa Phong",
			"Hòa Sơn",
			"Hòa Thành",
			"Khuê Ngọc Điền",
			"Krông Kmar",
			"Yang Mao",
			"Yang Reh"
		],
		"district": "Krông Bông"
	},
	{
		"wards": [
			"Chư KBô",
			"Cư Né",
			"Cư Pơng",
			"Ea Ngai",
			"Ea Sin",
			"Pơng Drang",
			"Tân Lập"
		],
		"district": "Krông Búk"
	},
	{
		"wards": [
			"Buôn Choah",
			"Nam Xuân",
			"Nam Đà",
			"Nâm N'Đir",
			"Nâm Nung",
			"Quảng Phú",
			"Tân Thành",
			"Đắk Drô",
			"Đắk Mâm",
			"Đắk Nang",
			"Đắk Sôr",
			"Đức Xuyên"
		],
		"district": "Krông Nô"
	},
	{
		"wards": [
			"Cư Klông",
			"Ea Dăh",
			"Ea Hồ",
			"Ea Puk",
			"Ea Tam",
			"Ea Tân",
			"Ea Tóh",
			"Krông Năng",
			"Phú Lộc",
			"Phú Xuân",
			"Tam Giang",
			"ĐLiê Ya"
		],
		"district": "Krông Năng"
	},
	{
		"wards": [
			"Chư Drăng",
			"Chư Gu",
			"Chư Ngọc",
			"Chư Rcăm",
			"Ia HDreh",
			"Ia Mláh",
			"Ia RMok",
			"Ia RSai",
			"Ia RSươm",
			"Krông Năng",
			"Phú Cần",
			"Phú Túc",
			"Uar",
			"Đất Bằng"
		],
		"district": "Krông Pa"
	},
	{
		"wards": [
			"Ea Hiu",
			"Ea KNuec",
			"Ea Kly",
			"Ea Kuăng",
			"Ea Kênh",
			"Ea Phê",
			"Ea Uy",
			"Ea Yiêng",
			"Ea Yông",
			"Hòa An",
			"Hòa Tiến",
			"Hòa Đông",
			"KRông Búk",
			"Phước An",
			"Tân Tiến",
			"Vụ Bổn"
		],
		"district": "Krông Pắc"
	},
	{
		"wards": [
			"An Trung",
			"Chơ Long",
			"Chư Krêy",
			"Kông Chro",
			"Kông Yang",
			"SRó",
			"Ya Ma",
			"Yang Nam",
			"Yang Trung",
			"Đăk Pling",
			"Đăk Pơ Pho",
			"Đăk Song",
			"Đăk Tơ Pang",
			"Đắk Kơ Ning"
		],
		"district": "Kông Chro"
	},
	{
		"wards": [
			"An Lạc Thôn",
			"An Lạc Tây",
			"An Mỹ",
			"Ba Trinh",
			"Kế An",
			"Kế Sách",
			"Kế Thành",
			"Nhơn Mỹ",
			"Phong Nẫm",
			"Thới An Hội",
			"Trinh Phú",
			"Xuân Hòa",
			"Đại Hải"
		],
		"district": "Kế Sách"
	},
	{
		"wards": [
			"Hưng Trí",
			"Kỳ Bắc",
			"Kỳ Châu",
			"Kỳ Giang",
			"Kỳ Hoa",
			"Kỳ Hà",
			"Kỳ Hải",
			"Kỳ Khang",
			"Kỳ Liên",
			"Kỳ Long",
			"Kỳ Lạc",
			"Kỳ Lợi",
			"Kỳ Nam",
			"Kỳ Ninh",
			"Kỳ Phong",
			"Kỳ Phú",
			"Kỳ Phương",
			"Kỳ Sơn",
			"Kỳ Thư",
			"Kỳ Thượng",
			"Kỳ Thịnh",
			"Kỳ Thọ",
			"Kỳ Tiến",
			"Kỳ Trinh",
			"Kỳ Trung",
			"Kỳ Tân",
			"Kỳ Tây",
			"Kỳ Văn",
			"Kỳ Xuân",
			"Kỳ Đồng",
			"Lâm Hợp"
		],
		"district": "Kỳ Anh"
	},
	{
		"wards": [
			"Bảo Nam",
			"Bảo Thắng",
			"Bắc Lý",
			"Chiêu Lưu",
			"Huồi Tụ",
			"Hữu Kiệm",
			"Hữu Lập",
			"Keng Đu",
			"Mường Lống",
			"Mường Típ",
			"Mường Xén",
			"Mường Ải",
			"Mỹ Lý",
			"Na Loi",
			"Na Ngoi",
			"Nậm Càn",
			"Nậm Cắn",
			"Phà Đánh",
			"Tà Cạ",
			"Tây Sơn",
			"Đoọc Mạy"
		],
		"district": "Kỳ Sơn"
	},
	{
		"wards": [
			"Bình Tân",
			"Phước Hội",
			"Phước Lộc",
			"Tân An",
			"Tân Bình",
			"Tân Hải",
			"Tân Phước",
			"Tân Thiện",
			"Tân Tiến"
		],
		"district": "La Gi"
	},
	{
		"wards": [
			"Quyết Thắng",
			"Quyết Tiến",
			"San Thàng",
			"Sùng Phài",
			"Tân Phong",
			"Đoàn Kết",
			"Đông Phong"
		],
		"district": "Lai Châu"
	},
	{
		"wards": [
			"Hòa Long",
			"Hòa Thành",
			"Lai Vung",
			"Long Hậu",
			"Long Thắng",
			"Phong Hòa",
			"Tân Dương",
			"Tân Hòa",
			"Tân Phước",
			"Tân Thành",
			"Vĩnh Thới",
			"Định Hòa"
		],
		"district": "Lai Vung"
	},
	{
		"wards": [
			"Giao An",
			"Giao Thiện",
			"Lang Chánh",
			"Lâm Phú",
			"Tam Văn",
			"Trí Nang",
			"Tân Phúc",
			"Yên Khương",
			"Yên Thắng",
			"Đồng Lương"
		],
		"district": "Lang Chánh"
	},
	{
		"wards": [
			"Hòa Hiệp Bắc",
			"Hòa Hiệp Nam",
			"Hòa Khánh Bắc",
			"Hòa Khánh Nam",
			"Hòa Minh"
		],
		"district": "Liên Chiểu"
	},
	{
		"wards": [
			"Bồ Đề",
			"Cự Khối",
			"Gia Thụy",
			"Giang Biên",
			"Long Biên",
			"Ngọc Lâm",
			"Ngọc Thụy",
			"Phúc Lợi",
			"Phúc Đồng",
			"Thượng Thanh",
			"Thạch Bàn",
			"Việt Hưng",
			"Đức Giang"
		],
		"district": "Long Biên"
	},
	{
		"wards": [
			"An Bình",
			"Bình Hòa Phước",
			"Hòa Ninh",
			"Hòa Phú",
			"Long An",
			"Long Hồ",
			"Long Phước",
			"Lộc Hòa",
			"Phú Quới",
			"Phước Hậu",
			"Thanh Đức",
			"Thạnh Quới",
			"Tân Hạnh",
			"Đồng Phú"
		],
		"district": "Long Hồ"
	},
	{
		"wards": [
			"Bàu Sen",
			"Bàu Trâm",
			"Bình Lộc",
			"Bảo Quang",
			"Bảo Vinh",
			"Hàng Gòn",
			"Phú Bình",
			"Suối Tre",
			"Xuân An",
			"Xuân Bình",
			"Xuân Hoà",
			"Xuân Lập",
			"Xuân Tân"
		],
		"district": "Long Khánh"
	},
	{
		"wards": [
			"Bình Thạnh",
			"Long Bình",
			"Long Phú",
			"Long Trị",
			"Long Trị A",
			"Lương Nghĩa",
			"Lương Tâm",
			"Thuận An",
			"Thuận Hòa",
			"Thuận Hưng",
			"Trà Lồng",
			"Tân Phú",
			"Vĩnh Thuận Đông",
			"Vĩnh Tường",
			"Vĩnh Viễn",
			"Vĩnh Viễn A",
			"Xà Phiên"
		],
		"district": "Long Mỹ"
	},
	{
		"wards": [
			"Châu Khánh",
			"Hậu Thạnh",
			"Long Phú",
			"Long Phú",
			"Long Đức",
			"Phú Hữu",
			"Song Phụng",
			"Trường Khánh",
			"Tân Hưng",
			"Tân Thạnh",
			"Đại Ngãi"
		],
		"district": "Long Phú"
	},
	{
		"wards": [
			"An Phước",
			"Bàu Cạn",
			"Bình An",
			"Bình Sơn",
			"Cẩm Đường",
			"Long An",
			"Long Phước",
			"Long Thành",
			"Long Đức",
			"Lộc An",
			"Phước Bình",
			"Phước Thái",
			"Tam An",
			"Tân Hiệp"
		],
		"district": "Long Thành"
	},
	{
		"wards": [
			"Bình Khánh",
			"Bình Đức",
			"Mỹ Bình",
			"Mỹ Hoà Hưng",
			"Mỹ Hòa",
			"Mỹ Khánh",
			"Mỹ Long",
			"Mỹ Phước",
			"Mỹ Quý",
			"Mỹ Thạnh",
			"Mỹ Thới",
			"Mỹ Xuyên"
		],
		"district": "Long Xuyên"
	},
	{
		"wards": [
			"Long Hải",
			"Long Tân",
			"Long Điền",
			"Láng Dài",
			"Phước Hưng",
			"Phước Hải",
			"Phước Hội",
			"Phước Long Thọ",
			"Phước Tỉnh",
			"Tam An",
			"Đất Đỏ"
		],
		"district": "Long Đất"
	},
	{
		"wards": [
			"Bình Minh",
			"Bắc Cường",
			"Bắc Lệnh",
			"Cam Đường",
			"Cốc Lếu",
			"Cốc San",
			"Duyên Hải",
			"Hợp Thành",
			"Kim Tân",
			"Lào Cai",
			"Nam Cường",
			"Pom Hán",
			"Thống Nhất",
			"Tả Phời",
			"Vạn Hoà",
			"Xuân Tăng",
			"Đồng Tuyển"
		],
		"district": "Lào Cai"
	},
	{
		"wards": [
			"Bình An",
			"Hồng Quang",
			"Khuôn Hà",
			"Lăng Can",
			"Minh Quang",
			"Phúc Sơn",
			"Phúc Yên",
			"Thượng Lâm",
			"Thổ Bình",
			"Xuân Lập"
		],
		"district": "Lâm Bình"
	},
	{
		"wards": [
			"Gia Lâm",
			"Hoài Đức",
			"Liên Hà",
			"Mê Linh",
			"Nam Ban",
			"Nam Hà",
			"Phi Tô",
			"Phú Sơn",
			"Phúc Thọ",
			"Tân Hà",
			"Tân Thanh",
			"Tân Văn",
			"Đan Phượng",
			"Đinh Văn",
			"Đông Thanh",
			"Đạ Đờn"
		],
		"district": "Lâm Hà"
	},
	{
		"wards": [
			"Bản Nguyên",
			"Cao Xá",
			"Hùng Sơn",
			"Lâm Thao",
			"Phùng Nguyên",
			"Sơn Vi",
			"Thạch Sơn",
			"Tiên Kiên",
			"Tứ Xã",
			"Vĩnh Lại",
			"Xuân Huy",
			"Xuân Lũng"
		],
		"district": "Lâm Thao"
	},
	{
		"wards": [
			"An Biên",
			"An Dương",
			"Dư Hàng Kênh",
			"Hàng Kênh",
			"Kênh Dương",
			"Trần Nguyên Hãn",
			"Vĩnh Niệm"
		],
		"district": "Lê Chân"
	},
	{
		"wards": [
			"Bắc Lý",
			"Chân Lý",
			"Chính Lý",
			"Công Lý",
			"Hòa Hậu",
			"Hợp Lý",
			"Nguyên Lý",
			"Nhân Bình",
			"Nhân Chính",
			"Nhân Khang",
			"Nhân Mỹ",
			"Nhân Nghĩa",
			"Nhân Thịnh",
			"Phú Phúc",
			"Tiến Thắng",
			"Trần Hưng Đạo",
			"Văn Lý",
			"Vĩnh Trụ",
			"Xuân Khê",
			"Đạo Lý",
			"Đức Lý"
		],
		"district": "Lý Nhân"
	},
	{
		"wards": [
			"Cao Dương",
			"Cao Sơn",
			"Cư Yên",
			"Hòa Sơn",
			"Liên Sơn",
			"Lâm Sơn",
			"Lương Sơn",
			"Nhuận Trạch",
			"Thanh Cao",
			"Thanh Sơn",
			"Tân Vinh"
		],
		"district": "Lương Sơn"
	},
	{
		"wards": [
			"An Thịnh",
			"An Tập",
			"Bình Định",
			"Lâm Thao",
			"Phú Hòa",
			"Phú Lương",
			"Quang Minh",
			"Quảng Phú",
			"Thứa",
			"Trung Chính",
			"Trung Kênh",
			"Tân Lãng"
		],
		"district": "Lương Tài"
	},
	{
		"wards": [
			"Lát",
			"Lạc Dương",
			"Đưng KNớ",
			"Đạ Chais",
			"Đạ Nhim",
			"Đạ Sar"
		],
		"district": "Lạc Dương"
	},
	{
		"wards": [
			"Bình Hẻm",
			"Chí Đạo",
			"Hương Nhượng",
			"Miền Đồi",
			"Mỹ Thành",
			"Ngọc Lâu",
			"Ngọc Sơn",
			"Nhân Nghĩa",
			"Quyết Thắng",
			"Quý Hòa",
			"Thượng Cốc",
			"Tuân Đạo",
			"Tân Lập",
			"Tân Mỹ",
			"Tự Do",
			"Văn Nghĩa",
			"Văn Sơn",
			"Vũ Bình",
			"Vụ Bản",
			"Xuất Hóa",
			"Yên Nghiệp",
			"Yên Phú",
			"Ân Nghĩa",
			"Định Cư"
		],
		"district": "Lạc Sơn"
	},
	{
		"wards": [
			"An Bình",
			"Ba Hàng Đồi",
			"Chi Nê",
			"Hưng Thi",
			"Khoan Dụ",
			"Phú Nghĩa",
			"Phú Thành",
			"Thống Nhất",
			"Yên Bồng",
			"Đồng Tâm"
		],
		"district": "Lạc Thủy"
	},
	{
		"wards": [
			"An Hà",
			"Dương Đức",
			"Hương Lạc",
			"Hương Sơn",
			"Kép",
			"Mỹ Thái",
			"Nghĩa Hòa",
			"Nghĩa Hưng",
			"Quang Thịnh",
			"Thái Đào",
			"Tiên Lục",
			"Tân Dĩnh",
			"Tân Hưng",
			"Tân Thanh",
			"Vôi",
			"Xuân Hương",
			"Xương Lâm",
			"Đào Mỹ",
			"Đại Lâm"
		],
		"district": "Lạng Giang"
	},
	{
		"wards": [
			"Chi Lăng",
			"Hoàng Văn Thụ",
			"Hoàng Đồng",
			"Mai Pha",
			"Quảng Lạc",
			"Tam Thanh",
			"Vĩnh Trại",
			"Đông Kinh"
		],
		"district": "Lạng Sơn"
	},
	{
		"wards": [
			"Bình Thành",
			"Bình Thạnh Trung",
			"Hội An Đông",
			"Long Hưng A",
			"Long Hưng B",
			"Lấp Vò",
			"Mỹ An Hưng A",
			"Mỹ An Hưng B",
			"Tân Khánh Trung",
			"Tân Mỹ",
			"Vĩnh Thạnh",
			"Định An",
			"Định Yên"
		],
		"district": "Lấp Vò"
	},
	{
		"wards": [
			"Bàn Giản",
			"Bắc Bình",
			"Hoa Sơn",
			"Hợp Lý",
			"Liên Hòa",
			"Liễn Sơn",
			"Lập Thạch",
			"Ngọc Mỹ",
			"Quang Sơn",
			"Sơn Đông",
			"Thái Hòa",
			"Tiên Lữ",
			"Tây Sơn",
			"Tử Du",
			"Vân Trục",
			"Văn Quán",
			"Xuân Hòa",
			"Xuân Lôi",
			"Đồng Ích"
		],
		"district": "Lập Thạch"
	},
	{
		"wards": [
			"Buôn Triết",
			"Buôn Tría",
			"Bông Krang",
			"Ea R'Bin",
			"Krông Nô",
			"Liên Sơn",
			"Nam Ka",
			"Yang Tao",
			"Đắk Liêng",
			"Đắk Nuê",
			"Đắk Phơi"
		],
		"district": "Lắk"
	},
	{
		"wards": [
			"An Thủy",
			"Cam Thủy",
			"Dương Thủy",
			"Hoa Thủy",
			"Hưng Thủy",
			"Hồng Thủy",
			"Kim Thủy",
			"Kiến Giang",
			"Liên Thủy",
			"Lâm Thủy",
			"Lộc Thủy",
			"Mai Thủy",
			"Mỹ Thủy",
			"NT Lệ Ninh",
			"Ngân Thủy",
			"Ngư Thủy",
			"Ngư Thủy Bắc",
			"Phong Thủy",
			"Phú Thủy",
			"Sen Thủy",
			"Sơn Thủy",
			"Thanh Thủy",
			"Thái Thủy",
			"Trường Thủy",
			"Tân Thủy",
			"Xuân Thủy"
		],
		"district": "Lệ Thủy"
	},
	{
		"wards": [
			"Hữu Khánh",
			"Hữu Lân",
			"Khuất Xá",
			"Khánh Xuân",
			"Lộc Bình",
			"Lợi Bác",
			"Minh Hiệp",
			"Mẫu Sơn",
			"Na Dương",
			"Nam Quan",
			"Sàn Viên",
			"Tam Gia",
			"Thống Nhất",
			"Tú Mịch",
			"Tú Đoạn",
			"Xuân Dương",
			"Yên Khoái",
			"Ái Quốc",
			"Đông Quan",
			"Đồng Bục"
		],
		"district": "Lộc Bình"
	},
	{
		"wards": [
			"Lộc An",
			"Lộc Hiệp",
			"Lộc Hòa",
			"Lộc Hưng",
			"Lộc Khánh",
			"Lộc Ninh",
			"Lộc Phú",
			"Lộc Quang",
			"Lộc Thiện",
			"Lộc Thuận",
			"Lộc Thành",
			"Lộc Thái",
			"Lộc Thạnh",
			"Lộc Thịnh",
			"Lộc Tấn",
			"Lộc Điền"
		],
		"district": "Lộc Ninh"
	},
	{
		"wards": [
			"Bình Sơn",
			"Bảo Sơn",
			"Bảo Đài",
			"Bắc Lũng",
			"Chu Điện",
			"Cương Sơn",
			"Cẩm Lý",
			"Huyền Sơn",
			"Khám Lạng",
			"Lan Mẫu",
			"Lục Sơn",
			"Nghĩa Phương",
			"Phương Sơn",
			"Tam Dị",
			"Thanh Lâm",
			"Tiên Nha",
			"Trường Giang",
			"Trường Sơn",
			"Vô Tranh",
			"Yên Sơn",
			"Đan Hội",
			"Đông Hưng",
			"Đông Phú",
			"Đồi Ngô"
		],
		"district": "Lục Nam"
	},
	{
		"wards": [
			"Biên Sơn",
			"Biển Động",
			"Cấm Sơn",
			"Giáp Sơn",
			"Hộ Đáp",
			"Kim Sơn",
			"Phong Minh",
			"Phong Vân",
			"Phì Điền",
			"Phú Nhuận",
			"Sa Lý",
			"Sơn Hải",
			"Tân Hoa",
			"Tân Lập",
			"Tân Mộc",
			"Tân Quang",
			"Tân Sơn",
			"Đèo Gia",
			"Đồng Cốc"
		],
		"district": "Lục Ngạn"
	},
	{
		"wards": [
			"An Lạc",
			"An Phú",
			"Khai Trung",
			"Khánh Hoà",
			"Khánh Thiện",
			"Liễu Đô",
			"Lâm Thượng",
			"Mai Sơn",
			"Minh Chuẩn",
			"Minh Tiến",
			"Minh Xuân",
			"Mường Lai",
			"Phan Thanh",
			"Phúc Lợi",
			"Trung Tâm",
			"Trúc Lâu",
			"Tân Lĩnh",
			"Tân Lập",
			"Tân Phượng",
			"Tô Mậu",
			"Vĩnh Lạc",
			"Yên Thắng",
			"Yên Thế",
			"Động Quan"
		],
		"district": "Lục Yên"
	},
	{
		"wards": [
			"Cư K Róa",
			"Cư M'ta",
			"Cư Prao",
			"Cư San",
			"Ea H'MLay",
			"Ea Lai",
			"Ea M' Doal",
			"Ea Pil",
			"Ea Riêng",
			"Ea Trang",
			"Krông Jing",
			"Krông Á",
			"M'Đrắk"
		],
		"district": "M'Đrắk"
	},
	{
		"wards": [
			"Bao La",
			"Chiềng Châu",
			"Cun Pheo",
			"Hang Kia",
			"Mai Châu",
			"Mai Hạ",
			"Mai Hịch",
			"Nà Phòn",
			"Pà Cò",
			"Săm Khóe",
			"Sơn Thủy",
			"Thành Sơn",
			"Tân Thành",
			"Tòng Đậu",
			"Vạn Mai",
			"Đồng Tân"
		],
		"district": "Mai Châu"
	},
	{
		"wards": [
			"Chiềng Ban",
			"Chiềng Chung",
			"Chiềng Chăn",
			"Chiềng Dong",
			"Chiềng Kheo",
			"Chiềng Lương",
			"Chiềng Mai",
			"Chiềng Mung",
			"Chiềng Nơi",
			"Chiềng Sung",
			"Chiềng Ve",
			"Cò Nòi",
			"Hát Lót",
			"Hát Lót",
			"Mường Bon",
			"Mường Bằng",
			"Mường Chanh",
			"Nà Bó",
			"Nà Ơt",
			"Phiêng Cằm",
			"Phiêng Pằn",
			"Tà Hộc"
		],
		"district": "Mai Sơn"
	},
	{
		"wards": [
			"An Phước",
			"Bình Phước",
			"Chánh An",
			"Cái Nhum",
			"Hòa Tịnh",
			"Long Mỹ",
			"Mỹ An",
			"Mỹ Phước",
			"Nhơn Phú",
			"Tân An Hội",
			"Tân Long",
			"Tân Long Hội"
		],
		"district": "Mang Thít"
	},
	{
		"wards": [
			"Ayun",
			"Hra",
			"Kon Chiêng",
			"Kon Dơng",
			"Kon Thụp",
			"Lơ Pang",
			"Đak Jơ Ta",
			"Đak Ta Ley",
			"Đê Ar",
			"Đăk Djrăng",
			"Đăk Trôi",
			"Đăk Yă"
		],
		"district": "Mang Yang"
	},
	{
		"wards": [
			"Dân Hóa",
			"Hóa Hợp",
			"Hóa Sơn",
			"Hồng Hóa",
			"Minh Hóa",
			"Quy Đạt",
			"Thượng Hóa",
			"Trung Hóa",
			"Trọng Hóa",
			"Tân Hóa",
			"Tân Thành",
			"Xuân Hóa",
			"Yên Hóa"
		],
		"district": "Minh Hóa"
	},
	{
		"wards": [
			"Long Hiệp",
			"Long Mai",
			"Long Môn",
			"Long Sơn",
			"Thanh An"
		],
		"district": "Minh Long"
	},
	{
		"wards": [
			"Cán Chu Phìn",
			"Giàng Chu Phìn",
			"Khâu Vai",
			"Lũng Chinh",
			"Lũng Pù",
			"Mèo Vạc",
			"Niêm Sơn",
			"Niêm Tòng",
			"Nậm Ban",
			"Pả Vi",
			"Pải Lủng",
			"Sơn Vĩ",
			"Sủng Máng",
			"Sủng Trà",
			"Thượng Phùng",
			"Tát Ngà",
			"Tả Lủng",
			"Xín Cái"
		],
		"district": "Mèo Vạc"
	},
	{
		"wards": [
			"Chi Đông",
			"Chu Phan",
			"Hoàng Kim",
			"Kim Hoa",
			"Liên Mạc",
			"Mê Linh",
			"Quang Minh",
			"Tam Đồng",
			"Thanh Lâm",
			"Thạch Đà",
			"Tiến Thắng",
			"Tiến Thịnh",
			"Tiền Phong",
			"Tráng Việt",
			"Tự Lập",
			"Văn Khê",
			"Đại Thịnh"
		],
		"district": "Mê Linh"
	},
	{
		"wards": [
			"Bình Ngọc",
			"Bắc Sơn",
			"Hải Hoà",
			"Hải Sơn",
			"Hải Tiến",
			"Hải Xuân",
			"Hải Yên",
			"Hải Đông",
			"Ka Long",
			"Ninh Dương",
			"Quảng Nghĩa",
			"Trà Cổ",
			"Trần Phú",
			"Vĩnh Thực",
			"Vĩnh Trung",
			"Vạn Ninh"
		],
		"district": "Móng Cái"
	},
	{
		"wards": [
			"Cao Phạ",
			"Chế Cu Nha",
			"Chế Tạo",
			"Dế Su Phình",
			"Hồ Bốn",
			"Khao Mang",
			"Kim Nọi",
			"La Pán Tẩn",
			"Lao Chải",
			"Mù Căng Chải",
			"Mồ Dề",
			"Nậm Có",
			"Nậm Khắt",
			"Púng Luông"
		],
		"district": "Mù Căng Chải"
	},
	{
		"wards": [
			"Huổi Lèng",
			"Huổi Mí",
			"Hừa Ngài",
			"Ma Thì Hồ",
			"Mường Chà",
			"Mường Mươn",
			"Mường Tùng",
			"Na Sang",
			"Nậm Nèn",
			"Pa Ham",
			"Sa Lông",
			"Xá Tổng"
		],
		"district": "Mường Chà"
	},
	{
		"wards": [
			"Bản Lầu",
			"Bản Sen",
			"Cao Sơn",
			"Dìn Chin",
			"La Pan Tẩn",
			"Lùng Khấu Nhin",
			"Lùng Vai",
			"Mường Khương",
			"Nấm Lư",
			"Nậm Chảy",
			"Pha Long",
			"Thanh Bình",
			"Tung Chung Phố",
			"Tả Gia Khâu",
			"Tả Ngải Chồ",
			"Tả Thàng"
		],
		"district": "Mường Khương"
	},
	{
		"wards": [
			"Chiềng Công",
			"Chiềng Hoa",
			"Chiềng Lao",
			"Chiềng Muôn",
			"Chiềng San",
			"Chiềng Ân",
			"Hua Trai",
			"Mường Bú",
			"Mường Chùm",
			"Mường Trai",
			"Ngọc Chiến",
			"Nậm Giôn",
			"Nậm Păm",
			"Pi Toong",
			"Tạ Bú",
			"Ít Ong"
		],
		"district": "Mường La"
	},
	{
		"wards": [
			"Lay Nưa",
			"Na Lay",
			"Sông Đà"
		],
		"district": "Mường Lay"
	},
	{
		"wards": [
			"Mường Chanh",
			"Mường Lát",
			"Mường Lý",
			"Nhi Sơn",
			"Pù Nhi",
			"Quang Chiểu",
			"Tam Chung",
			"Trung Lý"
		],
		"district": "Mường Lát"
	},
	{
		"wards": [
			"Chung Chải",
			"Huổi Lếnh",
			"Leng Su Sìn",
			"Mường Nhé",
			"Mường Toong",
			"Nậm Kè",
			"Nậm Vì",
			"Pá Mỳ",
			"Quảng Lâm",
			"Sen Thượng",
			"Sín Thầu"
		],
		"district": "Mường Nhé"
	},
	{
		"wards": [
			"Bum Nưa",
			"Bum Tở",
			"Ka Lăng",
			"Kan Hồ",
			"Mù Cả",
			"Mường Tè",
			"Mường Tè",
			"Nậm Khao",
			"Pa Vệ Sử",
			"Pa ủ",
			"Thu Lũm",
			"Tà Tổng",
			"Tá Bạ",
			"Vàng San"
		],
		"district": "Mường Tè"
	},
	{
		"wards": [
			"Búng Lao",
			"Mường Lạn",
			"Mường Đăng",
			"Mường Ảng",
			"Ngối Cáy",
			"Nặm Lịch",
			"Xuân Lao",
			"Ẳng Cang",
			"Ẳng Nưa",
			"Ẳng Tở"
		],
		"district": "Mường Ảng"
	},
	{
		"wards": [
			"Hòa Lộc",
			"Hưng Khánh Trung A",
			"Khánh Thạnh Tân",
			"Nhuận Phú Tân",
			"Phú Mỹ",
			"Phước Mỹ Trung",
			"Thanh Tân",
			"Thành An",
			"Thạnh Ngãi",
			"Tân Bình",
			"Tân Phú Tây",
			"Tân Thanh Tây",
			"Tân Thành Bình"
		],
		"district": "Mỏ Cày Bắc"
	},
	{
		"wards": [
			"An Thạnh",
			"An Thới",
			"An Định",
			"Bình Khánh",
			"Cẩm Sơn",
			"Hương Mỹ",
			"Minh Đức",
			"Mỏ Cày",
			"Ngãi Đăng",
			"Phước Hiệp",
			"Thành Thới A",
			"Thành Thới B",
			"Tân Hội",
			"Tân Trung",
			"Đa Phước Hội",
			"Định Thủy"
		],
		"district": "Mỏ Cày Nam"
	},
	{
		"wards": [
			"Mộ Đức",
			"Thắng Lợi",
			"Đức Chánh",
			"Đức Hiệp",
			"Đức Hòa",
			"Đức Lân",
			"Đức Minh",
			"Đức Nhuận",
			"Đức Phong",
			"Đức Phú",
			"Đức Thạnh",
			"Đức Tân"
		],
		"district": "Mộ Đức"
	},
	{
		"wards": [
			"Bình Minh",
			"Chiềng Chung",
			"Chiềng Hắc",
			"Chiềng Khừa",
			"Chiềng Sơn",
			"Cờ Đỏ",
			"Lóng Sập",
			"Mường Sang",
			"Mộc Lỵ",
			"Mộc Sơn",
			"Thảo Nguyên",
			"Tân Yên",
			"Vân Sơn",
			"Đoàn Kết",
			"Đông Sang"
		],
		"district": "Mộc Châu"
	},
	{
		"wards": [
			"Bình Hòa Trung",
			"Bình Hòa Tây",
			"Bình Hòa Đông",
			"Bình Phong Thạnh",
			"Bình Thạnh",
			"Tân Lập",
			"Tân Thành"
		],
		"district": "Mộc Hóa"
	},
	{
		"wards": [
			"Bạch Sam",
			"Bần Yên Nhân",
			"Cẩm Xá",
			"Dương Quang",
			"Dị Sử",
			"Hòa Phong",
			"Hưng Long",
			"Minh Đức",
			"Ngọc Lâm",
			"Nhân Hòa",
			"Phan Đình Phùng",
			"Phùng Chí Kiên",
			"Xuân Dục"
		],
		"district": "Mỹ Hào"
	},
	{
		"wards": [
			"1",
			"10",
			"2",
			"4",
			"5",
			"6",
			"9",
			"Mỹ Phong",
			"Phước Thạnh",
			"Thới Sơn",
			"Trung An",
			"Tân Long",
			"Tân Mỹ Chánh",
			"Đạo Thạnh"
		],
		"district": "Mỹ Tho"
	},
	{
		"wards": [
			"Huỳnh Hữu Nghĩa",
			"Hưng Phú",
			"Long Hưng",
			"Mỹ Hương",
			"Mỹ Phước",
			"Mỹ Thuận",
			"Mỹ Tú",
			"Phú Mỹ",
			"Thuận Hưng"
		],
		"district": "Mỹ Tú"
	},
	{
		"wards": [
			"Gia Hòa 1",
			"Gia Hòa 2",
			"Hòa Tú 1",
			"Hòa Tú II",
			"Mỹ Xuyên",
			"Ngọc Tố",
			"Ngọc Đông",
			"Tham Đôn",
			"Thạnh Phú",
			"Thạnh Quới",
			"Đại Tâm"
		],
		"district": "Mỹ Xuyên"
	},
	{
		"wards": [
			"An Mỹ",
			"An Phú",
			"An Tiến",
			"Hùng Tiến",
			"Hương Sơn",
			"Hồng Sơn",
			"Hợp Thanh",
			"Hợp Tiến",
			"Lê Thanh",
			"Mỹ Xuyên",
			"Phù Lưu Tế",
			"Phùng Xá",
			"Phúc Lâm",
			"Thượng Lâm",
			"Tuy Lai",
			"Vạn Tín",
			"Xuy Xá",
			"Đại Hưng",
			"Đại Nghĩa",
			"Đồng Tâm"
		],
		"district": "Mỹ Đức"
	},
	{
		"wards": [
			"Côn Lôn",
			"Hồng Thái",
			"Khau Tinh",
			"Na Hang",
			"Năng Khả",
			"Sinh Long",
			"Sơn Phú",
			"Thanh Tương",
			"Thượng Giáp",
			"Thượng Nông",
			"Yên Hoa",
			"Đà Vị"
		],
		"district": "Na Hang"
	},
	{
		"wards": [
			"Côn Minh",
			"Cư Lễ",
			"Cường Lợi",
			"Dương Sơn",
			"Kim Hỷ",
			"Kim Lư",
			"Liêm Thuỷ",
			"Lương Thượng",
			"Quang Phong",
			"Sơn Thành",
			"Trần Phú",
			"Văn Lang",
			"Văn Minh",
			"Văn Vũ",
			"Xuân Dương",
			"Yến Lạc",
			"Đổng Xá"
		],
		"district": "Na Rì"
	},
	{
		"wards": [
			"Chà Vàl",
			"Chơ Chun",
			"Cà Dy",
			"La Dêê",
			"Laêê",
			"Thạnh Mỹ",
			"Tà Bhinh",
			"Tà Pơơ",
			"Zuôich",
			"Đắc Pre",
			"Đắc Pring",
			"Đắc Tôi"
		],
		"district": "Nam Giang"
	},
	{
		"wards": [
			"An Bình",
			"An Phú",
			"An Sơn",
			"Cộng Hòa",
			"Hiệp Cát",
			"Hồng Phong",
			"Hợp Tiến",
			"Minh Tân",
			"Nam Hưng",
			"Nam Sách",
			"Nam Tân",
			"Quốc Tuấn",
			"Thái Tân",
			"Trần Phú",
			"Đồng Lạc"
		],
		"district": "Nam Sách"
	},
	{
		"wards": [
			"Trà Cang",
			"Trà Don",
			"Trà Dơn",
			"Trà Leng",
			"Trà Linh",
			"Trà Mai",
			"Trà Nam",
			"Trà Tập",
			"Trà Vinh",
			"Trà Vân"
		],
		"district": "Nam Trà My"
	},
	{
		"wards": [
			"Bình Minh",
			"Hồng Quang",
			"Nam Cường",
			"Nam Dương",
			"Nam Giang",
			"Nam Hoa",
			"Nam Hùng",
			"Nam Hải",
			"Nam Hồng",
			"Nam Lợi",
			"Nam Thanh",
			"Nam Thái",
			"Nam Thắng",
			"Nam Tiến",
			"Nam Điền",
			"Nghĩa An",
			"Tân Thịnh",
			"Đồng Sơn"
		],
		"district": "Nam Trực"
	},
	{
		"wards": [
			"Cầu Diễn",
			"Mễ Trì",
			"Mỹ Đình 1",
			"Mỹ Đình 2",
			"Phú Đô",
			"Phương Canh",
			"Trung Văn",
			"Tây Mỗ",
			"Xuân Phương",
			"Đại Mỗ"
		],
		"district": "Nam Từ Liêm"
	},
	{
		"wards": [
			"Hùng Tiến",
			"Khánh Sơn",
			"Kim Liên",
			"Nam Anh",
			"Nam Cát",
			"Nam Giang",
			"Nam Hưng",
			"Nam Kim",
			"Nam Lĩnh",
			"Nam Thanh",
			"Nam Xuân",
			"Nam Đàn",
			"Nghĩa Thái",
			"Thượng Tân Lộc",
			"Trung Phúc Cường",
			"Xuân Hòa",
			"Xuân Hồng"
		],
		"district": "Nam Đàn"
	},
	{
		"wards": [
			"Cửa Bắc",
			"Cửa Nam",
			"Hưng Lộc",
			"Lộc Hòa",
			"Lộc Hạ",
			"Lộc Vượng",
			"Mỹ Hà",
			"Mỹ Lộc",
			"Mỹ Phúc",
			"Mỹ Thuận",
			"Mỹ Thắng",
			"Mỹ Trung",
			"Mỹ Tân",
			"Mỹ Xá",
			"Nam Phong",
			"Nam Vân",
			"Năng Tĩnh",
			"Quang Trung",
			"Trường Thi",
			"Trần Hưng Đạo",
			"Vị Xuyên"
		],
		"district": "Nam Định"
	},
	{
		"wards": [
			"Ba Đình",
			"Nga An",
			"Nga Giáp",
			"Nga Hiệp",
			"Nga Hải",
			"Nga Liên",
			"Nga Phú",
			"Nga Phượng",
			"Nga Sơn",
			"Nga Thanh",
			"Nga Thiện",
			"Nga Thành",
			"Nga Thái",
			"Nga Thạch",
			"Nga Thắng",
			"Nga Thủy",
			"Nga Tiến",
			"Nga Trường",
			"Nga Tân",
			"Nga Văn",
			"Nga Vịnh",
			"Nga Yên",
			"Nga Điền"
		],
		"district": "Nga Sơn"
	},
	{
		"wards": [
			"Diên Hoa",
			"Khánh Hợp",
			"Nghi Công Bắc",
			"Nghi Công Nam",
			"Nghi Hưng",
			"Nghi Kiều",
			"Nghi Long",
			"Nghi Lâm",
			"Nghi Mỹ",
			"Nghi Phương",
			"Nghi Quang",
			"Nghi Thiết",
			"Nghi Thuận",
			"Nghi Thạch",
			"Nghi Tiến",
			"Nghi Trung",
			"Nghi Văn",
			"Nghi Vạn",
			"Nghi Xá",
			"Nghi Yên",
			"Nghi Đồng",
			"Quán Hành",
			"Thịnh Trường"
		],
		"district": "Nghi Lộc"
	},
	{
		"wards": [
			"Anh Sơn",
			"Bình Minh",
			"Các Sơn",
			"Hải An",
			"Hải Bình",
			"Hải Châu",
			"Hải Hà",
			"Hải Hòa",
			"Hải Lĩnh",
			"Hải Nhân",
			"Hải Ninh",
			"Hải Thanh",
			"Hải Thượng",
			"Mai Lâm",
			"Nghi Sơn",
			"Nguyên Bình",
			"Ngọc Lĩnh",
			"Ninh Hải",
			"Phú Lâm",
			"Phú Sơn",
			"Thanh Sơn",
			"Thanh Thủy",
			"Trúc Lâm",
			"Trường Lâm",
			"Tân Dân",
			"Tân Trường",
			"Tùng Lâm",
			"Tĩnh Hải",
			"Xuân Lâm",
			"Định Hải"
		],
		"district": "Nghi Sơn"
	},
	{
		"wards": [
			"Cương Gián",
			"Cỗ Đạm",
			"Tiên Điền",
			"Xuân An",
			"Xuân Giang",
			"Xuân Hải",
			"Xuân Hồng",
			"Xuân Hội",
			"Xuân Lam",
			"Xuân Liên",
			"Xuân Lĩnh",
			"Xuân Mỹ",
			"Xuân Phổ",
			"Xuân Thành",
			"Xuân Viên",
			"Xuân Yên",
			"Đan Trường"
		],
		"district": "Nghi Xuân"
	},
	{
		"wards": [
			"Chợ Chùa",
			"Hành Dũng",
			"Hành Minh",
			"Hành Nhân",
			"Hành Phước",
			"Hành Thiện",
			"Hành Thuận",
			"Hành Thịnh",
			"Hành Trung",
			"Hành Tín Tây",
			"Hành Tín Đông",
			"Hành Đức"
		],
		"district": "Nghĩa Hành"
	},
	{
		"wards": [
			"Hoàng Nam",
			"Liễu Đề",
			"Nam Điền",
			"Nghĩa Châu",
			"Nghĩa Hùng",
			"Nghĩa Hải",
			"Nghĩa Hồng",
			"Nghĩa Lâm",
			"Nghĩa Lạc",
			"Nghĩa Lợi",
			"Nghĩa Phong",
			"Nghĩa Phú",
			"Nghĩa Sơn",
			"Nghĩa Thành",
			"Nghĩa Thái",
			"Nghĩa Trung",
			"Phúc Thắng",
			"Quỹ Nhất",
			"Rạng Đông",
			"Đồng Thịnh"
		],
		"district": "Nghĩa Hưng"
	},
	{
		"wards": [
			"Cầu Thia",
			"Hạnh Sơn",
			"Nghĩa An",
			"Nghĩa Lộ",
			"Nghĩa Lợi",
			"Nghĩa Phúc",
			"Phù Nham",
			"Phúc Sơn",
			"Pú Trạng",
			"Sơn A",
			"Thanh Lương",
			"Thạch Lương",
			"Trung Tâm",
			"Tân An"
		],
		"district": "Nghĩa Lộ"
	},
	{
		"wards": [
			"Nghĩa An",
			"Nghĩa Bình",
			"Nghĩa Hưng",
			"Nghĩa Hồng",
			"Nghĩa Hội",
			"Nghĩa Khánh",
			"Nghĩa Long",
			"Nghĩa Lâm",
			"Nghĩa Lạc",
			"Nghĩa Lộc",
			"Nghĩa Lợi",
			"Nghĩa Mai",
			"Nghĩa Minh",
			"Nghĩa Sơn",
			"Nghĩa Thành",
			"Nghĩa Thọ",
			"Nghĩa Trung",
			"Nghĩa Yên",
			"Nghĩa Đàn",
			"Nghĩa Đức"
		],
		"district": "Nghĩa Đàn"
	},
	{
		"wards": [
			"Ca Thành",
			"Hoa Thám",
			"Hưng Đạo",
			"Mai Long",
			"Minh Tâm",
			"Nguyên Bình",
			"Phan Thanh",
			"Quang Thành",
			"Tam Kim",
			"Thành Công",
			"Thể Dục",
			"Thịnh Vượng",
			"Triệu Nguyên",
			"Tĩnh Túc",
			"Vũ Minh",
			"Vũ Nông",
			"Yên Lạc"
		],
		"district": "Nguyên Bình"
	},
	{
		"wards": [
			"Bằng Vân",
			"Cốc Đán",
			"Hiệp Lực",
			"Nà Phặc",
			"Thuần Mang",
			"Thượng Quan",
			"Thượng Ân",
			"Trung Hoà",
			"Vân Tùng",
			"Đức Vân"
		],
		"district": "Ngân Sơn"
	},
	{
		"wards": [
			"Hiệp Lợi",
			"Hiệp Thành",
			"Lái Hiếu",
			"Ngã Bảy",
			"Tân Thành",
			"Đại Thành"
		],
		"district": "Ngã Bảy"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"Long Bình",
			"Mỹ Bình",
			"Mỹ Quới",
			"Tân Long",
			"Vĩnh Quới"
		],
		"district": "Ngã Năm"
	},
	{
		"wards": [
			"Cầu Tre",
			"Cầu Đất",
			"Gia Viên",
			"Lạch Tray",
			"Máy Chai",
			"Vạn Mỹ",
			"Đông Khê",
			"Đằng Giang"
		],
		"district": "Ngô Quyền"
	},
	{
		"wards": [
			"Hoà Hải",
			"Hoà Quý",
			"Khuê Mỹ",
			"Mỹ An"
		],
		"district": "Ngũ Hành Sơn"
	},
	{
		"wards": [
			"Rạch Gốc",
			"Tam Giang Tây",
			"Tân Ân",
			"Tân Ân Tây",
			"Viên An",
			"Viên An Đông",
			"Đất Mũi"
		],
		"district": "Ngọc Hiển"
	},
	{
		"wards": [
			"Bờ Y",
			"Plei Kần",
			"Sa Loong",
			"Đắk Ang",
			"Đắk Dục",
			"Đắk Kan",
			"Đắk Nông",
			"Đắk Xú"
		],
		"district": "Ngọc Hồi"
	},
	{
		"wards": [
			"Cao Ngọc",
			"Cao Thịnh",
			"Kiên Thọ",
			"Lam Sơn",
			"Lộc Thịnh",
			"Minh Sơn",
			"Minh Tiến",
			"Mỹ Tân",
			"Nguyệt Ấn",
			"Ngọc Liên",
			"Ngọc Lặc",
			"Ngọc Sơn",
			"Ngọc Trung",
			"Phùng Giáo",
			"Phùng Minh",
			"Phúc Thịnh",
			"Quang Trung",
			"Thúy Sơn",
			"Thạch Lập",
			"Vân Âm",
			"Đồng Thịnh"
		],
		"district": "Ngọc Lặc"
	},
	{
		"wards": [
			"Lộc Thọ",
			"Ngọc Hiệp",
			"Phương Sài",
			"Phước Hòa",
			"Phước Hải",
			"Phước Long",
			"Phước Đồng",
			"Tân Tiến",
			"Vĩnh Hiệp",
			"Vĩnh Hòa",
			"Vĩnh Hải",
			"Vĩnh Lương",
			"Vĩnh Nguyên",
			"Vĩnh Ngọc",
			"Vĩnh Phương",
			"Vĩnh Phước",
			"Vĩnh Thái",
			"Vĩnh Thạnh",
			"Vĩnh Thọ",
			"Vĩnh Trung",
			"Vĩnh Trường",
			"Vạn Thạnh"
		],
		"district": "Nha Trang"
	},
	{
		"wards": [
			"Cúc Phương",
			"Gia Lâm",
			"Gia Sơn",
			"Gia Thủy",
			"Gia Tường",
			"Kỳ Phú",
			"Lạc Vân",
			"Nho Quan",
			"Phú Long",
			"Phú Lộc",
			"Phú Sơn",
			"Phúc Sơn",
			"Quảng Lạc",
			"Quỳnh Lưu",
			"Thanh Sơn",
			"Thượng Hòa",
			"Thạch Bình",
			"Văn Phú",
			"Văn Phương",
			"Xích Thổ",
			"Yên Quang",
			"Đồng Phong",
			"Đức Long"
		],
		"district": "Nho Quan"
	},
	{
		"wards": [
			"Hiệp Phước",
			"Long Thới",
			"Nhà Bè",
			"Nhơn Đức",
			"Phú Xuân",
			"Phước Kiển",
			"Phước Lộc"
		],
		"district": "Nhà Bè"
	},
	{
		"wards": [
			"Hiệp Phước",
			"Long Thọ",
			"Long Tân",
			"Phú Hội",
			"Phú Hữu",
			"Phú Thạnh",
			"Phú Đông",
			"Phước An",
			"Phước Khánh",
			"Phước Thiền",
			"Vĩnh Thanh",
			"Đại Phước"
		],
		"district": "Nhơn Trạch"
	},
	{
		"wards": [
			"Bến Sung",
			"Cán Khê",
			"Hải Long",
			"Mậu Lâm",
			"Phú Nhuận",
			"Phượng Nghi",
			"Thanh Kỳ",
			"Thanh Tân",
			"Xuân Du",
			"Xuân Khang",
			"Xuân Phúc",
			"Xuân Thái",
			"Yên Lạc",
			"Yên Thọ"
		],
		"district": "Như Thanh"
	},
	{
		"wards": [
			"Bãi Trành",
			"Bình Lương",
			"Cát Tân",
			"Cát Vân",
			"Hóa Quỳ",
			"Thanh Hòa",
			"Thanh Lâm",
			"Thanh Phong",
			"Thanh Quân",
			"Thanh Sơn",
			"Thanh Xuân",
			"Thượng Ninh",
			"Tân Bình",
			"Xuân Bình",
			"Xuân Hòa",
			"Yên Cát"
		],
		"district": "Như Xuân"
	},
	{
		"wards": [
			"An Đức",
			"Bình Xuyên",
			"Hiệp Lực",
			"Hưng Long",
			"Hồng Dụ",
			"Hồng Phong",
			"Kiến Phúc",
			"Nghĩa An",
			"Ninh Giang",
			"Tân Hương",
			"Tân Phong",
			"Tân Quang",
			"Văn Hội",
			"Vĩnh Hòa",
			"Đức Phúc",
			"Ứng Hoè"
		],
		"district": "Ninh Giang"
	},
	{
		"wards": [
			"Ninh An",
			"Ninh Bình",
			"Ninh Diêm",
			"Ninh Giang",
			"Ninh Hiệp",
			"Ninh Hà",
			"Ninh Hưng",
			"Ninh Hải",
			"Ninh Lộc",
			"Ninh Phú",
			"Ninh Phước",
			"Ninh Phụng",
			"Ninh Quang",
			"Ninh Sim",
			"Ninh Sơn",
			"Ninh Thân",
			"Ninh Thượng",
			"Ninh Thọ",
			"Ninh Thủy",
			"Ninh Trung",
			"Ninh Tân",
			"Ninh Tây",
			"Ninh Xuân",
			"Ninh Ích",
			"Ninh Đa",
			"Ninh Đông"
		],
		"district": "Ninh Hòa"
	},
	{
		"wards": [
			"Hộ Hải",
			"Khánh Hải",
			"Nhơn Hải",
			"Phương Hải",
			"Thanh Hải",
			"Tri Hải",
			"Tân Hải",
			"Vĩnh Hải",
			"Xuân Hải"
		],
		"district": "Ninh Hải"
	},
	{
		"wards": [
			"An Bình",
			"An Hòa",
			"An Khánh",
			"Cái Khế",
			"Hưng Lợi",
			"Thới Bình",
			"Tân An",
			"Xuân Khánh"
		],
		"district": "Ninh Kiều"
	},
	{
		"wards": [
			"An Hải",
			"Phước Dân",
			"Phước Hải",
			"Phước Hậu",
			"Phước Hữu",
			"Phước Sơn",
			"Phước Thuận",
			"Phước Thái",
			"Phước Vinh"
		],
		"district": "Ninh Phước"
	},
	{
		"wards": [
			"Hòa Sơn",
			"Lâm Sơn",
			"Lương Sơn",
			"Ma Nới",
			"Mỹ Sơn",
			"Nhơn Sơn",
			"Quảng Sơn",
			"Tân Sơn"
		],
		"district": "Ninh Sơn"
	},
	{
		"wards": [
			"Công Chính",
			"Công Liêm",
			"Hoàng Giang",
			"Hoàng Sơn",
			"Minh Khôi",
			"Minh Nghĩa",
			"Nông Cống",
			"Thăng Bình",
			"Thăng Long",
			"Thăng Thọ",
			"Trung Chính",
			"Trung Thành",
			"Trường Giang",
			"Trường Minh",
			"Trường Sơn",
			"Trường Trung",
			"Tân Khang",
			"Tân Phúc",
			"Tân Thọ",
			"Tượng Lĩnh",
			"Tượng Sơn",
			"Tượng Văn",
			"Tế Lợi",
			"Tế Nông",
			"Tế Thắng",
			"Vạn Hòa",
			"Vạn Thiện",
			"Vạn Thắng",
			"Yên Mỹ"
		],
		"district": "Nông Cống"
	},
	{
		"wards": [
			"Núi Thành",
			"Tam Anh Bắc",
			"Tam Anh Nam",
			"Tam Giang",
			"Tam Hiệp",
			"Tam Hòa",
			"Tam Hải",
			"Tam Mỹ Tây",
			"Tam Mỹ Đông",
			"Tam Nghĩa",
			"Tam Quang",
			"Tam Sơn",
			"Tam Thạnh",
			"Tam Tiến",
			"Tam Trà",
			"Tam Xuân I",
			"Tam Xuân II"
		],
		"district": "Núi Thành"
	},
	{
		"wards": [
			"Hiệp Tùng",
			"Hàm Rồng",
			"Hàng Vịnh",
			"Lâm Hải",
			"Năm Căn",
			"Tam Giang",
			"Tam Giang Đông",
			"Đất Mới"
		],
		"district": "Năm Căn"
	},
	{
		"wards": [
			"Hua Bun",
			"Lê Lợi",
			"Mường Mô",
			"Nậm Ban",
			"Nậm Chà",
			"Nậm Hàng",
			"Nậm Manh",
			"Nậm Nhùn",
			"Nậm Pì",
			"Pú Đao",
			"Trung Chải"
		],
		"district": "Nậm Nhùn"
	},
	{
		"wards": [
			"Chà Cang",
			"Chà Nưa",
			"Chà Tở",
			"Na Cô Sa",
			"Nà Bủng",
			"Nà Hỳ",
			"Nà Khoa",
			"Nậm Chua",
			"Nậm Khăn",
			"Nậm Nhừ",
			"Nậm Tin",
			"Pa Tần",
			"Phìn Hồ",
			"Si Pa Phìn",
			"Vàng Đán"
		],
		"district": "Nậm Pồ"
	},
	{
		"wards": [
			"Bảo An",
			"Kinh Dinh",
			"Mỹ Bình",
			"Mỹ Hải",
			"Mỹ Đông",
			"Phước Mỹ",
			"Phủ Hà",
			"Thành Hải",
			"Văn Hải",
			"Đài Sơn",
			"Đô Vinh",
			"Đông Hải",
			"Đạo Long"
		],
		"district": "Phan Rang-Tháp Chàm"
	},
	{
		"wards": [
			"Bình Hưng",
			"Hàm Tiến",
			"Lạc Đạo",
			"Mũi Né",
			"Phong Nẫm",
			"Phú Hài",
			"Phú Thủy",
			"Phú Trinh",
			"Phú Tài",
			"Thanh Hải",
			"Thiện Nghiệp",
			"Tiến Lợi",
			"Tiến Thành",
			"Xuân An",
			"Đức Long"
		],
		"district": "Phan Thiết"
	},
	{
		"wards": [
			"Bản Lang",
			"Dào San",
			"Hoang Thèn",
			"Huổi Luông",
			"Khổng Lào",
			"Lả Nhì Thàng",
			"Ma Ly Pho",
			"Mù Sang",
			"Mường So",
			"Mồ Sì San",
			"Nậm Xe",
			"Pa Vây Sử",
			"Phong Thổ",
			"Sin Suối Hồ",
			"Sì Lở Lầu",
			"Tông Qua Lìn",
			"Vàng Ma Chải"
		],
		"district": "Phong Thổ"
	},
	{
		"wards": [
			"Giai Xuân",
			"Mỹ Khánh",
			"Nhơn Nghĩa",
			"Nhơn Ái",
			"Phong An",
			"Phong Bình",
			"Phong Chương",
			"Phong Hiền",
			"Phong Hòa",
			"Phong Hải",
			"Phong Mỹ",
			"Phong Phú",
			"Phong Sơn",
			"Phong Thu",
			"Phong Thạnh",
			"Phong Xuân",
			"Phong Điền",
			"Trường Long",
			"Tân Thới"
		],
		"district": "Phong Điền"
	},
	{
		"wards": [
			"Cát Chánh",
			"Cát Hanh",
			"Cát Hiệp",
			"Cát Hưng",
			"Cát Hải",
			"Cát Khánh",
			"Cát Lâm",
			"Cát Minh",
			"Cát Nhơn",
			"Cát Sơn",
			"Cát Thành",
			"Cát Thắng",
			"Cát Tiến",
			"Cát Trinh",
			"Cát Tài",
			"Cát Tân",
			"Cát Tường",
			"Ngô Mây"
		],
		"district": "Phù Cát"
	},
	{
		"wards": [
			"Minh Hoàng",
			"Minh Tân",
			"Nguyên Hòa",
			"Nhật Quang",
			"Phan Sào Nam",
			"Quang Hưng",
			"Tam Đa",
			"Tiên Tiến",
			"Trần Cao",
			"Tống Phan",
			"Tống Trân",
			"Đoàn Đào",
			"Đình Cao"
		],
		"district": "Phù Cừ"
	},
	{
		"wards": [
			"Bình Dương",
			"Mỹ An",
			"Mỹ Chánh",
			"Mỹ Chánh Tây",
			"Mỹ Châu",
			"Mỹ Cát",
			"Mỹ Hiệp",
			"Mỹ Hòa",
			"Mỹ Lộc",
			"Mỹ Lợi",
			"Mỹ Phong",
			"Mỹ Quang",
			"Mỹ Thành",
			"Mỹ Thắng",
			"Mỹ Thọ",
			"Mỹ Trinh",
			"Mỹ Tài",
			"Mỹ Đức",
			"Phù Mỹ"
		],
		"district": "Phù Mỹ"
	},
	{
		"wards": [
			"An Đạo",
			"Bình Phú",
			"Bảo Thanh",
			"Gia Thanh",
			"Hạ Giáp",
			"Liên Hoa",
			"Lệ Mỹ",
			"Phong Châu",
			"Phù Ninh",
			"Phú Lộc",
			"Phú Mỹ",
			"Phú Nham",
			"Tiên Du",
			"Tiên Phú",
			"Trung Giáp",
			"Trạm Thản",
			"Trị Quận"
		],
		"district": "Phù Ninh"
	},
	{
		"wards": [
			"Bắc Phong",
			"Gia Phù",
			"Huy Hạ",
			"Huy Thượng",
			"Huy Tân",
			"Huy Tường",
			"Kim Bon",
			"Mường Bang",
			"Mường Cơi",
			"Mường Do",
			"Mường Lang",
			"Mường Thải",
			"Nam Phong",
			"Quang Huy",
			"Suối Bau",
			"Suối Tọ",
			"Sập Xa",
			"Tân Lang",
			"Tân Phong",
			"Tường Hạ",
			"Tường Phong",
			"Tường Phù",
			"Tường Thượng",
			"Tường Tiến",
			"Đá Đỏ"
		],
		"district": "Phù Yên"
	},
	{
		"wards": [
			"Bàn Đạt",
			"Bảo Lý",
			"Dương Thành",
			"Hà Châu",
			"Hương Sơn",
			"Kha Sơn",
			"Lương Phú",
			"Nga My",
			"Nhã Lộng",
			"Thanh Ninh",
			"Thượng Đình",
			"Tân Hòa",
			"Tân Khánh",
			"Tân Kim",
			"Tân Thành",
			"Tân Đức",
			"Xuân Phương",
			"Úc Kỳ",
			"Điềm Thụy",
			"Đào Xá"
		],
		"district": "Phú Bình"
	},
	{
		"wards": [
			"An Bình",
			"An Linh",
			"An Long",
			"An Thái",
			"Phước Hoà",
			"Phước Sang",
			"Phước Vĩnh",
			"Tam Lập",
			"Tân Hiệp",
			"Tân Long",
			"Vĩnh Hoà"
		],
		"district": "Phú Giáo"
	},
	{
		"wards": [
			"Hòa An",
			"Hòa Hội",
			"Hòa Quang Bắc",
			"Hòa Quang Nam",
			"Hòa Thắng",
			"Hòa Trị",
			"Hòa Định Tây",
			"Hòa Định Đông",
			"Phú Hoà"
		],
		"district": "Phú Hoà"
	},
	{
		"wards": [
			"Cổ Lũng",
			"Giang Tiên",
			"Hợp Thành",
			"Phú Đô",
			"Phủ Lý",
			"Tức Tranh",
			"Vô Tranh",
			"Yên Lạc",
			"Yên Ninh",
			"Yên Trạch",
			"Yên Đổ",
			"Ôn Lương",
			"Đu",
			"Động Đạt"
		],
		"district": "Phú Lương"
	},
	{
		"wards": [
			"Giang Hải",
			"Hương Hữu",
			"Hương Lộc",
			"Hương Phú",
			"Hương Sơn",
			"Hương Xuân",
			"Khe Tre",
			"Lăng Cô",
			"Lộc An",
			"Lộc Bình",
			"Lộc Bổn",
			"Lộc Hòa",
			"Lộc Sơn",
			"Lộc Thủy",
			"Lộc Tiến",
			"Lộc Trì",
			"Lộc Vĩnh",
			"Lộc Điền",
			"Phú Lộc",
			"Thượng Long",
			"Thượng Lộ",
			"Thượng Nhật",
			"Thượng Quảng",
			"Vinh Hiền",
			"Vinh Hưng",
			"Vinh Mỹ",
			"Xuân Lộc"
		],
		"district": "Phú Lộc"
	},
	{
		"wards": [
			"Châu Pha",
			"Hắc Dịch",
			"Mỹ Xuân",
			"Phú Mỹ",
			"Phước Hoà",
			"Sông Xoài",
			"Tân Hoà",
			"Tân Hải",
			"Tân Phước",
			"Tóc Tiên"
		],
		"district": "Phú Mỹ"
	},
	{
		"wards": [
			"1",
			"10",
			"11",
			"13",
			"15",
			"2",
			"4",
			"5",
			"7",
			"8",
			"9"
		],
		"district": "Phú Nhuận"
	},
	{
		"wards": [
			"Phú Thịnh",
			"Tam An",
			"Tam Dân",
			"Tam Lãnh",
			"Tam Lộc",
			"Tam Phước",
			"Tam Thành",
			"Tam Thái",
			"Tam Đàn",
			"Tam Đại"
		],
		"district": "Phú Ninh"
	},
	{
		"wards": [
			"Long Hải",
			"Ngũ Phụng",
			"Tam Thanh"
		],
		"district": "Phú Quí"
	},
	{
		"wards": [
			"An Thới",
			"Bãi Thơm",
			"Cửa Cạn",
			"Cửa Dương",
			"Dương Tơ",
			"Dương Đông",
			"Gành Dầu",
			"Hàm Ninh",
			"Thổ Châu"
		],
		"district": "Phú Quốc"
	},
	{
		"wards": [
			"Bình Sơn",
			"Bình Tân",
			"Bù Nho",
			"Long Bình",
			"Long Hà",
			"Long Hưng",
			"Long Tân",
			"Phú Riềng",
			"Phú Trung",
			"Phước Tân"
		],
		"district": "Phú Riềng"
	},
	{
		"wards": [
			"Ayun Hạ",
			"Chrôh Pơnan",
			"Chư A Thai",
			"Ia Ake",
			"Ia Hiao",
			"Ia Peng",
			"Ia Piar",
			"Ia Sol",
			"Ia Yeng",
			"Phú Thiện"
		],
		"district": "Phú Thiện"
	},
	{
		"wards": [
			"Hà Lộc",
			"Hà Thạch",
			"Hùng Vương",
			"Phong Châu",
			"Phú Hộ",
			"Thanh Minh",
			"Thanh Vinh",
			"Văn Lung",
			"Âu Cơ"
		],
		"district": "Phú Thọ"
	},
	{
		"wards": [
			"Bình Thạnh Đông",
			"Chợ Vàm",
			"Cái Đôi Vàm",
			"Hiệp Xương",
			"Hoà Lạc",
			"Long Hoà",
			"Nguyễn Việt Khái",
			"Phú An",
			"Phú Bình",
			"Phú Hiệp",
			"Phú Hưng",
			"Phú Long",
			"Phú Lâm",
			"Phú Mỹ",
			"Phú Mỹ",
			"Phú Thuận",
			"Phú Thành",
			"Phú Thạnh",
			"Phú Thọ",
			"Phú Tân",
			"Phú Xuân",
			"Rạch Chèo",
			"Tân Hòa",
			"Tân Hưng Tây",
			"Tân Hải",
			"Tân Trung",
			"Việt Thắng"
		],
		"district": "Phú Tân"
	},
	{
		"wards": [
			"Phú An",
			"Phú Diên",
			"Phú Gia",
			"Phú Hải",
			"Phú Hồ",
			"Phú Lương",
			"Phú Mỹ",
			"Phú Thuận",
			"Phú Xuân",
			"Phú Đa",
			"Vinh An",
			"Vinh Hà",
			"Vinh Thanh",
			"Vinh Xuân"
		],
		"district": "Phú Vang"
	},
	{
		"wards": [
			"Bạch Hạ",
			"Chuyên Mỹ",
			"Châu Can",
			"Hoàng Long",
			"Hồng Minh",
			"Hồng Thái",
			"Khai Thái",
			"Minh Tân",
			"Nam Phong",
			"Nam Tiến",
			"Phú Minh",
			"Phú Túc",
			"Phú Xuyên",
			"Phú Yên",
			"Phúc Tiến",
			"Phượng Dực",
			"Quang Hà",
			"Quang Lãng",
			"Tri Thủy",
			"Tân Dân",
			"Vân Từ",
			"Văn Hoàng",
			"Đại Xuyên"
		],
		"district": "Phú Xuyên"
	},
	{
		"wards": [
			"An Hòa",
			"Gia Hội",
			"Hương An",
			"Hương Long",
			"Hương Sơ",
			"Hương Vinh",
			"Kim Long",
			"Long Hồ",
			"Phú Hậu",
			"Thuận Hòa",
			"Thuận Lộc",
			"Tây Lộc",
			"Đông Ba"
		],
		"district": "Phú Xuân"
	},
	{
		"wards": [
			"Hiệp Thuận",
			"Hát Môn",
			"Liên Hiệp",
			"Long Thượng",
			"Nam Hà",
			"Ngọc Tảo",
			"Phúc Hòa",
			"Phúc Thọ",
			"Phụng Thượng",
			"Sen Phương",
			"Tam Hiệp",
			"Tam Thuấn",
			"Thanh Đa",
			"Trạch Mỹ Lộc",
			"Tích Lộc",
			"Vân Phúc",
			"Võng Xuyên",
			"Xuân Đình"
		],
		"district": "Phúc Thọ"
	},
	{
		"wards": [
			"Cao Minh",
			"Hai Bà Trưng",
			"Hùng Vương",
			"Nam Viêm",
			"Ngọc Thanh",
			"Phúc Thắng",
			"Tiền Châu",
			"Xuân Hoà",
			"Đồng Xuân"
		],
		"district": "Phúc Yên"
	},
	{
		"wards": [
			"Hưng Phú",
			"Long Giang",
			"Long Phước",
			"Long Thủy",
			"Phong Thạnh Tây A",
			"Phong Thạnh Tây B",
			"Phước Bình",
			"Phước Long",
			"Phước Long",
			"Phước Tín",
			"Sơn Giang",
			"Thác Mơ",
			"Vĩnh Phú Tây",
			"Vĩnh Phú Đông",
			"Vĩnh Thanh"
		],
		"district": "Phước Long"
	},
	{
		"wards": [
			"Khâm Đức",
			"Phước Chánh",
			"Phước Công",
			"Phước Hiệp",
			"Phước Hoà",
			"Phước Kim",
			"Phước Lộc",
			"Phước Mỹ",
			"Phước Năng",
			"Phước Thành",
			"Phước Xuân",
			"Phước Đức"
		],
		"district": "Phước Sơn"
	},
	{
		"wards": [
			"Ba Hàng",
			"Bãi Bông",
			"Bắc Sơn",
			"Hồng Tiến",
			"Minh Đức",
			"Nam Tiến",
			"Phúc Thuận",
			"Phúc Tân",
			"Thuận Thành",
			"Thành Công",
			"Tiên Phong",
			"Trung Thành",
			"Tân Hương",
			"Tân Phú",
			"Vạn Phái",
			"Đông Cao",
			"Đắc Sơn",
			"Đồng Tiến"
		],
		"district": "Phổ Yên"
	},
	{
		"wards": [
			"Bình Thành",
			"Búng Tàu",
			"Cây Dương",
			"Hiệp Hưng",
			"Hòa An",
			"Hòa Mỹ",
			"Kinh Cùng",
			"Long Thạnh",
			"Phương Bình",
			"Phương Phú",
			"Phụng Hiệp",
			"Thạnh Hòa",
			"Tân Bình",
			"Tân Long",
			"Tân Phước Hưng"
		],
		"district": "Phụng Hiệp"
	},
	{
		"wards": [
			"Châu Cầu",
			"Châu Sơn",
			"Kim Bình",
			"Lam Hạ",
			"Liêm Chính",
			"Lê Hồng Phong",
			"Phù Vân",
			"Quang Trung",
			"Thanh Châu",
			"Thanh Tuyền",
			"Trịnh Xá",
			"Tân Hiệp",
			"Tân Liêm",
			"Đinh Xá"
		],
		"district": "Phủ Lý"
	},
	{
		"wards": [
			"An Phú",
			"Biển Hồ",
			"Chi Lăng",
			"Chư Á",
			"Diên Hồng",
			"Diên Phú",
			"Gào",
			"Hoa Lư",
			"Hội Phú",
			"Hội Thương",
			"Ia Kring",
			"Ia Kênh",
			"Phù Đổng",
			"Thắng Lợi",
			"Thống Nhất",
			"Trà Bá",
			"Trà Đa",
			"Tây Sơn",
			"Yên Thế",
			"Yên Đỗ",
			"Đống Đa"
		],
		"district": "Pleiku"
	},
	{
		"wards": [
			"An Thắng",
			"Bằng Thành",
			"Bộc Bố",
			"Cao Tân",
			"Công Bằng",
			"Cổ Linh",
			"Giáo Hiệu",
			"Nghiên Loan",
			"Nhạn Môn",
			"Xuân La"
		],
		"district": "Pác Nặm"
	},
	{
		"wards": [
			"Hiền Chung",
			"Hiền Kiệt",
			"Hồi Xuân",
			"Nam Tiến",
			"Nam Xuân",
			"Nam Động",
			"Phú Lệ",
			"Phú Nghiêm",
			"Phú Sơn",
			"Phú Thanh",
			"Phú Xuân",
			"Thiên Phủ",
			"Thành Sơn",
			"Trung Sơn",
			"Trung Thành"
		],
		"district": "Quan Hóa"
	},
	{
		"wards": [
			"Mường Mìn",
			"Na Mèo",
			"Sơn Hà",
			"Sơn Lư",
			"Sơn Thủy",
			"Sơn Điện",
			"Tam Lư",
			"Tam Thanh",
			"Trung Hạ",
			"Trung Thượng",
			"Trung Tiến",
			"Trung Xuân"
		],
		"district": "Quan Sơn"
	},
	{
		"wards": [
			"Bản Rịa",
			"Bằng Lang",
			"Hương Sơn",
			"Nà Khương",
			"Tiên Nguyên",
			"Tiên Yên",
			"Tân Bắc",
			"Tân Nam",
			"Tân Trịnh",
			"Vĩ Thượng",
			"Xuân Giang",
			"Xuân Minh",
			"Yên Bình",
			"Yên Hà",
			"Yên Thành"
		],
		"district": "Quang Bình"
	},
	{
		"wards": [
			"Bùi Thị Xuân",
			"Ghềnh Ráng",
			"Hải Cảng",
			"Nguyễn Văn Cừ",
			"Ngô Mây",
			"Nhơn Bình",
			"Nhơn Châu",
			"Nhơn Hải",
			"Nhơn Hội",
			"Nhơn Lý",
			"Nhơn Phú",
			"Phước Mỹ",
			"Quang Trung",
			"Thị Nại",
			"Trần Phú",
			"Trần Quang Diệu",
			"Đống Đa"
		],
		"district": "Quy Nhơn"
	},
	{
		"wards": [
			"Bát Đại Sơn",
			"Cao Mã Pờ",
			"Cán Tỷ",
			"Lùng Tám",
			"Nghĩa Thuận",
			"Quyết Tiến",
			"Quản Bạ",
			"Tam Sơn",
			"Thanh Vân",
			"Thái An",
			"Tùng Vài",
			"Tả Ván",
			"Đông Hà"
		],
		"district": "Quản Bạ"
	},
	{
		"wards": [
			"Bế Văn Đàn",
			"Cai Bộ",
			"Chí Thảo",
			"Cách Linh",
			"Hoà Thuận",
			"Hạnh Phúc",
			"Hồng Quang",
			"Mỹ Hưng",
			"Ngọc Động",
			"Phi Hải",
			"Phúc Sen",
			"Quảng Hưng",
			"Quảng Uyên",
			"Quốc Toản",
			"Tiên Thành",
			"Tà Lùng",
			"Tự Do",
			"Đại Sơn",
			"Độc Lập"
		],
		"district": "Quảng Hòa"
	},
	{
		"wards": [
			"An Phú",
			"Chánh Lộ",
			"Lê Hồng Phong",
			"Nghĩa Chánh",
			"Nghĩa Dõng",
			"Nghĩa Dũng",
			"Nghĩa Hà",
			"Nghĩa Lộ",
			"Nguyễn Nghiêm",
			"Quảng Phú",
			"Trương Quang Trọng",
			"Trần Hưng Đạo",
			"Trần Phú",
			"Tịnh An",
			"Tịnh Châu",
			"Tịnh Hòa",
			"Tịnh Khê",
			"Tịnh Kỳ",
			"Tịnh Long",
			"Tịnh Thiện",
			"Tịnh Ấn Tây",
			"Tịnh Ấn Đông"
		],
		"district": "Quảng Ngãi"
	},
	{
		"wards": [
			"An Ninh",
			"Duy Ninh",
			"Gia Ninh",
			"Hiền Ninh",
			"Hàm Ninh",
			"Hải Ninh",
			"Quán Hàu",
			"Trường Sơn",
			"Trường Xuân",
			"Tân Ninh",
			"Võ Ninh",
			"Vĩnh Ninh",
			"Vạn Ninh",
			"Xuân Ninh"
		],
		"district": "Quảng Ninh"
	},
	{
		"wards": [
			"Cảnh Dương",
			"Liên Trường",
			"Phù Cảnh",
			"Quảng Châu",
			"Quảng Hưng",
			"Quảng Hợp",
			"Quảng Kim",
			"Quảng Lưu",
			"Quảng Phú",
			"Quảng Phương",
			"Quảng Thanh",
			"Quảng Thạch",
			"Quảng Tiến",
			"Quảng Tùng",
			"Quảng Xuân",
			"Quảng Đông"
		],
		"district": "Quảng Trạch"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"An Đôn",
			"Hải Lệ"
		],
		"district": "Quảng Trị"
	},
	{
		"wards": [
			"Quảng Bình",
			"Quảng Chính",
			"Quảng Giao",
			"Quảng Hòa",
			"Quảng Hải",
			"Quảng Hợp",
			"Quảng Khê",
			"Quảng Long",
			"Quảng Lưu",
			"Quảng Lộc",
			"Quảng Ngọc",
			"Quảng Nham",
			"Quảng Nhân",
			"Quảng Ninh",
			"Quảng Phúc",
			"Quảng Thái",
			"Quảng Thạch",
			"Quảng Trung",
			"Quảng Trường",
			"Quảng Trạch",
			"Quảng Văn",
			"Quảng Yên",
			"Quảng Định",
			"Quảng Đức",
			"Tiên Trang",
			"Tân Phong"
		],
		"district": "Quảng Xương"
	},
	{
		"wards": [
			"Cẩm La",
			"Cộng Hòa",
			"Hiệp Hòa",
			"Hoàng Tân",
			"Hà An",
			"Liên Hòa",
			"Liên Vị",
			"Minh Thành",
			"Nam Hoà",
			"Phong Cốc",
			"Phong Hải",
			"Quảng Yên",
			"Sông Khoai",
			"Tiền An",
			"Tiền Phong",
			"Tân An",
			"Yên Giang",
			"Yên Hải",
			"Đông Mai"
		],
		"district": "Quảng Yên"
	},
	{
		"wards": [
			"Quảng An",
			"Quảng Công",
			"Quảng Lợi",
			"Quảng Ngạn",
			"Quảng Phú",
			"Quảng Phước",
			"Quảng Thành",
			"Quảng Thái",
			"Quảng Thọ",
			"Quảng Vinh",
			"Sịa"
		],
		"district": "Quảng Điền"
	},
	{
		"wards": [
			"Châu Kim",
			"Châu Thôn",
			"Căm Muộn",
			"Hạnh Dịch",
			"Kim Sơn",
			"Mường Nọc",
			"Nậm Giải",
			"Nậm Nhoóng",
			"Quang Phong",
			"Thông Thụ",
			"Tiền Phong",
			"Tri Lễ",
			"Đồng Văn"
		],
		"district": "Quế Phong"
	},
	{
		"wards": [
			"Hương An",
			"Ninh Phước",
			"Phước Ninh",
			"Quế An",
			"Quế Châu",
			"Quế Hiệp",
			"Quế Long",
			"Quế Lâm",
			"Quế Lộc",
			"Quế Minh",
			"Quế Mỹ",
			"Quế Phong",
			"Quế Phú",
			"Quế Thuận",
			"Quế Xuân 1",
			"Quế Xuân 2",
			"Trung Phước",
			"Đông Phú"
		],
		"district": "Quế Sơn"
	},
	{
		"wards": [
			"Bằng An",
			"Bồng Lai",
			"Chi Lăng",
			"Châu Phong",
			"Cách Bi",
			"Mộ Đạo",
			"Ngọc Xá",
			"Nhân Hòa",
			"Phù Lãng",
			"Phù Lương",
			"Phương Liễu",
			"Phượng Mao",
			"Phố Mới",
			"Quế Tân",
			"Việt Hùng",
			"Việt Thống",
			"Yên Giả",
			"Đào Viên",
			"Đại Xuân",
			"Đức Long"
		],
		"district": "Quế Võ"
	},
	{
		"wards": [
			"Cấn Hữu",
			"Cộng Hòa",
			"Hòa Thạch",
			"Hưng Đạo",
			"Liệp Nghĩa",
			"Ngọc Liệp",
			"Ngọc Mỹ",
			"Phú Cát",
			"Phú Mãn",
			"Phượng Sơn",
			"Quốc Oai",
			"Sài Sơn",
			"Thạch Thán",
			"Tuyết Nghĩa",
			"Đông Xuân",
			"Đông Yên",
			"Đồng Quang"
		],
		"district": "Quốc Oai"
	},
	{
		"wards": [
			"Châu Bình",
			"Châu Bính",
			"Châu Hoàn",
			"Châu Hạnh",
			"Châu Hội",
			"Châu Nga",
			"Châu Phong",
			"Châu Thuận",
			"Châu Thắng",
			"Châu Tiến",
			"Diên Lãm",
			"Tân Lạc"
		],
		"district": "Quỳ Châu"
	},
	{
		"wards": [
			"Bắc Sơn",
			"Châu Cường",
			"Châu Hồng",
			"Châu Lý",
			"Châu Lộc",
			"Châu Quang",
			"Châu Thành",
			"Châu Thái",
			"Châu Tiến",
			"Châu Đình",
			"Hạ Sơn",
			"Liên Hợp",
			"Minh Hợp",
			"Nam Sơn",
			"Nghĩa Xuân",
			"Quỳ Hợp",
			"Tam Hợp",
			"Thọ Hợp",
			"Văn Lợi",
			"Yên Hợp",
			"Đồng Hợp"
		],
		"district": "Quỳ Hợp"
	},
	{
		"wards": [
			"An Hòa",
			"Bình Sơn",
			"Cầu Giát",
			"Minh Lương",
			"Ngọc Sơn",
			"Phú Nghĩa",
			"Quỳnh Bảng",
			"Quỳnh Châu",
			"Quỳnh Diễn",
			"Quỳnh Giang",
			"Quỳnh Hậu",
			"Quỳnh Lâm",
			"Quỳnh Sơn",
			"Quỳnh Tam",
			"Quỳnh Thanh",
			"Quỳnh Thạch",
			"Quỳnh Thắng",
			"Quỳnh Tân",
			"Quỳnh Văn",
			"Quỳnh Yên",
			"Quỳnh Đôi",
			"Thuận Long",
			"Tân Sơn",
			"Tân Thắng",
			"Văn Hải"
		],
		"district": "Quỳnh Lưu"
	},
	{
		"wards": [
			"Chiềng Bằng",
			"Chiềng Khay",
			"Chiềng Khoang",
			"Chiềng Ơn",
			"Cà Nàng",
			"Mường Chiên",
			"Mường Giàng",
			"Mường Giôn",
			"Mường Sại",
			"Nậm ét",
			"Pá Ma Pha Khinh"
		],
		"district": "Quỳnh Nhai"
	},
	{
		"wards": [
			"An Bài",
			"An Cầu",
			"An Dục",
			"An Hiệp",
			"An Khê",
			"An Lễ",
			"An Mỹ",
			"An Ninh",
			"An Quí",
			"An Thanh",
			"An Thái",
			"An Tràng",
			"An Vinh",
			"An Vũ",
			"An Đồng",
			"An Ấp",
			"Châu Sơn",
			"Quỳnh Côi",
			"Quỳnh Giao",
			"Quỳnh Hoa",
			"Quỳnh Hoàng",
			"Quỳnh Hưng",
			"Quỳnh Hải",
			"Quỳnh Hồng",
			"Quỳnh Hội",
			"Quỳnh Khê",
			"Quỳnh Lâm",
			"Quỳnh Minh",
			"Quỳnh Mỹ",
			"Quỳnh Nguyên",
			"Quỳnh Ngọc",
			"Quỳnh Thọ",
			"Trang Bảo Xá",
			"Đông Hải",
			"Đồng Tiến"
		],
		"district": "Quỳnh Phụ"
	},
	{
		"wards": [
			"An Bình",
			"An Hòa",
			"Phi Thông",
			"Rạch Sỏi",
			"Vĩnh Hiệp",
			"Vĩnh Lạc",
			"Vĩnh Lợi",
			"Vĩnh Quang",
			"Vĩnh Thanh",
			"Vĩnh Thanh Vân",
			"Vĩnh Thông"
		],
		"district": "Rạch Giá"
	},
	{
		"wards": [
			"Bản Hồ",
			"Cầu Mây",
			"Hoàng Liên",
			"Hàm Rồng",
			"Liên Minh",
			"Mường Bo",
			"Mường Hoa",
			"Ngũ Chỉ Sơn",
			"Phan Si Păng",
			"Sa Pa",
			"Sa Pả",
			"Thanh Bình",
			"Trung Chải",
			"Tả Phìn",
			"Tả Van",
			"Ô Quý Hồ"
		],
		"district": "Sa Pa"
	},
	{
		"wards": [
			"Hơ Moong",
			"Mô Rai",
			"Rơ Kơi",
			"Sa Bình",
			"Sa Nghĩa",
			"Sa Nhơn",
			"Sa Sơn",
			"Sa Thầy",
			"Ya Tăng",
			"Ya Xiêr",
			"Ya ly"
		],
		"district": "Sa Thầy"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"4",
			"An Hoà",
			"Tân Khánh Đông",
			"Tân Phú Đông",
			"Tân Quy Tây",
			"Tân Quy Đông"
		],
		"district": "Sa Đéc"
	},
	{
		"wards": [
			"Bản Mế",
			"Cán Cấu",
			"Lùng Thẩn",
			"Nàn Sán",
			"Nàn Xín",
			"Quan Hồ Thẩn",
			"Si Ma Cai",
			"Sán Chải",
			"Sín Chéng",
			"Thào Chư Phìn"
		],
		"district": "Si Ma Cai"
	},
	{
		"wards": [
			"Chăn Nưa",
			"Căn Co",
			"Hồng Thu",
			"Làng Mô",
			"Lùng Thàng",
			"Ma Quai",
			"Noong Hẻo",
			"Nậm Cha",
			"Nậm Cuổi",
			"Nậm Hăn",
			"Nậm Mạ",
			"Nậm Tăm",
			"Pa Khoá",
			"Pa Tần",
			"Phìn Hồ",
			"Phăng Sô Lin",
			"Pu Sam Cáp",
			"Sà Dề Phìn",
			"Sìn Hồ",
			"Tả Ngảo",
			"Tả Phìn",
			"Tủa Sín Chải"
		],
		"district": "Sìn Hồ"
	},
	{
		"wards": [
			"Bắc Phú",
			"Bắc Sơn",
			"Hiền Ninh",
			"Hồng Kỳ",
			"Kim Lũ",
			"Mai Đình",
			"Minh Phú",
			"Minh Trí",
			"Nam Sơn",
			"Phù Linh",
			"Phù Lỗ",
			"Phú Cường",
			"Phú Minh",
			"Quang Tiến",
			"Sóc Sơn",
			"Thanh Xuân",
			"Tiên Dược",
			"Trung Giã",
			"Tân Dân",
			"Tân Hưng",
			"Tân Minh",
			"Việt Long",
			"Xuân Giang",
			"Xuân Thu",
			"Đông Xuân",
			"Đức Hoà"
		],
		"district": "Sóc Sơn"
	},
	{
		"wards": [
			"1",
			"10",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8"
		],
		"district": "Sóc Trăng"
	},
	{
		"wards": [
			"Bá Xuyên",
			"Bách Quang",
			"Bình Sơn",
			"Châu Sơn",
			"Cải Đan",
			"Lương Sơn",
			"Mỏ Chè",
			"Phố Cò",
			"Thắng Lợi",
			"Tân Quang"
		],
		"district": "Sông Công"
	},
	{
		"wards": [
			"Xuân Bình",
			"Xuân Cảnh",
			"Xuân Hải",
			"Xuân Lâm",
			"Xuân Lộc",
			"Xuân Phú",
			"Xuân Phương",
			"Xuân Thành",
			"Xuân Thịnh",
			"Xuân Thọ 1",
			"Xuân Thọ 2",
			"Xuân Yên",
			"Xuân Đài"
		],
		"district": "Sông Cầu"
	},
	{
		"wards": [
			"Ea Bá",
			"Ea Lâm",
			"EaBar",
			"EaBia",
			"EaTrol",
			"Ealy",
			"Hai Riêng",
			"Sông Hinh",
			"Sơn Giang",
			"Đức Bình Tây",
			"Đức Bình Đông"
		],
		"district": "Sông Hinh"
	},
	{
		"wards": [
			"Cao Phong",
			"Hải Lựu",
			"Lãng Công",
			"Nhân Đạo",
			"Phương Khoan",
			"Quang Yên",
			"Tam Sơn",
			"Tân Lập",
			"Tứ Yên",
			"Yên Thạch",
			"Đôn Nhân",
			"Đồng Quế",
			"Đồng Thịnh",
			"Đức Bác"
		],
		"district": "Sông Lô"
	},
	{
		"wards": [
			"Bó Sinh",
			"Chiềng Cang",
			"Chiềng En",
			"Chiềng Khoong",
			"Chiềng Khương",
			"Chiềng Phung",
			"Chiềng Sơ",
			"Huổi Một",
			"Mường Cai",
			"Mường Hung",
			"Mường Lầm",
			"Mường Sai",
			"Nà Nghịu",
			"Nậm Mằn",
			"Nậm Ty",
			"Pú Pẩu",
			"Sông Mã",
			"Yên Hưng",
			"Đứa Mòn"
		],
		"district": "Sông Mã"
	},
	{
		"wards": [
			"Bình Yên",
			"Chi Thiết",
			"Cấp Tiến",
			"Hào Phú",
			"Hồng Sơn",
			"Hợp Hòa",
			"Hợp Thành",
			"Kháng Nhật",
			"Lương Thiện",
			"Minh Thanh",
			"Ninh Lai",
			"Phú Lương",
			"Phúc Ứng",
			"Quyết Thắng",
			"Sơn Dương",
			"Sơn Nam",
			"Tam Đa",
			"Thiện Kế",
			"Thượng Ấm",
			"Trung Yên",
			"Trường Sinh",
			"Tân Thanh",
			"Tân Trào",
			"Tú Thịnh",
			"Văn Phú",
			"Vĩnh Lợi",
			"Đông Lợi",
			"Đông Thọ",
			"Đại Phú",
			"Đồng Quý"
		],
		"district": "Sơn Dương"
	},
	{
		"wards": [
			"Di Lăng",
			"Sơn Ba",
			"Sơn Bao",
			"Sơn Cao",
			"Sơn Giang",
			"Sơn Hạ",
			"Sơn Hải",
			"Sơn Kỳ",
			"Sơn Linh",
			"Sơn Nham",
			"Sơn Thành",
			"Sơn Thượng",
			"Sơn Thủy",
			"Sơn Trung"
		],
		"district": "Sơn Hà"
	},
	{
		"wards": [
			"Cà Lúi",
			"Củng Sơn",
			"Eachà Rang",
			"Krông Pa",
			"Phước Tân",
			"Suối Bạc",
			"Suối Trai",
			"Sơn Hà",
			"Sơn Hội",
			"Sơn Long",
			"Sơn Nguyên",
			"Sơn Phước",
			"Sơn Xuân",
			"Sơn Định"
		],
		"district": "Sơn Hòa"
	},
	{
		"wards": [
			"Chiềng An",
			"Chiềng Cơi",
			"Chiềng Cọ",
			"Chiềng Lề",
			"Chiềng Ngần",
			"Chiềng Sinh",
			"Chiềng Xôm",
			"Chiềng Đen",
			"Hua La",
			"Quyết Thắng",
			"Quyết Tâm",
			"Tô Hiệu"
		],
		"district": "Sơn La"
	},
	{
		"wards": [
			"An Hải Bắc",
			"An Hải Nam",
			"Mân Thái",
			"Nại Hiên Đông",
			"Phước Mỹ",
			"Thọ Quang"
		],
		"district": "Sơn Trà"
	},
	{
		"wards": [
			"Cổ Đông",
			"Kim Sơn",
			"Ngô Quyền",
			"Phú Thịnh",
			"Sơn Bua",
			"Sơn Dung",
			"Sơn Liên",
			"Sơn Long",
			"Sơn Lập",
			"Sơn Lộc",
			"Sơn Màu",
			"Sơn Mùa",
			"Sơn Tinh",
			"Sơn Tân",
			"Sơn Đông",
			"Thanh Mỹ",
			"Trung Hưng",
			"Trung Sơn Trầm",
			"Viên Sơn",
			"Xuân Khanh",
			"Xuân Sơn",
			"Đường Lâm"
		],
		"district": "Sơn Tây"
	},
	{
		"wards": [
			"Tịnh Bình",
			"Tịnh Bắc",
			"Tịnh Giang",
			"Tịnh Hiệp",
			"Tịnh Hà",
			"Tịnh Minh",
			"Tịnh Phong",
			"Tịnh Sơn",
			"Tịnh Thọ",
			"Tịnh Trà",
			"Tịnh Đông"
		],
		"district": "Sơn Tịnh"
	},
	{
		"wards": [
			"An Bá",
			"An Châu",
			"An Lạc",
			"Cẩm Đàn",
			"Dương Hưu",
			"Giáo Liêm",
			"Hữu Sản",
			"Long Sơn",
			"Lệ Viễn",
			"Phúc Sơn",
			"Thanh Luận",
			"Tuấn Đạo",
			"Tây Yên Tử",
			"Vân Sơn",
			"Vĩnh An",
			"Yên Định",
			"Đại Sơn"
		],
		"district": "Sơn Động"
	},
	{
		"wards": [
			"Bắc Sơn",
			"Quảng Châu",
			"Quảng Cư",
			"Quảng Minh",
			"Quảng Thọ",
			"Quảng Tiến",
			"Quảng Vinh",
			"Trung Sơn",
			"Trường Sơn",
			"Đại Hùng"
		],
		"district": "Sầm Sơn"
	},
	{
		"wards": [
			"Dồm Cang",
			"Mường Lèo",
			"Mường Lạn",
			"Mường Và",
			"Nậm Lạnh",
			"Púng Bánh",
			"Sam Kha",
			"Sốp Cộp"
		],
		"district": "Sốp Cộp"
	},
	{
		"wards": [
			"Bình Ninh",
			"Hoà Lộc",
			"Hòa Hiệp",
			"Hòa Thạnh",
			"Hậu Lộc",
			"Loan Mỹ",
			"Long Phú",
			"Mỹ Lộc",
			"Mỹ Thạnh Trung",
			"Ngãi Tứ",
			"Phú Lộc",
			"Phú Thịnh",
			"Song Phú",
			"Tam Bình",
			"Tân Lộc",
			"Tân Phú"
		],
		"district": "Tam Bình"
	},
	{
		"wards": [
			"An Hòa",
			"Duy Phiên",
			"Hoàng Hoa",
			"Hoàng Lâu",
			"Hoàng Đan",
			"Hướng Đạo",
			"Hội Thịnh",
			"Hợp Hòa",
			"Kim Long",
			"Thanh Vân",
			"Đạo Tú",
			"Đồng Tĩnh"
		],
		"district": "Tam Dương"
	},
	{
		"wards": [
			"An Mỹ",
			"An Phú",
			"An Sơn",
			"An Xuân",
			"Hoà Thuận",
			"Hòa Hương",
			"Tam Ngọc",
			"Tam Phú",
			"Tam Thanh",
			"Tam Thăng",
			"Trường Xuân",
			"Tân Thạnh"
		],
		"district": "Tam Kỳ"
	},
	{
		"wards": [
			"An Hòa",
			"An Long",
			"Bắc Sơn",
			"Dân Quyền",
			"Dị Nậu",
			"Hiền Quan",
			"Hoà Bình",
			"Hưng Hoá",
			"Hương Nộn",
			"Lam Sơn",
			"Phú Cường",
			"Phú Hiệp",
			"Phú Ninh",
			"Phú Thành A",
			"Phú Thành B",
			"Phú Thọ",
			"Phú Đức",
			"Quang Húc",
			"Thanh Uyên",
			"Thọ Văn",
			"Tràm Chim",
			"Tân Công Sính",
			"Tề Lễ",
			"Vạn Xuân"
		],
		"district": "Tam Nông"
	},
	{
		"wards": [
			"Bắc Sơn",
			"Nam Sơn",
			"Quang Sơn",
			"Trung Sơn",
			"Tân Bình",
			"Tây Sơn",
			"Yên Bình",
			"Yên Sơn",
			"Đông Sơn"
		],
		"district": "Tam Điệp"
	},
	{
		"wards": [
			"Bình Lư",
			"Bản Bo",
			"Bản Giang",
			"Bản Hon",
			"Giang Ma",
			"Hồ Thầu",
			"Khun Há",
			"Nà Tăm",
			"Nùng Nàng",
			"Sơn Bình",
			"Tam Đường",
			"Thèn Sin",
			"Tả Lèng"
		],
		"district": "Tam Đường"
	},
	{
		"wards": [
			"Bồ Lý",
			"Hồ Sơn",
			"Hợp Châu",
			"Minh Quang",
			"Tam Quan",
			"Tam Đảo",
			"Yên Dương",
			"Đại Đình",
			"Đạo Trù"
		],
		"district": "Tam Đảo"
	},
	{
		"wards": [
			"Hua Nà",
			"Khoen On",
			"Mường Cang",
			"Mường Kim",
			"Mường Mít",
			"Mường Than",
			"Pha Mu",
			"Phúc Than",
			"Than Uyên",
			"Tà Gia",
			"Tà Hừa",
			"Tà Mung"
		],
		"district": "Than Uyên"
	},
	{
		"wards": [
			"Chí Tiên",
			"Hanh Cù",
			"Hoàng Cương",
			"Khải Xuân",
			"Lương Lỗ",
			"Mạn Lạn",
			"Ninh Dân",
			"Quảng Yên",
			"Sơn Cương",
			"Thanh Ba",
			"Thanh Hà",
			"Vân Lĩnh",
			"Võ Lao",
			"Đông Lĩnh",
			"Đông Thành",
			"Đại An",
			"Đồng Xuân",
			"Đỗ Sơn",
			"Đỗ Xuyên"
		],
		"district": "Thanh Ba"
	},
	{
		"wards": [
			"An Phong",
			"Bình Thành",
			"Bình Tấn",
			"Phú Lợi",
			"Thanh Bình",
			"Tân Bình",
			"Tân Huề",
			"Tân Hòa",
			"Tân Long",
			"Tân Mỹ",
			"Tân Phú",
			"Tân Quới",
			"Tân Thạnh"
		],
		"district": "Thanh Bình"
	},
	{
		"wards": [
			"Cát Văn",
			"Dùng",
			"Hạnh Lâm",
			"Kim Bảng",
			"Mai Giang",
			"Minh Sơn",
			"Minh Tiến",
			"Ngọc Lâm",
			"Ngọc Sơn",
			"Phong Thịnh",
			"Thanh An",
			"Thanh Hà",
			"Thanh Hương",
			"Thanh Liên",
			"Thanh Lâm",
			"Thanh Mỹ",
			"Thanh Ngọc",
			"Thanh Phong",
			"Thanh Quả",
			"Thanh Sơn",
			"Thanh Thịnh",
			"Thanh Thủy",
			"Thanh Tiên",
			"Thanh Tùng",
			"Thanh Xuân",
			"Thanh Đức",
			"Xuân Dương",
			"Đại Đồng",
			"Đồng Văn"
		],
		"district": "Thanh Chương"
	},
	{
		"wards": [
			"An Phượng",
			"Cẩm Việt",
			"Hồng Lạc",
			"Liên Mạc",
			"Thanh An",
			"Thanh Hà",
			"Thanh Hải",
			"Thanh Hồng",
			"Thanh Lang",
			"Thanh Quang",
			"Thanh Sơn",
			"Thanh Tân",
			"Thanh Xuân",
			"Tân An",
			"Tân Việt",
			"Vĩnh Cường"
		],
		"district": "Thanh Hà"
	},
	{
		"wards": [
			"An Hưng",
			"Ba Đình",
			"Hoằng Quang",
			"Hoằng Đại",
			"Hàm Rồng",
			"Lam Sơn",
			"Long Anh",
			"Nam Ngạn",
			"Ngọc Trạo",
			"Phú Sơn",
			"Quảng Cát",
			"Quảng Hưng",
			"Quảng Phú",
			"Quảng Thành",
			"Quảng Thắng",
			"Quảng Thịnh",
			"Quảng Tâm",
			"Quảng Đông",
			"Rừng Thông",
			"Thiệu Dương",
			"Thiệu Khánh",
			"Thiệu Vân",
			"Trường Thi",
			"Tào Xuyên",
			"Điện Biên",
			"Đông Cương",
			"Đông Hoàng",
			"Đông Hòa",
			"Đông Hương",
			"Đông Hải",
			"Đông Khê",
			"Đông Lĩnh",
			"Đông Minh",
			"Đông Nam",
			"Đông Ninh",
			"Đông Phú",
			"Đông Quang",
			"Đông Sơn",
			"Đông Thanh",
			"Đông Thịnh",
			"Đông Thọ",
			"Đông Tiến",
			"Đông Tân",
			"Đông Vinh",
			"Đông Văn",
			"Đông Vệ",
			"Đông Yên"
		],
		"district": "Thanh Hóa"
	},
	{
		"wards": [
			"An Khê",
			"Chính Gián",
			"Thanh Khê Tây",
			"Thanh Khê Đông",
			"Thạc Gián",
			"Xuân Hà"
		],
		"district": "Thanh Khê"
	},
	{
		"wards": [
			"Kiện Khê",
			"Liêm Cần",
			"Liêm Phong",
			"Liêm Sơn",
			"Liêm Thuận",
			"Liêm Túc",
			"Thanh Hà",
			"Thanh Hương",
			"Thanh Hải",
			"Thanh Nghị",
			"Thanh Nguyên",
			"Thanh Phong",
			"Thanh Thủy",
			"Thanh Tâm",
			"Thanh Tân",
			"Tân Thanh"
		],
		"district": "Thanh Liêm"
	},
	{
		"wards": [
			"Cao Thắng",
			"Chi Lăng Bắc",
			"Chi Lăng Nam",
			"Hồng Phong",
			"Hồng Quang",
			"Lam Sơn",
			"Lê Hồng",
			"Ngô Quyền",
			"Ngũ Hùng",
			"Phạm Kha",
			"Thanh Giang",
			"Thanh Miện",
			"Thanh Tùng",
			"Tân Trào",
			"Tứ Cường",
			"Đoàn Kết",
			"Đoàn Tùng"
		],
		"district": "Thanh Miện"
	},
	{
		"wards": [
			"Bình Minh",
			"Bích Hòa",
			"Cao Viên",
			"Cao Xuân Dương",
			"Cự Khê",
			"Dân Hòa",
			"Hồng Dương",
			"Kim An",
			"Kim Bài",
			"Kim Thư",
			"Liên Châu",
			"Mỹ Hưng",
			"Phương Trung",
			"Tam Hưng",
			"Thanh Cao",
			"Thanh Mai",
			"Thanh Thùy",
			"Thanh Văn",
			"Tân Ước",
			"Đỗ Động"
		],
		"district": "Thanh Oai"
	},
	{
		"wards": [
			"Cự Thắng",
			"Cự Đồng",
			"Giáp Lai",
			"Hương Cần",
			"Khả Cửu",
			"Lương Nha",
			"Sơn Hùng",
			"Thanh Sơn",
			"Thượng Cửu",
			"Thạch Khoán",
			"Thắng Sơn",
			"Thục Luyện",
			"Tinh Nhuệ",
			"Tân Lập",
			"Tân Minh",
			"Tất Thắng",
			"Võ Miếu",
			"Văn Miếu",
			"Yên Lãng",
			"Yên Lương",
			"Yên Sơn",
			"Đông Cửu",
			"Địch Quả"
		],
		"district": "Thanh Sơn"
	},
	{
		"wards": [
			"Bảo Yên",
			"Hoàng Xá",
			"Sơn Thủy",
			"Thanh Thủy",
			"Thạch Đồng",
			"Tu Vũ",
			"Tân Phương",
			"Xuân Lộc",
			"Đoan Hạ",
			"Đào Xá",
			"Đồng Trung"
		],
		"district": "Thanh Thuỷ"
	},
	{
		"wards": [
			"Duyên Hà",
			"Hữu Hoà",
			"Liên Ninh",
			"Ngũ Hiệp",
			"Ngọc Hồi",
			"Tam Hiệp",
			"Thanh Liệt",
			"Tân Triều",
			"Tả Thanh Oai",
			"Tứ Hiệp",
			"Văn Điển",
			"Vĩnh Quỳnh",
			"Vạn Phúc",
			"Yên Mỹ",
			"Đông Mỹ",
			"Đại áng"
		],
		"district": "Thanh Trì"
	},
	{
		"wards": [
			"Hạ Đình",
			"Khương Mai",
			"Khương Trung",
			"Khương Đình",
			"Nhân Chính",
			"Phương Liệt",
			"Thanh Xuân Bắc",
			"Thanh Xuân Trung",
			"Thượng Đình"
		],
		"district": "Thanh Xuân"
	},
	{
		"wards": [
			"Hậu Hiền",
			"Thiệu Chính",
			"Thiệu Công",
			"Thiệu Duy",
			"Thiệu Giang",
			"Thiệu Giao",
			"Thiệu Hòa",
			"Thiệu Hóa",
			"Thiệu Hợp",
			"Thiệu Long",
			"Thiệu Lý",
			"Thiệu Nguyên",
			"Thiệu Ngọc",
			"Thiệu Phúc",
			"Thiệu Quang",
			"Thiệu Thành",
			"Thiệu Thịnh",
			"Thiệu Tiến",
			"Thiệu Toán",
			"Thiệu Trung",
			"Thiệu Viên",
			"Thiệu Vũ",
			"Thiệu Vận",
			"Tân Châu"
		],
		"district": "Thiệu Hóa"
	},
	{
		"wards": [
			"An Bình",
			"Bình Thành",
			"Mỹ Phú Đông",
			"Núi Sập",
			"Phú Hoà",
			"Phú Thuận",
			"Thoại Giang",
			"Tây Phú",
			"Vĩnh Chánh",
			"Vĩnh Khánh",
			"Vĩnh Phú",
			"Vĩnh Trạch",
			"Vọng Thê",
			"Vọng Đông",
			"Óc Eo",
			"Định Mỹ",
			"Định Thành"
		],
		"district": "Thoại Sơn"
	},
	{
		"wards": [
			"An Phú",
			"An Sơn",
			"An Thạnh",
			"Bình Chuẩn",
			"Bình Hòa",
			"Bình Nhâm",
			"Hưng Định",
			"Lái Thiêu",
			"Thuận Giao",
			"Vĩnh Phú"
		],
		"district": "Thuận An"
	},
	{
		"wards": [
			"Bắc Phong",
			"Bắc Sơn",
			"Công Hải",
			"Lợi Hải",
			"Phước Chiến",
			"Phước Kháng"
		],
		"district": "Thuận Bắc"
	},
	{
		"wards": [
			"Bon Phặng",
			"Bó Mười",
			"Bản Lầm",
			"Chiềng Bôm",
			"Chiềng La",
			"Chiềng Ngàm",
			"Chiềng Pha",
			"Chiềng Pấc",
			"Co Mạ",
			"Co Tòng",
			"Liệp Tè",
			"Long Hẹ",
			"Muổi Nọi",
			"Mường Bám",
			"Mường Khiêng",
			"Mường é",
			"Noong Lay",
			"Nậm Lầu",
			"Phổng Ly",
			"Phổng Lái",
			"Phổng Lập",
			"Pá Lông",
			"Púng Tra",
			"Thuận Châu",
			"Thôm Mòn",
			"Tông Cọ",
			"Tông Lạnh",
			"é Tòng"
		],
		"district": "Thuận Châu"
	},
	{
		"wards": [
			"An Cựu",
			"An Tây",
			"An Đông",
			"Dương Nỗ",
			"Hương Phong",
			"Phú Hội",
			"Phú Nhuận",
			"Phú Thượng",
			"Phước Vĩnh",
			"Phường Đúc",
			"Thuận An",
			"Thuỷ Biều",
			"Thuỷ Xuân",
			"Thủy Bằng",
			"Thủy Vân",
			"Trường An",
			"Vĩnh Ninh",
			"Vỹ Dạ",
			"Xuân Phú"
		],
		"district": "Thuận Hóa"
	},
	{
		"wards": [
			"Cà Ná",
			"Nhị Hà",
			"Phước Dinh",
			"Phước Diêm",
			"Phước Hà",
			"Phước Minh",
			"Phước Nam",
			"Phước Ninh"
		],
		"district": "Thuận Nam"
	},
	{
		"wards": [
			"An Bình",
			"Gia Đông",
			"Hoài Thượng",
			"Hà Mãn",
			"Hồ",
			"Mão Điền",
			"Nghĩa Đạo",
			"Nguyệt Đức",
			"Ngũ Thái",
			"Ninh Xá",
			"Song Hồ",
			"Song Liễu",
			"Thanh Khương",
			"Trí Quả",
			"Trạm Lộ",
			"Xuân Lâm",
			"Đình Tổ",
			"Đại Đồng Thành"
		],
		"district": "Thuận Thành"
	},
	{
		"wards": [
			"An Lư",
			"Bạch Đằng",
			"Dương Quan",
			"Hoa Động",
			"Hoà Bình",
			"Hoàng Lâm",
			"Liên Xuân",
			"Lê Hồng Phong",
			"Lưu Kiếm",
			"Lập Lễ",
			"Minh Đức",
			"Nam Triệu Giang",
			"Ninh Sơn",
			"Phạm Ngũ Lão",
			"Quang Trung",
			"Quảng Thanh",
			"Tam Hưng",
			"Thiên Hương",
			"Thuỷ Đường",
			"Thủy Hà",
			"Trần Hưng Đạo"
		],
		"district": "Thuỷ Nguyên"
	},
	{
		"wards": [
			"Bồ Xuyên",
			"Hoàng Diệu",
			"Kỳ Bá",
			"Lê Hồng Phong",
			"Phú Khánh",
			"Phú Xuân",
			"Quang Trung",
			"Tiền Phong",
			"Trần Hưng Đạo",
			"Trần Lãm",
			"Tân Bình",
			"Vũ Chính",
			"Vũ Lạc",
			"Vũ Phúc",
			"Vũ Đông",
			"Đông Hòa",
			"Đông Mỹ",
			"Đông Thọ",
			"Đề Thám"
		],
		"district": "Thái Bình"
	},
	{
		"wards": [
			"Hoà Hiếu",
			"Long Sơn",
			"Nghĩa Mỹ",
			"Nghĩa Thuận",
			"Nghĩa Tiến",
			"Quang Phong",
			"Quang Tiến",
			"Tây Hiếu",
			"Đông Hiếu"
		],
		"district": "Thái Hoà"
	},
	{
		"wards": [
			"Cam Giá",
			"Cao Ngạn",
			"Chùa Hang",
			"Gia Sàng",
			"Hoàng Văn Thụ",
			"Huống Thượng",
			"Hương Sơn",
			"Linh Sơn",
			"Phan Đình Phùng",
			"Phú Xá",
			"Phúc Hà",
			"Phúc Trìu",
			"Phúc Xuân",
			"Quang Trung",
			"Quang Vinh",
			"Quyết Thắng",
			"Quán Triều",
			"Sơn Cẩm",
			"Thịnh Đán",
			"Thịnh Đức",
			"Trung Thành",
			"Trưng Vương",
			"Tân Cương",
			"Tân Long",
			"Tân Lập",
			"Tân Thành",
			"Tân Thịnh",
			"Tích Lương",
			"Túc Duyên",
			"Đồng Bẩm",
			"Đồng Liên",
			"Đồng Quang"
		],
		"district": "Thái Nguyên"
	},
	{
		"wards": [
			"An Tân",
			"Diêm Điền",
			"Dương Hồng Thủy",
			"Dương Phúc",
			"Hòa An",
			"Hồng Dũng",
			"Mỹ Lộc",
			"Sơn Hà",
			"Thuần Thành",
			"Thái Giang",
			"Thái Hưng",
			"Thái Nguyên",
			"Thái Phúc",
			"Thái Thượng",
			"Thái Thịnh",
			"Thái Thọ",
			"Thái Xuyên",
			"Thái Đô",
			"Thụy Bình",
			"Thụy Chính",
			"Thụy Duyên",
			"Thụy Dân",
			"Thụy Hưng",
			"Thụy Hải",
			"Thụy Liên",
			"Thụy Ninh",
			"Thụy Phong",
			"Thụy Quỳnh",
			"Thụy Sơn",
			"Thụy Thanh",
			"Thụy Trình",
			"Thụy Trường",
			"Thụy Việt",
			"Thụy Văn",
			"Thụy Xuân",
			"Tân Học"
		],
		"district": "Thái Thụy"
	},
	{
		"wards": [
			"Hưng Thạnh",
			"Láng Biển",
			"Mỹ An",
			"Mỹ An",
			"Mỹ Hòa",
			"Mỹ Quý",
			"Mỹ Đông",
			"Phú Điền",
			"Thanh Mỹ",
			"Thạnh Lợi",
			"Trường Xuân",
			"Tân Kiều",
			"Đốc Binh Kiều"
		],
		"district": "Tháp Mười"
	},
	{
		"wards": [
			"Bình An",
			"Bình Dương",
			"Bình Giang",
			"Bình Hải",
			"Bình Lãnh",
			"Bình Minh",
			"Bình Nam",
			"Bình Nguyên",
			"Bình Phú",
			"Bình Phục",
			"Bình Quý",
			"Bình Quế",
			"Bình Sa",
			"Bình Triều",
			"Bình Trung",
			"Bình Trị",
			"Bình Tú",
			"Bình Đào",
			"Bình Định",
			"Hà Lam"
		],
		"district": "Thăng Bình"
	},
	{
		"wards": [
			"Chương Dương",
			"Duyên Thái",
			"Dũng Tiến",
			"Hiền Giang",
			"Hà Hồi",
			"Hòa Bình",
			"Hồng Vân",
			"Khánh Hà",
			"Liên Phương",
			"Lê Lợi",
			"Minh Cường",
			"Nghiêm Xuyên",
			"Nguyễn Trãi",
			"Nhị Khê",
			"Ninh Sở",
			"Quất Động",
			"Thường Tín",
			"Thắng Lợi",
			"Tiền Phong",
			"Tân Minh",
			"Tô Hiệu",
			"Tự Nhiên",
			"Vân Tảo",
			"Văn Bình",
			"Văn Phú",
			"Văn Tự",
			"Vạn Nhất"
		],
		"district": "Thường Tín"
	},
	{
		"wards": [
			"Bát Mọt",
			"Luận Khê",
			"Luận Thành",
			"Lương Sơn",
			"Ngọc Phụng",
			"Thường Xuân",
			"Thọ Thanh",
			"Tân Thành",
			"Vạn Xuân",
			"Xuân Cao",
			"Xuân Chinh",
			"Xuân Dương",
			"Xuân Lẹ",
			"Xuân Lộc",
			"Xuân Thắng",
			"Yên Nhân"
		],
		"district": "Thường Xuân"
	},
	{
		"wards": [
			"Canh Tân",
			"Kim Đồng",
			"Lê Lai",
			"Lê Lợi",
			"Minh Khai",
			"Quang Trọng",
			"Thái Cường",
			"Thụy Hùng",
			"Trọng Con",
			"Vân Trình",
			"Đông Khê",
			"Đức Long",
			"Đức Thông",
			"Đức Xuân"
		],
		"district": "Thạch An"
	},
	{
		"wards": [
			"Bình An",
			"Hồng Lộc",
			"Lưu Vĩnh Sơn",
			"Lộc Hà",
			"Mai Phụ",
			"Nam Điền",
			"Ngọc Sơn",
			"Phù Lưu",
			"Thạch Châu",
			"Thạch Hà",
			"Thạch Kim",
			"Thạch Kênh",
			"Thạch Liên",
			"Thạch Long",
			"Thạch Mỹ",
			"Thạch Ngọc",
			"Thạch Sơn",
			"Thạch Xuân",
			"Thịnh Lộc",
			"Tân Lộc",
			"Việt Tiến",
			"Ích Hậu"
		],
		"district": "Thạch Hà"
	},
	{
		"wards": [
			"Kim Tân",
			"Ngọc Trạo",
			"Thành An",
			"Thành Công",
			"Thành Hưng",
			"Thành Long",
			"Thành Minh",
			"Thành Mỹ",
			"Thành Thọ",
			"Thành Tiến",
			"Thành Trực",
			"Thành Tâm",
			"Thành Tân",
			"Thành Vinh",
			"Thành Yên",
			"Thạch Bình",
			"Thạch Cẩm",
			"Thạch Long",
			"Thạch Lâm",
			"Thạch Quảng",
			"Thạch Sơn",
			"Thạch Tượng",
			"Thạch Định",
			"Vân Du"
		],
		"district": "Thạch Thành"
	},
	{
		"wards": [
			"Bình Yên",
			"Cần Kiệm",
			"Cẩm Yên",
			"Hương Ngải",
			"Hạ Bằng",
			"Kim Quan",
			"Lam Sơn",
			"Liên Quan",
			"Lại Thượng",
			"Phùng Xá",
			"Phú Kim",
			"Quang Trung",
			"Thạch Hoà",
			"Thạch Xá",
			"Tiến Xuân",
			"Tân Xã",
			"Yên Bình",
			"Yên Trung",
			"Đại Đồng",
			"Đồng Trúc"
		],
		"district": "Thạch Thất"
	},
	{
		"wards": [
			"Thuận Bình",
			"Thuận Nghĩa Hòa",
			"Thạnh An",
			"Thạnh Hóa",
			"Thạnh Phú",
			"Thạnh Phước",
			"Thủy Tây",
			"Thủy Đông",
			"Tân Hiệp",
			"Tân Tây",
			"Tân Đông"
		],
		"district": "Thạnh Hóa"
	},
	{
		"wards": [
			"An Nhơn",
			"An Quy",
			"An Thuận",
			"An Thạnh",
			"An Điền",
			"Bình Thạnh",
			"Giao Thạnh",
			"Hòa Lợi",
			"Mỹ An",
			"Mỹ Hưng",
			"Phú Khánh",
			"Quới Điền",
			"Thạnh Hải",
			"Thạnh Phong",
			"Thạnh Phú",
			"Thới Thạnh",
			"Tân Phong",
			"Đại Điền"
		],
		"district": "Thạnh Phú"
	},
	{
		"wards": [
			"Châu Hưng",
			"Hưng Lợi",
			"Lâm Kiết",
			"Lâm Tân",
			"Phú Lộc",
			"Thạnh Trị",
			"Thạnh Tân",
			"Tuân Tức",
			"Vĩnh Lợi",
			"Vĩnh Thành"
		],
		"district": "Thạnh Trị"
	},
	{
		"wards": [
			"Bắc Lương",
			"Lam Sơn",
			"Nam Giang",
			"Phú Xuân",
			"Quảng Phú",
			"Sao Vàng",
			"Thuận Minh",
			"Thọ Diên",
			"Thọ Hải",
			"Thọ Lâm",
			"Thọ Lập",
			"Thọ Lộc",
			"Thọ Xuân",
			"Thọ Xương",
			"Trường Xuân",
			"Tây Hồ",
			"Xuân Bái",
			"Xuân Giang",
			"Xuân Hòa",
			"Xuân Hưng",
			"Xuân Hồng",
			"Xuân Lai",
			"Xuân Lập",
			"Xuân Minh",
			"Xuân Phong",
			"Xuân Phú",
			"Xuân Sinh",
			"Xuân Thiên",
			"Xuân Trường",
			"Xuân Tín"
		],
		"district": "Thọ Xuân"
	},
	{
		"wards": [
			"Bàu Hàm 2",
			"Dầu Giây",
			"Gia Kiệm",
			"Gia Tân 1",
			"Gia Tân 2",
			"Gia Tân 3",
			"Hưng Lộc",
			"Lộ 25",
			"Quang Trung",
			"Xuân Thiện"
		],
		"district": "Thống Nhất"
	},
	{
		"wards": [
			"Thuận An",
			"Thuận Hưng",
			"Thạnh Hoà",
			"Thốt Nốt",
			"Thới Thuận",
			"Trung Kiên",
			"Trung Nhứt",
			"Tân Hưng",
			"Tân Lộc"
		],
		"district": "Thốt Nốt"
	},
	{
		"wards": [
			"Biển Bạch",
			"Biển Bạch Đông",
			"Hồ Thị Kỷ",
			"Thới Bình",
			"Thới Bình",
			"Trí Lực",
			"Trí Phải",
			"Tân Bằng",
			"Tân Lộc",
			"Tân Lộc Bắc",
			"Tân Lộc Đông",
			"Tân Phú"
		],
		"district": "Thới Bình"
	},
	{
		"wards": [
			"Thới Lai",
			"Thới Thạnh",
			"Thới Tân",
			"Trường Thành",
			"Trường Thắng",
			"Trường Xuân",
			"Trường Xuân A",
			"Trường Xuân B",
			"Tân Thạnh",
			"Xuân Thắng",
			"Đông Bình",
			"Đông Thuận",
			"Định Môn"
		],
		"district": "Thới Lai"
	},
	{
		"wards": [
			"Chánh Mỹ",
			"Chánh Nghĩa",
			"Hiệp An",
			"Hiệp Thành",
			"Hoà Phú",
			"Phú Cường",
			"Phú Hòa",
			"Phú Lợi",
			"Phú Mỹ",
			"Phú Thọ",
			"Phú Tân",
			"Tân An",
			"Tương Bình Hiệp",
			"Định Hoà"
		],
		"district": "Thủ Dầu Một"
	},
	{
		"wards": [
			"Bình An",
			"Bình Thạnh",
			"Long Thuận",
			"Long Thạnh",
			"Mỹ An",
			"Mỹ Lạc",
			"Mỹ Phú",
			"Mỹ Thạnh",
			"Nhị Thành",
			"Thủ Thừa",
			"Tân Long",
			"Tân Thành"
		],
		"district": "Thủ Thừa"
	},
	{
		"wards": [
			"An Khánh",
			"An Lợi Đông",
			"An Phú",
			"Bình Chiểu",
			"Bình Thọ",
			"Bình Trưng Tây",
			"Bình Trưng Đông",
			"Cát Lái",
			"Hiệp Bình Chánh",
			"Hiệp Bình Phước",
			"Hiệp Phú",
			"Linh Chiểu",
			"Linh Trung",
			"Linh Tây",
			"Linh Xuân",
			"Linh Đông",
			"Long Bình",
			"Long Phước",
			"Long Thạnh Mỹ",
			"Long Trường",
			"Phú Hữu",
			"Phước Bình",
			"Phước Long A",
			"Phước Long B",
			"Tam Bình",
			"Tam Phú",
			"Thạnh Mỹ Lợi",
			"Thảo Điền",
			"Thủ Thiêm",
			"Trường Thạnh",
			"Trường Thọ",
			"Tân Phú",
			"Tăng Nhơn Phú A",
			"Tăng Nhơn Phú B"
		],
		"district": "Thủ Đức"
	},
	{
		"wards": [
			"Cảnh Hưng",
			"Hiên Vân",
			"Hoàn Sơn",
			"Lim",
			"Liên Bão",
			"Lạc Vệ",
			"Minh Đạo",
			"Nội Duệ",
			"Phú Lâm",
			"Phật Tích",
			"Tri Phương",
			"Tân Chi",
			"Việt Đoàn",
			"Đại Đồng"
		],
		"district": "Tiên Du"
	},
	{
		"wards": [
			"Bắc Hưng",
			"Cấp Tiến",
			"Hùng Thắng",
			"Khởi Nghĩa",
			"Kiến Thiết",
			"Nam Hưng",
			"Quyết Tiến",
			"Tiên Cường",
			"Tiên Lãng",
			"Tiên Minh",
			"Tiên Thanh",
			"Tiên Thắng",
			"Tân Minh",
			"Tây Hưng",
			"Tự Cường",
			"Vinh Quang",
			"Đoàn Lập",
			"Đông Hưng",
			"Đại Thắng"
		],
		"district": "Tiên Lãng"
	},
	{
		"wards": [
			"An Viên",
			"Cương Chính",
			"Hưng Đạo",
			"Hải Thắng",
			"Lệ Xá",
			"Nhật Tân",
			"Thiện Phiến",
			"Thụy Lôi",
			"Thủ Sỹ",
			"Trung Dũng",
			"Vương"
		],
		"district": "Tiên Lữ"
	},
	{
		"wards": [
			"Tiên An",
			"Tiên Châu",
			"Tiên Cảnh",
			"Tiên Hiệp",
			"Tiên Hà",
			"Tiên Kỳ",
			"Tiên Lãnh",
			"Tiên Lập",
			"Tiên Lộc",
			"Tiên Mỹ",
			"Tiên Ngọc",
			"Tiên Phong",
			"Tiên Sơn",
			"Tiên Thọ"
		],
		"district": "Tiên Phước"
	},
	{
		"wards": [
			"Hà Lâu",
			"Hải Lạng",
			"Phong Dụ",
			"Tiên Lãng",
			"Tiên Yên",
			"Yên Than",
			"Điền Xá",
			"Đông Hải",
			"Đông Ngũ",
			"Đại Dực",
			"Đồng Rui"
		],
		"district": "Tiên Yên"
	},
	{
		"wards": [
			"An Ninh",
			"Bắc Hải",
			"Nam Chính",
			"Nam Cường",
			"Nam Hà",
			"Nam Hưng",
			"Nam Hải",
			"Nam Hồng",
			"Nam Phú",
			"Nam Thịnh",
			"Nam Tiến",
			"Nam Trung",
			"Phương Công",
			"Tiền Hải",
			"Tây Giang",
			"Tây Lương",
			"Tây Ninh",
			"Vân Trường",
			"Vũ Lăng",
			"Ái Quốc",
			"Đông Cơ",
			"Đông Hoàng",
			"Đông Long",
			"Đông Lâm",
			"Đông Minh",
			"Đông Quang",
			"Đông Trà",
			"Đông Xuyên"
		],
		"district": "Tiền Hải"
	},
	{
		"wards": [
			"Cầu Quan",
			"Hiếu Trung",
			"Hiếu Tử",
			"Hùng Hòa",
			"Long Thới",
			"Ngãi Hùng",
			"Phú Cần",
			"Tiểu Cần",
			"Tân Hòa",
			"Tân Hùng",
			"Tập Ngãi"
		],
		"district": "Tiểu Cần"
	},
	{
		"wards": [
			"An Tức",
			"Ba Chúc",
			"Châu Lăng",
			"Cô Tô",
			"Lê Trì",
			"Lương An Trà",
			"Lương Phi",
			"Lạc Quới",
			"Núi Tô",
			"Tri Tôn",
			"Tà Đảnh",
			"Tân Tuyến",
			"Vĩnh Gia",
			"Vĩnh Phước",
			"Ô Lâm"
		],
		"district": "Tri Tôn"
	},
	{
		"wards": [
			"Triệu Cơ",
			"Triệu Giang",
			"Triệu Hòa",
			"Triệu Long",
			"Triệu Phước",
			"Triệu Thuận",
			"Triệu Thành",
			"Triệu Thượng",
			"Triệu Trung",
			"Triệu Trạch",
			"Triệu Tài",
			"Triệu Tân",
			"Triệu Ái",
			"Triệu Đại",
			"Triệu Độ",
			"Ái Tử"
		],
		"district": "Triệu Phong"
	},
	{
		"wards": [
			"An Nông",
			"Bình Sơn",
			"Dân Lý",
			"Dân Lực",
			"Dân Quyền",
			"Hợp Lý",
			"Hợp Thành",
			"Hợp Thắng",
			"Hợp Tiến",
			"Khuyến Nông",
			"Minh Sơn",
			"Nông Trường",
			"Nưa",
			"Thái Hòa",
			"Thọ Bình",
			"Thọ Cường",
			"Thọ Dân",
			"Thọ Ngọc",
			"Thọ Phú",
			"Thọ Sơn",
			"Thọ Thế",
			"Thọ Tiến",
			"Thọ Tân",
			"Tiến Nông",
			"Triệu Sơn",
			"Triệu Thành",
			"Văn Sơn",
			"Xuân Lộc",
			"Xuân Thọ",
			"Đồng Lợi",
			"Đồng Thắng",
			"Đồng Tiến"
		],
		"district": "Triệu Sơn"
	},
	{
		"wards": [
			"Hương Trà",
			"Sơn Trà",
			"Trà Bình",
			"Trà Bùi",
			"Trà Giang",
			"Trà Hiệp",
			"Trà Lâm",
			"Trà Phong",
			"Trà Phú",
			"Trà Sơn",
			"Trà Thanh",
			"Trà Thủy",
			"Trà Tân",
			"Trà Tây",
			"Trà Xinh",
			"Trà Xuân"
		],
		"district": "Trà Bồng"
	},
	{
		"wards": [
			"An Quảng Hữu",
			"Hàm Giang",
			"Hàm Tân",
			"Kim Sơn",
			"Long Hiệp",
			"Lưu Nghiệp Anh",
			"Ngãi Xuyên",
			"Ngọc Biên",
			"Phước Hưng",
			"Thanh Sơn",
			"Trà Cú",
			"Tân Hiệp",
			"Tân Sơn",
			"Tập Sơn",
			"Đại An",
			"Định An",
			"Định An"
		],
		"district": "Trà Cú"
	},
	{
		"wards": [
			"1",
			"3",
			"4",
			"5",
			"7",
			"8",
			"9",
			"Long Đức"
		],
		"district": "Trà Vinh"
	},
	{
		"wards": [
			"Hòa Bình",
			"Hựu Thành",
			"Lục Sỹ Thành",
			"Nhơn Bình",
			"Phú Thành",
			"Thuận Thới",
			"Thới Hòa",
			"Trà Côn",
			"Trà Ôn",
			"Tân Mỹ",
			"Tích Thiện",
			"Vĩnh Xuân",
			"Xuân Hiệp"
		],
		"district": "Trà Ôn"
	},
	{
		"wards": [
			"Cao Minh",
			"Chi Lăng",
			"Chí Minh",
			"Hùng Sơn",
			"Hùng Việt",
			"Kháng Chiến",
			"Khánh Long",
			"Kim Đồng",
			"Quốc Khánh",
			"Quốc Việt",
			"Thất Khê",
			"Tri Phương",
			"Trung Thành",
			"Tân Minh",
			"Tân Tiến",
			"Tân Yên",
			"Đoàn Kết",
			"Đào Viên",
			"Đề Thám",
			"Đội Cấn"
		],
		"district": "Tràng Định"
	},
	{
		"wards": [
			"Cao Chương",
			"Cao Thăng",
			"Chí Viễn",
			"Khâm Thành",
			"Lăng Hiếu",
			"Ngọc Côn",
			"Ngọc Khê",
			"Phong Châu",
			"Phong Nậm",
			"Quang Hán",
			"Quang Trung",
			"Quang Vinh",
			"Tri Phương",
			"Trung Phúc",
			"Trà Lĩnh",
			"Trùng Khánh",
			"Xuân Nội",
			"Đoài Dương",
			"Đàm Thuỷ",
			"Đình Phong",
			"Đức Hồng"
		],
		"district": "Trùng Khánh"
	},
	{
		"wards": [
			"Sinh Tồn",
			"Song Tử Tây",
			"Trường Sa"
		],
		"district": "Trường Sa"
	},
	{
		"wards": [
			"Bản Công",
			"Bản Mù",
			"Hát Lìu",
			"Làng Nhì",
			"Phình Hồ",
			"Pá Hu",
			"Pá Lau",
			"Trạm Tấu",
			"Trạm Tấu",
			"Tà Si Láng",
			"Túc Đán",
			"Xà Hồ"
		],
		"district": "Trạm Tấu"
	},
	{
		"wards": [
			"An Viễn",
			"Bàu Hàm",
			"Bình Minh",
			"Bắc Sơn",
			"Cây Gáo",
			"Giang Điền",
			"Hưng Thịnh",
			"Hố Nai 3",
			"Quảng Tiến",
			"Sông Thao",
			"Sông Trầu",
			"Thanh Bình",
			"Trung Hoà",
			"Trảng Bom",
			"Tây Hoà",
			"Đông Hoà",
			"Đồi 61"
		],
		"district": "Trảng Bom"
	},
	{
		"wards": [
			"An Hòa",
			"An Tịnh",
			"Gia Bình",
			"Gia Lộc",
			"Hưng Thuận",
			"Lộc Hưng",
			"Phước Bình",
			"Phước Chỉ",
			"Trảng Bàng",
			"Đôn Thuận"
		],
		"district": "Trảng Bàng"
	},
	{
		"wards": [
			"Báo Đáp",
			"Cường Thịnh",
			"Cổ Phúc",
			"Hòa Cuông",
			"Hưng Khánh",
			"Hưng Thịnh",
			"Hồng Ca",
			"Kiên Thành",
			"Lương Thịnh",
			"Minh Quán",
			"Minh Quân",
			"Quy Mông",
			"Thành Thịnh",
			"Tân Đồng",
			"Việt Cường",
			"Việt Hồng",
			"Vân Hội",
			"Y Can"
		],
		"district": "Trấn Yên"
	},
	{
		"wards": [
			"Khánh Bình",
			"Khánh Bình Tây",
			"Khánh Bình Tây Bắc",
			"Khánh Bình Đông",
			"Khánh Hưng",
			"Khánh Hải",
			"Khánh Lộc",
			"Lợi An",
			"Phong Lạc",
			"Phong Điền",
			"Sông Đốc",
			"Trần Hợi",
			"Trần Văn Thời"
		],
		"district": "Trần Văn Thời"
	},
	{
		"wards": [
			"Liêu Tú",
			"Lịch Hội Thượng",
			"Lịch Hội Thượng",
			"Thạnh Thới An",
			"Thạnh Thới Thuận",
			"Trung Bình",
			"Trần Đề",
			"Tài Văn",
			"Viên An",
			"Viên Bình",
			"Đại Ân 2"
		],
		"district": "Trần Đề"
	},
	{
		"wards": [
			"Cát Thành",
			"Cổ Lễ",
			"Liêm Hải",
			"Ninh Cường",
			"Phương Định",
			"Trung Đông",
			"Trực Chính",
			"Trực Cường",
			"Trực Hùng",
			"Trực Hưng",
			"Trực Khang",
			"Trực Mỹ",
			"Trực Nội",
			"Trực Thanh",
			"Trực Thuận",
			"Trực Thái",
			"Trực Thắng",
			"Trực Tuấn",
			"Trực Đại",
			"Trực Đạo",
			"Việt Hùng"
		],
		"district": "Trực Ninh"
	},
	{
		"wards": [
			"Măng Ri",
			"Ngọc Lây",
			"Ngọc Yêu",
			"Tu Mơ Rông",
			"Tê Xăng",
			"Văn Xuôi",
			"Đắk Hà",
			"Đắk Na",
			"Đắk Rơ Ông",
			"Đắk Sao",
			"Đắk Tờ Kan"
		],
		"district": "Tu Mơ Rông"
	},
	{
		"wards": [
			"An Chấn",
			"An Cư",
			"An Dân",
			"An Hiệp",
			"An Hòa Hải",
			"An Lĩnh",
			"An Mỹ",
			"An Nghiệp",
			"An Ninh Tây",
			"An Ninh Đông",
			"An Thạch",
			"An Thọ",
			"An Xuân",
			"An Định",
			"Chí Thạnh"
		],
		"district": "Tuy An"
	},
	{
		"wards": [
			"1",
			"2",
			"4",
			"5",
			"7",
			"9",
			"An Phú",
			"Bình Kiến",
			"Hòa Kiến",
			"Phú Lâm",
			"Phú Thạnh",
			"Phú Đông"
		],
		"district": "Tuy Hoà"
	},
	{
		"wards": [
			"Bình Thạnh",
			"Chí Công",
			"Hòa Minh",
			"Liên Hương",
			"Phan Dũng",
			"Phan Rí Cửa",
			"Phong Phú",
			"Phú Lạc",
			"Phước Thể",
			"Vĩnh Hảo",
			"Vĩnh Tân"
		],
		"district": "Tuy Phong"
	},
	{
		"wards": [
			"Diêu Trì",
			"Phước An",
			"Phước Hiệp",
			"Phước Hòa",
			"Phước Hưng",
			"Phước Lộc",
			"Phước Nghĩa",
			"Phước Quang",
			"Phước Sơn",
			"Phước Thuận",
			"Phước Thành",
			"Phước Thắng",
			"Tuy Phước"
		],
		"district": "Tuy Phước"
	},
	{
		"wards": [
			"Quảng Trực",
			"Quảng Tâm",
			"Quảng Tân",
			"Đắk Búk So",
			"Đắk Ngo",
			"Đắk R'Tíh"
		],
		"district": "Tuy Đức"
	},
	{
		"wards": [
			"Cao Quảng",
			"Châu Hóa",
			"Hương Hóa",
			"Kim Hóa",
			"Lâm Hóa",
			"Lê Hóa",
			"Mai Hóa",
			"Ngư Hóa",
			"Phong Hóa",
			"Sơn Hóa",
			"Thanh Hóa",
			"Thanh Thạch",
			"Thuận Hóa",
			"Thạch Hóa",
			"Tiến Hóa",
			"Văn Hóa",
			"Đồng Hóa",
			"Đồng Lê",
			"Đức Hóa"
		],
		"district": "Tuyên Hóa"
	},
	{
		"wards": [
			"An Khang",
			"An Tường",
			"Hưng Thành",
			"Kim Phú",
			"Lưỡng Vượng",
			"Minh Xuân",
			"Mỹ Lâm",
			"Nông Tiến",
			"Phan Thiết",
			"Thái Long",
			"Tràng Đà",
			"Tân Hà",
			"Tân Quang",
			"Đội Cấn",
			"Ỷ La"
		],
		"district": "Tuyên Quang"
	},
	{
		"wards": [
			"Chiềng Sinh",
			"Chiềng Đông",
			"Mùn Chung",
			"Mường Khong",
			"Mường Mùn",
			"Mường Thín",
			"Nà Sáy",
			"Nà Tòng",
			"Phình Sáng",
			"Pú Nhung",
			"Pú Xi",
			"Quài Cang",
			"Quài Nưa",
			"Quài Tở",
			"Rạng Đông",
			"Ta Ma",
			"Tuần Giáo",
			"Tênh Phông",
			"Tỏa Tình"
		],
		"district": "Tuần Giáo"
	},
	{
		"wards": [
			"Bắc Ruộng",
			"Gia An",
			"Gia Huynh",
			"Huy Khiêm",
			"La Ngâu",
			"Lạc Tánh",
			"Măng Tố",
			"Nghị Đức",
			"Suối Kiết",
			"Đồng Kho",
			"Đức Bình",
			"Đức Phú",
			"Đức Thuận"
		],
		"district": "Tánh Linh"
	},
	{
		"wards": [
			"1",
			"3",
			"4",
			"5",
			"6",
			"7",
			"An Vĩnh Ngãi",
			"Bình Tâm",
			"Hướng Thọ Phú",
			"Khánh Hậu",
			"Lợi Bình Nhơn",
			"Nhơn Thạnh Trung",
			"Tân Khánh"
		],
		"district": "Tân An"
	},
	{
		"wards": [
			"Hòa Hiệp",
			"Mỏ Công",
			"Thạnh Bình",
			"Thạnh Bắc",
			"Thạnh Tây",
			"Trà Vong",
			"Tân Biên",
			"Tân Bình",
			"Tân Lập",
			"Tân Phong"
		],
		"district": "Tân Biên"
	},
	{
		"wards": [
			"1",
			"10",
			"11",
			"12",
			"13",
			"14",
			"15",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9"
		],
		"district": "Tân Bình"
	},
	{
		"wards": [
			"Châu Phong",
			"Long An",
			"Long Châu",
			"Long Hưng",
			"Long Phú",
			"Long Sơn",
			"Long Thạnh",
			"Lê Chánh",
			"Phú Lộc",
			"Phú Vĩnh",
			"Suối Dây",
			"Suối Ngô",
			"Thạnh Đông",
			"Tân An",
			"Tân Châu",
			"Tân Hiệp",
			"Tân Hà",
			"Tân Hòa",
			"Tân Hưng",
			"Tân Hội",
			"Tân Phú",
			"Tân Thành",
			"Tân Thạnh",
			"Tân Đông",
			"Vĩnh Hòa",
			"Vĩnh Xương"
		],
		"district": "Tân Châu"
	},
	{
		"wards": [
			"Thạnh Trị",
			"Thạnh Đông",
			"Thạnh Đông A",
			"Thạnh Đông B",
			"Tân An",
			"Tân Hiệp",
			"Tân Hiệp A",
			"Tân Hiệp B",
			"Tân Hoà",
			"Tân Hội",
			"Tân Thành"
		],
		"district": "Tân Hiệp"
	},
	{
		"wards": [
			"Hưng Hà",
			"Hưng Thạnh",
			"Hưng Điền",
			"Hưng Điền B",
			"Thạnh Hưng",
			"Tân Hưng",
			"Vĩnh Bửu",
			"Vĩnh Châu A",
			"Vĩnh Châu B",
			"Vĩnh Lợi",
			"Vĩnh Thạnh",
			"Vĩnh Đại"
		],
		"district": "Tân Hưng"
	},
	{
		"wards": [
			"An Phước",
			"Bình Phú",
			"Sa Rài",
			"Thông Bình",
			"Tân Công Chí",
			"Tân Hộ Cơ",
			"Tân Phước",
			"Tân Thành A",
			"Tân Thành B"
		],
		"district": "Tân Hồng"
	},
	{
		"wards": [
			"Bình Hợp",
			"Giai Xuân",
			"Hoàn Long",
			"Hương Sơn",
			"Kỳ Sơn",
			"Kỳ Tân",
			"Nghĩa Dũng",
			"Nghĩa Hành",
			"Nghĩa Phúc",
			"Nghĩa Thái",
			"Nghĩa Đồng",
			"Phú Sơn",
			"Tiên Kỳ",
			"Tân An",
			"Tân Hương",
			"Tân Hợp",
			"Tân Kỳ",
			"Tân Phú",
			"Tân Xuân",
			"Đồng Văn"
		],
		"district": "Tân Kỳ"
	},
	{
		"wards": [
			"Gia Mô",
			"Lỗ Sơn",
			"Mãn Đức",
			"Mỹ Hòa",
			"Ngọc Mỹ",
			"Ngổ Luông",
			"Nhân Mỹ",
			"Phong Phú",
			"Phú Cường",
			"Phú Vinh",
			"Quyết Chiến",
			"Suối Hoa",
			"Thanh Hối",
			"Tử Nê",
			"Vân Sơn",
			"Đông Lai"
		],
		"district": "Tân Lạc"
	},
	{
		"wards": [
			"Dak Lua",
			"Hiệp Tân",
			"Hòa Thạnh",
			"Nam Cát Tiên",
			"Phú An",
			"Phú Bình",
			"Phú Lâm",
			"Phú Lập",
			"Phú Lộc",
			"Phú Sơn",
			"Phú Thanh",
			"Phú Thạnh",
			"Phú Thịnh",
			"Phú Thọ Hòa",
			"Phú Trung",
			"Phú Xuân",
			"Phú Điền",
			"Sơn Kỳ",
			"Thanh Sơn",
			"Trà Cổ",
			"Tà Lài",
			"Tân Phú",
			"Tân Quý",
			"Tân Sơn Nhì",
			"Tân Thành",
			"Tân Thới Hòa",
			"Tây Thạnh"
		],
		"district": "Tân Phú"
	},
	{
		"wards": [
			"Phú Thạnh",
			"Phú Tân",
			"Phú Đông",
			"Tân Phú",
			"Tân Thạnh",
			"Tân Thới"
		],
		"district": "Tân Phú Đông"
	},
	{
		"wards": [
			"Hưng Thạnh",
			"Mỹ Phước",
			"Phú Mỹ",
			"Phước Lập",
			"Thạnh Hoà",
			"Thạnh Mỹ",
			"Thạnh Tân",
			"Tân Hòa Thành",
			"Tân Hòa Tây",
			"Tân Hòa Đông",
			"Tân Lập 1",
			"Tân Lập 2"
		],
		"district": "Tân Phước"
	},
	{
		"wards": [
			"Kim Thượng",
			"Kiệt Sơn",
			"Lai Đồng",
			"Long Cốc",
			"Minh Đài",
			"Mỹ Thuận",
			"Tam Thanh",
			"Thu Cúc",
			"Thu Ngạc",
			"Thạch Kiệt",
			"Tân Phú",
			"Tân Sơn",
			"Vinh Tiền",
			"Văn Luông",
			"Xuân Sơn",
			"Xuân Đài",
			"Đồng Sơn"
		],
		"district": "Tân Sơn"
	},
	{
		"wards": [
			"Bắc Hòa",
			"Hậu Thạnh Tây",
			"Hậu Thạnh Đông",
			"Kiến Bình",
			"Nhơn Hoà",
			"Nhơn Hòa Lập",
			"Nhơn Ninh",
			"Tân Bình",
			"Tân Hòa",
			"Tân Lập",
			"Tân Ninh",
			"Tân Thành",
			"Tân Thạnh"
		],
		"district": "Tân Thạnh"
	},
	{
		"wards": [
			"Bình Lãng",
			"Bình Trinh Đông",
			"Bình Tịnh",
			"Lạc Tấn",
			"Nhựt Ninh",
			"Quê Mỹ Thạnh",
			"Tân Bình",
			"Tân Phước Tây",
			"Tân Trụ",
			"Đức Tân"
		],
		"district": "Tân Trụ"
	},
	{
		"wards": [
			"Bạch Đằng",
			"Hố Mít",
			"Hội Nghĩa",
			"Khánh Bình",
			"Mường Khoa",
			"Nậm Cần",
			"Nậm Sỏ",
			"Phú Chánh",
			"Phúc Khoa",
			"Pắc Ta",
			"Thái Hòa",
			"Thân Thuộc",
			"Thạnh Hội",
			"Thạnh Phước",
			"Trung Đồng",
			"Tà Mít",
			"Tân Hiệp",
			"Tân Phước Khánh",
			"Tân Uyên",
			"Tân Vĩnh Hiệp",
			"Uyên Hưng",
			"Vĩnh Tân"
		],
		"district": "Tân Uyên"
	},
	{
		"wards": [
			"An Dương",
			"Cao Thượng",
			"Cao Xá",
			"Hợp Đức",
			"Lam Sơn",
			"Liên Chung",
			"Liên Sơn",
			"Ngọc Châu",
			"Ngọc Lý",
			"Ngọc Thiện",
			"Ngọc Vân",
			"Nhã Nam",
			"Phúc Hòa",
			"Quang Trung",
			"Quế Nham",
			"Song Vân",
			"Tân Trung",
			"Việt Lập",
			"Việt Ngọc"
		],
		"district": "Tân Yên"
	},
	{
		"wards": [
			"A Nông",
			"A Tiêng",
			"A Vương",
			"A Xan",
			"Bha Lê",
			"Ch'ơm",
			"Dang",
			"Ga Ri",
			"Lăng",
			"Tr'Hy"
		],
		"district": "Tây Giang"
	},
	{
		"wards": [
			"Hòa Bình 1",
			"Hòa Mỹ Tây",
			"Hòa Mỹ Đông",
			"Hòa Phong",
			"Hòa Phú",
			"Hòa Thịnh",
			"Hòa Tân Tây",
			"Hòa Đồng",
			"Phú Thứ",
			"Sơn Thành Tây",
			"Sơn Thành Đông"
		],
		"district": "Tây Hoà"
	},
	{
		"wards": [
			"Bưởi",
			"Nhật Tân",
			"Phú Thượng",
			"Quảng An",
			"Thụy Khuê",
			"Tứ Liên",
			"Xuân La",
			"Yên Phụ"
		],
		"district": "Tây Hồ"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"4",
			"Bình Minh",
			"Hiệp Ninh",
			"Ninh Sơn",
			"Ninh Thạnh",
			"Thạnh Tân",
			"Tân Bình"
		],
		"district": "Tây Ninh"
	},
	{
		"wards": [
			"Bình Hòa",
			"Bình Nghi",
			"Bình Thuận",
			"Bình Thành",
			"Bình Tân",
			"Bình Tường",
			"Phú Phong",
			"Tây An",
			"Tây Bình",
			"Tây Giang",
			"Tây Phú",
			"Tây Thuận",
			"Tây Vinh",
			"Tây Xuân",
			"Vĩnh An"
		],
		"district": "Tây Sơn"
	},
	{
		"wards": [
			"La Hà",
			"Nghĩa Hiệp",
			"Nghĩa Hòa",
			"Nghĩa Kỳ",
			"Nghĩa Lâm",
			"Nghĩa Phương",
			"Nghĩa Sơn",
			"Nghĩa Thuận",
			"Nghĩa Thương",
			"Nghĩa Thắng",
			"Nghĩa Trung",
			"Nghĩa Điền",
			"Sông Vệ"
		],
		"district": "Tư Nghĩa"
	},
	{
		"wards": [
			"Hữu Khuông",
			"Lưu Kiền",
			"Lưỡng Minh",
			"Mai Sơn",
			"Nga My",
			"Nhôn Mai",
			"Tam Hợp",
			"Tam Quang",
			"Tam Thái",
			"Tam Đình",
			"Thạch Giám",
			"Xiêng My",
			"Xá Lượng",
			"Yên Hòa",
			"Yên Na",
			"Yên Thắng",
			"Yên Tĩnh"
		],
		"district": "Tương Dương"
	},
	{
		"wards": [
			"An Cư",
			"An Hảo",
			"An Nông",
			"An Phú",
			"Chi Lăng",
			"Nhà Bàng",
			"Nhơn Hưng",
			"Núi Voi",
			"Thới Sơn",
			"Tân Lập",
			"Tân Lợi",
			"Tịnh Biên",
			"Văn Giáo",
			"Vĩnh Trung"
		],
		"district": "Tịnh Biên"
	},
	{
		"wards": [
			"Huổi Só",
			"Lao Xả Phình",
			"Mường Báng",
			"Mường Đun",
			"Sáng Nhè",
			"Sính Phình",
			"Trung Thu",
			"Tả Phìn",
			"Tả Sìn Thàng",
			"Tủa Chùa",
			"Tủa Thàng",
			"Xín Chải"
		],
		"district": "Tủa Chùa"
	},
	{
		"wards": [
			"An Thanh",
			"Bình Lăng",
			"Chí Minh",
			"Dân An",
			"Hà Kỳ",
			"Hà Thanh",
			"Hưng Đạo",
			"Kỳ Sơn",
			"Lạc Phượng",
			"Minh Đức",
			"Nguyên Giáp",
			"Quang Khải",
			"Quang Phục",
			"Quang Trung",
			"Tiên Động",
			"Tân Kỳ",
			"Tứ Kỳ",
			"Văn Tố",
			"Đại Hợp",
			"Đại Sơn"
		],
		"district": "Tứ Kỳ"
	},
	{
		"wards": [
			"Châu Khê",
			"Hương Mạc",
			"Phù Chẩn",
			"Phù Khê",
			"Tam Sơn",
			"Trang Hạ",
			"Tân Hồng",
			"Tương Giang",
			"Đình Bảng",
			"Đông Ngàn",
			"Đồng Kỵ",
			"Đồng Nguyên"
		],
		"district": "Từ Sơn"
	},
	{
		"wards": [
			"Khánh An",
			"Khánh Hòa",
			"Khánh Hội",
			"Khánh Lâm",
			"Khánh Thuận",
			"Khánh Tiến",
			"Nguyễn Phích",
			"U Minh"
		],
		"district": "U Minh"
	},
	{
		"wards": [
			"An Minh Bắc",
			"Hoà Chánh",
			"Minh Thuận",
			"Thạnh Yên",
			"Thạnh Yên A",
			"Vĩnh Hòa"
		],
		"district": "U Minh Thượng"
	},
	{
		"wards": [
			"Bắc Sơn",
			"Nam Khê",
			"Phương Nam",
			"Phương Đông",
			"Quang Trung",
			"Thanh Sơn",
			"Thượng Yên Công",
			"Trưng Vương",
			"Vàng Danh",
			"Yên Thanh"
		],
		"district": "Uông Bí"
	},
	{
		"wards": [
			"Bến Thủy",
			"Cửa Nam",
			"Hà Huy Tập",
			"Hưng Bình",
			"Hưng Chính",
			"Hưng Dũng",
			"Hưng Hòa",
			"Hưng Lộc",
			"Hưng Phúc",
			"Hưng Đông",
			"Lê Lợi",
			"Nghi Hòa",
			"Nghi Hương",
			"Nghi Hải",
			"Nghi Kim",
			"Nghi Liên",
			"Nghi Phong",
			"Nghi Phú",
			"Nghi Thu",
			"Nghi Thuỷ",
			"Nghi Thái",
			"Nghi Tân",
			"Nghi Xuân",
			"Nghi Ân",
			"Nghi Đức",
			"Phúc Thọ",
			"Quang Trung",
			"Quán Bàu",
			"Thu Thuỷ",
			"Trung Đô",
			"Trường Thi",
			"Vinh Tân",
			"Đông Vĩnh"
		],
		"district": "Vinh"
	},
	{
		"wards": [
			"Bạch Hạc",
			"Chu Hóa",
			"Dữu Lâu",
			"Gia Cẩm",
			"Hy Cương",
			"Hùng Lô",
			"Kim Đức",
			"Minh Nông",
			"Minh Phương",
			"Nông Trang",
			"Phượng Lâu",
			"Sông Lô",
			"Thanh Miếu",
			"Thanh Đình",
			"Thọ Sơn",
			"Thụy Vân",
			"Tiên Cát",
			"Trưng Vương",
			"Tân Dân",
			"Vân Phú"
		],
		"district": "Việt Trì"
	},
	{
		"wards": [
			"Bích Động",
			"Hương Mai",
			"Hồng Thái",
			"Minh Đức",
			"Nghĩa Trung",
			"Ninh Sơn",
			"Nếnh",
			"Quang Châu",
			"Quảng Minh",
			"Thượng Lan",
			"Tiên Sơn",
			"Trung Sơn",
			"Tăng Tiến",
			"Tự Lạn",
			"Việt Tiến",
			"Vân Hà",
			"Vân Trung"
		],
		"district": "Việt Yên"
	},
	{
		"wards": [
			"Canh Hiển",
			"Canh Hiệp",
			"Canh Hòa",
			"Canh Liên",
			"Canh Thuận",
			"Canh Vinh",
			"Vân Canh"
		],
		"district": "Vân Canh"
	},
	{
		"wards": [
			"Chiềng Khoa",
			"Chiềng Xuân",
			"Chiềng Yên",
			"Liên Hoà",
			"Lóng Luông",
			"Mường Men",
			"Mường Tè",
			"Quang Minh",
			"Song Khủa",
			"Suối Bàng",
			"Tân Xuân",
			"Tô Múa",
			"Vân Hồ",
			"Xuân Nha"
		],
		"district": "Vân Hồ"
	},
	{
		"wards": [
			"Bình Dân",
			"Bản Sen",
			"Cái Rồng",
			"Hạ Long",
			"Minh Châu",
			"Ngọc Vừng",
			"Quan Lạn",
			"Thắng Lợi",
			"Vạn Yên",
			"Đoàn Kết",
			"Đài Xuyên",
			"Đông Xá"
		],
		"district": "Vân Đồn"
	},
	{
		"wards": [
			"Bình Long",
			"Cúc Đường",
			"Dân Tiến",
			"La Hiên",
			"Liên Minh",
			"Lâu Thượng",
			"Nghinh Tường",
			"Phú Thượng",
			"Phương Giao",
			"Sảng Mộc",
			"Thượng Nung",
			"Thần Xa",
			"Tràng Xá",
			"Vũ Chấn",
			"Đình Cả"
		],
		"district": "Võ Nhai"
	},
	{
		"wards": [
			"Chiềng Ken",
			"Dương Quỳ",
			"Dần Thàng",
			"Hoà Mạc",
			"Khánh Yên",
			"Khánh Yên Hạ",
			"Khánh Yên Thượng",
			"Khánh Yên Trung",
			"Liêm Phú",
			"Làng Giàng",
			"Minh Lương",
			"Nậm Chầy",
			"Nậm Mả",
			"Nậm Rạng",
			"Nậm Tha",
			"Nậm Xây",
			"Nậm Xé",
			"Sơn Thuỷ",
			"Thẩm Dương",
			"Tân An",
			"Tân Thượng",
			"Võ Lao"
		],
		"district": "Văn Bàn"
	},
	{
		"wards": [
			"An Lương",
			"Bình Thuận",
			"Chấn Thịnh",
			"Cát Thịnh",
			"Gia Hội",
			"Minh An",
			"NT Liên Sơn",
			"NT Trần Phú",
			"Nghĩa Sơn",
			"Nghĩa Tâm",
			"Nậm Búng",
			"Nậm Lành",
			"Nậm Mười",
			"Suối Bu",
			"Suối Giàng",
			"Suối Quyền",
			"Sùng Đô",
			"Sơn Lương",
			"Sơn Thịnh",
			"Thượng Bằng La",
			"Tân Thịnh",
			"Tú Lệ",
			"Đại Lịch",
			"Đồng Khê"
		],
		"district": "Văn Chấn"
	},
	{
		"wards": [
			"Cửu Cao",
			"Liên Nghĩa",
			"Long Hưng",
			"Mễ Sở",
			"Nghĩa Trụ",
			"Phụng Công",
			"Thắng Lợi",
			"Tân Tiến",
			"Văn Giang",
			"Vĩnh Khúc",
			"Xuân Quan"
		],
		"district": "Văn Giang"
	},
	{
		"wards": [
			"Chỉ Đạo",
			"Lương Tài",
			"Lạc Hồng",
			"Lạc Đạo",
			"Minh Hải",
			"Như Quỳnh",
			"Trưng Trắc",
			"Tân Quang",
			"Việt Hưng",
			"Đình Dù",
			"Đại Đồng"
		],
		"district": "Văn Lâm"
	},
	{
		"wards": [
			"Bắc Hùng",
			"Bắc La",
			"Bắc Việt",
			"Gia Miễn",
			"Hoàng Việt",
			"Hoàng Văn Thụ",
			"Hồng Thái",
			"Hội Hoan",
			"Na Sầm",
			"Nhạc Kỳ",
			"Thanh Long",
			"Thành Hòa",
			"Thụy Hùng",
			"Trùng Khánh",
			"Tân Mỹ",
			"Tân Thanh",
			"Tân Tác"
		],
		"district": "Văn Lãng"
	},
	{
		"wards": [
			"An Sơn",
			"Bình Phúc",
			"Hòa Bình",
			"Hữu Lễ",
			"Khánh Khê",
			"Liên Hội",
			"Lương Năng",
			"Tri Lễ",
			"Tràng Phái",
			"Trấn Ninh",
			"Tân Đoàn",
			"Tú Xuyên",
			"Văn Quan",
			"Yên Phúc",
			"Điềm He"
		],
		"district": "Văn Quan"
	},
	{
		"wards": [
			"An Bình",
			"An Thịnh",
			"Châu Quế Hạ",
			"Châu Quế Thượng",
			"Lang Thíp",
			"Lâm Giang",
			"Mậu A",
			"Mậu Đông",
			"Mỏ Vàng",
			"Ngòi A",
			"Nà Hẩu",
			"Phong Dụ Hạ",
			"Phong Dụ Thượng",
			"Quang Minh",
			"Tân Hợp",
			"Viễn Sơn",
			"Xuân Tầm",
			"Xuân Ái",
			"Yên Hợp",
			"Yên Phú",
			"Yên Thái",
			"Đông An",
			"Đông Cuông",
			"Đại Phác",
			"Đại Sơn"
		],
		"district": "Văn Yên"
	},
	{
		"wards": [
			"Cao Minh",
			"Dũng Tiến",
			"Giang Biên",
			"Hoà Bình",
			"Hùng Tiến",
			"Liên Am",
			"Lý Học",
			"Tam Cường",
			"Thắng Thuỷ",
			"Tiền Phong",
			"Trung Lập",
			"Trấn Dương",
			"Tân Hưng",
			"Tân Liên",
			"Việt Tiến",
			"Vĩnh An",
			"Vĩnh Bảo",
			"Vĩnh Hoà",
			"Vĩnh Hưng",
			"Vĩnh Hải"
		],
		"district": "Vĩnh Bảo"
	},
	{
		"wards": [
			"1",
			"2",
			"Hòa Đông",
			"Khánh Hòa",
			"Lai Hòa",
			"Lạc Hòa",
			"Vĩnh Hiệp",
			"Vĩnh Hải",
			"Vĩnh Phước",
			"Vĩnh Tân"
		],
		"district": "Vĩnh Châu"
	},
	{
		"wards": [
			"Bình Lợi",
			"Mã Đà",
			"Phú Lý",
			"Thiện Tân",
			"Thạnh Phú",
			"Trị An",
			"Tân An",
			"Tân Bình",
			"Vĩnh An",
			"Vĩnh Tân"
		],
		"district": "Vĩnh Cửu"
	},
	{
		"wards": [
			"Hưng Điền A",
			"Khánh Hưng",
			"Thái Bình Trung",
			"Thái Trị",
			"Tuyên Bình",
			"Tuyên Bình Tây",
			"Vĩnh Bình",
			"Vĩnh Hưng",
			"Vĩnh Thuận",
			"Vĩnh Trị"
		],
		"district": "Vĩnh Hưng"
	},
	{
		"wards": [
			"Bến Quan",
			"Cửa Tùng",
			"Hiền Thành",
			"Hồ Xá",
			"Kim Thạch",
			"Trung Nam",
			"Vĩnh Chấp",
			"Vĩnh Giang",
			"Vĩnh Hà",
			"Vĩnh Hòa",
			"Vĩnh Khê",
			"Vĩnh Long",
			"Vĩnh Lâm",
			"Vĩnh Sơn",
			"Vĩnh Thái",
			"Vĩnh Thủy",
			"Vĩnh Tú",
			"Vĩnh Ô"
		],
		"district": "Vĩnh Linh"
	},
	{
		"wards": [
			"1",
			"3",
			"4",
			"5",
			"8",
			"9",
			"Trường An",
			"Tân Hòa",
			"Tân Hội",
			"Tân Ngãi"
		],
		"district": "Vĩnh Long"
	},
	{
		"wards": [
			"Minh Tân",
			"Ninh Khang",
			"Vĩnh An",
			"Vĩnh Hòa",
			"Vĩnh Hùng",
			"Vĩnh Hưng",
			"Vĩnh Long",
			"Vĩnh Lộc",
			"Vĩnh Phúc",
			"Vĩnh Quang",
			"Vĩnh Thịnh",
			"Vĩnh Tiến",
			"Vĩnh Yên"
		],
		"district": "Vĩnh Lộc"
	},
	{
		"wards": [
			"Châu Hưng",
			"Châu Hưng A",
			"Châu Thới",
			"Hưng Hội",
			"Hưng Thành",
			"Long Thạnh",
			"Vĩnh Hưng",
			"Vĩnh Hưng A"
		],
		"district": "Vĩnh Lợi"
	},
	{
		"wards": [
			"Bình Minh",
			"Phong Đông",
			"Tân Thuận",
			"Vĩnh Bình Bắc",
			"Vĩnh Bình Nam",
			"Vĩnh Phong",
			"Vĩnh Thuận",
			"Vĩnh Thuận"
		],
		"district": "Vĩnh Thuận"
	},
	{
		"wards": [
			"Thanh An",
			"Thạnh An",
			"Thạnh Lộc",
			"Thạnh Lợi",
			"Thạnh Mỹ",
			"Thạnh Qưới",
			"Thạnh Thắng",
			"Thạnh Tiến",
			"Vĩnh Bình",
			"Vĩnh Hiệp",
			"Vĩnh Hòa",
			"Vĩnh Hảo",
			"Vĩnh Kim",
			"Vĩnh Quang",
			"Vĩnh Sơn",
			"Vĩnh Thuận",
			"Vĩnh Thạnh",
			"Vĩnh Thạnh",
			"Vĩnh Thịnh",
			"Vĩnh Trinh"
		],
		"district": "Vĩnh Thạnh"
	},
	{
		"wards": [
			"An Nhân",
			"Chấn Hưng",
			"Kim Xá",
			"Lũng Hoà",
			"Lương Điền",
			"Nghĩa Hưng",
			"Ngũ Kiên",
			"Sao Đại Việt",
			"Thượng Trưng",
			"Thổ Tang",
			"Tuân Chính",
			"Tân Phú",
			"Tứ Trưng",
			"Vĩnh Phú",
			"Vĩnh Thịnh",
			"Vĩnh Tường",
			"Vũ Di",
			"Yên Bình",
			"Yên Lập",
			"Đại Đồng"
		],
		"district": "Vĩnh Tường"
	},
	{
		"wards": [
			"Hội Hợp",
			"Khai Quang",
			"Liên Bảo",
			"Ngô Quyền",
			"Thanh Trù",
			"Tích Sơn",
			"Định Trung",
			"Đống Đa",
			"Đồng Tâm"
		],
		"district": "Vĩnh Yên"
	},
	{
		"wards": [
			"Hương Minh",
			"Quang Thọ",
			"Thọ Điền",
			"Vũ Quang",
			"Ân Phú",
			"Đức Bồng",
			"Đức Giang",
			"Đức Hương",
			"Đức Liên",
			"Đức Lĩnh"
		],
		"district": "Vũ Quang"
	},
	{
		"wards": [
			"Bách Thuận",
			"Duy Nhất",
			"Dũng Nghĩa",
			"Hiệp Hòa",
			"Hòa Bình",
			"Hồng Lý",
			"Hồng Phong",
			"Minh Khai",
			"Minh Lãng",
			"Minh Quang",
			"Nguyên Xá",
			"Phúc Thành",
			"Song An",
			"Song Lãng",
			"Tam Quang",
			"Trung An",
			"Tân Hòa",
			"Tân Lập",
			"Tân Phong",
			"Tự Tân",
			"Việt Hùng",
			"Việt Thuận",
			"Vũ Hội",
			"Vũ Thư",
			"Vũ Tiến",
			"Vũ Vinh",
			"Vũ Vân",
			"Vũ Đoài",
			"Xuân Hòa",
			"Đồng Thanh"
		],
		"district": "Vũ Thư"
	},
	{
		"wards": [
			"Hiếu Nghĩa",
			"Hiếu Nhơn",
			"Hiếu Phụng",
			"Hiếu Thuận",
			"Hiếu Thành",
			"Quới An",
			"Quới Thiện",
			"Thanh Bình",
			"Trung An",
			"Trung Chánh",
			"Trung Hiếu",
			"Trung Hiệp",
			"Trung Nghĩa",
			"Trung Ngãi",
			"Trung Thành",
			"Trung Thành Tây",
			"Trung Thành Đông",
			"Tân An Luông",
			"Tân Quới Trung",
			"Vũng Liêm"
		],
		"district": "Vũng Liêm"
	},
	{
		"wards": [
			"1",
			"10",
			"11",
			"12",
			"2",
			"3",
			"4",
			"5",
			"7",
			"8",
			"9",
			"Long Sơn",
			"Nguyễn An Ninh",
			"Rạch Dừa",
			"Thắng Nhì",
			"Thắng Nhất",
			"Thắng Tam"
		],
		"district": "Vũng Tàu"
	},
	{
		"wards": [
			"Vạn Bình",
			"Vạn Giã",
			"Vạn Hưng",
			"Vạn Khánh",
			"Vạn Long",
			"Vạn Lương",
			"Vạn Phú",
			"Vạn Phước",
			"Vạn Thạnh",
			"Vạn Thắng",
			"Vạn Thọ",
			"Xuân Sơn",
			"Đại Lãnh"
		],
		"district": "Vạn Ninh"
	},
	{
		"wards": [
			"Hoả Lựu",
			"Hoả Tiến",
			"I",
			"III",
			"IV",
			"Tân Tiến",
			"V",
			"VII",
			"Vị Tân"
		],
		"district": "Vị Thanh"
	},
	{
		"wards": [
			"Nàng Mau",
			"Vĩnh Thuận Tây",
			"Vĩnh Trung",
			"Vĩnh Tường",
			"Vị Bình",
			"Vị Thanh",
			"Vị Thuỷ",
			"Vị Thắng",
			"Vị Trung",
			"Vị Đông"
		],
		"district": "Vị Thuỷ"
	},
	{
		"wards": [
			"Bạch Ngọc",
			"Cao Bồ",
			"Kim Linh",
			"Kim Thạch",
			"Lao Chải",
			"Linh Hồ",
			"Minh Tân",
			"Ngọc Linh",
			"Ngọc Minh",
			"Nông Trường Việt Lâm",
			"Phong Quang",
			"Phú Linh",
			"Phương Tiến",
			"Quảng Ngần",
			"Thanh Thủy",
			"Thanh Đức",
			"Thuận Hoà",
			"Thượng Sơn",
			"Trung Thành",
			"Tùng Bá",
			"Việt Lâm",
			"Vị Xuyên",
			"Xín Chải",
			"Đạo Đức"
		],
		"district": "Vị Xuyên"
	},
	{
		"wards": [
			"Cộng Hòa",
			"Gôi",
			"Hiển Khánh",
			"Hợp Hưng",
			"Kim Thái",
			"Liên Minh",
			"Minh Tân",
			"Quang Trung",
			"Tam Thanh",
			"Thành Lợi",
			"Trung Thành",
			"Vĩnh Hào",
			"Đại An",
			"Đại Thắng"
		],
		"district": "Vụ Bản"
	},
	{
		"wards": [
			"Bàu Lâm",
			"Bình Châu",
			"Bông Trang",
			"Bưng Riềng",
			"Hòa Bình",
			"Hòa Hiệp",
			"Hòa Hưng",
			"Hòa Hội",
			"Phước Bửu",
			"Phước Thuận",
			"Phước Tân",
			"Tân Lâm",
			"Xuyên Mộc"
		],
		"district": "Xuyên Mộc"
	},
	{
		"wards": [
			"Bảo Hoà",
			"Gia Ray",
			"Lang Minh",
			"Suối Cao",
			"Suối Cát",
			"Xuân Bắc",
			"Xuân Hiệp",
			"Xuân Hòa",
			"Xuân Hưng",
			"Xuân Phú",
			"Xuân Thành",
			"Xuân Thọ",
			"Xuân Trường",
			"Xuân Tâm",
			"Xuân Định"
		],
		"district": "Xuân Lộc"
	},
	{
		"wards": [
			"Thọ Nghiệp",
			"Trà Lũ",
			"Xuân Châu",
			"Xuân Giang",
			"Xuân Hồng",
			"Xuân Ngọc",
			"Xuân Ninh",
			"Xuân Phú",
			"Xuân Phúc",
			"Xuân Thành",
			"Xuân Thượng",
			"Xuân Trường",
			"Xuân Tân",
			"Xuân Vinh"
		],
		"district": "Xuân Trường"
	},
	{
		"wards": [
			"Bản Díu",
			"Bản Ngò",
			"Chí Cà",
			"Chế Là",
			"Cốc Pài",
			"Cốc Rế",
			"Khuôn Lùng",
			"Nà Chì",
			"Nàn Ma",
			"Nàn Xỉn",
			"Nấm Dẩn",
			"Pà Vầy Sủ",
			"Quảng Nguyên",
			"Thu Tà",
			"Thèn Phàng",
			"Trung Thịnh",
			"Tả Nhìu",
			"Xín Mần"
		],
		"district": "Xín Mần"
	},
	{
		"wards": [
			"Giới Phiên",
			"Hồng Hà",
			"Hợp Minh",
			"Minh Bảo",
			"Minh Tân",
			"Nam Cường",
			"Nguyễn Thái Học",
			"Tuy Lộc",
			"Tân Thịnh",
			"Văn Phú",
			"Yên Ninh",
			"Yên Thịnh",
			"Âu Lâu",
			"Đồng Tâm"
		],
		"district": "Yên Bái"
	},
	{
		"wards": [
			"Bạch Hà",
			"Bảo Ái",
			"Cảm Nhân",
			"Cảm Ân",
			"Hán Đà",
			"Mông Sơn",
			"Mỹ Gia",
			"Ngọc Chấn",
			"Phú Thịnh",
			"Phúc An",
			"Phúc Ninh",
			"Thác Bà",
			"Thịnh Hưng",
			"Tân Hương",
			"Tân Nguyên",
			"Vĩnh Kiên",
			"Vũ Linh",
			"Xuân Lai",
			"Xuân Long",
			"Yên Bình",
			"Yên Thành",
			"Đại Minh",
			"Đại Đồng"
		],
		"district": "Yên Bình"
	},
	{
		"wards": [
			"Chiềng Hặc",
			"Chiềng Khoi",
			"Chiềng On",
			"Chiềng Pằn",
			"Chiềng Sàng",
			"Chiềng Tương",
			"Chiềng Đông",
			"Lóng Phiêng",
			"Mường Lựm",
			"Phiêng Khoài",
			"Sặp Vạt",
			"Tú Nang",
			"Yên Châu",
			"Yên Sơn"
		],
		"district": "Yên Châu"
	},
	{
		"wards": [
			"Khánh An",
			"Khánh Công",
			"Khánh Cư",
			"Khánh Cường",
			"Khánh Hòa",
			"Khánh Hải",
			"Khánh Hồng",
			"Khánh Hội",
			"Khánh Lợi",
			"Khánh Mậu",
			"Khánh Nhạc",
			"Khánh Phú",
			"Khánh Thiện",
			"Khánh Thành",
			"Khánh Thủy",
			"Khánh Trung",
			"Khánh Vân",
			"Yên Ninh"
		],
		"district": "Yên Khánh"
	},
	{
		"wards": [
			"Bình Định",
			"Hồng Châu",
			"Liên Châu",
			"Nguyệt Đức",
			"Tam Hồng",
			"Trung Hà",
			"Trung Kiên",
			"Trung Nguyên",
			"Tề Lỗ",
			"Văn Tiến",
			"Yên Lạc",
			"Yên Phương",
			"Yên Đồng",
			"Đại Tự",
			"Đồng Cương",
			"Đồng Văn"
		],
		"district": "Yên Lạc"
	},
	{
		"wards": [
			"Hưng Long",
			"Lương Sơn",
			"Minh Hòa",
			"Mỹ Lung",
			"Mỹ Lương",
			"Nga Hoàng",
			"Ngọc Lập",
			"Ngọc Đồng",
			"Phúc Khánh",
			"Thượng Long",
			"Trung Sơn",
			"Xuân An",
			"Xuân Thủy",
			"Xuân Viên",
			"Yên Lập",
			"Đồng Lạc",
			"Đồng Thịnh"
		],
		"district": "Yên Lập"
	},
	{
		"wards": [
			"Bạch Đích",
			"Du Già",
			"Du Tiến",
			"Hữu Vinh",
			"Lao Và Chải",
			"Lũng Hồ",
			"Mậu Duệ",
			"Mậu Long",
			"Na Khê",
			"Ngam La",
			"Ngọc Long",
			"Phú Lũng",
			"Sủng Thài",
			"Sủng Tráng",
			"Thắng Mố",
			"Yên Minh",
			"Đông Minh",
			"Đường Thượng"
		],
		"district": "Yên Minh"
	},
	{
		"wards": [
			"Khánh Dương",
			"Khánh Thượng",
			"Yên Hòa",
			"Yên Lâm",
			"Yên Mạc",
			"Yên Mỹ",
			"Yên Nhân",
			"Yên Phong",
			"Yên Thành",
			"Yên Thái",
			"Yên Thắng",
			"Yên Thịnh",
			"Yên Từ",
			"Yên Đồng"
		],
		"district": "Yên Mô"
	},
	{
		"wards": [
			"Hoàn Long",
			"Liêu Xá",
			"Nguyễn Văn Linh",
			"Ngọc Long",
			"Thanh Long",
			"Trung Hòa",
			"Tân Lập",
			"Tân Minh",
			"Việt Yên",
			"Yên Mỹ",
			"Yên Phú",
			"Đồng Than"
		],
		"district": "Yên Mỹ"
	},
	{
		"wards": [
			"Chờ",
			"Dũng Liệt",
			"Hòa Tiến",
			"Long Châu",
			"Tam Giang",
			"Tam Đa",
			"Thụy Hòa",
			"Trung Nghĩa",
			"Văn Môn",
			"Yên Phụ",
			"Yên Trung",
			"Đông Phong",
			"Đông Thọ",
			"Đông Tiến"
		],
		"district": "Yên Phong"
	},
	{
		"wards": [
			"Chiêu Yên",
			"Chân Sơn",
			"Công Đa",
			"Hoàng Khai",
			"Hùng Lợi",
			"Kim Quan",
			"Kiến Thiết",
			"Lang Quán",
			"Lực Hành",
			"Mỹ Bằng",
			"Nhữ Hán",
			"Nhữ Khê",
			"Phú Thịnh",
			"Phúc Ninh",
			"Quí Quân",
			"Thái Bình",
			"Tiến Bộ",
			"Trung Minh",
			"Trung Môn",
			"Trung Sơn",
			"Trung Trực",
			"Tân Long",
			"Tân Tiến",
			"Tứ Quận",
			"Xuân Vân",
			"Yên Sơn",
			"Đạo Viện",
			"Đội Bình"
		],
		"district": "Yên Sơn"
	},
	{
		"wards": [
			"Bảo Thành",
			"Bắc Thành",
			"Hoa Thành",
			"Hậu Thành",
			"Kim Thành",
			"Liên Thành",
			"Long Thành",
			"Lăng Thành",
			"Minh Thành",
			"Mã Thành",
			"Mỹ Thành",
			"Nam Thành",
			"Phú Thành",
			"Phúc Thành",
			"Quang Thành",
			"Sơn Thành",
			"Thịnh Thành",
			"Thọ Thành",
			"Tiến Thành",
			"Trung Thành",
			"Tân Thành",
			"Tây Thành",
			"Tăng Thành",
			"Viên Thành",
			"Vân Tụ",
			"Văn Thành",
			"Vĩnh Thành",
			"Xuân Thành",
			"Đô Thành",
			"Đông Thành",
			"Đồng Thành",
			"Đức Thành"
		],
		"district": "Yên Thành"
	},
	{
		"wards": [
			"An Thượng",
			"Bố Hạ",
			"Canh Nậu",
			"Hương Vĩ",
			"Phồn Xương",
			"Tam Tiến",
			"Tiến Thắng",
			"Tân Hiệp",
			"Tân Sỏi",
			"Xuân Lương",
			"Đông Sơn",
			"Đồng Hưu",
			"Đồng Kỳ",
			"Đồng Lạc",
			"Đồng Tiến",
			"Đồng Tâm",
			"Đồng Vương"
		],
		"district": "Yên Thế"
	},
	{
		"wards": [
			"Bảo Hiệu",
			"Hàng Trạm",
			"Hữu Lợi",
			"Lạc Lương",
			"Lạc Sỹ",
			"Lạc Thịnh",
			"Ngọc Lương",
			"Phú Lai",
			"Yên Trị",
			"Đa Phúc",
			"Đoàn Kết"
		],
		"district": "Yên Thủy"
	},
	{
		"wards": [
			"Quán Lào",
			"Quý Lộc",
			"Thống Nhất",
			"Yên Hùng",
			"Yên Lâm",
			"Yên Ninh",
			"Yên Phong",
			"Yên Phú",
			"Yên Thái",
			"Yên Thịnh",
			"Yên Thọ",
			"Yên Trung",
			"Yên Trường",
			"Yên Tâm",
			"Định Bình",
			"Định Công",
			"Định Hòa",
			"Định Hưng",
			"Định Hải",
			"Định Liên",
			"Định Long",
			"Định Thành",
			"Định Tiến",
			"Định Tân",
			"Định Tăng"
		],
		"district": "Yên Định"
	},
	{
		"wards": [
			"Bãi Sậy",
			"Bắc Sơn",
			"Cẩm Ninh",
			"Hoàng Hoa Thám",
			"Hạ Lễ",
			"Hồ Tùng Mậu",
			"Hồng Quang",
			"Nguyễn Trãi",
			"Phù Ủng",
			"Quang Vinh",
			"Quảng Lãng",
			"Tiền Phong",
			"Vân Du",
			"Xuân Trúc",
			"Ân Thi",
			"Đa Lộc",
			"Đào Dương",
			"Đặng Lễ"
		],
		"district": "Ân Thi"
	},
	{
		"wards": [
			"Châu Văn Liêm",
			"Long Hưng",
			"Phước Thới",
			"Thới An",
			"Thới Hòa",
			"Thới Long",
			"Trường Lạc"
		],
		"district": "Ô Môn"
	},
	{
		"wards": [
			"Hồng Quang",
			"Lâm",
			"Phú Hưng",
			"Trung Nghĩa",
			"Tân Minh",
			"Yên Bình",
			"Yên Chính",
			"Yên Cường",
			"Yên Dương",
			"Yên Khang",
			"Yên Khánh",
			"Yên Lương",
			"Yên Lộc",
			"Yên Mỹ",
			"Yên Nhân",
			"Yên Ninh",
			"Yên Phong",
			"Yên Phúc",
			"Yên Thắng",
			"Yên Thọ",
			"Yên Tiến",
			"Yên Trị",
			"Yên Đồng"
		],
		"district": "Ý Yên"
	},
	{
		"wards": [
			"A Bung",
			"A Ngo",
			"A Vao",
			"Ba Lòng",
			"Ba Nang",
			"Húc Nghì",
			"Hướng Hiệp",
			"Krông Klang",
			"Mò Ó",
			"Triệu Nguyên",
			"Tà Long",
			"Tà Rụt",
			"Đa Krông"
		],
		"district": "Đa Krông"
	},
	{
		"wards": [
			"Liêng Srônh",
			"Phi Liêng",
			"Rô Men",
			"Đạ K' Nàng",
			"Đạ Long",
			"Đạ M' Rong",
			"Đạ Rsal",
			"Đạ Tông"
		],
		"district": "Đam Rông"
	},
	{
		"wards": [
			"Hạ Mỗ",
			"Hồng Hà",
			"Liên Hà",
			"Liên Hồng",
			"Liên Trung",
			"Phùng",
			"Phương Đình",
			"Song Phượng",
			"Thượng Mỗ",
			"Thọ An",
			"Thọ Xuân",
			"Trung Châu",
			"Tân Hội",
			"Tân Lập",
			"Đan Phượng",
			"Đồng Tháp"
		],
		"district": "Đan Phượng"
	},
	{
		"wards": [
			"Hua Thanh",
			"Hẹ Muông",
			"Mường Lói",
			"Mường Nhà",
			"Mường Pồn",
			"Na Tông",
			"Na Ư",
			"Noong Luống",
			"Noọng Hẹt",
			"Núa Ngam",
			"Pa Thơm",
			"Phu Luông",
			"Pom Lót",
			"Sam Mứn",
			"Thanh An",
			"Thanh Chăn",
			"Thanh Hưng",
			"Thanh Luông",
			"Thanh Nưa",
			"Thanh Xương",
			"Thanh Yên"
		],
		"district": "Điện Biên"
	},
	{
		"wards": [
			"Him Lam",
			"Mường Phăng",
			"Mường Thanh",
			"Nam Thanh",
			"Noong Bua",
			"Nà Nhạn",
			"Nà Tấu",
			"Pá Khoang",
			"Thanh Bình",
			"Thanh Minh",
			"Thanh Trường",
			"Tân Thanh"
		],
		"district": "Điện Biên Phủ"
	},
	{
		"wards": [
			"Chiềng Sơ",
			"Háng Lìa",
			"Keo Lôm",
			"Luân Giới",
			"Mường Luân",
			"Na Son",
			"Nong U",
			"Phì Nhừ",
			"Phình Giàng",
			"Pú Hồng",
			"Pú Nhi",
			"Tìa Dình",
			"Xa Dung",
			"Điện Biên Đông"
		],
		"district": "Điện Biên Đông"
	},
	{
		"wards": [
			"Vĩnh Điện",
			"Điện An",
			"Điện Dương",
			"Điện Hòa",
			"Điện Hồng",
			"Điện Minh",
			"Điện Nam Bắc",
			"Điện Nam Trung",
			"Điện Nam Đông",
			"Điện Ngọc",
			"Điện Phong",
			"Điện Phương",
			"Điện Phước",
			"Điện Quang",
			"Điện Thắng Bắc",
			"Điện Thắng Nam",
			"Điện Thắng Trung",
			"Điện Thọ",
			"Điện Tiến",
			"Điện Trung"
		],
		"district": "Điện Bàn"
	},
	{
		"wards": [
			"Bằng Doãn",
			"Bằng Luân",
			"Ca Đình",
			"Chân Mộng",
			"Chí Đám",
			"Hùng Long",
			"Hùng Xuyên",
			"Hợp Nhất",
			"Ngọc Quan",
			"Phú Lâm",
			"Phúc Lai",
			"Tây Cốc",
			"Yên Kiện",
			"Đoan Hùng"
		],
		"district": "Đoan Hùng"
	},
	{
		"wards": [
			"Cao Sơn",
			"Giáp Đắt",
			"Hiền Lương",
			"Mường Chiềng",
			"Nánh Nghê",
			"Tiền Phong",
			"Toàn Sơn",
			"Trung Thành",
			"Tân Minh",
			"Tân Pheo",
			"Tú Lý",
			"Vầy Nưa",
			"Yên Hòa",
			"Đoàn Kết",
			"Đà Bắc",
			"Đồng Chum",
			"Đồng Ruộng"
		],
		"district": "Đà Bắc"
	},
	{
		"wards": [
			"1",
			"10",
			"11",
			"12",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"Trạm Hành",
			"Tà Nung",
			"Xuân Thọ",
			"Xuân Trường"
		],
		"district": "Đà Lạt"
	},
	{
		"wards": [
			"Bính Xá",
			"Bắc Lãng",
			"Bắc Xa",
			"Châu Sơn",
			"Cường Lợi",
			"Kiên Mộc",
			"Lâm Ca",
			"NT Thái Bình",
			"Thái Bình",
			"Đình Lập",
			"Đình Lập",
			"Đồng Thắng"
		],
		"district": "Đình Lập"
	},
	{
		"wards": [
			"Bài Sơn",
			"Bạch Ngọc",
			"Bắc Sơn",
			"Bồi Sơn",
			"Giang Sơn Tây",
			"Giang Sơn Đông",
			"Hiến Sơn",
			"Hòa Sơn",
			"Hồng Sơn",
			"Lưu Sơn",
			"Lạc Sơn",
			"Minh Sơn",
			"Mỹ Sơn",
			"Nam Sơn",
			"Nhân Sơn",
			"Quang Sơn",
			"Thuận Sơn",
			"Thái Sơn",
			"Thượng Sơn",
			"Thịnh Sơn",
			"Trung Sơn",
			"Tràng Sơn",
			"Trù Sơn",
			"Tân Sơn",
			"Văn Sơn",
			"Xuân Sơn",
			"Yên Sơn",
			"Đà Sơn",
			"Đô Lương",
			"Đông Sơn",
			"Đại Sơn",
			"Đặng Sơn"
		],
		"district": "Đô Lương"
	},
	{
		"wards": [
			"Bắc Hồng",
			"Cổ Loa",
			"Dục Tú",
			"Hải Bối",
			"Kim Chung",
			"Kim Nỗ",
			"Liên Hà",
			"Mai Lâm",
			"Nam Hồng",
			"Nguyên Khê",
			"Thuỵ Lâm",
			"Tiên Dương",
			"Tàm Xá",
			"Uy Nỗ",
			"Việt Hùng",
			"Vân Hà",
			"Vân Nội",
			"Võng La",
			"Vĩnh Ngọc",
			"Xuân Canh",
			"Xuân Nộn",
			"Đông Anh",
			"Đông Hội",
			"Đại Mạch"
		],
		"district": "Đông Anh"
	},
	{
		"wards": [
			"A Rooi",
			"A Ting",
			"Ba",
			"Jơ Ngây",
			"Ka Dăng",
			"Mà Cooi",
			"P Rao",
			"Sông Kôn",
			"Tà Lu",
			"Tư",
			"Za Hung"
		],
		"district": "Đông Giang"
	},
	{
		"wards": [
			"1",
			"2",
			"3",
			"4",
			"5",
			"Đông Giang",
			"Đông Lương",
			"Đông Lễ",
			"Đông Thanh"
		],
		"district": "Đông Hà"
	},
	{
		"wards": [
			"Hoà Hiệp Trung",
			"Hoà Vinh",
			"Hòa Hiệp Bắc",
			"Hòa Hiệp Nam",
			"Hòa Thành",
			"Hòa Tâm",
			"Hòa Tân Đông",
			"Hòa Xuân Nam",
			"Hòa Xuân Tây",
			"Hòa Xuân Đông"
		],
		"district": "Đông Hòa"
	},
	{
		"wards": [
			"Hà Giang",
			"Hồng Bạch",
			"Hồng Giang",
			"Hồng Việt",
			"Liên An Đô",
			"Liên Hoa",
			"Lô Giang",
			"Minh Phú",
			"Minh Tân",
			"Mê Linh",
			"Nguyên Xá",
			"Phong Dương Tiến",
			"Phú Châu",
			"Phú Lương",
			"Thăng Long",
			"Trọng Quan",
			"Xuân Quang Động",
			"Đông Các",
			"Đông Cường",
			"Đông Dương",
			"Đông Hoàng",
			"Đông Hưng",
			"Đông Hợp",
			"Đông Kinh",
			"Đông La",
			"Đông Phương",
			"Đông Quan",
			"Đông Sơn",
			"Đông Tân",
			"Đông Vinh",
			"Đông Xá",
			"Đông Á"
		],
		"district": "Đông Hưng"
	},
	{
		"wards": [
			"An Phúc",
			"An Trạch",
			"An Trạch A",
			"Gành Hào",
			"Long Điền",
			"Long Điền Tây",
			"Long Điền Đông",
			"Long Điền Đông A",
			"Điền Hải",
			"Định Thành",
			"Định Thành A"
		],
		"district": "Đông Hải"
	},
	{
		"wards": [
			"An Sinh",
			"Bình Dương",
			"Bình Khê",
			"Hoàng Quế",
			"Hưng Đạo",
			"Hồng Phong",
			"Hồng Thái Tây",
			"Hồng Thái Đông",
			"Kim Sơn",
			"Mạo Khê",
			"Nguyễn Huệ",
			"Thủy An",
			"Tràng An",
			"Tràng Lương",
			"Việt Dân",
			"Xuân Sơn",
			"Yên Thọ",
			"Yên Đức",
			"Đức Chính"
		],
		"district": "Đông Triều"
	},
	{
		"wards": [
			"Quảng Hoà",
			"Quảng Khê",
			"Quảng Sơn",
			"Đắk Ha",
			"Đắk Plao",
			"Đắk R'Măng",
			"Đắk Som"
		],
		"district": "Đăk Glong"
	},
	{
		"wards": [
			"An Thành",
			"Cư An",
			"Hà Tam",
			"Phú An",
			"Tân An",
			"Ya Hội",
			"Yang Bắc",
			"Đak Pơ"
		],
		"district": "Đăk Pơ"
	},
	{
		"wards": [
			"A Dơk",
			"Glar",
			"H' Neng",
			"HNol",
			"Hà Bầu",
			"Hà Đông",
			"Hải Yang",
			"Ia Băng",
			"Ia Pết",
			"K' Dang",
			"Kon Gang",
			"Nam Yang",
			"Trang",
			"Tân Bình",
			"Đăk Krong",
			"Đăk Sơmei",
			"Đăk Đoa"
		],
		"district": "Đăk Đoa"
	},
	{
		"wards": [
			"D'Ran",
			"Ka Đô",
			"Ka Đơn",
			"Lạc Lâm",
			"Lạc Xuân",
			"Quảng Lập",
			"Thạnh Mỹ",
			"Tu Tra",
			"Đạ Ròn"
		],
		"district": "Đơn Dương"
	},
	{
		"wards": [
			"An Nhơn",
			"Bà Gia",
			"Cát Tiên",
			"Gia Viễn",
			"Hà Lâm",
			"Ma Đa Guôi",
			"Ma Đa Guôi",
			"Mỹ Đức",
			"Nam Ninh",
			"Phước Cát",
			"Phước Cát 2",
			"Quảng Ngãi",
			"Quảng Trị",
			"Quốc Oai",
			"Tiên Hoàng",
			"Đạ Kho",
			"Đạ Lây",
			"Đạ M'ri",
			"Đạ Oai",
			"Đạ Pal",
			"Đạ Tẻh",
			"Đồng Nai Thượng",
			"Đức Phổ"
		],
		"district": "Đạ Tẻh"
	},
	{
		"wards": [
			"Ái Nghĩa",
			"Đại An",
			"Đại Chánh",
			"Đại Cường",
			"Đại Hiệp",
			"Đại Hòa",
			"Đại Hưng",
			"Đại Hồng",
			"Đại Lãnh",
			"Đại Minh",
			"Đại Nghĩa",
			"Đại Phong",
			"Đại Quang",
			"Đại Sơn",
			"Đại Thạnh",
			"Đại Thắng",
			"Đại Tân",
			"Đại Đồng"
		],
		"district": "Đại Lộc"
	},
	{
		"wards": [
			"An Khánh",
			"Bình Thuận",
			"Bản Ngoại",
			"Cát Nê",
			"Cù Vân",
			"Hoàng Nông",
			"Hà Thượng",
			"Hùng Sơn",
			"Khôi Kỳ",
			"La Bằng",
			"Lục Ba",
			"Minh Tiến",
			"Mỹ Yên",
			"Phú Cường",
			"Phú Lạc",
			"Phú Thịnh",
			"Phú Xuyên",
			"Phúc Lương",
			"Phục Linh",
			"Quân Chu",
			"Tiên Hội",
			"Tân Linh",
			"Tân Thái",
			"Văn Yên",
			"Vạn Phú",
			"Yên Lãng",
			"Đức Lương"
		],
		"district": "Đại Từ"
	},
	{
		"wards": [
			"Nguyễn Huân",
			"Ngọc Chánh",
			"Quách Phẩm",
			"Quách Phẩm Bắc",
			"Thanh Tùng",
			"Trần Phán",
			"Tân Duyệt",
			"Tân Dân",
			"Tân Thuận",
			"Tân Tiến",
			"Tân Trung",
			"Tân Đức",
			"Tạ An Khương",
			"Tạ An Khương Nam",
			"Tạ An Khương Đông",
			"Đầm Dơi"
		],
		"district": "Đầm Dơi"
	},
	{
		"wards": [
			"Dực Yên",
			"Quảng An",
			"Quảng Lâm",
			"Quảng Tân",
			"Tân Bình",
			"Tân Lập",
			"Đại Bình",
			"Đầm Hà",
			"Đầm Hà"
		],
		"district": "Đầm Hà"
	},
	{
		"wards": [
			"Mường Hoong",
			"Ngọc Linh",
			"Xốp",
			"Đắk Blô",
			"Đắk Choong",
			"Đắk Glei",
			"Đắk KRoong",
			"Đắk Long",
			"Đắk Man",
			"Đắk Môn",
			"Đắk Nhoong",
			"Đắk Pék"
		],
		"district": "Đắk Glei"
	},
	{
		"wards": [
			"Hà Mòn",
			"Ngok Réo",
			"Ngok Wang",
			"Đăk Long",
			"Đăk Ngọk",
			"Đắk HRing",
			"Đắk Hà",
			"Đắk La",
			"Đắk Mar",
			"Đắk PXi",
			"Đắk Ui"
		],
		"district": "Đắk Hà"
	},
	{
		"wards": [
			"Long Sơn",
			"Thuận An",
			"Đắk Gằn",
			"Đắk Lao",
			"Đắk Mil",
			"Đắk N'Drót",
			"Đắk R'La",
			"Đắk Sắk",
			"Đức Minh",
			"Đức Mạnh"
		],
		"district": "Đắk Mil"
	},
	{
		"wards": [
			"Hưng Bình",
			"Kiến Thành",
			"Kiến Đức",
			"Nghĩa Thắng",
			"Nhân Cơ",
			"Nhân Đạo",
			"Quảng Tín",
			"Đạo Nghĩa",
			"Đắk Ru",
			"Đắk Sin",
			"Đắk Wer"
		],
		"district": "Đắk R'Lấp"
	},
	{
		"wards": [
			"Nam Bình",
			"Nâm N'Jang",
			"Thuận Hà",
			"Thuận Hạnh",
			"Trường Xuân",
			"Đắk Hòa",
			"Đắk Môl",
			"Đắk N'Dung",
			"Đức An"
		],
		"district": "Đắk Song"
	},
	{
		"wards": [
			"Diên Bình",
			"Kon Đào",
			"Ngọk Tụ",
			"Pô Kô",
			"Tân Cảnh",
			"Văn Lem",
			"Đắk Rơ Nga",
			"Đắk Trăm",
			"Đắk Tô"
		],
		"district": "Đắk Tô"
	},
	{
		"wards": [
			"Bình Thành",
			"Bình Yên",
			"Bảo Linh",
			"Bộc Nhiêu",
			"Chợ Chu",
			"Kim Phượng",
			"Lam Vỹ",
			"Linh Thông",
			"Phú Tiến",
			"Phú Đình",
			"Phúc Chu",
			"Phượng Tiến",
			"Quy Kỳ",
			"Sơn Phú",
			"Thanh Định",
			"Trung Hội",
			"Trung Lương",
			"Tân Dương",
			"Tân Thịnh",
			"Điềm Mặc",
			"Định Biên",
			"Đồng Thịnh"
		],
		"district": "Định Hóa"
	},
	{
		"wards": [
			"Gia Canh",
			"La Ngà",
			"Ngọc Định",
			"Phú Cường",
			"Phú Hòa",
			"Phú Lợi",
			"Phú Ngọc",
			"Phú Tân",
			"Phú Túc",
			"Phú Vinh",
			"Suối Nho",
			"Thanh Sơn",
			"Túc Trưng",
			"Định Quán"
		],
		"district": "Định Quán"
	},
	{
		"wards": [
			"Cát Linh",
			"Hàng Bột",
			"Khâm Thiên",
			"Khương Thượng",
			"Kim Liên",
			"Láng Hạ",
			"Láng Thượng",
			"Nam Đồng",
			"Phương Liên - Trung Tự",
			"Phương Mai",
			"Quang Trung",
			"Thịnh Quang",
			"Thổ Quan",
			"Trung Liệt",
			"Văn Chương",
			"Văn Miếu - Quốc Tử Giám",
			"Ô Chợ Dừa"
		],
		"district": "Đống Đa"
	},
	{
		"wards": [
			"Bàng La",
			"Hải Sơn",
			"Hợp Đức",
			"Minh Đức",
			"Ngọc Xuyên",
			"Vạn Hương"
		],
		"district": "Đồ Sơn"
	},
	{
		"wards": [
			"Bảo Ninh",
			"Bắc Lý",
			"Bắc Nghĩa",
			"Hải Thành",
			"Lộc Ninh",
			"Nam Lý",
			"Nghĩa Ninh",
			"Phú Hải",
			"Quang Phú",
			"Thuận Đức",
			"Đồng Hải",
			"Đồng Phú",
			"Đồng Sơn",
			"Đức Ninh",
			"Đức Ninh Đông"
		],
		"district": "Đồng Hới"
	},
	{
		"wards": [
			"Cây Thị",
			"Hòa Bình",
			"Hóa Thượng",
			"Hóa Trung",
			"Hợp Tiến",
			"Khe Mo",
			"Minh Lập",
			"Nam Hòa",
			"Quang Sơn",
			"Sông Cầu",
			"Trại Cau",
			"Tân Long",
			"Văn Hán",
			"Văn Lăng"
		],
		"district": "Đồng Hỷ"
	},
	{
		"wards": [
			"Thuận Lợi",
			"Thuận Phú",
			"Tân Hòa",
			"Tân Hưng",
			"Tân Lập",
			"Tân Lợi",
			"Tân Phú",
			"Tân Phước",
			"Tân Tiến",
			"Đồng Tiến",
			"Đồng Tâm"
		],
		"district": "Đồng Phú"
	},
	{
		"wards": [
			"Hố Quáng Phìn",
			"Lũng Cú",
			"Lũng Phìn",
			"Lũng Thầu",
			"Lũng Táo",
			"Má Lé",
			"Phó Bảng",
			"Phố Cáo",
			"Phố Là",
			"Sính Lủng",
			"Sảng Tủng",
			"Sủng Là",
			"Sủng Trái",
			"Thài Phìn Tủng",
			"Tả Lủng",
			"Tả Phìn",
			"Vần Chải",
			"Xà Phìn",
			"Đồng Văn"
		],
		"district": "Đồng Văn"
	},
	{
		"wards": [
			"Tiến Hưng",
			"Tiến Thành",
			"Tân Bình",
			"Tân Phú",
			"Tân Thiện",
			"Tân Thành",
			"Tân Xuân",
			"Tân Đồng"
		],
		"district": "Đồng Xoài"
	},
	{
		"wards": [
			"La Hai",
			"Phú Mỡ",
			"Xuân Long",
			"Xuân Lãnh",
			"Xuân Phước",
			"Xuân Quang 1",
			"Xuân Quang 2",
			"Xuân Quang 3",
			"Xuân Sơn Bắc",
			"Xuân Sơn Nam",
			"Đa Lộc"
		],
		"district": "Đồng Xuân"
	},
	{
		"wards": [
			"Chư Ty",
			"Ia Din",
			"Ia Dom",
			"Ia Dơk",
			"Ia Kla",
			"Ia Kriêng",
			"Ia Krêl",
			"Ia Lang",
			"Ia Nan",
			"Ia Pnôn"
		],
		"district": "Đức Cơ"
	},
	{
		"wards": [
			"Bình Hòa Bắc",
			"Bình Hòa Hưng",
			"Bình Hòa Nam",
			"Bình Thành",
			"Mỹ Bình",
			"Mỹ Quý Tây",
			"Mỹ Quý Đông",
			"Mỹ Thạnh Bắc",
			"Mỹ Thạnh Tây",
			"Mỹ Thạnh Đông",
			"Đông Thành"
		],
		"district": "Đức Huệ"
	},
	{
		"wards": [
			"An Ninh Tây",
			"An Ninh Đông",
			"Hiệp Hòa",
			"Hiệp Hòa",
			"Hòa Khánh Nam",
			"Hòa Khánh Tây",
			"Hòa Khánh Đông",
			"Hậu Nghĩa",
			"Hựu Thạnh",
			"Lộc Giang",
			"Mỹ Hạnh Bắc",
			"Mỹ Hạnh Nam",
			"Tân Mỹ",
			"Tân Phú",
			"Đức Hòa",
			"Đức Hòa Hạ",
			"Đức Hòa Thượng",
			"Đức Hòa Đông",
			"Đức Lập Hạ",
			"Đức Lập Thượng"
		],
		"district": "Đức Hòa"
	},
	{
		"wards": [
			"Mê Pu",
			"Nam Chính",
			"Sùng Nhơn",
			"Trà Tân",
			"Tân Hà",
			"Võ Xu",
			"Vũ Hoà",
			"Đa Kai",
			"Đông Hà",
			"Đức Hạnh",
			"Đức Tài",
			"Đức Tín"
		],
		"district": "Đức Linh"
	},
	{
		"wards": [
			"Nguyễn Nghiêm",
			"Phổ An",
			"Phổ Châu",
			"Phổ Cường",
			"Phổ Hòa",
			"Phổ Khánh",
			"Phổ Minh",
			"Phổ Nhơn",
			"Phổ Ninh",
			"Phổ Phong",
			"Phổ Quang",
			"Phổ Thuận",
			"Phổ Thạnh",
			"Phổ Vinh",
			"Phổ Văn"
		],
		"district": "Đức Phổ"
	},
	{
		"wards": [
			"An Dũng",
			"Bùi La Nhân",
			"Hòa Lạc",
			"Liên Minh",
			"Lâm Trung Thủy",
			"Quang Vĩnh",
			"Thanh Bình Thịnh",
			"Trường Sơn",
			"Tân Dân",
			"Tân Hương",
			"Tùng Châu",
			"Tùng Ảnh",
			"Yên Hồ",
			"Đức Lạng",
			"Đức Thọ",
			"Đức Đồng"
		],
		"district": "Đức Thọ"
	},
	{
		"wards": [
			"Bình Thạnh",
			"Hiệp An",
			"Hiệp Thạnh",
			"Liên Hiệp",
			"Liên Nghĩa",
			"N'Thol Hạ",
			"Ninh Gia",
			"Ninh Loan",
			"Phú Hội",
			"Tà Hine",
			"Tà Năng",
			"Tân Hội",
			"Tân Thành",
			"Đa Quyn",
			"Đà Loan"
		],
		"district": "Đức Trọng"
	},
	{
		"wards": [
			"Bình Lưu Quang",
			"Cao Sơn Tiến",
			"Hoa Viên",
			"Hòa Phú",
			"Kim Đường",
			"Liên Bạt",
			"Minh Đức",
			"Phù Lưu",
			"Phương Tú",
			"Quảng Phú Cầu",
			"Thái Hòa",
			"Trung Tú",
			"Trường Thịnh",
			"Trầm Lộng",
			"Tảo Dương Văn",
			"Vân Đình",
			"Đông Lỗ",
			"Đại Cường",
			"Đại Hùng",
			"Đồng Tân"
		],
		"district": "Ứng Hòa"
	}
]