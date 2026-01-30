/**
 * Hotel Detail API Routes
 * GET - Fetch single hotel
 * PUT - Update hotel
 * DELETE - Delete hotel
 */

import { supabase } from "../../../../../supabaseClient";
import { auditLog } from "../../../../../lib/audit";
import { getUpdatedFields } from "../../../../../lib/auditUtils";

/**
 * GET /api/agency/hotels/[id]
 * Fetch single hotel by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get("agencyId");

    if (!id || !agencyId) {
      return new Response(
        JSON.stringify({ error: "Hotel ID and Agency ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (error) throw error;

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Hotel not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fetch hotel error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch hotel" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * PUT /api/agency/hotels/[id]
 * Update hotel
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const payload = await request.json();
    const { agencyId, agencyUserId, role, ...updateData } = payload;

    if (!id || !agencyId) {
      return new Response(
        JSON.stringify({ error: "Hotel ID and Agency ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch old data for audit
    const { data: oldData, error: fetchError } = await supabase
      .from("hotels")
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (fetchError) throw fetchError;

    // Update record
    const { data: newData, error: updateError } = await supabase
      .from("hotels")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("agency_id", agencyId)
      .select("*")
      .single();

    if (updateError) throw updateError;

    // Get changed fields for audit
    const changedFields = getUpdatedFields(oldData, newData, {
      ignoreKeys: ["created_at", "updated_at"],
    });

    // Log audit
    await auditLog({
      action: "Hotel Updated",
      action_type: "UPDATE",
      tableName: "hotels",
      table_pk_name: "Hotel",
      recordId: id,
      details: changedFields,
      agency_user_id: agencyUserId,
      role,
      audit_status: "SUCCESS",
      agency_id: agencyId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: newData,
        message: "Hotel updated successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Update hotel error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update hotel" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * DELETE /api/agency/hotels/[id]
 * Delete hotel
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { agencyId, agencyUserId, role } = await request.json();

    if (!id || !agencyId) {
      return new Response(
        JSON.stringify({ error: "Hotel ID and Agency ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch data before deletion for audit
    const { data: deletedData, error: fetchError } = await supabase
      .from("hotels")
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (fetchError) throw fetchError;

    // Delete record
    const { error } = await supabase
      .from("hotels")
      .delete()
      .eq("id", id)
      .eq("agency_id", agencyId);

    if (error) throw error;

    // Log audit
    await auditLog({
      action: "Hotel Deleted",
      action_type: "DELETE",
      tableName: "hotels",
      table_pk_name: "Hotel",
      recordId: id,
      details: { deleted_hotel: deletedData },
      agency_user_id: agencyUserId,
      role,
      audit_status: "SUCCESS",
      agency_id: agencyId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Hotel deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete hotel error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete hotel" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
