import { supabase } from "../supabaseClient";
import { getIpAddress } from "./getIpAddress";

export async function auditLog({
  action,
  action_type,
  tableName,
  table_pk_name,
  recordId,
  details,
  agency_id,
  agency_user_id,
  role,
  audit_status,
}) {
  const ip_address = await getIpAddress();

  try {
    const { error } = await supabase.from("audit_logs").insert({
      agency_id: agency_id || null,
      agency_user_id: agency_user_id || null,
      action_type,
      role: role || null,
      action,
      table_name: tableName,
      table_pk_name: table_pk_name,
      record_id: recordId || null,
      details: details || null,
      audit_status: audit_status || null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      ip_address,
    });

    if (error) {
      console.error("Failed to insert audit log", error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error("auditLog error", err);
    throw err;
  }
}
