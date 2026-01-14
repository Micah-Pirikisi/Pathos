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
          The Power of Stories
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Pathos is a guide to films that move the heart, spotlightlighting
          under-the-radar movies and the emotional experiences they offer, from
          hope and courage to reflection and release.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <p className="meta" style={{ marginBottom: "0.4rem" }}>
            Curator’s favourite
          </p>
          <Link
            to="/movies/you-wont-be-alone"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            You Won't Be Alone
          </Link>
          <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>
            It's easy to hyperfocus on all the violence and pain around us, to see existence as a curse and the universe as purely malevolent. This is a film that helped and continues to help me see the things that live beside those things.</p> 
            <p><em> It's a cruel thing, this world. And yet... </em>
          </p>
        </div>
      </section>
    </main>
  );
}
