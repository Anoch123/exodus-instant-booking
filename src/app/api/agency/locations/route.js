/**
 * Locations API Routes
 * GET - List all locations
 * POST - Create new location
 */

import { supabase } from "../../../../supabaseClient";
import { auditLog } from "../../../../lib/audit";

const PAGE_SIZE = 10;

/**
 * GET /api/agency/locations?agencyId=xxx&page=1
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get("agencyId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || PAGE_SIZE);

    if (!agencyId) {
      return new Response(
        JSON.stringify({ error: "Agency ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("locations")
      .select("*", { count: "exact" })
      .eq("agency_id", agencyId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count,
          hasMore: offset + limit < count,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fetch locations error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch locations" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/agency/locations
 */
export async function POST(request) {
  try {
    const payload = await request.json();
    const {
      agencyId,
      agencyUserId,
      role,
      name,
      description,
      latitude,
      longitude,
      address,
      status,
    } = payload;

    if (!agencyId || !name) {
      return new Response(
        JSON.stringify({ error: "Agency ID and location name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const locationData = {
      agency_id: agencyId,
      name: name.trim(),
      description: description?.trim() || null,
      latitude: latitude || null,
      longitude: longitude || null,
      address: address || null,
      status: status || "active",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("locations")
      .insert(locationData)
      .select("*")
      .single();

    if (error) throw error;

    // Audit log
    await auditLog({
      action: "Location Created",
      action_type: "CREATE",
      tableName: "locations",
      table_pk_name: "Location",
      recordId: data.id,
      details: data,
      agency_user_id: agencyUserId,
      role,
      audit_status: "SUCCESS",
      agency_id: agencyId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data,
        message: "Location created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Create location error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create location" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
