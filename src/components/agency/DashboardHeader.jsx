import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const { agencyUser, logoutAgency } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAgency();
    navigate("/agency");
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-1" style={{ fontWeight: "600" }}>
          Welcome back, {agencyUser?.name || agencyUser?.email || "Agency"}!
        </h2>
        <p className="text-muted mb-0">
          Here's what's happening with your agency today.
        </p>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <div className="text-end me-3">
          <div className="text-muted" style={{ fontSize: "0.875rem" }}>
            {agencyUser?.role && (
              <span className="badge bg-info me-2">{agencyUser.role}</span>
            )}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
        >
          <span className="fa fa-sign-out me-1"></span>
          Logout
        </button>
      </div>
    </div>
  );
}

