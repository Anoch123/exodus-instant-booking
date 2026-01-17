import { Link } from "react-router-dom";

export default function QuickActions() {
  const actions = [
    {
      title: "Create New Tour",
      description: "Add a new tour package",
      icon: "fa fa-plus-circle",
      color: "#007bff",
      link: "#",
    },
    {
      title: "Manage Bookings",
      description: "View and manage all bookings",
      icon: "fa fa-calendar-check",
      color: "#28a745",
      link: "#",
    },
    {
      title: "Add Hotel",
      description: "Add a new hotel listing",
      icon: "fa fa-hotel",
      color: "#ffc107",
      link: "#",
    },
    {
      title: "View Reports",
      description: "Analytics and insights",
      icon: "fa fa-chart-bar",
      color: "#17a2b8",
      link: "#",
    },
  ];

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">Quick Actions</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {actions.map((action, index) => (
            <div key={index} className="col-md-6">
              <Link
                to={action.link}
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                <div
                  className="p-3 border rounded h-100 hover-shadow"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: `${action.color}15`,
                        color: action.color,
                        fontSize: "1.25rem",
                      }}
                    >
                      <span className={action.icon}></span>
                    </div>
                    <div>
                      <h6 className="mb-1" style={{ fontWeight: "600" }}>
                        {action.title}
                      </h6>
                      <small className="text-muted">{action.description}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

