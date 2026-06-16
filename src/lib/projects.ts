export type GalleryItem = string | { type: "image" | "video"; url: string }

export interface Project {
  slug: string
  title: string
  category: string
  role: string
  year: number
  client?: string
  description: string
  concept: string
  hero: string
  thumbnail: string
  gallery: GalleryItem[]
  sketches: GalleryItem[]
  references: GalleryItem[]
  materials: { label: string; value: string }[]
  credits?: { role: string; name: string }[]
}

export const projects: Project[] = [
  {
    slug: "the-last-light",
    title: "The Last Light",
    category: "Feature Film",
    role: "Set Design / Production Styling",
    year: 2024,
    description:
      "A dystopian love story set in a fading world where light is the last remaining luxury.",
    concept:
      "The Last Light required building a world caught between decay and beauty. The visual language balanced brutalist architecture with intimate, warm interiors — each space reflecting the emotional arc of the characters. Every set was designed to feel lived-in, layered with history, and slowly consumed by shadow.",
    hero: "/images/the-last-light-hero.jpg",
    thumbnail: "/images/the-last-light-thumb.jpg",
    gallery: [
      "/images/the-last-light-1.jpg",
      "/images/the-last-light-2.jpg",
      "/images/the-last-light-3.jpg",
      "/images/the-last-light-4.jpg",
    ],
    sketches: [
      "/images/the-last-light-sketch-1.jpg",
      "/images/the-last-light-sketch-2.jpg",
    ],
    references: [
      "/images/the-last-light-ref-1.jpg",
      "/images/the-last-light-ref-2.jpg",
      "/images/the-last-light-ref-3.jpg",
    ],
    materials: [
      { label: "Style", value: "Brutalist meets warm minimalism" },
      { label: "Palette", value: "Charcoal, ochre, oxidized brass, warm amber" },
      { label: "Textures", value: "Raw concrete, aged wood, linen, patinated metal" },
      { label: "Lighting", value: "Practical sources, tungsten warmth, deep shadow" },
    ],
    credits: [
      { role: "Director", name: "Elena Marchetti" },
      { role: "Production Designer", name: "Aya Sheba" },
      { role: "DOP", name: "Rafael Torres" },
    ],
  },
  {
    slug: "echo-chamber",
    title: "Echo Chamber",
    category: "TV Series",
    role: "Set Design / Décor Execution",
    year: 2025,
    description:
      "A psychological thriller where the architecture itself becomes a character.",
    concept:
      "Echo Chamber explores paranoia through space. Corridors tighten. Rooms repeat with subtle differences. The sets were constructed to feel both familiar and deeply wrong — using forced perspective, mirrored layouts, and an increasingly oppressive color script that shifts from neutral grays to sickly greens.",
    hero: "/images/echo-chamber-hero.jpg",
    thumbnail: "/images/echo-chamber-thumb.jpg",
    gallery: [
      "/images/echo-chamber-1.jpg",
      "/images/echo-chamber-2.jpg",
      "/images/echo-chamber-3.jpg",
    ],
    sketches: [
      "/images/echo-chamber-sketch-1.jpg",
    ],
    references: [
      "/images/echo-chamber-ref-1.jpg",
      "/images/echo-chamber-ref-2.jpg",
    ],
    materials: [
      { label: "Style", value: "Corporate brutalism, subtle dread" },
      { label: "Palette", value: "Cool grays, institutional green, fluorescent white" },
      { label: "Textures", value: "Vinyl flooring, acoustic tile, brushed aluminum" },
      { label: "Lighting", value: "Overhead fluorescent, harsh shadows, flickering practicals" },
    ],
  },
  {
    slug: "dust-and-bone",
    title: "Dust & Bone",
    category: "Independent Film",
    role: "Spatial Storytelling / Production Styling",
    year: 2023,
    description:
      "A raw, visceral story set across the American dust belt — where every object carries memory.",
    concept:
      "Dust & Bone called for an authentic, tactile world. We sourced period-accurate furniture, hand-worn props, and built interiors that felt excavated from memory. The color palette was grounded in faded earth tones — sun-bleached wood, rusted metal, dried earth — punctuated by small moments of vivid color.",
    hero: "/images/dust-and-bone-hero.jpg",
    thumbnail: "/images/dust-and-bone-thumb.jpg",
    gallery: [
      "/images/dust-and-bone-1.jpg",
      "/images/dust-and-bone-2.jpg",
      "/images/dust-and-bone-3.jpg",
      "/images/dust-and-bone-4.jpg",
      "/images/dust-and-bone-5.jpg",
    ],
    sketches: [
      "/images/dust-and-bone-sketch-1.jpg",
      "/images/dust-and-bone-sketch-2.jpg",
    ],
    references: [
      "/images/dust-and-bone-ref-1.jpg",
      "/images/dust-and-bone-ref-2.jpg",
    ],
    materials: [
      { label: "Style", value: "American vernacular, weathered authenticity" },
      { label: "Palette", value: "Faded ochre, rust, denim blue, sun-bleached bone" },
      { label: "Textures", value: "Weathered wood, distressed leather, cotton, patinaed metal" },
      { label: "Lighting", value: "Natural light, practical lamps, golden hour warmth" },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
