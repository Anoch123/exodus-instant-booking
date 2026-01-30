/**
 * Category Detail API Routes
 * GET - Fetch single category
 * PUT - Update category
 * DELETE - Delete category
 */

import { supabase } from "../../../../../supabaseClient";
import { auditLog } from "../../../../../lib/audit";
import { getUpdatedFields } from "../../../../../lib/auditUtils";

/**
 * GET /api/agency/categories/[id]?agencyId=xxx
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get("agencyId");

    if (!id || !agencyId) {
      return new Response(
        JSON.stringify({ error: "Category ID and Agency ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (error) throw error;

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Category not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fetch category error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch category" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * PUT /api/agency/categories/[id]
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const payload = await request.json();
    const { agencyId, agencyUserId, role, ...updateData } = payload;

    if (!id || !agencyId) {
      return new Response(
        JSON.stringify({ error: "Category ID and Agency ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch old data for audit
    const { data: oldData, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (fetchError) throw fetchError;

    // Update record
    const { data: newData, error: updateError } = await supabase
      .from("categories")
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
      action: "Category Updated",
      action_type: "UPDATE",
      tableName: "categories",
      table_pk_name: "Category",
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
        message: "Category updated successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Update category error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update category" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * DELETE /api/agency/categories/[id]
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { agencyId, agencyUserId, role } = await request.json();

    if (!id || !agencyId) {
      return new Response(
        JSON.stringify({ error: "Category ID and Agency ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch data before deletion for audit
    const { data: deletedData, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (fetchError) throw fetchError;

    // Delete record
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("agency_id", agencyId);

    if (error) throw error;

    // Log audit
    await auditLog({
      action: "Category Deleted",
      action_type: "DELETE",
      tableName: "categories",
      table_pk_name: "Category",
      recordId: id,
      details: { deleted_category: deletedData },
      agency_user_id: agencyUserId,
      role,
      audit_status: "SUCCESS",
      agency_id: agencyId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Category deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete category error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete category" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
