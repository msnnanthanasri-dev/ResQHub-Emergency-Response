import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Resources() {
  const navigate = useNavigate();

  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    location: "",
  });

  const loadResources = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/resources`
      );

      if (!response.ok) {
        throw new Error("Failed to load resources");
      }

      const data = await response.json();

      setResources(data);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.location) {
      alert(
        "Please enter resource name, category and location."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/resources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            quantity: Number(form.quantity) || 0,
            location: form.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add resource"
        );
      }

      alert("Resource added successfully!");

      setForm({
        name: "",
        category: "",
        quantity: "",
        location: "",
      });

      setShowForm(false);

      await loadResources();
    } catch (error) {
      console.error("Error adding resource:", error);

      alert("Failed to add resource.");
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (
    id: number,
    name: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/resources/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete resource"
        );
      }

      alert("Resource deleted successfully!");

      await loadResources();
    } catch (error) {
      console.error("Error deleting resource:", error);

      alert("Failed to delete resource.");
    }
  };

  return (
    <div className="page-container">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Resource Management</h1>
          <p>
            Manage emergency supplies and resources.
          </p>
        </div>

        <div className="page-header-actions">

          <button
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            ← Dashboard
          </button>

          <button
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm
              ? "✕ Close Form"
              : "+ Add Resource"}
          </button>

        </div>
      </div>

      {/* ADD RESOURCE FORM */}
      {showForm && (
        <div className="form-card">

          <h2>Add Resource</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* RESOURCE NAME */}
              <div className="form-group">

                <label>
                  Resource Name *
                </label>

                <input
                  value={form.name}
                  placeholder="Example: Drinking Water"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                />

              </div>

              {/* CATEGORY */}
              <div className="form-group">

                <label>
                  Category *
                </label>

                <input
                  value={form.category}
                  placeholder="Example: Food"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                />

              </div>

              {/* QUANTITY */}
              <div className="form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.quantity}
                  placeholder="Example: 100"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      quantity: event.target.value,
                    })
                  }
                />

              </div>

              {/* LOCATION */}
              <div className="form-group">

                <label>
                  Location *
                </label>

                <input
                  value={form.location}
                  placeholder="Example: Chennai Warehouse"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      location: event.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* FORM BUTTONS */}
            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Resource"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* RESOURCE LIST */}
      <div className="content-card">

        <div className="content-card-header">

          <div>
            <h2>Available Resources</h2>

            <p>
              Emergency resource inventory
            </p>
          </div>

          <span className="count-badge">
            {resources.length} Resources
          </span>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="empty-state">
            <h3>Loading resources...</h3>
            <p>
              Please wait while resources are loaded.
            </p>
          </div>

        ) : resources.length === 0 ? (

          /* EMPTY */
          <div className="empty-state">

            <h3>
              No resources found
            </h3>

            <p>
              Add your first emergency resource above.
            </p>

          </div>

        ) : (

          /* TABLE */
          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {resources.map((resource) => (

                  <tr key={resource.id}>

                    <td>
                      <strong>
                        {resource.name}
                      </strong>
                    </td>

                    <td>
                      {resource.category}
                    </td>

                    <td>
                      {resource.quantity}
                    </td>

                    <td>
                      📍 {resource.location}
                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteResource(
                            resource.id,
                            resource.name
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Resources;
