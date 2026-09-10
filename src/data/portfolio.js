// Single source of truth for all portfolio content.
// Image paths reference files served from /public/assets/images.

// Prefix with Vite's base URL so paths work under a subpath (GitHub Pages
// project sites) as well as at the root. BASE_URL always ends with '/'.
const BASE = import.meta.env.BASE_URL
// Bump ASSET_VERSION whenever an image is replaced under the same filename so
// browsers and GitHub Pages fetch the new file instead of a cached copy.
const ASSET_VERSION = 5
const img = (name) => `${BASE}assets/images/${name}?v=${ASSET_VERSION}`

import projectColors from './projectColors'

// Placeholder used whenever a project has no real screenshot of its own.
const NO_IMAGE = img('no_image.png')

export const RESUME_URL = `${BASE}resume/Ruel-Ybanez-Resume.pdf`

export const profile = {
  name: 'Ruel Ybañez',
  title: 'Web & Mobile Developer',
  phone: '+639617019129',
  email: 'ruel.ybanez18@gmail.com',
  location: 'Bantayan, Cebu, Philippines 6052',
  photo: img('profile.png'), // headshot (favicon + fallback)
  avatar: img('avatar.png'), // small face crop for the navbar and footer
  figure: img('hero-figure.png'), // full-body cutout for the hero
  yearsExperience: '7+',
  summary:
    'Results-driven Web and Mobile Developer with over 7 years of experience designing, developing, and maintaining scalable applications across web and mobile platforms. Experienced in building payment systems, automated fare collection systems, parking management solutions, and enterprise systems. Strong background in full-cycle development, system integration, and collaborative team environments.',
}

export const socials = {
  github: 'https://github.com/',
  gitlab: 'https://gitlab.com/',
}

export const stats = [
  { label: 'Years experience', value: '7+' },
  { label: 'Projects shipped', value: '20+' },
  { label: 'Companies', value: '3' },
  { label: 'Continents reached', value: '3' },
]

// "What do I help?" service cards.
export const services = [
  {
    title: 'Web Development',
    blurb: 'Dashboards, portals and enterprise systems built with React, Laravel and PHP.',
    count: 'React · Laravel · PHP',
    icon: 'Monitor',
    color: 'teal',
  },
  {
    title: 'Mobile Development',
    blurb: 'Cross-platform Flutter apps for payments, fare collection and field operations.',
    count: 'Flutter · Dart · RN',
    icon: 'Smartphone',
    color: 'yellow',
  },
  {
    title: 'Systems & Integration',
    blurb: 'Payment gateways, GPS tracking and REST APIs wired together end to end.',
    count: 'APIs · Payments · GPS',
    icon: 'Share2',
    color: 'coral',
  },
]

// Helper to normalize a project: fills cover/gallery defaults with no_image.
const project = (p) => ({
  coverContain: false,
  coverPosition: 'center', // 'top' crops tall phone screenshots from the top
  logoInvert: false, // true for black-on-transparent silhouettes (invisible on dark)
  tech: [],
  highlights: [],
  ...p,
  // First segment of the category: "Mobile · Fintech" → "Mobile". Drives the
  // quick filters on the projects reel.
  platform: (p.category ?? '').split('·')[0].trim() || 'Other',
  // True only when real screenshots exist. Without them the UI renders a
  // designed placeholder cover instead of the stock "no image" graphic.
  hasScreens: Array.isArray(p.gallery) && p.gallery.length > 0,
  // Theme colour (from scripts/project-colors.mjs, or set `color` explicitly).
  color:
    p.color ??
    (projectColors[p.id] && projectColors[p.id] !== '#000000' ? projectColors[p.id] : '#7C5CFF'),
  logo: p.logo ?? NO_IMAGE,
  cover: p.cover ?? (p.gallery ? p.gallery[0] : NO_IMAGE),
  gallery: p.gallery ?? [],
})

