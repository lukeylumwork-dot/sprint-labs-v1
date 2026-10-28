import { useEffect, useId, useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types and data                                                      */
/* ------------------------------------------------------------------ */

type View = "home" | "episode" | "series" | "academy";
type Scene = "window" | "duo" | "city" | "stage" | "horizon";

interface Palette {
  top: string;
  base: string;
  light: string;
}

interface Episode {
  n: number;
  title: string;
  dek: string;
  guest: string;
  dur: string;
  date: string;
  topic: string;
  series: 1 | 2;
  scene: Scene;
  tone: number;
}

interface Chapter {
  at: number;
  title: string;
  line: string;
}

const PALETTES: Palette[] = [
  { top: "#3a2414", base: "#0e0906", light: "#f2c98a" },
  { top: "#123036", base: "#060c0e", light: "#eab37c" },
  { top: "#3b1714", base: "#0d0606", light: "#f0a87a" },
  { top: "#2b2c17", base: "#0b0b07", light: "#e8d49a" },
  { top: "#1d2436", base: "#080a10", light: "#f1c48e" },
  { top: "#38211f", base: "#0d0809", light: "#f3c7a8" },
];

const EPISODES: Episode[] = [
  {
    n: 14,
    title: "Hiring your first ten people",
    dek: "Why the first ten hires set the next hundred, and how to run a proper hiring loop when you are still the whole HR department.",
    guest: "Founder of a 70-person payroll start-up",
    dur: "48:12",
    date: "9 Oct 2026",
    topic: "Hiring",
    series: 2,
    scene: "window",
    tone: 0,
  },
  {
    n: 13,
    title: "Pricing before you feel ready",
    dek: "Charging from day one, the anchor-price trap, and the one email that doubled annual plans overnight.",
    guest: "Co-founder of a design tools company",
    dur: "41:30",
    date: "25 Sep 2026",
    topic: "Revenue",
    series: 2,
    scene: "city",
    tone: 1,
  },
  {
    n: 12,
    title: "The board meeting nobody prepares for",
    dek: "What a first board actually wants from you, and the two-page pack that keeps it to ninety minutes.",
    guest: "Second-time founder, climate software",
    dur: "52:05",
    date: "11 Sep 2026",
    topic: "Governance",
    series: 2,
    scene: "duo",
    tone: 2,
  },
  {
    n: 11,
    title: "When to stop doing sales yourself",
    dek: "The signals that it is time to hire a seller, and why the founder-led playbook must be written down first.",
    guest: "CEO of a 30-person logistics platform",
    dur: "38:47",
    date: "28 Aug 2026",
    topic: "Sales",
    series: 2,
    scene: "stage",
    tone: 3,
  },
  {
    n: 10,
    title: "Raising a seed round in a cold market",
    dek: "Forty-one investor meetings, three term sheets and the spreadsheet that kept the round on track.",
    guest: "Founder of a health-data start-up",
    dur: "55:20",
    date: "14 Aug 2026",
    topic: "Fundraising",
    series: 2,
    scene: "horizon",
    tone: 4,
  },
  {
    n: 9,
    title: "Writing the memo that sets your culture",
    dek: "Values are what you do on a bad Tuesday. How one team wrote theirs down and actually used them.",
    guest: "Co-founder of a fintech, 120 staff",
    dur: "36:10",
    date: "31 Jul 2026",
    topic: "Culture",
    series: 2,
    scene: "window",
    tone: 5,
  },
  {
    n: 8,
    title: "Parting with a co-founder, kindly",
    dek: "The hardest conversation in a young company, the vesting clause that saved it, and staying friends.",
    guest: "Founder of a consumer hardware brand",
    dur: "44:02",
    date: "17 Jul 2026",
    topic: "Founders",
    series: 2,
    scene: "duo",
    tone: 1,
  },
  {
    n: 7,
    title: "The first customer you should turn down",
    dek: "Saying no to a big logo that would have quietly turned a product into an agency.",
    guest: "Founder of a B2B analytics tool",
    dur: "33:55",
    date: "2 Apr 2026",
    topic: "Customers",
    series: 1,
    scene: "city",
    tone: 3,
  },
  {
    n: 6,
    title: "Learning to manage before you have to",
    dek: "One-to-ones, written updates and the habit of saying the uncomfortable thing early.",
    guest: "CEO of a 45-person edtech company",
    dur: "39:18",
    date: "19 Mar 2026",
    topic: "Leadership",
    series: 1,
    scene: "stage",
    tone: 5,
  },
  {
    n: 5,
    title: "Saying no to the wrong money",
    dek: "A term sheet with strings attached, and the angel round that came together six weeks later.",
    guest: "Founder of a food-tech marketplace",
    dur: "42:41",
    date: "5 Mar 2026",
    topic: "Fundraising",
    series: 1,
    scene: "horizon",
    tone: 2,
  },
  {
    n: 4,
    title: "Building the smallest thing that sells",
    dek: "A spreadsheet, a form and a weekly phone call: the first version that paying customers saw.",
    guest: "Solo founder, property software",
    dur: "35:26",
    date: "19 Feb 2026",
    topic: "Product",
    series: 1,
    scene: "window",
    tone: 4,
  },
  {
    n: 3,
    title: "Your first ten customers, by hand",
    dek: "Cold emails, coffee and a shared spreadsheet: winning customers one conversation at a time.",
    guest: "Founder of a hospitality booking tool",
    dur: "37:44",
    date: "5 Feb 2026",
    topic: "Customers",
    series: 1,
    scene: "duo",
    tone: 3,
  },
  {
    n: 2,
    title: "Finding a co-founder you won’t outgrow",
    dek: "Six months of dating before founding, and the four questions they wish they had asked sooner.",
    guest: "Co-founders of a legal-tech company",
    dur: "46:09",
    date: "22 Jan 2026",
    topic: "Founders",
    series: 1,
    scene: "stage",
    tone: 0,
  },
  {
    n: 1,
    title: "Is this a company or a project?",
    dek: "The honest test for whether an idea deserves your next five years, and how to run it in a month.",
    guest: "Founder of a 25-person HR platform",
    dur: "40:58",
    date: "8 Jan 2026",
    topic: "Starting",
    series: 1,
    scene: "horizon",
    tone: 5,
  },
];

const SERIES = [
  {
    id: 1,
    name: "Zero to One",
    blurb:
      "From idea to first revenue. Seven founders on the year before anyone had heard of them.",
    meta: "7 episodes · Jan to Apr 2026",
    scene: "horizon" as Scene,
    tone: 4,
  },
  {
    id: 2,
    name: "The First Hundred",
    blurb: "Hiring, pricing, boards and the people side of a company that suddenly works.",
    meta: "7 episodes · Jul to Oct 2026",
    scene: "window" as Scene,
    tone: 0,
  },
  {
    id: 3,
    name: "Scale Without Losing It",
    blurb: "Second leaders, second offices and keeping the thing that made it good.",
    meta: "In production · Jan 2027",
    scene: "city" as Scene,
    tone: 1,
  },
];

const EP14_CHAPTERS: Chapter[] = [
  {
    at: 0,
    title: "Cold open",
    line: "“Your first ten people are your culture. Everything after is a photocopy.”",
  },
  {
    at: 134,
    title: "Why the first ten matter most",
    line: "“I hired for speed and spent a year undoing it.”",
  },
  {
    at: 468,
    title: "Writing the role before you need it",
    line: "“If you can’t write the scorecard, you’re not ready to hire.”",
  },
  {
    at: 870,
    title: "The scorecard interview",
    line: "“Four outcomes, ninety days, and one question for each.”",
  },
  {
    at: 1265,
    title: "Hiring for slope, not experience",
    line: "“I’d take steep and early over polished and flat.”",
  },
  {
    at: 1720,
    title: "The offer call, word for word",
    line: "“Say the number first, then stop talking.”",
  },
  {
    at: 2172,
    title: "When a hire isn’t working",
    line: "“Kindness is telling them in week three, not month nine.”",
  },
  {
    at: 2600,
    title: "Rapid fire: three questions",
    line: "“Best hire? The one who told me I was wrong.”",
  },
];

const GENERIC_CH = [
  ["Cold open", "“We nearly didn’t make it past the first winter.”"],
  ["How we got here", "“It started as a side project on Sunday evenings.”"],
  ["The first hard lesson", "“Nobody tells you how quiet the first month is.”"],
  ["The core idea", "“Write it down, then do the boring version first.”"],
  ["Where it went wrong", "“We optimised the wrong number for a whole quarter.”"],
  ["What we’d do again", "“Ship on Fridays. Talk to customers on Mondays.”"],
  ["Rapid fire: three questions", "“One book, one habit, one regret.”"],
] as const;
const GENERIC_AT = [0, 0.05, 0.17, 0.34, 0.52, 0.7, 0.9];

const QUOTES = [
  {
    q: "Your first ten people are your culture. Everything after that is a photocopy, so make the original count.",
    by: "Founder of a 70-person payroll start-up",
    ep: "Episode 14",
  },
  {
    q: "Charge something on day one. The number matters far less than learning who will actually pay it.",
    by: "Co-founder of a design tools company",
    ep: "Episode 13",
  },
  {
    q: "A board pack should fit on two pages. If it needs ten, you haven’t decided what you think yet.",
    by: "Second-time founder, climate software",
    ep: "Episode 12",
  },
];

const MODULES = [
  {
    n: "01",
    title: "Is it a company yet?",
    lessons: 6,
    time: "1h 40m",
    extras: "2 templates",
    tone: 4,
    syllabus: [
      ["Project or company: the honest test", "14 min"],
      ["Finding the painful problem", "18 min"],
      ["Ten customer conversations", "22 min"],
      ["Writing the one-page thesis", "16 min"],
      ["Deciding to go full time", "17 min"],
      ["Workshop: your thesis, reviewed", "13 min"],
    ],
  },
  {
    n: "02",
    title: "The first ten customers",
    lessons: 8,
    time: "2h 15m",
    extras: "3 templates",
    tone: 1,
    syllabus: [
      ["Selling before the product exists", "16 min"],
      ["The founder-led sales call", "21 min"],
      ["Pilots that convert", "18 min"],
      ["Handling the first no", "14 min"],
      ["Case study: zero to £10k MRR", "24 min"],
      ["Building a tiny pipeline", "15 min"],
      ["Referrals from day one", "12 min"],
      ["Workshop: your first ten", "15 min"],
    ],
  },
  {
    n: "03",
    title: "Pricing and packaging",
    lessons: 5,
    time: "1h 25m",
    extras: "1 calculator",
    tone: 3,
    syllabus: [
      ["Value, not cost-plus", "17 min"],
      ["Three tiers and an anchor", "16 min"],
      ["Raising prices without churn", "19 min"],
      ["Annual plans and discounts", "15 min"],
      ["Workshop: your price page", "18 min"],
    ],
  },
  {
    n: "04",
    title: "Hiring the first ten",
    lessons: 7,
    time: "2h 05m",
    extras: "Scorecard kit",
    tone: 0,
    syllabus: [
      ["Write the scorecard first", "16 min"],
      ["Where great early hires come from", "18 min"],
      ["The structured interview", "22 min"],
      ["References that tell the truth", "14 min"],
      ["The offer call, word for word", "17 min"],
      ["Onboarding in thirty days", "20 min"],
      ["Workshop: your next hire", "18 min"],
    ],
  },
  {
    n: "05",
    title: "Raising your first round",
    lessons: 9,
    time: "2h 50m",
    extras: "Deck review",
    tone: 2,
    syllabus: [
      ["Do you need to raise at all?", "15 min"],
      ["The investor list and CRM", "18 min"],
      ["A deck in twelve slides", "24 min"],
      ["Running a tight process", "21 min"],
      ["Reading a term sheet", "23 min"],
      ["Angels, funds and SAFEs", "17 min"],
      ["Negotiating without leverage", "19 min"],
      ["Closing and announcing", "14 min"],
      ["Workshop: live deck teardown", "19 min"],
    ],
  },
  {
    n: "06",
    title: "Running the company, not the list",
    lessons: 6,
    time: "1h 50m",
    extras: "Operating cadence",
    tone: 5,
    syllabus: [
      ["The weekly operating rhythm", "18 min"],
      ["Goals that people remember", "17 min"],
      ["Your first board", "21 min"],
      ["Delegating the founder jobs", "19 min"],
      ["Protecting deep work", "15 min"],
      ["Workshop: your operating plan", "20 min"],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function toSecs(d: string) {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
}

function fmt(t: number) {
  const s = Math.max(0, Math.floor(t));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function chaptersFor(ep: Episode): Chapter[] {
  if (ep.n === 14) return EP14_CHAPTERS;
  const total = toSecs(ep.dur);
  return GENERIC_CH.map(([title, line], i) => ({
    at: Math.round((GENERIC_AT[i] * total) / 5) * 5,
    title,
    line,
  }));
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Ico({ d, size = 16, fill = false }: { d: ReactNode; size?: number; fill?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}

const I = {
  play: (s = 16) => (
    <Ico
      size={s}
      fill
      d={
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
      }
    />
  ),
  pause: (s = 16) => (
    <Ico
      size={s}
      fill
      d={
        <>
          <rect x="6" y="4.5" width="4" height="15" rx="1" />
          <rect x="14" y="4.5" width="4" height="15" rx="1" />
        </>
      }
    />
  ),
  lock: (s = 16) => (
    <Ico
      size={s}
      d={
        <>
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
        </>
      }
    />
  ),
  check: (s = 16) => <Ico size={s} d={<path d="m5 12.5 4.5 4.5L19 7.5" />} />,
  arrow: (s = 16) => <Ico size={s} d={<path d="M5 12h14m-5-5 5 5-5 5" />} />,
  back: (s = 16) => <Ico size={s} d={<path d="M19 12H5m5 5-5-5 5-5" />} />,
  search: (s = 16) => (
    <Ico
      size={s}
      d={
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        </>
      }
    />
  ),
  volume: (s = 16) => (
    <Ico
      size={s}
      d={
        <>
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
          <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      }
    />
  ),
  cc: (s = 16) => (
    <Ico
      size={s}
      d={
        <>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M10.5 10.2a2.4 2.4 0 1 0 0 3.6M17 10.2a2.4 2.4 0 1 0 0 3.6" />
        </>
      }
    />
  ),
  full: (s = 16) => <Ico size={s} d={<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />} />,
  close: (s = 16) => <Ico size={s} d={<path d="M6 6l12 12M18 6 6 18" />} />,
  bookmark: (s = 16) => <Ico size={s} d={<path d="M6.5 4h11v16l-5.5-4-5.5 4z" />} />,
  share: (s = 16) => (
    <Ico
      size={s}
      d={
        <>
          <path d="M12 15V4m-4 4 4-4 4 4" />
          <path d="M5 13v6h14v-6" />
        </>
      }
    />
  ),
  spark: (s = 16) => (
    <Ico size={s} fill d={<path d="M12 2.5 14 10l7.5 2-7.5 2-2 7.5-2-7.5-7.5-2L10 10z" />} />
  ),
};

/* ------------------------------------------------------------------ */
/* Cinematic stills (abstract SVG)                                     */
/* ------------------------------------------------------------------ */

function Figure({
  x,
  y,
  s,
  dark,
  rim,
  dir = 1,
}: {
  x: number;
  y: number;
  s: number;
  dark: string;
  rim: string;
  dir?: 1 | -1;
}) {
  const body = "M-21 0C-21-25-16-40 0-42C16-40 21-25 21 0Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`translate(${1.8 * dir} -0.6)`} fill={rim} opacity="0.75">
        <path d={body} />
        <ellipse cx="1.5" cy="-58" rx="10" ry="12" />
      </g>
      <path d={body} fill={dark} />
      <rect x="-4.5" y="-49" width="9" height="9" fill={dark} />
      <ellipse cx={1.5 * dir} cy="-58" rx="10" ry="12" fill={dark} />
    </g>
  );
}

function Still({
  scene,
  tone,
  className = "",
  wide = false,
}: {
  scene: Scene;
  tone: number;
  className?: string;
  wide?: boolean;
}) {
  const raw = useId();
  const id = "fw" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const p = PALETTES[tone % PALETTES.length];
  const dark = "#070504";
  const u = (k: string) => `url(#${id}${k})`;

  let art: ReactNode = null;
  if (scene === "window") {
    art = (
      <>
        <rect width="320" height="180" fill={u("glow")} />
        <rect x="196" y="20" width="88" height="106" fill={p.light} opacity="0.82" />
        {Array.from({ length: 14 }, (_, i) => (
          <rect
            key={i}
            x="196"
            y={23 + i * 7.4}
            width="88"
            height="2.6"
            fill={p.base}
            opacity="0.55"
          />
        ))}
        <rect x="238" y="20" width="4" height="106" fill={p.base} opacity="0.8" />
        <rect x="192" y="16" width="96" height="114" fill="none" stroke={p.base} strokeWidth="5" />
        <polygon points="196,130 284,130 330,180 140,180" fill={p.light} opacity="0.13" />
        <rect x="0" y="136" width="320" height="44" fill={p.base} opacity="0.55" />
        <g transform={wide ? "translate(78 4)" : undefined}>
          <rect x="38" y="116" width="128" height="5" rx="1" fill={dark} />
          <rect x="46" y="121" width="4" height="40" fill={dark} />
          <rect x="152" y="121" width="4" height="40" fill={dark} />
          <rect x="128" y="108" width="8" height="8" rx="1" fill={p.light} opacity="0.35" />
          <Figure x={96} y={126} s={wide ? 1.1 : 1.25} dark={dark} rim={p.light} dir={1} />
        </g>
      </>
    );
  } else if (scene === "duo") {
    art = (
      <>
        {[18, 34, 50, 66].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={40 + (i % 2) * 6}
            width="10"
            height={70 - (i % 2) * 6}
            fill={p.light}
            opacity="0.06"
          />
        ))}
        <polygon points="152,30 168,30 238,142 82,142" fill={u("cone")} />
        <path d="M148 30h24l-4-10h-16z" fill={dark} />
        <rect x="159" y="0" width="2" height="20" fill={dark} />
        <ellipse cx="160" cy="31" rx="8" ry="2" fill={p.light} />
        <ellipse cx="160" cy="142" rx="96" ry="9" fill={p.light} opacity="0.22" />
        <rect x="64" y="141" width="192" height="4" fill={dark} />
        <rect x="140" y="132" width="9" height="10" rx="1.5" fill={dark} />
        <rect x="172" y="133" width="8" height="9" rx="1.5" fill={dark} />
        <Figure x={88} y={142} s={1.3} dark={dark} rim={p.light} dir={1} />
        <Figure x={232} y={142} s={1.3} dark={dark} rim={p.light} dir={-1} />
        <rect x="0" y="146" width="320" height="34" fill={p.base} opacity="0.7" />
      </>
    );
  } else if (scene === "city") {
    const blocks = [
      [0, 112, 26],
      [24, 96, 20],
      [42, 120, 30],
      [70, 84, 18],
      [86, 104, 26],
      [110, 92, 16],
      [124, 116, 34],
      [156, 78, 22],
      [176, 102, 28],
      [202, 88, 18],
      [218, 110, 30],
      [246, 94, 22],
      [266, 118, 26],
      [290, 100, 30],
    ];
    art = (
      <>
        <rect width="320" height="180" fill={u("sky")} />
        <circle cx="214" cy="102" r="40" fill={p.light} opacity="0.32" />
        <circle cx="214" cy="102" r="20" fill={p.light} opacity="0.55" />
        {blocks.map(([x, y, w]) => (
          <rect key={x} x={x} y={y} width={w} height={180 - y} fill={p.base} opacity="0.92" />
        ))}
        {blocks.map(([x, y, w], i) =>
          [0, 1, 2].map((r) => (
            <rect
              key={`${x}-${r}`}
              x={x + 4 + ((i + r) % 3) * (w / 4)}
              y={y + 8 + r * 12}
              width="2.4"
              height="3"
              fill={p.light}
              opacity={(i + r) % 2 ? 0.55 : 0.25}
            />
          )),
        )}
        <rect x="0" y="0" width="9" height="180" fill={dark} />
        <rect x="150" y="0" width="7" height="180" fill={dark} />
        <rect x="0" y="150" width="320" height="30" fill={dark} />
        <Figure x={72} y={200} s={2.3} dark={dark} rim={p.light} dir={1} />
      </>
    );
  } else if (scene === "stage") {
    art = (
      <>
        <rect width="320" height="180" fill={u("spot")} />
        <rect x="0" y="128" width="320" height="52" fill={p.base} opacity="0.75" />
        <ellipse cx="160" cy="136" rx="120" ry="10" fill={p.light} opacity="0.12" />
        <path d="M78 136v-36q0-8 8-8h28q8 0 8 8v36z" fill={dark} />
        <path d="M198 136v-36q0-8 8-8h28q8 0 8 8v36z" fill={dark} />
        <Figure x={102} y={128} s={1.05} dark={dark} rim={p.light} dir={1} />
        <Figure x={218} y={128} s={1.05} dark={dark} rim={p.light} dir={-1} />
        <rect x="152" y="112" width="16" height="24" fill={dark} />
        <circle cx="156" cy="100" r="7" fill={dark} />
        <circle cx="165" cy="96" r="8" fill={dark} />
        <circle cx="160" cy="88" r="7" fill={dark} />
        <rect x="0" y="0" width="320" height="10" fill={dark} opacity="0.6" />
      </>
    );
  } else {
    art = (
      <>
        <rect width="320" height="180" fill={u("sky")} />
        {[78, 64, 50].map((r, i) => (
          <circle
            key={r}
            cx="212"
            cy="112"
            r={r}
            fill="none"
            stroke={p.light}
            strokeOpacity={0.1 + i * 0.06}
          />
        ))}
        <circle cx="212" cy="112" r="34" fill={p.light} opacity="0.85" />
        <rect x="0" y="112" width="320" height="68" fill={p.base} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={212 - 30 + i * 4}
            y={118 + i * 8}
            width={60 - i * 8}
            height="2"
            fill={p.light}
            opacity={0.5 - i * 0.07}
          />
        ))}
        <path d="M0 112 L40 98 L70 106 L104 92 L140 112Z" fill={dark} opacity="0.85" />
        <rect x="58" y="96" width="3" height="16" fill={dark} />
        <circle cx="59.5" cy="92" r="3.2" fill={dark} />
      </>
    );
  }

  return (
    <svg
      className={`still ${className}`}
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={p.top} />
          <stop offset="1" stopColor={p.base} />
        </linearGradient>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.base} />
          <stop offset="0.55" stopColor={p.top} />
          <stop offset="0.68" stopColor={p.light} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.base} />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="0.74" cy="0.4" r="0.6">
          <stop offset="0" stopColor={p.light} stopOpacity="0.32" />
          <stop offset="1" stopColor={p.light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}spot`} cx="0.5" cy="0.38" r="0.55">
          <stop offset="0" stopColor={p.light} stopOpacity="0.42" />
          <stop offset="0.6" stopColor={p.top} stopOpacity="0.6" />
          <stop offset="1" stopColor={p.base} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.light} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.light} stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={`${id}vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
        <filter id={`${id}grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.55 0" />
        </filter>
      </defs>
      <rect width="320" height="180" fill={u("bg")} />
      {art}
      <rect width="320" height="180" fill={u("vig")} />
      <rect width="320" height="180" filter={u("grain")} opacity="0.16" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-fw{--bg:#0d0b09;--bg2:#14110e;--bg3:#1b1713;--cream:#f3ede2;--muted:rgba(243,237,226,.64);--dim:rgba(243,237,226,.44);--line:rgba(243,237,226,.1);--line2:rgba(243,237,226,.16);--gold:#c9a46a;--gold2:#dcbb85;--serif:Georgia,"Times New Roman",serif;
  width:100%;height:100%;overflow:hidden;position:relative;display:flex;flex-direction:column;background:var(--bg);color:var(--cream);font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
.mk-fw *{box-sizing:border-box}
.mk-fw h1,.mk-fw h2,.mk-fw h3,.mk-fw h4,.mk-fw p,.mk-fw ul,.mk-fw ol,.mk-fw figure,.mk-fw blockquote{margin:0;padding:0}
.mk-fw ul,.mk-fw ol{list-style:none}
.mk-fw button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit}
.mk-fw button:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.mk-fw .still{display:block;width:100%;height:100%}
.mk-fw .serif{font-family:var(--serif)}
.mk-fw .fw-eyebrow{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}

/* nav */
.mk-fw .fw-nav{height:64px;flex:none;display:flex;align-items:center;gap:40px;padding:0 48px;border-bottom:1px solid var(--line);background:rgba(13,11,9,.92);position:relative;z-index:5}
.mk-fw .brand{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-size:20px;letter-spacing:-.01em;white-space:nowrap}
.mk-fw .brand-mark{width:26px;height:26px;border:1px solid var(--gold);border-radius:50%;display:grid;place-items:center;color:var(--gold);font-size:12px;font-style:italic}
.mk-fw .brand em{font-style:italic;color:var(--gold2)}
.mk-fw .links{display:flex;gap:4px;flex:1}
.mk-fw .link{position:relative;padding:8px 12px;font-size:14px;color:var(--muted);border-radius:6px;display:flex;align-items:center;gap:8px;transition:color .15s}
.mk-fw .link:hover{color:var(--cream)}
.mk-fw .link[aria-current="page"]{color:var(--cream)}
.mk-fw .link[aria-current="page"]::after{content:"";position:absolute;left:12px;right:12px;bottom:-13px;height:2px;background:var(--gold)}
.mk-fw .soon{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,164,106,.45);border-radius:999px;padding:1px 6px;line-height:14px}
.mk-fw .fw-nav-r{display:flex;align-items:center;gap:12px}
.mk-fw .icon-btn{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--muted);transition:background .15s,color .15s}
.mk-fw .icon-btn:hover{background:rgba(243,237,226,.07);color:var(--cream)}
.mk-fw .btn{height:38px;padding:0 18px;border-radius:999px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;transition:background .15s,border-color .15s,color .15s,transform .15s}
.mk-fw .btn-gold{background:var(--gold);color:#17120b}
.mk-fw .btn-gold:hover{background:var(--gold2)}
.mk-fw .btn-ghost{border:1px solid var(--line2);color:var(--cream)}
.mk-fw .btn-ghost:hover{border-color:rgba(243,237,226,.36);background:rgba(243,237,226,.04)}
.mk-fw .btn-done{background:transparent;border:1px solid rgba(201,164,106,.55);color:var(--gold2)}
.mk-fw .btn-lg{height:46px;padding:0 24px;font-size:15px}

.mk-fw .main{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:rgba(243,237,226,.18) transparent}
.mk-fw .pad{padding:0 48px}

/* hero */
.mk-fw .fw-hero{position:relative;margin:24px 48px 0;height:384px;border-radius:6px;overflow:hidden;border:1px solid var(--line)}
.mk-fw .fw-hero .still{position:absolute;inset:0}
.mk-fw .fw-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,7,5,.94) 0%,rgba(9,7,5,.78) 34%,rgba(9,7,5,.1) 66%),linear-gradient(0deg,rgba(9,7,5,.6),transparent 40%)}
.mk-fw .hero-c{position:absolute;z-index:1;left:48px;bottom:40px;max-width:600px}
.mk-fw .fw-hero h1{font-family:var(--serif);font-weight:400;font-size:50px;line-height:1.04;letter-spacing:-.02em;margin:12px 0 14px}
.mk-fw .fw-hero p{font-size:16px;color:var(--muted);max-width:460px;line-height:1.55}
.mk-fw .meta{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--dim)}
.mk-fw .meta i{width:3px;height:3px;border-radius:50%;background:currentColor;display:block}
.mk-fw .fw-hero .meta{margin:18px 0 24px}
.mk-fw .hero-acts{display:flex;gap:12px}
.mk-fw .hero-credit{position:absolute;z-index:1;right:28px;bottom:24px;font-family:var(--serif);font-style:italic;font-size:13px;color:rgba(243,237,226,.7)}
.mk-fw .hero-tag{position:absolute;z-index:1;right:24px;top:22px;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--cream);background:rgba(9,7,5,.55);border:1px solid var(--line2);border-radius:999px;padding:5px 12px;backdrop-filter:blur(6px)}
.mk-fw .rec{width:7px;height:7px;border-radius:50%;background:var(--gold)}

/* sections */
.mk-fw .sec{padding:32px 48px 0}
.mk-fw .fw-sec-h{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px}
.mk-fw .fw-sec-h h2{font-family:var(--serif);font-weight:400;font-size:26px;letter-spacing:-.01em}
.mk-fw .fw-sec-h h2 span{color:var(--dim);font-size:15px;font-family:Inter,sans-serif;margin-left:12px}
.mk-fw .more{font-size:13px;color:var(--muted);display:inline-flex;align-items:center;gap:6px}
.mk-fw .more:hover{color:var(--gold2)}
.mk-fw .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.mk-fw .card{display:flex;flex-direction:column;align-self:start;width:100%;min-width:0}
.mk-fw .upc{display:grid;gap:8px;max-width:520px;margin:24px auto 0;text-align:left}
.mk-fw .upc-i{display:grid;grid-template-columns:36px 1fr auto;gap:14px;align-items:center;padding:12px 16px;border:1px dashed var(--line2);border-radius:6px;font-family:var(--serif);font-size:17px;color:var(--cream)}
.mk-fw .upc-i .num{font-style:italic;color:var(--dim);font-size:20px}
.mk-fw .thumb{position:relative;aspect-ratio:16/9;border-radius:4px;overflow:hidden;border:1px solid var(--line);background:var(--bg2)}
.mk-fw .thumb .still{transition:transform .5s ease}
.mk-fw .card:hover .thumb .still{transform:scale(1.04)}
.mk-fw .dur{position:absolute;right:8px;bottom:8px;font-family:"IBM Plex Mono",monospace;font-size:11px;padding:2px 6px;border-radius:3px;background:rgba(9,7,5,.78);color:var(--cream)}
.mk-fw .pbtn{position:absolute;left:10px;bottom:10px;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:rgba(243,237,226,.92);color:#15100a;transition:background .15s,transform .15s}
.mk-fw .card:hover .pbtn{background:var(--gold);transform:scale(1.06)}
.mk-fw .card-ep{margin-top:14px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);font-weight:600}
.mk-fw .card h3{font-family:var(--serif);font-weight:400;font-size:19px;line-height:1.25;margin:6px 0 6px;transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-fw .card:hover h3{color:var(--gold2)}
.mk-fw .card .meta{font-size:12.5px}

/* quotes */
.mk-fw .quote{margin:48px 0 0;padding:48px 48px 40px;background:var(--bg2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:120px 1fr 200px;gap:32px;align-items:start}
.mk-fw .qmark{font-family:var(--serif);font-size:120px;line-height:.8;color:var(--gold)}
.mk-fw .quote blockquote{font-family:var(--serif);font-style:italic;font-size:30px;line-height:1.3;letter-spacing:-.01em;max-width:760px}
.mk-fw .quote cite{display:block;margin-top:18px;font-style:normal;font-size:13px;color:var(--dim)}
.mk-fw .quote cite b{color:var(--muted);font-weight:500}
.mk-fw .dots{display:flex;gap:8px;justify-content:flex-end;padding-top:10px}
.mk-fw .dotb{width:28px;height:3px;background:var(--line2);border-radius:2px}
.mk-fw .dotb[aria-pressed="true"]{background:var(--gold)}

/* signup */
.mk-fw .signup{margin:48px 48px 0;padding:36px 40px;border:1px solid var(--line2);border-radius:6px;display:grid;grid-template-columns:1fr 460px;gap:40px;align-items:center;background:radial-gradient(120% 140% at 100% 0%,rgba(201,164,106,.12),transparent 55%)}
.mk-fw .signup h2{font-family:var(--serif);font-weight:400;font-size:30px;line-height:1.15;letter-spacing:-.01em}
.mk-fw .signup p{margin-top:10px;color:var(--muted)}
.mk-fw .field{display:flex;gap:8px;padding:6px;border:1px solid var(--line2);border-radius:999px;background:rgba(9,7,5,.6)}
.mk-fw .field span{flex:1;padding:0 14px;display:flex;align-items:center;color:var(--dim)}
.mk-fw .fine{margin-top:10px;font-size:12px;color:var(--dim);padding-left:16px}
.mk-fw .fw-foot{margin-top:48px;padding:24px 48px 28px;border-top:1px solid var(--line);display:flex;justify-content:space-between;font-size:12.5px;color:var(--dim)}
.mk-fw .fw-foot .brand{font-size:15px;color:var(--muted)}

/* episode */
.mk-fw .ep{display:grid;grid-template-columns:1fr 340px;gap:32px;padding:20px 48px 40px}
.mk-fw .crumbs{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--dim);margin-bottom:14px}
.mk-fw .crumbs button{color:var(--muted)}
.mk-fw .crumbs button:hover{color:var(--gold2)}
.mk-fw .player{position:relative;aspect-ratio:16/9;border-radius:6px;overflow:hidden;background:#000;border:1px solid var(--line)}
.mk-fw .player>.still{position:absolute;inset:0}
.mk-fw .player-shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.78),transparent 30%),linear-gradient(180deg,rgba(0,0,0,.45),transparent 22%);pointer-events:none}
.mk-fw .ptop{position:absolute;left:20px;right:20px;top:16px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:rgba(243,237,226,.85)}
.mk-fw .ptop .serif{font-size:16px}
.mk-fw .bigplay{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;display:grid;place-items:center;background:rgba(243,237,226,.94);color:#15100a;box-shadow:0 10px 40px rgba(0,0,0,.5);transition:transform .2s,background .2s}
.mk-fw .bigplay:hover{transform:scale(1.06);background:var(--gold)}
.mk-fw .bigplay svg{margin-left:4px}
.mk-fw .caption{position:absolute;left:50%;bottom:76px;transform:translateX(-50%);max-width:80%;text-align:center;font-family:var(--serif);font-size:20px;line-height:1.35;padding:6px 14px;background:rgba(0,0,0,.55);border-radius:3px}
.mk-fw .ctrls{position:absolute;left:0;right:0;bottom:0;padding:0 18px 14px}
.mk-fw .track{position:relative;display:block;width:100%;height:18px}
.mk-fw .track-bg{position:absolute;left:0;right:0;top:7px;height:4px;border-radius:2px;background:rgba(243,237,226,.22);overflow:hidden}
.mk-fw .track-buf{position:absolute;left:0;top:0;bottom:0;background:rgba(243,237,226,.18)}
.mk-fw .track-fill{position:absolute;left:0;top:0;bottom:0;background:var(--gold)}
.mk-fw .tick{position:absolute;top:7px;width:2px;height:4px;background:rgba(0,0,0,.65)}
.mk-fw .knob{position:absolute;top:3px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--cream);box-shadow:0 0 0 3px rgba(201,164,106,.35)}
.mk-fw .crow{display:flex;align-items:center;gap:6px;margin-top:4px}
.mk-fw .crow .icon-btn{width:34px;height:34px;color:var(--cream)}
.mk-fw .time{font-family:"IBM Plex Mono",monospace;font-size:12px;color:rgba(243,237,226,.85);margin-left:4px}
.mk-fw .chap-now{margin-left:12px;font-size:13px;color:rgba(243,237,226,.75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-fw .chap-now b{color:var(--cream);font-weight:500}
.mk-fw .speed{font-size:12px;font-weight:600;border:1px solid rgba(243,237,226,.3);border-radius:4px;padding:2px 6px;margin-right:4px}
.mk-fw .ep-head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-top:22px}
.mk-fw .ep-head h1{font-family:var(--serif);font-weight:400;font-size:34px;line-height:1.1;letter-spacing:-.015em;margin:8px 0 10px}
.mk-fw .ep-acts{display:flex;gap:8px;padding-top:20px}
.mk-fw .ep-acts .btn{height:36px;padding:0 14px;font-size:13px}
.mk-fw .notes{margin-top:24px;padding-top:24px;border-top:1px solid var(--line);display:grid;grid-template-columns:1fr 240px;gap:32px}
.mk-fw .notes h4{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);font-weight:600;margin-bottom:12px}
.mk-fw .notes p{color:var(--muted);font-size:15px;line-height:1.65}
.mk-fw .takeaways{margin-top:16px;display:grid;gap:10px}
.mk-fw .takeaways li{display:flex;gap:12px;font-size:14px;color:var(--cream)}
.mk-fw .takeaways li span{font-family:var(--serif);font-style:italic;color:var(--gold);width:18px;flex:none}
.mk-fw .res li{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line);font-size:13.5px;color:var(--muted)}
.mk-fw .res li em{font-style:normal;color:var(--dim);font-size:12px}
.mk-fw .side h3{font-family:var(--serif);font-weight:400;font-size:20px;display:flex;justify-content:space-between;align-items:baseline}
.mk-fw .side h3 span{font-family:Inter,sans-serif;font-size:12px;color:var(--dim)}
.mk-fw .chaps{margin-top:12px;border-top:1px solid var(--line)}
.mk-fw .chap{width:100%;display:grid;grid-template-columns:58px 1fr 16px;align-items:center;gap:8px;padding:10px 10px;border-bottom:1px solid var(--line);font-size:13.5px;color:var(--muted);position:relative;transition:background .15s,color .15s}
.mk-fw .chap:hover{background:rgba(243,237,226,.04);color:var(--cream)}
.mk-fw .chap .ts{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--dim)}
.mk-fw .chap[aria-current="true"]{background:rgba(201,164,106,.1);color:var(--cream)}
.mk-fw .chap[aria-current="true"]::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--gold)}
.mk-fw .chap[aria-current="true"] .ts{color:var(--gold2)}
.mk-fw .eq{display:flex;gap:2px;align-items:flex-end;height:12px;color:var(--gold)}
.mk-fw .eq i{width:2px;background:currentColor;height:5px;display:block}
@media (prefers-reduced-motion:no-preference){
  .mk-fw .eq.on i{animation:mk-fw-eq .9s ease-in-out infinite}
  .mk-fw .eq.on i:nth-child(2){animation-delay:-.3s}
  .mk-fw .eq.on i:nth-child(3){animation-delay:-.6s}
  .mk-fw .rec.on{animation:mk-fw-pulse 1.6s ease-in-out infinite}
  .mk-fw .fade{animation:mk-fw-fade .35s ease both}
}
@keyframes mk-fw-eq{0%,100%{height:3px}50%{height:12px}}
@keyframes mk-fw-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes mk-fw-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.mk-fw .upnext{margin-top:28px}
.mk-fw .mini{width:100%;display:grid;grid-template-columns:128px 1fr;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}
.mk-fw .mini .thumb{border-radius:3px}
.mk-fw .mini .dur{font-size:10.5px;right:5px;bottom:5px;padding:1px 5px}
.mk-fw .mini b{display:block;font-family:var(--serif);font-weight:400;font-size:15px;line-height:1.25;margin:2px 0 4px;transition:color .15s}
.mk-fw .mini:hover b{color:var(--gold2)}
.mk-fw .mini small{font-size:11px;color:var(--gold);letter-spacing:.1em;text-transform:uppercase;font-weight:600}
.mk-fw .mini span{font-size:12px;color:var(--dim)}

/* series */
.mk-fw .page-h{padding:36px 48px 0;display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.mk-fw .page-h h1{font-family:var(--serif);font-weight:400;font-size:44px;letter-spacing:-.02em;line-height:1.05;margin-top:10px}
.mk-fw .page-h p{max-width:420px;color:var(--muted);font-size:15px}
.mk-fw .sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:28px 48px 0}
.mk-fw .scard{position:relative;height:196px;border-radius:6px;overflow:hidden;border:1px solid var(--line);text-align:left;transition:border-color .2s}
.mk-fw .scard .still{position:absolute;inset:0;transition:transform .5s}
.mk-fw .scard:hover .still{transform:scale(1.03)}
.mk-fw .scard::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(9,7,5,.95),rgba(9,7,5,.3) 70%)}
.mk-fw .scard[aria-pressed="true"]{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold)}
.mk-fw .scard-c{position:absolute;z-index:1;left:20px;right:20px;bottom:18px}
.mk-fw .scard-c b{display:block;font-family:var(--serif);font-weight:400;font-size:24px;margin:6px 0 6px}
.mk-fw .scard-c span{font-size:12.5px;color:var(--muted)}
.mk-fw .scard .badge{position:absolute;z-index:1;top:14px;right:14px}
.mk-fw .badge{font-family:Inter,sans-serif;font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:rgba(9,7,5,.65);border:1px solid var(--line2);color:var(--cream)}
.mk-fw .badge.gold{color:var(--gold2);border-color:rgba(201,164,106,.5)}
.mk-fw .elist{padding:24px 48px 40px}
.mk-fw .elist-h{display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--line)}
.mk-fw .elist-h p{color:var(--muted);max-width:640px}
.mk-fw .seg{display:flex;gap:2px;padding:3px;border:1px solid var(--line2);border-radius:999px}
.mk-fw .seg button{padding:5px 12px;border-radius:999px;font-size:12.5px;color:var(--muted)}
.mk-fw .seg button[aria-pressed="true"]{background:rgba(243,237,226,.1);color:var(--cream)}
.mk-fw .row{width:100%;display:grid;grid-template-columns:44px 176px 1fr 120px 24px;gap:20px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);transition:background .15s}
.mk-fw .row:hover{background:rgba(243,237,226,.025)}
.mk-fw .row .num{font-family:var(--serif);font-style:italic;font-size:26px;color:var(--dim);text-align:center}
.mk-fw .row b{font-family:var(--serif);font-weight:400;font-size:20px;display:block;margin-bottom:4px;transition:color .15s}
.mk-fw .row:hover b{color:var(--gold2)}
.mk-fw .row p{color:var(--muted);font-size:13.5px;line-height:1.5}
.mk-fw .row .when{font-size:12.5px;color:var(--dim);text-align:right;line-height:1.6}
.mk-fw .row .chev{color:var(--dim)}
.mk-fw .empty{padding:48px 0;text-align:center;color:var(--muted)}
.mk-fw .empty b{display:block;font-family:var(--serif);font-weight:400;font-size:24px;color:var(--cream);margin-bottom:8px}

/* academy */
.mk-fw .ac-top{display:grid;grid-template-columns:1fr 380px;gap:40px;padding:32px 48px 0;align-items:stretch}
.mk-fw .ac-top h1{font-family:var(--serif);font-weight:400;font-size:46px;line-height:1.04;letter-spacing:-.02em;margin:12px 0 14px}
.mk-fw .ac-top p{color:var(--muted);font-size:15.5px;max-width:540px}
.mk-fw .ac-stats{display:flex;gap:36px;margin-top:22px}
.mk-fw .ac-stats b{display:block;font-family:var(--serif);font-weight:400;font-size:26px;color:var(--cream)}
.mk-fw .ac-stats span{font-size:12.5px;color:var(--dim)}
.mk-fw .wait{border:1px solid rgba(201,164,106,.35);border-radius:6px;padding:24px;background:linear-gradient(160deg,rgba(201,164,106,.14),rgba(201,164,106,.02) 60%);display:flex;flex-direction:column;gap:14px}
.mk-fw .wait h3{font-family:var(--serif);font-weight:400;font-size:22px;line-height:1.2}
.mk-fw .wait .row2{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--muted)}
.mk-fw .avs{display:flex}
.mk-fw .avs i{width:24px;height:24px;border-radius:50%;border:2px solid #1a150f;margin-left:-6px;display:grid;place-items:center;font-style:normal;font-size:10px;font-weight:600;color:#1a140c}
.mk-fw .avs i:first-child{margin-left:0}
.mk-fw .wait .btn{justify-content:center;width:100%}
.mk-fw .wait small{font-size:12px;color:var(--dim)}
.mk-fw .ac-body{display:grid;grid-template-columns:1fr 340px;gap:24px;padding:28px 48px 40px}
.mk-fw .mgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.mk-fw .mod{position:relative;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--bg2);text-align:left;transition:border-color .2s,transform .2s}
.mk-fw .mod:hover{border-color:var(--line2);transform:translateY(-2px)}
.mk-fw .mod[aria-pressed="true"]{border-color:var(--gold)}
.mk-fw .mod-art{position:relative;height:84px;overflow:hidden}
.mk-fw .mod-art .still{filter:saturate(.7) brightness(.75)}
.mk-fw .mod-art .lk{position:absolute;right:10px;top:10px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(9,7,5,.72);border:1px solid var(--line2);color:var(--gold2)}
.mk-fw .mod-art .mn{position:absolute;left:14px;bottom:4px;font-family:var(--serif);font-style:italic;font-size:34px;color:rgba(243,237,226,.9);line-height:1}
.mk-fw .mod-c{padding:12px 14px 14px}
.mk-fw .mod-c b{display:block;font-family:var(--serif);font-weight:400;font-size:17px;line-height:1.25;min-height:42px}
.mk-fw .mod-c span{display:block;margin-top:6px;font-size:12px;color:var(--dim)}
.mk-fw .syl{border:1px solid var(--line);border-radius:6px;background:var(--bg2);padding:20px}
.mk-fw .syl h3{font-family:var(--serif);font-weight:400;font-size:22px;line-height:1.2;margin:6px 0 4px}
.mk-fw .syl .sub{font-size:12.5px;color:var(--dim)}
.mk-fw .syl ol{margin-top:14px;border-top:1px solid var(--line)}
.mk-fw .syl li{display:grid;grid-template-columns:22px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);font-size:13px;color:var(--muted)}
.mk-fw .syl li:first-child{color:var(--cream)}
.mk-fw .syl li .lkk{color:var(--dim)}
.mk-fw .syl li em{font-style:normal;font-size:12px;color:var(--dim);font-family:"IBM Plex Mono",monospace}
.mk-fw .prev{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-left:6px}

/* about drawer */
.mk-fw .scrim{position:absolute;inset:0;background:rgba(0,0,0,.55);z-index:10}
.mk-fw .drawer{position:absolute;top:0;right:0;bottom:0;width:420px;background:var(--bg2);border-left:1px solid var(--line2);z-index:11;padding:28px 32px;display:flex;flex-direction:column;gap:18px}
.mk-fw .drawer-h{display:flex;justify-content:space-between;align-items:center}
.mk-fw .drawer h2{font-family:var(--serif);font-weight:400;font-size:30px;line-height:1.1;letter-spacing:-.01em}
.mk-fw .drawer p{color:var(--muted);font-size:14.5px;line-height:1.65}
.mk-fw .host{display:flex;gap:14px;align-items:center;padding:16px;border:1px solid var(--line);border-radius:6px}
.mk-fw .host i{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-family:var(--serif);font-size:20px;font-style:italic;color:#1a140c;background:linear-gradient(135deg,#e5c690,#a77f45)}
.mk-fw .host b{display:block;font-weight:600}
.mk-fw .host span{font-size:12.5px;color:var(--dim)}
.mk-fw .dstats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:6px}
.mk-fw .dstats div{padding:14px 16px;border-left:1px solid var(--line)}
.mk-fw .dstats div:first-child{border-left:0}
.mk-fw .dstats b{display:block;font-family:var(--serif);font-weight:400;font-size:24px}
.mk-fw .dstats span{font-size:12px;color:var(--dim)}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const AV = ["#e4c48e", "#c9a46a", "#b9c4b0", "#d9b3a0", "#a9b6c9"];

export default function FoundersWayMockup() {
  const [view, setView] = useState<View>("home");
  const [epN, setEpN] = useState(14);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [quote, setQuote] = useState(0);
  const [series, setSeries] = useState<1 | 2 | 3>(2);
  const [order, setOrder] = useState<"new" | "old">("new");
  const [mod, setMod] = useState(3);
  const [waitlisted, setWaitlisted] = useState(false);
  const [about, setAbout] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const ep = EPISODES.find((e) => e.n === epN) ?? EPISODES[0];
  const total = toSecs(ep.dur);
  const chapters = useMemo(() => chaptersFor(ep), [ep]);
  let activeIdx = 0;
  chapters.forEach((c, i) => {
    if (pos >= c.at) activeIdx = i;
  });
  const active = chapters[activeIdx];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setPos((p) => Math.min(total, p + 2));
    }, 250);
    return () => clearInterval(t);
  }, [playing, total]);
  useEffect(() => {
    if (playing && pos >= total) setPlaying(false);
  }, [playing, pos, total]);

  const openEp = (n: number, autoplay = false) => {
    setEpN(n);
    setPos(0);
    setPlaying(autoplay);
    setView("episode");
  };
  const go = (v: View) => {
    setPlaying(false);
    setView(v);
  };
  const seekTo = (t: number) => {
    setPos(t);
    setPlaying(true);
  };

  const navCurrent = view === "episode" ? "home" : view;
  const upNext = useMemo(() => {
    const i = EPISODES.findIndex((e) => e.n === epN);
    return [1, 2, 3].map((k) => EPISODES[(i + k) % EPISODES.length]);
  }, [epN]);

  const seriesEps = EPISODES.filter((e) => e.series === series).sort((a, b) =>
    order === "new" ? b.n - a.n : a.n - b.n,
  );

  const subBtn = (cls = "") => (
    <button
      type="button"
      className={`btn ${subscribed ? "btn-done" : "btn-gold"} ${cls}`}
      aria-pressed={subscribed}
      onClick={() => setSubscribed((s) => !s)}
    >
      {subscribed ? <>{I.check(15)} Subscribed</> : "Subscribe"}
    </button>
  );

  /* ---------------- views ---------------- */

  const home = (
    <div className="fade" key="home">
      <section className="fw-hero">
        <Still scene="window" tone={0} wide />
        <div className="hero-tag">
          <span className="rec" /> New this week
        </div>
        <div className="hero-c">
          <div className="fw-eyebrow">Featured · Episode 14 · Series 2</div>
          <h1>Hiring your first ten people</h1>
          <p>{EPISODES[0].dek}</p>
          <div className="meta">
            <span>48 min</span>
            <i />
            <span>9 Oct 2026</span>
            <i />
            <span>8 chapters</span>
            <i />
            <span>Transcript</span>
          </div>
          <div className="hero-acts">
            <button type="button" className="btn btn-gold btn-lg" onClick={() => openEp(14, true)}>
              {I.play(16)} Play episode
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              aria-pressed={saved.includes(14)}
              onClick={() =>
                setSaved((s) => (s.includes(14) ? s.filter((x) => x !== 14) : [...s, 14]))
              }
            >
              {saved.includes(14) ? I.check(16) : I.bookmark(16)}
              {saved.includes(14) ? "Saved" : "Watch later"}
            </button>
          </div>
        </div>
        <div className="hero-credit">With the founder of a 70-person payroll start-up</div>
      </section>

      <section className="sec">
        <div className="fw-sec-h">
          <h2>
            Latest episodes<span>Series 2 · The First Hundred</span>
          </h2>
          <button type="button" className="more" onClick={() => go("series")}>
            All episodes {I.arrow(14)}
          </button>
        </div>
        <div className="grid4">
          {EPISODES.slice(1, 5).map((e) => (
            <button type="button" key={e.n} className="card" onClick={() => openEp(e.n)}>
              <div className="thumb">
                <Still scene={e.scene} tone={e.tone} />
                <span className="pbtn">{I.play(13)}</span>
                <span className="dur">{e.dur}</span>
              </div>
              <div className="card-ep">
                Episode {e.n} · {e.topic}
              </div>
              <h3>{e.title}</h3>
              <div className="meta">
                <span>{Math.round(toSecs(e.dur) / 60)} min</span>
                <i />
                <span>{e.date}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="quote" aria-label="From the series">
        <div className="qmark" aria-hidden="true">
          “
        </div>
        <div className="fade" key={quote}>
          <blockquote>{QUOTES[quote].q}</blockquote>
          <cite>
            <b>{QUOTES[quote].by}</b> · {QUOTES[quote].ep}
          </cite>
        </div>
        <div className="dots">
          {QUOTES.map((q, i) => (
            <button
              type="button"
              key={q.ep}
              className="dotb"
              aria-label={`Quote from ${q.ep}`}
              aria-pressed={quote === i}
              onClick={() => setQuote(i)}
            />
          ))}
        </div>
      </section>

      <section className="signup">
        <div>
          <div className="fw-eyebrow">The Thursday letter</div>
          <h2 style={{ marginTop: 10 }}>One conversation, every other Thursday.</h2>
          <p>
            Episode notes, the templates mentioned on air and nothing else. Read by 9,400 founders.
          </p>
        </div>
        <div>
          <div className="field">
            <span>{subscribed ? "you@company.com" : "Your email address"}</span>
            {subBtn()}
          </div>
          <div className="fine">
            {subscribed
              ? "You’re in. The next letter lands on Thursday 23 October."
              : "No spam. Unsubscribe in one click."}
          </div>
        </div>
      </section>

      <footer className="fw-foot">
        <span className="brand">
          The Founders’ <em>Way</em>
        </span>
        <span>© 2026 · Episodes · Series · Academy · Press kit · Privacy</span>
      </footer>
    </div>
  );

  const pct = (pos / total) * 100;
  const episode = (
    <div className="ep fade" key={`ep-${ep.n}`}>
      <div>
        <div className="crumbs">
          <button type="button" onClick={() => go("home")}>
            Episodes
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => {
              setSeries(ep.series);
              go("series");
            }}
          >
            Series {ep.series} · {SERIES[ep.series - 1].name}
          </button>
          <span>/</span>
          <span style={{ color: "var(--cream)" }}>Episode {ep.n}</span>
        </div>
        <div className="player">
          <Still scene={ep.scene} tone={ep.tone} />
          <div className="player-shade" />
          <div className="ptop">
            <span className="serif">
              <i>Episode {ep.n}</i> · {ep.title}
            </span>
            <span className="meta" style={{ color: "rgba(243,237,226,.8)" }}>
              <span className={`rec${playing ? " on" : ""}`} />{" "}
              {playing ? "Playing" : pos > 0 ? "Paused" : "HD · 1080p"}
            </span>
          </div>
          {!playing && pos === 0 && (
            <button
              type="button"
              className="bigplay"
              aria-label="Play episode"
              onClick={() => setPlaying(true)}
            >
              {I.play(34)}
            </button>
          )}
          {(playing || pos > 0) && (
            <div className="caption fade" key={activeIdx}>
              {active.line}
            </div>
          )}
          <div className="ctrls">
            <button
              type="button"
              className="track"
              aria-label="Seek"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
                seekTo(Math.round(ratio * total));
              }}
            >
              <span className="track-bg">
                <span className="track-buf" style={{ width: `${Math.min(100, pct + 14)}%` }} />
                <span className="track-fill" style={{ width: `${pct}%` }} />
              </span>
              {chapters.slice(1).map((c) => (
                <span key={c.at} className="tick" style={{ left: `${(c.at / total) * 100}%` }} />
              ))}
              <span className="knob" style={{ left: `${pct}%` }} />
            </button>
            <div className="crow">
              <button
                type="button"
                className="icon-btn"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? I.pause(18) : I.play(18)}
              </button>
              <button type="button" className="icon-btn" aria-label="Volume">
                {I.volume(18)}
              </button>
              <span className="time">
                {fmt(pos)} / {ep.dur}
              </span>
              <span className="chap-now">
                · <b>{active.title}</b>
              </span>
              <span style={{ flex: 1 }} />
              <span className="speed">1×</span>
              <button type="button" className="icon-btn" aria-label="Captions">
                {I.cc(18)}
              </button>
              <button type="button" className="icon-btn" aria-label="Full screen">
                {I.full(18)}
              </button>
            </div>
          </div>
        </div>

        <div className="ep-head">
          <div>
            <div className="fw-eyebrow">
              Episode {ep.n} · {ep.topic}
            </div>
            <h1>{ep.title}</h1>
            <div className="meta">
              <span>{ep.guest}</span>
              <i />
              <span>Hosted by R.</span>
              <i />
              <span>{ep.date}</span>
              <i />
              <span>{Math.round(total / 60)} min</span>
            </div>
          </div>
          <div className="ep-acts">
            <button
              type="button"
              className="btn btn-ghost"
              aria-pressed={saved.includes(ep.n)}
              onClick={() =>
                setSaved((s) => (s.includes(ep.n) ? s.filter((x) => x !== ep.n) : [...s, ep.n]))
              }
            >
              {saved.includes(ep.n) ? I.check(15) : I.bookmark(15)}
              {saved.includes(ep.n) ? "Saved" : "Save"}
            </button>
            <button type="button" className="btn btn-ghost">
              {I.share(15)} Share
            </button>
          </div>
        </div>

        <div className="notes">
          <div>
            <h4>Episode notes</h4>
            <p>
              {ep.dek} Recorded in London in {ep.series === 2 ? "summer 2026" : "winter 2025"}, this
              conversation is part of Series {ep.series}, <i>{SERIES[ep.series - 1].name}</i>.
            </p>
            {ep.n === 14 && (
              <ul className="takeaways">
                <li>
                  <span>i.</span>Write the scorecard before the job advert, not after the first
                  interview.
                </li>
                <li>
                  <span>ii.</span>Hire for slope: how fast someone learns beats where they have
                  already been.
                </li>
                <li>
                  <span>iii.</span>Make the offer on a call, say the number first, then stop
                  talking.
                </li>
              </ul>
            )}
          </div>
          <div>
            <h4>Resources</h4>
            <ul className="res">
              <li>
                Full transcript <em>PDF · 31 pp</em>
              </li>
              <li>
                Role scorecard template <em>Doc</em>
              </li>
              <li>
                Offer call script <em>Doc</em>
              </li>
              <li>
                Audio-only version <em>MP3 · 44 MB</em>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <aside className="side">
        <h3>
          Chapters<span>{chapters.length} chapters</span>
        </h3>
        <ol className="chaps">
          {chapters.map((c, i) => (
            <li key={c.at}>
              <button
                type="button"
                className="chap"
                aria-current={i === activeIdx && (playing || pos > 0) ? "true" : undefined}
                onClick={() => seekTo(c.at)}
              >
                <span className="ts">{fmt(c.at)}</span>
                <span>{c.title}</span>
                {i === activeIdx && (playing || pos > 0) ? (
                  <span className={`eq${playing ? " on" : ""}`} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <span />
                )}
              </button>
            </li>
          ))}
        </ol>

        <div className="upnext">
          <h3>
            Up next<span>Autoplay on</span>
          </h3>
          <div style={{ marginTop: 8 }}>
            {upNext.map((e) => (
              <button type="button" key={e.n} className="mini" onClick={() => openEp(e.n)}>
                <div className="thumb">
                  <Still scene={e.scene} tone={e.tone} />
                  <span className="dur">{e.dur}</span>
                </div>
                <div>
                  <small>Episode {e.n}</small>
                  <b>{e.title}</b>
                  <span>{e.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );

  const sMeta = SERIES[series - 1];
  const seriesView = (
    <div className="fade" key="series">
      <header className="page-h">
        <div>
          <div className="fw-eyebrow">Series</div>
          <h1>Three seasons, one question</h1>
        </div>
        <p>
          How do ordinary people build companies that last? Each series follows one stage, one
          founder at a time.
        </p>
      </header>
      <div className="sgrid">
        {SERIES.map((s) => (
          <button
            type="button"
            key={s.id}
            className="scard"
            aria-pressed={series === s.id}
            onClick={() => setSeries(s.id as 1 | 2 | 3)}
          >
            <Still scene={s.scene} tone={s.tone} />
            <span className={`badge${s.id === 3 ? " gold" : ""}`}>
              {s.id === 3 ? "Coming soon" : s.id === 2 ? "Now airing" : "Complete"}
            </span>
            <div className="scard-c">
              <div className="fw-eyebrow">Series {s.id}</div>
              <b>{s.name}</b>
              <span>{s.meta}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="elist">
        <div className="elist-h">
          <p>{sMeta.blurb}</p>
          {seriesEps.length > 0 && (
            <div className="seg" role="group" aria-label="Sort episodes">
              <button type="button" aria-pressed={order === "new"} onClick={() => setOrder("new")}>
                Newest
              </button>
              <button type="button" aria-pressed={order === "old"} onClick={() => setOrder("old")}>
                Oldest
              </button>
            </div>
          )}
        </div>
        {seriesEps.length === 0 ? (
          <div className="empty">
            <b>Filming now. First episode 14 January 2027.</b>
            Subscribe and we’ll send it the morning it goes live.
            <div className="upc">
              {[
                ["15", "Your second leadership team", "Filming"],
                ["16", "Opening a second office", "In edit"],
                ["17", "Keeping the bar as you grow", "Scheduled"],
              ].map(([n, t, st]) => (
                <div key={n} className="upc-i">
                  <span className="num">{n}</span>
                  <span>{t}</span>
                  <span className="badge gold">{st}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>{subBtn()}</div>
          </div>
        ) : (
          seriesEps.map((e) => (
            <button type="button" key={e.n} className="row" onClick={() => openEp(e.n)}>
              <span className="num">{e.n}</span>
              <div className="thumb">
                <Still scene={e.scene} tone={e.tone} />
                <span className="dur">{e.dur}</span>
              </div>
              <div>
                <b>{e.title}</b>
                <p>{e.dek}</p>
              </div>
              <span className="when">
                {e.date}
                <br />
                {e.topic}
              </span>
              <span className="chev">{I.arrow(16)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const m = MODULES[mod];
  const academy = (
    <div className="fade" key="academy">
      <div className="ac-top">
        <div>
          <div className="fw-eyebrow">Academy · Opening March 2027</div>
          <h1>The Founders’ Academy</h1>
          <p>
            Six self-paced modules built from fourteen episodes of hard-won lessons, with the
            templates, worked examples and a monthly live Q&amp;A with the host.
          </p>
          <div className="ac-stats">
            <div>
              <b>6</b>
              <span>Modules</span>
            </div>
            <div>
              <b>41</b>
              <span>Lessons</span>
            </div>
            <div>
              <b>12h</b>
              <span>Of teaching</span>
            </div>
            <div>
              <b>18</b>
              <span>Templates</span>
            </div>
          </div>
        </div>
        <div className="wait">
          <div className="fw-eyebrow">Founding cohort</div>
          <h3>Join the waitlist for early access and 30% off the founding price.</h3>
          <div className="row2">
            <span className="avs">
              {["A", "K", "S", "M", "J"].map((a, i) => (
                <i key={a} style={{ background: AV[i] }}>
                  {a}
                </i>
              ))}
            </span>
            <span>
              <b style={{ color: "var(--cream)" }}>{waitlisted ? "2,419" : "2,418"}</b> founders
              waiting
            </span>
          </div>
          <button
            type="button"
            className={`btn btn-lg ${waitlisted ? "btn-done" : "btn-gold"}`}
            aria-pressed={waitlisted}
            onClick={() => setWaitlisted((w) => !w)}
          >
            {waitlisted ? (
              <>{I.check(16)} You’re on the list</>
            ) : (
              <>Join the waitlist {I.arrow(16)}</>
            )}
          </button>
          <small>
            {waitlisted
              ? "We’ll email you a week before doors open on 3 March 2027."
              : "One email when doors open. No other marketing."}
          </small>
        </div>
      </div>
      <div className="ac-body">
        <div className="mgrid">
          {MODULES.map((x, i) => (
            <button
              type="button"
              key={x.n}
              className="mod"
              aria-pressed={mod === i}
              onClick={() => setMod(i)}
            >
              <div className="mod-art">
                <Still
                  scene={(["horizon", "duo", "stage", "window", "city", "horizon"] as Scene[])[i]}
                  tone={x.tone}
                />
                <span className="mn">{x.n}</span>
                <span className="lk">{I.lock(14)}</span>
              </div>
              <div className="mod-c">
                <b>{x.title}</b>
                <span>
                  {x.lessons} lessons · {x.time} · {x.extras}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="syl fade" key={m.n}>
          <div className="fw-eyebrow">Module {m.n} · Locked</div>
          <h3>{m.title}</h3>
          <div className="sub">
            {m.lessons} lessons · {m.time} · {m.extras}
          </div>
          <ol>
            {m.syllabus.slice(0, 6).map(([t, d], i) => (
              <li key={t}>
                <span className="lkk">{i === 0 ? I.play(13) : I.lock(13)}</span>
                <span>
                  {t}
                  {i === 0 && <span className="prev">Preview</span>}
                </span>
                <em>{d}</em>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mk-fw">
      <style>{CSS}</style>
      <nav className="fw-nav" aria-label="Main">
        <button type="button" className="brand" onClick={() => go("home")}>
          <span className="brand-mark">fw</span>
          <span>
            The Founders’ <em>Way</em>
          </span>
        </button>
        <div className="links">
          <button
            type="button"
            className="link"
            aria-current={navCurrent === "home" ? "page" : undefined}
            onClick={() => go("home")}
          >
            Episodes
          </button>
          <button
            type="button"
            className="link"
            aria-current={navCurrent === "series" ? "page" : undefined}
            onClick={() => go("series")}
          >
            Series
          </button>
          <button
            type="button"
            className="link"
            aria-current={navCurrent === "academy" ? "page" : undefined}
            onClick={() => go("academy")}
          >
            Academy <span className="soon">Soon</span>
          </button>
          <button
            type="button"
            className="link"
            aria-expanded={about}
            onClick={() => setAbout(true)}
          >
            About
          </button>
        </div>
        <div className="fw-nav-r">
          <button type="button" className="icon-btn" aria-label="Search episodes">
            {I.search(18)}
          </button>
          {subBtn()}
        </div>
      </nav>

      <main className="main">
        {view === "home" && home}
        {view === "episode" && episode}
        {view === "series" && seriesView}
        {view === "academy" && academy}
      </main>

      {about && (
        <>
          <button
            type="button"
            className="scrim"
            aria-label="Close about panel"
            onClick={() => setAbout(false)}
          />
          <aside className="drawer fade" aria-label="About the show">
            <div className="drawer-h">
              <div className="fw-eyebrow">About the show</div>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close"
                onClick={() => setAbout(false)}
              >
                {I.close(18)}
              </button>
            </div>
            <h2>Long conversations about the unglamorous middle of building a company.</h2>
            <p>
              No hype, no hacks. Each episode sits down with one founder for an hour and works
              through a single hard decision: the hire, the price, the round, the conversation they
              put off.
            </p>
            <div className="host">
              <i>R.</i>
              <div>
                <b>Hosted by R.</b>
                <span>Three-time founder, one exit, one honest failure</span>
              </div>
            </div>
            <div className="dstats">
              <div>
                <b>14</b>
                <span>Episodes</span>
              </div>
              <div>
                <b>11h</b>
                <span>Hours filmed</span>
              </div>
              <div>
                <b>9.4k</b>
                <span>Subscribers</span>
              </div>
            </div>
            <p style={{ fontSize: 13 }}>
              New episodes every other Thursday at 7am. Filmed in London.
            </p>
            {subBtn("btn-lg")}
          </aside>
        </>
      )}
    </div>
  );
}
