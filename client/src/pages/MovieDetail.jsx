import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const themeColors = {
  hope: "#fbbf24",
  release: "#ef4444",
  discomfort: "#ff6b35",
  courage: "#10d981",
  reflection: "#3b82f6",
  existential: "#a855f7",
};

export default function MovieDetail() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    fetch(`/api/movies/${slug}`)
      .then((r) => r.json())
      .then(setMovie);
  }, [slug]);

  if (!movie)
    return (
      <main className="shell">
        <nav className="breadcrumbs">
          <span style={{ color: "var(--muted)" }}>Films</span>
          <span>/</span>
          <span style={{ color: "var(--muted)" }}>Loading...</span>
        </nav>
        <article className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "minmax(260px, 320px) 1fr",
            }}
          >
            <div className="skeleton skeleton-card"></div>
            <div>
              <div
                className="skeleton skeleton-text"
                style={{ width: "30%" }}
              ></div>
              <div
                className="skeleton skeleton-text large"
                style={{ width: "60%", marginTop: "1rem" }}
              ></div>
              <div
                className="skeleton skeleton-text"
                style={{ width: "40%", marginTop: "0.5rem" }}
              ></div>
              <div
                className="skeleton skeleton-text"
                style={{ width: "100%", marginTop: "1.5rem", height: "3rem" }}
              ></div>
            </div>
          </div>
        </article>
      </main>
    );

  return (
    <main className="shell">
      <nav className="breadcrumbs">
        <Link to="/movies">Films</Link>
        <span>/</span>
        <span>{movie.title}</span>
      </nav>
      <article
        className="card movie-detail-card movie-detail-grid"
        data-theme={movie.theme}
        style={{
          padding: "1.5rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(260px, 320px) 1fr",
        }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="poster"
          onClick={() => setExpandedImage(movie.posterUrl)}
          style={{ cursor: "pointer" }}
        />
        <div>
          <p className="meta" style={{ marginBottom: "0.3rem" }}>
            {movie.theme || "—"}
          </p>
          <h1
            style={{
              fontFamily: "serif",
              fontSize: "2rem",
              margin: "0 0 0.4rem",
              background: `linear-gradient(135deg, ${
                themeColors[movie.theme] || "var(--accent-gold)"
              }, var(--ink))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            className="no-underline"
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
                  onClick={() => setExpandedImage(s)}
                  style={{
                    width: "140px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>
      <p className="meta" style={{ marginTop: "1rem" }}>
        <Link to="/movies">← Back to films</Link>
      </p>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#0f1629",
              border: "2px solid var(--accent-primary)",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "90vw",
              maxHeight: "90vh",
              boxShadow: "0 0 40px rgba(255, 107, 53, 0.3)",
            }}
          >
            <button
              onClick={() => setExpandedImage(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                opacity: 0.6,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "1")}
              onMouseLeave={(e) => (e.target.style.opacity = "0.6")}
            >
              ✕
            </button>
            <img
              src={expandedImage}
              alt="Expanded view"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
