import { Link } from "react-router-dom";

export function Header({ user, onLogout }) {
  return (
    <header
      className="flex items-baseline justify-between"
      style={{ marginBottom: "0" }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "serif",
          fontSize: "clamp(1.5rem, 5vw, 2rem)",
          fontWeight: 600,
          background:
            "linear-gradient(135deg, var(--accent-primary), var(--accent-gold))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textDecoration: "none",
        }}
      >
        Pathos
      </Link>
      <nav
        style={{
          display: "flex",
          gap: "clamp(0.5rem, 2vw, 1rem)",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
        className="meta"
      >
        <Link to="/movies">Films</Link>
        <Link to="/about">About</Link>
        {user?.isCurator && (
          <Link to="/admin" style={{ color: "var(--accent-gold)" }}>
            + Add Film
          </Link>
        )}
        {user && (
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-primary)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
