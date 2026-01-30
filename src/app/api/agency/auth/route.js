/**
 * Agency Authentication API
 * Handles login, logout, and session management
 */

import { supabase } from "../../../../supabaseClient";
import { auditLog } from "../../../../lib/audit";
import { getUpdatedFields } from "../../../../lib/auditUtils";

/**
 * POST /api/agency/auth
 * Login handler for agency users
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1️⃣ Authenticate with Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { session, user } = data;

    // 2️⃣ Fetch OLD agency user data
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

    // 5️⃣ Detect changes for audit
    const updatedFields = getUpdatedFields(oldAgencyUser, newAgencyUser, {
      ignoreKeys: ["created_at", "updated_at"],
    });

    // 6️⃣ Log audit entry
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

    // 7️⃣ Calculate session expiry
    let expiresIn = 3600; // Default 1 hour
    if (session.expires_at) {
      const expiryTime = session.expires_at * 1000;
      expiresIn = Math.floor((expiryTime - Date.now()) / 1000);
    } else if (session.expires_in) {
      expiresIn = session.expires_in;
    }

    // 8️⃣ Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: newAgencyUser,
          session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_in: expiresIn,
          },
          agency: newAgencyUser.agency,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Authentication failed" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * DELETE /api/agency/auth
 * Logout handler
 */
export async function DELETE(request) {
  try {
    const { userId, agencyId, role } = await request.json();

    // Log audit entry for logout
    await auditLog({
      action: "User Logged Out",
      action_type: "LOGOUT",
      tableName: "agency_users",
      table_pk_name: "User Logout",
      recordId: userId,
      details: { logout_time: new Date().toISOString() },
      agency_user_id: userId,
      role,
      audit_status: "SUCCESS",
      agency_id: agencyId,
    });

    // Logout from Supabase
    await supabase.auth.signOut();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Logout failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