// Every project, grouped by employer. Projects with real screenshots use them;
// everything else falls back to no_image.png.
export const projectGroups = [
  {
    company: 'Clever Minds Digital Solutions Inc.',
    logo: img('cleverminds_logo.png'),
    period: '2022 — Present',
    items: [
      project({
        id: 'luvpark',
        name: 'LuvPark',
        tagline: 'Real-time parking reservation & monitoring',
        category: 'Mobile · Fintech',
        featured: true,
        logo: img('luvpark_logo.png'),
        gallery: [img('LPB1.jpg'), img('LPB2.jpg'), img('LPB3.jpg')],
        description:
          'Led development of LuvPark, a real-time parking reservation and monitoring platform that lets drivers find and reserve available parking spots, pay online, and gives city operators a live operational view.',
        highlights: [
          'Real-time spot availability and reservations',
          'Online payments with LuvPay integration',
          'Live monitoring dashboard for city operations',
        ],
        tech: ['Flutter', 'Dart', 'Firebase', 'Google Maps', 'REST API'],
      }),
      project({
        id: 'luvpark-ops',
        name: 'LuvPark Ops',
        tagline: 'Parking collection & operations console',
        category: 'Mobile · Operations',
        featured: true,
        logo: img('luvpark_logo.png'),
        gallery: [img('LPCB1.png'), img('LPCB2.png'), img('LPCB3.png')],
        description:
          'The operations companion for LuvPark (ParkSpace), used by collectors and city officials to track cash collection, monitor parking activity in real time, and process regular parking payments on site.',
        highlights: [
          'Real-time cash collection summary',
          'Live parking activity monitoring',
          'On-site regular parking payments',
        ],
        tech: ['Flutter', 'Dart', 'Firebase', 'REST API'],
      }),
      project({
        id: 'luvpark-pos',
        name: 'LuvPark POS',
        tagline: 'Parking POS terminal app for on-site collection',
        category: 'Mobile · Point of Sale',
        featured: true,
        logo: img('luvpark_logo.png'),
        gallery: [img('luvparkpos.png')],
        coverPosition: 'top',
        description:
          'Flutter point-of-sale app that runs on handheld Android POS terminals at LuvPark sites. Attendants check vehicles in, issue and settle parking tickets, print receipts and end-of-day readings on Bluetooth thermal printers, and keep working offline with a local SQLite store that syncs back to the server.',
        highlights: [
          'Check-in, exit and penalty ticketing with QR scanning',
          'Bluetooth ESC/POS receipt printing and X/Y/Z readings',
          'Offline-first SQLite storage with background sync',
          'Role-based dashboards for collectors, enforcers and inspectors',
        ],
        tech: ['Flutter', 'Dart', 'GetX', 'SQLite', 'Bluetooth ESC/POS', 'REST API'],
      }),
      project({
        id: 'luvpark-web-portal',
        name: 'LuvPark Web Portal',
        tagline: 'Parking operations console for POS sites',
        category: 'Web · Operations',
        featured: true,
        logo: img('luvpark_logo.png'),
        gallery: [img('web-panel.jpg')],
        description:
          'Operations console for the LuvPark POS network, rebuilt in React and TypeScript to replace the earlier Flutter Web portal. Managers monitor live occupancy and revenue per branch, manage terminals, partners, rates and in-app ads, and pull sales, ticket and reading reports as exportable PDFs.',
        highlights: [
          'Live dashboard: hourly occupancy, revenue and peak-hour insights',
          'Terminals, partners, rates and ad-placement management',
          'Sales, X/Z reading and e-journal reports with PDF export',
          'Executive view across granted regions and branches',
        ],
        tech: ['React', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'REST API'],
      }),
      project({
        id: 'luvpark-pay-maya',
        name: 'LuvPark Pay with Maya',
        tagline: 'Scan-to-pay parking checkout for guests',
        category: 'Web · Payments',
        featured: true,
        logo: img('maya_logo.png'),
        gallery: [img('pay-maya.png')],
        coverPosition: 'top',
        description:
          'Public web page at luvpark.ph where guests without the app pay for parking before they exit. They enter a plate number or scan the ticket QR printed at the entrance barrier, review the computed fee, pay through Maya checkout, and receive an exit QR plus a PDF invoice and emailed receipt.',
        highlights: [
          'Plate lookup or in-browser QR scanning of the entrance ticket',
          'Fee computation with VAT breakdown shown before checkout',
          'Maya checkout with the session preserved across the redirect',
          'Exit QR, PDF invoice and email receipt after payment',
        ],
        tech: ['React', 'TypeScript', 'Tailwind CSS', 'Maya Checkout', 'ZXing', 'jsPDF'],
      }),
      project({
        id: 'luvpay',
        name: 'LuvPay',
        tagline: 'Convenient digital payments for parking',
        category: 'Mobile · Payments',
        logo: img('cleverminds_logo.png'),
        description:
          'A payment app that minimizes the frustration of searching for parking and enhances the overall experience by increasing convenience and reducing wasted time and fuel.',
        highlights: [
          'Frictionless online parking payments',
          'Integrated with LuvPark reservations',
        ],
        tech: ['Flutter', 'Dart', 'Payments API'],
      }),
      project({
        id: 'luvfare',
        name: 'LuvFare',
        tagline: 'Automated fare collection for PUVs',
        category: 'Mobile · Transport',
        logo: img('cleverminds_logo.png'),
        description:
          'An Automated Fare Collection System (AFCS) for modern public utility vehicles, improving fare collection accuracy and convenience for operators and commuters.',
        highlights: [
          'Automated fare collection for modern PUVs',
          'Improves accuracy over manual collection',
        ],
        tech: ['Flutter', 'Dart', 'QR', 'REST API'],
      }),
      project({
        id: 'luvregistration',
        name: 'LuvRegistration',
        tagline: 'Employee onboarding for LuvFare',
        category: 'Mobile · Utility',
        logo: img('cleverminds_logo.png'),
        description:
          'A companion app used to register the employees who will operate and use LuvFare.',
        highlights: ['Registers LuvFare operators', 'Feeds the AFCS employee directory'],
        tech: ['Flutter', 'Dart', 'REST API'],
      }),
      project({
        id: 'towing',
        name: 'Towing',
        tagline: 'Job dispatch for tow-truck drivers',
        category: 'Mobile · Logistics',
        logo: img('car.png'),
        logoContain: true,
        logoInvert: true,
        description:
          'A mobile application that enables service providers (tow-truck drivers) to receive their job assignments from LuvPark, integrated with GPS and dispatch features supporting towing and transport operations.',
        highlights: [
          'Real-time job assignment for tow drivers',
          'Integrated GPS tracking & dispatch',
          'Connected to LuvPark operations',
        ],
        tech: ['Flutter', 'Dart', 'Google Maps', 'GPS', 'Firebase'],
      }),
      project({
        id: 'gps',
        name: 'GPS',
        tagline: 'Global Positioning System app',
        category: 'Mobile · Location',
        logo: img('motor.png'),
        logoContain: true,
        logoInvert: true,
        description:
          'A Global Positioning System (GPS) application supporting live location tracking for transport and dispatch operations.',
        highlights: ['Live location tracking', 'Supports transport & dispatch'],
        tech: ['Flutter', 'Dart', 'Google Maps', 'GPS'],
      }),
    ],
  },
  {
    company: 'ZettaSolutions Inc.',
    logo: img('zettasolutions_logo.png'),
    period: '2019 — 2022',
    items: [
      project({
        id: 'zfare',
        name: 'ZFare',
        tagline: 'Automated fare collection system (AFCS)',
        category: 'Mobile · Transport',
        logo: img('zfare_logo.png'),
        description:
          'An Automated Fare Collection System (AFCS) for modern public utility vehicles — the automated version of manual fare collection, with QR-driven ticketing and validation.',
        highlights: [
          'QR-based ticketing and fare validation',
          'Automated version of manual fare collection',
          'Deployed for modern public utility vehicles',
        ],
        tech: ['Flutter', 'Dart', 'QR', 'MySQL', 'REST API'],
      }),
      project({
        id: 'zpay',
        name: 'ZPay Wallet',
        tagline: 'QR-based digital wallet for fares',
        category: 'Mobile · Payments',
        featured: true,
        logo: img('zpay_logo.png'),
        gallery: [img('ZPB1.jpg'), img('ZPB2.jpg'), img('ZPB3.jpg')],
        description:
          'A QR-based payment wallet that lets commuters pay for fares quickly and securely — pay by QR over cash, powering the ZFare fare-collection flow and topped up via the ZLoad app.',
        highlights: [
          'Pay fares by QR — “QR over cash”',
          'Powers the ZFare collection flow',
          'Topped up via companion ZLoad app',
        ],
        tech: ['Flutter', 'Dart', 'QR', 'PHP', 'MySQL'],
      }),
      project({
        id: 'zload',
        name: 'ZLoad',
        tagline: 'Load credits into ZPay Wallet',
        category: 'Mobile · Payments',
        logo: img('zettasolutions_logo.png'),
        description:
          'A loading app used to top up credits into the ZPay Wallet, completing the ZettaSolutions transport payment ecosystem.',
        highlights: ['Loads credits to ZPay Wallet', 'Part of the ZPay/ZFare ecosystem'],
        tech: ['Flutter', 'Dart', 'PHP', 'MySQL'],
      }),
      project({
        id: 'crm',
        name: 'CRM',
        tagline: 'Customer relationship management',
        category: 'Web · Enterprise',
        logo: img('zettasolutions_logo.png'),
        description:
          'A system that helps companies stay connected to customers, streamline processes, and improve profitability.',
        highlights: [
          'Centralized customer relationships',
          'Streamlined sales & support processes',
        ],
        tech: ['PHP', 'MySQL', 'jQuery', 'Bootstrap'],
      }),
      project({
        id: 'hcm',
        name: 'HCM',
        tagline: 'Human capital management',
        category: 'Web · Enterprise',
        logo: img('zettasolutions_logo.png'),
        description:
          'A human capital management application used to store employee information and support HR functions such as benefits, payroll, recruiting, and training.',
        highlights: [
          'Employee records & HR functions',
          'Benefits, payroll, recruiting & training',
        ],
        tech: ['PHP', 'MySQL', 'jQuery', 'Bootstrap'],
      }),
      project({
        id: 'fmis',
        name: 'FMIS',
        tagline: 'Fleet management information system',
        category: 'Web · Fleet',
        logo: img('zettasolutions_logo.png'),
        description:
          'Tracks vehicle asset records, maintenance history, mileage and other fleet management details used extensively in the commercial fleet sector.',
        highlights: [
          'Vehicle asset & maintenance records',
          'Mileage and fleet analytics',
        ],
        tech: ['PHP', 'MySQL', 'JavaScript'],
      }),
      project({
        id: 'benchmarking',
        name: 'Benchmarking',
        tagline: 'Automotive parts benchmarking — Lear',
        category: 'Web · Data Analytics',
        featured: true,
        logo: img('benchmarking.png'),
        logoContain: true,
        gallery: [img('BMB1.png'), img('BMB2.png'), img('BMB3.png')],
        description:
          'An engineering tool for Lear Philippines used by teams in North America, Europe and Asia. Gathers electrical and mechanical parts across 50+ vehicles to compare by vehicle type, model year and parts — helping engineers produce higher quality at lower cost.',
        highlights: [
          'Compares 50+ vehicles by type, year & parts',
          'Supports cost & quality engineering decisions',
          'Used across North America, Europe & Asia',
        ],
        tech: ['AngularJS', 'Oracle PL/SQL', 'C#', 'amCharts'],
      }),
      project({
        id: 'trend-tool',
        name: 'Trend Tool',
        tagline: 'Dynamic trends on engineering data — Lear',
        category: 'Web · Data Analytics',
        featured: true,
        logo: img('lear_logo.png'),
        gallery: [img('TTB3.png'), img('TTB1.png')],
        description:
          'Creates dynamic criteria from the Benchmarking database and generates trends on electrical and mechanical parts (wires & cables) for Lear engineering teams across North America, Europe and Asia.',
        highlights: [
          'Dynamic criteria on benchmarking data',
          'Trend generation for electrical & mechanical parts',
          'Used by Lear teams across three continents',
        ],
        tech: ['AngularJS', 'Oracle PL/SQL', 'amCharts'],
      }),
      project({
        id: 'material-tracking',
        name: 'Material Tracking',
        tagline: 'Customer order tracking — Lear',
        category: 'Web · Logistics',
        logo: img('lear_logo.png'),
        logoContain: true,
        description:
          'A database that tracks customer orders and alerts the project team of upcoming orders that must be shipped to customers.',
        highlights: [
          'Tracks customer orders end-to-end',
          'Alerts team of upcoming shipments',
        ],
        tech: ['Oracle PL/SQL', 'C#', 'SQL'],
      }),
    ],
  },
  {
    company: 'Litecloud Corporation',
    logo: img('litecloud_logo.png'),
    period: '2017 — 2019',
    items: [
      project({
        id: 'cfund',
        name: 'CFUND',
        tagline: 'Fund accounting for non-profits',
        category: 'Web · Accounting',
        logo: img('litecloud_logo.png'),
        logoContain: true,
        description:
          'An accounting system used by non-profit entities to track the amount of cash assigned to different purposes and the usage of that cash.',
        highlights: [
          'Fund accounting for non-profit entities',
          'Tracks cash allocation & usage',
        ],
        tech: ['PHP', 'Laravel', 'MySQL', 'jQuery'],
      }),
      project({
        id: 'pemasys',
        name: 'PEMASYS',
        tagline: 'Payroll, tax & timekeeping',
        category: 'Web · Payroll',
        logo: img('litecloud_logo.png'),
        logoContain: true,
        description:
          'A system that calculates employee salaries and taxes, tracks hours worked, and issues payments through direct deposit or check.',
        highlights: [
          'Salary & tax computation',
          'Time tracking and payment issuance',
        ],
        tech: ['PHP', 'Laravel', 'MySQL'],
      }),
      project({
        id: 'buildyx',
        name: 'BUILDYX',
        tagline: 'Team & task management',
        category: 'Web · Productivity',
        logo: img('litecloud_logo.png'),
        logoContain: true,
        description:
          'A system that builds and manages a team to accomplish tasks, coordinating assignments and progress.',
        highlights: ['Builds & manages teams', 'Coordinates tasks and progress'],
        tech: ['PHP', 'MySQL', 'jQuery', 'Bootstrap'],
      }),
    ],
  },
  {
    company: 'Freelance & Thesis',
    period: 'Selected',
    items: [
      project({
        id: 'constructtrack',
        name: 'ConstructTrack',
        tagline: 'Construction site monitoring for crews and admins',
        category: 'Mobile · Construction',
        color: '#F2B233', // hard-hat amber from the logo
        featured: true,
        logo: img('constructtrack_logo.png'),
        gallery: [img('constructtrack1.png'), img('constructtrack2.png')],
        coverPosition: 'top',
        description:
          'Flutter app for monitoring construction projects across five roles: super admin, admin, engineer, foreman and warehouseman. Crews time in and out with GPS that resolves the project from the site radius, file site reports with geotagged photos, and request materials, while managers follow overall progress, approvals, budgets and warehouse stock from role-specific dashboards. Backed by a PHP and MySQL API with push notifications and an in-app AI assistant.',
        highlights: [
          'Role-based dashboards for admins, engineers, foremen and warehouse staff',
          'GPS attendance that resolves the project from the site radius',
          'Site reports with geotagged photos, linked task progress and discussion',
          'Material requests, approvals, low-stock alerts and A4 PDF reports',
        ],
        tech: ['Flutter', 'Dart', 'Riverpod', 'Hive', 'Firebase', 'PHP', 'MySQL'],
      }),
      project({
        id: 'hsm',
        name: 'Health Services Mgmt',
        tagline: 'Barangay info system with analytics',
        category: 'Mobile · Healthcare',
        featured: true,
        logo: img('hsm_logo.png'),
        gallery: [img('HSMB1.png'), img('HSMB2.png'), img('HSMB3.png')],
        description:
          'Health Services Management (HSM) — a barangay information system with data analytics, helping local health workers manage records and surface community health insights through interactive dashboards.',
        highlights: [
          'Barangay-level health records management',
          'Data analytics & reporting dashboards',
          'Mobile-first for field health workers',
        ],
        tech: ['Flutter', 'Dart', 'Firebase', 'amCharts'],
      }),
      project({
        id: 'patient-assistance',
        name: 'Patient Assistance',
        tagline: 'Patient management for clinicians',
        category: 'Mobile · Healthcare',
        logo: img('patients_assistance_logo.png'),
        logoContain: true,
        description:
          'A mobile application that allows doctors and nurses to manage their patients — records, visits and follow-ups.',
        highlights: ['Clinician-facing patient management', 'Records, visits & follow-ups'],
        tech: ['Flutter', 'Dart', 'Firebase'],
      }),
      project({
        id: 'ems',
        name: 'Event Management System',
        tagline: 'Manage events & attendees',
        category: 'Web · Events',
        logo: img('ems_logo.png'),
        logoContain: true,
        description:
          'An Event Management System (EMS) that manages events and their attendees end-to-end.',
        highlights: ['Event scheduling & attendee tracking', 'End-to-end event management'],
        tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
      }),
    ],
  },
]

