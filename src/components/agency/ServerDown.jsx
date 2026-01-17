import { useServerStatus } from "../../context/ServerStatusContext";

/**
 * Component displayed when server is down
 * Blocks access to the system until server is back online
 */
export default function ServerDown() {
  const { refreshStatus, lastCheckTime } = useServerStatus();

  const handleRetry = () => {
    refreshStatus();
  };

  const lastCheckText = lastCheckTime
    ? new Date(lastCheckTime).toLocaleTimeString()
    : "Never";

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}
    >
      <div className="container d-flex justify-content-center">
        <div
          className="text-center p-5 shadow-lg rounded"
          style={{
            background: "#fff",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <div className="mb-4">
            <i 
              className="fa fa-server"
              style={{ fontSize: "80px", color: "#dc3545" }}
            ></i>
          </div>

          <h1 className="mb-3" style={{ color: "#dc3545", fontWeight: "bold" }}>
            Server Unavailable
          </h1>

          <p className="lead mb-4" style={{ color: "#6c757d" }}>
            We're unable to connect to the server at this time. This could be due to:
          </p>

          <ul className="text-start mb-4" style={{ color: "#6c757d", maxWidth: "400px", margin: "0 auto" }}>
            <li>Network connectivity issues</li>
            <li>Server maintenance</li>
            <li>Temporary server outage</li>
          </ul>

          <div className="alert alert-info mb-4" role="alert">
            <strong>Last Check:</strong> {lastCheckText}
            <br />
            <small>We're automatically checking the server status every 30 seconds.</small>
          </div>

          <button
            onClick={handleRetry}
            className="btn btn-primary btn-lg px-5 mb-3"
            style={{ minWidth: "200px" }}
          >
            <span className="fa fa-refresh me-2"></span>
            Retry Connection
          </button>

          <p className="text-muted small mt-3">
            Please check your internet connection and try again. 
            The system will automatically reconnect when the server is available.
          </p>
        </div>
      </div>
    </div>
  );
}

