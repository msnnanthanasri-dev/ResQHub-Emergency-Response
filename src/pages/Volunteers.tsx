
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  location: string;
  phone: string | null;
  status: string;
  assignment: string | null;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("available");

  const [loading, setLoading] = useState(false);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);

  // LOAD VOLUNTEERS
  const loadVolunteers = async () => {
    try {
      setLoadingVolunteers(true);

      const response = await fetch(
        `${API_URL}/api/volunteers`
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Server error (${response.status}): ${text}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid volunteer data received.");
      }

      setVolunteers(data);
    } catch (error) {
      console.error("Error loading volunteers:", error);

      alert(
        "Unable to load volunteers.\n\n" +
          "The backend could not return the volunteer list."
      );
    } finally {
      setLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSkill("");
    setLocation("");
    setPhone("");
    setStatus("available");
  };

  // ADD / UPDATE
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !skill.trim() || !location.trim()) {
      alert("Please fill in Name, Skill and Location.");
      return;
    }

    setLoading(true);

    const volunteerData = {
      name: name.trim(),
      skill: skill.trim(),
      location: location.trim(),
      phone: phone.trim() || null,
      status: status.toLowerCase(),
    };

    try {
      const url = editingId
        ? `${API_URL}/api/volunteers/${editingId}`
        : `${API_URL}/api/volunteers`;

      const method = editingId ? "PUT" : "POST";

      console.log("Saving volunteer:", {
        method,
        url,
        volunteerData,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerData),
      });

      const responseText = await response.text();

      console.log("Server response:", {
        status: response.status,
        responseText,
      });

      if (!response.ok) {
        alert(
          `Unable to save volunteer.\n\n` +
            `Server error: ${response.status}\n\n` +
            responseText
        );
        return;
      }

      // Successful save
      alert(
        editingId
          ? "Volunteer updated successfully!"
          : "Volunteer added successfully!"
      );

      resetForm();

      // Reload the list
      await loadVolunteers();
    } catch (error) {
      console.error("Error saving volunteer:", error);

      alert(
        "Could not connect to the backend server.\n\n" +
          "Please make sure the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (volunteer: Volunteer) => {
    setEditingId(volunteer.id);

    setName(volunteer.name);
    setSkill(volunteer.skill);
    setLocation(volunteer.location);
    setPhone(volunteer.phone || "");

    setStatus(
      volunteer.status?.toLowerCase() === "available"
        ? "available"
        : "unavailable"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this volunteer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/volunteers/${id}`,
        {
          method: "DELETE",
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        alert(
          `Unable to delete volunteer.\n\n` +
            `Server error: ${response.status}\n\n` +
            responseText
        );
        return;
      }

      alert("Volunteer deleted successfully!");

      await loadVolunteers();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);

      alert(
        "Could not connect to the backend server."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Volunteer Management
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Manage emergency response volunteers and their
            availability.
          </p>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "35px",
            boxShadow:
              "0 10px 30px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "22px",
              color: "#111827",
            }}
          >
            {editingId
              ? "Edit Volunteer"
              : "Add New Volunteer"}
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
              <div>
                <label style={labelStyle}>
                  Volunteer Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter volunteer name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Skill
                </label>

                <input
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    setSkill(e.target.value)
                  }
                  placeholder="e.g. Medical, Rescue"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Enter location"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Phone
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="unavailable">
                    Unavailable
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 22px",
                  background:
                    "linear-gradient(135deg, #4f46e5, #2563eb)",
                  color: "white",
                  fontWeight: 700,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Add Volunteer"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    padding: "12px 22px",
                    background: "#f9fafb",
                    color: "#374151",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Registered Volunteers
          </h2>

          <div
            style={{
              background: "#eef2ff",
              color: "#4338ca",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: 700,
            }}
          >
            {volunteers.length} Volunteers
          </div>
        </div>

        {loadingVolunteers ? (
          <div style={emptyStyle}>
            Loading volunteers...
          </div>
        ) : volunteers.length === 0 ? (
          <div style={emptyStyle}>
            No volunteers found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {volunteers.map((volunteer) => {
              const available =
                volunteer.status?.toLowerCase() ===
                "available";

              return (
                <div
                  key={volunteer.id}
                  style={{
                    background: "white",
                    borderRadius: "18px",
                    padding: "22px",
                    boxShadow:
                      "0 8px 25px rgba(15, 23, 42, 0.07)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "#111827",
                          fontSize: "20px",
                        }}
                      >
                        {volunteer.name}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0 0",
                          color: "#6b7280",
                        }}
                      >
                        {volunteer.skill}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        background: available
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: available
                          ? "#166534"
                          : "#991b1b",
                      }}
                    >
                      {volunteer.status || "Unknown"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "11px",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <strong>📍 Location:</strong>{" "}
                      {volunteer.location}
                    </div>

                    <div>
                      <strong>📞 Phone:</strong>{" "}
                      {volunteer.phone ||
                        "Not provided"}
                    </div>

                    <div>
                      <strong>
                        🧑‍🚒 Assignment:
                      </strong>{" "}
                      {volunteer.assignment ||
                        "Not assigned"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "22px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(volunteer)
                      }
                      style={{
                        flex: 1,
                        border: "none",
                        borderRadius: "9px",
                        padding: "10px",
                        background: "#e0e7ff",
                        color: "#3730a3",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          volunteer.id
                        )
                      }
                      style={{
                        flex: 1,
                        border: "none",
                        borderRadius: "9px",
                        padding: "10px",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  fontWeight: 600,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  background: "#ffffff",
};

const emptyStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  padding: "40px",
  textAlign: "center",
  color: "#6b7280",
  boxShadow:
    "0 8px 25px rgba(15, 23, 42, 0.06)",
};

export default Volunteers;