// Flat list (used for counts and the modal lookup).
export const projects = projectGroups.flatMap((g) =>
  g.items.map((p) => ({
    ...p,
    company: g.company,
    companyPeriod: g.period,
    companyLogo: g.logo ?? null,
  })),
)

export const experience = [
  {
    company: 'Clever Minds Digital Solutions Inc.',
    role: 'Web & Mobile Developer',
    period: '2022 – Present',
    location: 'Bacolod City, Philippines',
    current: true,
    points: [
      'Developed mobile applications for parking management, POS, AFCS, GPS tracking, and digital payments.',
      'Led development of LuvPark, a real-time parking reservation and monitoring system.',
      'Built LuvFare and LuvPay to improve fare collection accuracy and user convenience.',
      'Integrated GPS and dispatch features for towing and transport operations.',
    ],
  },
  {
    company: 'ZettaSolutions Inc.',
    role: 'Web & Mobile Developer',
    period: '2019 – 2022',
    location: 'Mandaue City, Philippines',
    points: [
      'Built web and mobile systems for transportation, fintech, and enterprise use.',
      'Developed QR-based payment wallet and AFCS solutions.',
      'Created engineering tools used by teams in North America, Europe, and Asia.',
      'Worked with CRM, HCM, and fleet management systems.',
    ],
  },
  {
    company: 'Litecloud Corporation',
    role: 'Web Developer Intern',
    period: '2017 – 2019',
    location: 'Cebu City, Philippines',
    points: [
      'Developed and supported accounting, payroll, and task management web systems.',
      'Assisted in building applications for non-profit and enterprise use.',
    ],
  },
]

