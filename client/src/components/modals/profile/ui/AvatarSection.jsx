import { Upload, Trash2 } from "lucide-react";

const AvatarSection = ({ avatarSrc, hasAvatar, loading, onUpload, onDelete }) => {
  return (
    <div className="flex items-center gap-4">
      <img
        src={avatarSrc}
        alt=""
        className="w-16 h-16 rounded-full object-cover border"
      />

      <div className="flex items-center gap-2">
        <label className="btn btn-outline inline-flex items-center gap-2 cursor-pointer">
          <Upload size={16} /> Tải ảnh
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0])}
            disabled={loading}
          />
        </label>

        {hasAvatar && (
          <button
            type="button"
            className="btn btn-ghost text-danger inline-flex items-center gap-2"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 size={16} /> Xoá
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarSection;
