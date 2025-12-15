import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OwnerLayout from "../../layout/OwnerLayout";

import { CarEditBackButton } from "./components/CarEditBackButton";
import { CarEditHeader } from "./components/CarEditHeader";
import { CarEditAlert } from "./components/CarEditAlert";
import { CarEditFetching } from "./components/CarEditFetching";
import { CarEditInfoSection } from "./components/CarEditInfoSection";
import { CarEditSpecsSection } from "./components/CarEditSpecsSection";
import { CarEditLocationSection } from "./components/CarEditLocationSection";
import { CarEditActions } from "./components/CarEditActions";

import { getCarById, updateCarById } from "./carEdit.service";
import { buildUpdatePayload, mapCarToForm } from "./carEdit.utils";

export const CarEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [f, setF] = useState({
    brand: "",
    model: "",
    year: "",
    seatingCapacity: "",
    transmission: "automatic",
    pricePerDay: "",
    fuelConsumption: "",
    segment: "standard",
  });

  const [location, setLocation] = useState({
    city: "",
    district: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setFetching(true);
        setError("");

        const data = await getCarById(id);
        const car = data?.data;

        if (!car) {
          if (alive) setError("Không tìm thấy xe");
          return;
        }

        const mapped = mapCarToForm(car);
        if (!alive) return;

        setF(mapped.f);
        setLocation(mapped.location);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || e.message);
      } finally {
        if (alive) setFetching(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const payload = buildUpdatePayload({ f, location });

    try {
      setLoading(true);
      await updateCarById(id, payload);
      setMsg("Cập nhật thông tin xe thành công.");
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/owner/cars");

  return (
    <OwnerLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <CarEditBackButton onClick={goBack} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <CarEditHeader />

          <form onSubmit={submit} className="p-6 space-y-6">
            <CarEditAlert error={error} msg={!error ? msg : ""} />

            {fetching ? (
              <CarEditFetching />
            ) : (
              <>
                <CarEditInfoSection f={f} setF={setF} />
                <CarEditSpecsSection f={f} setF={setF} />
                <CarEditLocationSection
                  location={location}
                  setLocation={setLocation}
                />
                <CarEditActions loading={loading} onCancel={goBack} />
              </>
            )}
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default CarEdit;
