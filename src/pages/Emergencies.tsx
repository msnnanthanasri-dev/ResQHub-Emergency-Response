import type { FormEvent} from "react";
import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Emergency {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  severity: string;
  status: string;
  created_at?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Emergencies() {
  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    severity: "medium",
    status: "pending",
  });

  // ================================
  // LOAD EMERGENCIES
  // ================================
  const loadEmergencies = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/emergency-reports`
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `Server error (${response.status})\n${text}`
        );
      }

      const data = JSON.parse(text);

      setEmergencies(data);
    } catch (error) {
      console.error("Error loading emergencies:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load emergencies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  // ================================
  // RESET FORM
  // ================================
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      location: "",
      latitude: "",
      longitude: "",
      severity: "medium",
      status: "pending",
    });
  };

  // ================================
  // EDIT EMERGENCY
  // ================================
  const editEmergency = (emergency: Emergency) => {
    setEditingId(emergency.id);

    setForm({
      title: emergency.title,
      description: emergency.description || "",
      location: emergency.location,
      latitude:
        emergency.latitude !== null
          ? String(emergency.latitude)
          : "",
      longitude:
        emergency.longitude !== null
          ? String(emergency.longitude)
          : "",
      severity: emergency.severity || "medium",
      status: emergency.status || "pending",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================================
  // ADD / UPDATE EMERGENCY
  // ================================
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim()) {
      alert("Please enter emergency title and location.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/api/emergency-reports/${editingId}`
        : `${API_URL}/api/emergency-reports`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          location: form.location.trim(),
          latitude: form.latitude
            ? Number(form.latitude)
            : null,
          longitude: form.longitude
            ? Number(form.longitude)
            : null,
          severity: form.severity,
          status: form.status,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `Server error (${response.status})\n${text}`
        );
      }

      alert(
        isEditing
          ? "Emergency updated successfully!"
          : "Emergency added successfully!"
      );

      resetForm();

      await loadEmergencies();
    } catch (error) {
      console.error("Error saving emergency:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save emergency."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // DELETE EMERGENCY
  // ================================
  const deleteEmergency = async (
    id: number,
    title: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/emergency-reports/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `Server error (${response.status})\n${text}`
        );
      }

      alert("Emergency deleted successfully!");

      await loadEmergencies();
    } catch (error) {
      console.error("Error deleting emergency:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete emergency."
      );
    }
  };

  // ================================
  // SEVERITY CLASS
  // ================================
  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "critical";

      case "high":
        return "high";

      case "medium":
        return "medium";

      case "low":
        return "low";

      default:
        return "medium";
    }
  };

  // ================================
  // STATUS CLASS
  // ================================
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "resolved";

      case "in_progress":
        return "progress";

      case "pending":
        return "pending";

      default:
        return "pending";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #fff1f2 100%)",
        padding: "30px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 25px",
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
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              🚨
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                  color: "#172033",
                }}
              >
                Emergency Reports
              </h1>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                }}
              >
                Monitor and manage emergency incidents
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              border: "1px solid #cbd5e1",
              background: "white",
              color: "#334155",
              padding: "11px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
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
              border: "none",
              background: "#dc2626",
              color: "white",
              padding: "11px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 700,
              boxShadow: "0 5px 15px rgba(220,38,38,0.25)",
            }}
          >
            {showForm ? "✕ Close Form" : "+ Add Emergency"}
          </button>
        </div>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto 25px",
            background: "white",
            borderRadius: "18px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ marginBottom: "22px" }}>
            <h2
              style={{
                margin: 0,
                color: "#172033",
              }}
            >
              {editingId !== null
                ? "✏️ Edit Emergency"
                : "🚨 Add Emergency"}
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
              }}
            >
              Enter the emergency incident details below.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Emergency Title *
                </label>

                <input
                  value={form.title}
                  placeholder="Example: Flood in Chennai"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Location *
                </label>

                <input
                  value={form.location}
                  placeholder="Example: Velachery"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Severity
                </label>

                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      severity: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">
                    Critical
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  placeholder="10.7905"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      latitude: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  placeholder="78.7047"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      longitude: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <label style={labelStyle}>
                Description
              </label>

              <textarea
                rows={4}
                value={form.description}
                placeholder="Describe the emergency situation..."
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "22px",
              }}
            >
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "11px 20px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "11px 22px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: 700,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Save Changes"
                  : "Save Emergency"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "18px",
          padding: "25px",
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* CARD HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "22px",
            gap: "15px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#172033",
              }}
            >
              Active Emergency Incidents
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
              }}
            >
              Current emergency reports in the system
            </p>
          </div>

          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {emergencies.length} Reports
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: "40px" }}>
              ⏳
            </div>

            <h3>Loading emergencies...</h3>

            <p>Please wait while reports are loaded.</p>
          </div>
        ) : emergencies.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: "45px" }}>
              🚨
            </div>

            <h3>No emergency reports</h3>

            <p>
              Click "Add Emergency" to create the
              first report.
            </p>
          </div>
        ) : (
          /* ================= EMERGENCY CARDS ================= */
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(310px, 1fr))",
              gap: "18px",
            }}
          >
            {emergencies.map((emergency) => (
              <div
                key={emergency.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px",
                  background: "#ffffff",
                  boxShadow:
                    "0 4px 15px rgba(15,23,42,0.05)",
                  transition: "transform 0.2s",
                }}
              >
                {/* CARD TOP */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        fontWeight: 700,
                        marginBottom: "5px",
                      }}
                    >
                      REPORT #{emergency.id}
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        color: "#172033",
                        fontSize: "19px",
                      }}
                    >
                      {emergency.title}
                    </h3>
                  </div>

                  <span
                    style={{
                      padding: "5px 9px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      background:
                        getSeverityClass(
                          emergency.severity
                        ) === "critical"
                          ? "#fee2e2"
                          : getSeverityClass(
                              emergency.severity
                            ) === "high"
                          ? "#ffedd5"
                          : getSeverityClass(
                              emergency.severity
                            ) === "medium"
                          ? "#fef3c7"
                          : "#dcfce7",
                      color:
                        getSeverityClass(
                          emergency.severity
                        ) === "critical"
                          ? "#b91c1c"
                          : getSeverityClass(
                              emergency.severity
                            ) === "high"
                          ? "#c2410c"
                          : getSeverityClass(
                              emergency.severity
                            ) === "medium"
                          ? "#a16207"
                          : "#15803d",
                    }}
                  >
                    {emergency.severity}
                  </span>
                </div>

                {/* LOCATION */}
                <div
                  style={{
                    marginTop: "17px",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  📍 {emergency.location}
                </div>

                {/* DESCRIPTION */}
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    minHeight: "45px",
                  }}
                >
                  {emergency.description ||
                    "No description provided."}
                </p>

                {/* STATUS */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background:
                        getStatusClass(
                          emergency.status
                        ) === "resolved"
                          ? "#16a34a"
                          : getStatusClass(
                              emergency.status
                            ) === "progress"
                          ? "#2563eb"
                          : "#f59e0b",
                    }}
                  />

                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {emergency.status ===
                    "in_progress"
                      ? "In Progress"
                      : emergency.status
                          .charAt(0)
                          .toUpperCase() +
                        emergency.status.slice(1)}
                  </span>
                </div>

                {/* COORDINATES */}
                {(emergency.latitude !== null ||
                  emergency.longitude !== null) && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "15px",
                    }}
                  >
                    📌{" "}
                    {emergency.latitude ?? "N/A"},{" "}
                    {emergency.longitude ?? "N/A"}
                  </div>
                )}

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "9px",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      editEmergency(emergency)
                    }
                    style={{
                      flex: 1,
                      padding: "9px",
                      borderRadius: "9px",
                      border: "1px solid #cbd5e1",
                      background: "white",
                      color: "#334155",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteEmergency(
                        emergency.id,
                        emergency.title
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "9px",
                      borderRadius: "9px",
                      border: "none",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      cursor: "pointer",
                      fontWeight: 700,
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
  );
}

// ================================
// STYLES
// ================================

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: 700,
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "12px 13px",
  borderRadius: "9px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  color: "#334155",
  background: "#ffffff",
};

const emptyStyle = {
  textAlign: "center" as const,
  padding: "60px 20px",
  color: "#64748b",
};

export default Emergencies;
