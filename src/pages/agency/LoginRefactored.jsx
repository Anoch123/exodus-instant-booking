/**
 * REFACTORED Login Component
 * Demonstrates best practices:
 * - Separation of concerns: Business logic moved to API layer
 * - Clean component: Only handles UI state and presentation
 * - Error handling: Centralized in service layer
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useThemeScripts from "../../../hooks/useThemeScripts";
import { authService } from "../../../services/authService";
import { DEVELOPER_COMPANY, SYSTEM_INFORMATION } from "../../../config/constants";

export default function AgencyLoginRefactored() {
  useThemeScripts();

  const navigate = useNavigate();
  const { loginAgency } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call API service - all business logic is handled in the API layer
      const response = await authService.login(email, password);

      const { user, session, agency } = response.data;

      // Update auth context with response data
      loginAgency(user, session.access_token, user.role, agency, session.expires_in);

      // Navigate to dashboard
      navigate("/agency_dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center px-3"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-5">
            {/* Login Card */}
            <form
              onSubmit={handleLogin}
              className="p-4 shadow-sm rounded mb-3 bg-white"
            >
              <h3 className="text-center mb-4">
                {SYSTEM_INFORMATION.name} Agency Login
              </h3>

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {error && (
                <div className="alert alert-danger py-2 text-center mb-0">
                  {error}
                </div>
              )}
            </form>

            {/* Developed By */}
            <p className="text-muted text-center small">
              {DEVELOPER_COMPANY.attributionText}{" "}
              <a
                href={DEVELOPER_COMPANY.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>{DEVELOPER_COMPANY.displayText}</strong>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
