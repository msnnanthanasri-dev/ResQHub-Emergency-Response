import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string | null;
  created_at: string;
}

interface EmergencyReport {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  severity: string;
  status: string;
  created_at: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);

  // =========================
  // LOAD DASHBOARD DATA
  // =========================
  useEffect(() => {
    // Load emergencies
    fetch("http://localhost:5000/api/emergency-reports")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch emergencies");
        }

        return response.json();
      })
      .then((data) => {
        setEmergencies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading emergencies:", error);
        setLoading(false);
      });

    // Load alerts
    fetch("http://localhost:5000/api/alerts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        return response.json();
      })
      .then((data) => {
        // Show only the latest 3 alerts on dashboard
        setAlerts(data.slice(0, 3));
        setAlertsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading alerts:", error);
        setAlertsLoading(false);
      });
  }, []);

  // =========================
  // EMERGENCY CALCULATIONS
  // =========================
  const activeEmergencies = emergencies.filter(
    (emergency) =>
      emergency.status?.toLowerCase() === "active" ||
      emergency.status?.toLowerCase() === "pending"
  );

  const criticalEmergencies = emergencies.filter(
    (emergency) =>
      emergency.severity?.toLowerCase() === "critical"
  );

  // =========================
  // SEVERITY HELPERS
  // =========================
  const getSeverityClass = (severity: string) => {
    const value = severity?.toLowerCase();

    if (value === "critical") return "critical";
    if (value === "high") return "high";
    if (value === "medium") return "medium";
    if (value === "low") return "low";

    return "medium";
  };

  const getSeverityLabel = (severity: string) => {
    if (!severity) return "Medium";

    return (
      severity.charAt(0).toUpperCase() +
      severity.slice(1)
    );
  };

  // =========================
  // STATUS HELPERS
  // =========================
  const getStatusClass = (status: string) => {
    const value = status?.toLowerCase();

    if (value === "active") return "active-status";
    if (value === "responding") return "responding";
    if (value === "resolved") return "resolved";
    if (value === "pending") return "pending";

    return "active-status";
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "Pending";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // =========================
  // ALERT HELPERS
  // =========================
  const getAlertClass = (severity: string) => {
    const value = severity?.toLowerCase();

    if (value === "critical") return "critical";
    if (value === "warning") return "warning";
    if (value === "high") return "high";

    return "info";
  };

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">R</div>

          <div>
            <h2>ResQHub</h2>
            <span>Emergency Response</span>
          </div>
        </div>

        <nav>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/emergencies"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Emergency Reports
          </NavLink>

          <NavLink
            to="/volunteers"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Volunteers
          </NavLink>

          <NavLink
            to="/camps"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Relief Camps
          </NavLink>

          <NavLink
            to="/resources"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Resources
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            GIS Map
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Alerts
          </NavLink>

        </nav>

        <div className="sidebar-bottom">

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Settings
          </NavLink>

          <NavLink to="/login">
            Logout
          </NavLink>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          <div>
            <h1>Dashboard</h1>
            <p>Emergency response overview</p>
          </div>

          <div className="admin">

            <NavLink
              to="/alerts"
              className="notification"
            >
              🔔
              {alerts.length > 0 && (
                <span className="notification-badge">
                  {alerts.length}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/login"
              className="admin-profile"
            >

              <div className="avatar">
                A
              </div>

              <div>
                <strong>Administrator</strong>
                <small>Emergency Authority</small>
              </div>

            </NavLink>

          </div>

        </header>


        {/* =========================
            STATISTICS
        ========================== */}

        <section className="stats">

          {/* Emergency */}

          <div className="stat-card">

            <div>

              <span>Active Emergencies</span>

              <h2>
                {loading
                  ? "..."
                  : activeEmergencies.length}
              </h2>

              <small>
                {criticalEmergencies.length} critical incidents
              </small>

            </div>

            <div className="stat-icon emergency">
              🚨
            </div>

          </div>


          {/* Volunteers */}

          <div className="stat-card">

            <div>

              <span>Available Volunteers</span>

              <h2>48</h2>

              <small>
                8 currently responding
              </small>

            </div>

            <div className="stat-icon volunteer">
              👥
            </div>

          </div>


          {/* Camps */}

          <div className="stat-card">

            <div>

              <span>Relief Camps</span>

              <h2>8</h2>

              <small>
                2 nearly full
              </small>

            </div>

            <div className="stat-icon camp">
              🏕️
            </div>

          </div>


          {/* Resources */}

          <div className="stat-card">

            <div>

              <span>Resources</span>

              <h2>1,250</h2>

              <small>
                15 items low in stock
              </small>

            </div>

            <div className="stat-icon resource">
              📦
            </div>

          </div>

        </section>


        {/* =========================
            🚨 ALERTS
        ========================== */}

        <section className="panel alerts-panel">

          <div className="panel-header">

            <div>

              <h2>🚨 Emergency Alerts</h2>

              <p>
                Latest emergency notifications
              </p>

            </div>

            <button
              onClick={() => navigate("/alerts")}
            >
              View All
            </button>

          </div>


          {alertsLoading ? (

            <div className="empty-state">
              Loading alerts...
            </div>

          ) : alerts.length === 0 ? (

            <div className="empty-state">

              <h3>No active alerts</h3>

              <p>
                There are currently no emergency alerts.
              </p>

            </div>

          ) : (

            <div className="dashboard-alerts">

              {alerts.map((alert) => (

                <div
                  className={`dashboard-alert ${getAlertClass(
                    alert.severity
                  )}`}
                  key={alert.id}
                >

                  <div className="alert-content">

                    <div className="alert-title-row">

                      <strong>
                        {alert.title}
                      </strong>

                      <span
                        className={`badge ${getAlertClass(
                          alert.severity
                        )}`}
                      >
                        {getSeverityLabel(
                          alert.severity
                        )}
                      </span>

                    </div>

                    <p>
                      {alert.message}
                    </p>

                    {alert.location && (
                      <small>
                        📍 {alert.location}
                      </small>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =========================
            DASHBOARD GRID
        ========================== */}

        <section className="dashboard-grid">

          {/* =========================
              RECENT EMERGENCIES
          ========================== */}

          <div className="panel emergency-panel">

            <div className="panel-header">

              <div>

                <h2>Recent Emergencies</h2>

                <p>
                  Latest reported incidents
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/emergencies")
                }
              >
                View All
              </button>

            </div>


            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Emergency</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>

                </thead>


                <tbody>

                  {loading ? (

                    <tr>

                      <td colSpan={4}>
                        Loading emergencies...
                      </td>

                    </tr>

                  ) : emergencies.length === 0 ? (

                    <tr>

                      <td colSpan={4}>
                        No emergency reports found.
                      </td>

                    </tr>

                  ) : (

                    emergencies
                      .slice(0, 5)
                      .map((emergency) => (

                        <tr key={emergency.id}>

                          <td>

                            <strong>
                              {emergency.title}
                            </strong>

                            <small>
                              EMG-
                              {String(
                                emergency.id
                              ).padStart(3, "0")}
                            </small>

                          </td>

                          <td>
                            {emergency.location ||
                              "Unknown"}
                          </td>

                          <td>

                            <span
                              className={`badge ${getSeverityClass(
                                emergency.severity
                              )}`}
                            >
                              {getSeverityLabel(
                                emergency.severity
                              )}
                            </span>

                          </td>

                          <td>

                            <span
                              className={`status ${getStatusClass(
                                emergency.status
                              )}`}
                            >
                              {getStatusLabel(
                                emergency.status
                              )}
                            </span>

                          </td>

                        </tr>

                      ))

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =========================
              VOLUNTEER STATUS
          ========================== */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>Volunteer Status</h2>

                <p>
                  Current availability
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/volunteers")
                }
              >
                Manage
              </button>

            </div>


            <div className="progress-item">

              <div>
                <span>Available</span>
                <strong>48</strong>
              </div>

              <div className="progress">

                <div
                  className="progress-bar available"
                  style={{ width: "62%" }}
                />

              </div>

            </div>


            <div className="progress-item">

              <div>
                <span>Responding</span>
                <strong>18</strong>
              </div>

              <div className="progress">

                <div
                  className="progress-bar responding-bar"
                  style={{ width: "35%" }}
                />

              </div>

            </div>


            <div className="progress-item">

              <div>
                <span>Unavailable</span>
                <strong>12</strong>
              </div>

              <div className="progress">

                <div
                  className="progress-bar unavailable"
                  style={{ width: "20%" }}
                />

              </div>

            </div>

          </div>


          {/* =========================
              RELIEF CAMPS
          ========================== */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>Relief Camps</h2>

                <p>
                  Camp occupancy
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/camps")
                }
              >
                View All
              </button>

            </div>


            <div className="camp-item">

              <div>

                <strong>
                  Camp Alpha
                </strong>

                <span>
                  320 / 500 people
                </span>

              </div>

              <span className="camp-open">
                Open
              </span>

            </div>


            <div className="camp-item">

              <div>

                <strong>
                  Camp Beta
                </strong>

                <span>
                  460 / 500 people
                </span>

              </div>

              <span className="camp-warning">
                Almost Full
              </span>

            </div>


            <div className="camp-item">

              <div>

                <strong>
                  Camp Gamma
                </strong>

                <span>
                  180 / 400 people
                </span>

              </div>

              <span className="camp-open">
                Open
              </span>

            </div>

          </div>


          {/* =========================
              RESOURCES
          ========================== */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>Resource Inventory</h2>

                <p>
                  Current stock levels
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/resources")
                }
              >
                Manage
              </button>

            </div>


            <div className="resource-item">
              <span>🍚 Food</span>
              <strong>620 units</strong>
            </div>

            <div className="resource-item">
              <span>💧 Drinking Water</span>
              <strong>380 units</strong>
            </div>

            <div className="resource-item">
              <span>💊 Medicines</span>
              <strong>150 units</strong>
            </div>

            <div className="resource-item">
              <span>🛏️ Blankets</span>
              <strong>100 units</strong>
            </div>

          </div>


          {/* =========================
              QUICK ACTIONS
          ========================== */}

          <div className="panel quick-actions-panel">

            <div className="panel-header">

              <div>

                <h2>Quick Actions</h2>

                <p>
                  Emergency response management
                </p>

              </div>

            </div>


            <div className="quick-actions">

              <button
                onClick={() =>
                  navigate("/emergencies")
                }
              >
                🚨
                <span>
                  Add Emergency
                </span>
              </button>


              <button
                onClick={() =>
                  navigate("/volunteers")
                }
              >
                👥
                <span>
                  Add Volunteer
                </span>
              </button>


              <button
                onClick={() =>
                  navigate("/camps")
                }
              >
                🏕️
                <span>
                  Add Relief Camp
                </span>
              </button>


              <button
                onClick={() =>
                  navigate("/resources")
                }
              >
                📦
                <span>
                  Add Resource
                </span>
              </button>


              <button
                onClick={() =>
                  navigate("/alerts")
                }
              >
                🔔
                <span>
                  Add Alert
                </span>
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;