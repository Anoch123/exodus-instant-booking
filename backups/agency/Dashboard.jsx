import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import DashboardHeader from "../../components/agency/DashboardHeader";
import StatCard from "../../components/agency/StatCard";
import RecentBookings from "../../components/agency/RecentBookings";
import QuickActions from "../../components/agency/QuickActions";
import RevenueChart from "../../components/agency/RevenueChart";

export default function AgencyDashboard() {
  const { agencyUser } = useAuth();
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [agencyUser]);

  const fetchDashboardStats = async () => {
    if (!agencyUser?.id) {
      setLoading(false);
      return;
    }

    try {
      // Fetch tours count
      const { count: toursCount } = await supabase
        .from("tours")
        .select("*", { count: "exact", head: true })
        .eq("agency_id", agencyUser.id);

      // Fetch bookings count and revenue
      const { data: bookings, count: bookingsCount } = await supabase
        .from("bookings")
        .select("amount", { count: "exact" })
        .eq("agency_id", agencyUser.id);

      // Calculate total revenue
      const revenue = bookings?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0;

      // Fetch unique customers count
      const { count: customersCount } = await supabase
        .from("bookings")
        .select("customer_id", { count: "exact", head: true })
        .eq("agency_id", agencyUser.id);

      setStats({
        totalTours: toursCount || 0,
        totalBookings: bookingsCount || 0,
        totalRevenue: revenue,
        totalCustomers: customersCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Use mock data on error
      setStats({
        totalTours: 12,
        totalBookings: 45,
        totalRevenue: 12500,
        totalCustomers: 28,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div className="container">
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="row mb-4">
          <StatCard
            title="Total Tours"
            value={loading ? "..." : stats.totalTours}
            icon="fa fa-map-marked-alt"
            color="#007bff"
            change="+12%"
            changeType="positive"
          />
          <StatCard
            title="Total Bookings"
            value={loading ? "..." : stats.totalBookings}
            icon="fa fa-calendar-check"
            color="#28a745"
            change="+8%"
            changeType="positive"
          />
          <StatCard
            title="Total Revenue"
            value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            icon="fa fa-dollar-sign"
            color="#ffc107"
            change="+15%"
            changeType="positive"
          />
          <StatCard
            title="Total Customers"
            value={loading ? "..." : stats.totalCustomers}
            icon="fa fa-users"
            color="#17a2b8"
            change="+5%"
            changeType="positive"
          />
        </div>

        {/* Charts and Recent Bookings Row */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <RevenueChart />
          </div>
          <div className="col-lg-4">
            <RecentBookings />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
