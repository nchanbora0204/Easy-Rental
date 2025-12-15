export const getIsLocked = (u) => Boolean(u?.isLocked ?? u?.locked);

export const totalPages = (total, limit) =>
  total ? Math.ceil(total / limit) : 1;
