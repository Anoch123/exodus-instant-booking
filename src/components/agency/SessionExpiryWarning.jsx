import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Component to display session expiry warning and handle automatic logout
 */
export default function SessionExpiryWarning() {
  const { 
    isSessionExpired, 
    isSessionExpiringSoon, 
    getTimeUntilExpiry,
    isSubscriptionExpired,
    isSubscriptionExpiringSoon,
    getTimeUntilSubscriptionExpiry,
    logoutAgency 
  } = useAuth();
  const navigate = useNavigate();
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);
  const [subscriptionTimeRemaining, setSubscriptionTimeRemaining] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false);

  // Session expiry warning
  useEffect(() => {
    if (isSessionExpired) {
      // Session expired, logout and redirect
      logoutAgency();
      navigate("/agency");
      return;
    }

    if (isSessionExpiringSoon()) {
      setShowSessionWarning(true);
      
      // Update time remaining every second
      const interval = setInterval(() => {
        const timeUntil = getTimeUntilExpiry();
        if (timeUntil) {
          const minutes = Math.floor(timeUntil / 60000);
          const seconds = Math.floor((timeUntil % 60000) / 1000);
          setSessionTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setShowSessionWarning(false);
      setSessionTimeRemaining(null);
    }
  }, [isSessionExpired, isSessionExpiringSoon, getTimeUntilExpiry, logoutAgency, navigate]);

  // Subscription expiry warning
  useEffect(() => {
    if (isSubscriptionExpired) {
      setShowSubscriptionWarning(true);
      setSubscriptionTimeRemaining("Expired");
      return;
    }

    if (isSubscriptionExpiringSoon()) {
      setShowSubscriptionWarning(true);
      
      // Update time remaining every second
      const interval = setInterval(() => {
        const timeUntil = getTimeUntilSubscriptionExpiry();
        if (timeUntil) {
          const days = Math.floor(timeUntil / (24 * 60 * 60 * 1000));
          const hours = Math.floor((timeUntil % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          if (days > 0) {
            setSubscriptionTimeRemaining(`${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`);
          } else {
            setSubscriptionTimeRemaining(`${hours} hour${hours !== 1 ? 's' : ''}`);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setShowSubscriptionWarning(false);
      setSubscriptionTimeRemaining(null);
    }
  }, [isSubscriptionExpired, isSubscriptionExpiringSoon, getTimeUntilSubscriptionExpiry]);

  if (isSessionExpired) {
    return null;
  }

  return (
    <>
      {showSessionWarning && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
          style={{
            position: "fixed",
            top: "60px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <strong>Session Expiring Soon!</strong>
          <br />
          Your session will expire in {sessionTimeRemaining || "..."}.
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSessionWarning(false)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {showSubscriptionWarning && (
        <div
          className={`alert ${isSubscriptionExpired ? 'alert-danger' : 'alert-warning'} alert-dismissible fade show`}
          role="alert"
          style={{
            position: "fixed",
            top: showSessionWarning ? "140px" : "60px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <strong>{isSubscriptionExpired ? 'Subscription Expired!' : 'Subscription Expiring Soon!'}</strong>
          <br />
          {isSubscriptionExpired 
            ? "Your subscription has expired. Please renew to continue using the system."
            : `Your subscription expires in ${subscriptionTimeRemaining || "..."}.`
          }
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSubscriptionWarning(false)}
            aria-label="Close"
          ></button>
        </div>
      )}
    </>
  );
}

