import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Foot = "L" | "R";
type Avail = "Under contract" | "Expiring 2027" | "Free agent" | "Loan option";
type Stage = "watching" | "assessed" | "recommended" | "approached";
type View = "database" | "profile" | "shortlists" | "activity";

interface Keeper {
  id: string;
  name: string;
  ini: string;
  age: number;
  h: number;
  foot: Foot;
  club: string;
  league: string;
  rating: number;
  trend: number;
  reports: number;
  seen: string;
  avail: Avail;
  nat: string;
  hue: number;
}

const KEEPERS: Keeper[] = [
  {
    id: "okafor",
    name: "Tom Okafor",
    ini: "TO",
    age: 22,
    h: 191,
    foot: "R",
    club: "Northbridge FC",
    league: "Championship",
    rating: 84,
    trend: 3,
    reports: 9,
    seen: "2026-10-24",
    avail: "Expiring 2027",
    nat: "ENG",
    hue: 78,
  },
  {
    id: "haddad",
    name: "Sami Haddad",
    ini: "SH",
    age: 24,
    h: 189,
    foot: "R",
    club: "Kingsmoor Town",
    league: "League One",
    rating: 81,
    trend: 2,
    reports: 7,
    seen: "2026-10-21",
    avail: "Under contract",
    nat: "ENG",
    hue: 190,
  },
  {
    id: "marsh",
    name: "Elliot Marsh",
    ini: "EM",
    age: 27,
    h: 195,
    foot: "R",
    club: "Ashvale United",
    league: "Championship",
    rating: 80,
    trend: -1,
    reports: 11,
    seen: "2026-10-18",
    avail: "Loan option",
    nat: "WAL",
    hue: 220,
  },
  {
    id: "asante",
    name: "Daniel Asante",
    ini: "DA",
    age: 23,
    h: 192,
    foot: "R",
    club: "Ferrybridge City",
    league: "League One",
    rating: 79,
    trend: 4,
    reports: 5,
    seen: "2026-10-26",
    avail: "Under contract",
    nat: "ENG",
    hue: 30,
  },
  {
    id: "brennan",
    name: "Luca Brennan",
    ini: "LB",
    age: 19,
    h: 193,
    foot: "L",
    club: "Harbour Athletic",
    league: "U21",
    rating: 78,
    trend: 5,
    reports: 6,
    seen: "2026-10-27",
    avail: "Under contract",
    nat: "IRL",
    hue: 150,
  },
  {
    id: "reid",
    name: "Callum Reid",
    ini: "CR",
    age: 25,
    h: 187,
    foot: "L",
    club: "Dunmore Thistle",
    league: "Scottish Prem",
    rating: 77,
    trend: 0,
    reports: 4,
    seen: "2026-10-11",
    avail: "Expiring 2027",
    nat: "SCO",
    hue: 265,
  },
  {
    id: "calloway",
    name: "Rory Calloway",
    ini: "RC",
    age: 21,
    h: 188,
    foot: "L",
    club: "Westgate Rovers",
    league: "League Two",
    rating: 76,
    trend: 2,
    reports: 3,
    seen: "2026-10-19",
    avail: "Loan option",
    nat: "ENG",
    hue: 340,
  },
  {
    id: "varela",
    name: "Mateo Varela",
    ini: "MV",
    age: 20,
    h: 194,
    foot: "R",
    club: "Holloway Park",
    league: "U21",
    rating: 75,
    trend: 6,
    reports: 2,
    seen: "2026-10-25",
    avail: "Under contract",
    nat: "ESP",
    hue: 10,
  },
  {
    id: "pemberton",
    name: "Isaac Pemberton",
    ini: "IP",
    age: 26,
    h: 191,
    foot: "R",
    club: "Redcliffe Albion",
    league: "League One",
    rating: 74,
    trend: -2,
    reports: 5,
    seen: "2026-10-08",
    avail: "Expiring 2027",
    nat: "ENG",
    hue: 200,
  },
  {
    id: "adeyemi",
    name: "Femi Adeyemi",
    ini: "FA",
    age: 22,
    h: 196,
    foot: "R",
    club: "Saltmarsh Town",
    league: "League Two",
    rating: 73,
    trend: 1,
    reports: 3,
    seen: "2026-10-14",
    avail: "Loan option",
    nat: "ENG",
    hue: 45,
  },
  {
    id: "whitlock",
    name: "Jonah Whitlock",
    ini: "JW",
    age: 30,
    h: 190,
    foot: "R",
    club: "Castleton FC",
    league: "League Two",
    rating: 72,
    trend: -1,
    reports: 4,
    seen: "2026-09-27",
    avail: "Free agent",
    nat: "ENG",
    hue: 120,
  },
  {
    id: "ashworth",
    name: "Ben Ashworth",
    ini: "BA",
    age: 18,
    h: 190,
    foot: "R",
    club: "Northbridge FC",
    league: "U21",
    rating: 71,
    trend: 4,
    reports: 2,
    seen: "2026-10-22",
    avail: "Under contract",
    nat: "ENG",
    hue: 290,
  },
];

const LEAGUES = ["Championship", "League One", "League Two", "Scottish Prem", "U21"];
const AVAILS: Avail[] = ["Under contract", "Expiring 2027", "Free agent", "Loan option"];

interface Scout {
  id: string;
  name: string;
  short: string;
  ini: string;
  role: string;
  c: string;
}
const SCOUTS: Scout[] = [
  {
    id: "hc",
    name: "Hannah Clarke",
    short: "H. Clarke",
    ini: "HC",
    role: "Senior scout · North",
    c: "linear-gradient(135deg,#f0a868,#c2553a)",
  },
  {
    id: "dm",
    name: "Dev Mistry",
    short: "D. Mistry",
    ini: "DM",
    role: "Video analyst",
    c: "linear-gradient(135deg,#7aa7ff,#3d58c9)",
  },
  {
    id: "jp",
    name: "Jas Patel",
    short: "J. Patel",
    ini: "JP",
    role: "Lead GK scout",
    c: "linear-gradient(135deg,#c6f432,#5f9a12)",
  },
  {
    id: "ol",
    name: "Owen Lacey",
    short: "O. Lacey",
    ini: "OL",
    role: "Scout · Scotland",
    c: "linear-gradient(135deg,#d58cf0,#7a3fb3)",
  },
];
const ME = { name: "Sam Whitfield", ini: "SW", role: "Head of recruitment" };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string, year = false) {
  const [y, m, d] = iso.split("-");
  return `${+d} ${MONTHS[+m - 1]}${year ? ` ${y}` : ""}`;
}

const ATTRS: { k: string; off: number; avg: number }[] = [
  { k: "Shot stopping", off: 2, avg: 74 },
  { k: "Handling", off: -2, avg: 72 },
  { k: "1v1 / spreading", off: 1, avg: 70 },
  { k: "Aerial command", off: -4, avg: 71 },
  { k: "Sweeping", off: 3, avg: 66 },
  { k: "Short distribution", off: 4, avg: 69 },
  { k: "Long distribution", off: -5, avg: 67 },
  { k: "Communication", off: -3, avg: 70 },
  { k: "Positioning", off: 0, avg: 72 },
  { k: "Decision making", off: -1, avg: 70 },
];
function attrVal(k: Keeper, i: number) {
  const idx = KEEPERS.indexOf(k);
  const v = k.rating + ATTRS[i].off + ((idx * 7 + i * 13) % 9) - 4;
  return Math.max(52, Math.min(94, v));
}

const HEAT: Record<"saves" | "claims" | "sweeps", number[][]> = {
  saves: [
    [0.06, 0.38, 0.86, 0.92, 0.42, 0.06],
    [0.05, 0.26, 0.62, 0.7, 0.3, 0.04],
    [0, 0.1, 0.24, 0.3, 0.12, 0],
    [0, 0.04, 0.08, 0.1, 0.05, 0],
    [0, 0, 0.02, 0.03, 0, 0],
  ],
  claims: [
    [0.1, 0.48, 0.66, 0.58, 0.52, 0.1],
    [0.16, 0.62, 0.92, 0.8, 0.5, 0.2],
    [0.05, 0.3, 0.46, 0.5, 0.26, 0.05],
    [0, 0.05, 0.1, 0.12, 0.05, 0],
    [0, 0, 0, 0.02, 0, 0],
  ],
  sweeps: [
    [0, 0.02, 0.05, 0.05, 0.02, 0],
    [0.05, 0.1, 0.16, 0.2, 0.1, 0.05],
    [0.2, 0.46, 0.62, 0.56, 0.4, 0.15],
    [0.26, 0.52, 0.88, 0.72, 0.46, 0.2],
    [0.1, 0.26, 0.4, 0.46, 0.22, 0.05],
  ],
};
const HEAT_STATS: Record<keyof typeof HEAT, [string, string][]> = {
  saves: [
    ["Save %", "74.2"],
    ["PSxG +/-", "+2.8"],
    ["Saves / 90", "3.1"],
  ],
  claims: [
    ["Claims / 90", "2.4"],
    ["Claim %", "91"],
    ["Punches", "0.6"],
  ],
  sweeps: [
    ["Sweeps / 90", "1.4"],
    ["Avg dist.", "17.8m"],
    ["Won", "88%"],
  ],
};

const OPPONENTS = ["Ferrybridge City", "Harbour Athletic", "Castleton FC", "Redcliffe Albion"];
const NOTES = [
  "Set a high starting position all game and swept twice beyond the box. Builds on Hannah's point: it is now consistent, not a one-off.",
  "Re-watched against a direct side. Claims crosses at full stretch and talks his back four through every set piece.",
  "Calm on the ball and picks passes into midfield under pressure. Distribution is the standout trait for our model.",
  "First look. Good set position, low dives to his left a touch slow. Worth a live viewing before the window opens.",
];
const KINDS = ["Live match", "Video review", "Live match", "First look"];
const ENTRY_DATES = ["", "2026-09-29", "2026-09-12", "2026-08-21"];

