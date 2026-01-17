import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { handleSupabaseError } from "../../../utils/errorHandler";
import GridTable from "../../../components/common/GridTable";
import AuditTable from "../../../components/agency/AuditTable";
import { formatDate } from "../../../lib/formatDate";
import { getStatusBadge } from "../../../lib/statusBadge";

const PAGE_SIZE = 10;

export default function ViewLocations() {
  const navigate = useNavigate();
  const { agencyDetails } = useAuth();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ===============================
     FETCH LOCATIONS
  =============================== */
  const fetchLocations = useCallback(async () => {
    if (!agencyDetails?.agency_id) return;

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * PAGE_SIZE;

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("agency_id", agencyDetails.agency_id)
        .order("created_at", { ascending: false })
        .range(offset, offset + 10 - 1);

        setHasMore(data.length > PAGE_SIZE);

      if (error) throw error;

      setLocations(data || []);
    } catch (err) {
      setError(handleSupabaseError(err, "Failed to load locations"));
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, [agencyDetails?.agency_id]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  /* ===============================
     GRID COLUMNS
  =============================== */
  const columns = [
    { key: "name", header: "Name" },
    { key: "district", header: "District" },
    { key: "city", header: "City" },
    { key: "location_type", header: "Type" },
    {
      key: "status",
      header: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "created_at",
      header: "Created At",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "updated_at",
      header: "Updated At",
      render: (row) => formatDate(row.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/agency/locations/create/${row.id}`)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  /* ===============================
     UI
  =============================== */
  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Locations</h2>
        <Link to="/agency/locations/create" className="btn btn-primary">
          <span className="fa fa-plus me-2 ml-1" />
            Add New Location
        </Link>
      </div>

      {error && (
        <div className="alert alert-warning">
          {error.message || "Something went wrong"}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <GridTable
            columns={columns}
            data={locations}
            loading={loading}
            page={page}
            hasMore={hasMore}
            onPrevPage={() => setPage((p) => p - 1)}
            onNextPage={() => setPage((p) => p + 1)}
            emptyMessage="No locations found"
          />
        </div>
      </div>

      <div className="card">
        <div className="p-3">
          <h5 className="mb-0">Location Audit Logs</h5>
          <span>All Audit Logs done for the locations</span>
        </div>
        <div className="card-body">
          <AuditTable tableName="Locations" />
        </div>
      </div>
    </div>
  );
}
