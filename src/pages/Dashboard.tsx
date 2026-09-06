
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Emergency {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  status: string;
}

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  location: string;
  phone: string | null;
  status: string;
  assignment: string | null;
}

interface ReliefCamp {
  id: number;
  name: string;
  location: string;
  capacity: number;
  current_people: number;
  status: string;
}

interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        emergenciesResponse,
        volunteersResponse,
        campsResponse,
        resourcesResponse,
        alertsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/emergency-reports`),
        fetch(`${API_URL}/api/volunteers`),
        fetch(`${API_URL}/api/relief-camps`),
        fetch(`${API_URL}/api/resources`),
        fetch(`${API_URL}/api/alerts`),
      ]);

      if (emergenciesResponse.ok) {
        setEmergencies(await emergenciesResponse.json());
      }

      if (volunteersResponse.ok) {
        setVolunteers(await volunteersResponse.json());
      }

      if (campsResponse.ok) {
        setCamps(await campsResponse.json());
      }

      if (resourcesResponse.ok) {
        setResources(await resourcesResponse.json());
      }

      if (alertsResponse.ok) {
        setAlerts(await alertsResponse.json());
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  /*
   * Find the highest alert severity.
   *
   * Critical > High > Medium > Low > Info
   */
  const getHighestAlertSeverity = () => {
    if (alerts.length === 0) {
      return "";
    }

    const severityRank: Record<string, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    let highestSeverity = "info";
    let highestRank = 0;

    alerts.forEach((alert) => {
      const severity = String(alert.severity || "info").toLowerCase();
      const rank = severityRank[severity] || 1;

      if (rank > highestRank) {
        highestRank = rank;
        highestSeverity = severity;
      }
    });

    return highestSeverity;
  };

  const highestSeverity = getHighestAlertSeverity();

  const getAlertButtonClass = () => {
    if (highestSeverity === "critical") {
      return "alert-button alert-critical";
    }

    if (highestSeverity === "high") {
      return "alert-button alert-high";
    }

    if (highestSeverity === "medium") {
      return "alert-button alert-medium";
    }

    if (highestSeverity === "low") {
      return "alert-button alert-low";
    }

    if (highestSeverity === "info") {
      return "alert-button alert-info";
    }

    return "alert-button";
  };

  const totalResourceQuantity = resources.reduce(
    (total, resource) => total + Number(resource.quantity || 0),
    0
  );

 const totalVolunteers = volunteers.length;

  const availableVolunteers = volunteers.filter(
    (volunteer) => String(volunteer.status || " ").toLowerCase() === "available"
  ).length;

  const activeCamps = camps.filter(
    (camp) => String(camp.status).toLowerCase() === "active"
  ).length;

  return (
    <>
      <style>
        {`
          *{
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f8fafc;
          }

          .dashboard-page {
            min-height: 100vh;
            background:
              linear-gradient(
                135deg,
                #f8fafc 0%,
                #eef6ff 50%,
                #f8fafc 100%
              );
            color: #0f172a;
            overflow-x: hidden;
          }

          .dashboard-header {
            background: rgba(255,255,255,0.96);
            border-bottom: 1px solid #e2e8f0;
            padding: 12px clamp(14px, 4vw, 40px);
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(12px);
          }

          .header-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }

          .brand-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #2563eb, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            flex-shrink: 0;
          }

          .brand-title {
            font-size: clamp(18px, 3vw, 23px);
            font-weight: 800;
            color: #0f172a;
          }

          .brand-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          /*
           * NORMAL ALERT BUTTON
           */
          .alert-button {
            border: 1px solid #cbd5e1;
            background: white;
            color: #0f172a;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s ease;
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 7px;
          }

          .alert-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(15,23,42,0.12);
          }

          /*
           * ONLY THE ALERTS BUTTON FLASHES.
           */

          .alert-critical {
            background: #fee2e2;
            border-color: #ef4444;
            color: #b91c1c;
            animation: criticalAlert 1s ease-in-out infinite;
          }

          .alert-high {
            background: #ffedd5;
            border-color: #f97316;
            color: #c2410c;
            animation: highAlert 1.4s ease-in-out infinite;
          }

          .alert-medium {
            background: #fef9c3;
            border-color: #eab308;
            color: #a16207;
            animation: mediumAlert 1.8s ease-in-out infinite;
          }

          .alert-low {
            background: #dcfce7;
            border-color: #22c55e;
            color: #15803d;
            animation: lowAlert 2.4s ease-in-out infinite;
          }

          .alert-info {
            background: #dbeafe;
            border-color: #3b82f6;
            color: #1d4ed8;
            animation: infoAlert 3s ease-in-out infinite;
          }

          /*
           * The animation changes ONLY this button's
           * shadow/background.
           */

          @keyframes criticalAlert {
            0%, 100% {
              background: #fee2e2;
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15);
            }

            50% {
              background: #fecaca;
              box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.12);
            }
          }

          @keyframes highAlert {
            0%, 100% {
              background: #ffedd5;
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.12);
            }

            50% {
              background: #fed7aa;
              box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.10);
            }
          }

          @keyframes mediumAlert {
            0%, 100% {
              background: #fef9c3;
              box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.10);
            }

            50% {
              background: #fef08a;
              box-shadow: 0 0 0 5px rgba(234, 179, 8, 0.08);
            }
          }

          @keyframes lowAlert {
            0%, 100% {
              background: #dcfce7;
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.08);
            }

            50% {
              background: #bbf7d0;
              box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.07);
            }
          }

          @keyframes infoAlert {
            0%, 100% {
              background: #dbeafe;
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.07);
            }

            50% {
              background: #bfdbfe;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.06);
            }
          }

          /*
           * If the device requests reduced motion,
           * stop the flashing animation.
           */
          @media (prefers-reduced-motion: reduce) {
            .alert-critical,
            .alert-high,
            .alert-medium,
            .alert-low,
            .alert-info {
              animation: none;
            }
          }

          .signin-button {
            border: none;
            background: #0f172a;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
          }

          .main-content {
            width: min(1400px, calc(100% - 32px));
            margin: 0 auto;
            padding: 28px 0 40px;
          }

          .welcome-section {
            margin-bottom: 24px;
          }

          .welcome-title {
            margin: 0;
            font-size: clamp(26px, 5vw, 38px);
            font-weight: 850;
          }

          .welcome-text {
            margin: 8px 0 0;
            color: #64748b;
            font-size: 15px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .stat-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .stat-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 850;
            margin-top: 8px;
          }

          .quick-section {
            margin-bottom: 28px;
          }

          .section-title {
            margin: 0 0 14px;
            font-size: 21px;
            font-weight: 800;
          }

          .quick-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .quick-button {
            border: none;
            border-radius: 16px;
            padding: 18px;
            background: white;
            border: 1px solid #e2e8f0;
            box-shadow: 0 8px 20px rgba(15,23,42,0.05);
            cursor: pointer;
            text-align: left;
            font-weight: 800;
            color: #0f172a;
            transition: 0.2s ease;
          }

          .quick-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(15,23,42,0.1);
          }

          .quick-icon {
            font-size: 26px;
            display: block;
            margin-bottom: 10px;
          }

          .emergency-section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .emergency-list {
            display: grid;
            gap: 12px;
          }

          .emergency-card {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
          }

          .emergency-title {
            font-weight: 800;
            margin-bottom: 5px;
          }

          .emergency-location {
            color: #64748b;
            font-size: 13px;
          }

          .severity-badge {
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .critical {
            background: #fee2e2;
            color: #b91c1c;
          }

          .high {
            background: #ffedd5;
            color: #c2410c;
          }

          .medium {
            background: #fef9c3;
            color: #a16207;
          }

          .low {
            background: #dcfce7;
            color: #15803d;
          }

          .empty-state {
            text-align: center;
            padding: 30px;
            color: #64748b;
          }

          .footer {
            text-align: center;
            padding: 25px 15px;
            color: #64748b;
            font-size: 13px;
          }

          @media (max-width: 1000px) {
            .stats-grid,
            .quick-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 650px) {
            .dashboard-header {
              padding: 10px 12px;
            }

            .header-inner {
              align-items: flex-start;
            }

            .header-actions {
              width: 100%;
            }

            .alert-button,
            .signin-button {
              flex: 1;
              justify-content: center;
            }

            .main-content {
              width: min(100% - 20px, 1400px);
              padding-top: 20px;
            }

            .stats-grid,
            .quick-grid {
              grid-template-columns: 1fr;
            }

            .stat-card {
              padding: 17px;
            }

            .emergency-card {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="dashboard-page">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-icon">🚨</div>

              <div>
                <div className="brand-title">ResQHub</div>
                <div className="brand-subtitle">
                  Emergency Response Management
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className={getAlertButtonClass()}
                onClick={() => navigate("/alerts")}
              >
                🔔 Alerts

                {alerts.length > 0 && (
                  <span
                    style={{
                      background: "currentColor",
                      color: "white",
                      minWidth: "22px",
                      height: "22px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {alerts.length}
                  </span>
                )}
              </button>

              <button
                className="signin-button"
                onClick={() => navigate("/login")}
              >
                🔐 Sign In
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Emergency Dashboard</h1>

            <p className="welcome-text">
              Monitor emergencies, volunteers, relief camps, resources and
              alerts from one place.
            </p>
          </section>

          {/* STATS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">🚨 Emergencies</div>
              <div className="stat-value">{emergencies.length}</div>
            </div>

            <div className="stat-card">
  <div className="stat-label">👥 Total Volunteers</div>

  <div className="stat-value">
    {totalVolunteers}
  </div>

  <div
    style={{
      marginTop: "6px",
      fontSize: "13px",
      color: "#16a34a",
      fontWeight: 700,
    }}
  >
    ✅ {availableVolunteers} Available
  </div>
</div>

            <div className="stat-card">
              <div className="stat-label">🏕️ Active Relief Camps</div>
              <div className="stat-value">{activeCamps}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">📦 Resource Quantity</div>
              <div className="stat-value">{totalResourceQuantity}</div>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="quick-section">
            <h2 className="section-title">Quick Actions</h2>

            <div className="quick-grid">
              <button
                className="quick-button"
                onClick={() => navigate("/emergencies")}
              >
                <span className="quick-icon">🚨</span>
                Manage Emergencies
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/volunteers")}
              >
                <span className="quick-icon">👥</span>
                Manage Volunteers
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/camps")}
              >
                <span className="quick-icon">🏕️</span>
                Relief Camps
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/resources")}
              >
                <span className="quick-icon">📦</span>
                Resources
              </button>
            </div>
          </section>

          {/* RECENT EMERGENCIES */}
          <section className="emergency-section">
            <h2 className="section-title">Recent Emergencies</h2>

            {emergencies.length === 0 ? (
              <div className="empty-state">
                No emergency reports available.
              </div>
            ) : (
              <div className="emergency-list">
                {emergencies.slice(0, 5).map((emergency) => {
                  const severity = String(
                    emergency.severity || "medium"
                  ).toLowerCase();

                  return (
                    <div className="emergency-card" key={emergency.id}>
                      <div>
                        <div className="emergency-title">
                          {emergency.title}
                        </div>

                        <div className="emergency-location">
                          📍 {emergency.location || "Location unavailable"}
                        </div>
                      </div>

                      <span
                        className={`severity-badge ${
                          severity === "critical"
                            ? "critical"
                            : severity === "high"
                            ? "high"
                            : severity === "low"
                            ? "low"
                            : "medium"
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <footer className="footer">
          © 2026 ResQHub — Emergency Response Management Platform
        </footer>
      </div>
    </>
  );
}

export default Dashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Emergency {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  status: string;
}

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  location: string;
  phone: string | null;
  status: string;
  assignment: string | null;
}

interface ReliefCamp {
  id: number;
  name: string;
  location: string;
  capacity: number;
  current_people: number;
  status: string;
}

interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        emergenciesResponse,
        volunteersResponse,
        campsResponse,
        resourcesResponse,
        alertsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/emergency-reports`),
        fetch(`${API_URL}/api/volunteers`),
        fetch(`${API_URL}/api/relief-camps`),
        fetch(`${API_URL}/api/resources`),
        fetch(`${API_URL}/api/alerts`),
      ]);

      if (emergenciesResponse.ok) {
        setEmergencies(await emergenciesResponse.json());
      }

      if (volunteersResponse.ok) {
        setVolunteers(await volunteersResponse.json());
      }

      if (campsResponse.ok) {
        setCamps(await campsResponse.json());
      }

      if (resourcesResponse.ok) {
        setResources(await resourcesResponse.json());
      }

      if (alertsResponse.ok) {
        setAlerts(await alertsResponse.json());
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  /*
   * Find the highest alert severity.
   *
   * Critical > High > Medium > Low > Info
   */
  const getHighestAlertSeverity = () => {
    if (alerts.length === 0) {
      return "";
    }

    const severityRank: Record<string, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    let highestSeverity = "info";
    let highestRank = 0;

    alerts.forEach((alert) => {
      const severity = String(alert.severity || "info").toLowerCase();
      const rank = severityRank[severity] || 1;

      if (rank > highestRank) {
        highestRank = rank;
        highestSeverity = severity;
      }
    });

    return highestSeverity;
  };

  const highestSeverity = getHighestAlertSeverity();

  const getAlertButtonClass = () => {
    if (highestSeverity === "critical") {
      return "alert-button alert-critical";
    }

    if (highestSeverity === "high") {
      return "alert-button alert-high";
    }

    if (highestSeverity === "medium") {
      return "alert-button alert-medium";
    }

    if (highestSeverity === "low") {
      return "alert-button alert-low";
    }

    if (highestSeverity === "info") {
      return "alert-button alert-info";
    }

    return "alert-button";
  };

  const totalResourceQuantity = resources.reduce(
    (total, resource) => total + Number(resource.quantity || 0),
    0
  );

 const totalVolunteers = volunteers.length;

  const availableVolunteers = volunteers.filter(
    (volunteer) => String(volunteer.status || " ").toLowerCase() === "available"
  ).length;

  const activeCamps = camps.filter(
    (camp) => String(camp.status).toLowerCase() === "active"
  ).length;

  return (
    <>
      <style>
        {`
          *{
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f8fafc;
          }

          .dashboard-page {
            min-height: 100vh;
            background:
              linear-gradient(
                135deg,
                #f8fafc 0%,
                #eef6ff 50%,
                #f8fafc 100%
              );
            color: #0f172a;
            overflow-x: hidden;
          }

          .dashboard-header {
            background: rgba(255,255,255,0.96);
            border-bottom: 1px solid #e2e8f0;
            padding: 12px clamp(14px, 4vw, 40px);
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(12px);
          }

          .header-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }

          .brand-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #2563eb, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            flex-shrink: 0;
          }

          .brand-title {
            font-size: clamp(18px, 3vw, 23px);
            font-weight: 800;
            color: #0f172a;
          }

          .brand-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          /*
           * NORMAL ALERT BUTTON
           */
          .alert-button {
            border: 1px solid #cbd5e1;
            background: white;
            color: #0f172a;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s ease;
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 7px;
          }

          .alert-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(15,23,42,0.12);
          }

          /*
           * ONLY THE ALERTS BUTTON FLASHES.
           */

          .alert-critical {
            background: #fee2e2;
            border-color: #ef4444;
            color: #b91c1c;
            animation: criticalAlert 1s ease-in-out infinite;
          }

          .alert-high {
            background: #ffedd5;
            border-color: #f97316;
            color: #c2410c;
            animation: highAlert 1.4s ease-in-out infinite;
          }

          .alert-medium {
            background: #fef9c3;
            border-color: #eab308;
            color: #a16207;
            animation: mediumAlert 1.8s ease-in-out infinite;
          }

          .alert-low {
            background: #dcfce7;
            border-color: #22c55e;
            color: #15803d;
            animation: lowAlert 2.4s ease-in-out infinite;
          }

          .alert-info {
            background: #dbeafe;
            border-color: #3b82f6;
            color: #1d4ed8;
            animation: infoAlert 3s ease-in-out infinite;
          }

          /*
           * The animation changes ONLY this button's
           * shadow/background.
           */

          @keyframes criticalAlert {
            0%, 100% {
              background: #fee2e2;
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15);
            }

            50% {
              background: #fecaca;
              box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.12);
            }
          }

          @keyframes highAlert {
            0%, 100% {
              background: #ffedd5;
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.12);
            }

            50% {
              background: #fed7aa;
              box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.10);
            }
          }

          @keyframes mediumAlert {
            0%, 100% {
              background: #fef9c3;
              box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.10);
            }

            50% {
              background: #fef08a;
              box-shadow: 0 0 0 5px rgba(234, 179, 8, 0.08);
            }
          }

          @keyframes lowAlert {
            0%, 100% {
              background: #dcfce7;
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.08);
            }

            50% {
              background: #bbf7d0;
              box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.07);
            }
          }

          @keyframes infoAlert {
            0%, 100% {
              background: #dbeafe;
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.07);
            }

            50% {
              background: #bfdbfe;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.06);
            }
          }

          /*
           * If the device requests reduced motion,
           * stop the flashing animation.
           */
          @media (prefers-reduced-motion: reduce) {
            .alert-critical,
            .alert-high,
            .alert-medium,
            .alert-low,
            .alert-info {
              animation: none;
            }
          }

          .signin-button {
            border: none;
            background: #0f172a;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
          }

          .main-content {
            width: min(1400px, calc(100% - 32px));
            margin: 0 auto;
            padding: 28px 0 40px;
          }

          .welcome-section {
            margin-bottom: 24px;
          }

          .welcome-title {
            margin: 0;
            font-size: clamp(26px, 5vw, 38px);
            font-weight: 850;
          }

          .welcome-text {
            margin: 8px 0 0;
            color: #64748b;
            font-size: 15px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .stat-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .stat-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 850;
            margin-top: 8px;
          }

          .quick-section {
            margin-bottom: 28px;
          }

          .section-title {
            margin: 0 0 14px;
            font-size: 21px;
            font-weight: 800;
          }

          .quick-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .quick-button {
            border: none;
            border-radius: 16px;
            padding: 18px;
            background: white;
            border: 1px solid #e2e8f0;
            box-shadow: 0 8px 20px rgba(15,23,42,0.05);
            cursor: pointer;
            text-align: left;
            font-weight: 800;
            color: #0f172a;
            transition: 0.2s ease;
          }

          .quick-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(15,23,42,0.1);
          }

          .quick-icon {
            font-size: 26px;
            display: block;
            margin-bottom: 10px;
          }

          .emergency-section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .emergency-list {
            display: grid;
            gap: 12px;
          }

          .emergency-card {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
          }

          .emergency-title {
            font-weight: 800;
            margin-bottom: 5px;
          }

          .emergency-location {
            color: #64748b;
            font-size: 13px;
          }

          .severity-badge {
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .critical {
            background: #fee2e2;
            color: #b91c1c;
          }

          .high {
            background: #ffedd5;
            color: #c2410c;
          }

          .medium {
            background: #fef9c3;
            color: #a16207;
          }

          .low {
            background: #dcfce7;
            color: #15803d;
          }

          .empty-state {
            text-align: center;
            padding: 30px;
            color: #64748b;
          }

          .footer {
            text-align: center;
            padding: 25px 15px;
            color: #64748b;
            font-size: 13px;
          }

          @media (max-width: 1000px) {
            .stats-grid,
            .quick-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 650px) {
            .dashboard-header {
              padding: 10px 12px;
            }

            .header-inner {
              align-items: flex-start;
            }

            .header-actions {
              width: 100%;
            }

            .alert-button,
            .signin-button {
              flex: 1;
              justify-content: center;
            }

            .main-content {
              width: min(100% - 20px, 1400px);
              padding-top: 20px;
            }

            .stats-grid,
            .quick-grid {
              grid-template-columns: 1fr;
            }

            .stat-card {
              padding: 17px;
            }

            .emergency-card {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="dashboard-page">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-icon">🚨</div>

              <div>
                <div className="brand-title">ResQHub</div>
                <div className="brand-subtitle">
                  Emergency Response Management
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className={getAlertButtonClass()}
                onClick={() => navigate("/alerts")}
              >
                🔔 Alerts

                {alerts.length > 0 && (
                  <span
                    style={{
                      background: "currentColor",
                      color: "white",
                      minWidth: "22px",
                      height: "22px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {alerts.length}
                  </span>
                )}
              </button>

              <button
                className="signin-button"
                onClick={() => navigate("/login")}
              >
                🔐 Sign In
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Emergency Dashboard</h1>

            <p className="welcome-text">
              Monitor emergencies, volunteers, relief camps, resources and
              alerts from one place.
            </p>
          </section>

          {/* STATS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">🚨 Emergencies</div>
              <div className="stat-value">{emergencies.length}</div>
            </div>

            <div className="stat-card">
  <div className="stat-label">👥 Total Volunteers</div>

  <div className="stat-value">
    {totalVolunteers}
  </div>

  <div
    style={{
      marginTop: "6px",
      fontSize: "13px",
      color: "#16a34a",
      fontWeight: 700,
    }}
  >
    ✅ {availableVolunteers} Available
  </div>
</div>

            <div className="stat-card">
              <div className="stat-label">🏕️ Active Relief Camps</div>
              <div className="stat-value">{activeCamps}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">📦 Resource Quantity</div>
              <div className="stat-value">{totalResourceQuantity}</div>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="quick-section">
            <h2 className="section-title">Quick Actions</h2>

            <div className="quick-grid">
              <button
                className="quick-button"
                onClick={() => navigate("/emergencies")}
              >
                <span className="quick-icon">🚨</span>
                Manage Emergencies
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/volunteers")}
              >
                <span className="quick-icon">👥</span>
                Manage Volunteers
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/camps")}
              >
                <span className="quick-icon">🏕️</span>
                Relief Camps
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/resources")}
              >
                <span className="quick-icon">📦</span>
                Resources
              </button>
            </div>
          </section>

          {/* RECENT EMERGENCIES */}
          <section className="emergency-section">
            <h2 className="section-title">Recent Emergencies</h2>

            {emergencies.length === 0 ? (
              <div className="empty-state">
                No emergency reports available.
              </div>
            ) : (
              <div className="emergency-list">
                {emergencies.slice(0, 5).map((emergency) => {
                  const severity = String(
                    emergency.severity || "medium"
                  ).toLowerCase();

                  return (
                    <div className="emergency-card" key={emergency.id}>
                      <div>
                        <div className="emergency-title">
                          {emergency.title}
                        </div>

                        <div className="emergency-location">
                          📍 {emergency.location || "Location unavailable"}
                        </div>
                      </div>

                      <span
                        className={`severity-badge ${
                          severity === "critical"
                            ? "critical"
                            : severity === "high"
                            ? "high"
                            : severity === "low"
                            ? "low"
                            : "medium"
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <footer className="footer">
          © 2026 ResQHub — Emergency Response Management Platform
        </footer>
      </div>
    </>
  );
}

export default Dashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Emergency {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  status: string;
}

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  location: string;
  phone: string | null;
  status: string;
  assignment: string | null;
}

interface ReliefCamp {
  id: number;
  name: string;
  location: string;
  capacity: number;
  current_people: number;
  status: string;
}

interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        emergenciesResponse,
        volunteersResponse,
        campsResponse,
        resourcesResponse,
        alertsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/emergency-reports`),
        fetch(`${API_URL}/api/volunteers`),
        fetch(`${API_URL}/api/relief-camps`),
        fetch(`${API_URL}/api/resources`),
        fetch(`${API_URL}/api/alerts`),
      ]);

      if (emergenciesResponse.ok) {
        setEmergencies(await emergenciesResponse.json());
      }

      if (volunteersResponse.ok) {
        setVolunteers(await volunteersResponse.json());
      }

      if (campsResponse.ok) {
        setCamps(await campsResponse.json());
      }

      if (resourcesResponse.ok) {
        setResources(await resourcesResponse.json());
      }

      if (alertsResponse.ok) {
        setAlerts(await alertsResponse.json());
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  /*
   * Find the highest alert severity.
   *
   * Critical > High > Medium > Low > Info
   */
  const getHighestAlertSeverity = () => {
    if (alerts.length === 0) {
      return "";
    }

    const severityRank: Record<string, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    let highestSeverity = "info";
    let highestRank = 0;

    alerts.forEach((alert) => {
      const severity = String(alert.severity || "info").toLowerCase();
      const rank = severityRank[severity] || 1;

      if (rank > highestRank) {
        highestRank = rank;
        highestSeverity = severity;
      }
    });

    return highestSeverity;
  };

  const highestSeverity = getHighestAlertSeverity();

  const getAlertButtonClass = () => {
    if (highestSeverity === "critical") {
      return "alert-button alert-critical";
    }

    if (highestSeverity === "high") {
      return "alert-button alert-high";
    }

    if (highestSeverity === "medium") {
      return "alert-button alert-medium";
    }

    if (highestSeverity === "low") {
      return "alert-button alert-low";
    }

    if (highestSeverity === "info") {
      return "alert-button alert-info";
    }

    return "alert-button";
  };

  const totalResourceQuantity = resources.reduce(
    (total, resource) => total + Number(resource.quantity || 0),
    0
  );

 const totalVolunteers = volunteers.length;

  const availableVolunteers = volunteers.filter(
    (volunteer) => String(volunteer.status || " ").toLowerCase() === "available"
  ).length;

  const activeCamps = camps.filter(
    (camp) => String(camp.status).toLowerCase() === "active"
  ).length;

  return (
    <>
      <style>
        {`
          *{
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f8fafc;
          }

          .dashboard-page {
            min-height: 100vh;
            background:
              linear-gradient(
                135deg,
                #f8fafc 0%,
                #eef6ff 50%,
                #f8fafc 100%
              );
            color: #0f172a;
            overflow-x: hidden;
          }

          .dashboard-header {
            background: rgba(255,255,255,0.96);
            border-bottom: 1px solid #e2e8f0;
            padding: 12px clamp(14px, 4vw, 40px);
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(12px);
          }

          .header-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }

          .brand-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #2563eb, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            flex-shrink: 0;
          }

          .brand-title {
            font-size: clamp(18px, 3vw, 23px);
            font-weight: 800;
            color: #0f172a;
          }

          .brand-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          /*
           * NORMAL ALERT BUTTON
           */
          .alert-button {
            border: 1px solid #cbd5e1;
            background: white;
            color: #0f172a;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s ease;
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 7px;
          }

          .alert-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(15,23,42,0.12);
          }

          /*
           * ONLY THE ALERTS BUTTON FLASHES.
           */

          .alert-critical {
            background: #fee2e2;
            border-color: #ef4444;
            color: #b91c1c;
            animation: criticalAlert 1s ease-in-out infinite;
          }

          .alert-high {
            background: #ffedd5;
            border-color: #f97316;
            color: #c2410c;
            animation: highAlert 1.4s ease-in-out infinite;
          }

          .alert-medium {
            background: #fef9c3;
            border-color: #eab308;
            color: #a16207;
            animation: mediumAlert 1.8s ease-in-out infinite;
          }

          .alert-low {
            background: #dcfce7;
            border-color: #22c55e;
            color: #15803d;
            animation: lowAlert 2.4s ease-in-out infinite;
          }

          .alert-info {
            background: #dbeafe;
            border-color: #3b82f6;
            color: #1d4ed8;
            animation: infoAlert 3s ease-in-out infinite;
          }

          /*
           * The animation changes ONLY this button's
           * shadow/background.
           */

          @keyframes criticalAlert {
            0%, 100% {
              background: #fee2e2;
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15);
            }

            50% {
              background: #fecaca;
              box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.12);
            }
          }

          @keyframes highAlert {
            0%, 100% {
              background: #ffedd5;
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.12);
            }

            50% {
              background: #fed7aa;
              box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.10);
            }
          }

          @keyframes mediumAlert {
            0%, 100% {
              background: #fef9c3;
              box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.10);
            }

            50% {
              background: #fef08a;
              box-shadow: 0 0 0 5px rgba(234, 179, 8, 0.08);
            }
          }

          @keyframes lowAlert {
            0%, 100% {
              background: #dcfce7;
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.08);
            }

            50% {
              background: #bbf7d0;
              box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.07);
            }
          }

          @keyframes infoAlert {
            0%, 100% {
              background: #dbeafe;
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.07);
            }

            50% {
              background: #bfdbfe;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.06);
            }
          }

          /*
           * If the device requests reduced motion,
           * stop the flashing animation.
           */
          @media (prefers-reduced-motion: reduce) {
            .alert-critical,
            .alert-high,
            .alert-medium,
            .alert-low,
            .alert-info {
              animation: none;
            }
          }

          .signin-button {
            border: none;
            background: #0f172a;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
          }

          .main-content {
            width: min(1400px, calc(100% - 32px));
            margin: 0 auto;
            padding: 28px 0 40px;
          }

          .welcome-section {
            margin-bottom: 24px;
          }

          .welcome-title {
            margin: 0;
            font-size: clamp(26px, 5vw, 38px);
            font-weight: 850;
          }

          .welcome-text {
            margin: 8px 0 0;
            color: #64748b;
            font-size: 15px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .stat-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .stat-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 850;
            margin-top: 8px;
          }

          .quick-section {
            margin-bottom: 28px;
          }

          .section-title {
            margin: 0 0 14px;
            font-size: 21px;
            font-weight: 800;
          }

          .quick-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .quick-button {
            border: none;
            border-radius: 16px;
            padding: 18px;
            background: white;
            border: 1px solid #e2e8f0;
            box-shadow: 0 8px 20px rgba(15,23,42,0.05);
            cursor: pointer;
            text-align: left;
            font-weight: 800;
            color: #0f172a;
            transition: 0.2s ease;
          }

          .quick-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(15,23,42,0.1);
          }

          .quick-icon {
            font-size: 26px;
            display: block;
            margin-bottom: 10px;
          }

          .emergency-section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .emergency-list {
            display: grid;
            gap: 12px;
          }

          .emergency-card {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
          }

          .emergency-title {
            font-weight: 800;
            margin-bottom: 5px;
          }

          .emergency-location {
            color: #64748b;
            font-size: 13px;
          }

          .severity-badge {
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .critical {
            background: #fee2e2;
            color: #b91c1c;
          }

          .high {
            background: #ffedd5;
            color: #c2410c;
          }

          .medium {
            background: #fef9c3;
            color: #a16207;
          }

          .low {
            background: #dcfce7;
            color: #15803d;
          }

          .empty-state {
            text-align: center;
            padding: 30px;
            color: #64748b;
          }

          .footer {
            text-align: center;
            padding: 25px 15px;
            color: #64748b;
            font-size: 13px;
          }

          @media (max-width: 1000px) {
            .stats-grid,
            .quick-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 650px) {
            .dashboard-header {
              padding: 10px 12px;
            }

            .header-inner {
              align-items: flex-start;
            }

            .header-actions {
              width: 100%;
            }

            .alert-button,
            .signin-button {
              flex: 1;
              justify-content: center;
            }

            .main-content {
              width: min(100% - 20px, 1400px);
              padding-top: 20px;
            }

            .stats-grid,
            .quick-grid {
              grid-template-columns: 1fr;
            }

            .stat-card {
              padding: 17px;
            }

            .emergency-card {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="dashboard-page">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-icon">🚨</div>

              <div>
                <div className="brand-title">ResQHub</div>
                <div className="brand-subtitle">
                  Emergency Response Management
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className={getAlertButtonClass()}
                onClick={() => navigate("/alerts")}
              >
                🔔 Alerts

                {alerts.length > 0 && (
                  <span
                    style={{
                      background: "currentColor",
                      color: "white",
                      minWidth: "22px",
                      height: "22px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {alerts.length}
                  </span>
                )}
              </button>

              <button
                className="signin-button"
                onClick={() => navigate("/login")}
              >
                🔐 Sign In
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Emergency Dashboard</h1>

            <p className="welcome-text">
              Monitor emergencies, volunteers, relief camps, resources and
              alerts from one place.
            </p>
          </section>

          {/* STATS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">🚨 Emergencies</div>
              <div className="stat-value">{emergencies.length}</div>
            </div>

            <div className="stat-card">
  <div className="stat-label">👥 Total Volunteers</div>

  <div className="stat-value">
    {totalVolunteers}
  </div>

  <div
    style={{
      marginTop: "6px",
      fontSize: "13px",
      color: "#16a34a",
      fontWeight: 700,
    }}
  >
    ✅ {availableVolunteers} Available
  </div>
</div>

            <div className="stat-card">
              <div className="stat-label">🏕️ Active Relief Camps</div>
              <div className="stat-value">{activeCamps}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">📦 Resource Quantity</div>
              <div className="stat-value">{totalResourceQuantity}</div>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="quick-section">
            <h2 className="section-title">Quick Actions</h2>

            <div className="quick-grid">
              <button
                className="quick-button"
                onClick={() => navigate("/emergencies")}
              >
                <span className="quick-icon">🚨</span>
                Manage Emergencies
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/volunteers")}
              >
                <span className="quick-icon">👥</span>
                Manage Volunteers
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/camps")}
              >
                <span className="quick-icon">🏕️</span>
                Relief Camps
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/resources")}
              >
                <span className="quick-icon">📦</span>
                Resources
              </button>
            </div>
          </section>

          {/* RECENT EMERGENCIES */}
          <section className="emergency-section">
            <h2 className="section-title">Recent Emergencies</h2>

            {emergencies.length === 0 ? (
              <div className="empty-state">
                No emergency reports available.
              </div>
            ) : (
              <div className="emergency-list">
                {emergencies.slice(0, 5).map((emergency) => {
                  const severity = String(
                    emergency.severity || "medium"
                  ).toLowerCase();

                  return (
                    <div className="emergency-card" key={emergency.id}>
                      <div>
                        <div className="emergency-title">
                          {emergency.title}
                        </div>

                        <div className="emergency-location">
                          📍 {emergency.location || "Location unavailable"}
                        </div>
                      </div>

                      <span
                        className={`severity-badge ${
                          severity === "critical"
                            ? "critical"
                            : severity === "high"
                            ? "high"
                            : severity === "low"
                            ? "low"
                            : "medium"
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <footer className="footer">
          © 2026 ResQHub — Emergency Response Management Platform
        </footer>
      </div>
    </>
  );
}

export default Dashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Emergency {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  status: string;
}

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  location: string;
  phone: string | null;
  status: string;
  assignment: string | null;
}

interface ReliefCamp {
  id: number;
  name: string;
  location: string;
  capacity: number;
  current_people: number;
  status: string;
}

interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  location: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        emergenciesResponse,
        volunteersResponse,
        campsResponse,
        resourcesResponse,
        alertsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/emergency-reports`),
        fetch(`${API_URL}/api/volunteers`),
        fetch(`${API_URL}/api/relief-camps`),
        fetch(`${API_URL}/api/resources`),
        fetch(`${API_URL}/api/alerts`),
      ]);

      if (emergenciesResponse.ok) {
        setEmergencies(await emergenciesResponse.json());
      }

      if (volunteersResponse.ok) {
        setVolunteers(await volunteersResponse.json());
      }

      if (campsResponse.ok) {
        setCamps(await campsResponse.json());
      }

      if (resourcesResponse.ok) {
        setResources(await resourcesResponse.json());
      }

      if (alertsResponse.ok) {
        setAlerts(await alertsResponse.json());
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  /*
   * Find the highest alert severity.
   *
   * Critical > High > Medium > Low > Info
   */
  const getHighestAlertSeverity = () => {
    if (alerts.length === 0) {
      return "";
    }

    const severityRank: Record<string, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    let highestSeverity = "info";
    let highestRank = 0;

    alerts.forEach((alert) => {
      const severity = String(alert.severity || "info").toLowerCase();
      const rank = severityRank[severity] || 1;

      if (rank > highestRank) {
        highestRank = rank;
        highestSeverity = severity;
      }
    });

    return highestSeverity;
  };

  const highestSeverity = getHighestAlertSeverity();

  const getAlertButtonClass = () => {
    if (highestSeverity === "critical") {
      return "alert-button alert-critical";
    }

    if (highestSeverity === "high") {
      return "alert-button alert-high";
    }

    if (highestSeverity === "medium") {
      return "alert-button alert-medium";
    }

    if (highestSeverity === "low") {
      return "alert-button alert-low";
    }

    if (highestSeverity === "info") {
      return "alert-button alert-info";
    }

    return "alert-button";
  };

  const totalResourceQuantity = resources.reduce(
    (total, resource) => total + Number(resource.quantity || 0),
    0
  );

 const totalVolunteers = volunteers.length;

  const availableVolunteers = volunteers.filter(
    (volunteer) => String(volunteer.status || " ").toLowerCase() === "available"
  ).length;

  const activeCamps = camps.filter(
    (camp) => String(camp.status).toLowerCase() === "active"
  ).length;

  return (
    <>
      <style>
        {`
          *{
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f8fafc;
          }

          .dashboard-page {
            min-height: 100vh;
            background:
              linear-gradient(
                135deg,
                #f8fafc 0%,
                #eef6ff 50%,
                #f8fafc 100%
              );
            color: #0f172a;
            overflow-x: hidden;
          }

          .dashboard-header {
            background: rgba(255,255,255,0.96);
            border-bottom: 1px solid #e2e8f0;
            padding: 12px clamp(14px, 4vw, 40px);
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(12px);
          }

          .header-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }

          .brand-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #2563eb, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            flex-shrink: 0;
          }

          .brand-title {
            font-size: clamp(18px, 3vw, 23px);
            font-weight: 800;
            color: #0f172a;
          }

          .brand-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          /*
           * NORMAL ALERT BUTTON
           */
          .alert-button {
            border: 1px solid #cbd5e1;
            background: white;
            color: #0f172a;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s ease;
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 7px;
          }

          .alert-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(15,23,42,0.12);
          }

          /*
           * ONLY THE ALERTS BUTTON FLASHES.
           */

          .alert-critical {
            background: #fee2e2;
            border-color: #ef4444;
            color: #b91c1c;
            animation: criticalAlert 1s ease-in-out infinite;
          }

          .alert-high {
            background: #ffedd5;
            border-color: #f97316;
            color: #c2410c;
            animation: highAlert 1.4s ease-in-out infinite;
          }

          .alert-medium {
            background: #fef9c3;
            border-color: #eab308;
            color: #a16207;
            animation: mediumAlert 1.8s ease-in-out infinite;
          }

          .alert-low {
            background: #dcfce7;
            border-color: #22c55e;
            color: #15803d;
            animation: lowAlert 2.4s ease-in-out infinite;
          }

          .alert-info {
            background: #dbeafe;
            border-color: #3b82f6;
            color: #1d4ed8;
            animation: infoAlert 3s ease-in-out infinite;
          }

          /*
           * The animation changes ONLY this button's
           * shadow/background.
           */

          @keyframes criticalAlert {
            0%, 100% {
              background: #fee2e2;
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15);
            }

            50% {
              background: #fecaca;
              box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.12);
            }
          }

          @keyframes highAlert {
            0%, 100% {
              background: #ffedd5;
              box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.12);
            }

            50% {
              background: #fed7aa;
              box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.10);
            }
          }

          @keyframes mediumAlert {
            0%, 100% {
              background: #fef9c3;
              box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.10);
            }

            50% {
              background: #fef08a;
              box-shadow: 0 0 0 5px rgba(234, 179, 8, 0.08);
            }
          }

          @keyframes lowAlert {
            0%, 100% {
              background: #dcfce7;
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.08);
            }

            50% {
              background: #bbf7d0;
              box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.07);
            }
          }

          @keyframes infoAlert {
            0%, 100% {
              background: #dbeafe;
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.07);
            }

            50% {
              background: #bfdbfe;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.06);
            }
          }

          /*
           * If the device requests reduced motion,
           * stop the flashing animation.
           */
          @media (prefers-reduced-motion: reduce) {
            .alert-critical,
            .alert-high,
            .alert-medium,
            .alert-low,
            .alert-info {
              animation: none;
            }
          }

          .signin-button {
            border: none;
            background: #0f172a;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
          }

          .main-content {
            width: min(1400px, calc(100% - 32px));
            margin: 0 auto;
            padding: 28px 0 40px;
          }

          .welcome-section {
            margin-bottom: 24px;
          }

          .welcome-title {
            margin: 0;
            font-size: clamp(26px, 5vw, 38px);
            font-weight: 850;
          }

          .welcome-text {
            margin: 8px 0 0;
            color: #64748b;
            font-size: 15px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .stat-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .stat-label {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 850;
            margin-top: 8px;
          }

          .quick-section {
            margin-bottom: 28px;
          }

          .section-title {
            margin: 0 0 14px;
            font-size: 21px;
            font-weight: 800;
          }

          .quick-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .quick-button {
            border: none;
            border-radius: 16px;
            padding: 18px;
            background: white;
            border: 1px solid #e2e8f0;
            box-shadow: 0 8px 20px rgba(15,23,42,0.05);
            cursor: pointer;
            text-align: left;
            font-weight: 800;
            color: #0f172a;
            transition: 0.2s ease;
          }

          .quick-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(15,23,42,0.1);
          }

          .quick-icon {
            font-size: 26px;
            display: block;
            margin-bottom: 10px;
          }

          .emergency-section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15,23,42,0.06);
          }

          .emergency-list {
            display: grid;
            gap: 12px;
          }

          .emergency-card {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
          }

          .emergency-title {
            font-weight: 800;
            margin-bottom: 5px;
          }

          .emergency-location {
            color: #64748b;
            font-size: 13px;
          }

          .severity-badge {
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            white-space: nowrap;
          }

          .critical {
            background: #fee2e2;
            color: #b91c1c;
          }

          .high {
            background: #ffedd5;
            color: #c2410c;
          }

          .medium {
            background: #fef9c3;
            color: #a16207;
          }

          .low {
            background: #dcfce7;
            color: #15803d;
          }

          .empty-state {
            text-align: center;
            padding: 30px;
            color: #64748b;
          }

          .footer {
            text-align: center;
            padding: 25px 15px;
            color: #64748b;
            font-size: 13px;
          }

          @media (max-width: 1000px) {
            .stats-grid,
            .quick-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 650px) {
            .dashboard-header {
              padding: 10px 12px;
            }

            .header-inner {
              align-items: flex-start;
            }

            .header-actions {
              width: 100%;
            }

            .alert-button,
            .signin-button {
              flex: 1;
              justify-content: center;
            }

            .main-content {
              width: min(100% - 20px, 1400px);
              padding-top: 20px;
            }

            .stats-grid,
            .quick-grid {
              grid-template-columns: 1fr;
            }

            .stat-card {
              padding: 17px;
            }

            .emergency-card {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="dashboard-page">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-icon">🚨</div>

              <div>
                <div className="brand-title">ResQHub</div>
                <div className="brand-subtitle">
                  Emergency Response Management
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className={getAlertButtonClass()}
                onClick={() => navigate("/alerts")}
              >
                🔔 Alerts

                {alerts.length > 0 && (
                  <span
                    style={{
                      background: "currentColor",
                      color: "white",
                      minWidth: "22px",
                      height: "22px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {alerts.length}
                  </span>
                )}
              </button>

              <button
                className="signin-button"
                onClick={() => navigate("/login")}
              >
                🔐 Sign In
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Emergency Dashboard</h1>

            <p className="welcome-text">
              Monitor emergencies, volunteers, relief camps, resources and
              alerts from one place.
            </p>
          </section>

          {/* STATS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">🚨 Emergencies</div>
              <div className="stat-value">{emergencies.length}</div>
            </div>

            <div className="stat-card">
  <div className="stat-label">👥 Total Volunteers</div>

  <div className="stat-value">
    {totalVolunteers}
  </div>

  <div
    style={{
      marginTop: "6px",
      fontSize: "13px",
      color: "#16a34a",
      fontWeight: 700,
    }}
  >
    ✅ {availableVolunteers} Available
  </div>
</div>

            <div className="stat-card">
              <div className="stat-label">🏕️ Active Relief Camps</div>
              <div className="stat-value">{activeCamps}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">📦 Resource Quantity</div>
              <div className="stat-value">{totalResourceQuantity}</div>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="quick-section">
            <h2 className="section-title">Quick Actions</h2>

            <div className="quick-grid">
              <button
                className="quick-button"
                onClick={() => navigate("/emergencies")}
              >
                <span className="quick-icon">🚨</span>
                Manage Emergencies
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/volunteers")}
              >
                <span className="quick-icon">👥</span>
                Manage Volunteers
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/camps")}
              >
                <span className="quick-icon">🏕️</span>
                Relief Camps
              </button>

              <button
                className="quick-button"
                onClick={() => navigate("/resources")}
              >
                <span className="quick-icon">📦</span>
                Resources
              </button>
            </div>
          </section>

          {/* RECENT EMERGENCIES */}
          <section className="emergency-section">
            <h2 className="section-title">Recent Emergencies</h2>

            {emergencies.length === 0 ? (
              <div className="empty-state">
                No emergency reports available.
              </div>
            ) : (
              <div className="emergency-list">
                {emergencies.slice(0, 5).map((emergency) => {
                  const severity = String(
                    emergency.severity || "medium"
                  ).toLowerCase();

                  return (
                    <div className="emergency-card" key={emergency.id}>
                      <div>
                        <div className="emergency-title">
                          {emergency.title}
                        </div>

                        <div className="emergency-location">
                          📍 {emergency.location || "Location unavailable"}
                        </div>
                      </div>

                      <span
                        className={`severity-badge ${
                          severity === "critical"
                            ? "critical"
                            : severity === "high"
                            ? "high"
                            : severity === "low"
                            ? "low"
                            : "medium"
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <footer className="footer">
          © 2026 ResQHub — Emergency Response Management Platform
        </footer>
      </div>
    </>
  );
}

export default Dashboard;

