import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ redirectTo = "agency_dashboard" }) {
  const { isAgencyAuthenticated, isCustomerAuthenticated } = useAuth();

  // If agency user is logged in, redirect to dashboard
  if (isAgencyAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // If customer is logged in, redirect to customer dashboard
  if (isCustomerAuthenticated()) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <Outlet />;
}

