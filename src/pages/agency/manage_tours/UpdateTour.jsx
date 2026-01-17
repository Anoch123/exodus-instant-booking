import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { handleSupabaseError } from "../../../utils/errorHandler";

export default function UpdateTour() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agencyUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    category_id: "",
  });

  const fetchCategories = useCallback(async () => {
    if (!agencyUser?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("agency_id", agencyUser.id);

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Don't show error for categories fetch, just log it
    }
  }, [agencyUser?.id]);

  useEffect(() => {
    fetchCategories();
    fetchTour();
  }, [id, agencyUser, fetchCategories]);

  const fetchTour = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("tours")
        .select("*")
        .eq("id", id)
        .eq("agency_id", agencyUser?.id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          duration: data.duration || "",
          location: data.location || "",
          category_id: data.category_id || "",
        });
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      const errorInfo = handleSupabaseError(error, "Failed to load tour");
      setError(errorInfo);
      navigate("/agency/tours");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("tours")
        .update({
          ...formData,
          price: parseFloat(formData.price),
        })
        .eq("id", id)
        .eq("agency_id", agencyUser?.id);

      if (updateError) throw updateError;
      navigate("/agency/tours");
    } catch (error) {
      console.error("Error updating tour:", error);
      const errorInfo = handleSupabaseError(error, "Failed to update tour");
      setError(errorInfo);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container-fluid py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
        <div className="container">
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            <span className="fa fa-arrow-left me-2"></span>Back to Tours
          </button>
          <h2>Update Tour</h2>
        </div>

        <div className="card">
          <div className="card-body">
            {error && (
              <div className="alert alert-warning" role="alert">
                {error.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tour Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading || fetching}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    disabled={loading || fetching}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Duration *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    disabled={loading || fetching}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    disabled={loading || fetching}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    disabled={loading || fetching}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    disabled={loading || fetching}
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading || fetching}>
                  {loading ? "Updating..." : "Update Tour"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/agency/tours")}
                  disabled={loading || fetching}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

