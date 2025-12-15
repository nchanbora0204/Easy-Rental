export const HERO_STATS = [
  ["50K+", "Chủ xe"],
  ["10–15tr", "Thu nhập/tháng"],
  ["24/7", "Hỗ trợ"],
  ["100%", "Bảo hiểm"],
];

export const CITY_OPTIONS = [
  { value: "Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
];

export const CAR_BRANDS = ["Toyota", "Honda", "Mazda", "Hyundai", "KIA", "VinFast", "Ford"];

export const SEATS_OPTIONS = [
  { value: "4", label: "4 chỗ" },
  { value: "5", label: "5 chỗ" },
  { value: "7", label: "7 chỗ" },
  { value: "9", label: "9 chỗ" },
];

export const TRANSMISSION_OPTIONS = [
  { value: "automatic", label: "Số tự động" },
  { value: "manual", label: "Số sàn" },
];

export const FUEL_OPTIONS = [
  { value: "Xăng", label: "Xăng" },
  { value: "Dầu diesel", label: "Dầu diesel" },
  { value: "Điện", label: "Điện" },
  { value: "Hybrid", label: "Hybrid" },
];

export const STEPS = [
  {
    step: 1,
    title: "Chuẩn bị xe & giấy tờ cần thiết",
    desc: "Đủ giấy tờ hợp lệ, bảo hiểm còn hạn, tình trạng xe tốt.",
  },
  {
    step: 2,
    title: "Đăng thông tin xe minh bạch",
    desc: "Nhập thông tin, tải ảnh/giấy tờ lên hệ thống.",
  },
  {
    step: 3,
    title: "Nhận thu nhập khi cho thuê",
    desc: "Xe hiển thị cho khách; bắt đầu nhận đơn & doanh thu.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Anh Minh",
    car: "Toyota Vios 2022",
    rating: 5,
    text: "Thu nhập ổn định 12–15 triệu/tháng. Quy trình đơn giản, hỗ trợ nhiệt tình.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Chị Hương",
    car: "Honda City 2021",
    rating: 5,
    text: "An tâm vì có bảo hiểm & xác minh khách chặt chẽ.",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Anh Tuấn",
    car: "Mazda 3 2020",
    rating: 5,
    text: "Đăng ký dễ, thanh toán nhanh. Xe được khách giữ gìn.",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
];

export const COMPARE_ROWS = [
  ["Bảo hiểm xe toàn diện", true, false, false],
  ["Hỗ trợ 24/7", true, false, false],
  ["Xác minh khách hàng", true, false, true],
  ["Thanh toán nhanh chóng", true, false, true],
  ["Phí dịch vụ thấp", true, true, false],
];

export const INITIAL_FORM = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  district: "",
  address: "",
  carBrand: "",
  carModel: "",
  year: "",
  licensePlate: "",
  seats: "",
  transmission: "",
  fuel: "",
  pricePerDay: "",
  notes: "",
  agreeTerms: false,
};
