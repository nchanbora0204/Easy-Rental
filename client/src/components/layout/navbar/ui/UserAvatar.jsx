import { User } from "lucide-react";
import { cn } from "../utils/cn";

const UserAvatar = ({ user, size = "w-8 h-8", iconSize = 18 }) => (
  <div
    className={cn(
      size,
      "bg-accent/20 rounded-full overflow-hidden flex items-center justify-center"
    )}
  >
    {user?.avatar ? (
      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
    ) : (
      <User size={iconSize} className="text-accent" />
    )}
  </div>
);

export default UserAvatar;
