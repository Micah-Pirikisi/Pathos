import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Authentication failed");
      }

      const { token, user } = await res.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage(`✓ ${isLogin ? "Logged in" : "Registered"} successfully!`);
      setTimeout(() => navigate(user.isCurator ? "/admin" : "/"), 2000);
    } catch (error) {
      setMessage(`✗ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shell" style={{ maxWidth: "400px" }}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
            />
          </div>

          {message && (
            <div
              className="emphasis"
              style={{
                borderColor: message.includes("✓")
                  ? "var(--accent-emerald)"
                  : "var(--accent-ruby)",
              }}
            >
              {message}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-primary)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>
      </div>
    </main>
  );
}
