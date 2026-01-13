import { useEffect, useState } from "react";
import { FeaturedStrip } from "../components/FeaturedStrip.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => setFeatured(data.filter((m) => m.featured)));
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
    </main>
  );
}
