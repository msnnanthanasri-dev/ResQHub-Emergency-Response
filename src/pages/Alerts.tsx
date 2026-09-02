import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string | null;
  created_at: string;
}

function Alerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    severity: "info",
    location: "",
  });

  const loadAlerts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/alerts"
      );

      if (!response.ok) {
        throw new Error("Failed to load alerts");
      }

      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.message) {
      alert("Please enter alert title and message.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/alerts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create alert");
      }

      alert("Alert created successfully!");

      setForm({
        title: "",
        message: "",
        severity: "info",
        location: "",
      });

      setShowForm(false);
      await loadAlerts();
    } catch (error) {
      console.error(error);
      alert("Failed to create alert.");
    } finally {
      setSaving(false);
    }
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
        `http://localhost:5000/api/alerts/${id}`,
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
      console.error(error);
      alert("Failed to delete alert.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Emergency Alerts</h1>
          <p>Create and manage emergency notifications.</p>
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
            {showForm ? "✕ Close Form" : "+ Create Alert"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create Emergency Alert</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Alert Title *</label>
                <input
                  value={form.title}
                  placeholder="Example: Flood Warning"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  value={form.location}
                  placeholder="Example: Chennai"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
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
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={form.message}
                  placeholder="Enter emergency alert message..."
                  rows={4}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
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
                {saving ? "Sending..." : "Publish Alert"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Active Alerts</h2>
            <p>Emergency notifications</p>
          </div>

          <span className="count-badge">
            {alerts.length} Alerts
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="empty-state">
            <h3>No alerts</h3>
            <p>Create an alert to notify users.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Severity</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <strong>{alert.title}</strong>
                    </td>

                    <td>{alert.message}</td>

                    <td>
                      <span
                        className={`status ${alert.severity}`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td>
                      {alert.location || "All areas"}
                    </td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteAlert(
                            alert.id,
                            alert.title
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

export default Alerts;