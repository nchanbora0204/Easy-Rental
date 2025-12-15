import PropTypes from "prop-types";
import { useFadeInOnScroll } from "../../hooks/useFadeInOnScroll";

export const FadeSection = ({ className = "", children }) => {
  const [ref, visible] = useFadeInOnScroll();

  return (
    <section
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {children}
    </section>
  );
};

FadeSection.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
