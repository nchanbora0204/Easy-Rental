import { Image as ImageIcon } from "lucide-react";

export const CarImagesSection = ({ files, setFiles }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ImageIcon size={20} className="text-blue-600" />
        Hình ảnh xe
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tải lên ảnh (Tối đa 8 ảnh) <span className="text-red-500">*</span>
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
  );
};
