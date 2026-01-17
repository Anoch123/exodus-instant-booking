import { use, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useHotelForm } from '../../../hooks/useHotelForm';
import { useImageManager } from '../../../hooks/useImageManager';
import sriLankaCities from '../../../config/srilankacities.json';
import { auditLog } from '../../../lib/audit';
import { getUpdatedFields } from '../../../lib/auditUtils';
import { Editor } from 'primereact/editor';

export default function CreateHotel() {
  const navigate = useNavigate();
  const { id: hotelId } = useParams();
  const { agencyUser, agencyDetails } = useAuth();

  // Environment variables
  const S3_BUCKET = import.meta.env.VITE_SUPABASE_S3_BUCKET;

  // Custom hooks
  const hotelForm = useHotelForm(hotelId, agencyUser?.agency_id);
  const imageManager = useImageManager(S3_BUCKET, agencyUser?.agency_id, hotelId);

  const districtOptions = useMemo(
    () => Object.keys(sriLankaCities || {}),
    []
  );

  const cityOptions = useMemo(() => {
    if (!hotelForm.selectedDistrict || !sriLankaCities[hotelForm.selectedDistrict]) {
      return [];
    }
    return sriLankaCities[hotelForm.selectedDistrict].cities || [];
  }, [hotelForm.selectedDistrict]);
  // Load existing images on mount
  useMemo(() => {
    if (hotelForm.isEditMode && hotelForm.originalData?.images) {
      imageManager.setExistingImages(hotelForm.originalData.images);
    }
  }, [hotelForm.isEditMode, hotelForm.originalData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agencyUser?.agency_id) {
      hotelForm.updateField('error', { message: 'Agency not found. Please re-login.' });
      return;
    }

    try {
      // Upload new images and get all image URLs (including existing ones not removed)
      const allImageUrls = await imageManager.uploadNewImages(imageManager.imagePreviews.filter(img => img.startsWith('http')));

      const payload = {
        name: hotelForm.formData.name.trim(),
        description: hotelForm.formData.description.trim() || null,
        district: hotelForm.formData.district,
        city: hotelForm.formData.city,
        country: hotelForm.formData.country,
        status: hotelForm.formData.status,
        images: allImageUrls,
        total_rooms_count: hotelForm.formData.total_rooms_count,
        per_person_chargers: hotelForm.formData.per_person_chargers,
        hotel_rating: hotelForm.formData.hotel_rating,
        email: hotelForm.formData.email || null,
        phone: hotelForm.formData.phone || null,
        website: hotelForm.formData.website || null,
        is_wifi: hotelForm.formData.is_wifi,
        is_balcony: hotelForm.formData.is_balcony,
        is_spa: hotelForm.formData.is_spa,
        is_room_service: hotelForm.formData.is_room_service,
        is_swimming_pool: hotelForm.formData.is_swimming_pool,
        is_air_conditioned: hotelForm.formData.is_air_conditioned,
        is_family_rooms: hotelForm.formData.is_family_rooms,
        is_gym: hotelForm.formData.is_gym
      };

      // Save hotel
      const result = await hotelForm.saveHotel(payload);

      // Log audit
      const baseLog = {
        agency_user_id: agencyUser.id,
        role: agencyUser.role,
        tableName: 'Hotels',
      };

      if (hotelForm.isEditMode) {
        const updatedDetails = getUpdatedFields(hotelForm.originalData, payload);
        if (Object.keys(updatedDetails).length > 0) {
          await auditLog({
            ...baseLog,
            table_pk_name: hotelForm.formData.name,
            recordId: hotelId,
            action: 'Hotel Updated',
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
          action: 'Hotel Created',
          action_type: 'CREATE',
          details: payload,
          agency_id: agencyDetails.agency_id,
          audit_status: 'SUCCESS',
        });
      }

      navigate('/agency/agency_hotels');
    } catch (err) {
      console.error(err);
    }
  };

  const AMENITIES = [
    { label: 'WiFi', field: 'is_wifi' },
    { label: 'Balcony', field: 'is_balcony' },
    { label: 'Spa', field: 'is_spa' },
    { label: 'Room Service', field: 'is_room_service' },
    { label: 'Swimming Pool', field: 'is_swimming_pool' },
    { label: 'Air Conditioned', field: 'is_air_conditioned' },
    { label: 'Family Rooms', field: 'is_family_rooms' },
    { label: 'Gym', field: 'is_gym' },
  ];


  if (!agencyUser || hotelForm.pageLoading) {
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
        disabled={hotelForm.loading}
      >
        ← Back to Hotels
      </button>

      <h2>{hotelForm.isEditMode ? 'Update Hotel' : 'Create New Hotel'}</h2>

      {(hotelForm.error || imageManager.error) && (
        <div className="alert alert-warning">
          {hotelForm.error?.message || imageManager.error || 'Something went wrong'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Hotel Name *</label>
          <input
            type="text"
            className="form-control"
            value={hotelForm.formData.name}
            onChange={(e) => hotelForm.updateField('name', e.target.value)}
            required
            disabled={hotelForm.loading}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <Editor
            value={hotelForm.formData.description}
            onTextChange={(e) => hotelForm.updateField('description', e.htmlValue)}
            style={{ height: '320px' }}
            disabled={hotelForm.loading}
          />
        </div>

        <div className="row">
          {/* District */}
          <div className="mb-3 col-md-4">
            <label className="form-label">District *</label>
            <select
              className="form-control"
              value={hotelForm.selectedDistrict}
              onChange={(e) => hotelForm.updateDistrict(e.target.value)}
              required
              disabled={hotelForm.loading}
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
          <div className="mb-3 col-md-4">
            <label className="form-label">City *</label>
            <select
              className="form-control"
              value={hotelForm.formData.city}
              onChange={(e) => hotelForm.updateField('city', e.target.value)}
              required
              disabled={hotelForm.loading || !hotelForm.selectedDistrict}
            >
              <option value="">Select city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Country *</label>
            <input
              type="text"
              className="form-control"
              value={hotelForm.formData.country}
              onChange={(e) => hotelForm.updateField('country', e.target.value)}
              required
              disabled={hotelForm.loading}
            />
          </div>
        </div>

        <div className="row">
          {/* Total Room Count */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Total Room Count *</label>
            <select
              className="form-control"
              value={hotelForm.formData.total_rooms_count}
              onChange={(e) => hotelForm.updateField('total_rooms_count', e.target.value)}
              required
              disabled={hotelForm.loading}
            >
              <option value="">Select type</option>
              <option value="Small (1-20)">Small (1-20)</option>
              <option value="Medium (21-100)">Medium (21-100)</option>
              <option value="Large (100+)">Large (100+)</option>
            </select>
          </div>

          {/* per person charge */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Per Person Charge (USD) *</label>
            <input
              type="number"
              className="form-control"
              value={hotelForm.formData.per_person_chargers}
              onChange={(e) => hotelForm.updateField('per_person_chargers', e.target.value)}
              required
              disabled={hotelForm.loading}
            />
          </div>

          {/* hotel rating */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Hotel Rating *</label>
            <input
              type="number"
              className="form-control"
              value={hotelForm.formData.hotel_rating}
              onChange={(e) => hotelForm.updateField('hotel_rating', e.target.value)}
              required
              disabled={hotelForm.loading}
            />
          </div>

          {/* Status */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Status *</label>
            <select
              className="form-control"
              value={hotelForm.formData.status}
              onChange={(e) => hotelForm.updateField('status', e.target.value)}
              required
              disabled={hotelForm.loading}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={hotelForm.formData.email}
              onChange={(e) => hotelForm.updateField('email', e.target.value)}
              disabled={hotelForm.loading}
            />
          </div>

          {/* Phone */}
          <div className="mb-3 col-md-4">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={hotelForm.formData.phone}
              onChange={(e) => hotelForm.updateField('phone', e.target.value)}
              disabled={hotelForm.loading}
            />
          </div>

          {/* Website */}
          <div className="mb-3 col-md-12">
            <label className="form-label">Website</label>
            <input
              type="text"
              className="form-control"
              value={hotelForm.formData.website}
              onChange={(e) => hotelForm.updateField('website', e.target.value)}
              disabled={hotelForm.loading}
            />
          </div>

          {/* Amenities */}
          <div className="mb-3 col-md-12">
            <label className="form-label">Amenities</label>

            {/* Individual Checkboxes */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
              {AMENITIES.map((amenity) => (
                <div key={amenity.field} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id={amenity.field}
                    checked={hotelForm.formData[amenity.field] || false}
                    onChange={(e) =>
                      hotelForm.updateField(amenity.field, e.target.checked)
                    }
                    disabled={hotelForm.loading}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      cursor: 'pointer',
                      accentColor: '#007bff',
                      position: 'relative'
                    }}
                  />
                  <label
                    htmlFor={amenity.field}
                    style={{ 
                      cursor: 'pointer', 
                      marginBottom: 0,
                      userSelect: 'none',
                      fontSize: '14px'
                    }}
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="mb-3">
          <label className="form-label">Hotel Images (Max 5)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={(e) => imageManager.handleImageSelect(Array.from(e.target.files))}
            disabled={hotelForm.loading || !imageManager.canAddMore}
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
                        width: '80%',
                        height: '180px',
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      onClick={() => imageManager.removeImage(idx)}
                      disabled={hotelForm.loading}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="btn btn-primary"
          disabled={hotelForm.loading || imageManager.uploading}
        >
          {imageManager.uploading
            ? 'Uploading images...'
            : hotelForm.loading
              ? hotelForm.isEditMode
                ? 'Updating...'
                : 'Creating...'
              : hotelForm.isEditMode
                ? 'Update Location'
                : 'Create Location'}
        </button>
      </form>
    </div>
  );
}
