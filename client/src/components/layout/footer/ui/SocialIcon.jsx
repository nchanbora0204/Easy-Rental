const SocialIcon = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white transition-all"
    aria-label={label}
  >
    <Icon size={18} />
  </a>
);

export default SocialIcon;
