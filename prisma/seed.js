import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
      theme: "yearning",
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
      theme: "reflection",
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
