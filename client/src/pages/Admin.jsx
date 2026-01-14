import { useState, useEffect } from "react";

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
  const [editingId, setEditingId] = useState(null);
  const [existingMovies, setExistingMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [currentIntrigue, setCurrentIntrigue] = useState("");
  const [currentStill, setCurrentStill] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    // Load existing movies
    setLoadingMovies(true);
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => {
        setExistingMovies(data);
        setLoadingMovies(false);
      })
      .catch(() => setLoadingMovies(false));
  }, []);

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

      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/movies/${editingId}` : "/api/movies";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save movie");
      }

      setMessage(
        editingId
          ? "✓ Film updated successfully!"
          : "✓ Film added successfully!"
      );
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
      setEditingId(null);
      setPosterPreview("");

      // Reload movies list
      const updatedMovies = await fetch("/api/movies").then((r) => r.json());
      setExistingMovies(updatedMovies);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movieToEdit) => {
    setMovie(movieToEdit);
    setEditingId(movieToEdit.id);
    setPosterPreview(movieToEdit.posterUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this film?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete movie");

      setMessage("✓ Film deleted successfully!");
      const updatedMovies = await fetch("/api/movies").then((r) => r.json());
      setExistingMovies(updatedMovies);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
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
    setEditingId(null);
    setPosterPreview("");
    setMessage("");
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
      <h1>{editingId ? "Edit Film" : "Add New Film"}</h1>
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

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 1, padding: "1rem", fontSize: "1rem" }}
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "✨ Update Film"
                : "✨ Add Film"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "1rem 1.5rem",
                  background: "transparent",
                  border: "1px solid var(--accent-ruby)",
                  color: "var(--accent-ruby)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(239, 68, 68, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Films List */}
      {existingMovies.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h2>Existing Films ({existingMovies.length})</h2>
          <div className="card" style={{ padding: "1.5rem" }}>
            {loadingMovies ? (
              <p style={{ color: "var(--muted)" }}>Loading films...</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {existingMovies.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 1fr auto auto",
                      gap: "1rem",
                      alignItems: "center",
                      padding: "1rem",
                      background: "rgba(15, 22, 41, 0.5)",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${
                        {
                          hope: "#fbbf24",
                          release: "#ef4444",
                          discomfort: "#ff6b35",
                          courage: "#10d981",
                          reflection: "#3b82f6",
                          existential: "#a855f7",
                        }[m.theme] || "#c0c9e0"
                      }`,
                    }}
                  >
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpandedImage(m.posterUrl)}
                    />
                    <div>
                      <h4 style={{ margin: "0 0 0.3rem" }}>{m.title}</h4>
                      <p
                        style={{
                          color: "var(--muted)",
                          margin: "0 0 0.3rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        {m.tagline}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--muted)",
                          background: "rgba(192, 201, 224, 0.1)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        {m.theme}
                        {m.featured && " • Featured"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEdit(m)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "transparent",
                        border: "1px solid var(--accent-primary)",
                        color: "var(--accent-primary)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.background = "rgba(192, 201, 224, 0.1)";
                        e.target.style.background = "rgba(192, 201, 224, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "transparent",
                        border: "1px solid var(--accent-ruby)",
                        color: "var(--accent-ruby)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(239, 68, 68, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
