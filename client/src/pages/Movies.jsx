import { useEffect, useState } from "react";
import { MovieGrid } from "../components/MovieGrid.jsx";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then(setMovies);
    fetch("/api/themes")
      .then((r) => r.json())
      .then(setThemes);
  }, []);

  const filtered = activeTheme
    ? movies.filter((m) => m.theme === activeTheme)
    : movies;

  return (
    <main className="shell">
      <MovieGrid
        movies={filtered}
        themes={themes}
        activeTheme={activeTheme}
        onFilter={setActiveTheme}
      />
    </main>
  );
}
