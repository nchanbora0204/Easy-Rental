import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/axios";
import OwnerLayout from "./OwnerLayout";
import {
  Car,
  Check,
  ArrowLeft,
  Calendar,
  Users,
  Settings,
  DollarSign,
  MapPin,
  AlertCircle,
} from "lucide-react";

export default function CarEdit() {
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
    const load = async () => {
      try {
        setFetching(true);
        setError("");
        const { data } = await api.get(`/cars/${id}`);
        const car = data?.data;
        if (!car) {
          setError("Không tìm thấy xe");
          return;
        }
        setF({
          brand: car.brand || "",
          model: car.model || "",
          year: car.year ? String(car.year) : "",
          seatingCapacity: car.seatingCapacity
            ? String(car.seatingCapacity)
            : "",
          transmission: car.transmission || "automatic",
          pricePerDay: car.pricePerDay ? String(car.pricePerDay) : "",
          fuelConsumption: car.fuelConsumption || "",
          segment: car.segment || "standard",
        });
        setLocation({
          city: car.location?.city || "",
          district: car.location?.district || "",
          address: car.location?.address || "",
        });
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    const payload = {
      brand: f.brand.trim(),
      model: f.model.trim(),
      year: f.year ? Number(f.year) : undefined,
      seatingCapacity: f.seatingCapacity
        ? Number(f.seatingCapacity)
        : undefined,
      transmission: f.transmission,
      pricePerDay: f.pricePerDay ? Number(f.pricePerDay) : undefined,
      fuelConsumption: f.fuelConsumption.trim() || undefined,
      segment: f.segment,
    };
    payload.location = {
      city: location.city.trim(),
      district: location.district.trim(),
      address: location.address.trim(),
    };

    try {
      setLoading(true);
      await api.put(`/cars/${id}`, payload);
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
        <div className="mb-4">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} /> Quay lại danh sách
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Car className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Chỉnh sửa thông tin xe
                </h1>
                <p className="text-blue-100 text-sm mt-0.5">
                  Cập nhật lại thông tin chi tiết xe của bạn
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            {/* Thông báo lỗi */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Thông báo thành công */}
            {msg && !error && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <Check
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <span className="text-sm text-green-700">{msg}</span>
              </div>
            )}

            {fetching ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Đang tải dữ liệu xe...
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Car size={20} className="text-blue-600" />
                    Thông tin xe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hãng xe <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={f.brand}
                        onChange={(e) => setF({ ...f, brand: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mẫu xe <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={f.model}
                        onChange={(e) => setF({ ...f, model: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar
                          size={16}
                          className="inline mr-1 text-gray-500"
                        />
                        Năm sản xuất <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={f.year}
                        onChange={(e) => setF({ ...f, year: e.target.value })}
                        min="1990"
                        max="2025"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users
                          size={16}
                          className="inline mr-1 text-gray-500"
                        />
                        Số chỗ ngồi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={f.seatingCapacity}
                        onChange={(e) =>
                          setF({ ...f, seatingCapacity: e.target.value })
                        }
                        min="2"
                        max="16"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-blue-600" />
                    Thông số kỹ thuật
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại hộp số <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        value={f.transmission}
                        onChange={(e) =>
                          setF({ ...f, transmission: e.target.value })
                        }
                      >
                        <option value="automatic">Số tự động</option>
                        <option value="manual">Số sàn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign
                          size={16}
                          className="inline mr-1 text-gray-500"
                        />
                        Giá thuê (VNĐ/ngày){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={f.pricePerDay}
                        onChange={(e) =>
                          setF({ ...f, pricePerDay: e.target.value })
                        }
                        min="0"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Nhập giá thuê mỗi ngày (không cần dấu phẩy)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu hao nhiên liệu
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ví dụ: 9L/100km"
                        value={f.fuelConsumption}
                        onChange={(e) =>
                          setF({ ...f, fuelConsumption: e.target.value })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Thông tin này sẽ hiển thị ở mục “Thông số kỹ thuật” trên
                        trang xe.
                      </p>
                    </div>

                    {/* NEW: Hạng xe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hạng xe
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        value={f.segment}
                        onChange={(e) =>
                          setF((prev) => ({ ...prev, segment: e.target.value }))
                        }
                      >
                        <option value="standard">Tiêu chuẩn</option>
                        <option value="premium">Cao cấp</option>
                        <option value="luxury">Xe sang</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Dùng để phân loại xe trên trang chủ và tìm kiếm.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Vị trí xe
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố / Tỉnh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Hồ Chí Minh"
                        value={location.city}
                        onChange={(e) =>
                          setLocation({ ...location, city: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận / Huyện <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Quận 12"
                        value={location.district}
                        onChange={(e) =>
                          setLocation({ ...location, district: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ chi tiết <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="An Sương / 123 QL1A..."
                        value={location.address}
                        onChange={(e) =>
                          setLocation({ ...location, address: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Ví dụ: <strong>Hồ Chí Minh – Quận 12 – An Sương</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
}
