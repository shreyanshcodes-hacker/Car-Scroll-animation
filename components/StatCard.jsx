/**
 * One statistic card. Visibility is driven entirely by GSAP/ScrollTrigger
 * (see CarScrollAnimation) - there is deliberately no React state in here.
 */
export default function StatCard({
  id,
  value,
  label,
  theme,
  position,
  large = false,
  innerRef,
}) {
  return (
    <div
      id={id}
      ref={innerRef}
      className={`stat-card ${large ? "stat-card--large" : ""} ${theme} ${position}`}
    >
      <span className="stat-num">{value}</span>
      {label}
    </div>
  );
}
