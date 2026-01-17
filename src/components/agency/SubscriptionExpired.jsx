import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Component displayed when agency subscription has expired
 * Blocks access to the agency system
 */
export default function SubscriptionExpired() {
  const { agencyDetails, logoutAgency } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAgency();
    navigate("/agency");
  };

  const expiryDate = agencyDetails?.subscription_expires_at 
    ? new Date(agencyDetails.subscription_expires_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}
    >
      <div className="container d-flex justify-content-center">
        <div
          className="text-center p-5 shadow-lg rounded"
          style={{
            background: "#fff",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <div className="mb-4">
            <i 
              className="fa fa-exclamation-triangle"
              style={{ fontSize: "80px", color: "#dc3545" }}
            ></i>
          </div>

          <h1 className="mb-3" style={{ color: "#dc3545", fontWeight: "bold" }}>
            Subscription Expired
          </h1>

          <p className="lead mb-4" style={{ color: "#6c757d" }}>
            Your agency subscription has expired and access to the system has been restricted.
          </p>

          <div className="alert alert-danger mb-4" role="alert">
            <strong>Expiry Date:</strong> {expiryDate}
          </div>

          <p className="mb-4" style={{ color: "#6c757d" }}>
            To regain access to the agency system, please renew your subscription by contacting
            your administrator or support team.
          </p>

          <button
            onClick={handleLogout}
            className="btn btn-primary btn-lg px-5"
            style={{ minWidth: "200px" }}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}

