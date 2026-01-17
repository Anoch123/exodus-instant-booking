import { supabase } from "../supabaseClient";

export async function getAuditLogs({
  agency_Id,
  agencyUserId,
  tableName,
  limit = 10,
  offset = 0,
}) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select(
      `
      *,
      agency_users (
        id,
        username
      ),
      agency (
        name
      )
    `
    )
    .eq("agency_user_id", agencyUserId)
    .eq("agency_id", agency_Id)
    .eq("table_name", tableName)
    .order("created_at", { ascending: false }) // 🔴 REQUIRED
    .range(offset, offset + limit - 1);        // 🔴 NOT limit(), use range()

  if (error) throw error;

  return data || [];
}
