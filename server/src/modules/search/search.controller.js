import { semanticSearchCars } from "./semantic.service.js";

export const searchCarsSemantic = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const limit = Number(req.query.limit) || 20;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const results = await semanticSearchCars({ text: q, limit });

    return res.json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.error("searchCarsSemantic error:", e);

    if (e.message === "SEMANTIC_DISABLED_NO_KEY") {
      return res.status(500).json({
        success: false,
        message:
          "Tìm kiếm thông minh chưa được bật (chưa cấu hình GEMINI_API_KEY).",
      });
    }

    if (e.message === "SEMANTIC_QUOTA_EXCEEDED") {
      return res.status(429).json({
        success: false,
        message:
          "Đã hết quota semantic search (Gemini). Thử lại sau hoặc kiểm tra billing.",
      });
    }

    return res.status(500).json({
      success: false,
      message: e.message || "Lỗi tìm kiếm thông minh.",
    });
  }
};
