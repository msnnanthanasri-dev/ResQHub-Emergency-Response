
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
  const [editingId, setEditingId] = useState<number | null>(null);

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
      alert("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);

    setForm({
      name: "",
      category: "",
      quantity: "",
      location: "",
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.location) {
      alert("Please enter resource name, category and location.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/api/resources/${editingId}`
        : `${API_URL}/api/resources`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          quantity: Number(form.quantity) || 0,
          location: form.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update resource"
              : "Failed to add resource")
        );
      }

      alert(
        isEditing
          ? "Resource updated successfully!"
          : "Resource added successfully!"
      );

      resetForm();
      await loadResources();
    } catch (error) {
      console.error("Error saving resource:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save resource."
      );
    } finally {
      setSaving(false);
    }
  };

  const editResource = (resource: Resource) => {
    setEditingId(resource.id);

    setForm({
      name: resource.name,
      category: resource.category,
      quantity: String(resource.quantity),
      location: resource.location,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  const totalQuantity = resources.reduce(
    (total, resource) => total + Number(resource.quantity || 0),
    0
  );

  const categories = new Set(
    resources.map((resource) => resource.category)
  ).size;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef6ff 0%, #f8fbff 50%, #eefbf6 100%)",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
              }}
            >
              📦
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Resource Management
              </h1>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                  fontSize: "15px",
                }}
              >
                Manage emergency supplies and resources
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #dbe4ef",
              background: "white",
              color: "#334155",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Dashboard
          </button>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background:
                "linear-gradient(135deg, #2563eb, #0ea5e9)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
            }}
          >
            {showForm ? "✕ Close Form" : "+ Add Resource"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* SUMMARY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <SummaryCard
            icon="📦"
            title="Total Resources"
            value={resources.length}
            subtitle="Registered items"
          />

          <SummaryCard
            icon="🔢"
            title="Total Quantity"
            value={totalQuantity}
            subtitle="Available units"
          />

          <SummaryCard
            icon="🏷️"
            title="Categories"
            value={categories}
            subtitle="Resource categories"
          />
        </div>

        {/* FORM */}
        {showForm && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              marginBottom: "28px",
              boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#0f172a",
              }}
            >
              {editingId !== null
                ? "✏️ Edit Resource"
                : "➕ Add New Resource"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                }}
              >
                <FormInput
                  label="Resource Name *"
                  placeholder="Example: Drinking Water"
                  value={form.name}
                  onChange={(value) =>
                    setForm({ ...form, name: value })
                  }
                />

                <FormInput
                  label="Category *"
                  placeholder="Example: Food"
                  value={form.category}
                  onChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                />

                <FormInput
                  label="Quantity"
                  type="number"
                  placeholder="Example: 100"
                  value={form.quantity}
                  onChange={(value) =>
                    setForm({ ...form, quantity: value })
                  }
                />

                <FormInput
                  label="Location *"
                  placeholder="Example: Chennai Warehouse"
                  value={form.location}
                  onChange={(value) =>
                    setForm({ ...form, location: value })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "12px 22px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Save Changes"
                    : "Save Resource"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RESOURCE LIST */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            borderRadius: "22px",
            padding: "25px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Available Resources
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                }}
              >
                Emergency resource inventory
              </p>
            </div>

            <div
              style={{
                background: "#dbeafe",
                color: "#1d4ed8",
                padding: "8px 14px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {resources.length} Resources
            </div>
          </div>

          {loading ? (
            <EmptyState
              icon="⏳"
              title="Loading resources..."
              message="Please wait while resources are loaded."
            />
          ) : resources.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No resources found"
              message="Add your first emergency resource above."
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "20px",
                    boxShadow:
                      "0 8px 20px rgba(15,23,42,0.06)",
                    transition: "transform 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "22px",
                          marginBottom: "8px",
                        }}
                      >
                        📦
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          color: "#0f172a",
                          fontSize: "19px",
                        }}
                      >
                        {resource.name}
                      </h3>
                    </div>

                    <span
                      style={{
                        height: "fit-content",
                        background: "#eff6ff",
                        color: "#2563eb",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {resource.category}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "14px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      AVAILABLE QUANTITY
                    </div>

                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 800,
                        color:
                          resource.quantity > 0
                            ? "#16a34a"
                            : "#dc2626",
                        marginTop: "3px",
                      }}
                    >
                      {resource.quantity}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "16px",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    📍 {resource.location}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      marginTop: "18px",
                    }}
                  >
                    <button
                      onClick={() => editResource(resource)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "9px",
                        border: "1px solid #bfdbfe",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteResource(
                          resource.id,
                          resource.name
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "9px",
                        border: "1px solid #fecaca",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: string;
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: "25px" }}>{icon}</div>

      <div
        style={{
          marginTop: "12px",
          color: "#64748b",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "3px",
          fontSize: "30px",
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "3px",
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          fontWeight: 700,
          color: "#334155",
          fontSize: "14px",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        min={type === "number" ? "0" : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 13px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          outline: "none",
          fontSize: "14px",
        }}
      />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: string;
  title: string;
  message: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "55px 20px",
        color: "#64748b",
      }}
    >
      <div style={{ fontSize: "45px" }}>{icon}</div>

      <h3
        style={{
          margin: "12px 0 6px",
          color: "#334155",
        }}
      >
        {title}
      </h3>

      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

export default Resources;

