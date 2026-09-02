import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface EmergencyReport {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  severity: string;
  status: string;
  created_at: string;
}

function Emergencies() {
  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    severity: "medium",
  });

  const loadEmergencies = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/emergency-reports"
      );

      if (!response.ok) {
        throw new Error("Failed to load emergencies");
      }

      const data = await response.json();
      setEmergencies(data);
    } catch (error) {
      console.error("Error loading emergencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.location) {
      alert("Please enter the emergency title and location.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/emergency-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: null,
            title: form.title,
            description: form.description,
            location: form.location,
            latitude: form.latitude || null,
            longitude: form.longitude || null,
            severity: form.severity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create emergency");
      }

      alert("Emergency report added successfully!");

      setForm({
        title: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        severity: "medium",
      });

      setShowForm(false);
      await loadEmergencies();
    } catch (error) {
      console.error("Error creating emergency:", error);
      alert("Failed to add emergency. Please check the backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Emergency Reports</h1>
          <p>Manage and monitor emergency incidents</p>
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
            {showForm ? "✕ Close Form" : "+ Add Emergency"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add Emergency Report</h2>
          <p>Enter the details of the emergency incident.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Emergency Title *</label>
                <input
                  type="text"
                  placeholder="Example: Flood Emergency"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="Example: Chennai"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  placeholder="Describe the emergency..."
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="text"
                  placeholder="Example: 13.0827"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      latitude: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="text"
                  placeholder="Example: 80.2707"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      longitude: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      severity: e.target.value,
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
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
                {saving ? "Saving..." : "Save Emergency"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Emergency Incidents</h2>
            <p>All reported emergencies</p>
          </div>

          <span className="count-badge">
            {emergencies.length} Reports
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading emergency reports...
          </div>
        ) : emergencies.length === 0 ? (
          <div className="empty-state">
            <h3>No emergency reports</h3>
            <p>Add an emergency report using the button above.</p>
          </div>
        ) : (
          <div className="emergency-list">
            {emergencies.map((emergency) => (
              <div className="emergency-card" key={emergency.id}>
                <div className="emergency-card-main">
                  <div>
                    <h3>{emergency.title}</h3>
                    <p>
                      {emergency.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <span
                    className={`severity-badge ${emergency.severity}`}
                  >
                    {emergency.severity}
                  </span>
                </div>

                <div className="emergency-card-footer">
                  <span>📍 {emergency.location || "Unknown"}</span>

                  <span>
                    Status:{" "}
                    <strong>{emergency.status || "Pending"}</strong>
                  </span>

                  <span>
                    ID: EMG-
                    {String(emergency.id).padStart(3, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Emergencies;