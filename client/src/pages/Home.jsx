import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FeaturedStrip } from "../components/FeaturedStrip.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [filmOfWeek, setFilmOfWeek] = useState(null);

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
                gap: "1rem",
                gridTemplateColumns: "minmax(180px, 200px) 1fr",
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
                  height: "280px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
              <div>
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.4rem",
                    margin: "0 0 0.3rem",
                    background: `linear-gradient(135deg, ${
                      {
                        hope: "#fbbf24",
                        release: "#ef4444",
                        discomfort: "#ff6b35",
                        courage: "#10d981",
                        reflection: "#3b82f6",
                        existential: "#a855f7",
                      }[filmOfWeek.theme] || "var(--accent-primary)"
                    }, var(--ink))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
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
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                  }}
                >
                  {filmOfWeek.synopsis.substring(0, 200)}...
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
    </main>
  );
}
