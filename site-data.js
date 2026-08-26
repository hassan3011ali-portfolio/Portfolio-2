// =========================================================
// HASSAN PORTFOLIO — Shared Site Data Layer
// Single source of truth for editable content. Read by every
// public page (site-render.js) and written by the Admin Panel
// (admin.js). Persisted in localStorage under STORAGE_KEY, so
// changes made in the Admin Panel appear the next time any page
// on this site is loaded in THIS browser.
// =========================================================

const STORAGE_KEY = 'hassanSiteData_v4';

/* ---------------------------------------------------------
   THEME DEFINITIONS
   Each theme redefines the core CSS custom properties used
   throughout style.css. Variable names stay the same
   (e.g. --orange) across themes so every component that
   already references var(--orange) repaints automatically —
   only the color values change.
--------------------------------------------------------- */
const THEMES = {
  'charcoal-orange': {
    label: 'Charcoal Orange',
    swatch: ['#0B0D10', '#FF7A29', '#2EC5FF'],
    vars: {
      '--bg-primary': '#0B0D10', '--bg-secondary': '#14171C', '--bg-tertiary': '#1B1F26', '--bg-elevated': '#1F242C',
      '--orange': '#FF7A29', '--orange-soft': '#FFA35C', '--orange-glow': 'rgba(255, 122, 41, 0.45)',
      '--blue': '#2EC5FF', '--blue-soft': '#7FDBFF', '--blue-glow': 'rgba(46, 197, 255, 0.40)',
      '--text-primary': '#F2F4F7', '--text-secondary': '#C4CAD3', '--text-muted': '#838B99',
      '--border': 'rgba(255,255,255,0.08)', '--border-strong': 'rgba(255,255,255,0.14)', '--grid-line': 'rgba(255,255,255,0.035)'
    }
  },
  'midnight-blue': {
    label: 'Midnight Blue',
    swatch: ['#0A0E1C', '#5B8DEF', '#29E0C9'],
    vars: {
      '--bg-primary': '#0A0E1C', '--bg-secondary': '#131B2E', '--bg-tertiary': '#1A2439', '--bg-elevated': '#1F2B45',
      '--orange': '#5B8DEF', '--orange-soft': '#8FB1F5', '--orange-glow': 'rgba(91, 141, 239, 0.45)',
      '--blue': '#29E0C9', '--blue-soft': '#7CF0E1', '--blue-glow': 'rgba(41, 224, 201, 0.40)',
      '--text-primary': '#F1F4FA', '--text-secondary': '#C2CBE0', '--text-muted': '#7C87A6',
      '--border': 'rgba(255,255,255,0.08)', '--border-strong': 'rgba(255,255,255,0.15)', '--grid-line': 'rgba(255,255,255,0.035)'
    }
  },
  'slate-purple': {
    label: 'Slate Purple',
    swatch: ['#120F1A', '#A855F7', '#38BDF8'],
    vars: {
      '--bg-primary': '#120F1A', '--bg-secondary': '#1C1730', '--bg-tertiary': '#251E3D', '--bg-elevated': '#2B2347',
      '--orange': '#A855F7', '--orange-soft': '#C58BFB', '--orange-glow': 'rgba(168, 85, 247, 0.45)',
      '--blue': '#38BDF8', '--blue-soft': '#87D8FC', '--blue-glow': 'rgba(56, 189, 248, 0.40)',
      '--text-primary': '#F3F1FA', '--text-secondary': '#CBC4DE', '--text-muted': '#8A82A3',
      '--border': 'rgba(255,255,255,0.08)', '--border-strong': 'rgba(255,255,255,0.15)', '--grid-line': 'rgba(255,255,255,0.035)'
    }
  },
  'emerald-dark': {
    label: 'Emerald Dark',
    swatch: ['#0A1410', '#10B981', '#F5B942'],
    vars: {
      '--bg-primary': '#0A1410', '--bg-secondary': '#10231B', '--bg-tertiary': '#153024', '--bg-elevated': '#1A392C',
      '--orange': '#10B981', '--orange-soft': '#5EDCA9', '--orange-glow': 'rgba(16, 185, 129, 0.45)',
      '--blue': '#F5B942', '--blue-soft': '#FBD478', '--blue-glow': 'rgba(245, 185, 66, 0.40)',
      '--text-primary': '#EFF7F2', '--text-secondary': '#C0D3C7', '--text-muted': '#7C9488',
      '--border': 'rgba(255,255,255,0.08)', '--border-strong': 'rgba(255,255,255,0.15)', '--grid-line': 'rgba(255,255,255,0.035)'
    }
  }
};

