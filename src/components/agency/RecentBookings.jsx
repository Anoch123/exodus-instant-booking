import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { getStatusBadge } from "../../lib/statusBadge";

export default function RecentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      // This is a placeholder - adjust based on your actual bookings table structure
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching bookings:", error);
        // Use mock data for now
        setBookings([
          {
            id: 1,
            customer_name: "John Doe",
            tour_name: "Banaue Rice Terraces Tour",
            status: "SUCCESS",
            amount: 550,
            date: new Date().toISOString(),
          },
          {
            id: 2,
            customer_name: "Jane Smith",
            tour_name: "Beach Paradise Package",
            status: "FAILED",
            amount: 750,
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 3,
            customer_name: "Mike Johnson",
            tour_name: "Mountain Adventure",
            status: "SUCCESS",
            amount: 450,
            date: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: 4,
            customer_name: "Mike Johnson",
            tour_name: "Mountain Adventure",
            status: "WARNING",
            amount: 450,
            date: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      // Use mock data on error
      setBookings([
        {
          id: 1,
          customer_name: "John Doe",
          tour_name: "Banaue Rice Terraces Tour",
          status: "confirmed",
          amount: 550,
          date: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">Recent Bookings</h5>
        <span>Most Recents Bookings Made (10 Records)</span>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center p-4">
            <div className="text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center p-4 text-muted">No bookings found</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Tour</th>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.customer_name || booking.customer?.name || "N/A"}</td>
                    <td>{booking.tour_name || booking.tour?.name || "N/A"}</td>
                    <td>{formatDate(booking.date || booking.created_at)}</td>
                    <td>${booking.amount || 0}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer bg-white border-top">
        <a href="#" className="btn btn-sm btn-outline-primary">
          View All Bookings
        </a>
      </div>
    </div>
  );
}

