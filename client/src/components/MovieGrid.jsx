import { Link } from "react-router-dom";

export function MovieGrid({ movies, onFilter, themes, activeTheme }) {
  return (
    <section className="card" style={{ padding: "1.5rem" }}>
      <div
        className="flex"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p className="meta">All Films</p>
        {themes?.length ? (
          <div className="meta" style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => onFilter(null)}
              style={{ opacity: activeTheme ? 0.5 : 1 }}
            >
              All
            </button>
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => onFilter(t)}
                style={{
                  color: activeTheme === t ? "var(--accent)" : "inherit",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="grid">
        {movies.map((m) => (
          <Link
            key={m.id}
            to={`/movies/${m.slug}`}
            className="tooltip"
            data-tip={m.synopsis}
          >
            <article
              className="card"
              style={{ padding: "0.6rem", background: "#0f1420" }}
            >
              <img
                src={m.posterUrl}
                alt={m.title}
                className="poster"
                style={{ height: "320px" }}
              />
              <h3
                style={{
                  fontFamily: "serif",
                  fontSize: "1.1rem",
                  margin: "0.6rem 0 0.2rem",
                }}
              >
                {m.title}
              </h3>
              <p style={{ color: "var(--muted)", margin: 0 }}>{m.tagline}</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
