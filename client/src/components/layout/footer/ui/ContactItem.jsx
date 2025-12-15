const ContactItem = ({ as: As = "a", href, icon: Icon, children, hoverClass }) => {
  const className =
    "flex items-start gap-3 text-sm text-gray-400 transition-colors group " +
    (hoverClass || "hover:text-accent");

  const props = As === "a" ? { href } : {};

  return (
    <As {...props} className={className}>
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      {children}
    </As>
  );
};

export default ContactItem;
