import { useState } from "react";

export default function Admin() {
  const [movie, setMovie] = useState({
    slug: "",
    title: "",
    tagline: "",
    posterUrl: "",
    synopsis: "",
    theme: "hope",
    intrigues: [],
    stills: [],
    featured: false,
  });
  const [currentIntrigue, setCurrentIntrigue] = useState("");
  const [currentStill, setCurrentStill] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [expandedImage, setExpandedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovie((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and compress image
        const canvas = document.createElement("canvas");
        const maxWidth = 400;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const base64String = canvas.toDataURL("image/jpeg", 0.8);
        setMovie((prev) => ({
          ...prev,
          posterUrl: base64String,
        }));
        setPosterPreview(base64String);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const addIntrigue = () => {
    if (currentIntrigue.trim()) {
      setMovie((prev) => ({
        ...prev,
        intrigues: [...prev.intrigues, currentIntrigue.trim()],
      }));
      setCurrentIntrigue("");
    }
  };

  const removeIntrigue = (index) => {
    setMovie((prev) => ({
      ...prev,
      intrigues: prev.intrigues.filter((_, i) => i !== index),
    }));
  };

  const addStill = () => {
    if (currentStill.trim()) {
      setMovie((prev) => ({
        ...prev,
        stills: [...prev.stills, currentStill.trim()],
      }));
      setCurrentStill("");
    }
  };

  const removeStill = (index) => {
    setMovie((prev) => ({
      ...prev,
      stills: prev.stills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Not authenticated. Please log in.");
        return;
      }

      if (
        !movie.slug ||
        !movie.title ||
        !movie.tagline ||
        !movie.posterUrl ||
        !movie.synopsis
      ) {
        setMessage("✗ Please fill in all required fields");
        return;
      }

      const res = await fetch("http://localhost:4000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create movie");
      }

      setMessage("✓ Film added successfully!");
      setMovie({
        slug: "",
        title: "",
        tagline: "",
        posterUrl: "",
        synopsis: "",
        theme: "hope",
        intrigues: [],
        stills: [],
        featured: false,
      });
      setCurrentIntrigue("");
      setCurrentStill("");
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginTop: "0.5rem",
    background: "rgba(15, 22, 41, 0.5)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--ink)",
    fontFamily: "inherit",
    fontSize: "0.95rem",
  };

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: "0.25rem",
  };

  const sectionStyle = {
    marginBottom: "2rem",
  };

  const tagStyle = {
    display: "inline-block",
    background: "rgba(255, 107, 53, 0.2)",
    border: "1px solid var(--accent-primary)",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    marginRight: "0.5rem",
    marginBottom: "0.5rem",
    color: "var(--accent-primary)",
    fontSize: "0.85rem",
  };

  return (
    <main className="shell">
      <h1>Add New Film</h1>
      <div className="card" style={{ padding: "2rem", maxWidth: "700px" }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, color: "var(--accent-gold)" }}>
              Film Information
            </h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Slug * (URL-friendly identifier)</label>
              <input
                type="text"
                name="slug"
                value={movie.slug}
                onChange={handleChange}
                placeholder="e.g., in-the-mood-for-love"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                name="title"
                value={movie.title}
                onChange={handleChange}
                placeholder="Film title"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Tagline *</label>
              <input
                type="text"
                name="tagline"
                value={movie.tagline}
                onChange={handleChange}
                placeholder="Brief tagline or subtitle"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Synopsis *</label>
              <textarea
                name="synopsis"
                value={movie.synopsis}
                onChange={handleChange}
                placeholder="Detailed plot synopsis..."
                required
                rows="4"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Theme</label>
              <select
                name="theme"
                value={movie.theme}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="hope">
                  Hope — For when the light feels distant, but not gone.
                </option>
                <option value="release">
                  Release — For when holding it in is no longer an option.
                </option>
                <option value="discomfort">
                  Discomfort — For when you don't want to feel okay.
                </option>
                <option value="courage">
                  Courage — For when you need to stand a little taller.
                </option>
                <option value="reflection">
                  Reflection — For when you need to hear your own voice again.
                </option>
                <option value="existential">
                  Existential — For when the questions grow louder than the
                  answers.
                </option>
              </select>
            </div>
          </div>

          {/* Media Section */}
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, color: "var(--accent-gold)" }}>Media</h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Poster Image * (Upload or URL)</label>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  style={{
                    ...inputStyle,
                    flex: 1,
                    cursor: "pointer",
                  }}
                />
                <span style={{ color: "var(--muted)", alignSelf: "center" }}>
                  or
                </span>
                <input
                  type="url"
                  name="posterUrl"
                  value={
                    movie.posterUrl.startsWith("data:") ? "" : movie.posterUrl
                  }
                  onChange={handleChange}
                  placeholder="https://example.com/poster.jpg"
                  style={{
                    ...inputStyle,
                    flex: 1,
                  }}
                />
              </div>
              {(movie.posterUrl || posterPreview) && (
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                    Preview:
                  </p>
                  <img
                    src={posterPreview || movie.posterUrl}
                    alt="Poster preview"
                    onClick={() =>
                      setExpandedImage(posterPreview || movie.posterUrl)
                    }
                    style={{
                      maxWidth: "150px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                    onError={() => setMessage("✗ Could not load poster image")}
                  />
                </div>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Still Images (Scene Captures)</label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <input
                  type="url"
                  value={currentStill}
                  onChange={(e) => setCurrentStill(e.target.value)}
                  placeholder="https://example.com/still.jpg"
                  style={{ ...inputStyle, flex: 1, margin: 0 }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addStill())
                  }
                />
                <button
                  type="button"
                  onClick={addStill}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "var(--accent-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
              </div>
              {movie.stills.length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--muted)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Added stills ({movie.stills.length}):
                  </p>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {movie.stills.map((still, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          background: "rgba(255, 107, 53, 0.2)",
                          border: "1px solid var(--accent-primary)",
                          borderRadius: "6px",
                        }}
                      >
                        <img
                          src={still}
                          alt={`Still ${index + 1}`}
                          onClick={() => setExpandedImage(still)}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            objectFit: "cover",
                            transition: "transform 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <span
                          style={{
                            color: "var(--accent-primary)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {still.substring(still.lastIndexOf("/") + 1)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStill(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-ruby)",
                            cursor: "pointer",
                            marginLeft: "auto",
                            fontWeight: 700,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, color: "var(--accent-gold)" }}>
              Content Details
            </h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Intrigues (Key Elements)</label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <input
                  type="text"
                  value={currentIntrigue}
                  onChange={(e) => setCurrentIntrigue(e.target.value)}
                  placeholder="e.g., Cheongsam patterns as emotional palette"
                  style={{ ...inputStyle, flex: 1, margin: 0 }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addIntrigue())
                  }
                />
                <button
                  type="button"
                  onClick={addIntrigue}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "var(--accent-emerald)",
                    color: "#0a0e1a",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
              </div>
              {movie.intrigues.length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--muted)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Added intrigues ({movie.intrigues.length}):
                  </p>
                  <div>
                    {movie.intrigues.map((intrigue, index) => (
                      <div
                        key={index}
                        style={{
                          ...tagStyle,
                          borderColor: "var(--accent-emerald)",
                          background: "rgba(16, 217, 129, 0.1)",
                          color: "var(--accent-emerald)",
                        }}
                      >
                        {intrigue}
                        <button
                          type="button"
                          onClick={() => removeIntrigue(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-ruby)",
                            cursor: "pointer",
                            marginLeft: "0.5rem",
                            fontWeight: 700,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="featured"
                  checked={movie.featured}
                  onChange={handleChange}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                <span>✨ Featured Film (appears in featured section)</span>
              </label>
            </div>
          </div>

          {message && (
            <div
              className="emphasis"
              style={{
                borderColor: message.includes("✓")
                  ? "var(--accent-emerald)"
                  : "var(--accent-ruby)",
                marginBottom: "1.5rem",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
          >
            {loading ? "Adding Film..." : "✨ Add Film"}
          </button>
        </form>
      </div>

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
