import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FeaturedStrip } from "../components/FeaturedStrip.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [filmOfWeek, setFilmOfWeek] = useState(null);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => {
        setFeatured(data.filter((m) => m.featured));
        // Randomly select a film of the week
        if (data.length > 0) {
          const randomFilm = data[Math.floor(Math.random() * data.length)];
          setFilmOfWeek(randomFilm);
        }
        // Get recently added films (last 6)
        setRecentlyAdded(data.slice(-6).reverse());
      });
  }, []);

  return (
    <main className="shell">
      <FeaturedStrip movies={featured} />
      <section className="card" style={{ padding: "1.5rem" }}>
        <h2
          style={{
            fontFamily: "serif",
            fontSize: "1.6rem",
            margin: "0 0 0.6rem",
          }}
        >
          Pathos
        </h2>
        <p style={{ color: "var(--muted)" }}>
          Curated cinema as quiet editorial. Less scroll, more linger. Featured
          picks float above; dive deeper in the Films index.
        </p>
      </section>
      {filmOfWeek && (
        <section
          className="card"
          style={{ padding: "1.5rem", marginTop: "1.5rem" }}
        >
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}
          >
            Film of the Week
          </p>
          <Link
            to={`/movies/${filmOfWeek.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "minmax(160px, 180px) 1fr",
                alignItems: "start",
              }}
            >
              <img
                src={filmOfWeek.posterUrl}
                alt={filmOfWeek.title}
                style={{
                  borderRadius: "8px",
                  border: `2px solid ${
                    {
                      hope: "#fbbf24",
                      release: "#ef4444",
                      discomfort: "#ff6b35",
                      courage: "#10d981",
                      reflection: "#3b82f6",
                      existential: "#a855f7",
                    }[filmOfWeek.theme] || "#c0c9e0"
                  }`,
                  height: "240px",
                  width: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
              <div>
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.3rem",
                    margin: "0 0 0.5rem",
                    color: "var(--ink)",
                    lineHeight: 1.3,
                  }}
                >
                  {filmOfWeek.title}
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    margin: "0 0 1rem",
                    fontStyle: "italic",
                  }}
                >
                  {filmOfWeek.tagline}
                </p>
                <p
                  style={{
                    color: "var(--ink)",
                    lineHeight: 1.5,
                    marginBottom: "0.8rem",
                    fontSize: "0.95rem",
                  }}
                >
                  {filmOfWeek.synopsis.substring(0, 180)}...
                </p>
                <p
                  style={{
                    textTransform: "capitalize",
                    color: "var(--muted)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {filmOfWeek.theme}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {recentlyAdded.length > 0 && (
        <section
          className="card"
          style={{ padding: "1.5rem", marginTop: "1.5rem" }}
        >
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginBottom: "1rem",
            }}
          >
            Recently Added
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {recentlyAdded.map((film) => (
              <Link
                key={film.id}
                to={`/movies/${film.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="card"
                  data-theme={film.theme}
                  style={{
                    padding: "0.6rem",
                    background: "#0f1420",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "0.6rem",
                      cursor: "pointer",
                    }}
                  />
                  <h4
                    style={{
                      fontFamily: "serif",
                      fontSize: "0.95rem",
                      margin: "0 0 0.2rem",
                      background: `linear-gradient(135deg, ${
                        {
                          hope: "#fbbf24",
                          release: "#ef4444",
                          discomfort: "#ff6b35",
                          courage: "#10d981",
                          reflection: "#3b82f6",
                          existential: "#a855f7",
                        }[film.theme] || "var(--accent-primary)"
                      }, var(--ink))`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {film.title}
                  </h4>
                  <p
                    style={{
                      color: "var(--muted)",
                      margin: 0,
                      fontSize: "0.8rem",
                      flex: 1,
                    }}
                  >
                    {film.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
