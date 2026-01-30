import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { categoryService } from "../../../services/categoryService";
import { useAuth } from "../../../context/AuthContext";
import { handleSupabaseError } from "../../../utils/errorHandler";
import { auditLog } from "../../../lib/audit";
import { getUpdatedFields } from "../../../lib/auditUtils";

export default function CreateCategory() {
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const { agencyUser, agencyDetails } = useAuth();
  const location = useLocation();

  const isEditMode = Boolean(categoryId);

  const categories = location.state?.categories || [];

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_category: "",
    description: "",
    status: "",
  });

  // ⭐ ORIGINAL DB DATA (FOR AUDIT)
  const [originalData, setOriginalData] = useState(null);

  /* ===============================
     LOAD CATEGORY (EDIT MODE)
  =============================== */
  useEffect(() => {
    if (!isEditMode || !agencyUser?.agency_id) return;

    const fetchCategories = async () => {
      try {
        const resp = await categoryService.getById(categoryId, agencyUser.agency_id);
        const data = resp?.data;
        if (!data) throw new Error("Category not found");

        const cleanedData = {
          name: data.name || "",
          slug: data.slug || "",
          parent_category: data.parent_tour_category || "",
          description: data.description || "",
          status: data.status || "",
        };

        setFormData(cleanedData);
        setOriginalData(cleanedData);
      } catch (err) {
        setError(handleSupabaseError(err, "Failed to load category"));
      } finally {
        setPageLoading(false);
      }
    };

    fetchCategories();
  }, [isEditMode, categoryId, agencyUser?.agency_id]);

  if (!agencyUser || pageLoading) {
    return <div className="container py-4">Loading...</div>;
  }

  /* ===============================
     SUBMIT (CREATE / UPDATE)
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agencyUser.agency_id) {
      setError({ message: "Agency not found. Please re-login." });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug,
        parent_category: formData.parent_category,
        description: formData.description.trim() || null,
        status: formData.status,
      };

      // ⭐ CORRECT COMPARISON
      const updatedDetails = isEditMode
        ? getUpdatedFields(originalData, payload)
        : payload;

      const dbPayload = {
        name: payload.name,
        slug: payload.slug,
        parent_tour_category: payload.parent_category || null,
        description: payload.description,
        status: payload.status,
      };


      let data = null;
      if (isEditMode) {
        const payload = {
          agencyId: agencyUser.agency_id,
          agencyUserId: agencyUser.id,
          role: agencyUser.role,
          ...dbPayload,
        };
        const resp = await categoryService.update(categoryId, payload);
        data = resp?.data;
      } else {
        const payload = {
          agencyId: agencyUser.agency_id,
          agencyUserId: agencyUser.id,
          role: agencyUser.role,
          name: dbPayload.name,
          slug: dbPayload.slug,
          parent_tour_category: dbPayload.parent_tour_category,
          description: dbPayload.description,
          status: dbPayload.status,
        };
        const resp = await categoryService.create(payload);
        data = resp?.data;
      }

      const baseLog = {
        agency_user_id: agencyUser.id,
        role: agencyUser.role,
        tableName: "Categories",
      };

      if (isEditMode) {
        // ⭐ LOG ONLY IF SOMETHING CHANGED
        if (Object.keys(updatedDetails).length > 0) {
          await auditLog({
            ...baseLog,
            table_pk_name: formData.name,
            recordId: categoryId,
            action: "Category Updated",
            action_type: "UPDATE",
            details: updatedDetails,
            agency_id: agencyDetails.agency_id,
            audit_status: "SUCCESS",
          });
        }
      } else {
        await auditLog({
          ...baseLog,
          table_pk_name: data?.name,
          recordId: data?.id,
          action: "Category Created",
          action_type: "CREATE",
          details: payload,
          agency_id: agencyDetails.agency_id,
          audit_status: "SUCCESS",
        });
      }

      navigate("/agency/agency_categories");
    } catch (err) {
      console.error(err);
      setError(handleSupabaseError(err, "Failed to save category"));
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
        disabled={loading}
      >
        ← Back to Categories
      </button>

      <h2>{isEditMode ? "Update Category" : "Create New Category"}</h2>

      {error && (
        <div className="alert alert-warning">
          {error.message || "Something went wrong"}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Category Name *</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Slug *</label>
          <input
            className="form-control"
            value={formData.slug}
            onChange={(e) =>
              setFormData((p) => ({ ...p, slug: e.target.value }))
            }
            required
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            disabled={loading}
          />
        </div>

        <div className="row">
          {/* Parent Category */}
          <div className="mb-3 col-md-6">
            <label className="form-label">Parent Category</label>
            <select
              className="form-control"
              value={formData.parent_category}
              onChange={(e) =>
                setFormData((p) => ({ ...p, parent_category: e.target.value }))
              }
              disabled={loading}
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

          {/* Status */}
          <div className="mb-3 col-md-6">
            <label className="form-label">Status *</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) =>
                setFormData((p) => ({ ...p, status: e.target.value }))
              }
              required
              disabled={loading}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading
            ? isEditMode ? "Updating..." : "Creating..."
            : isEditMode ? "Update Location" : "Create Location"}
        </button>
      </form>
    </div>
  );
}
