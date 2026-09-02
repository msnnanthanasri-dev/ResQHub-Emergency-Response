import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReliefCamp {
  id: number;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  current_people: number;
  status: string;
}

function ReliefCamps() {
  const navigate = useNavigate();

  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    capacity: "",
    current_people: "",
    status: "active",
  });

  const loadCamps = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/relief-camps"
      );

      if (!response.ok) {
        throw new Error("Failed to load camps");
      }

      const data = await response.json();
      setCamps(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCamps();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.location) {
      alert("Please enter camp name and location.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/relief-camps",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            location: form.location,
            latitude: form.latitude
              ? Number(form.latitude)
              : null,
            longitude: form.longitude
              ? Number(form.longitude)
              : null,
            capacity: form.capacity
              ? Number(form.capacity)
              : 0,
            current_people: form.current_people
              ? Number(form.current_people)
              : 0,
            status: form.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add camp");
      }

      alert("Relief camp added successfully!");

      setForm({
        name: "",
        location: "",
        latitude: "",
        longitude: "",
        capacity: "",
        current_people: "",
        status: "active",
      });

      setShowForm(false);
      await loadCamps();
    } catch (error) {
      console.error(error);
      alert("Failed to add relief camp.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCamp = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/relief-camps/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete camp");
      }

      alert("Relief camp deleted successfully!");
      await loadCamps();
    } catch (error) {
      console.error(error);
      alert("Failed to delete relief camp.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Relief Camp Management</h1>
          <p>Manage emergency relief camps and occupancy.</p>
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
            {showForm ? "✕ Close Form" : "+ Add Relief Camp"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add Relief Camp</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Camp Name *</label>
                <input
                  value={form.name}
                  placeholder="Example: Chennai Relief Camp"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  value={form.location}
                  placeholder="Example: Velachery"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Latitude</label>
                <input
                  value={form.latitude}
                  placeholder="Example: 13.0827"
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
                  value={form.longitude}
                  placeholder="Example: 80.2707"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      longitude: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={form.capacity}
                  placeholder="Example: 500"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      capacity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Current People</label>
                <input
                  type="number"
                  value={form.current_people}
                  placeholder="Example: 100"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      current_people: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="full">Full</option>
                  <option value="closed">Closed</option>
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
                {saving ? "Saving..." : "Save Camp"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Registered Relief Camps</h2>
            <p>Emergency shelter and relief camp database</p>
          </div>

          <span className="count-badge">
            {camps.length} Camps
          </span>
        </div>

        {loading ? (
          <div className="empty-state">Loading camps...</div>
        ) : camps.length === 0 ? (
          <div className="empty-state">
            <h3>No relief camps found</h3>
            <p>Add your first relief camp above.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>People</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {camps.map((camp) => (
                  <tr key={camp.id}>
                    <td>
                      <strong>{camp.name}</strong>
                      <small>
                        CAMP-
                        {String(camp.id).padStart(3, "0")}
                      </small>
                    </td>

                    <td>📍 {camp.location}</td>

                    <td>{camp.capacity}</td>

                    <td>{camp.current_people}</td>

                    <td>
                      <span
                        className={`status ${camp.status.toLowerCase()}`}
                      >
                        {camp.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteCamp(camp.id, camp.name)
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

export default ReliefCamps;