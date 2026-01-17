import { useEffect, useState } from "react";
import { getAuditLogs } from "../../lib/auditServices";
import { useAuth } from "../../context/AuthContext";
import GridTable from "../../components/common/GridTable";
import Modal from "../common/Model";
import { getStatusBadge } from "../../lib/statusBadge";

const PAGE_SIZE = 10;

export default function AuditTable({ tableName }) {
  const { agencyUser, agencyDetails } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    if (!agencyUser) return;

    const fetchLogs = async () => {
      setLoading(true);

      const offset = (page - 1) * PAGE_SIZE;

      const result = await getAuditLogs({
        agency_Id: agencyDetails.agency_id,
        agencyUserId: agencyUser.id,
        tableName: tableName || null,
        limit: PAGE_SIZE + 1,
        offset,
      });

      setHasMore(result.length > PAGE_SIZE);
      setLogs(result.slice(0, PAGE_SIZE));
      setLoading(false);
    };

    fetchLogs();
  }, [agencyUser, page]);

  const columns = [
    { key: "audit_code", header: "#" },
    { key: "action", header: "Action" },
    { key: "table_pk_name", header: "Table PK Name" },
    { key: "table_name", header: "Table" },
    {
      key: "user",
      header: "User",
      render: (row) => row.agency_users?.username || "N/A",
    },
    { 
      key: "role", 
      header: "Role", 
      render: (row) =>
        row.role === "Agency_Admin"
          ? "Agency Admin"
          : row.role === "Agency_User"
          ? "Agency User"
          : "N/A",
    },
    { key: "audit_status", header: "Status" },
    {
      key: "details",
      header: "Details",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setSelectedLog(row)}
        >
          More Details
        </button>
      ),
    },
  ];

  return (
    <>
      <GridTable
        columns={columns}
        data={logs}
        loading={loading}
        page={page}
        hasMore={hasMore}
        onPrevPage={() => setPage((p) => p - 1)}
        onNextPage={() => setPage((p) => p + 1)}
        emptyMessage="No audit logs found"
      />

      {/* ✅ Proper Modal */}
      {selectedLog && (
        <Modal
          title="Audit Log Details"
          onClose={() => setSelectedLog(null)}
        >
          <p><strong>Action:</strong> {selectedLog.action}</p>
          <p><strong>Action Type:</strong> {selectedLog.action_type}</p>
          <p><strong>Table:</strong> {selectedLog.table_name}</p>
          <p><strong>Table PK Name:</strong> {selectedLog.table_pk_name}</p>
          <p><strong>User:</strong> {selectedLog.agency_users?.username || "N/A"}</p>
          <p><strong>Role:</strong> {selectedLog.role === "Agency_Admin" ? "Agency Admin" : "Agency Users" || "N/A"}</p>
          <p><strong>Status:</strong> {getStatusBadge(selectedLog.audit_status)}</p>
          <p><strong>IP Address:</strong> {selectedLog.ip_address || "N/A"}</p>
          <p><strong>Agency:</strong> {selectedLog.agency?.name || "N/A"}</p>
          {/* <p><strong>User Agent:</strong> {selectedLog.user_agent || "N/A"}</p> */}
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(selectedLog.created_at).toLocaleString("en-GB")}
          </p>

          <hr />

          <strong>Details</strong>
          <pre
            style={{
              background: "#f8f9fa",
              padding: "10px",
              borderRadius: "4px",
              maxHeight: "300px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {selectedLog.details
              ? JSON.stringify(
                  typeof selectedLog.details === "string"
                    ? JSON.parse(selectedLog.details)
                    : selectedLog.details,
                  null,
                  2
                )
              : "-"}
          </pre>
        </Modal>
      )}
    </>
  );
}
