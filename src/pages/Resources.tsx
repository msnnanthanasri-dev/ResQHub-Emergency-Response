import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

function Resources() {
  const navigate = useNavigate();

  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    location: "",
  });

  const loadResources = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/resources"
      );

      if (!response.ok) {
        throw new Error("Failed to load resources");
      }

      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.location) {
      alert("Please enter name, category and location.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/resources",
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
        throw new Error(data.message || "Failed to add resource");
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
      console.error(error);
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

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/resources/${id}`,
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
      console.error(error);
      alert("Failed to delete resource.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Resource Management</h1>
          <p>Manage emergency supplies and resources.</p>
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
            {showForm ? "✕ Close Form" : "+ Add Resource"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add Resource</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Resource Name *</label>
                <input
                  value={form.name}
                  placeholder="Example: Drinking Water"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <input
                  value={form.category}
                  placeholder="Example: Food"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={form.quantity}
                  placeholder="Example: 100"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  value={form.location}
                  placeholder="Example: Chennai Warehouse"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />
              </div>
            </div>

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
                {saving ? "Saving..." : "Save Resource"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Available Resources</h2>
            <p>Emergency resource inventory</p>
          </div>

          <span className="count-badge">
            {resources.length} Resources
          </span>
        </div>

        {resources.length === 0 ? (
          <div className="empty-state">
            <h3>No resources found</h3>
            <p>Add your first emergency resource above.</p>
          </div>
        ) : (
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
                      <strong>{resource.name}</strong>
                    </td>

                    <td>{resource.category}</td>

                    <td>{resource.quantity}</td>

                    <td>📍 {resource.location}</td>

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