// Skill logos live in /public/assets/icons (devicon and Simple Icons SVGs).
// `core` marks the skills shown in the collapsed "All" view of the skills grid;
// a null icon renders an initials tile instead.
const ico = (name) => `${BASE}assets/icons/${name}.svg`
const skill = (name, category, icon, core = false) => ({
  name,
  category,
  core,
  icon: icon ? ico(icon) : null,
})

export const skillCategories = [
  { key: 'languages', label: 'Languages' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'backend', label: 'Backend' },
  { key: 'databases', label: 'Databases' },
  { key: 'tools', label: 'Tools' },
]

export const skills = [
  // Languages
  skill('JavaScript', 'languages', 'javascript', true),
  skill('TypeScript', 'languages', 'typescript', true),
  skill('PHP', 'languages', 'php', true),
  skill('Java', 'languages', 'java', true),
  skill('C#', 'languages', 'csharp', true),
  skill('C++', 'languages', 'cplusplus', true),
  skill('Python', 'languages', 'python', true),
  skill('Dart', 'languages', 'dart', true),
  // Frontend
  skill('React', 'frontend', 'react', true),
  skill('Next.js', 'frontend', 'nextjs', true),
  skill('AngularJS', 'frontend', 'angularjs'),
  skill('HTML', 'frontend', 'html5', true),
  skill('CSS', 'frontend', 'css3', true),
  skill('Tailwind CSS', 'frontend', 'tailwindcss', true),
  skill('Bootstrap', 'frontend', 'bootstrap'),
  skill('jQuery', 'frontend', 'jquery'),
  skill('Three.js', 'frontend', 'threejs'),
  skill('amCharts', 'frontend', null),
  // Mobile
  skill('Flutter', 'mobile', 'flutter', true),
  skill('React Native', 'mobile', 'react', true),
  skill('Cordova', 'mobile', 'cordova'),
  // Backend
  skill('Node.js', 'backend', 'nodejs', true),
  skill('Express.js', 'backend', 'express', true),
  skill('Laravel', 'backend', 'laravel', true),
  skill('FastAPI', 'backend', 'fastapi', true),
  // Databases & data
  skill('MySQL', 'databases', 'mysql', true),
  skill('PostgreSQL', 'databases', 'postgresql', true),
  skill('Oracle PL/SQL', 'databases', 'oracle'),
  skill('MS SQL Server', 'databases', 'microsoftsqlserver'),
  skill('MongoDB', 'databases', 'mongodb', true),
  skill('SQLite', 'databases', 'sqlite'),
  skill('Supabase', 'databases', 'supabase', true),
  skill('Firebase', 'databases', 'firebase', true),
  skill('JSON', 'databases', 'json'),
  skill('XML', 'databases', 'xml'),
  // Tools
  skill('Git', 'tools', 'git', true),
  skill('GitHub', 'tools', 'github', true),
  skill('GitLab', 'tools', 'gitlab'),
  skill('Docker', 'tools', 'docker', true),
  skill('Postman', 'tools', 'postman', true),
  skill('Vercel', 'tools', 'vercel', true),
  skill('Railway', 'tools', 'railway'),
  skill('Figma', 'tools', 'figma', true),
  skill('Jira', 'tools', 'jira'),
  skill('Trello', 'tools', 'trello'),
  skill('XAMPP', 'tools', 'xampp'),
  skill('FileZilla', 'tools', 'filezilla'),
  skill('TortoiseSVN', 'tools', 'subversion'),
  skill('OneSignal', 'tools', null),
  skill('cPanel', 'tools', 'cpanel'),
  skill('Canva', 'tools', 'canva'),
  skill('VS Code', 'tools', 'vscode'),
  skill('Visual Studio', 'tools', 'visualstudio'),
  skill('Android Studio', 'tools', 'androidstudio'),
  skill('Xcode', 'tools', 'xcode'),
  skill('Eclipse', 'tools', 'eclipse'),
  skill('Sublime Text', 'tools', 'sublimetext'),
  skill('Notepad++', 'tools', 'notepadplusplus'),
  skill('Photoshop', 'tools', 'photoshop'),
  skill('Photopea', 'tools', 'photopea'),
  skill('CapCut', 'tools', null), // no public logo in the icon sets → initials tile
]

