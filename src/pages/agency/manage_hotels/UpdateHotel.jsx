import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { handleSupabaseError } from "../../../utils/errorHandler";

export default function UpdateHotel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agencyUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_per_night: "",
    location: "",
    rating: "",
    amenities: "",
  });

  useEffect(() => {
    fetchHotel();
  }, [id, agencyUser]);

  const fetchHotel = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", id)
        .eq("agency_id", agencyUser?.id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price_per_night: data.price_per_night || "",
          location: data.location || "",
          rating: data.rating || "",
          amenities: data.amenities || "",
        });
      }
    } catch (error) {
      console.error("Error fetching hotel:", error);
      const errorInfo = handleSupabaseError(error, "Failed to load hotel");
      setError(errorInfo);
      navigate("/agency/hotels");
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
        .from("hotels")
        .update({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night),
          rating: formData.rating ? parseFloat(formData.rating) : null,
        })
        .eq("id", id)
        .eq("agency_id", agencyUser?.id);

      if (updateError) throw updateError;
      navigate("/agency/hotels");
    } catch (error) {
      console.error("Error updating hotel:", error);
      const errorInfo = handleSupabaseError(error, "Failed to update hotel");
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
      <div className="">
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            <span className="fa fa-arrow-left me-2"></span>Back to Hotels
          </button>
          <h2>Update Hotel</h2>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Hotel Name *</label>
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
                <div className="col-md-4 mb-3">
                  <label className="form-label">Price per Night ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                    required
                    disabled={loading || fetching}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    disabled={loading || fetching}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Amenities</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    disabled={loading || fetching}
                  />
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
                  {loading ? "Updating..." : "Update Hotel"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/agency/hotels")}
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

