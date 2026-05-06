// Static portfolio dataset. The LLM gets this verbatim in its system prompt
// and is instructed to ONLY surface facts that appear here.

const PMD = "https://www.pelayomendez.dev/img"; // base for project image assets
const VIMEO = "https://player.vimeo.com/video";

export const portfolio = {
  profile: {
    name: "Pelayo Méndez",
    headline: "Creative software developer & lead",
    location: "Barcelona, Spain",
    avatar: "/avatar.svg",
    bio: [
      "I'm a creative coder turned software lead, fascinated by how technology can mirror the poetic essence of written language.",
      "After a decade designing interactive performances, installations and audio-reactive concerts with companies like La Fura dels Baus, I'm now focused on AI-driven interfaces and developer tooling — bringing the same generative sensibility to the way humans and language models share a screen.",
    ],
    currentlyAt: "GFT Technologies",
  },

  contact: {
    email: "Pelayo.Mendez@gft.com",
    github: "https://github.com/pelayomendez",
    linkedin: "https://www.linkedin.com/in/pelayomendez/",
    websites: [
      { label: "pelayomendez.dev", href: "https://www.pelayomendez.dev/" },
    ],
  },

  skills: {
    "AI & frontend": [
      "TypeScript",
      "React",
      "Next.js",
      "LLM tooling",
      "Mistral",
      "Anthropic",
    ],
    "Creative coding": [
      "openFrameworks",
      "Processing",
      "WebGL",
      "Generative design",
      "Pixi.js",
    ],
    "Realtime systems": [
      "WebSockets",
      "Audio-reactive systems",
      "Projection mapping",
      "Kinect",
      "Box2D",
    ],
    "Practice": [
      "Interaction design",
      "Art direction",
      "Technical direction",
      "Teaching",
    ],
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

  // Projects from pelayomendez.dev — chronological reverse. Each `id` matches
  // the prefix of its image filenames on the live site.
  projects: [
    {
      id: "apolo",
      name: "APOLO — Nitsa",
      year: "2018",
      location: "Barcelona",
      tags: ["Interactive", "LED", "Project management"],
      role: "Project management",
      summary:
        "Interactive dance room with a large-scale LED grid driven by ProtoPixel, in Barcelona's Nitsa club.",
      collaborators: ["ProtoPixel"],
      video: `${VIMEO}/307521436`,
      images: [`${PMD}/apolo1.jpg`, `${PMD}/apolo2.jpg`, `${PMD}/apolo3.jpg`],
    },
    {
      id: "absolut",
      name: "Absolut New Dimensions",
      year: "2017",
      location: "Barcelona",
      tags: ["Lighting", "Sonar Festival"],
      role: "Project management",
      summary:
        "Volumetric lighting installation for Sonar Festival, in collaboration with art director Joan Guasch.",
      collaborators: ["Joan Guasch"],
      video: `${VIMEO}/223587103`,
      images: [`${PMD}/absolut1.jpg`, `${PMD}/absolut2.jpg`],
    },
    {
      id: "alexis",
      name: "Electronic Hair Dyer",
      year: "2016",
      location: "Barcelona",
      tags: ["Fashion", "Performance"],
      role: "Art direction, concept, project direction",
      summary:
        "Light-controlled hair dryer performance for the Wella TrendVision interactive fashion show, with Alexis Ferrer.",
      collaborators: ["Alexis Ferrer", "ProtoPixel"],
      video: `${VIMEO}/311894905`,
      images: [`${PMD}/alexis1.png`, `${PMD}/alexis2.jpg`, `${PMD}/alexis3.jpg`],
    },
    {
      id: "mugaritz",
      name: "Mugaritz: OFF-ROAD",
      year: "2015",
      location: "Barcelona",
      tags: ["Data viz", "Film"],
      role: "Visual data scripting & infographic design",
      summary:
        "Documentary on the Michelin-starred restaurant by Pep Gatell (La Fura dels Baus) — a visual interpretation of 18 years of restaurant data. Selected at San Sebastián and Berlin film festivals.",
      collaborators: ["Pep Gatell", "Fritz Gnad"],
      video: `${VIMEO}/139784150`,
      images: [
        `${PMD}/mugaritz1.jpg`,
        `${PMD}/mugaritz2.jpg`,
        `${PMD}/mugaritz3.jpg`,
      ],
    },
    {
      id: "croma",
      name: "CROMA",
      year: "2015",
      location: "Barcelona",
      tags: ["Performance", "Award"],
      role: "Original idea, video & interactive design",
      summary:
        "Pixel-based contemporary dance piece with three dancers in different locations sharing a video-wall narrative. Awarded the Future of Internet Performing Arts Prize.",
      collaborators: ["Hand Made Dance", "Julio Clavijo", "Jaume Grau", "David Torres"],
      video: `${VIMEO}/160608485`,
      images: [`${PMD}/croma1.jpg`, `${PMD}/croma2.jpg`, `${PMD}/croma3.jpg`],
    },
    {
      id: "cicle",
      name: "Cicle of Life",
      year: "2014",
      location: "Girona",
      tags: ["Projection mapping", "Theatre"],
      role: "Interactive design & coding",
      summary:
        "Theatrical projection mapping on the Casa dels Pastors facade, honouring Richard Strauss' 150th birth anniversary at the 1st Girona International Mapping Festival.",
      collaborators: ["Xavi Bové", "Elizabeth Vilaplana", "Raul Patiño"],
      video: `${VIMEO}/104846862`,
      images: [`${PMD}/cicle1.jpg`, `${PMD}/cicle2.jpg`],
    },
    {
      id: "murs",
      name: "M.U.R.S.",
      year: "2014",
      location: "Barcelona",
      tags: ["Interactive theatre", "Smart cities"],
      role: "Technical & artistic direction, interactive design, coding",
      summary:
        "Four-room interactive theatre experience critiquing Smart Cities, with audience participation through a smartphone app. Premiered at GREC Theater Festival.",
      collaborators: [
        "Carlus Padrissa",
        "Pep Gatell",
        "Pera Tantiñà",
        "Jürgen Müller",
        "Tigrelab",
        "Inqbarna",
      ],
      video: `${VIMEO}/104492179`,
      images: [`${PMD}/murs1.jpg`, `${PMD}/murs2.jpg`, `${PMD}/murs3.jpg`],
    },
    {
      id: "esser",
      name: "L'Ésser del Mil·leni",
      year: "2013",
      location: "Barcelona",
      tags: ["Generative", "Live event"],
      role: "Interactive graphics & video design",
      summary:
        "New Year's Eve macro-event by La Fura dels Baus — generative font for the countdown and twelve bell chimes, plus live LED-screen video content.",
      collaborators: ["Carlus Padrissa", "Pep Gatell"],
      video: `${VIMEO}/92852474`,
      images: [`${PMD}/mileni.jpg`, `${PMD}/mileni2.jpg`],
    },
    {
      id: "parsifal",
      name: "Parsifal",
      year: "2013",
      location: "Cologne",
      tags: ["Opera", "Realtime"],
      role: "Interactive video & generative design",
      summary:
        "Four-hour Wagner opera reinterpretation directed by Carlus Padrissa — realtime interactive video and stage control with openFrameworks and Processing.",
      collaborators: ["Carlus Padrissa", "welovecode", "Fritz Gnad"],
      video: `${VIMEO}/75478807`,
      images: [`${PMD}/parsifal.jpg`, `${PMD}/parsifal2.jpg`],
    },
    {
      id: "magicmelody",
      name: "The Magic Melody",
      year: "2013",
      location: "Singapore",
      tags: ["Video mapping", "Tablet UI"],
      role: "Interactive interface, generative design, system development",
      summary:
        "Tablet-driven interactive video mapping on the Singapore Art Museum facade for Singapore Night Festival, built with openFrameworks and Box2D.",
      collaborators: ["Tigrelab", "Setlego", "Franck Desert"],
      video: `${VIMEO}/79871647`,
      images: [
        `${PMD}/singapore.jpg`,
        `${PMD}/singapore2.jpg`,
        `${PMD}/singapore3.jpg`,
      ],
    },
    {
      id: "airguitar",
      name: "Virtual Air Guitar",
      year: "2013",
      location: "Barcelona",
      tags: ["Kinect", "Sónar+D"],
      role: "Concept, production & coding",
      summary:
        "Kinect-based invisible guitar instrument inside a 360º immersive video environment. Debuted at Sónar+D festival.",
      collaborators: ["Felipe L. Navarro", "Mr. Fogg"],
      video: `${VIMEO}/75498054`,
      images: [`${PMD}/guitar.jpg`, `${PMD}/guitar2.jpg`],
    },
    {
      id: "oresteia",
      name: "Oresteia",
      year: "2012",
      location: "Tokyo",
      tags: ["Opera", "Audio-reactive"],
      role: "Interactive graphics & generative design",
      summary:
        "Iannis Xenakis opera at Tokyo's Suntory Hall directed by Carlus Padrissa — audio-reactive visuals and Twitter-driven Japanese translations on a giant metallic tree.",
      collaborators: ["Carlus Padrissa", "Roland Olbeter", "Chu Uróz"],
      video: `${VIMEO}/76048215`,
      images: [`${PMD}/orestiada.jpg`, `${PMD}/orestiada2.jpg`],
    },
    {
      id: "orfeo",
      name: "Orfeo ed Euridice",
      year: "2012",
      location: "Peralada",
      tags: ["Opera", "Custom software"],
      role: "Interactive graphics & generative design",
      summary:
        "Gluck opera by Carlus Padrissa with full orchestra on stage, driven by 'Eco' — a bespoke realtime synchronisation engine. Performed in Peralada, Montevideo and Granada.",
      collaborators: ["Carlus Padrissa", "David Cid", "Sagar Fornies"],
      video: `${VIMEO}/75477912`,
      images: [`${PMD}/orfeo.jpg`, `${PMD}/orfeo2.jpg`],
    },
    {
      id: "visualsound",
      name: "Visual Sound Building",
      year: "2012",
      location: "Milan",
      tags: ["Video mapping", "Synth"],
      role: "Interactive graphics, interface & system development",
      summary:
        "Interactive video mapping on the Villa Titoni facade — windows function as a musical synth keyboard controlled from tablets via WebSockets. Kernel 2012 Video Mapping Festival.",
      collaborators: ["Tigrelab", "Setlego", "Franck Desert"],
      video: `${VIMEO}/75498967`,
      images: [
        `${PMD}/kernel.jpg`,
        `${PMD}/kernel2.jpg`,
        `${PMD}/kernel3.jpg`,
      ],
    },
    {
      id: "jackdaniels",
      name: "Jack Daniel's New Bottle Launch",
      year: "2011",
      location: "Madrid",
      tags: ["Audio-reactive", "Live event"],
      role: "Interactive graphics & generative design",
      summary:
        "Audio-reactive concert with Christian Rey Nagel (Pinkertones), with generative visual scenes responding to live guitar projected on a semi-transparent tulle.",
      collaborators: ["Tigrelab", "Fritz Gnad", "EURO RSCG Barcelona"],
      video: `${VIMEO}/75500650`,
      images: [`${PMD}/jack.jpg`, `${PMD}/jack2.jpg`],
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
    {
      name: "Generative Semantic UI",
      year: "2026",
      tags: ["TypeScript", "LLMs", "React"],
      summary:
        "Constrained JSX vocabulary and compiler that lets language models render real UI — like HTML for AI agents. (This portfolio runs on it.)",
      href: "https://github.com/pelayomendez/generative-semantic-ui",
    },
  ],

  github: {
    profile: "https://github.com/pelayomendez",
    note:
      "Most active threads on GitHub right now: AI-generated UI (this site), narrative DSLs (ArticleLang), and intent-driven dev tooling (Honest DD).",
  },
} as const;

export type Portfolio = typeof portfolio;
