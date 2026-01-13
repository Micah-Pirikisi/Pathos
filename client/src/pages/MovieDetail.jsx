import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function MovieDetail() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movies/${slug}`)
      .then((r) => r.json())
      .then(setMovie);
  }, [slug]);

  if (!movie) return <main className="shell">Loading…</main>;

  return (
    <main className="shell">
      <article
        className="card"
        style={{
          padding: "1.5rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(260px, 320px) 1fr",
        }}
      >
        <img src={movie.posterUrl} alt={movie.title} className="poster" />
        <div>
          <p className="meta" style={{ marginBottom: "0.3rem" }}>
            {movie.theme || "—"}
          </p>
          <h1
            style={{
              fontFamily: "serif",
              fontSize: "2rem",
              margin: "0 0 0.4rem",
            }}
          >
            {movie.title}
          </h1>
          <p style={{ color: "var(--muted)", margin: "0 0 1rem" }}>
            {movie.tagline}
          </p>
          <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.6 }}>
            {movie.intrigues?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          {movie.stills?.length ? (
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                marginTop: "1rem",
                flexWrap: "wrap",
              }}
            >
              {movie.stills.map((s, i) => (
                <img
                  key={i}
                  src={s}
                  alt={`${movie.title} still ${i + 1}`}
                  style={{
                    width: "140px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>
      <p className="meta" style={{ marginTop: "1rem" }}>
        <Link to="/movies">← Back to films</Link>
      </p>
    </main>
  );
}
