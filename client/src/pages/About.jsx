import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="shell">
      <section className="card" style={{ padding: "1.5rem" }}>
        <p className="meta">About</p>
        <h1
          style={{
            fontFamily: "serif",
            fontSize: "1.8rem",
            margin: "0.3rem 0 0.6rem",
          }}
        >
          Pathos
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Pathos is curated cinema as editorial: short notes, a handful of
          images, a single thematic line. Less feed, more focus. Each pick
          carries a mood and a few intrigues—breadcrumbs into the film’s
          texture.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <p className="meta" style={{ marginBottom: "0.4rem" }}>
            Curator’s favourite
          </p>
          <Link
            to="/movies/in-the-mood-for-love"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            In the Mood for Love
          </Link>
          <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>
            A chamber piece of restraint—hallways, hems, and the ache of unsent
            letters.
          </p>
        </div>
      </section>
    </main>
  );
}