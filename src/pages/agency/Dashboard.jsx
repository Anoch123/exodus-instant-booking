import RecentBookings from "../../components/agency/RecentBookings";
import RevenueChart from "../../components/agency/RevenueChart";
import StatCard from "../../components/agency/StatCard";
import QuickActions from "../../components/agency/QuickActions";
import AuditTable from "../../components/agency/AuditTable";

export default function AgencyDashboard() {
  return (
    <div>
      <div className="row">
        <StatCard
          title="Total Users"
          value={1200}
          icon="fas fa-users"
          color="#4e73df"
        />

        <StatCard
          title="Revenue"
          value="$24,500"
          icon="fas fa-dollar-sign"
          color="#1cc88a"
          change="15%"
          changeType="positive"
        />

        <StatCard
          title="Pending Orders"
          value={32}
          icon="fas fa-shopping-cart"
          color="#f6c23e"
          change="5%"
          changeType="negative"
        />

        <StatCard
          title="New Feedbacks"
          value={8}
          icon="fas fa-comment"
          color="#e74a3b"
        />
      </div>
      <RevenueChart />
      <RecentBookings />

      <div className="card">
        <div className="p-3">
          <h5 className="mb-0">Agency Audit Logs</h5>
          <span>All Audit Logs done by the agency users</span>
        </div>
        <div className="card-body">
          <AuditTable tableName={'agency_users'} />
        </div>
      </div>
    </div>
  );
}