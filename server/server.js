import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./prismaClient.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from client/dist (but not API routes)
app.use(express.static(path.join(__dirname, "../client/dist"), {
  // Don't serve index.html for /api routes
  setHeaders: (res, path) => {
    if (path.endsWith("index.html")) {
      res.setHeader("Cache-Control", "no-cache");
    }
  }
}));

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT and extract user
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is curator
const isCurator = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user || !user.isCurator) {
      return res.status(403).json({ message: "Curator access required" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error verifying curator status" });
  }
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, isCurator: user.isCurator },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, isCurator: user.isCurator },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Movie Routes
app.get("/api/movies", async (_req, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(movies);
});

app.get("/api/movies/:slug", async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { slug: req.params.slug },
  });
  if (!movie) return res.status(404).json({ message: "Not found" });
  res.json(movie);
});

// Curator-only: Add movie
app.post("/api/movies", verifyToken, isCurator, async (req, res) => {
  try {
    const {
      slug,
      title,
      tagline,
      posterUrl,
      synopsis,
      intrigues,
      theme,
      stills,
      featured,
    } = req.body;

    if (!slug || !title || !tagline || !posterUrl || !synopsis) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const movie = await prisma.movie.create({
      data: {
        slug,
        title,
        tagline,
        posterUrl,
        synopsis,
        intrigues: intrigues || [],
        theme: theme || null,
        stills: stills || [],
        featured: featured || false,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Movie slug already exists" });
    }
    res.status(500).json({ message: "Error creating movie" });
  }
});

// Curator-only: Update movie
app.put("/api/movies/:id", verifyToken, isCurator, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error updating movie" });
  }
});

// Curator-only: Delete movie
app.delete("/api/movies/:id", verifyToken, isCurator, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie" });
  }
});

app.get("/api/themes", async (_req, res) => {
  const themes = await prisma.movie.findMany({
    where: { theme: { not: null } },
    select: { theme: true },
    distinct: ["theme"],
  });
  res.json(themes.map((t) => t.theme));
});

// Serve React app for all non-API routes (client-side routing)
app.use((req, res) => {
  // Only serve index.html for non-API requests
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  } else {
    res.status(404).json({ message: "API endpoint not found" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
