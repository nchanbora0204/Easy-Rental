import AvatarSection from "../ui/AvatarSection";

const ProfileTab = ({
  form,
  setField,
  avatarSrc,
  loading,
  onUploadAvatar,
  onDeleteAvatar,
  onSave,
}) => {
  return (
    <>
      <AvatarSection
        avatarSrc={avatarSrc}
        hasAvatar={Boolean(form.avatar)}
        loading={loading}
        onUpload={onUploadAvatar}
        onDelete={onDeleteAvatar}
      />

      <div>
        <div className="label">Họ tên</div>
        <input
          className="input w-full"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </div>

      <div>
        <div className="label">Số điện thoại</div>
        <input
          className="input w-full"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />
      </div>

      <div>
        <div className="label">Thành phố</div>
        <input
          className="input w-full"
          value={form.city}
          onChange={(e) => setField("city", e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary w-full"
        disabled={loading}
        onClick={onSave}
      >
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </>
  );
};

export default ProfileTab;
