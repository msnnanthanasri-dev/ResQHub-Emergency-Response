
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

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

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function ReliefCamps() {
  const [camps, setCamps] = useState<ReliefCamp[]>([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [currentPeople, setCurrentPeople] = useState("");
  const [status, setStatus] = useState("active");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCamps = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/relief-camps`
      );

      if (!response.ok) {
        throw new Error("Failed to load relief camps");
      }

      const data = await response.json();
      setCamps(data);
    } catch (error) {
      console.error("Error loading relief camps:", error);
    }
  };

  useEffect(() => {
    loadCamps();
  }, []);

  const resetForm = () => {
    setName("");
    setLocation("");
    setLatitude("");
    setLongitude("");
    setCapacity("");
    setCurrentPeople("");
    setStatus("active");
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location.trim()) {
      alert("Please enter the camp name and location.");
      return;
    }

    const campData = {
      name: name.trim(),
      location: location.trim(),
      latitude: latitude.trim()
        ? Number(latitude)
        : null,
      longitude: longitude.trim()
        ? Number(longitude)
        : null,
      capacity: capacity.trim()
        ? Number(capacity)
        : 0,
      current_people: currentPeople.trim()
        ? Number(currentPeople)
        : 0,
      status,
    };

    const isEditing = editingId !== null;

    const url = isEditing
      ? `${API_URL}/api/relief-camps/${editingId}`
      : `${API_URL}/api/relief-camps`;

    const method = isEditing ? "PUT" : "POST";

    try {
      setLoading(true);

      console.log("Sending request:", {
        url,
        method,
        campData,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campData),
      });

      const responseText = await response.text();

      console.log(
        "Response status:",
        response.status
      );
      console.log(
        "Response:",
        responseText
      );

      if (!response.ok) {
        alert(
          `Server error (${response.status})\n\n${responseText}`
        );
        return;
      }

      alert(
        isEditing
          ? "Relief camp updated successfully!"
          : "Relief camp added successfully!"
      );

      resetForm();

      await loadCamps();
    } catch (error) {
      console.error(
        "Error saving relief camp:",
        error
      );

      alert(
        `Could not connect to the backend.\n\n${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (camp: ReliefCamp) => {
    setEditingId(camp.id);

    setName(camp.name);
    setLocation(camp.location);

    setLatitude(
      camp.latitude !== null
        ? String(camp.latitude)
        : ""
    );

    setLongitude(
      camp.longitude !== null
        ? String(camp.longitude)
        : ""
    );

    setCapacity(String(camp.capacity));

    setCurrentPeople(
      String(camp.current_people)
    );

    setStatus(camp.status);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this relief camp?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/relief-camps/${id}`,
        {
          method: "DELETE",
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        alert(
          `Delete failed (${response.status})\n\n${responseText}`
        );
        return;
      }

      alert(
        "Relief camp deleted successfully!"
      );

      await loadCamps();
    } catch (error) {
      console.error(
        "Error deleting relief camp:",
        error
      );

      alert(
        `Could not connect to backend.\n\n${error}`
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc, #eef2ff)",
        padding: "35px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              color: "#111827",
            }}
          >
            Relief Camps
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Manage emergency shelters,
            capacity and occupancy.
          </p>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "28px",
            marginBottom: "35px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "22px",
                }}
              >
                {editingId !== null
                  ? "Edit Relief Camp"
                  : "Add Relief Camp"}
              </h2>

              <p
                style={{
                  margin:
                    "6px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                {editingId !== null
                  ? "Update the camp information below."
                  : "Enter the details of a new relief camp."}
              </p>
            </div>

            {editingId !== null && (
              <span
                style={{
                  background: "#fff7ed",
                  color: "#c2410c",
                  padding:
                    "7px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Editing
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "18px",
              }}
            >
              {/* CAMP NAME */}
              <div>
                <label
                  style={labelStyle}
                >
                  Camp Name
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  placeholder="e.g. Anna Nagar Relief Camp"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              {/* LOCATION */}
              <div>
                <label
                  style={labelStyle}
                >
                  Location
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  placeholder="e.g. Chennai"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* LATITUDE */}
              <div>
                <label
                  style={labelStyle}
                >
                  Latitude
                </label>

                <input
                  style={inputStyle}
                  type="number"
                  step="any"
                  placeholder="e.g. 13.0827"
                  value={latitude}
                  onChange={(e) =>
                    setLatitude(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* LONGITUDE */}
              <div>
                <label
                  style={labelStyle}
                >
                  Longitude
                </label>

                <input
                  style={inputStyle}
                  type="number"
                  step="any"
                  placeholder="e.g. 80.2707"
                  value={longitude}
                  onChange={(e) =>
                    setLongitude(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* CAPACITY */}
              <div>
                <label
                  style={labelStyle}
                >
                  Total Capacity
                </label>

                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  value={capacity}
                  onChange={(e) =>
                    setCapacity(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* CURRENT PEOPLE */}
              <div>
                <label
                  style={labelStyle}
                >
                  Current People
                </label>

                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  placeholder="e.g. 250"
                  value={currentPeople}
                  onChange={(e) =>
                    setCurrentPeople(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* STATUS */}
              <div>
                <label
                  style={labelStyle}
                >
                  Camp Status
                </label>

                <select
                  style={inputStyle}
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="full">
                    Full
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "25px",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  background:
                    loading
                      ? "#9ca3af"
                      : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding:
                    "12px 24px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  boxShadow:
                    "0 4px 12px rgba(37,99,235,0.25)",
                }}
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "✓ Save Changes"
                  : "+ Add Relief Camp"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "10px",
                    padding:
                      "12px 22px",
                    fontSize: "15px",
                    fontWeight: "bold",
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
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              Registered Relief Camps
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0 0",
                color: "#6b7280",
              }}
            >
              {camps.length} camp
              {camps.length !== 1
                ? "s"
                : ""} registered
            </p>
          </div>
        </div>

        {/* CAMPS */}
        {camps.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "45px",
              textAlign: "center",
              border:
                "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              🏕️
            </div>

            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#374151",
              }}
            >
              No Relief Camps
            </h3>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              Add your first relief camp
              using the form above.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {camps.map((camp) => {
              const occupancy =
                camp.capacity > 0
                  ? Math.round(
                      (camp.current_people /
                        camp.capacity) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={camp.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "23px",
                    border:
                      "1px solid #e5e7eb",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* CARD TOP */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin:
                            "0 0 7px 0",
                          fontSize: "20px",
                          color: "#111827",
                        }}
                      >
                        {camp.name}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color: "#6b7280",
                          fontSize: "14px",
                        }}
                      >
                        📍 {camp.location}
                      </p>
                    </div>

                    <span
                      style={{
                        padding:
                          "6px 10px",
                        borderRadius:
                          "20px",
                        fontSize: "12px",
                        fontWeight:
                          "bold",
                        background:
                          camp.status ===
                          "active"
                            ? "#dcfce7"
                            : camp.status ===
                              "full"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          camp.status ===
                          "active"
                            ? "#166534"
                            : camp.status ===
                              "full"
                            ? "#92400e"
                            : "#991b1b",
                      }}
                    >
                      {camp.status
                        .charAt(0)
                        .toUpperCase() +
                        camp.status.slice(1)}
                    </span>
                  </div>

                  {/* CAPACITY */}
                  <div
                    style={{
                      marginTop: "20px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginBottom:
                          "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        Occupancy
                      </span>

                      <strong
                        style={{
                          color: "#111827",
                        }}
                      >
                        {
                          camp.current_people
                        }{" "}
                        / {camp.capacity}
                      </strong>
                    </div>

                    <div
                      style={{
                        height: "8px",
                        background:
                          "#e5e7eb",
                        borderRadius:
                          "10px",
                        overflow:
                          "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(
                            occupancy,
                            100
                          )}%`,
                          height: "100%",
                          background:
                            occupancy >= 90
                              ? "#dc2626"
                              : occupancy >=
                                70
                              ? "#f59e0b"
                              : "#22c55e",
                          borderRadius:
                            "10px",
                        }}
                      />
                    </div>

                    <p
                      style={{
                        margin:
                          "7px 0 0 0",
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {occupancy}% occupied
                    </p>
                  </div>

                  {/* LOCATION DETAILS */}
                  <div
                    style={{
                      marginTop: "17px",
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "10px",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "#9ca3af",
                        }}
                      >
                        Latitude
                      </span>

                      <div
                        style={{
                          color: "#374151",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {camp.latitude ??
                          "N/A"}
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          color: "#9ca3af",
                        }}
                      >
                        Longitude
                      </span>

                      <div
                        style={{
                          color: "#374151",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {camp.longitude ??
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleEdit(camp)
                      }
                      style={{
                        flex: 1,
                        background:
                          "#eff6ff",
                        color: "#1d4ed8",
                        border:
                          "1px solid #bfdbfe",
                        borderRadius: "9px",
                        padding:
                          "10px 15px",
                        fontWeight:
                          "bold",
                        cursor:
                          "pointer",
                        fontSize: "14px",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          camp.id
                        )
                      }
                      style={{
                        flex: 1,
                        background:
                          "#fef2f2",
                        color: "#dc2626",
                        border:
                          "1px solid #fecaca",
                        borderRadius: "9px",
                        padding:
                          "10px 15px",
                        fontWeight:
                          "bold",
                        cursor:
                          "pointer",
                        fontSize: "14px",
                      }}
                    >
                      🗑️ Delete
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
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  fontSize: "14px",
  outline: "none",
  background: "#ffffff",
};

export default ReliefCamps;

