import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create curator account
  const curatorPassword = await bcrypt.hash("curator", 10);
  await prisma.user.upsert({
    where: { email: "curator@pathos.local" },
    update: { isCurator: true },
    create: {
      email: "curator@pathos.local",
      password: curatorPassword,
      isCurator: true,
    },
  });

  console.log("✓ Curator account created/updated: curator@pathos.local");

  const movies = [
    {
      slug: "in-the-mood-for-love",
      title: "In the Mood for Love",
      tagline: "Longing in narrow corridors.",
      posterUrl: "/posters/in-the-mood-for-love.jpg",
      synopsis: "Two neighbors drift in the spaces between duty and desire.",
      intrigues: [
        "Cheongsam patterns as emotional palette",
        "Step-printing that stretches time",
        "Nat King Cole as memory motif",
      ],
      theme: "reflection",
      stills: ["/stills/itmol-1.jpg", "/stills/itmol-2.jpg"],
      featured: true,
    },
    {
      slug: "columbus",
      title: "Columbus",
      tagline: "Modernism as quiet mirror.",
      posterUrl: "/posters/columbus.jpg",
      synopsis: "A son in limbo, a town of glass and steel.",
      intrigues: [
        "Architecture as character",
        "Symmetry and negative space",
        "Conversations carried by pauses",
      ],
      theme: "courage",
      stills: ["/stills/columbus-1.jpg"],
      featured: true,
    },
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { slug: movie.slug },
      update: movie,
      create: movie,
    });
  }

  console.log("✓ Movies seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
