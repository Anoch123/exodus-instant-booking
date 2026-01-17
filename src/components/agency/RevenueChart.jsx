import { useState } from "react";

export default function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data
  const chartData = {
    month: [
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 15000 },
      { month: "Mar", revenue: 1800 },
      { month: "Apr", revenue: 14000 },
      { month: "May", revenue: 22000 },
      { month: "Jun", revenue: 2000 },
    ],
    week: [
      { day: "Mon", revenue: 2000 },
      { day: "Tue", revenue: 2500 },
      { day: "Wed", revenue: 3000 },
      { day: "Thu", revenue: 2800 },
      { day: "Fri", revenue: 3500 },
      { day: "Sat", revenue: 4000 },
      { day: "Sun", revenue: 3200 },
    ],
  };

  const data = chartData[selectedPeriod];
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  const chartHeight = 200; // px

  return (
    <div className="card shadow-sm">
      {/* Card header with filters */}
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Revenue Overview</h5>
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${selectedPeriod === "week" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedPeriod("week")}
          >
            Week
          </button>
          <button
            type="button"
            className={`btn ${selectedPeriod === "month" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedPeriod("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* Chart body */}
      <div className="card-body">
        <div
          className="d-flex align-items-end"
          style={{ height: `${chartHeight}px`, gap: "10px", overflowX: "auto" }}
        >
          {data.map((item, index) => {
            const minHeight = 10;
            const height = Math.max((item.revenue / maxRevenue) * chartHeight, minHeight);

            return (
              <div
                key={index}
                className="flex-fill d-flex flex-column align-items-center"
                style={{ gap: "8px", minWidth: "40px" }}
              >
                {/* Bar */}
                <div
                  className="w-100 rounded-top"
                  style={{
                    height: `${height}px`,
                    backgroundColor: "#007bff",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  title={`$${item.revenue.toLocaleString()}`}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                ></div>

                {/* X-axis label */}
                <small className="text-muted text-center" style={{ fontSize: "0.7rem" }}>
                  {item.month || item.day}
                </small>

                {/* Value label */}
                <small
                  className="text-center fw-bold"
                  style={{ fontSize: "0.75rem", color: "#007bff" }}
                >
                  ${(item.revenue / 1000).toFixed(0)}k
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
