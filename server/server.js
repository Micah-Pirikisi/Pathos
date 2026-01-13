import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prismaClient.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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

app.get("/api/themes", async (_req, res) => {
  const themes = await prisma.movie.findMany({
    where: { theme: { not: null } },
    select: { theme: true },
    distinct: ["theme"],
  });
  res.json(themes.map((t) => t.theme));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
