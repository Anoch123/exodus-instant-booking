import { supabase } from "../supabaseClient";

/**
 * Generic CRUD Service for Supabase tables
 * Can be used for locations, categories, tours, hotels, etc.
 */
export const createCRUDService = (tableName) => ({
  /**
   * Fetch single record
   */
  async fetch(id, agencyId) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .eq("agency_id", agencyId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all records for agency
   */
  async fetchAll(agencyId, options = {}) {
    let query = supabase.from(tableName).select("*").eq("agency_id", agencyId);

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Create new record
   */
  async create(payload, agencyId) {
    const { data, error } = await supabase
      .from(tableName)
      .insert({ ...payload, agency_id: agencyId })
      .select("id, name")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update record
   */
  async update(id, payload, agencyId) {
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("agency_id", agencyId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete record
   */
  async delete(id, agencyId) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .eq("agency_id", agencyId);

    if (error) throw error;
  },

  /**
   * Fetch with pagination
   */
  async fetchPaginated(agencyId, page = 1, pageSize = 10, options = {}) {
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from(tableName)
      .select("*", { count: "exact" })
      .eq("agency_id", agencyId)
      .range(offset, offset + pageSize - 1);

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      hasMore: offset + pageSize < (count || 0)
    };
  }
});

// Export pre-configured services for each table
export const locationService = createCRUDService("locations");
export const categoryService = createCRUDService("categories");
export const tourService = createCRUDService("tours");
export const hotelService = createCRUDService("hotels");
export const bookingService = createCRUDService("bookings");
