import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useForm } from '../../../hooks/useForm';
import { categoryService } from '../../../services/crudService';
import { auditLog } from '../../../lib/audit';
import { getUpdatedFields } from '../../../lib/auditUtils';

const initialData = {
  name: '',
  slug: '',
  parent_category: '',
  description: '',
  status: '',
};

export default function CreateCategory() {
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const { agencyUser, agencyDetails } = useAuth();
  const location = useLocation();

  const isEditMode = Boolean(categoryId);
  const categories = location.state?.categories || [];

  // Form setup
  const form = useForm(
    isEditMode
      ? () => categoryService.fetch(categoryId, agencyUser.agency_id)
      : null,
    async (payload, isEdit) => {
      if (isEdit) {
        return categoryService.update(categoryId, payload, agencyUser.agency_id);
      } else {
        return categoryService.create(payload, agencyUser.agency_id);
      }
    },
    initialData,
    isEditMode
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agencyUser?.agency_id) {
      form.setError({ message: 'Agency not found. Please re-login.' });
      return;
    }

    try {
      const payload = {
        name: form.formData.name.trim(),
        slug: form.formData.slug,
        parent_tour_category: form.formData.parent_category || null,
        description: form.formData.description.trim() || null,
        status: form.formData.status,
      };

      const result = await form.save(payload);

      // Audit logging
      const baseLog = {
        agency_user_id: agencyUser.id,
        role: agencyUser.role,
        tableName: 'Categories',
      };

      if (isEditMode) {
        const updatedDetails = getUpdatedFields(form.originalData, payload);
        if (Object.keys(updatedDetails).length > 0) {
          await auditLog({
            ...baseLog,
            table_pk_name: form.formData.name,
            recordId: categoryId,
            action: 'Category Updated',
            action_type: 'UPDATE',
            details: updatedDetails,
            agency_id: agencyDetails.agency_id,
            audit_status: 'SUCCESS',
          });
        }
      } else {
        await auditLog({
          ...baseLog,
          table_pk_name: result?.name,
          recordId: result?.id,
          action: 'Category Created',
          action_type: 'CREATE',
          details: payload,
          agency_id: agencyDetails.agency_id,
          audit_status: 'SUCCESS',
        });
      }

      navigate('/agency/agency_categories');
    } catch (err) {
      console.error(err);
    }
  };

  if (!agencyUser || form.pageLoading) {
    return <div className="container py-4">Loading...</div>;
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ background: '#f8f9fa', minHeight: '100vh' }}
    >
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
        disabled={form.loading}
      >
        ← Back to Categories
      </button>

      <h2>{isEditMode ? 'Update Category' : 'Create New Category'}</h2>

      {form.error && (
        <div className="alert alert-warning">
          {form.error.message || 'Something went wrong'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Category Name *</label>
          <input
            type="text"
            className="form-control"
            value={form.formData.name}
            onChange={(e) => form.updateField('name', e.target.value)}
            required
            disabled={form.loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Slug *</label>
          <input
            className="form-control"
            value={form.formData.slug}
            onChange={(e) => form.updateField('slug', e.target.value)}
            required
            disabled={form.loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={form.formData.description}
            onChange={(e) => form.updateField('description', e.target.value)}
            disabled={form.loading}
          />
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Parent Category</label>
            <select
              className="form-control"
              value={form.formData.parent_category}
              onChange={(e) => form.updateField('parent_category', e.target.value)}
              disabled={form.loading}
            >
              <option value="">No Parent</option>

              {categories
                .filter((cat) => cat.id !== categoryId)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3 col-md-6">
            <label className="form-label">Status *</label>
            <select
              className="form-control"
              value={form.formData.status}
              onChange={(e) => form.updateField('status', e.target.value)}
              required
              disabled={form.loading}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" disabled={form.loading}>
          {form.loading
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
              ? 'Update Category'
              : 'Create Category'}
        </button>
      </form>
    </div>
  );
}
