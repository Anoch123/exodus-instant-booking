import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { auditLog } from "../../../lib/audit";
import AuditTable from "../../../components/agency/AuditTable";
import { getUpdatedFields } from "../../../lib/auditUtils";
import { handleSupabaseError, ErrorTypes } from "../../../utils/errorHandler";
import { formatDate } from "../../../lib/formatDate";

// Constants
const INITIAL_FORM_STATE = {
  fName: "",
  lName: "",
  username: "",
  password_hash: "",
  email: "",
  phone: "",
  address: "",
  updated_at: "",
};

const MESSAGE_TYPES = {
  SUCCESS: "success",
  ERROR: "danger",
};

export default function Settings() {
  const { agencyUser, updateAgencyUser, getAgencyRole, agencyDetails } = useAuth();
  const userRole = getAgencyRole();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Populate form when agencyUser loads
  useEffect(() => {
    if (agencyUser) {
      setFormData({
        fName: agencyUser.fName || "",
        lName: agencyUser.lName || "",
        username: agencyUser.username || "",
        password_hash: agencyUser.password_hash || "",
        email: agencyUser.email || "",
        phone: agencyUser.phone || "",
        address: agencyUser.address || "",
        updated_at: agencyUser.updated_at || "",
      });
    }
    // Cleanup is not needed here as we're just setting state
  }, [agencyUser]);

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Update password in Supabase Auth if changed
  const updatePasswordIfChanged = useCallback(async (newPasswordHash, oldPasswordHash) => {
    if (newPasswordHash !== oldPasswordHash && agencyUser?.id) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPasswordHash,
        });

        if (error) {
          console.error("Error updating password in Supabase Auth:", error);
          const errorInfo = handleSupabaseError(error, "Failed to update password");
          
          // Log failed password update (only if not server down)
          if (!errorInfo.isServerDown) {
            try {
              await auditLog({
                action: "Failed to Update Password",
                action_type: "PASSWORD_UPDATE_FAILED",
                tableName: "agency_users",
                table_pk_name: "Password Update",
                recordId: agencyUser.id,
                details: { error: errorInfo.message },
                agency_user_id: agencyUser.id,
                role: userRole,
                agency_id: agencyDetails.agency_id,
                audit_status: "FAILED",
              });
            } catch (auditError) {
              console.error("Failed to log audit:", auditError);
            }
          }
          
          throw error;
        }

        // Log successful password update
        try {
          await auditLog({
            action: "Updated Password",
            action_type: "PASSWORD_UPDATE",
            tableName: "agency_users",
            table_pk_name: "Password Update",
            recordId: agencyUser.id,
            details: { message: "Password updated successfully" },
            agency_user_id: agencyUser.id,
            role: userRole,
            agency_id: agencyDetails.agency_id,
            audit_status: "FAILED",
          });
        } catch (auditError) {
          console.error("Failed to log audit:", auditError);
        }
      } catch (error) {
        const errorInfo = handleSupabaseError(error, "Failed to update password authentication");
        throw new Error(errorInfo.message);
      }
    }
  }, [agencyUser, userRole]);

  // Log audit trail
  const logAudit = async (success, errorDetails = null) => {
    const baseLog = {
      tableName: "agency_users",
      table_pk_name: "Agency User Profile",
      recordId: agencyUser.id,
      agency_user_id: agencyUser.id,
      role: userRole,
    };

    if (success) {
      const updatedDetails = getUpdatedFields(agencyUser, formData);
      await auditLog({
        ...baseLog,
        action: "Updated Agency Profile",
        action_type: "UPDATE",
        details: updatedDetails,
        agency_id: agencyDetails.agency_id,
        audit_status: "SUCCESS",
      });
    } else {
      await auditLog({
        ...baseLog,
        action: "Failed to Update Agency Profile",
        action_type: "UPDATE_FAILED",
        details: { error: errorDetails },
        agency_id: agencyDetails.agency_id,
        audit_status: "FAILED",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Update user profile in database
      const { data, error } = await supabase
        .from("agency_users")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", agencyUser.id)
        .select()
        .single();

      if (error) throw error;

      // Update password if changed
      await updatePasswordIfChanged(
        formData.password_hash,
        agencyUser.password_hash
      );

      // Log successful update
      await logAudit(true);

      // Update context and show success message
      updateAgencyUser(data);
      setMessage({
        text: "Settings updated successfully!",
        type: MESSAGE_TYPES.SUCCESS,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      
      const errorInfo = handleSupabaseError(error, "Error updating settings");
      
      // Log failed update (only if not a server down error to avoid spamming)
      if (!errorInfo.isServerDown) {
        try {
          await logAudit(false, errorInfo.message);
        } catch (auditError) {
          console.error("Failed to log audit:", auditError);
        }
      }

      setMessage({
        text: errorInfo.message,
        type: MESSAGE_TYPES.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    return role === "Agency_Admin" ? "Agency Admin" : "Agency User";
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const baseClass = "badge text-dark";
    if (status === "Active") return `${baseClass} bg-success`;
    if (status === "Inactive") return `${baseClass} bg-warning`;
    return `${baseClass} bg-secondary`;
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <div>
        <h2 className="mb-4">Settings</h2>

        <div className="row">
          {/* Personal Information Form */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Personal Information</h5>
              </div>
              <div className="card-body">
                {message.text && (
                  <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fName" className="form-label">
                      First Name
                    </label>
                    <input
                      id="fName"
                      type="text"
                      className="form-control"
                      value={formData.fName}
                      onChange={handleInputChange("fName")}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lName" className="form-label">
                      Last Name
                    </label>
                    <input
                      id="lName"
                      type="text"
                      className="form-control"
                      value={formData.lName}
                      onChange={handleInputChange("lName")}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={handleInputChange("username")}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      readOnly
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange("phone")}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="form-control"
                      value={formData.address}
                      onChange={handleInputChange("address")}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={formData.password_hash}
                        onChange={handleInputChange("password_hash")}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Account Information Sidebar */}
          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-header bg-white">
                <h5 className="mb-0">Account Info</h5>
              </div>
              <div className="card-body">
                <p>
                  <strong>Role:</strong>{" "}
                  {getRoleDisplayName(agencyUser?.role) || "N/A"}
                </p>
                <p>
                  <strong>Member Since:</strong> {formatDate(agencyUser?.created_at)}
                </p>
                <p>
                  <strong>Last Updated At:</strong>{" "}
                  {formatDate(agencyUser?.updated_at)}
                </p>
                <p>
                  <strong>Last Login At:</strong>{" "}
                  {formatDate(agencyUser?.last_login_at)}
                </p>
                <p>
                  <strong>Account Status:</strong>{" "}
                  <span className={getStatusBadgeClass(agencyUser?.status)}>
                    Account {agencyUser?.status || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Account Role ACL</h5>
              </div>
              <div className="card-body">
                {/* Add ACL content here */}
              </div>
            </div>
          </div>
        </div>

        <AuditTable />
      </div>
    </div>
  );
}