const ICONS = {
  grid: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
  mic: '<path d="M12 19v3M8 22h8"/><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a1 1 0 0 0-1 1c0 2.5 1.5 4.5 4 5M17 5h3a1 1 0 0 1 1 1c0 2.5-1.5 4.5-4 5"/>',
  handshake: '<path d="M8.5 14.5 3 20M15.5 14.5 21 20"/><path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>',
  archive: '<path d="M4 19.5V6a2 2 0 0 1 2-2h13v15.5"/><path d="M6 22a2 2 0 0 1-2-2.5C4 18.5 5 18 6 18h13"/><path d="M9 7h7M9 10.5h7"/>',
  star: '<path d="m12 2 2.9 6.9 7.1.6-5.5 4.6 1.7 7-6.2-4-6.2 4 1.7-7L2 9.5l7.1-.6L12 2Z"/>',
  design: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  audio: '<path d="M2 12h3l2-7 4 14 3-10 2 5h6"/>'
};

const CATEGORY_LABELS = {
  'data-entry': 'Data Entry & Excel',
  'document': 'Document Conversion & Transcription',
  'research': 'Research & Specialized Projects',
  'design': 'Design & Creative Projects'
};

/* ---------------------------------------------------------
   DEFAULT CONTENT — mirrors what shipped in the static build.
   The Admin Panel edits copies of this; nothing here is
   mutated directly.
--------------------------------------------------------- */
function defaultData() {
  return {
    theme: 'charcoal-orange',
    credentials: { username: 'admin', password: 'Admin@123' },

    site: { name: 'Hassan' },

    home: {
      heroRole: 'Virtual Assistant & Data Entry Specialist',
      heroTagline: 'Turning scattered data into organized results, on time, every time.',
      stats: [
        { value: '800+', label: 'Projects completed' },
        { value: '6+', label: 'Years of experience' },
        { value: '2', label: 'Fiverr Seller Level' },
        { value: '5.0', label: 'Average client rating' }
      ],
      ctaHeading: 'Ready to get your data organized?',
      ctaText: "Tell me what you're working with — I'll reply with a clear plan and timeline, usually within a few hours."
    },

    about: {
      heroTitle: 'From small tasks to 800+ projects.',
      heroSubtitle: 'The short version of how a few local data entry jobs turned into a full-time specialty.',
      storyIntro: 'I started freelancing over 6 years ago, doing small data entry tasks to help local businesses get organized.',
      storyBody: 'Over time I built up deep expertise across data entry, Excel management, transcription, document conversion, and virtual assistance — and turned it into a full-time career supporting businesses, entrepreneurs, and professionals around the world.',
      missionQuote: "I don't just complete tasks. I bring accuracy, structure, and reliability to messy, disorganized work so my clients can trust the data and focus on growing their business.",
      storyClose: "What makes me different is the standard I hold my own work to — every spreadsheet, transcript, and document is treated like it needs to be handed straight to a client's boss, investor, or customer, with nothing to double-check. My mission is simple: give clients back their time by handling the administrative details with precision, so they never have to double-check my work."
    },

    servicesPage: {
      heroTitle: 'Clear services, honest pricing.',
      heroSubtitle: 'Six ways I help businesses stay organized — each with transparent starting rates and no surprises.'
    },

    portfolioPage: {
      heroTitle: 'A closer look at 800+ projects.',
      heroSubtitle: 'Real work across data entry, document conversion, transcription, and research — organized the way I organize everything else.'
    },

    awardsPage: {
      heroTitle: 'Recognition earned project by project.',
      heroSubtitle: "A few milestones that reflect the trust clients have placed in the work — not awards for their own sake, but proof of consistency."
    },

    contact: {
      heroTitle: "Let's get your data organized.",
      heroSubtitle: "Reach out for data entry, virtual assistance, transcription, or document conversion projects — I'll reply within a few hours.",
      email: 'hassan3011ali@gmail.com',
      whatsappText: 'Available on request — just ask via the form',
      responseTime: 'Usually within a few hours',
      fiverrUrl: 'https://www.fiverr.com/hassan_30?public_mode=true',
      linkedinUrl: 'https://www.linkedin.com/in/hassan-ali-785b611b7/'
    },

    images: {
      profilePhoto: null // null = use bundled placeholder headshot
    },

    services: [
      { id: 's1', icon: 'grid', title: 'Data Entry & Excel Management', description: 'Accurate data entry, data cleaning, CRM data entry, and organized Excel spreadsheets built to stay accurate as they grow.', price: '10', unit: '/ hour' },
      { id: 's2', icon: 'doc', title: 'Document & PDF Conversion', description: 'Converting PDFs, scanned documents, and images into clean, editable Word or Excel files with formatting preserved.', price: '5', unit: '/ project' },
      { id: 's3', icon: 'user', title: 'Virtual Assistant Services', description: 'Ongoing admin support including web research, data collection, email management, and CRM upkeep.', price: '8', unit: '/ hour' },
      { id: 's4', icon: 'mic', title: 'Transcription Services', description: 'Accurate audio, video, and podcast transcription with optional timestamps and speaker labeling.', price: '1', unit: '/ audio minute' },
      { id: 's5', icon: 'search', title: 'Web Research & Lead Generation', description: 'Building verified contact databases and lead lists from targeted online research, ready for outreach.', price: '15', unit: '/ project' },
      { id: 's6', icon: 'layers', title: 'Business & Brand Naming', description: 'Creative, research-backed name suggestions for businesses, products, and brands, with availability checks.', price: '20', unit: '/ package' },
      { id: 's7', icon: 'design', title: 'Logo, Flyer & Graphic Design', description: 'Creative design work including logos, flyers, brochures, social media posts, book covers, and resumes — professional visuals tailored to your brand.', price: '15', unit: '/ project' },
      { id: 's8', icon: 'audio', title: 'Audio Editing', description: 'Background noise removal, audio enhancement, audio cleaning, and cutting/trimming — clean, polished audio ready to use.', price: '5', unit: '/ audio file' }
    ],

    achievements: [
      { id: 'a1', icon: 'trophy', title: 'Level 2 Seller Status', org: 'Fiverr', duration: 'Ongoing status', description: "Awarded by Fiverr in recognition of consistent high-quality delivery across 800+ completed projects and strong client satisfaction. It's a standing I've maintained, not a one-time badge — earned through repeat on-time delivery and low revision rates." },
      { id: 'a2', icon: 'handshake', title: 'Trusted Long-Term Partner', org: '4 Childcare Centers, New York', duration: '5 years & ongoing', description: 'A 5-year and ongoing engagement managing daily attendance and meal-tracking data across CCTA, KidKare, Roster Sheets, and CapsOnline for 4 childcare centers. It reflects the reliability clients depend on for recurring, sensitive administrative work where accuracy directly affects compliance and billing.' },
      { id: 'a3', icon: 'archive', title: 'Historical Archive Digitization', org: 'UK Punjab Heritage Association', duration: 'Special project', description: "Selected to manually digitize WWI soldiers' handwritten register records into structured Excel data for the association's website, punjabww1.com — helping preserve historical records and make them accessible to the public and researchers." }
    ],

    projects: [
      { id: 'p1', category: 'data-entry', title: 'WWI Soldier Records Digitization', shortDesc: 'Converted handwritten WWI register files into structured Excel data for punjabww1.com.', fullDesc: "Manually converted historical handwritten register files containing WWI soldiers' data into structured, searchable Excel spreadsheets for the UK Punjab Heritage Association's website, punjabww1.com. The work involved carefully transcribing faded and inconsistent handwriting into clean, standardized fields ready for publication and archival use.", image: null },
      { id: 'p2', category: 'data-entry', title: 'Childcare Center Attendance & Meal Tracking', shortDesc: '5-year ongoing data entry across CCTA, KidKare, Roster Sheets & CapsOnline for 4 NY daycare centers.', fullDesc: 'An ongoing 5-year engagement managing daily attendance and meal-tracking data entry across CCTA, KidKare, Roster Sheets, and CapsOnline systems for 4 daycare centers in New York. Requires consistent daily accuracy across multiple platforms to keep compliance and billing records current.', image: null },
      { id: 'p3', category: 'data-entry', title: 'E-Commerce Inventory Spreadsheet System', shortDesc: 'Rebuilt a 500+ SKU spreadsheet with formulas, validation, and a live stock dashboard.', fullDesc: 'Rebuilt a disorganized 500+ SKU inventory spreadsheet into a structured system with validation rules, reorder formulas, and a live summary dashboard, giving the client daily visibility into stock levels across categories.', image: null },
      { id: 'p4', category: 'document', title: 'Scanned Contract Bundle → Editable Word', shortDesc: '120-page scanned PDF converted to editable Word with full formatting preserved.', fullDesc: "Converted a 120-page scanned PDF contract bundle into a fully editable Word document, rebuilding tables, clause numbering, and formatting to match the original layout exactly, so the client's legal team could redline directly.", image: null },
      { id: 'p5', category: 'document', title: 'Podcast Episode Transcription Series', shortDesc: 'Time-stamped, speaker-labeled transcripts delivered for a 40-episode back catalog.', fullDesc: 'Delivered accurate, time-stamped transcripts for a 40-episode podcast back catalog, formatted for both accessibility captions and repurposed blog content, with consistent speaker labeling throughout.', image: null },
      { id: 'p6', category: 'document', title: 'Scanned Intake Forms → Fillable PDF', shortDesc: 'Paper intake forms rebuilt as fillable, auto-calculating PDF documents.', fullDesc: "Rebuilt a stack of paper client-intake forms as fillable, auto-calculating PDF documents with logical tab order and validation, cutting the client's manual data-entry time significantly.", image: null },
      { id: 'p7', category: 'research', title: 'CRM Data Management', shortDesc: 'Organized and maintained client records inside Salesforce for an ongoing client.', fullDesc: 'Organized and maintained client records inside Salesforce for an ongoing client, standardizing contact fields, deduplicating entries, and keeping pipeline data accurate and current for the sales team.', image: null },
      { id: 'p8', category: 'research', title: 'Social Media Account Management', shortDesc: "Managed day-to-day content and posting for a client's Instagram account.", fullDesc: "Managed day-to-day content planning and posting for a client's Instagram account, keeping a consistent posting schedule and brand voice across weekly content.", image: null },
      { id: 'p9', category: 'research', title: 'B2B Lead List Research', shortDesc: 'Verified 1,000+ B2B decision-maker contacts across six target industries.', fullDesc: 'Built a verified list of 1,000+ B2B decision-maker contacts across six target industries, cross-checking company data and role titles for outreach accuracy before handoff to the sales team.', image: null },
      { id: 'p10', category: 'research', title: 'Business Naming Package', shortDesc: 'A shortlist of distinctive, research-backed name options for a new product launch.', fullDesc: 'Delivered a shortlist of distinctive, research-backed name options for a new product launch, including availability checks and a short rationale for each direction.', image: null },
      { id: 'p11', category: 'design', title: 'Brand Logo & Flyer Design Package', shortDesc: 'Designed a complete logo and promotional flyer set for a small business launch.', fullDesc: 'Created a full starter brand identity package for a small business launch — a custom logo in multiple formats, a promotional flyer, and matching social media graphics, delivered print-ready and in editable source files.', image: null },
      { id: 'p12', category: 'design', title: 'Podcast Audio Cleanup & Enhancement', shortDesc: "Removed background noise and enhanced audio quality across a client's podcast episodes.", fullDesc: "Cleaned up raw podcast recordings by removing background noise, balancing volume levels, and trimming dead air, delivering polished, ready-to-publish audio files for a client's weekly podcast.", image: 'thumb-audio.svg' }
    ]
  };
}

