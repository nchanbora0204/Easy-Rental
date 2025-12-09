export const buildCarSearchText = (car) => {
  if (!car) return "";

  const parts = [];

  if (car.brand) parts.push(String(car.brand));
  if (car.model) parts.push(String(car.model));
  if (car.segment) parts.push(String(car.segment));
  if (car.transmission) parts.push(String(car.transmission));
  if (car.fuelType) parts.push(String(car.fuelType));

  if (car.seatingCapacity) {
    parts.push(`${car.seatingCapacity} chỗ`);
  }

  const loc = car.location || car.city || car.address;
  if (typeof loc === "string") {
    parts.push(loc);
  } else if (loc && typeof loc === "object") {
    const { address, ward, district, city, provide, state } = loc;
    parts.push(
      [address, ward, district, city, provide, state].filter(Boolean).join(", ")
    );
  }

  if (Array.isArray(car.features)) {
    parts.push(car.features.join(", "));
  }

  if (car.descriptions) {
    parts.push(String(car.descriptions));
  }

  return parts
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(" | ");
};

