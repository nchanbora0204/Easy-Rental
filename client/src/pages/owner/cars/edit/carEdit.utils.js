export const mapCarToForm = (car) => {
  return {
    f: {
      brand: car?.brand || "",
      model: car?.model || "",
      year: car?.year ? String(car.year) : "",
      seatingCapacity: car?.seatingCapacity ? String(car.seatingCapacity) : "",
      transmission: car?.transmission || "automatic",
      pricePerDay: car?.pricePerDay ? String(car.pricePerDay) : "",
      fuelConsumption: car?.fuelConsumption || "",
      segment: car?.segment || "standard",
    },
    location: {
      city: car?.location?.city || "",
      district: car?.location?.district || "",
      address: car?.location?.address || "",
    },
  };
};

export const buildUpdatePayload = ({ f, location }) => {
  const payload = {
    brand: f.brand.trim(),
    model: f.model.trim(),
    year: f.year ? Number(f.year) : undefined,
    seatingCapacity: f.seatingCapacity ? Number(f.seatingCapacity) : undefined,
    transmission: f.transmission,
    pricePerDay: f.pricePerDay ? Number(f.pricePerDay) : undefined,
    fuelConsumption: f.fuelConsumption.trim() || undefined,
    segment: f.segment,
    location: {
      city: location.city.trim(),
      district: location.district.trim(),
      address: location.address.trim(),
    },
  };

  return payload;
};
