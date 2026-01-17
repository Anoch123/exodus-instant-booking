import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { isAgencyAuthenticated, isCustomerAuthenticated, getAgencyRole } = useAuth();

  // AGENCY PROTECTION
  if (!role.includes(null)) {
    if (role?.includes("Agency_Admin") || role?.includes("Agency_User")) {
      if (!isAgencyAuthenticated()) {
        return <Navigate to="/agency" replace />;
      }
      
      // Optional: Check if user has the required role
      const userRole = getAgencyRole();
      if (role?.includes("Agency_Admin") && userRole !== "Agency_Admin") {
        return <Navigate to="/agency" replace />;
      }
    }
  } else {
    return <Navigate to="/agency" replace />;
  }

  // CUSTOMER PROTECTION
  if (role?.includes("customer")) {
    if (!isCustomerAuthenticated()) {
      return <Navigate to="/customer/login" replace />;
    }
  }

  return <Outlet />;
}
