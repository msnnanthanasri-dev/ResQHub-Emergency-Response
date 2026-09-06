
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // Demo login
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === "admin@resqhub.com" &&
        password === "admin123"
      ) {
        localStorage.setItem("resqhubLoggedIn", "true");

        if (rememberMe) {
          localStorage.setItem("resqhubRemember", "true");
        }

        navigate("/", { replace: true });
      } else {
        setError("Invalid email or password.");
      }

      setLoading(false);
    }, 600);
  };

  return (
    <div style={styles.page}>

      {/* Background decoration */}
      <div style={styles.circleOne}></div>
      <div style={styles.circleTwo}></div>

      <div style={styles.container}>

        {/* LEFT INFORMATION PANEL */}
        <div style={styles.infoPanel}>

          <div style={styles.logoRow}>
            <div style={styles.logo}>
              🛟
            </div>

            <div>
              <div style={styles.brandName}>
                ResQHub
              </div>

              <div style={styles.brandSmall}>
                Emergency Response Platform
              </div>
            </div>
          </div>

          <div style={styles.infoContent}>

            <div style={styles.badge}>
              🟢 SYSTEM READY
            </div>

            <h1 style={styles.infoTitle}>
              Protecting communities.
              <br />
              Coordinating response.
            </h1>

            <p style={styles.infoText}>
              ResQHub brings emergency reports, volunteers,
              relief camps, resources and alerts together in
              one powerful platform.
            </p>

            <div style={styles.featureList}>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>🚨</span>
                <div>
                  <strong>Emergency Monitoring</strong>
                  <p>Track and manage emergency situations.</p>
                </div>
              </div>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>👥</span>
                <div>
                  <strong>Volunteer Coordination</strong>
                  <p>Connect people with response operations.</p>
                </div>
              </div>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>📦</span>
                <div>
                  <strong>Resource Management</strong>
                  <p>Monitor essential emergency resources.</p>
                </div>
              </div>

            </div>
          </div>

          <div style={styles.infoFooter}>
            © 2026 ResQHub • Emergency Response Management
          </div>

        </div>

        {/* LOGIN PANEL */}
        <div style={styles.loginPanel}>

          <div style={styles.mobileLogo}>
            🛟
          </div>

          <h2 style={styles.loginTitle}>
            Welcome back
          </h2>

          <p style={styles.loginSubtitle}>
            Sign in to access your ResQHub dashboard
          </p>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div style={styles.field}>
              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="admin@resqhub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div style={styles.field}>
              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div style={styles.options}>

              <label style={styles.remember}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                style={styles.forgot}
                onClick={() =>
                  alert(
                    "Password recovery will be connected to the backend later."
                  )
                }
              >
                Forgot password?
              </button>

            </div>

            {/* ERROR */}
            {error && (
              <div style={styles.error}>
                ⚠️ {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

          </form>

          {/* DEMO ACCOUNT */}
          <div style={styles.demoBox}>

            <div style={styles.demoTitle}>
              🔑 Demo Administrator Account
            </div>

            <div style={styles.demoRow}>
              <span>Email</span>
              <strong>admin@resqhub.com</strong>
            </div>

            <div style={styles.demoRow}>
              <span>Password</span>
              <strong>admin123</strong>
            </div>

          </div>

          <button
            onClick={() => navigate("/")}
            style={styles.backButton}
          >
            ← Continue without signing in
          </button>

          <p style={styles.securityText}>
            🔐 Secure emergency response environment
          </p>

        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #0f172a 0%, #172554 45%, #1e3a8a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  circleOne: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "rgba(59,130,246,0.12)",
    top: -180,
    right: -150,
  },

  circleTwo: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: "50%",
    background: "rgba(239,68,68,0.10)",
    bottom: -150,
    left: -130,
  },

  container: {
    width: "100%",
    maxWidth: 1050,
    minHeight: 650,
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    background: "#ffffff",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
    position: "relative",
    zIndex: 2,
  },

  infoPanel: {
    background:
      "linear-gradient(145deg, #111827 0%, #1e293b 60%, #334155 100%)",
    color: "#ffffff",
    padding: "42px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 13,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    background:
      "linear-gradient(135deg, #ef4444, #b91c1c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 25,
    boxShadow: "0 10px 25px rgba(239,68,68,0.25)",
  },

  brandName: {
    fontSize: 24,
    fontWeight: 800,
  },

  brandSmall: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },

  infoContent: {
    maxWidth: 500,
    margin: "40px 0",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: 30,
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.25)",
    color: "#86efac",
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 18,
  },

  infoTitle: {
    fontSize: "clamp(30px, 4vw, 44px)",
    lineHeight: 1.1,
    margin: 0,
    letterSpacing: "-1px",
  },

  infoText: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    fontSize: 14,
    marginTop: 20,
    maxWidth: 480,
  },

  featureList: {
    display: "grid",
    gap: 15,
    marginTop: 30,
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: 13,
  },

  featureIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
    borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 19,
  },

  infoFooter: {
    color: "#64748b",
    fontSize: 11,
  },

  loginPanel: {
    padding: "clamp(28px, 5vw, 55px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffff",
  },

  mobileLogo: {
    display: "none",
  },

  loginTitle: {
    fontSize: 32,
    margin: 0,
    color: "#0f172a",
    fontWeight: 800,
  },

  loginSubtitle: {
    color: "#64748b",
    fontSize: 14,
    margin: "8px 0 30px",
  },

  field: {
    marginBottom: 18,
  },

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    marginBottom: 7,
  },

  inputWrapper: {
    height: 50,
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    background: "#f8fafc",
    overflow: "hidden",
  },

  inputIcon: {
    width: 45,
    textAlign: "center",
    fontSize: 16,
  },

  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    color: "#0f172a",
    minWidth: 0,
  },

  eyeButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
    padding: "0 14px",
  },

  options: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#475569",
    fontSize: 12,
    cursor: "pointer",
  },

  forgot: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },

  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 12,
    marginBottom: 15,
  },

  loginButton: {
    width: "100%",
    height: 52,
    border: "none",
    borderRadius: 12,
    background:
      "linear-gradient(135deg, #dc2626, #b91c1c)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(220,38,38,0.20)",
  },

  demoBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 14,
    marginTop: 20,
  },

  demoTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: "#334155",
    marginBottom: 10,
  },

  demoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 11,
    color: "#64748b",
    marginTop: 6,
    flexWrap: "wrap",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    marginTop: 18,
  },

  securityText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 18,
  },
};

export default Login;
