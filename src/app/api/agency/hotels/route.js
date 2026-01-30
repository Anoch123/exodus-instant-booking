/**
 * Hotels API Routes
 * GET - List all hotels
 * POST - Create new hotel
 */

import { supabase } from "../../../../supabaseClient";
import { auditLog } from "../../../../lib/audit";
import { getUpdatedFields } from "../../../../lib/auditUtils";

const PAGE_SIZE = 10;

/**
 * GET /api/agency/hotels?agencyId=xxx&page=1
 * Fetch hotels with pagination
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
      .from("hotels")
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
    console.error("Fetch hotels error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch hotels" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/agency/hotels
 * Create new hotel
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
      district,
      city,
      country,
      status,
      images,
      total_rooms_count,
      per_person_chargers,
      hotel_rating,
      email,
      phone,
      website,
      is_wifi,
      is_balcony,
      is_spa,
      is_room_service,
      is_swimming_pool,
      is_air_conditioned,
      is_family_rooms,
      is_gym,
    } = payload;

    if (!agencyId || !name) {
      return new Response(
        JSON.stringify({ error: "Agency ID and hotel name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hotelData = {
      agency_id: agencyId,
      name: name.trim(),
      description: description?.trim() || null,
      district,
      city,
      country,
      status: status || "active",
      images: images || [],
      total_rooms_count: total_rooms_count || 0,
      per_person_chargers: per_person_chargers || 0,
      hotel_rating: hotel_rating || 0,
      email: email || null,
      phone: phone || null,
      website: website || null,
      is_wifi: is_wifi || false,
      is_balcony: is_balcony || false,
      is_spa: is_spa || false,
      is_room_service: is_room_service || false,
      is_swimming_pool: is_swimming_pool || false,
      is_air_conditioned: is_air_conditioned || false,
      is_family_rooms: is_family_rooms || false,
      is_gym: is_gym || false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("hotels")
      .insert(hotelData)
      .select("*")
      .single();

    if (error) throw error;

    // Log audit
    await auditLog({
      action: "Hotel Created",
      action_type: "CREATE",
      tableName: "hotels",
      table_pk_name: "Hotel",
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
        message: "Hotel created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Create hotel error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create hotel" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
