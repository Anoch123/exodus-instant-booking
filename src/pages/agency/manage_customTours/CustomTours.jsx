import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";

export default function CustomTours() {
  const { agencyUser } = useAuth();
  const [customTours, setCustomTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomTours();
  }, [agencyUser]);

  const fetchCustomTours = async () => {
    try {
      const { data, error } = await supabase
        .from("custom_tours")
        .select("*")
        .eq("agency_id", agencyUser?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomTours(data || []);
    } catch (error) {
      console.error("Error fetching custom tours:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Managing Custom Tours</h2>
        </div>

        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : customTours.length === 0 ? (
              <div className="text-center p-4 text-muted">No custom tours found</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Travelers</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customTours.map((tour) => (
                      <tr key={tour.id}>
                        <td>{tour.customer_name || tour.customer_email || "N/A"}</td>
                        <td>{tour.start_date ? new Date(tour.start_date).toLocaleDateString() : "N/A"}</td>
                        <td>{tour.end_date ? new Date(tour.end_date).toLocaleDateString() : "N/A"}</td>
                        <td>{tour.total_travelers || "N/A"}</td>
                        <td>
                          <span className={`badge bg-${tour.status === "pending" ? "warning" : tour.status === "approved" ? "success" : "secondary"}`}>
                            {tour.status || "pending"}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            <span className="fa fa-eye"></span> View
                          </button>
                          <button className="btn btn-sm btn-outline-success">
                            <span className="fa fa-check"></span> Approve
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

