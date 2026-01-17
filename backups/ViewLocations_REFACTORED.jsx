import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useList } from '../../../hooks/useList';
import { locationService } from '../../../services/crudService';
import GridTable from '../../../components/common/GridTable';
import AuditTable from '../../../components/agency/AuditTable';
import { formatDate } from '../../../lib/formatDate';
import { getStatusBadge } from '../../../lib/statusBadge';

const PAGE_SIZE = 10;

export default function ViewLocations() {
  const navigate = useNavigate();
  const { agencyDetails } = useAuth();

  // Fetch function
  const fetchLocations = async (page, pageSize) => {
    return locationService.fetchPaginated(
      agencyDetails.agency_id,
      page,
      pageSize,
      { orderBy: 'created_at', ascending: false }
    );
  };

  // Use list hook
  const list = useList(fetchLocations, PAGE_SIZE);

  // Grid columns
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'district', header: 'District' },
    { key: 'city', header: 'City' },
    { key: 'location_type', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: 'created_at',
      header: 'Created At',
      render: (row) => formatDate(row.created_at),
    },
    {
      key: 'updated_at',
      header: 'Updated At',
      render: (row) => formatDate(row.updated_at),
    },
    {
      key: 'actions',
      header: 'Actions',
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

  return (
    <div
      className="container-fluid py-4"
      style={{ background: '#f8f9fa', minHeight: '100vh' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Locations</h2>
        <Link to="/agency/locations/create" className="btn btn-primary">
          <span className="fa fa-plus me-2" />
          Add New Location
        </Link>
      </div>

      {list.error && (
        <div className="alert alert-warning">
          {list.error.message || 'Something went wrong'}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <GridTable
            columns={columns}
            data={list.data}
            loading={list.loading}
            page={list.page}
            hasMore={list.hasMore}
            onPrevPage={list.prevPage}
            onNextPage={list.nextPage}
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
