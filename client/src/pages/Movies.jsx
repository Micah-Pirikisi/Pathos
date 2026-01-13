import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid.jsx";

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(
    searchParams.get("theme") || null
  );
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/movies").then((r) => r.json()),
      fetch("/api/themes").then((r) => r.json()),
    ]).then(([moviesData, themesData]) => {
      if (isMounted) {
        setMovies(moviesData);
        setThemes(themesData);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = activeTheme
    ? movies.filter((m) => m.theme === activeTheme)
    : movies;

  const displayed = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  return (
    <main className="shell">
      {loading ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <MovieGrid
            movies={displayed}
            themes={themes}
            activeTheme={activeTheme}
            onFilter={(theme) => {
              setActiveTheme(theme);
              setDisplayCount(12);
              if (theme) {
                setSearchParams({ theme });
              } else {
                setSearchParams({});
              }
            }}
          />
          {hasMore && (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setDisplayCount((prev) => prev + 12)}
                className="load-more-btn"
              >
                Load More Films
              </button>
            </div>
          )}
          {!hasMore && filtered.length > 0 && (
            <p
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginTop: "2rem",
                fontSize: "0.9rem",
              }}
            >
              Showing all {filtered.length} film
              {filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </>
      )}
    </main>
  );
}
