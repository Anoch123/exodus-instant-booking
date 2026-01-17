import React from "react";

export default function GridTable({
  columns = [],
  data = [],
  loading = false,
  page = 1,
  hasMore = false,
  onNextPage,
  onPrevPage,
  emptyMessage = "No records found",
}) {
  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover table-striped mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="text-center p-3">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center p-3 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row, rowIndex)
                        : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(onNextPage || onPrevPage) && (
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onPrevPage}
            disabled={page === 1 || loading}
          >
            ← Previous
          </button>

          <span className="text-muted">
            Page {page}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onNextPage}
            disabled={!hasMore || loading}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
