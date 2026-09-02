import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  location: string;
  phone: string | null;
  status: string;
  assignment: string | null;
}

function Volunteers() {
  const navigate = useNavigate();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    skill: "",
    location: "",
    phone: "",
    status: "available",
  });

  const loadVolunteers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/volunteers"
      );

      if (!response.ok) {
        throw new Error("Failed to load volunteers");
      }

      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error("Error loading volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.skill || !form.location) {
      alert("Please enter name, skill and location.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/volunteers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            skill: form.skill,
            location: form.location,
            phone: form.phone || null,
            status: form.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create volunteer");
      }

      alert("Volunteer added successfully!");

      setForm({
        name: "",
        skill: "",
        location: "",
        phone: "",
        status: "available",
      });

      setShowForm(false);

      await loadVolunteers();
    } catch (error) {
      console.error("Error creating volunteer:", error);
      alert(
        "Failed to add volunteer. Make sure the volunteer API is running."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Volunteer Management</h1>
          <p>
            Manage emergency response volunteers and assignments.
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
            {showForm ? "✕ Close Form" : "+ Add Volunteer"}
          </button>
        </div>
      </div>

      {/* ADD VOLUNTEER FORM */}

      {showForm && (
        <div className="form-card">
          <h2>Add Volunteer</h2>

          <p>
            Register a volunteer for emergency response activities.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Volunteer Name *</label>

                <input
                  type="text"
                  placeholder="Example: Arun Kumar"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Skill *</label>

                <input
                  type="text"
                  placeholder="Example: First Aid"
                  value={form.skill}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      skill: e.target.value,
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

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  placeholder="Example: 9876543210"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
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
                  <option value="available">
                    Available
                  </option>

                  <option value="responding">
                    Responding
                  </option>

                  <option value="assigned">
                    Assigned
                  </option>

                  <option value="unavailable">
                    Unavailable
                  </option>
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
                {saving ? "Saving..." : "Save Volunteer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VOLUNTEER LIST */}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Registered Volunteers</h2>

            <p>
              Emergency response volunteer database
            </p>
          </div>

          <span className="count-badge">
            {volunteers.length} Volunteers
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading volunteers...
          </div>
        ) : volunteers.length === 0 ? (
          <div className="empty-state">
            <h3>No volunteers found</h3>

            <p>
              Add your first volunteer using the button above.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Skill</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Assignment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td>
                      <strong>{volunteer.name}</strong>

                      <small>
                        VOL-
                        {String(volunteer.id).padStart(
                          3,
                          "0"
                        )}
                      </small>
                    </td>

                    <td>{volunteer.skill}</td>

                    <td>
                      📍 {volunteer.location}
                    </td>

                    <td>
                      {volunteer.phone || "Not provided"}
                    </td>

                    <td>
                      <span
                        className={`status ${volunteer.status.toLowerCase()}`}
                      >
                        {volunteer.status}
                      </span>
                    </td>

                    <td>
                      {volunteer.assignment || "None"}
                    </td>
                    <td>
  <button
    className="delete-button"
    onClick={async () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${volunteer.name}?`
      );

      if (!confirmed) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/volunteers/${volunteer.id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to delete volunteer"
          );
        }

        alert("Volunteer deleted successfully!");

        await loadVolunteers();
      } catch (error) {
        console.error("Error deleting volunteer:", error);
        alert("Failed to delete volunteer.");
      }
    }}
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

export default Volunteers;