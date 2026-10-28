// Content for the /work page.
//
// Clients are deliberately anonymised: describe who they are, never name them.
// Product names stay; client names, client domains and outbound links do not.
//
// IMPORTANT: every number in `metrics`, `timeline` and `HERO_STATS` is a
// placeholder estimate. Confirm each one against real client data before
// this page goes live.

export type Status = "Live" | "In development" | "Prototype";
export type Device = "browser" | "tablet" | "phone";

export type Metric = {
  /** Numeric value animated with a count-up. Omit and use `display` for non-numeric values. */
  value?: number;
  display?: string;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Phase = { label: string; detail: string; days: number; duration: string };

export type Project = {
  id: string;
  name: string;
  client: string;
  kind: string;
  status: Status;
  device: Device;
  layout: "feature" | "compact";
  headline: string;
  summary: string;
  before: { title: string; tools: string[]; pains: string[] };
  after: { title: string; wins: string[] };
  built: string[];
  timeline: Phase[];
  shipped: string;
  metricsLabel: string;
  metrics: Metric[];
  stack: string[];
};

export type Client = { id: string; label: string; who: string; about: string; projects: Project[] };

export const HERO_STATS: Metric[] = [
  { value: 7, label: "Products designed and built" },
  { value: 4, label: "Live in production today" },
  { value: 4, suffix: " wks", label: "Average brief to live" },
  { value: 20, suffix: "+", label: "Spreadsheets, chats and docs retired" },
];

export const CLIENTS: Client[] = [
  {
    id: "agency",
    label: "Client 01",
    who: "A top football agency",
    about:
      "A leading agency specialising in professional goalkeepers: representation, player mentoring and scouting. Five products, one team, everything running off the same data.",
    projects: [
      {
        id: "mentor-hub",
        name: "Mentor Hub",
        client: "Football agency",
        kind: "Operations platform",
        status: "Live",
        device: "browser",
        layout: "feature",
        headline: "The whole mentor team, finally on one screen.",
        summary:
          "A production platform for the agency's mentor team. Every goalkeeper, every match report, every check-in and every duty-of-care flag, in one place with the right access for mentors, managers and admins. Live since August 2026.",
        before: {
          title: "Before",
          tools: [
            "WhatsApp groups",
            "Match reports in Word",
            "Duty-of-care spreadsheet",
            "Personal notebooks",
            "Email chains",
            "Shared drive folders",
          ],
          pains: [
            "No single view of a keeper's season",
            "Reports emailed around and lost",
            "Welfare checks easy to miss",
          ],
        },
        after: {
          title: "After",
          wins: [
            "One roster with every keeper's full history",
            "Match reports scored on the agency's seven pillars",
            "Duty-of-care status visible at a glance",
            "Calendar, media library and bulletin boards built in",
            "Role-based access for mentors, managers and admins",
          ],
        },
        built: [
          "Ran discovery sessions with mentors and management",
          "Turned the seven-pillar framework into a scoring model",
          "Clickable prototype in week one, iterated with the team",
          "Built, migrated the roster and trained the mentors",
        ],
        timeline: [
          { label: "Discover", detail: "Workshops and process mapping", days: 3, duration: "3 days" },
          { label: "Prototype", detail: "Clickable, tested with mentors", days: 5, duration: "1 week" },
          { label: "Build", detail: "Production app, roles, data", days: 15, duration: "3 weeks" },
          { label: "Launch", detail: "Migration and training", days: 2, duration: "2 days" },
        ],
        shipped: "Brief to live in 5 weeks",
        metricsLabel: "Impact",
        metrics: [
          { value: 70, suffix: "%", label: "Faster to write and file a match report" },
          { display: "6 → 1", label: "Tools replaced by one platform" },
          { value: 8, suffix: " hrs", label: "Admin saved per mentor, every month" },
          { value: 100, suffix: "%", label: "Keepers with live duty-of-care status" },
        ],
        stack: ["React", "TanStack Start", "Supabase", "Vercel"],
      },
      {
        id: "scouting-hub",
        name: "Scouting Hub",
        client: "Football agency",
        kind: "Scouting intelligence",
        status: "Live",
        device: "browser",
        layout: "feature",
        headline: "What one scout learns, every scout can build on.",
        summary:
          "A goalkeeper scouting and recruitment platform. Profiles, assessments and match reports live in one shared intelligence database, so knowledge stops walking out of the door with whoever watched the game.",
        before: {
          title: "Before",
          tools: [
            "Scouts' own laptops",
            "Notes apps",
            "Spreadsheet shortlists",
            "Video links in DMs",
            "Phone calls",
          ],
          pains: [
            "The same keeper scouted twice",
            "Knowledge lost when a scout moved on",
            "Shortlists out of date the day they were sent",
          ],
        },
        after: {
          title: "After",
          wins: [
            "One shared database of keeper profiles",
            "Structured assessments everyone scores the same way",
            "Match reports linked to every profile",
            "Search and filter a shortlist in seconds",
          ],
        },
        built: [
          "Mapped how the scouts actually assess a keeper",
          "Designed one assessment format for the whole team",
          "Built search, shortlists and profile history",
          "Imported existing notes so nothing started from zero",
        ],
        timeline: [
          { label: "Discover", detail: "Shadowed the scouting process", days: 2, duration: "2 days" },
          { label: "Prototype", detail: "Profile and assessment flows", days: 4, duration: "4 days" },
          { label: "Build", detail: "Database, search, reports", days: 12, duration: "2.5 weeks" },
          { label: "Launch", detail: "Data import and onboarding", days: 2, duration: "2 days" },
        ],
        shipped: "Brief to live in 4 weeks",
        metricsLabel: "Impact",
        metrics: [
          { value: 3, suffix: "×", label: "More keepers tracked across the network" },
          { value: 60, suffix: "%", label: "Fewer duplicate scouting trips" },
          { display: "Hours → secs", label: "To pull together a shortlist" },
          { value: 100, suffix: "%", label: "Of scouting history owned by the agency" },
        ],
        stack: ["React", "TanStack Start", "Supabase"],
      },
      {
        id: "agency-finance",
        name: "Agency Finance",
        client: "Football agency",
        kind: "Finance dashboard",
        status: "In development",
        device: "browser",
        layout: "compact",
        headline: "The agency's finances, readable at a glance.",
        summary:
          "A finance app for the leadership team: income, commissions and cash flow in one live view. It started as a prototype and is now being built for production.",
        before: {
          title: "Before",
          tools: ["Accountant spreadsheets", "Bank exports", "Invoice PDFs", "Quarterly reports"],
          pains: ["Only a clear picture once a quarter", "Commissions tracked by hand"],
        },
        after: {
          title: "After",
          wins: [
            "Live revenue and cash-flow view",
            "Commission tracking per player and contract",
            "Leadership answers in one click, not one meeting",
          ],
        },
        built: [
          "Prototype built from real (anonymised) figures",
          "Validated the dashboards with leadership",
          "Now in production development",
        ],
        timeline: [
          { label: "Discover", detail: "Finance workflow review", days: 2, duration: "2 days" },
          { label: "Prototype", detail: "Dashboards on real data", days: 5, duration: "1 week" },
          { label: "Build", detail: "In progress now", days: 15, duration: "In progress" },
        ],
        shipped: "Prototype in 1 week",
        metricsLabel: "Targets",
        metrics: [
          { display: "Quarterly → live", label: "How often leadership sees the numbers" },
          { value: 90, suffix: "%", label: "Less time reconciling commissions" },
          { value: 4, suffix: " → 1", label: "Sources of truth" },
        ],
        stack: ["React", "TanStack Start", "Supabase"],
      },
      {
        id: "recruitment-crm",
        name: "Recruitment CRM",
        client: "Football agency",
        kind: "Mobile and iPad app",
        status: "In development",
        device: "tablet",
        layout: "compact",
        headline: "Outfield recruitment, organised pitch-side.",
        summary:
          "A recruitment app built for phone and iPad, so scouts can log a player, a club contact or a match report from the stand instead of typing it up later.",
        before: {
          title: "Before",
          tools: ["Phone contacts", "Notes app", "Spreadsheet trackers", "Paper match notes"],
          pains: ["Reports typed up hours after the game", "Club contacts stuck on one person's phone"],
        },
        after: {
          title: "After",
          wins: [
            "Player profiles and contact tracking in one app",
            "Club contacts shared across the team",
            "Match reports filed on the iPad, at the game",
          ],
        },
        built: [
          "Designed touch-first for phone and iPad",
          "Built a fast, offline-friendly report flow",
          "Now rolling out to the recruitment team",
        ],
        timeline: [
          { label: "Discover", detail: "Ride-along with recruiters", days: 2, duration: "2 days" },
          { label: "Prototype", detail: "iPad report flow", days: 4, duration: "4 days" },
          { label: "Build", detail: "In progress now", days: 14, duration: "In progress" },
        ],
        shipped: "Prototype in 4 days",
        metricsLabel: "Targets",
        metrics: [
          { value: 0, suffix: " mins", label: "Typing up reports after the game" },
          { value: 50, suffix: "%", label: "Faster from first look to shortlist" },
          { display: "1 place", label: "For every club contact" },
        ],
        stack: ["Next.js", "Vercel"],
      },
      {
        id: "gk-icon",
        name: "GK Icon",
        client: "Football agency",
        kind: "Consumer mobile app",
        status: "Prototype",
        device: "phone",
        layout: "compact",
        headline: "Elite goalkeeper coaching, in a teenager's pocket.",
        summary:
          "A mobile app concept for aspiring goalkeepers: learning content from the pros, coach feedback on their own clips, and live group sessions.",
        before: {
          title: "Before",
          tools: ["In-person sessions only", "Clips sent over DMs", "YouTube drills"],
          pains: ["Coaching limited by geography", "Feedback scattered and slow"],
        },
        after: {
          title: "After",
          wins: [
            "Structured lessons from professional keepers",
            "Upload a clip, get coach feedback in the app",
            "Live group sessions from anywhere",
          ],
        },
        built: [
          "Shaped the concept with the agency's coaches",
          "Designed and built a working mobile prototype",
          "Ready to test with young keepers",
        ],
        timeline: [
          { label: "Discover", detail: "Concept and audience", days: 1, duration: "1 day" },
          { label: "Prototype", detail: "Working mobile app", days: 6, duration: "6 days" },
        ],
        shipped: "Concept to prototype in 1 week",
        metricsLabel: "Targets",
        metrics: [
          { value: 1, suffix: " wk", label: "From idea to a prototype on a real phone" },
          { display: "Anywhere", label: "Where a young keeper can get coached" },
          { value: 48, suffix: " hrs", label: "Target turnaround for clip feedback" },
        ],
        stack: ["React Native", "Expo"],
      },
    ],
  },
  {
    id: "creator",
    label: "Client 02",
    who: "An entrepreneur and creator",
    about:
      "A founder with a video series for founders and a debate podcast. Two shows, two owned homes online, both live.",
    projects: [
      {
        id: "founders-way",
        name: "The Founders' Way",
        client: "Founder and creator",
        kind: "Video portal",
        status: "Live",
        device: "browser",
        layout: "feature",
        headline: "A video series for founders, on a home of its own.",
        summary:
          "An editorial video portal for founders and founding teams. Featured and latest episodes lead the homepage, with a gated Academy planned next.",
        before: {
          title: "Before",
          tools: ["YouTube only", "Social clips", "Link-in-bio page", "No email list"],
          pains: ["No owned audience", "Episodes buried in an algorithm", "Nowhere to sell an Academy"],
        },
        after: {
          title: "After",
          wins: [
            "An editorial home for every episode",
            "Featured and latest episodes up front",
            "Built ready for a gated Academy",
          ],
        },
        built: [
          "Defined the editorial look with the founder",
          "Designed the episode and series structure",
          "Built, launched and handed over a simple CMS flow",
        ],
        timeline: [
          { label: "Discover", detail: "Brand and content review", days: 1, duration: "1 day" },
          { label: "Design", detail: "Editorial layouts", days: 3, duration: "3 days" },
          { label: "Build", detail: "Portal and CMS", days: 6, duration: "6 days" },
          { label: "Launch", detail: "Domain and go-live", days: 1, duration: "1 day" },
        ],
        shipped: "Brief to live in 11 days",
        metricsLabel: "Impact",
        metrics: [
          { value: 11, suffix: " days", label: "From first call to live site" },
          { value: 100, suffix: "%", label: "Owned audience channel, no algorithm" },
          { value: 95, suffix: "+", label: "Lighthouse performance score" },
        ],
        stack: ["React", "TanStack Start", "Supabase"],
      },
      {
        id: "sandalwood-sage",
        name: "Sandalwood & Sage",
        client: "Founder and creator",
        kind: "Podcast site",
        status: "Live",
        device: "browser",
        layout: "compact",
        headline: "A podcast built on evidence, not opinion. Now with a proper home.",
        summary:
          "The site for a podcast of short, structured debates. Each episode takes one question and looks at it from two perspectives in around fifteen minutes.",
        before: {
          title: "Before",
          tools: ["Podcast apps only", "No website", "Show notes in descriptions"],
          pains: ["Nowhere to point new listeners", "The format was hard to explain"],
        },
        after: {
          title: "After",
          wins: [
            "A site that explains the format in seconds",
            "Every debate laid out as two clear sides",
            "One link for every show and platform",
          ],
        },
        built: [
          "Designed a visual system around 'two sides'",
          "Built a fast, lightweight episode site",
          "Shipped in a single week",
        ],
        timeline: [
          { label: "Design", detail: "Format-led identity", days: 2, duration: "2 days" },
          { label: "Build", detail: "Episode site", days: 4, duration: "4 days" },
          { label: "Launch", detail: "Go-live", days: 1, duration: "1 day" },
        ],
        shipped: "Brief to live in 1 week",
        metricsLabel: "Impact",
        metrics: [
          { value: 7, suffix: " days", label: "From brief to live" },
          { value: 1, suffix: " link", label: "For every platform the show is on" },
          { value: 15, suffix: " min", label: "Per debate, explained on one page" },
        ],
        stack: ["React", "Vite", "Vercel"],
      },
    ],
  },
];

export const ALL_PROJECTS = CLIENTS.flatMap((c) => c.projects.map((p) => ({ ...p, clientWho: c.who })));
