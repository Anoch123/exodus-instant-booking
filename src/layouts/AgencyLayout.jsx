import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useServerStatus } from "../context/ServerStatusContext";
import MainHeader from "../components/agency/MainHeader";
import SidebarNav from "../components/agency/SidebarNav";
// import SessionExpiryWarning from "../components/agency/SessionExpiryWarning";
import SubscriptionExpired from "../components/agency/SubscriptionExpired";
import ServerDown from "../components/agency/ServerDown";
import { DEVELOPER_COMPANY } from "../config/constants";
import "/public/agency/assets/css/ready.css";
import "/public/agency/assets/css/demo.css";

export default function AgencyLayout() {
  const location = useLocation();
  const { isAgencyAuthenticated, isSubscriptionExpired } = useAuth();
  const { isServerDown } = useServerStatus();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show sidebar only if authenticated and not on login page
  const isLoginPage = location.pathname === "/agency" || 
                      location.pathname === "/agency/" || 
                      location.pathname.startsWith("/agency/login");
  const showSidebar = isAgencyAuthenticated() && !isLoginPage;

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 991;
      setIsMobile(mobile);
      // Reset sidebar state when switching between mobile/desktop
      if (mobile) {
        setIsSidebarOpen(false); // Hidden on mobile by default
      } else {
        setIsSidebarOpen(true); // Visible on desktop by default
      }
    };
    
    // Initial check
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth <= 991;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Hidden on mobile, visible on desktop
    }
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // For mobile: nav_open shows sidebar (when isSidebarOpen is true)
  // For desktop: sidebar-collapsed hides sidebar (when isSidebarOpen is false)
  const wrapperClass = isMobile 
    ? `wrapper ${isSidebarOpen ? "nav_open" : ""}`
    : `wrapper ${!isSidebarOpen ? "sidebar-collapsed" : ""}`;

  // If server is down, show server down screen (except on login page)
  if (!isLoginPage && isServerDown) {
    return <ServerDown />;
  }

  // If subscription expired and not on login page, show expired screen
  // Block access to the system if subscription is expired
  if (!isLoginPage && isSubscriptionExpired) {
    return <SubscriptionExpired />;
  }

  // If login page, render without sidebar/header
  if (isLoginPage || !showSidebar) {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  // Render with sidebar and header for authenticated pages
  return (
    <div className={wrapperClass}>
      {/* <SessionExpiryWarning /> */}
      <MainHeader onToggleSidebar={handleToggleSidebar} />
      <SidebarNav
        isCollapsed={!isSidebarOpen}
        onToggle={handleToggleSidebar}
      />
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={handleToggleSidebar}
        ></div>
      )}
      <main className="main-panel">
        <div className="content">
          <Outlet />
        </div>
        <div className="p-3">
          <span>{DEVELOPER_COMPANY.systemAttributionText} {DEVELOPER_COMPANY.displayText}</span>
        </div>
      </main>
    </div>
  );
}
