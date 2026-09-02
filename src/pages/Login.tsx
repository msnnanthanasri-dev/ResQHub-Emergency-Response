import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    // Demo login
    if (email === "admin@resqhub.com" && password === "admin123") {
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">R</div>

        <h1>ResQHub</h1>
        <p className="login-subtitle">Emergency Response Platform</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Sign In</button>
        </form>

        <div className="login-demo">
          <strong>Demo Account</strong>
          <p>Email: admin@resqhub.com</p>
          <p>Password: admin123</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Login;