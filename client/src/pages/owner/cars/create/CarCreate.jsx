import { useState } from "react";
import OwnerLayout from "../../layout/OwnerLayout";

import { CarCreateHeader } from "./components/CarCreateHeader";
import { CarCreateMessage } from "./components/CarCreateMessage";
import { CarInfoSection } from "./components/CarInfoSection";
import { CarSpecsSection } from "./components/CarSpecsSection";
import { CarFuelSection } from "./components/CarFuelSection";
import { CarLocationSection } from "./components/CarLocationSection";
import { CarImagesSection } from "./components/CarImagesSection";
import { CarCreateActions } from "./components/CarCreateActions";

import { buildCreateCarFormData } from "./carCreate.utils";
import { createCar } from "./carCreate.service";

export const CarCreate = () => {
  const [f, setF] = useState({
    brand: "",
    model: "",
    year: "",
    seatingCapacity: "",
    transmission: "manual",
    pricePerDay: "",
    fuelConsumption: "",
    segment: "standard",
  });

  const [location, setLocation] = useState({
    city: "",
    district: "",
    address: "",
  });

  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      setMsg("Vui lòng tải lên ít nhất 1 ảnh xe.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const fd = buildCreateCarFormData({ f, location, files });
      const data = await createCar(fd);

      setMsg(`Đã tạo: ${data?.data?.brand} ${data?.data?.model}`);

      setF((prev) => ({
        ...prev,
        brand: "",
        model: "",
        pricePerDay: "",
      }));
      setFiles([]);
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <CarCreateHeader />

          <form onSubmit={submit} className="p-6 space-y-6">
            <CarCreateMessage msg={msg} />

            <CarInfoSection f={f} setF={setF} />

            <CarSpecsSection f={f} setF={setF} />

            <CarFuelSection f={f} setF={setF} />

            <CarLocationSection location={location} setLocation={setLocation} />

            <CarImagesSection files={files} setFiles={setFiles} />

            <CarCreateActions loading={loading} />
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default CarCreate;
