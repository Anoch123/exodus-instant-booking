import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useLocationForm } from '../../../hooks/useLocationForm';
import { useImageManager } from '../../../hooks/useImageManager';
import sriLankaCities from '../../../config/srilankacities.json';
import { auditLog } from '../../../lib/audit';
import { getUpdatedFields } from '../../../lib/auditUtils';

const PAGE_SIZE = 10;

export default function CreateLocation() {
  const navigate = useNavigate();
  const { id: locationId } = useParams();
  const { agencyUser, agencyDetails } = useAuth();

  // Environment variables
  const S3_BUCKET = import.meta.env.VITE_SUPABASE_S3_BUCKET || 'location-images';

  // Custom hooks
  const locationForm = useLocationForm(locationId, agencyUser?.agency_id);
  const imageManager = useImageManager(S3_BUCKET, agencyUser?.agency_id, locationId);

  const locationTypes = ['Activity', 'Attraction'];

  const districtOptions = useMemo(
    () => Object.keys(sriLankaCities || {}),
    []
  );

  const cityOptions = useMemo(() => {
    if (!locationForm.selectedDistrict || !sriLankaCities[locationForm.selectedDistrict]) {
      return [];
    }
    return sriLankaCities[locationForm.selectedDistrict].cities || [];
  }, [locationForm.selectedDistrict]);

  // Load existing images on mount
  useMemo(() => {
    if (locationForm.isEditMode && locationForm.originalData?.images) {
      imageManager.setExistingImages(locationForm.originalData.images);
    }
  }, [locationForm.isEditMode, locationForm.originalData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agencyUser?.agency_id) {
      locationForm.updateField('error', { message: 'Agency not found. Please re-login.' });
      return;
    }

    try {
      // Upload new images
      const allImageUrls = await imageManager.uploadNewImages(locationForm.formData.images);

      const payload = {
        name: locationForm.formData.name.trim(),
        description: locationForm.formData.description.trim() || null,
        district: locationForm.formData.district,
        city: locationForm.formData.city,
        location_type: locationForm.formData.location_type,
        status: locationForm.formData.status,
        images: allImageUrls,
      };

      // Save location
      const result = await locationForm.saveLocation(payload);

      // Log audit
      const baseLog = {
        agency_user_id: agencyUser.id,
        role: agencyUser.role,
        tableName: 'Locations',
      };

      if (locationForm.isEditMode) {
        const updatedDetails = getUpdatedFields(locationForm.originalData, payload);
        if (Object.keys(updatedDetails).length > 0) {
          await auditLog({
            ...baseLog,
            table_pk_name: locationForm.formData.name,
            recordId: locationId,
            action: 'Location Updated',
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
          action: 'Location Created',
          action_type: 'CREATE',
          details: payload,
          agency_id: agencyDetails.agency_id,
          audit_status: 'SUCCESS',
        });
      }

      navigate('/agency/agency_locations');
    } catch (err) {
      console.error(err);
    }
  };

  if (!agencyUser || locationForm.pageLoading) {
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
        disabled={locationForm.loading}
      >
        ← Back to Locations
      </button>

      <h2>{locationForm.isEditMode ? 'Update Location' : 'Create New Location'}</h2>

      {(locationForm.error || imageManager.error) && (
        <div className="alert alert-warning">
          {locationForm.error?.message || imageManager.error || 'Something went wrong'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Location Name *</label>
          <input
            type="text"
            className="form-control"
            value={locationForm.formData.name}
            onChange={(e) => locationForm.updateField('name', e.target.value)}
            required
            disabled={locationForm.loading}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={locationForm.formData.description}
            onChange={(e) => locationForm.updateField('description', e.target.value)}
            disabled={locationForm.loading}
          />
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="mb-3">
          <label className="form-label">Location Images (Max 5)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={(e) => imageManager.handleImageSelect(Array.from(e.target.files))}
            disabled={locationForm.loading || !imageManager.canAddMore}
          />
          <small className="text-muted">
            Max 5 images, 5MB each. Supported: JPG, PNG, WebP
          </small>

          {/* Image Previews */}
          {imageManager.imagePreviews.length > 0 && (
            <div className="row mt-3">
              {imageManager.imagePreviews.map((preview, idx) => (
                <div key={idx} className="col-md-3 mb-3">
                  <div className="position-relative">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="img-fluid rounded"
                      onError={(e) => {
                        console.error(`Image failed to load (${idx}):`, preview);
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                      }}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      onClick={() => imageManager.removeImage(idx)}
                      disabled={locationForm.loading}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="row">
          {/* District */}
          <div className="mb-3 col-md-6">
            <label className="form-label">District *</label>
            <select
              className="form-control"
              value={locationForm.selectedDistrict}
              onChange={(e) => locationForm.updateDistrict(e.target.value)}
              required
              disabled={locationForm.loading}
            >
              <option value="">Select district</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="mb-3 col-md-6">
            <label className="form-label">City *</label>
            <select
              className="form-control"
              value={locationForm.formData.city}
              onChange={(e) => locationForm.updateField('city', e.target.value)}
              required
              disabled={locationForm.loading || !locationForm.selectedDistrict}
            >
              <option value="">Select city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          {/* Type */}
          <div className="mb-3 col-md-6">
            <label className="form-label">Location Type *</label>
            <select
              className="form-control"
              value={locationForm.formData.location_type}
              onChange={(e) => locationForm.updateField('location_type', e.target.value)}
              required
              disabled={locationForm.loading}
            >
              <option value="">Select type</option>
              {locationTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="mb-3 col-md-6">
            <label className="form-label">Status *</label>
            <select
              className="form-control"
              value={locationForm.formData.status}
              onChange={(e) => locationForm.updateField('status', e.target.value)}
              required
              disabled={locationForm.loading}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary"
          disabled={locationForm.loading || imageManager.uploading}
        >
          {imageManager.uploading
            ? 'Uploading images...'
            : locationForm.loading
              ? locationForm.isEditMode
                ? 'Updating...'
                : 'Creating...'
              : locationForm.isEditMode
                ? 'Update Location'
                : 'Create Location'}
        </button>
      </form>
    </div>
  );
}
