import { useState } from "react";
import api from "../../lib/axios";
import OwnerLayout from "./OwnerLayout";
import {
  Car,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  Settings,
  AlertCircle,
  Check,
} from "lucide-react";
export default function CarCreate() {
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

      const fd = new FormData();

      Object.entries(f).forEach(([k, v]) => {
        fd.append(k, v);
      });

      fd.append("location", JSON.stringify(location));

      files.forEach((file) => {
        fd.append("images", file);
      });

      const { data } = await api.post("/cars", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Car className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Thêm xe mới</h1>
                <p className="text-blue-100 text-sm mt-0.5">
                  Điền thông tin chi tiết về xe của bạn
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="p-6 space-y-6">
            {msg && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <Check
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <span className="text-sm text-green-700">{msg}</span>
              </div>
            )}

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
                    placeholder="Ví dụ: Toyota, Honda, Mazda..."
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
                    placeholder="Ví dụ: Vios, City, CX-5..."
                    value={f.model}
                    onChange={(e) => setF({ ...f, model: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1 text-gray-500" />
                    Năm sản xuất <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="2020"
                    value={f.year}
                    onChange={(e) => setF({ ...f, year: e.target.value })}
                    min="1990"
                    max="2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} className="inline mr-1 text-gray-500" />
                    Số chỗ ngồi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="4"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Giá thuê (VNĐ/ngày) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="500000"
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
                    Nếu bạn không chọn, hệ thống có thể tự phân loại dựa trên
                    giá và hãng xe.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu thụ nhiên liệu (L/100km)
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
                Bạn có thể để trống nếu không chắc thông số.
              </p>
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

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" />
                Hình ảnh xe
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tải lên ảnh (Tối đa 8 ảnh){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="w-full"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <ImageIcon size={40} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click để chọn ảnh hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, JPEG (Tối đa 5MB/ảnh)
                    </span>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 mb-2">
                      Đã chọn {files.length} ảnh:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-600 truncate"
                        >
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Thêm xe mới
                  </>
                )}
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
}
