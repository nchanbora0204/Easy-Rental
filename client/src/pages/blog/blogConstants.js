export const SUPPORT_PHONE = "0916549515";
export const ZALO_LINK = "https://zalo.me/0916549515";

export const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "travel", label: "Cẩm nang du lịch" },
  { id: "tips", label: "Kinh nghiệm thuê xe" },
  { id: "cars", label: "Đánh giá & dòng xe" },
  { id: "news", label: "Tin tức & Ưu đãi" },
  { id: "stories", label: "Câu chuyện khách hàng" },
];

export const CATEGORY_LABELS = CATEGORIES.reduce((acc, c) => {
  if (c.id !== "all") acc[c.id] = c.label;
  return acc;
}, {});

export const FALLBACK_FEATURED_THUMB =
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop";

export const FALLBACK_DETAIL_THUMB =
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&h=700&fit=crop";
  
export const FALLBACK_CARD_THUMB =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop";

export const FALLBACK_RECENT_THUMB =
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=600&fit=crop";