function timeline(k: Keeper) {
  const idx = KEEPERS.indexOf(k);
  return [0, 1, 2, 3].map((i) => {
    const s = SCOUTS[(i + idx) % 4];
    const date = i === 0 ? k.seen : ENTRY_DATES[i];
    const opp = OPPONENTS[(i + idx) % 4] === k.club ? "Westgate Rovers" : OPPONENTS[(i + idx) % 4];
    const home = (i + idx) % 2 === 0;
    const score = ["2–1", "0–0", "1–1", "3–2"][(i + idx * 3) % 4];
    return {
      scout: s,
      date,
      kind: KINDS[i],
      match: home ? `${k.club} ${score} ${opp}` : `${opp} ${score} ${k.club}`,
      grade: k.rating + [0, -2, 1, -4][i],
      note: NOTES[i],
    };
  });
}

type ListId = "first" | "u21" | "loan";
const LISTS: { id: ListId; name: string; owner: string }[] = [
  { id: "first", name: "First-team GK · Summer 2027", owner: "Sam Whitfield" },
  { id: "u21", name: "U21 development", owner: "Jas Patel" },
  { id: "loan", name: "January loan cover", owner: "Hannah Clarke" },
];
const STAGES: { id: Stage; label: string; hint: string }[] = [
  { id: "watching", label: "Watching", hint: "Needs eyes" },
  { id: "assessed", label: "Assessed", hint: "2+ reports" },
  { id: "recommended", label: "Recommended", hint: "For sign-off" },
  { id: "approached", label: "Approached", hint: "In talks" },
];
const CARD_NOTES = [
  "Best distributor we have seen this season. Ready now.",
  "Four reports, all 79+. Live check booked for Saturday.",
  "Club open to a loan with option in January.",
  "Clean sheets in 3 straight. Commanding his box more.",
  "Left foot is genuine. U21 coach confirms in training.",
  "Starting position on crosses still deep. One more look.",
  "Quick off his line, brave in 1v1s. Needs a live viewing.",
  "Raw, but 1.94m and moves well. Track through the spring.",
  "Steady, experienced. Contract talks stalled at his club.",
  "Huge frame, good reach. Distribution is the question.",
];

const INITIAL_BOARD: Record<ListId, Record<string, Stage>> = {
  first: {
    okafor: "recommended",
    haddad: "recommended",
    marsh: "approached",
    asante: "assessed",
    reid: "assessed",
    calloway: "assessed",
    pemberton: "watching",
    adeyemi: "watching",
  },
  u21: { brennan: "assessed", varela: "watching", ashworth: "watching", calloway: "recommended" },
  loan: { adeyemi: "assessed", whitlock: "approached", calloway: "watching", reid: "watching" },
};

