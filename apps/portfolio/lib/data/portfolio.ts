// Static portfolio dataset. The LLM gets this verbatim in its system prompt
// and is instructed to ONLY surface facts that appear here.

export const portfolio = {
  profile: {
    name: "Pelayo Méndez",
    headline: "Creative software developer & lead",
    location: "Barcelona, Spain",
    avatar: "/avatar.svg",
    bio: [
      "I'm a creative coder turned software lead, fascinated by how technology can mirror the poetic essence of written language.",
      "After a decade designing interactive performances, installations and audio-reactive concerts, I'm now focused on AI-driven interfaces and developer tooling — bringing the same generative sensibility to the way humans and language models share a screen.",
    ],
    currentlyAt: "GFT Technologies",
  },

  contact: {
    email: "Pelayo.Mendez@gft.com",
    github: "https://github.com/pelayomendez",
    linkedin: "https://www.linkedin.com/in/pelayomendez/",
    websites: [
      { label: "pelayomendez.dev", href: "https://www.pelayomendez.dev/" },
      { label: "pelayomendez.com", href: "https://pelayomendez.com/" },
    ],
  },

  skills: {
    "AI & frontend": ["TypeScript", "React", "Next.js", "LLM tooling", "Mistral", "Anthropic"],
    "Creative coding": ["openFrameworks", "Processing", "WebGL", "Generative design"],
    "Realtime systems": ["WebSockets", "Audio-reactive systems", "Projection mapping", "Kinect"],
    "Practice": ["Interaction design", "Art direction", "Technical direction", "Teaching"],
  },

  experience: [
    {
      role: "Creative software developer & lead",
      company: "GFT Technologies",
      period: "Present",
      summary:
        "Frontend lead working on AI-driven interfaces and developer tooling for international clients.",
    },
    {
      role: "Freelance creative coder & interaction designer",
      company: "Independent",
      period: "2011 — present",
      summary:
        "Decade-plus of generative visuals, interactive installations and audio-reactive performances for international stages and festivals.",
    },
    {
      role: "Lecturer",
      company: "EINA & ELISAVA, Barcelona",
      period: "Ongoing",
      summary:
        "Workshops and courses on using code for aesthetic and narrative purposes.",
    },
  ],

  projects: [
    {
      name: "Generative Semantic UI",
      year: "2026",
      tags: ["TypeScript", "LLMs", "React"],
      summary:
        "A constrained JSX vocabulary and compiler that lets language models render real UI — like HTML for AI agents.",
      href: "https://github.com/pelayomendez/generative-semantic-ui",
      role: "Creator",
    },
    {
      name: "APOLO — Nitsa",
      year: "2018",
      tags: ["Interactive", "LED", "Project management"],
      summary:
        "Interactive dance room with a large-scale LED grid driven by ProtoPixel, in Barcelona's Nitsa club.",
      role: "Project management",
    },
    {
      name: "Absolut New Dimensions",
      year: "2017",
      tags: ["Lighting", "Sonar Festival"],
      summary:
        "Volumetric lighting installation for Sonar Festival, in collaboration with art director Joan Guasch.",
      role: "Project management",
    },
    {
      name: "Mugaritz: OFF-ROAD",
      year: "2015",
      tags: ["Data viz", "Film"],
      summary:
        "Documentary on the Michelin-starred restaurant by Pep Gatell (La Fura dels Baus) — visual interpretation of 18 years of restaurant data. Selected at San Sebastian and Berlin film festivals.",
      role: "Visual data scripting & infographic design",
    },
    {
      name: "CROMA",
      year: "2015",
      tags: ["Performance", "Award"],
      summary:
        "Pixel-based contemporary dance piece with three dancers in different locations, sharing a video wall narrative. Future of Internet Performing Arts Prize.",
      role: "Original idea & interactive design",
    },
    {
      name: "M.U.R.S.",
      year: "2014",
      tags: ["Interactive theatre", "Smart cities"],
      summary:
        "Four-room interactive theatre experience critiquing Smart Cities, with audience interaction via smartphone. Premiered at GREC Theater Festival.",
      role: "Technical & artistic direction",
    },
    {
      name: "Parsifal",
      year: "2013",
      tags: ["Opera", "Realtime"],
      summary:
        "Four-hour Wagner opera reinterpretation in Cologne directed by Carlus Padrissa — realtime interactive video and stage control with openFrameworks and Processing.",
      role: "Interactive video & generative design",
    },
    {
      name: "The Magic Melody",
      year: "2013",
      tags: ["Video mapping", "Singapore"],
      summary:
        "Tablet-driven interactive video mapping on the Singapore Art Museum facade for Singapore Night Festival, built with openFrameworks and Box2D.",
      role: "Generative design & systems",
    },
    {
      name: "Oresteia",
      year: "2012",
      tags: ["Opera", "Audio-reactive"],
      summary:
        "Iannis Xenakis opera in Tokyo's Suntory Hall directed by Carlus Padrissa — audio-reactive visuals and Twitter-driven Japanese translations on a giant metallic tree.",
      role: "Interactive graphics & generative design",
    },
  ],

  recognition: [
    "Future of Internet Performing Arts Prize (2015) — CROMA",
    "CSS REEL Nominee",
    "CSS Awards Nominee",
    "Featured on One Page Mania",
  ],

  openSource: [
    {
      name: "ArticleLang",
      year: "2026",
      tags: ["DSL", "TypeScript", "LLMs"],
      summary:
        "A domain-specific language for writing article and story specifications. Narrative structures compile through Lexer → Parser → AST → Narrative IR → Prompt Compiler into generated prose.",
      href: "https://github.com/pelayomendez/articlelang",
      published: "npm: articlelang",
    },
    {
      name: "ArticleLang Studio",
      year: "2026",
      tags: ["Astro", "Monaco", "Mistral"],
      summary:
        "Browser-based authoring environment for ArticleLang's CSL — Monaco editor with syntax highlighting, live validation, pipeline inspector and Mistral provider integration.",
      href: "https://github.com/pelayomendez/articlelang-studio",
    },
    {
      name: "Honest Driven Development",
      year: "2026",
      tags: ["DX", "AI tooling", "npm"],
      summary:
        "A lightweight take on intent-driven development with integrated specs. Pitched as a counter to AI coding tools that ship before you've thought.",
      href: "https://github.com/pelayomendez/honest-dd",
      published: "npm: honestdd",
    },
    {
      name: "Realtime Classroom (agent-wars-server)",
      year: "2026",
      tags: ["Socket.IO", "Teaching"],
      summary:
        "Shared 2D board for many students connected in realtime — a three-phase classroom exercise that culminates in students programming autonomous agents to repair red zones on the board.",
      href: "https://github.com/pelayomendez/agent-wars-server",
    },
    {
      name: "Thamyris' Judgment",
      year: "2025",
      tags: ["React", "TypeScript", "Myth"],
      summary:
        "A poetic duel inspired by the myth of Thamyris, the Thracian musician who dared to challenge the Muses.",
      href: "https://github.com/pelayomendez/thamyris-judgment",
    },
    {
      name: "FableChat",
      year: "2025",
      tags: ["Gemini", "Storytelling"],
      summary:
        "Google AI Studio app — once-upon-a-time storytelling chat experience, powered by Gemini.",
      href: "https://github.com/pelayomendez/fablechat",
    },
  ],

  github: {
    profile: "https://github.com/pelayomendez",
    note:
      "Most active threads on GitHub right now: AI-generated UI (this repo), narrative DSLs (ArticleLang), and intent-driven dev tooling (Honest DD).",
  },
} as const;

export type Portfolio = typeof portfolio;
