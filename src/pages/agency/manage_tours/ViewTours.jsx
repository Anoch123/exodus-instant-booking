import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { handleSupabaseError } from "../../../utils/errorHandler";

export default function ViewTours() {
  const { agencyUser } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTours = useCallback(async () => {
    if (!agencyUser?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("tours")
        .select("*")
        .eq("agency_id", agencyUser.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setTours(data || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
      const errorInfo = handleSupabaseError(error, "Failed to load tours");
      setError(errorInfo);
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [agencyUser?.id]);

  useEffect(() => {
    fetchTours();
    // Cleanup: Cancel any pending requests if component unmounts
    return () => {
      setLoading(false);
    };
  }, [fetchTours]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      const { error: deleteError } = await supabase.from("tours").delete().eq("id", id);
      if (deleteError) throw deleteError;
      await fetchTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
      const errorInfo = handleSupabaseError(error, "Failed to delete tour");
      alert(errorInfo.message);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Tours</h2>
          <Link to="/agency/tours/create" className="btn btn-primary">
            <span className="fa fa-plus me-2"></span>
            Add New Tour
          </Link>
        </div>

        <div className="card">
          <div className="card-body">
            {error && (
              <div className="alert alert-warning" role="alert">
                {error.message}
              </div>
            )}
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : tours.length === 0 && !error ? (
              <div className="text-center p-4 text-muted">
                <p>No tours found</p>
                <Link to="/agency/tours/create" className="btn btn-primary">
                  Create Your First Tour
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tours.map((tour) => (
                      <tr key={tour.id}>
                        <td>{tour.name}</td>
                        <td>{tour.location}</td>
                        <td>{tour.duration}</td>
                        <td>${tour.price}</td>
                        <td>{tour.description ? (tour.description.length > 50 ? tour.description.substring(0, 50) + "..." : tour.description) : "N/A"}</td>
                        <td>
                          <Link
                            to={`/agency/tours/update/${tour.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            <span className="fa fa-edit"></span> Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(tour.id)}
                          >
                            <span className="fa fa-trash"></span> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

