import { Link } from "react-router-dom";

export function Header() {
  return (
    <header
      className="flex items-baseline justify-between"
      style={{ marginBottom: "2rem" }}
    >
      <Link
        to="/"
        style={{ fontFamily: "serif", fontSize: "2rem", fontWeight: 600 }}
      >
        Pathos
      </Link>
      <nav style={{ display: "flex", gap: "1rem" }} className="meta">
        <Link to="/movies">Films</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
