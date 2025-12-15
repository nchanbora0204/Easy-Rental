const PasswordTab = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  changing,
  onChangePassword,
}) => {
  return (
    <>
      <div>
        <div className="label">Mật khẩu hiện tại</div>
        <input
          type="password"
          className="input w-full"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <div>
        <div className="label">Mật khẩu mới</div>
        <input
          type="password"
          className="input w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <button
        type="button"
        className="btn btn-primary w-full"
        disabled={changing || !oldPassword || !newPassword}
        onClick={onChangePassword}
      >
        {changing ? "Đang đổi..." : "Đổi mật khẩu"}
      </button>
    </>
  );
};

export default PasswordTab;
