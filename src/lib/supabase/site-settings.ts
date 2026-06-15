import { createClient } from "./server"

export interface ProcessStep {
  number: string
  title: string
  subtitle: string
  description: string
  paragraphs: string[]
  thumb: string
}

export interface SiteSettings {
  id: number
  singleton_key: string
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_cta_label: string
  hero_cta_link: string
  hero_background_image: string
  about_title: string
  about_description: string
  about_image: string
  process_title: string
  process_subtitle: string
  process_steps: ProcessStep[]
  footer_text: string
  contact_email: string
  instagram_url: string
  linkedin_url: string
  created_at: string
  updated_at: string
}

const defaultSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Research & Mood",
    subtitle: "Understanding the world before building it",
    description:
      "I immerse myself in the script, characters, and world — gathering references that define the emotional palette.",
    paragraphs: [
      "Every project begins with deep immersion. I read the script multiple times — once for story, once for character, once for space. I build extensive mood boards that go beyond simple aesthetics — these are emotional maps, color palettes tied to character arcs, architectural references that reflect power dynamics.",
      "I research period architecture, interior design movements, and the tactile language of everyday objects. This phase culminates in a visual presentation shared with the director and production team. It's our first shared vocabulary.",
    ],
    thumb: "/images/the-last-light-ref-1.jpg",
  },
  {
    number: "02",
    title: "Concept & Sketch",
    subtitle: "From emotion to elevation",
    description:
      "Rough sketches and spatial diagrams translate emotion into floor plans and narrative-driven layouts.",
    paragraphs: [
      "I begin translating feelings into floor plans. Initial sketches are loose and exploratory — dozens of thumbnail layouts testing different spatial configurations. Each layout is tested against the script's blocking requirements and camera placement needs.",
      "Once the layout is locked, I produce detailed elevation drawings and perspective sketches. These bring the space to life on paper before any physical construction begins.",
    ],
    thumb: "/images/the-last-light-sketch-1.jpg",
  },
  {
    number: "03",
    title: "Materials & Details",
    subtitle: "The language of surfaces",
    description:
      "Every surface tells a story. I select materials, textures, and finishes that reinforce character and period.",
    paragraphs: [
      "Materials are the vocabulary of set design. I select every surface for its narrative weight — the warmth of aged brass, the coldness of raw concrete, the intimacy of weathered linen. Each material choice reinforces character and story.",
      "I create detailed finish schedules specifying every surface, from wall treatments to floor coverings to the exact patina of door handles. No detail is too small to consider.",
    ],
    thumb: "/images/the-last-light-ref-2.jpg",
  },
  {
    number: "04",
    title: "Execution & Styling",
    subtitle: "Bringing the vision to life",
    description:
      "On set, the vision becomes reality — overseeing construction, dressing, and final styling.",
    paragraphs: [
      "I oversee construction, working closely with set builders, painters, and artisans to ensure every detail matches the design intent. Once the architecture is built, dressing begins — sourcing props, furniture, and objects that tell stories.",
      "Final styling involves the last layer of detail — the placement of objects, the arrangement of fabrics, the quality of light. This is where a set stops being a construction and starts being a world.",
    ],
    thumb: "/images/the-last-light-1.jpg",
  },
]

const defaults: SiteSettings = {
  id: 0,
  singleton_key: "main",
  hero_title: "Aya",
  hero_subtitle: "Set Design \u2022 Production Styling \u2022 Spatial Storytelling",
  hero_description:
    "I design spaces that tell stories \u2014 where every detail shapes emotion, character, and atmosphere.",
  hero_cta_label: "View Selected Works",
  hero_cta_link: "/projects",
  hero_background_image: "/images/hero.jpg",
  about_title: "I design worlds\nthat tell stories.",
  about_description:
    "I\u2019m Aya \u2014 a set designer and production stylist working at the intersection of architecture, narrative, and emotion. For over a decade, I\u2019ve been building worlds for film and television \u2014 from feature films to episodic series \u2014 where every surface, texture, and object serves the story.\n\nMy work begins not with floor plans, but with questions: Who lives here? What do they fear? What do they reach for when no one is watching?",
  about_image: "/images/about.jpg",
  process_title: "Process",
  process_subtitle: "How I Work",
  process_steps: defaultSteps,
  footer_text: "Let\u2019s create something unforgettable.",
  contact_email: "hello@ayachensf.com",
  instagram_url: "#",
  linkedin_url: "#",
  created_at: "",
  updated_at: "",
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("singleton_key", "main")
      .maybeSingle()

    if (error || !data) {
      if (process.env.NODE_ENV === "development") {
        console.log("[site-settings] no row found, using static defaults")
      }
      return defaults
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[site-settings] loaded id:", data.id, "updated_at:", data.updated_at)
      if (data.hero_background_image) {
        console.log("[site-settings] hero_background_image:", data.hero_background_image)
      }
      if (data.about_image) {
        console.log("[site-settings] about_image:", data.about_image)
      }
    }

    return {
      id: data.id,
      singleton_key: data.singleton_key ?? "main",
      hero_title: data.hero_title ?? defaults.hero_title,
      hero_subtitle: data.hero_subtitle ?? defaults.hero_subtitle,
      hero_description: data.hero_description ?? defaults.hero_description,
      hero_cta_label: data.hero_cta_label ?? defaults.hero_cta_label,
      hero_cta_link: data.hero_cta_link ?? defaults.hero_cta_link,
      hero_background_image: data.hero_background_image || defaults.hero_background_image,
      about_title: data.about_title ?? defaults.about_title,
      about_description: data.about_description ?? defaults.about_description,
      about_image: data.about_image || defaults.about_image,
      process_title: data.process_title ?? defaults.process_title,
      process_subtitle: data.process_subtitle ?? defaults.process_subtitle,
      process_steps: Array.isArray(data.process_steps)
        ? data.process_steps
        : defaults.process_steps,
      footer_text: data.footer_text ?? defaults.footer_text,
      contact_email: data.contact_email ?? defaults.contact_email,
      instagram_url: data.instagram_url ?? defaults.instagram_url,
      linkedin_url: data.linkedin_url ?? defaults.linkedin_url,
      created_at: data.created_at ?? "",
      updated_at: data.updated_at ?? "",
    }
  } catch {
    return defaults
  }
}
