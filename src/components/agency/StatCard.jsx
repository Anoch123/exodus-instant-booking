export default function StatCard({ title, value, icon, color, change, changeType }) {
  const changeClass = changeType === "positive" ? "text-success" : changeType === "negative" ? "text-danger" : "text-muted";
  const changeIcon = changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : "";

  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="card shadow-sm h-100" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-2 text-uppercase" style={{ fontSize: "0.75rem" }}>
                {title}
              </h6>
              <h3 className="mb-0" style={{ fontWeight: "600" }}>
                {value}
              </h3>
              {change && (
                <small className={changeClass}>
                  {changeIcon} {change} from last month
                </small>
              )}
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: `${color}15`,
                color: color,
                fontSize: "1.5rem",
              }}
            >
              <span className={icon}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

