/**
 * Category Service
 * Handles all category CRUD operations
 */

import { supabase } from "../supabaseClient";

export const categoryService = {
  /**
   * Fetch all categories for agency with pagination
   */
  async getAll(agencyId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { data, error, count } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count,
          hasMore: offset + limit < (count || 0),
        },
      };
    } catch (error) {
      throw {
        message: error.message || "Failed to fetch categories",
        details: error,
      };
    }
  },

  /**
   * Fetch single category by ID
   */
  async getById(categoryId, agencyId) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .eq("agency_id", agencyId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      throw { message: error.message || "Failed to fetch category", details: error };
    }
  },

  /**
   * Create new category
   */
  async create(categoryData) {
    try {
      const insertPayload = {
        agency_id: categoryData.agencyId || categoryData.agency_id,
        name: categoryData.name,
        slug: categoryData.slug || null,
        parent_tour_category: categoryData.parent_tour_category || null,
        description: categoryData.description || null,
        status: categoryData.status || "Active",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("categories")
        .insert(insertPayload)
        .select("*")
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      throw { message: error.message || "Failed to create category", details: error };
    }
  },

  /**
   * Update category
   */
  async update(categoryId, updateData) {
    try {
      // Remove metadata keys that are not actual table columns
      const { agencyId, agencyUserId, role, ...rest } = updateData || {};

      const updatePayload = {
        ...rest,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("categories")
        .update(updatePayload)
        .eq("id", categoryId)
        .eq("agency_id", agencyId || updateData?.agency_id)
        .select("*")
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      throw { message: error.message || "Failed to update category", details: error };
    }
  },

  /**
   * Delete category
   */
  async delete(categoryId, agencyId, agencyUserId, role) {
    try {
      // Fetch data before deletion for audit
      const { data: toDelete, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .eq("agency_id", agencyId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("agency_id", agencyId);

      if (error) throw error;

      return { success: true, data: toDelete };
    } catch (error) {
      throw { message: error.message || "Failed to delete category", details: error };
    }
  },
};
