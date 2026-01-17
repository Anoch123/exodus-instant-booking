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

export default function ViewCategories() {
  const navigate = useNavigate();
  const { agencyDetails } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ===============================
     FETCH CATEGORIES
  =============================== */
  const fetchCategories = useCallback(async () => {
    if (!agencyDetails?.agency_id) return;

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * PAGE_SIZE;

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("agency_id", agencyDetails.agency_id)
        .order("created_at", { ascending: false })
        .range(offset, offset + 10 - 1);

        setHasMore(data.length > PAGE_SIZE);

      if (error) throw error;

      setCategories(data || []);
    } catch (err) {
      setError(handleSupabaseError(err, "Failed to load ategories"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [agencyDetails?.agency_id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ===============================
     GRID COLUMNS
  =============================== */
  const columns = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    {
      key: "parent_tour_category",
      header: "Parent Category",
      render: (row) => {
        if (!row.parent_tour_category) return "—";
        const parentCat = categories.find((cat) => cat.id === row.parent_tour_category);
        return parentCat?.name || "—";
      },
    },
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
            onClick={() =>
              navigate(`/agency/categories/create/${row.id}`, {
                state: { categories },
              })
            }
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
        <h2>Manage Categories</h2>
        <Link to="/agency/categories/create" state={{ categories }} className="btn btn-primary">
          <span className="fa fa-plus me-2" />
          Add New Category
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
            data={categories}
            loading={loading}
            page={page}
            hasMore={hasMore}
            onPrevPage={() => setPage((p) => p - 1)}
            onNextPage={() => setPage((p) => p + 1)}
            emptyMessage="No categories found"
          />
        </div>
      </div>

      <div className="card">
        <div className="p-3">
          <h5 className="mb-0">Category Audit Logs</h5>
          <span>All Audit Logs done for the categories</span>
        </div>
        <div className="card-body">
          <AuditTable tableName="Categories" />
        </div>
      </div>
    </div>
  );
}
