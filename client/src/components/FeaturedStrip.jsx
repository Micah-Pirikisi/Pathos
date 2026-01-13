import { Link } from "react-router-dom";

const themeColors = {
  hope: "#fbbf24",
  release: "#ef4444",
  discomfort: "#ff6b35",
  courage: "#10d981",
  reflection: "#3b82f6",
  existential: "#a855f7",
};

export function FeaturedStrip({ movies }) {
  if (!movies?.length) return null;
  return (
    <section
      className="card"
      style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
    >
      <p className="meta" style={{ marginBottom: "0.5rem" }}>
        Featured
      </p>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
      >
        {movies.map((m) => (
          <article key={m.id} style={{ display: "grid", gap: "0.5rem" }}>
            <img src={m.posterUrl} alt={m.title} className="poster" />
            <div>
              <h2
                style={{ fontFamily: "serif", fontSize: "1.3rem", margin: 0 }}
              >
                {m.title}
              </h2>
              <p style={{ color: "var(--muted)", margin: "0.3rem 0" }}>
                {m.tagline}
              </p>
              {m.theme && (
                <Link
                  to={`/movies?theme=${m.theme}`}
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className="tag"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      opacity: 0.8,
                      color: themeColors[m.theme] || "var(--accent-primary)",
                      borderColor:
                        themeColors[m.theme] || "var(--accent-primary)",
                      backgroundColor: `${
                        themeColors[m.theme] || "var(--accent-primary)"
                      }20`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    {m.theme}
                  </span>
                </Link>
              )}
            </div>
            <Link className="meta" to={`/movies/${m.slug}`}>
              See Details →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
