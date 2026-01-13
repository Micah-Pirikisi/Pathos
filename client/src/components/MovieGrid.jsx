import { Link } from "react-router-dom";
import { useState } from "react";

const themeDescriptions = {
  hope: "For when the light feels distant, but not gone.",
  release: "For when holding it in is no longer an option.",
  discomfort: "For when you don't want to feel okay.",
  courage: "For when you need to stand a little taller.",
  reflection: "For when you need to hear your own voice again.",
  existential: "For when the questions grow louder than the answers.",
};

const themeColors = {
  hope: "#fbbf24",
  release: "#ef4444",
  discomfort: "#ff6b35",
  courage: "#10d981",
  reflection: "#3b82f6",
  existential: "#a855f7",
};

export function MovieGrid({ movies, onFilter, themes, activeTheme }) {
  const [expandedImage, setExpandedImage] = useState(null);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  return (
    <>
      <section className="card" style={{ padding: "1.5rem" }}>
        <div
          className="flex"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {themes?.length ? (
            <div
              className="meta"
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <button
                onClick={() => onFilter(null)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0.5rem",
                  color: "inherit",
                  opacity: activeTheme ? 0.5 : 1,
                  borderBottom: !activeTheme
                    ? "2px solid var(--accent-primary)"
                    : "2px solid transparent",
                  fontWeight: !activeTheme ? 600 : 400,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  height: "1.5em",
                  fontSize: "1.05rem",
                }}
              >
                All
              </button>
              {themes.map((t) => (
                <div key={t} style={{ position: "relative" }}>
                  <button
                    onClick={() => onFilter(t)}
                    onMouseEnter={() => setHoveredTheme(t)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0 0.5rem",
                      color: activeTheme === t ? themeColors[t] : "inherit",
                      textTransform: "capitalize",
                      borderBottom:
                        activeTheme === t
                          ? `2px solid ${themeColors[t]}`
                          : "2px solid transparent",
                      fontWeight: activeTheme === t ? 600 : 400,
                      opacity: activeTheme === t ? 1 : 0.7,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      height: "1.5em",
                      fontSize: "1.05rem",
                    }}
                  >
                    {t}
                  </button>
                  {hoveredTheme === t && themeDescriptions[t] && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "120%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--panel)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "0.5rem 0.75rem",
                        whiteSpace: "nowrap",
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        zIndex: 100,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      {themeDescriptions[t]}
                    </div>
                  )}
                </div>
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
                data-theme={m.theme}
                style={{ padding: "0.6rem", background: "#0f1420" }}
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="poster"
                  style={{ height: "320px", cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setExpandedImage(m.posterUrl);
                  }}
                />
                <h3
                  style={{
                    fontFamily: "serif",
                    fontSize: "1.1rem",
                    margin: "0.6rem 0 0.2rem",
                    background: `linear-gradient(135deg, ${
                      themeColors[m.theme] || "var(--accent-primary)"
                    }, var(--ink))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  className="no-underline"
                >
                  {m.title}
                </h3>
                <p style={{ color: "var(--muted)", margin: 0 }}>{m.tagline}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

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
    </>
  );
}