type FeedKind = "assessment" | "note" | "move";
interface FeedItem {
  id: string;
  scout: number;
  when: string;
  kind: FeedKind;
  keeper: string;
  verb: string;
  text: string;
  meta?: string;
  grade?: number;
  builds?: string;
  useful: number;
}
const FEED: FeedItem[] = [
  {
    id: "f1",
    scout: 2,
    when: "2h ago",
    kind: "assessment",
    keeper: "okafor",
    verb: "assessed",
    text: "Third live viewing. Now the most press-resistant keeper on our list: 11 of 12 passes under pressure found a teammate, and he swept twice beyond the box.",
    meta: "Northbridge FC 2–1 Harbour Athletic",
    grade: 84,
    builds: "Builds on Hannah Clarke's assessment · 3 Oct",
    useful: 6,
  },
  {
    id: "f2",
    scout: 0,
    when: "4h ago",
    kind: "note",
    keeper: "brennan",
    verb: "added a note on",
    text: "Spoke to the U21 coach. He uses his left foot for switches in training too, not just on match day. Adding this to Dev's clip reel.",
    builds: "Builds on Dev Mistry's video review · yesterday",
    useful: 3,
  },
  {
    id: "f3",
    scout: 1,
    when: "Yesterday",
    kind: "move",
    keeper: "haddad",
    verb: "moved to Recommended",
    text: "Four assessments now, all 79 or above. Nothing left to learn from video, so recommending a live check by Sam before the window.",
    meta: "First-team GK · Summer 2027",
    useful: 7,
  },
  {
    id: "f4",
    scout: 3,
    when: "Yesterday",
    kind: "assessment",
    keeper: "reid",
    verb: "assessed",
    text: "Comfortable in a back three build-up. Starting position on crosses still deep; worth a second look in a wet away game.",
    meta: "Dunmore Thistle 1–1 Kilbride Rovers",
    grade: 77,
    useful: 2,
  },
  {
    id: "f5",
    scout: 1,
    when: "26 Oct",
    kind: "note",
    keeper: "varela",
    verb: "uploaded 6 clips to",
    text: "Clip pack from the last three U21 games: two strong 1v1s, one error playing out. Tagged by zone so the heatmap updates.",
    builds: "Answers Jas Patel's question · 25 Oct",
    useful: 4,
  },
  {
    id: "f6",
    scout: 2,
    when: "25 Oct",
    kind: "move",
    keeper: "asante",
    verb: "added to Watching",
    text: "Kept three clean sheets in a row and is starting to command the box. Flagging early so Owen can cover the away game on Saturday.",
    meta: "First-team GK · Summer 2027",
    useful: 2,
  },
  {
    id: "f7",
    scout: 0,
    when: "24 Oct",
    kind: "note",
    keeper: "marsh",
    verb: "added a note on",
    text: "Agent confirms the club would consider a loan with an option in January. Fee expectations still high for the permanent deal.",
    useful: 5,
  },
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, string> = {
  db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  board: "M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z",
  pulse: "M3 12h4l3-7 4 14 3-7h4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4a2 2 0 0 0 4 0",
  plus: "M12 5v14M5 12h14",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8L12 3.5Z",
  back: "M15 5l-7 7 7 7",
  arrow: "M5 12h14M13 6l6 6-6 6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  x: "M6 6l12 12M18 6 6 18",
  chev: "M6 9l6 6 6-6",
  bookmark: "M7 4h10v16l-5-4-5 4z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2",
  thumb:
    "M7 11v9H4v-9h3Zm0 0 4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7",
  sort: "M8 5v14M8 19l-3-3M8 19l3-3M16 19V5M16 5l-3 3M16 5l3 3",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  video: "M4 6h11v12H4zM15 10l5-3v10l-5-3",
  filter: "M4 5h16l-6 8v6l-4-2v-4z",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  check: "M5 12l5 5 9-10",
  compare: "M8 4v16M16 4v16M4 8h8M12 16h8",
  cal: "M5 6h14v14H5zM5 10h14M9 3v4M15 3v4",
};
function Icon({ n, s = 16, fill = false }: { n: string; s?: number; fill?: boolean }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" className="mk-sh-ic">
      <path
        d={ICONS[n]}
        fill={fill ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Av({ k, size = 28 }: { k: Keeper; size?: number }) {
  return (
    <span
      className="mk-sh-av"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg,hsl(${k.hue} 38% 34%),hsl(${(k.hue + 40) % 360} 30% 18%))`,
      }}
    >
      {k.ini}
    </span>
  );
}
function ScoutAv({ s, size = 24 }: { s: Scout; size?: number }) {
  return (
    <span
      className="mk-sh-av mk-sh-sav"
      style={{ width: size, height: size, fontSize: size * 0.38, background: s.c }}
      title={s.name}
    >
      {s.ini}
    </span>
  );
}
function Rating({ v, big = false }: { v: number; big?: boolean }) {
  const tier = v >= 80 ? "hi" : v >= 75 ? "mid" : "lo";
  return <span className={`mk-sh-rt mk-sh-rt-${tier}${big ? " mk-sh-rt-big" : ""}`}>{v}</span>;
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-sh{--bg:#08090b;--p1:#0e1013;--p2:#13161a;--p3:#191d22;--ln:#22262c;--ln2:#2c3138;--tx:#e8ebef;--mu:#9097a1;--dim:#626973;--ac:#c6f432;--ac2:rgba(198,244,50,.12);--ac3:rgba(198,244,50,.28);
  width:100%;height:100%;overflow:hidden;position:relative;background:var(--bg);color:var(--tx);font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:1.4;display:grid;grid-template-rows:52px 1fr;-webkit-font-smoothing:antialiased}
.mk-sh *{box-sizing:border-box}
.mk-sh :where(h1,h2,h3,p,ul,ol){margin:0;padding:0;list-style:none}
.mk-sh :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;text-align:inherit}
.mk-sh button:focus-visible{outline:2px solid var(--ac);outline-offset:1px}
.mk-sh .mk-sh-ic{flex:none;display:block}
.mk-sh .mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}

/* top bar */
.mk-sh-top{display:flex;align-items:center;gap:16px;padding:0 16px 0 14px;border-bottom:1px solid var(--ln);background:var(--p1)}
.mk-sh-brand{display:flex;align-items:center;gap:10px;width:174px;font-weight:700;font-size:14.5px;letter-spacing:-.01em}
.mk-sh-logo{width:26px;height:26px;border-radius:7px;background:var(--ac);color:#0b0d07;display:grid;place-items:center}
.mk-sh-ws{display:flex;align-items:center;gap:6px;color:var(--mu);font-size:12.5px;padding:5px 8px;border:1px solid var(--ln);border-radius:7px}
.mk-sh-search{flex:1;max-width:480px;height:34px;display:flex;align-items:center;gap:9px;padding:0 10px;border:1px solid var(--ln2);border-radius:8px;background:var(--p2);color:var(--mu)}
.mk-sh-q{color:var(--tx);font-size:13px;white-space:nowrap}
.mk-sh-q b{font-weight:500;color:var(--ac)}
.mk-sh-caret{display:inline-block;width:1.5px;height:15px;background:var(--ac);margin-left:1px;vertical-align:-3px}
.mk-sh-kbd{margin-left:auto;font-size:11px;color:var(--dim);border:1px solid var(--ln2);border-radius:4px;padding:1px 5px}
.mk-sh-qn{font-size:11.5px;color:var(--dim);white-space:nowrap}
.mk-sh-right{margin-left:auto;display:flex;align-items:center;gap:14px}
.mk-sh-online{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mu)}
.mk-sh-stack{display:flex}
.mk-sh-stack .mk-sh-on{position:relative;margin-left:3px;display:block;line-height:0;border-radius:50%;box-shadow:0 0 0 2px var(--p1)}
.mk-sh-stack .mk-sh-av{box-shadow:0 0 0 2px var(--p1)}
.mk-sh-stack .mk-sh-on:first-child{margin-left:0}
.mk-sh-on::after{content:"";position:absolute;right:-1px;bottom:-1px;width:8px;height:8px;border-radius:50%;background:#3ddc84;box-shadow:0 0 0 2px var(--p1)}
.mk-sh-icb{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;color:var(--mu);position:relative;border:1px solid transparent}
.mk-sh-icb:hover{background:var(--p3);color:var(--tx)}
.mk-sh-dot{position:absolute;top:7px;right:8px;width:6px;height:6px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 2px var(--p1)}
.mk-sh-cta{display:flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:8px;background:var(--ac);color:#0b0d07 !important;font-weight:600;font-size:12.5px}
.mk-sh-cta:hover{background:#d4ff4a}
.mk-sh-ghost{display:flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:7px;border:1px solid var(--ln2);color:var(--tx);font-size:12.5px;font-weight:500;background:var(--p2)}
.mk-sh-ghost:hover{border-color:#3a4049;background:var(--p3)}

/* shell */
.mk-sh-body{display:grid;grid-template-columns:188px 1fr;min-height:0}
.mk-sh-side{border-right:1px solid var(--ln);background:var(--p1);padding:12px 10px;display:flex;flex-direction:column;gap:2px;min-height:0}
.mk-sh-nav{display:flex;align-items:center;gap:9px;height:32px;padding:0 9px;border-radius:7px;color:var(--mu);font-weight:500;width:100%}
.mk-sh-nav:hover{background:var(--p3);color:var(--tx)}
.mk-sh-nav[aria-current="page"]{background:var(--p3);color:var(--tx);box-shadow:inset 2px 0 0 var(--ac)}
.mk-sh-nav[aria-current="page"] .mk-sh-ic{color:var(--ac)}
.mk-sh-nav .n{margin-left:auto;font-size:11px;color:var(--dim)}
.mk-sh-nav .new{margin-left:auto;font-size:11px;font-weight:600;color:#0b0d07;background:var(--ac);border-radius:9px;padding:0 6px;line-height:17px}
.mk-sh-sh{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);font-weight:600;padding:16px 9px 6px}
.mk-sh-sv{display:flex;align-items:center;gap:8px;height:28px;padding:0 9px;border-radius:7px;color:var(--mu);font-size:12.5px;width:100%;white-space:nowrap;overflow:hidden}
.mk-sh-sv:hover{background:var(--p3);color:var(--tx)}
.mk-sh-sv .mk-sh-ic{color:var(--dim)}
.mk-sh-me{display:flex;align-items:center;gap:9px;padding:10px 6px 2px;border-top:1px solid var(--ln)}
.mk-sh-me b{display:block;font-size:12.5px;font-weight:600}
.mk-sh-me div span{font-size:11.5px;color:var(--dim)}
.mk-sh-health{margin:auto 4px 0;padding:10px;border:1px solid var(--ln);border-radius:9px;background:var(--p2)}
.mk-sh-health p{font-size:11.5px;color:var(--dim);margin-top:7px;line-height:1.35}
.mk-sh-health p b{color:var(--tx);font-weight:500}
.mk-sh-hb{display:block;height:5px;border-radius:3px;background:#22262c;position:relative;overflow:hidden}
.mk-sh-hb i{position:absolute;inset:0 auto 0 0;background:var(--ac);border-radius:3px}
.mk-sh-sync{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--dim);padding:8px 9px}
.mk-sh-sync i{width:6px;height:6px;border-radius:50%;background:#3ddc84}

.mk-sh-av{display:inline-grid;place-items:center;border-radius:50%;color:#fff;font-weight:600;flex:none;letter-spacing:.02em}
.mk-sh-sav{color:#0b0d07}
.mk-sh-main{min-height:0;min-width:0;overflow:hidden;position:relative}

/* database */
.mk-sh-db{display:grid;grid-template-columns:212px 1fr;height:100%}
.mk-sh-rail{border-right:1px solid var(--ln);padding:14px 14px;overflow:hidden;display:flex;flex-direction:column;gap:14px;background:#0b0c0f}
.mk-sh-rh{display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:13px}
.mk-sh-reset{font-size:12px;color:var(--mu);font-weight:500}
.mk-sh-reset:hover{color:var(--ac)}
.mk-sh-fl{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);font-weight:600;margin-bottom:7px;display:flex;justify-content:space-between}
.mk-sh-fixed{display:flex;align-items:center;gap:7px;height:30px;padding:0 10px;border-radius:7px;border:1px solid var(--ac3);background:var(--ac2);color:var(--ac);font-weight:600;font-size:12.5px}
.mk-sh-fixed span{margin-left:auto;color:var(--mu);font-weight:500;font-size:11.5px}
.mk-sh-seg{display:flex;padding:2px;border:1px solid var(--ln);border-radius:8px;background:var(--p1)}
.mk-sh-seg button{flex:1;height:26px;border-radius:6px;font-size:12px;color:var(--mu);text-align:center;font-weight:500;white-space:nowrap;padding:0 4px}
.mk-sh-seg button:hover{color:var(--tx)}
.mk-sh-seg button[aria-pressed="true"]{background:var(--p3);color:var(--tx);box-shadow:0 0 0 1px var(--ln2)}
.mk-sh-chk{display:flex;align-items:center;gap:9px;height:26px;width:100%;color:var(--mu);font-size:12.5px;border-radius:6px}
.mk-sh-chk:hover{color:var(--tx)}
.mk-sh-box{width:15px;height:15px;border-radius:4px;border:1px solid #3a4049;display:grid;place-items:center;color:#0b0d07;flex:none}
.mk-sh-chk[aria-pressed="true"]{color:var(--tx)}
.mk-sh-chk[aria-pressed="true"] .mk-sh-box{background:var(--ac);border-color:var(--ac)}
.mk-sh-chk .c{margin-left:auto;font-size:11.5px;color:var(--dim)}
.mk-sh-chips{display:flex;flex-wrap:wrap;gap:6px}
.mk-sh-chip{height:26px;padding:0 9px;border-radius:13px;border:1px solid var(--ln2);font-size:12px;color:var(--mu);display:flex;align-items:center;gap:5px;font-weight:500}
.mk-sh-chip:hover{color:var(--tx);border-color:#3a4049}
.mk-sh-chip[aria-pressed="true"]{border-color:var(--ac3);background:var(--ac2);color:var(--ac)}

.mk-sh-res{display:flex;flex-direction:column;min-width:0;min-height:0}
.mk-sh-rhd{display:flex;align-items:flex-end;justify-content:space-between;padding:16px 20px 10px}
.mk-sh-h1{font-size:19px;font-weight:650;letter-spacing:-.015em}
.mk-sh-sub{font-size:12.5px;color:var(--mu);margin-top:3px}
.mk-sh-sub b{color:var(--tx);font-weight:600}
.mk-sh-acts{display:flex;gap:8px}
.mk-sh-active{display:flex;align-items:center;gap:6px;padding:0 20px 10px;min-height:36px;flex-wrap:wrap}
.mk-sh-ac{height:24px;display:flex;align-items:center;gap:6px;padding:0 6px 0 9px;border-radius:6px;background:var(--p2);border:1px solid var(--ln2);font-size:12px;color:var(--tx);white-space:nowrap}
.mk-sh-ac em{font-style:normal;color:var(--dim)}
.mk-sh-ac:hover{border-color:#4a515b}
.mk-sh-ac .mk-sh-ic{color:var(--dim)}
.mk-sh-ac.lock{padding-right:9px}

.mk-sh-tbl{margin:0 20px;border:1px solid var(--ln);border-radius:10px;overflow:hidden;background:var(--p1)}
.mk-sh-tr{display:grid;grid-template-columns:34px 1fr;align-items:center;border-top:1px solid var(--ln);height:46px}
.mk-sh-tr:hover{background:var(--p2)}
.mk-sh-tr.sel{background:var(--p2)}
.mk-sh-cols{display:grid;grid-template-columns:186px 38px 50px 38px 168px 64px 54px 82px 1fr;align-items:center;gap:0;height:100%;width:100%;padding-right:12px}
.mk-sh-th{height:34px;border-top:0;background:#0c0e11}
.mk-sh-th:hover{background:#0c0e11}
.mk-sh-th .mk-sh-cols>*{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--dim);font-weight:600;display:flex;align-items:center;gap:3px}
.mk-sh-th button:hover{color:var(--tx)}
.mk-sh-th button[aria-pressed="true"]{color:var(--ac)}
.mk-sh-star{width:34px;height:46px;display:grid;place-items:center;color:#454b54}
.mk-sh-star:hover{color:var(--mu)}
.mk-sh-star[aria-pressed="true"]{color:var(--ac)}
.mk-sh-kp{display:flex;align-items:center;gap:10px;min-width:0}
.mk-sh-kp b{display:block;font-weight:600;font-size:13px;white-space:nowrap}
.mk-sh-kp>span>span{display:block;font-size:11.5px;color:var(--dim)}
.mk-sh-cl b{display:block;font-weight:500;font-size:12.5px;white-space:nowrap}
.mk-sh-cl span{display:block;font-size:11.5px;color:var(--dim)}
.mk-sh-num{font-size:12.5px;color:var(--tx)}
.mk-sh-dimt{color:var(--mu);font-size:12.5px}
.mk-sh-rt{display:inline-grid;place-items:center;min-width:30px;height:22px;padding:0 6px;border-radius:6px;font-family:"IBM Plex Mono",monospace;font-weight:600;font-size:12.5px}
.mk-sh-rt-hi{background:var(--ac);color:#0b0d07}
.mk-sh-rt-mid{background:rgba(198,244,50,.16);color:var(--ac);box-shadow:inset 0 0 0 1px rgba(198,244,50,.3)}
.mk-sh-rt-lo{background:var(--p3);color:var(--mu);box-shadow:inset 0 0 0 1px var(--ln2)}
.mk-sh-rt-big{min-width:46px;height:34px;font-size:18px;border-radius:9px}
.mk-sh-tri{font-size:11px;margin-left:5px;font-family:"IBM Plex Mono",monospace}
.mk-sh-up{color:#8fd14f}.mk-sh-dn{color:#ff7a6b}.mk-sh-eq{color:var(--dim)}
.mk-sh-rep{display:flex;align-items:center;gap:6px;font-size:12.5px}
.mk-sh-pips{display:flex;gap:2px}
.mk-sh-pips i{width:3px;height:10px;border-radius:1px;background:#2e333a}
.mk-sh-pips i.on{background:var(--mu)}
.mk-sh-st{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--mu);white-space:nowrap}
.mk-sh-st i{width:6px;height:6px;border-radius:50%}
.mk-sh-empty{padding:48px 20px;text-align:center;color:var(--mu);border-top:1px solid var(--ln)}
.mk-sh-empty b{display:block;color:var(--tx);font-size:14px;margin-bottom:4px}
.mk-sh-foot{display:flex;justify-content:space-between;align-items:center;padding:10px 20px;color:var(--dim);font-size:12px}

/* profile */
.mk-sh-prof{height:100%;overflow:hidden;padding:14px 20px 16px;display:flex;flex-direction:column;gap:12px}
.mk-sh-crumb{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--mu)}
.mk-sh-crumb button{display:flex;align-items:center;gap:4px;color:var(--mu)}
.mk-sh-crumb button:hover{color:var(--tx)}
.mk-sh-crumb b{color:var(--tx);font-weight:500}
.mk-sh-phd{display:flex;align-items:center;gap:16px}
.mk-sh-pname{font-size:22px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
.mk-sh-pmeta{display:flex;gap:14px;color:var(--mu);font-size:12.5px;margin-top:4px}
.mk-sh-pmeta b{color:var(--tx);font-weight:500}
.mk-sh-tag{font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:5px;background:var(--ac2);color:var(--ac);border:1px solid var(--ac3)}
.mk-sh-tag.grey{background:var(--p3);color:var(--mu);border-color:var(--ln2)}
.mk-sh-pacts{margin-left:auto;display:flex;gap:8px;align-items:center}
.mk-sh-ghost[aria-pressed="true"]{color:var(--ac);border-color:var(--ac3);background:var(--ac2)}
.mk-sh-kpis{display:grid;grid-template-columns:repeat(6,1fr);border:1px solid var(--ln);border-radius:10px;background:var(--p1)}
.mk-sh-kpi{padding:9px 14px;border-left:1px solid var(--ln)}
.mk-sh-kpi:first-child{border-left:0}
.mk-sh-kpi span{display:block;font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;font-weight:600}
.mk-sh-kpi b{display:block;font-size:18px;font-weight:600;margin-top:2px;letter-spacing:-.01em}
.mk-sh-kpi em{font-style:normal;font-size:11.5px;color:#8fd14f;margin-left:5px;font-weight:500}
.mk-sh-pgrid{display:grid;grid-template-columns:300px 316px 1fr;gap:12px;min-height:0;flex:1}
.mk-sh-card{border:1px solid var(--ln);border-radius:10px;background:var(--p1);padding:13px 14px;min-height:0;display:flex;flex-direction:column}
.mk-sh-ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.mk-sh-ch h3{font-size:13px;font-weight:600}
.mk-sh-ch span{font-size:11.5px;color:var(--dim)}
.mk-sh-attr{display:grid;grid-template-columns:116px 1fr 26px;align-items:center;gap:10px;height:27px}
.mk-sh-attr span{font-size:12.5px;color:var(--mu)}
.mk-sh-bar{position:relative;height:6px;border-radius:3px;background:#1f2328}
.mk-sh-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,rgba(198,244,50,.55),var(--ac))}
.mk-sh-bar u{position:absolute;top:-3px;width:2px;height:12px;background:#e8ebef;opacity:.55;border-radius:1px}
.mk-sh-attr b{font-size:12.5px;text-align:right}
.mk-sh-sw{margin-top:12px;padding-top:12px;border-top:1px solid var(--ln);display:flex;flex-direction:column;gap:8px}
.mk-sh-sw div{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.mk-sh-sw span{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--dim);font-weight:600;width:72px}
.mk-sh-sw em{font-style:normal;font-size:11.5px;padding:2px 8px;border-radius:5px;background:rgba(255,122,107,.1);color:#ff9a8d;border:1px solid rgba(255,122,107,.22)}
.mk-sh-sw em.g{background:var(--ac2);color:var(--ac);border-color:rgba(198,244,50,.22)}
.mk-sh-leg{display:flex;gap:14px;margin-top:auto;padding-top:8px;font-size:11.5px;color:var(--dim)}
.mk-sh-leg span{display:flex;align-items:center;gap:6px}
.mk-sh-leg i{width:12px;height:5px;border-radius:2px;background:var(--ac)}
.mk-sh-leg u{width:2px;height:10px;background:#e8ebef;opacity:.55}
.mk-sh-seg.sm button{height:22px;font-size:11.5px;padding:0 8px}
.mk-sh-pitch{display:block;width:100%;height:auto;border-radius:8px;background:#0b0d10}
.mk-sh-hs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
.mk-sh-hs div{padding:6px 8px;border-radius:7px;background:var(--p2);border:1px solid var(--ln)}
.mk-sh-hs span{display:block;font-size:11px;color:var(--dim)}
.mk-sh-hs b{font-size:14px;font-weight:600}
.mk-sh-tl{position:relative;display:flex;flex-direction:column;gap:10px;overflow:hidden}
.mk-sh-tl::before{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:1px;background:var(--ln2)}
.mk-sh-te{display:grid;grid-template-columns:24px 1fr;gap:10px;position:relative}
.mk-sh-te .mk-sh-av{box-shadow:0 0 0 3px var(--p1)}
.mk-sh-teh{display:flex;align-items:center;gap:8px;font-size:12.5px}
.mk-sh-teh b{font-weight:600}
.mk-sh-teh .mk-sh-rt{margin-left:auto;height:20px;font-size:11.5px}
.mk-sh-tem{font-size:11.5px;color:var(--dim);margin-top:1px;display:flex;gap:6px;align-items:center}
.mk-sh-ten{font-size:12.5px;color:var(--mu);margin-top:4px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mk-sh-sim{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.mk-sh-simc{display:flex;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--ln);border-radius:9px;background:var(--p1);width:100%}
.mk-sh-simc:hover{border-color:#3a4049;background:var(--p2)}
.mk-sh-simc b{display:block;font-size:12.5px;font-weight:600}
.mk-sh-simc>span>span{display:block;font-size:11.5px;color:var(--dim)}
.mk-sh-simc .mk-sh-rt{margin-left:auto}
.mk-sh-cap{margin-top:auto;padding-top:10px;display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--dim)}
.mk-sh-match{font-size:11px;color:var(--ac);font-weight:600}

/* shortlists */
.mk-sh-sl{height:100%;display:flex;flex-direction:column;padding:16px 20px 16px;gap:12px;min-height:0}
.mk-sh-lists{display:flex;gap:6px;align-items:center}
.mk-sh-lt{height:30px;padding:0 12px;border-radius:7px;font-size:12.5px;color:var(--mu);font-weight:500;border:1px solid transparent;display:flex;align-items:center;gap:7px}
.mk-sh-lt:hover{color:var(--tx);background:var(--p2)}
.mk-sh-lt[aria-pressed="true"]{color:var(--tx);background:var(--p2);border-color:var(--ln2)}
.mk-sh-lt span{font-size:11px;color:var(--dim)}
.mk-sh-kb{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;flex:1;min-height:0}
.mk-sh-col{border:1px solid var(--ln);border-radius:10px;background:#0b0c0f;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.mk-sh-colh{display:flex;align-items:center;gap:8px;padding:11px 12px 9px;border-bottom:1px solid var(--ln)}
.mk-sh-colh b{font-size:13px;font-weight:600}
.mk-sh-colh .cnt{font-size:11.5px;color:var(--mu);background:var(--p3);border-radius:9px;padding:0 7px;line-height:18px}
.mk-sh-colh .h{margin-left:auto;font-size:11.5px;color:var(--dim)}
.mk-sh-colh i{width:8px;height:8px;border-radius:2px}
.mk-sh-cards{padding:10px;display:flex;flex-direction:column;gap:8px;overflow-y:auto;flex:1;scrollbar-width:thin;scrollbar-color:#2c3138 transparent}
.mk-sh-kc{border:1px solid var(--ln);border-radius:9px;background:var(--p2);padding:10px 11px}
.mk-sh-kc:hover{border-color:#3a4049}
.mk-sh-kch{display:flex;align-items:center;gap:9px;width:100%}
.mk-sh-kch b{display:block;font-size:13px;font-weight:600}
.mk-sh-kch>span>span{display:block;font-size:11.5px;color:var(--dim)}
.mk-sh-kch .mk-sh-rt{margin-left:auto}
.mk-sh-kct{display:flex;gap:5px;margin-top:9px;flex-wrap:wrap}
.mk-sh-pill{font-size:11px;padding:1px 7px;border-radius:5px;background:var(--p3);color:var(--mu);border:1px solid var(--ln2);white-space:nowrap}
.mk-sh-kcn{font-size:12px;color:var(--mu);margin-top:8px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mk-sh-kcn b{color:var(--tx);font-weight:500}
.mk-sh-kcf{display:flex;align-items:center;gap:8px;margin-top:9px;padding-top:9px;border-top:1px solid var(--ln);font-size:11.5px;color:var(--dim)}
.mk-sh-mini{display:flex}
.mk-sh-mini .mk-sh-av{margin-left:-5px;box-shadow:0 0 0 2px var(--p2)}
.mk-sh-mini .mk-sh-av:first-child{margin-left:0}
.mk-sh-adv{margin-left:auto;display:flex;align-items:center;gap:4px;height:24px;padding:0 8px;border-radius:6px;border:1px solid var(--ln2);color:var(--mu);font-size:11.5px;font-weight:500}
.mk-sh-adv:hover{color:#0b0d07;background:var(--ac);border-color:var(--ac)}
.mk-sh-done{margin-left:auto;display:flex;align-items:center;gap:4px;color:var(--ac);font-weight:500}
.mk-sh-addc{height:34px;border:1px dashed var(--ln2);border-radius:9px;color:var(--dim);font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px;width:100%}
.mk-sh-addc:hover{color:var(--tx);border-color:#4a515b}

/* activity */
.mk-sh-act{height:100%;display:grid;grid-template-columns:1fr 300px;min-height:0}
.mk-sh-feed{padding:16px 0 0 20px;display:flex;flex-direction:column;gap:12px;min-height:0;overflow:hidden;border-right:1px solid var(--ln)}
.mk-sh-feed>.mk-sh-rhd{padding-right:20px !important}
.mk-sh-flist{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:0 14px 16px 0;margin-right:6px;scrollbar-width:thin;scrollbar-color:#2c3138 transparent}
.mk-sh-fi{display:grid;grid-template-columns:32px 1fr;gap:12px;padding:13px 14px;border:1px solid var(--ln);border-radius:10px;background:var(--p1)}
.mk-sh-fih{display:flex;align-items:center;gap:6px;font-size:13px;flex-wrap:wrap}
.mk-sh-fih b{font-weight:600}
.mk-sh-fih .v{color:var(--mu)}
.mk-sh-fih .kl{font-weight:600;color:var(--tx);border-bottom:1px dashed #4a515b}
.mk-sh-fih .kl:hover{color:var(--ac);border-color:var(--ac)}
.mk-sh-fih .t{margin-left:auto;font-size:11.5px;color:var(--dim)}
.mk-sh-fit{font-size:13px;color:#c7ccd3;margin-top:5px;line-height:1.5}
.mk-sh-fim{display:flex;align-items:center;gap:10px;margin-top:9px;flex-wrap:wrap}
.mk-sh-bo{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ac);background:var(--ac2);border:1px solid rgba(198,244,50,.2);border-radius:6px;padding:2px 8px}
.mk-sh-mt{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--mu)}
.mk-sh-use{margin-left:auto;display:flex;align-items:center;gap:6px;height:26px;padding:0 9px;border-radius:6px;border:1px solid var(--ln2);color:var(--mu);font-size:12px}
.mk-sh-use:hover{color:var(--tx)}
.mk-sh-use[aria-pressed="true"]{color:var(--ac);border-color:var(--ac3);background:var(--ac2)}
.mk-sh-aside{padding:16px 16px;display:flex;flex-direction:column;gap:14px;background:#0b0c0f;min-height:0;overflow:hidden}
.mk-sh-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mk-sh-stat{padding:10px 12px;border:1px solid var(--ln);border-radius:9px;background:var(--p1)}
.mk-sh-stat span{display:block;font-size:11.5px;color:var(--dim)}
.mk-sh-stat b{font-size:20px;font-weight:650;letter-spacing:-.02em}
.mk-sh-stat em{font-style:normal;font-size:11.5px;color:#8fd14f;margin-left:6px}
.mk-sh-spark{display:block;margin-top:4px}
.mk-sh-fx{display:flex;flex-direction:column;gap:2px}
.mk-sh-fxr{display:grid;grid-template-columns:44px 1fr 24px;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid var(--ln)}
.mk-sh-fxr:last-child{border-bottom:0}
.mk-sh-fxd{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.05em;font-weight:600;line-height:1.2}
.mk-sh-fxd b{display:block;font-size:15px;color:var(--tx);letter-spacing:0}
.mk-sh-fxr p{font-size:12.5px;font-weight:500}
.mk-sh-fxr p span{display:block;font-size:11.5px;color:var(--dim);font-weight:400}
.mk-sh-con{display:grid;grid-template-columns:24px 1fr 80px 28px;gap:9px;align-items:center;height:30px;font-size:12.5px}
.mk-sh-con .bar{height:5px;border-radius:3px;background:#1f2328;position:relative}
.mk-sh-con .bar i{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--ac)}
.mk-sh-con b{text-align:right;font-size:12px;color:var(--mu);font-weight:500}

@media (prefers-reduced-motion:no-preference){
  .mk-sh-caret{animation:mk-sh-blink 1.1s steps(1) infinite}
  .mk-sh-view{animation:mk-sh-in .22s ease-out}
  .mk-sh-on::after{animation:mk-sh-ping 2.4s ease-in-out infinite}
}
@keyframes mk-sh-blink{50%{opacity:0}}
@keyframes mk-sh-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
@keyframes mk-sh-ping{50%{box-shadow:0 0 0 2px var(--p1),0 0 0 4px rgba(61,220,132,.25)}}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type AgeF = "all" | "u21" | "21-25" | "26+";
type HF = "any" | "188" | "192";
type FootF = "any" | Foot;
type SortK = "rating" | "age" | "h" | "reports" | "seen";

const AVAIL_DOT: Record<Avail, string> = {
  "Under contract": "#626973",
  "Expiring 2027": "#f5b544",
  "Free agent": "#c6f432",
  "Loan option": "#6ea8ff",
};

export default function ScoutingHubMockup() {
  const [view, setView] = useState<View>("database");
  const [sel, setSel] = useState("okafor");
  const [age, setAge] = useState<AgeF>("all");
  const [leagues, setLeagues] = useState<string[]>([]);
  const [hf, setHf] = useState<HF>("188");
  const [foot, setFoot] = useState<FootF>("any");
  const [avail, setAvail] = useState<Avail[]>([]);
  const [sort, setSort] = useState<SortK>("rating");
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [list, setList] = useState<ListId>("first");
  const [heat, setHeat] = useState<keyof typeof HEAT>("sweeps");
  const [feedF, setFeedF] = useState<"all" | FeedKind>("all");
  const [useful, setUseful] = useState<Record<string, boolean>>({ f3: true });

  const starred = (id: string) => id in board.first;
  const toggleStar = (id: string) =>
    setBoard((b) => {
      const first = { ...b.first };
      if (id in first) delete first[id];
      else first[id] = "watching";
      return { ...b, first };
    });
  const advance = (id: string) =>
    setBoard((b) => {
      const cur = b[list][id];
      const i = STAGES.findIndex((s) => s.id === cur);
      if (i < 0 || i >= STAGES.length - 1) return b;
      return { ...b, [list]: { ...b[list], [id]: STAGES[i + 1].id } };
    });

  const rows = useMemo(() => {
    const r = KEEPERS.filter((k) => {
      if (age === "u21" && k.age > 21) return false;
      if (age === "21-25" && (k.age < 21 || k.age > 25)) return false;
      if (age === "26+" && k.age < 26) return false;
      if (leagues.length && !leagues.includes(k.league)) return false;
      if (hf !== "any" && k.h < +hf) return false;
      if (foot !== "any" && k.foot !== foot) return false;
      if (avail.length && !avail.includes(k.avail)) return false;
      return true;
    });
    const key = (k: Keeper) =>
      sort === "seen" ? Date.parse(k.seen) : sort === "age" ? -k.age : (k[sort] as number);
    return [...r].sort((a, b) => key(b) - key(a));
  }, [age, leagues, hf, foot, avail, sort]);

  const keeper = KEEPERS.find((k) => k.id === sel) ?? KEEPERS[0];
  const open = (id: string) => {
    setSel(id);
    setView("profile");
  };
  const resetFilters = () => {
    setAge("all");
    setLeagues([]);
    setHf("any");
    setFoot("any");
    setAvail([]);
  };
  const toggleIn = <T,>(arr: T[], v: T) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const nShort = Object.keys(board.first).length;
  const nav: { id: View; label: string; icon: string; badge?: string; isNew?: boolean }[] = [
    { id: "database", label: "Database", icon: "db", badge: "412" },
    { id: "shortlists", label: "Shortlists", icon: "board", badge: String(nShort) },
    { id: "activity", label: "Activity", icon: "pulse", badge: "6", isNew: true },
  ];

  return (
    <div className="mk-sh">
      <style>{CSS}</style>

      {/* Top bar */}
      <header className="mk-sh-top">
        <div className="mk-sh-brand">
          <span className="mk-sh-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <circle cx="12" cy="12" r="2.6" fill="currentColor" />
              <path
                d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"
                stroke="currentColor"
                strokeWidth="2.4"
              />
            </svg>
          </span>
          Scouting Hub
        </div>
        <div className="mk-sh-search" role="search">
          <Icon n="search" s={15} />
          <span className="mk-sh-q">
            sweeper keeper <b>height:1.88+</b> left foot
            <span className="mk-sh-caret" />
          </span>
          <span className="mk-sh-qn">12 results</span>
          <span className="mk-sh-kbd">⌘K</span>
        </div>
        <div className="mk-sh-right">
          <div className="mk-sh-online">
            <div className="mk-sh-stack">
              {SCOUTS.map((s) => (
                <span className="mk-sh-on" key={s.id}>
                  <ScoutAv s={s} size={26} />
                </span>
              ))}
            </div>
            4 scouts online
          </div>
          <button type="button" className="mk-sh-icb" aria-label="Notifications">
            <Icon n="bell" s={17} />
            <span className="mk-sh-dot" />
          </button>
          <button type="button" className="mk-sh-cta" onClick={() => open(sel)}>
            <Icon n="plus" s={15} />
            New assessment
          </button>
        </div>
      </header>

      <div className="mk-sh-body">
        {/* Sidebar */}
        <nav className="mk-sh-side" aria-label="Scouting Hub">
          {nav.map((n) => (
            <button
              type="button"
              key={n.id}
              className="mk-sh-nav"
              aria-current={
                view === n.id || (n.id === "database" && view === "profile") ? "page" : undefined
              }
              onClick={() => setView(n.id)}
            >
              <Icon n={n.icon} s={16} />
              {n.label}
              {n.isNew ? (
                <span className="new">{n.badge}</span>
              ) : (
                <span className="n mono">{n.badge}</span>
              )}
            </button>
          ))}

          <div className="mk-sh-sh">Saved searches</div>
          <button
            type="button"
            className="mk-sh-sv"
            onClick={() => {
              resetFilters();
              setFoot("L");
              setView("database");
            }}
          >
            <Icon n="bookmark" s={14} />
            Left-footed keepers
          </button>
          <button
            type="button"
            className="mk-sh-sv"
            onClick={() => {
              resetFilters();
              setAvail(["Expiring 2027", "Free agent"]);
              setView("database");
            }}
          >
            <Icon n="bookmark" s={14} />
            Free or expiring 2027
          </button>
          <button
            type="button"
            className="mk-sh-sv"
            onClick={() => {
              resetFilters();
              setAge("u21");
              setHf("188");
              setView("database");
            }}
          >
            <Icon n="bookmark" s={14} />
            U21, 1.88m and over
          </button>

          <div className="mk-sh-sh">Recently viewed</div>
          {["haddad", "brennan", "marsh"].map((id) => {
            const k = KEEPERS.find((x) => x.id === id)!;
            return (
              <button type="button" key={id} className="mk-sh-sv" onClick={() => open(id)}>
                <Av k={k} size={18} />
                {k.name}
              </button>
            );
          })}

          <div className="mk-sh-health">
            <div className="mk-sh-fl" style={{ marginBottom: 4 }}>
              Coverage <span className="mono">87%</span>
            </div>
            <span className="mk-sh-hb">
              <i style={{ width: "87%" }} />
            </span>
            <p>
              <b className="mono">358</b> of 412 profiles assessed in the last 90 days
            </p>
          </div>
          <div className="mk-sh-sync">
            <i />
            Synced · 2 min ago
          </div>
          <div className="mk-sh-me">
            <span
              className="mk-sh-av"
              style={{ width: 30, height: 30, fontSize: 11, background: "#2a2f36" }}
            >
              {ME.ini}
            </span>
            <div>
              <b>{ME.name}</b>
              <span>{ME.role}</span>
            </div>
          </div>
        </nav>

        <main className="mk-sh-main">
          {view === "database" && (
            <div className="mk-sh-db mk-sh-view">
              {/* Filter rail */}
              <aside className="mk-sh-rail" aria-label="Filters">
                <div className="mk-sh-rh">
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon n="filter" s={14} /> Filters
                  </span>
                  <button type="button" className="mk-sh-reset" onClick={resetFilters}>
                    Reset
                  </button>
                </div>
                <div>
                  <div className="mk-sh-fl">Position</div>
                  <div className="mk-sh-fixed">
                    <Icon n="lock" s={13} /> Goalkeeper <span>fixed</span>
                  </div>
                </div>
                <div>
                  <div className="mk-sh-fl">Age</div>
                  <div className="mk-sh-seg">
                    {(
                      [
                        ["all", "All"],
                        ["u21", "≤21"],
                        ["21-25", "21–25"],
                        ["26+", "26+"],
                      ] as [AgeF, string][]
                    ).map(([v, l]) => (
                      <button
                        type="button"
                        key={v}
                        aria-pressed={age === v}
                        onClick={() => setAge(v)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mk-sh-fl">
                    League{" "}
                    <span style={{ textTransform: "none", letterSpacing: 0 }}>
                      {leagues.length || "Any"}
                    </span>
                  </div>
                  {LEAGUES.map((l) => {
                    const on = leagues.includes(l);
                    return (
                      <button
                        type="button"
                        key={l}
                        className="mk-sh-chk"
                        aria-pressed={on}
                        onClick={() => setLeagues(toggleIn(leagues, l))}
                      >
                        <span className="mk-sh-box">{on && <Icon n="check" s={11} />}</span>
                        {l}
                        <span className="c mono">
                          {KEEPERS.filter((k) => k.league === l).length}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <div className="mk-sh-fl">Height</div>
                  <div className="mk-sh-seg">
                    {(
                      [
                        ["any", "Any"],
                        ["188", "1.88m+"],
                        ["192", "1.92m+"],
                      ] as [HF, string][]
                    ).map(([v, l]) => (
                      <button
                        type="button"
                        key={v}
                        aria-pressed={hf === v}
                        onClick={() => setHf(v)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mk-sh-fl">Preferred foot</div>
                  <div className="mk-sh-seg">
                    {(
                      [
                        ["any", "Either"],
                        ["L", "Left"],
                        ["R", "Right"],
                      ] as [FootF, string][]
                    ).map(([v, l]) => (
                      <button
                        type="button"
                        key={v}
                        aria-pressed={foot === v}
                        onClick={() => setFoot(v)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mk-sh-fl">Availability</div>
                  <div className="mk-sh-chips">
                    {AVAILS.map((a) => (
                      <button
                        type="button"
                        key={a}
                        className="mk-sh-chip"
                        aria-pressed={avail.includes(a)}
                        onClick={() => setAvail(toggleIn(avail, a))}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Results */}
              <section className="mk-sh-res">
                <div className="mk-sh-rhd">
                  <div>
                    <h1 className="mk-sh-h1">Goalkeepers</h1>
                    <p className="mk-sh-sub">
                      <b>{rows.length}</b> of 12 search results · 412 keepers in the shared database
                    </p>
                  </div>
                  <div className="mk-sh-acts">
                    <button
                      type="button"
                      className="mk-sh-ghost"
                      onClick={() => setView("shortlists")}
                    >
                      <Icon n="star" s={14} /> {nShort} shortlisted
                    </button>
                    <button type="button" className="mk-sh-ghost" aria-label="Export results">
                      <Icon n="download" s={14} /> Export
                    </button>
                  </div>
                </div>
                <div className="mk-sh-active">
                  <span className="mk-sh-ac lock">
                    <em>Position</em> GK
                  </span>
                  {age !== "all" && (
                    <button type="button" className="mk-sh-ac" onClick={() => setAge("all")}>
                      <em>Age</em> {age === "u21" ? "≤21" : age === "21-25" ? "21–25" : "26+"}{" "}
                      <Icon n="x" s={12} />
                    </button>
                  )}
                  {leagues.map((l) => (
                    <button
                      type="button"
                      key={l}
                      className="mk-sh-ac"
                      onClick={() => setLeagues(toggleIn(leagues, l))}
                    >
                      <em>League</em> {l} <Icon n="x" s={12} />
                    </button>
                  ))}
                  {hf !== "any" && (
                    <button type="button" className="mk-sh-ac" onClick={() => setHf("any")}>
                      <em>Height</em> {hf === "188" ? "1.88m+" : "1.92m+"} <Icon n="x" s={12} />
                    </button>
                  )}
                  {foot !== "any" && (
                    <button type="button" className="mk-sh-ac" onClick={() => setFoot("any")}>
                      <em>Foot</em> {foot === "L" ? "Left" : "Right"} <Icon n="x" s={12} />
                    </button>
                  )}
                  {avail.map((a) => (
                    <button
                      type="button"
                      key={a}
                      className="mk-sh-ac"
                      onClick={() => setAvail(toggleIn(avail, a))}
                    >
                      <em>Status</em> {a} <Icon n="x" s={12} />
                    </button>
                  ))}
                  {age === "all" &&
                    !leagues.length &&
                    hf === "any" &&
                    foot === "any" &&
                    !avail.length && (
                      <span className="mk-sh-sub" style={{ marginTop: 0 }}>
                        Use the filters to narrow the list
                      </span>
                    )}
                </div>

                <div className="mk-sh-tbl" role="table" aria-label="Goalkeeper results">
                  <div className="mk-sh-tr mk-sh-th" role="row">
                    <span />
                    <div className="mk-sh-cols">
                      <span>Keeper</span>
                      {(
                        [
                          ["age", "Age"],
                          ["h", "Ht"],
                        ] as [SortK, string][]
                      ).map(([k, l]) => (
                        <button
                          type="button"
                          key={k}
                          aria-pressed={sort === k}
                          onClick={() => setSort(k)}
                        >
                          {l}
                        </button>
                      ))}
                      <span>Foot</span>
                      <span>Club · League</span>
                      <button
                        type="button"
                        aria-pressed={sort === "rating"}
                        onClick={() => setSort("rating")}
                      >
                        Ovr {sort === "rating" && <Icon n="chev" s={11} />}
                      </button>
                      <button
                        type="button"
                        aria-pressed={sort === "reports"}
                        onClick={() => setSort("reports")}
                      >
                        Rpts
                      </button>
                      <button
                        type="button"
                        aria-pressed={sort === "seen"}
                        onClick={() => setSort("seen")}
                      >
                        Last seen
                      </button>
                      <span>Availability</span>
                    </div>
                  </div>
                  {rows.map((k) => (
                    <div className="mk-sh-tr" role="row" key={k.id}>
                      <button
                        type="button"
                        className="mk-sh-star"
                        aria-pressed={starred(k.id)}
                        aria-label={
                          starred(k.id) ? `Remove ${k.name} from shortlist` : `Shortlist ${k.name}`
                        }
                        onClick={() => toggleStar(k.id)}
                      >
                        <Icon n="star" s={15} fill={starred(k.id)} />
                      </button>
                      <button type="button" className="mk-sh-cols" onClick={() => open(k.id)}>
                        <span className="mk-sh-kp">
                          <Av k={k} size={28} />
                          <span>
                            <b>{k.name}</b>
                            <span>{k.nat} · GK</span>
                          </span>
                        </span>
                        <span className="mk-sh-num mono">{k.age}</span>
                        <span className="mk-sh-num mono">{(k.h / 100).toFixed(2)}</span>
                        <span className="mk-sh-dimt">{k.foot}</span>
                        <span className="mk-sh-cl">
                          <b>{k.club}</b>
                          <span>{k.league}</span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <Rating v={k.rating} />
                          <span
                            className={`mk-sh-tri ${k.trend > 0 ? "mk-sh-up" : k.trend < 0 ? "mk-sh-dn" : "mk-sh-eq"}`}
                          >
                            {k.trend > 0 ? `+${k.trend}` : k.trend < 0 ? `${k.trend}` : "0"}
                          </span>
                        </span>
                        <span className="mk-sh-rep mono">
                          <span className="mk-sh-pips">
                            {[0, 1, 2, 3].map((i) => (
                              <i key={i} className={k.reports > i * 3 ? "on" : ""} />
                            ))}
                          </span>
                          {k.reports}
                        </span>
                        <span className="mk-sh-dimt mono">{fmtDate(k.seen)}</span>
                        <span className="mk-sh-st">
                          <i style={{ background: AVAIL_DOT[k.avail] }} />
                          {k.avail}
                        </span>
                      </button>
                    </div>
                  ))}
                  {!rows.length && (
                    <div className="mk-sh-empty">
                      <b>No keepers match these filters</b>
                      Try widening the age range or clearing a league.
                    </div>
                  )}
                </div>
                <div className="mk-sh-foot">
                  <span>Ranked by overall rating · built from 1,936 shared assessments</span>
                  <span className="mono">
                    1–{rows.length} of {rows.length}
                  </span>
                </div>
              </section>
            </div>
          )}

          {view === "profile" && (
            <Profile
              k={keeper}
              starred={starred(keeper.id)}
              stage={board.first[keeper.id]}
              onStar={() => toggleStar(keeper.id)}
              onBack={() => setView("database")}
              onOpen={open}
              heat={heat}
              setHeat={setHeat}
            />
          )}

          {view === "shortlists" && (
            <div className="mk-sh-sl mk-sh-view">
              <div className="mk-sh-rhd" style={{ padding: 0 }}>
                <div>
                  <h1 className="mk-sh-h1">Shortlists</h1>
                  <p className="mk-sh-sub">
                    Owned by {LISTS.find((l) => l.id === list)!.owner} · shared with 5 scouts ·
                    updated 2h ago
                  </p>
                </div>
                <div className="mk-sh-acts">
                  <button type="button" className="mk-sh-ghost" onClick={() => setView("database")}>
                    <Icon n="plus" s={14} /> Add from database
                  </button>
                </div>
              </div>
              <div className="mk-sh-lists">
                {LISTS.map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    className="mk-sh-lt"
                    aria-pressed={list === l.id}
                    onClick={() => setList(l.id)}
                  >
                    {l.name}
                    <span className="mono">{Object.keys(board[l.id]).length}</span>
                  </button>
                ))}
              </div>
              <div className="mk-sh-kb">
                {STAGES.map((s, si) => {
                  const ids = KEEPERS.filter((k) => board[list][k.id] === s.id);
                  return (
                    <div className="mk-sh-col" key={s.id}>
                      <div className="mk-sh-colh">
                        <i
                          style={{ background: ["#626973", "#6ea8ff", "#c6f432", "#f5b544"][si] }}
                        />
                        <b>{s.label}</b>
                        <span className="cnt mono">{ids.length}</span>
                        <span className="h">{s.hint}</span>
                      </div>
                      <div className="mk-sh-cards">
                        {ids.map((k) => {
                          const idx = KEEPERS.indexOf(k);
                          return (
                            <div className="mk-sh-kc" key={k.id}>
                              <button
                                type="button"
                                className="mk-sh-kch"
                                onClick={() => open(k.id)}
                              >
                                <Av k={k} size={30} />
                                <span>
                                  <b>{k.name}</b>
                                  <span>
                                    {k.club} · {k.age}
                                  </span>
                                </span>
                                <Rating v={k.rating} />
                              </button>
                              <div className="mk-sh-kct">
                                <span className="mk-sh-pill">{k.league}</span>
                                <span className="mk-sh-pill">{(k.h / 100).toFixed(2)}m</span>
                                <span className="mk-sh-pill">
                                  {k.foot === "L" ? "Left foot" : "Right foot"}
                                </span>
                              </div>
                              <p className="mk-sh-kcn">
                                <b>{SCOUTS[idx % 4].short}:</b>{" "}
                                {CARD_NOTES[idx % CARD_NOTES.length]}
                              </p>
                              <div className="mk-sh-kcf">
                                <span className="mk-sh-mini">
                                  {[0, 1].slice(0, 1 + (k.reports % 2)).map((i) => (
                                    <ScoutAv key={i} s={SCOUTS[(idx + i) % 4]} size={18} />
                                  ))}
                                </span>
                                <span className="mono">{k.reports}</span>
                                {si < STAGES.length - 1 ? (
                                  <button
                                    type="button"
                                    className="mk-sh-adv"
                                    onClick={() => advance(k.id)}
                                    aria-label={`Move ${k.name} to ${STAGES[si + 1].label}`}
                                  >
                                    {STAGES[si + 1].label} <Icon n="arrow" s={12} />
                                  </button>
                                ) : (
                                  <span className="mk-sh-done">
                                    <Icon n="clock" s={12} /> {(idx % 5) + 2}d ago
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {si === 0 && (
                          <button
                            type="button"
                            className="mk-sh-addc"
                            onClick={() => setView("database")}
                          >
                            <Icon n="plus" s={13} /> Star a keeper to add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "activity" && (
            <div className="mk-sh-act mk-sh-view">
              <div className="mk-sh-feed">
                <div className="mk-sh-rhd" style={{ padding: 0 }}>
                  <div>
                    <h1 className="mk-sh-h1">Activity</h1>
                    <p className="mk-sh-sub">What one scout learns, everyone else builds on.</p>
                  </div>
                  <div className="mk-sh-seg sm">
                    {(
                      [
                        ["all", "All"],
                        ["assessment", "Assessments"],
                        ["note", "Notes"],
                        ["move", "Shortlists"],
                      ] as ["all" | FeedKind, string][]
                    ).map(([v, l]) => (
                      <button
                        type="button"
                        key={v}
                        aria-pressed={feedF === v}
                        onClick={() => setFeedF(v)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mk-sh-flist">
                  {FEED.filter((f) => feedF === "all" || f.kind === feedF).map((f) => {
                    const s = SCOUTS[f.scout];
                    const k = KEEPERS.find((x) => x.id === f.keeper)!;
                    const on = !!useful[f.id];
                    return (
                      <article className="mk-sh-fi" key={f.id}>
                        <ScoutAv s={s} size={32} />
                        <div>
                          <div className="mk-sh-fih">
                            <b>{s.name}</b>
                            <span className="v">{f.verb}</span>
                            <button type="button" className="kl" onClick={() => open(k.id)}>
                              {k.name}
                            </button>
                            {f.grade && <Rating v={f.grade} />}
                            <span className="t">{f.when}</span>
                          </div>
                          <p className="mk-sh-fit">{f.text}</p>
                          <div className="mk-sh-fim">
                            {f.builds && (
                              <span className="mk-sh-bo">
                                <Icon n="link" s={12} />
                                {f.builds}
                              </span>
                            )}
                            {f.meta && (
                              <span className="mk-sh-mt">
                                <Icon n={f.kind === "move" ? "board" : "cal"} s={12} />
                                {f.meta}
                              </span>
                            )}
                            <button
                              type="button"
                              className="mk-sh-use"
                              aria-pressed={on}
                              onClick={() => setUseful({ ...useful, [f.id]: !on })}
                            >
                              <Icon n="thumb" s={13} />
                              Useful · <span className="mono">{f.useful + (on ? 1 : 0)}</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
              <aside className="mk-sh-aside">
                <div>
                  <div className="mk-sh-fl">This week</div>
                  <div className="mk-sh-stats">
                    {(
                      [
                        ["Assessments", "23", "+6", [3, 5, 4, 6, 5, 8, 7]],
                        ["Profiles updated", "41", "+12", [4, 6, 5, 7, 9, 8, 11]],
                        ["New keepers", "7", "+2", [1, 0, 2, 1, 1, 0, 2]],
                        ["Matches covered", "15", "+3", [2, 1, 3, 2, 4, 1, 2]],
                      ] as [string, string, string, number[]][]
                    ).map(([l, v, d, pts]) => {
                      const mx = Math.max(...pts);
                      const path = pts
                        .map((p, i) => `${i ? "L" : "M"}${i * 18} ${18 - (p / mx) * 16}`)
                        .join(" ");
                      return (
                        <div className="mk-sh-stat" key={l}>
                          <span>{l}</span>
                          <b>{v}</b>
                          <em>{d}</em>
                          <svg
                            className="mk-sh-spark"
                            width="108"
                            height="20"
                            viewBox="0 0 108 20"
                            aria-hidden="true"
                          >
                            <path
                              d={path}
                              fill="none"
                              stroke="#c6f432"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="mk-sh-fl">Fixtures to cover</div>
                  <div className="mk-sh-fx">
                    {(
                      [
                        [
                          "Sat",
                          "31",
                          "Kingsmoor Town v Ashvale United",
                          "Haddad, Marsh · League One",
                          3,
                        ],
                        ["Sat", "31", "Ferrybridge City v Castleton FC", "Asante · League One", 0],
                        [
                          "Tue",
                          "3",
                          "Harbour Athletic U21 v Holloway Park U21",
                          "Brennan, Varela",
                          1,
                        ],
                        [
                          "Sat",
                          "7",
                          "Dunmore Thistle v Kilbride Rovers",
                          "Reid · Scottish Prem",
                          3,
                        ],
                      ] as [string, string, string, string, number][]
                    ).map(([d, n, m, w, s]) => (
                      <div className="mk-sh-fxr" key={m}>
                        <div className="mk-sh-fxd">
                          {d}
                          <b>{n}</b>
                        </div>
                        <p>
                          {m}
                          <span>{w}</span>
                        </p>
                        <ScoutAv s={SCOUTS[s]} size={22} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mk-sh-fl">Contributions · October</div>
                  {(
                    [
                      [2, 38],
                      [0, 31],
                      [1, 27],
                      [3, 19],
                    ] as [number, number][]
                  ).map(([s, v]) => (
                    <div className="mk-sh-con" key={s}>
                      <ScoutAv s={SCOUTS[s]} size={22} />
                      <span>{SCOUTS[s].name}</span>
                      <span className="bar">
                        <i style={{ width: `${(v / 38) * 100}%` }} />
                      </span>
                      <b className="mono">{v}</b>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

function Profile({
  k,
  starred,
  stage,
  onStar,
  onBack,
  onOpen,
  heat,
  setHeat,
}: {
  k: Keeper;
  starred: boolean;
  stage?: Stage;
  onStar: () => void;
  onBack: () => void;
  onOpen: (id: string) => void;
  heat: keyof typeof HEAT;
  setHeat: (h: keyof typeof HEAT) => void;
}) {
  const idx = KEEPERS.indexOf(k);
  const tl = timeline(k);
  const similar = KEEPERS.filter((x) => x.id !== k.id)
    .map((x) => ({
      x,
      d: Math.abs(x.rating - k.rating) * 2 + Math.abs(x.age - k.age) + Math.abs(x.h - k.h) / 2,
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 4);
  const grid = HEAT[heat];
  const scale = 0.85 + ((idx * 37) % 20) / 100;
  const apps = 9 + (idx % 6);
  const ranked = ATTRS.map((a, i) => ({ k: a.k, d: attrVal(k, i) - a.avg })).sort(
    (a, b) => b.d - a.d,
  );
  const strengths = ranked.slice(0, 2).map((r) => r.k);
  const workons = ranked.slice(-1).map((r) => r.k);
  const stageLabel = STAGES.find((s) => s.id === stage)?.label;

  return (
    <div className="mk-sh-prof mk-sh-view" key={k.id}>
      <div className="mk-sh-crumb">
        <button type="button" onClick={onBack}>
          <Icon n="back" s={13} /> Database
        </button>
        <span>/</span>
        <b>{k.name}</b>
      </div>

      <div className="mk-sh-phd">
        <Av k={k} size={58} />
        <div>
          <div className="mk-sh-pname">
            {k.name}
            {stageLabel ? (
              <span className="mk-sh-tag">Shortlist · {stageLabel}</span>
            ) : (
              <span className="mk-sh-tag grey">Not shortlisted</span>
            )}
          </div>
          <div className="mk-sh-pmeta">
            <span>
              <b>{k.club}</b> · {k.league}
            </span>
            <span>
              Age <b className="mono">{k.age}</b>
            </span>
            <span>
              Height <b className="mono">{(k.h / 100).toFixed(2)}m</b>
            </span>
            <span>
              Foot <b>{k.foot === "L" ? "Left" : "Right"}</b>
            </span>
            <span>
              Contract{" "}
              <b>
                {k.avail === "Free agent"
                  ? "None"
                  : k.avail === "Expiring 2027"
                    ? "Jun 2027"
                    : "Jun 2028"}
              </b>
            </span>
          </div>
        </div>
        <div className="mk-sh-pacts">
          <div style={{ textAlign: "right", marginRight: 6 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--dim)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
                fontWeight: 600,
              }}
            >
              Overall
            </div>
            <div style={{ fontSize: 11.5, color: "var(--mu)" }}>{k.reports} reports</div>
          </div>
          <Rating v={k.rating} big />
          <button type="button" className="mk-sh-ghost" aria-pressed={starred} onClick={onStar}>
            <Icon n="star" s={14} fill={starred} />
            {starred ? "Shortlisted" : "Shortlist"}
          </button>
          <button type="button" className="mk-sh-cta">
            <Icon n="plus" s={14} />
            Assessment
          </button>
        </div>
      </div>

      <div className="mk-sh-kpis">
        {(
          [
            ["Apps 26/27", String(apps), ""],
            ["Clean sheets", String(Math.round(apps * 0.38)), ""],
            ["Save %", (68 + (k.rating - 70) * 0.45).toFixed(1), "+1.8"],
            ["PSxG +/-", `+${((k.rating - 68) / 6).toFixed(1)}`, ""],
            ["Pass completion", `${70 + ((idx * 3) % 14)}%`, "+4"],
            ["Minutes", (apps * 90).toLocaleString("en-GB"), ""],
          ] as [string, string, string][]
        ).map(([l, v, d]) => (
          <div className="mk-sh-kpi" key={l}>
            <span>{l}</span>
            <b className="mono">
              {v}
              {d && <em>{d}</em>}
            </b>
          </div>
        ))}
      </div>

      <div className="mk-sh-pgrid">
        <section className="mk-sh-card">
          <div className="mk-sh-ch">
            <h3>Attributes</h3>
            <span>Avg of {k.reports} reports</span>
          </div>
          {ATTRS.map((a, i) => {
            const v = attrVal(k, i);
            return (
              <div className="mk-sh-attr" key={a.k}>
                <span>{a.k}</span>
                <span className="mk-sh-bar">
                  <i style={{ width: `${v}%` }} />
                  <u style={{ left: `${a.avg}%` }} />
                </span>
                <b className="mono">{v}</b>
              </div>
            );
          })}
          <div className="mk-sh-sw">
            <div>
              <span>Strengths</span>
              {strengths.map((t) => (
                <em key={t} className="g">
                  {t}
                </em>
              ))}
            </div>
            <div>
              <span>Work-ons</span>
              {workons.map((t) => (
                <em key={t}>{t}</em>
              ))}
            </div>
          </div>
          <div className="mk-sh-leg">
            <span>
              <i /> {k.name.split(" ")[0]}
            </span>
            <span>
              <u /> {k.league} avg
            </span>
          </div>
        </section>

        <section className="mk-sh-card">
          <div className="mk-sh-ch">
            <h3>Action map</h3>
            <div className="mk-sh-seg sm">
              {(["saves", "claims", "sweeps"] as const).map((h) => (
                <button type="button" key={h} aria-pressed={heat === h} onClick={() => setHeat(h)}>
                  {h[0].toUpperCase() + h.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <svg
            className="mk-sh-pitch"
            viewBox="0 0 340 228"
            role="img"
            aria-label={`${heat} heatmap`}
          >
            <defs>
              <linearGradient id="mk-sh-turf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#10141a" />
                <stop offset="1" stopColor="#0b0d10" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="340" height="228" fill="url(#mk-sh-turf)" />
            {grid.map((row, r) =>
              row.map((v, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={10 + c * (320 / 6) + 1}
                  y={12 + r * 42 + 1}
                  width={320 / 6 - 2}
                  height={40}
                  rx="3"
                  fill="#c6f432"
                  fillOpacity={Math.min(0.88, v * scale * 0.9) + 0.03}
                />
              )),
            )}
            <g fill="none" stroke="#e8ebef" strokeOpacity=".32" strokeWidth="1.2">
              <rect x="10" y="12" width="320" height="210" />
              <rect x="70" y="12" width="200" height="84" />
              <rect x="125" y="12" width="90" height="28" />
              <path d="M131 96 A48 48 0 0 0 209 96" />
              <rect x="148" y="4" width="44" height="8" />
            </g>
            <circle cx="170" cy="68" r="1.8" fill="#e8ebef" fillOpacity=".5" />
            {heat === "sweeps" &&
              [
                [118, 150],
                [170, 168],
                [212, 140],
                [150, 128],
                [196, 186],
              ].map(([x, y]) => (
                <circle
                  key={`${x}${y}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#0b0d07"
                  stroke="#c6f432"
                  strokeWidth="1.5"
                />
              ))}
          </svg>
          <div className="mk-sh-hs">
            {HEAT_STATS[heat].map(([l, v]) => (
              <div key={l}>
                <span>{l}</span>
                <b className="mono">{v}</b>
              </div>
            ))}
          </div>
          <p className="mk-sh-cap">
            <Icon n="video" s={12} /> Last {Math.min(apps, 10)} matches · {Math.min(apps, 10) * 90}{" "}
            mins · tagged by D. Mistry
          </p>
        </section>

        <section className="mk-sh-card">
          <div className="mk-sh-ch">
            <h3>Assessment history</h3>
            <span>
              {tl.length} of {k.reports}
            </span>
          </div>
          <div className="mk-sh-tl">
            {tl.map((e, i) => (
              <div className="mk-sh-te" key={i}>
                <ScoutAv s={e.scout} size={24} />
                <div>
                  <div className="mk-sh-teh">
                    <span>
                      Assessed by <b>{e.scout.short}</b>, {fmtDate(e.date, true)}
                    </span>
                    <Rating v={e.grade} />
                  </div>
                  <div className="mk-sh-tem">
                    <Icon n={e.kind === "Video review" ? "video" : "cal"} s={11} />
                    {e.kind} · {e.match}
                  </div>
                  <p className="mk-sh-ten">{e.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div>
        <div className="mk-sh-fl">Similar keepers</div>
        <div className="mk-sh-sim">
          {similar.map(({ x, d }) => (
            <button type="button" className="mk-sh-simc" key={x.id} onClick={() => onOpen(x.id)}>
              <Av k={x} size={30} />
              <span>
                <b>{x.name}</b>
                <span>
                  <span className="mk-sh-match">{Math.max(71, 98 - Math.round(d * 2))}% match</span>{" "}
                  · {x.age}y · {(x.h / 100).toFixed(2)}m
                </span>
              </span>
              <Rating v={x.rating} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
