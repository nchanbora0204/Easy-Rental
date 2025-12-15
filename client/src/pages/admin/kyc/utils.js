import { DOC_FIELDS } from "./constants";

export const pickFirst = (...vals) => {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    return v;
  }
  return null;
};

export const normalizeList = (res) => {
  const data = res?.data?.data ?? res?.data ?? [];
  let list = data;

  if (!Array.isArray(list) && typeof list === "object") {
    if (Array.isArray(list.items)) list = list.items;
    else if (Array.isArray(list.rows)) list = list.rows;
    else if (Array.isArray(list.docs)) list = list.docs;
    else list = [];
  }
  return Array.isArray(list) ? list : [];
};

export const buildDocUrls = (profile) =>
  DOC_FIELDS.map((d) => ({
    ...d,
    url: profile?.[d.key] || null,
  }));

export const formatCreatedAt = (createdAt) => {
  if (!createdAt) return "";
  try {
    return new Date(createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};
