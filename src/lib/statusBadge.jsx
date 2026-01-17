export const getStatusBadge = (status) => {
    const statusColors = {
      SUCCESS: "success",
      FAILED: "danger",
      PENDING: "warning",
      WARNING: "warning",
      Active: "success",
      Inactive: "danger"
    };
    const color = statusColors[status] || "secondary";
    return (
      <span className={`badge bg-${color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };