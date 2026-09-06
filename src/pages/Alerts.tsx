
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AlertItem {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string | null;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Alerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
    severity: "info",
    location: "",
  });

  const loadAlerts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/alerts`
      );

      if (!response.ok) {
        throw new Error("Failed to load alerts");
      }

      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error loading alerts:", error);
      alert("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);

    setForm({
      title: "",
      message: "",
      severity: "info",
      location: "",
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.message) {
      alert("Please enter alert title and message.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/api/alerts/${editingId}`
        : `${API_URL}/api/alerts`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          severity: form.severity,
          location: form.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save alert"
        );
      }

      alert(
        isEditing
          ? "Alert updated successfully!"
          : "Alert added successfully!"
      );

      resetForm();
      await loadAlerts();
    } catch (error) {
      console.error("Error saving alert:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save alert."
      );
    } finally {
      setSaving(false);
    }
  };

  const editAlert = (alertItem: AlertItem) => {
    setEditingId(alertItem.id);

    setForm({
      title: alertItem.title,
      message: alertItem.message,
      severity: alertItem.severity,
      location: alertItem.location || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteAlert = async (
    id: number,
    title: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/alerts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete alert"
        );
      }

      alert("Alert deleted successfully!");

      await loadAlerts();
    } catch (error) {
      console.error("Error deleting alert:", error);
      alert("Failed to delete alert.");
    }
  };

  const criticalCount = alerts.filter(
    (item) => item.severity.toLowerCase() === "critical"
  ).length;

  const warningCount = alerts.filter(
    (item) => item.severity.toLowerCase() === "warning"
  ).length;

  const infoCount = alerts.filter(
    (item) => item.severity.toLowerCase() === "info"
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff7ed 0%, #fffafa 50%, #fef2f2 100%)",
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
              background:
                "linear-gradient(135deg, #dc2626, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              boxShadow: "0 10px 25px rgba(220,38,38,0.22)",
            }}
          >
            🚨
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
              Emergency Alerts
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Monitor and manage emergency notifications
            </p>
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
              border: "1px solid #e2e8f0",
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
                "linear-gradient(135deg, #dc2626, #f97316)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(220,38,38,0.22)",
            }}
          >
            {showForm ? "✕ Close Form" : "+ Add Alert"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* SUMMARY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <AlertSummary
            icon="🚨"
            title="Total Alerts"
            value={alerts.length}
          />

          <AlertSummary
            icon="🔴"
            title="Critical"
            value={criticalCount}
          />

          <AlertSummary
            icon="🟠"
            title="Warning"
            value={warningCount}
          />

          <AlertSummary
            icon="🔵"
            title="Info"
            value={infoCount}
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
                ? "✏️ Edit Alert"
                : "🚨 Create Emergency Alert"}
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
                <AlertInput
                  label="Alert Title *"
                  placeholder="Example: Heavy Rain Warning"
                  value={form.title}
                  onChange={(value) =>
                    setForm({ ...form, title: value })
                  }
                />

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
                    Severity
                  </label>

                  <select
                    value={form.severity}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        severity: event.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      background: "white",
                    }}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <AlertInput
                  label="Location"
                  placeholder="Example: Chennai"
                  value={form.location}
                  onChange={(value) =>
                    setForm({ ...form, location: value })
                  }
                />
              </div>

              <div style={{ marginTop: "18px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: 700,
                    color: "#334155",
                    fontSize: "14px",
                  }}
                >
                  Alert Message *
                </label>

                <textarea
                  value={form.message}
                  placeholder="Enter emergency alert message"
                  rows={5}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      message: event.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    resize: "vertical",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "22px",
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
                    background:
                      "linear-gradient(135deg, #dc2626, #f97316)",
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
                    : "Publish Alert"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ALERT LIST */}
        <div
          style={{
            background: "rgba(255,255,255,0.88)",
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
                Active Alerts
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                }}
              >
                Emergency notifications and warnings
              </p>
            </div>

            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "8px 14px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {alerts.length} Alerts
            </div>
          </div>

          {loading ? (
            <EmptyState
              icon="⏳"
              title="Loading alerts..."
              message="Please wait while alerts are loaded."
            />
          ) : alerts.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="No alerts found"
              message="Add your first emergency alert above."
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(330px, 1fr))",
                gap: "20px",
              }}
            >
              {alerts.map((alertItem) => {
                const severity =
                  alertItem.severity.toLowerCase();

                const isCritical = severity === "critical";
                const isWarning = severity === "warning";

                const accent = isCritical
                  ? "#dc2626"
                  : isWarning
                  ? "#ea580c"
                  : "#2563eb";

                const background = isCritical
                  ? "#fef2f2"
                  : isWarning
                  ? "#fff7ed"
                  : "#eff6ff";

                return (
                  <div
                    key={alertItem.id}
                    style={{
                      background: "white",
                      borderRadius: "18px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 8px 22px rgba(15,23,42,0.07)",
                    }}
                  >
                    {/* SEVERITY STRIP */}
                    <div
                      style={{
                        height: "6px",
                        background: accent,
                      }}
                    />

                    <div style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "11px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "12px",
                              background,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "21px",
                            }}
                          >
                            {isCritical
                              ? "🚨"
                              : isWarning
                              ? "⚠️"
                              : "ℹ️"}
                          </div>

                          <div>
                            <h3
                              style={{
                                margin: 0,
                                color: "#0f172a",
                                fontSize: "18px",
                              }}
                            >
                              {alertItem.title}
                            </h3>
                          </div>
                        </div>

                        <span
                          style={{
                            background,
                            color: accent,
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                          }}
                        >
                          {alertItem.severity}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: "18px",
                          padding: "14px",
                          borderRadius: "12px",
                          background: "#f8fafc",
                          color: "#475569",
                          lineHeight: 1.6,
                          fontSize: "14px",
                        }}
                      >
                        {alertItem.message}
                      </div>

                      <div
                        style={{
                          marginTop: "14px",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        {alertItem.location
                          ? `📍 ${alertItem.location}`
                          : "📍 Location not specified"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "9px",
                          marginTop: "18px",
                        }}
                      >
                        <button
                          onClick={() => editAlert(alertItem)}
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
                            deleteAlert(
                              alertItem.id,
                              alertItem.title
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertSummary({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: number;
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
      <div style={{ fontSize: "24px" }}>{icon}</div>

      <div
        style={{
          marginTop: "10px",
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
    </div>
  );
}

function AlertInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 13px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
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

export default Alerts;

