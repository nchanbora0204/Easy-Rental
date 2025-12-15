export const msPerDay = 24 * 60 * 60 * 1000;

export const fmtDate = (d) => d.toISOString().slice(0, 10);

export const buildViewRange = (currentMonth) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  const start = new Date(monthStart);
  const day = start.getDay() || 7; // T2=1 ... CN=7
  start.setDate(start.getDate() - (day - 1));
  start.setHours(0, 0, 0, 0);

  const end = new Date(monthEnd);
  const endDay = end.getDay() || 7;
  end.setDate(end.getDate() + (7 - endDay));
  end.setHours(23, 59, 59, 999);

  return { start, end, monthStart, monthEnd };
};

export const buildDays = (viewRange) => {
  const arr = [];
  const d = new Date(viewRange.start);
  while (d.getTime() <= viewRange.end.getTime()) {
    arr.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return arr;
};

export const buildDayMap = (events) => {
  const map = {};

  (events?.bookings || []).forEach((b) => {
    if (!b?.pickupDate || !b?.returnDate) return;

    const start = new Date(b.pickupDate);
    const end = new Date(b.returnDate);

    let cur = new Date(start);
    cur.setHours(0, 0, 0, 0);

    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    while (cur.getTime() <= last.getTime()) {
      const key = fmtDate(cur);
      if (!map[key]) map[key] = { bookings: [], block: null };
      map[key].bookings.push(b);
      cur = new Date(cur.getTime() + msPerDay);
    }
  });

  (events?.blocks || []).forEach((blk) => {
    const d = new Date(blk.date);
    const key = fmtDate(d);
    if (!map[key]) map[key] = { bookings: [], block: blk };
    else map[key].block = blk;
  });

  return map;
};

export const isToday = (day) => {
  const t = new Date();
  return (
    t.getFullYear() === day.getFullYear() &&
    t.getMonth() === day.getMonth() &&
    t.getDate() === day.getDate()
  );
};