/* ---------------------------------------------------------
   STORAGE HELPERS
--------------------------------------------------------- */
function getSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const saved = JSON.parse(raw);
    // shallow-merge with defaults so newly added default fields
    // never go missing if a person is running an older saved copy
    const base = defaultData();
    return Object.assign({}, base, saved, {
      credentials: Object.assign({}, base.credentials, saved.credentials),
      site: Object.assign({}, base.site, saved.site),
      home: Object.assign({}, base.home, saved.home),
      about: Object.assign({}, base.about, saved.about),
      servicesPage: Object.assign({}, base.servicesPage, saved.servicesPage),
      portfolioPage: Object.assign({}, base.portfolioPage, saved.portfolioPage),
      awardsPage: Object.assign({}, base.awardsPage, saved.awardsPage),
      contact: Object.assign({}, base.contact, saved.contact),
      images: Object.assign({}, base.images, saved.images),
      services: saved.services || base.services,
      achievements: saved.achievements || base.achievements,
      projects: saved.projects || base.projects
    });
  } catch (e) {
    console.error('Site data read failed, using defaults', e);
    return defaultData();
  }
}

function saveSiteData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetSiteData() {
  localStorage.removeItem(STORAGE_KEY);
}

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

/* ---------------------------------------------------------
   THEME APPLICATION — used by both public pages and the
   admin panel's live theme switcher.
--------------------------------------------------------- */
function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES['charcoal-orange'];
  let styleTag = document.getElementById('theme-override');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'theme-override';
    document.head.appendChild(styleTag);
  }
  const rules = Object.entries(theme.vars).map(([k, v]) => `${k}: ${v};`).join(' ');
  styleTag.textContent = `:root { ${rules} }`;
}
