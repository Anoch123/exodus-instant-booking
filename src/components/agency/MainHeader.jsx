import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MainHeader({ onToggleSidebar }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef(null);

  const { agencyUser, logoutAgency, agencyDetails } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAgency();
    navigate("/agency");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

    
  }, [agencyUser]);

  return (
    <div className="main-header">
      <div className="logo-header">
        <a href="/" className="logo">{agencyDetails.name} Agency</a>

        <button
          className="navbar-toggler sidenav-toggler ml-auto"
          onClick={onToggleSidebar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      <nav className="navbar navbar-header navbar-expand-lg">
        <div className="container-fluid">
          <h6 className="text-danger mt-2">System Expires in {new Date(agencyDetails.subscription_expires_at).toLocaleString("en-GB")}</h6>

          <ul className="navbar-nav ml-md-auto align-items-center">
            <li
              className={`nav-item dropdown ${isExpanded ? "show" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="dropdown-toggle profile-pic btn btn-link"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
              >
                <img
                  src="assets/img/profile.jpg"
                  alt="user"
                  width="36"
                  className="img-circle"
                />
                <span className="ml-2">{agencyUser.username}</span>
              </button>

              <ul className={`dropdown-menu dropdown-user ${isExpanded ? "show" : ""}`}>
                <li className="dropdown-item text-center">
                  <strong>{agencyUser.fName} {agencyUser.lName}</strong>
                  <br />
                  <small>{agencyUser.email}</small>
                </li>

                <div className="dropdown-divider"></div>

                <li>
                  <a className="dropdown-item text-danger" onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
