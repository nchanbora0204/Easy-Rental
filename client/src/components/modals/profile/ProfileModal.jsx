import { X, KeyRound } from "lucide-react";
import Modal from "../../Modal"; 
import { TABS } from "./constants";
import { useProfileModal } from "./hooks/useProfileModal";
import ProfileTab from "./tabs/ProfileTab";
import PasswordTab from "./tabs/PasswordTab";

const ProfileModal = ({ open, onClose }) => {
  const {
    tab,
    setTab,
    msg,
    loading,
    changing,

    form,
    setField,
    avatarSrc,

    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,

    saveProfile,
    uploadAvatar,
    deleteAvatar,
    changePassword,
  } = useProfileModal(open);

  return (
    <Modal open={open} onClose={onClose} widthClass="max-w-xl">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`px-2 py-1 rounded ${
              tab === TABS.PROFILE ? "bg-accent/10 text-accent" : ""
            }`}
            onClick={() => setTab(TABS.PROFILE)}
          >
            Hồ sơ
          </button>

          <button
            type="button"
            className={`px-2 py-1 rounded ${
              tab === TABS.PASSWORD ? "bg-accent/10 text-accent" : ""
            }`}
            onClick={() => setTab(TABS.PASSWORD)}
          >
            <KeyRound size={16} className="inline mr-1" />
            Mật khẩu
          </button>
        </div>

        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {msg && <div className="text-sm text-[var(--color-muted)]">{msg}</div>}

        {tab === TABS.PASSWORD ? (
          <PasswordTab
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            changing={changing}
            onChangePassword={changePassword}
          />
        ) : (
          <ProfileTab
            form={form}
            setField={setField}
            avatarSrc={avatarSrc}
            loading={loading}
            onUploadAvatar={uploadAvatar}
            onDeleteAvatar={deleteAvatar}
            onSave={saveProfile}
          />
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;
