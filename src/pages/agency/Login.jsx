import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useThemeScripts from "../../hooks/useThemeScripts";
import { useAuth } from "../../context/AuthContext";
import { auditLog } from "../../lib/audit";
import { getUpdatedFields } from "../../lib/auditUtils";
import { DEVELOPER_COMPANY, SYSTEM_INFORMATION } from "../../config/constants";

export default function AgencyLogin() {
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
      // 1️⃣ Authenticate
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      const { session, user } = data;

      // 2️⃣ Fetch OLD agency user
      const { data: oldAgencyUser, error: oldError } = await supabase
        .from("agency_users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (oldError) throw oldError;

      // 3️⃣ Update last login time
      const updatedPayload = {
        last_login_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("agency_users")
        .update(updatedPayload)
        .eq("id", user.id);

      if (updateError) {
        console.warn("Failed to update last_login_at", updateError.message);
      }

      // 4️⃣ Fetch NEW agency user WITH agency details
      const { data: newAgencyUser, error: newError } = await supabase
        .from("agency_users")
        .select(`
          *,
          agency:agency (
            *
          )
        `)
        .eq("id", user.id)
        .single();

      if (newError) throw newError;

      // 5️⃣ Detect changes
      const updatedFields = getUpdatedFields(
        oldAgencyUser,
        newAgencyUser,
        {
          ignoreKeys: ["created_at", "updated_at"],
        }
      );

      // 6️⃣ Audit log
      await auditLog({
        action: "User Logged In",
        action_type: "LOGIN",
        tableName: "agency_users",
        table_pk_name: "User Login",
        recordId: user.id,
        details: updatedFields,
        agency_user_id: user.id,
        role: newAgencyUser.role,
        audit_status: "SUCCESS",
        agency_id: newAgencyUser.agency_id,
      });

      // 7️⃣ Save auth state (user + agency)
      // Calculate session expiry from JWT
      // Supabase session.expires_at is a timestamp in seconds, or we calculate from expires_in
      let expiresIn = 3600; // Default 1 hour
      if (session.expires_at) {
        // expires_at is Unix timestamp in seconds
        const expiryTime = session.expires_at * 1000; // Convert to milliseconds
        expiresIn = Math.floor((expiryTime - Date.now()) / 1000); // Convert to seconds from now
      } else if (session.expires_in) {
        expiresIn = session.expires_in;
      }
      
      loginAgency(
        newAgencyUser,
        session.access_token,
        newAgencyUser.role,
        newAgencyUser.agency,
        expiresIn
      );

      // 8️⃣ Navigate
      navigate("/agency_dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <div className="container d-flex flex-column align-items-center">
        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="login-form p-4 shadow-sm rounded mb-3"
          style={{ width: "450px", background: "#fff" }}
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

          {/* error message */}
          {error && (
            <div className="alert alert-danger py-2 mb-3 text-center">{error}</div>
          )}
        </form>
  
        {/* Developed By */}
        <p className="text-muted">
          {DEVELOPER_COMPANY.attributionText}{' '}
          <a href={DEVELOPER_COMPANY.website} target="_blank" rel="noopener noreferrer">
            <strong>{DEVELOPER_COMPANY.displayText}</strong>
          </a>
        </p>
      </div>
    </div>
  );  
}
