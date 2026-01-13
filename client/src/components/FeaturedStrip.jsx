import { Link } from "react-router-dom";

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
              {m.theme && <span className="tag">{m.theme}</span>}
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
