import { useState } from "react";

export default function FoldableNavItem({
  icon,
  label,
  badge,
  badgeClass,
  children,
  isActive,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <li className={`nav-item-agency ${isActive ? "active" : ""}`}>
      <a
        href="#"
        onClick={toggleExpand}
        className={isExpanded ? "expanded" : ""}
      >
        {icon && <i className={icon}></i>}
        <p>{label}</p>
        {badge && (
          <span className={`badge ${badgeClass || "badge-count"}`}>{badge}</span>
        )}
        <i className={`la la-angle-right caret ${isExpanded ? "open" : ""}`}></i>
      </a>
      {children && (
        <ul className={`submenu ${isExpanded ? "show" : ""}`}>
          {children}
        </ul>
      )}
    </li>
  );
}

