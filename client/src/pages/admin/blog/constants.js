export const CATEGORY_LABELS = {
  travel: "Cẩm nang du lịch",
  tips: "Kinh nghiệm thuê xe",
  cars: "Đánh giá & dòng xe",
  news: "Tin tức & Ưu đãi",
  stories: "Câu chuyện khách hàng",
};

export const CATEGORY_OPTIONS = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "travel", label: "Cẩm nang du lịch" },
  { value: "tips", label: "Kinh nghiệm thuê xe" },
  { value: "cars", label: "Đánh giá & dòng xe" },
  { value: "news", label: "Tin tức & Ưu đãi" },
  { value: "stories", label: "Câu chuyện khách hàng" },
];

export const BLOG_CATEGORY_OPTIONS = CATEGORY_OPTIONS.filter(
  (o) => o.value !== "all"
);

export const BLOG_LIST_DEFAULT_PARAMS = {
  limit: 100,
  sort: "recent",
  includeUnpublished: "true",
};