// AI development tools & assistants used in recent work. Icons live in
// /public/assets/icons; a null icon renders an initials tile.
const ai = (name, vendor, icon) => ({ name, vendor, icon: icon ? ico(icon) : null })
export const aiTools = [
  ai('Claude Code', 'Anthropic', 'anthropic'),
  ai('Claude', 'Anthropic', 'claude'),
  ai('ChatGPT', 'OpenAI', 'openai'),
  ai('Codex', 'OpenAI', 'openai'),
  ai('Gemini', 'Google', 'googlegemini'),
  ai('Antigravity', 'Google', 'google'),
  ai('Stitch', 'Google', 'google'),
  ai('DeepSeek', 'DeepSeek', 'deepseek'),
  ai('Hermes', 'Nous Research', null),
  ai('GitHub Copilot', 'GitHub', 'githubcopilot'),
  ai('Cursor', 'Anysphere', 'cursor'),
  ai('Windsurf', 'Codeium', 'windsurf'),
]

export const education = [
  {
    school: 'CITE Technical Institute Inc.',
    program: 'Computer Engineering Technology',
    detail: 'Undergraduate — 2019',
    location: 'Cebu City, Philippines',
  },
  {
    school: 'San Agustin National High School',
    program: 'Secondary Education',
    detail: 'Completed 2016',
    location: 'Madridejos, Philippines',
  },
  {
    school: 'Tamiao Integrated School',
    program: 'Primary Education',
    detail: 'Completed 2008',
    location: 'Bantayan, Philippines',
  },
]

export const awards = [
  { title: 'Batch Salutatorian', org: 'San Agustin NHS', year: 'Apr 2016' },
  { title: 'Best in Economics', org: 'San Agustin NHS', year: 'Apr 2016' },
  { title: 'Leadership Award', org: 'San Agustin NHS', year: 'Apr 2016' },
  { title: 'Math Quiz Bowl Champion', org: 'CITE Technical Institute', year: 'Oct 2016' },
  { title: 'Punctuality Award', org: 'CMDS Inc.', year: 'Dec 2023' },
]

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]
