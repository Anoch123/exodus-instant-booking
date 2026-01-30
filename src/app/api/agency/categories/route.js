/**
 * Categories API Routes
 * GET - List all categories
 * POST - Create new category
 */

import { supabase } from "../../../../supabaseClient";
import { auditLog } from "../../../../lib/audit";

const PAGE_SIZE = 10;

/**
 * GET /api/agency/categories?agencyId=xxx&page=1
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
      .from("categories")
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
    console.error("Fetch categories error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch categories" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/agency/categories
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
      icon,
      status,
    } = payload;

    if (!agencyId || !name) {
      return new Response(
        JSON.stringify({ error: "Agency ID and category name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const categoryData = {
      agency_id: agencyId,
      name: name.trim(),
      description: description?.trim() || null,
      icon: icon || null,
      status: status || "active",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("categories")
      .insert(categoryData)
      .select("*")
      .single();

    if (error) throw error;

    // Audit log
    await auditLog({
      action: "Category Created",
      action_type: "CREATE",
      tableName: "categories",
      table_pk_name: "Category",
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
        message: "Category created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create category" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
