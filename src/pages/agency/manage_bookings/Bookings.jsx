import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { getStatusBadge } from "../../../lib/statusBadge";

export default function Bookings() {
  const { agencyUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [agencyUser, filter]);

  const fetchBookings = async () => {
    try {
      let query = supabase
        .from("bookings")
        .select("*")
        .eq("agency_id", agencyUser?.id)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking status");
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Managing Bookings</h2>
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center p-4 text-muted">No bookings found</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Tour/Hotel</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{booking.customer_name || booking.customer_email || "N/A"}</td>
                        <td>{booking.tour_name || booking.hotel_name || "N/A"}</td>
                        <td>{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "N/A"}</td>
                        <td>${booking.amount || 0}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>
                          {booking.status === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              >
                                <span className="fa fa-check"></span> Confirm
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              >
                                <span className="fa fa-times"></span> Cancel
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => updateBookingStatus(booking.id, "completed")}
                            >
                              <span className="fa fa-check-circle"></span> Complete
                            </button>
                          )}
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

