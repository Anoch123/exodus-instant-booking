import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavItem({ href, icon, label, badge, badgeClass, isActive, onNavigate }) {
  const location = useLocation();
  // Build the full path
  const fullPath = href.startsWith('/') ? href : `/agency/${href}`;
  const isActiveRoute = location.pathname === fullPath;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    // Close sidebar on mobile when link is clicked
    if (isMobile && onNavigate) {
      onNavigate();
    }
  };
  
  return (
    <li className={`nav-item-agency ${isActive || isActiveRoute ? "active" : ""}`}>
      <Link to={fullPath} onClick={handleClick}>
        {icon && <i className={icon}></i>}
        <p>{label}</p>
        {badge && (
          <span className={`badge ${badgeClass || "badge-count"}`}>{badge}</span>
        )}
      </Link>
    </li>
  );
}

