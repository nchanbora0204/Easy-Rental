export const CITY_META = [
  {
    slug: "hcm",
    label: "TP. Hồ Chí Minh",
    image: "/cities/sg.jpg",
    aliases: [
      "Hồ Chí Minh",
      "TP. Hồ Chí Minh",
      "TP Hồ Chí Minh",
      "Ho Chi Minh",
      "Thành phố Hồ Chí Minh",
    ],
  },
  {
    slug: "hanoi",
    label: "Hà Nội",
    image: "/cities/hn.jpg",
    aliases: ["Hà Nội", "Ha Noi", "Thành phố Hà Nội"],
  },
  {
    slug: "danang",
    label: "Đà Nẵng",
    image: "/cities/dn.jpg",
    aliases: ["Đà Nẵng", "Da Nang", "Thanh pho Da Nang"],
  },
  {
    slug: "cantho",
    label: "Cần Thơ",
    image: "/cities/ct.jpg",
    aliases: ["Cần Thơ", "Can Tho", "TP. Cần Thơ"],
  },
  {
    slug: "nhatrang",
    label: "Nha Trang",
    image: "/cities/nt.jpg",
    aliases: ["Nha Trang", "Thành phố Nha Trang"],
  },
];

export const CITY_OPTIONS = CITY_META.map(({ slug, label }) => ({
  value: slug,
  label,
}));

export const HERO_SLIDES = [
  {
    id: 1,
    src: "/scenery/camping.jpg",
    alt: "Hành trình khám phá cùng gia đình",
  },
  {
    id: 2,
    src: "/scenery/ntview.jpg",
    alt: "Du lịch biển cùng bạn bè",
  },
  {
    id: 3,
    src: "/scenery/road.jpg",
    alt: "Công tác linh hoạt trong thành phố",
  },
];

export const BRAND_LOGOS = {
  NISSAN: "/brands/nissan.png",
  BMW: "/brands/bmw.png",
  KIA: "/brands/kia.png",
  MG: "/brands/MG.png",
  HONDA: "/brands/honda.png",
  MAZDA: "/brands/mazda.png",
  VOLKSWAGEN: "/brands/volkswagen.png",
  MERCEDES: "/brands/mercedes.png",
  TOYOTA: "/brands/toyota.png",
  FORD: "/brands/ford.png",
  MITSUBISHI: "/brands/mitsubishi.png",
  HYUNDAI: "/brands/hyundai.png",
  AUDI: "/brands/audi.png",
  VOLVO: "/brands/volvo.png",
  SUBARU: "/brands/subaru.png",
  LEXUS: "/brands/lexus.png",
};

export const SUPPORT_PHONE = "0916549515";
export const ZALO_LINK = "https://zalo.me/0916549515";
