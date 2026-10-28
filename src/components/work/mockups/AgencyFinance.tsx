import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type View = "overview" | "commissions" | "cash" | "contracts";
type Period = "month" | "quarter" | "year";
type Status = "Paid" | "Invoiced" | "Due" | "Overdue";
type Stage = "Not started" | "In talks" | "Heads of terms" | "Signed";

interface Kpi {
  label: string;
  value: number;
  delta: number;
  vs: string;
  spark: number[];
  goodWhenUp: boolean;
}

interface PeriodData {
  label: string;
  chartTitle: string;
  chartNote: string;
  kpis: Kpi[];
  labels: string[];
  values: number[];
  prior?: number[];
  forecast?: number[];
  split: number[];
}

interface Commission {
  id: string;
  player: string;
  pos: string;
  club: string;
  league: string;
  end: string;
  pct: number;
  gross: number;
  due: number;
  collected: number;
  dueDate: string;
  late?: number;
  status: Status;
}

interface Payment {
  date: string;
  who: string;
  what: string;
  amount: number;
  tag: string;
}

interface Contract {
  id: string;
  player: string;
  pos: string;
  club: string;
  startPos: number;
  endY: number;
  endM: number;
  stake: number;
  wage: string;
  stage: Stage;
}

/* ------------------------------------------------------------------ */
/* Data (fictional, hardcoded so SSR and client match)                 */
/* ------------------------------------------------------------------ */

const SOURCES = ["Player contracts", "Commercial", "Transfers", "Other"];
const SOURCE_COLORS = ["#0f9f6e", "#7fcfae", "#2f4858", "#d8ccb2"];

const PERIODS: Record<Period, PeriodData> = {
  month: {
    label: "October 2026",
    chartTitle: "Revenue by month",
    chartNote: "Nov 2025 – Oct 2026 · dashed line is prior year",
    kpis: [
      {
        label: "Revenue",
        value: 418600,
        delta: 12.5,
        vs: "vs Oct 2025",
        spark: [362, 341, 528, 356, 334, 318, 372, 446, 588, 694, 372, 419],
        goodWhenUp: true,
      },
      {
        label: "Commission due",
        value: 186400,
        delta: -6.2,
        vs: "vs Sep 2026",
        spark: [212, 230, 198, 240, 226, 205, 190, 215, 199, 187, 199, 186],
        goodWhenUp: false,
      },
      {
        label: "Cash in bank",
        value: 2146900,
        delta: 3.2,
        vs: "vs 30 Sep",
        spark: [1810, 1790, 1880, 1902, 1915, 1890, 1960, 2010, 2040, 2120, 2080, 2147],
        goodWhenUp: true,
      },
      {
        label: "Forecast · Nov",
        value: 452000,
        delta: 8.0,
        vs: "vs October",
        spark: [330, 352, 340, 371, 362, 380, 401, 395, 412, 430, 419, 452],
        goodWhenUp: true,
      },
    ],
    labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    values: [362, 341, 528, 356, 334, 318, 372, 446, 588, 694, 372, 418.6],
    prior: [318, 305, 462, 330, 301, 296, 340, 401, 512, 610, 344, 372],
    split: [251.2, 92.1, 54.4, 20.9],
  },
  quarter: {
    label: "Q3 2026 (Jul – Sep)",
    chartTitle: "Revenue by quarter",
    chartNote: "Q4 2024 – Q3 2026 · dashed line is prior year",
    kpis: [
      {
        label: "Revenue",
        value: 1654000,
        delta: 12.8,
        vs: "vs Q3 2025",
        spark: [1012, 1102, 1004, 1466, 1087, 1218, 1136, 1654],
        goodWhenUp: true,
      },
      {
        label: "Commission due",
        value: 612400,
        delta: -4.1,
        vs: "vs Q2 2026",
        spark: [702, 688, 671, 655, 640, 638, 621, 612],
        goodWhenUp: false,
      },
      {
        label: "Cash in bank",
        value: 2080300,
        delta: 6.4,
        vs: "vs 30 Jun",
        spark: [1620, 1690, 1740, 1810, 1880, 1902, 1955, 2080],
        goodWhenUp: true,
      },
      {
        label: "Forecast · Q4",
        value: 1262000,
        delta: 16.1,
        vs: "vs Q4 2025",
        spark: [960, 1012, 1040, 1087, 1110, 1180, 1214, 1262],
        goodWhenUp: true,
      },
    ],
    labels: ["Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26"],
    values: [1012, 1102, 1004, 1466, 1087, 1218, 1136, 1654],
    prior: [896, 951, 880, 1240, 1012, 1102, 1004, 1466],
    split: [846, 312, 418, 78],
  },
  year: {
    label: "2026 to date",
    chartTitle: "Revenue by year",
    chartNote: "2021 – 2026 · hatched is forecast to 31 Dec",
    kpis: [
      {
        label: "Revenue",
        value: 4426600,
        delta: 12.5,
        vs: "vs 2025 YTD",
        spark: [2840, 3310, 3720, 4204, 4659, 4427],
        goodWhenUp: true,
      },
      {
        label: "Commission due",
        value: 1284500,
        delta: 9.3,
        vs: "vs 2025",
        spark: [820, 905, 990, 1102, 1175, 1285],
        goodWhenUp: true,
      },
      {
        label: "Cash in bank",
        value: 2146900,
        delta: 18.7,
        vs: "vs 1 Jan",
        spark: [1120, 1360, 1505, 1690, 1809, 2147],
        goodWhenUp: true,
      },
      {
        label: "Forecast · FY26",
        value: 5246000,
        delta: 12.6,
        vs: "vs 2025",
        spark: [2840, 3310, 3720, 4204, 4659, 5246],
        goodWhenUp: true,
      },
    ],
    labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
    values: [2840, 3310, 3720, 4204, 4659, 4426.6],
    forecast: [0, 0, 0, 0, 0, 819.4],
    split: [2302, 864, 1026, 234.6],
  },
};

const COMMISSIONS: Commission[] = [
  {
    id: "c1",
    player: "Tom Okafor",
    pos: "CM",
    club: "Northbridge FC",
    league: "Championship",
    end: "30 Jun 2029",
    pct: 8,
    gross: 1575000,
    due: 42000,
    collected: 42000,
    dueDate: "15 Oct 2026",
    late: 13,
    status: "Overdue",
  },
  {
    id: "c2",
    player: "Luca Brennan",
    pos: "ST",
    club: "Harbour Athletic",
    league: "Top flight",
    end: "30 Jun 2028",
    pct: 7.5,
    gross: 3100000,
    due: 77500,
    collected: 77500,
    dueDate: "31 Oct 2026",
    status: "Due",
  },
  {
    id: "c3",
    player: "Sami Haddad",
    pos: "RW",
    club: "Kingsmoor Town",
    league: "League One",
    end: "30 Jun 2027",
    pct: 10,
    gross: 372000,
    due: 12400,
    collected: 12400,
    dueDate: "1 Oct 2026",
    late: 27,
    status: "Overdue",
  },
  {
    id: "c4",
    player: "Jonah Price",
    pos: "GK",
    club: "Ashvale United",
    league: "Championship",
    end: "30 Jun 2030",
    pct: 6,
    gross: 1840000,
    due: 27600,
    collected: 0,
    dueDate: "30 Sep 2026",
    status: "Paid",
  },
  {
    id: "c5",
    player: "Callum Reyes",
    pos: "CB",
    club: "Redhill Rovers",
    league: "League One",
    end: "31 Jan 2027",
    pct: 10,
    gross: 268500,
    due: 8950,
    collected: 8950,
    dueDate: "4 Nov 2026",
    status: "Invoiced",
  },
  {
    id: "c6",
    player: "Ethan Marsh",
    pos: "LB",
    club: "Westmere City",
    league: "Top flight",
    end: "30 Jun 2029",
    pct: 5,
    gross: 4620000,
    due: 57750,
    collected: 57750,
    dueDate: "12 Nov 2026",
    status: "Invoiced",
  },
  {
    id: "c7",
    player: "Rafael Duarte",
    pos: "AM",
    club: "Greywater FC",
    league: "Championship",
    end: "30 Jun 2028",
    pct: 8,
    gross: 1248000,
    due: 24960,
    collected: 24960,
    dueDate: "28 Oct 2026",
    status: "Due",
  },
  {
    id: "c8",
    player: "Kieran Walsh",
    pos: "DM",
    club: "Saltmarsh Rovers",
    league: "League Two",
    end: "30 Jun 2027",
    pct: 10,
    gross: 148000,
    due: 4930,
    collected: 4935,
    dueDate: "20 Sep 2026",
    status: "Paid",
  },
  {
    id: "c9",
    player: "Marcus Hale",
    pos: "CF",
    club: "Northbridge FC",
    league: "U21",
    end: "30 Jun 2027",
    pct: 10,
    gross: 96000,
    due: 3200,
    collected: 3200,
    dueDate: "5 Nov 2026",
    status: "Invoiced",
  },
  {
    id: "c10",
    player: "Theo Lindqvist",
    pos: "CB",
    club: "Harbour Athletic",
    league: "Top flight",
    end: "30 Jun 2031",
    pct: 6,
    gross: 5450000,
    due: 68125,
    collected: 0,
    dueDate: "30 Sep 2026",
    status: "Paid",
  },
  {
    id: "c11",
    player: "Ollie Fenwick",
    pos: "RB",
    club: "Ashvale United",
    league: "Championship",
    end: "30 Jun 2027",
    pct: 8,
    gross: 612000,
    due: 16320,
    collected: 16320,
    dueDate: "14 Nov 2026",
    status: "Due",
  },
  {
    id: "c12",
    player: "Danny Okoro",
    pos: "LW",
    club: "Kingsmoor Town",
    league: "League One",
    end: "31 May 2028",
    pct: 10,
    gross: 410000,
    due: 13670,
    collected: 13665,
    dueDate: "15 Sep 2026",
    status: "Paid",
  },
];

const PAYMENTS: Payment[] = [
  {
    date: "30 Oct",
    who: "Harbour Athletic",
    what: "Commission · L. Brennan",
    amount: 77500,
    tag: "Expected",
  },
  {
    date: "31 Oct",
    who: "Payroll",
    what: "October salaries · 14 staff",
    amount: -118400,
    tag: "Scheduled",
  },
  {
    date: "3 Nov",
    who: "Halden Boots",
    what: "Boot deal royalty · Q3",
    amount: 46000,
    tag: "Expected",
  },
  {
    date: "4 Nov",
    who: "Redhill Rovers",
    what: "Commission · C. Reyes",
    amount: 8950,
    tag: "Invoiced",
  },
  { date: "5 Nov", who: "HMRC", what: "VAT return · Q3", amount: -96240, tag: "Scheduled" },
  {
    date: "7 Nov",
    who: "Northbridge FC",
    what: "Overdue commission · T. Okafor",
    amount: 42000,
    tag: "Chasing",
  },
  {
    date: "10 Nov",
    who: "Office lease",
    what: "Manchester office · Q4 rent",
    amount: -21600,
    tag: "Scheduled",
  },
  {
    date: "12 Nov",
    who: "Westmere City",
    what: "Commission · E. Marsh",
    amount: 57750,
    tag: "Invoiced",
  },
  {
    date: "14 Nov",
    who: "Scouting network",
    what: "Retainers · 6 scouts",
    amount: -14800,
    tag: "Scheduled",
  },
  {
    date: "18 Nov",
    who: "Vireo Nutrition",
    what: "Ambassador fee · S. Haddad",
    amount: 18000,
    tag: "Expected",
  },
  {
    date: "20 Nov",
    who: "Travel desk",
    what: "Player care & travel",
    amount: -9350,
    tag: "Scheduled",
  },
  {
    date: "28 Nov",
    who: "Payroll",
    what: "November salaries · 14 staff",
    amount: -118400,
    tag: "Scheduled",
  },
];

const CASH_MONTHS = [
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];
const CASH_IN = [382, 356, 548, 371, 352, 339, 401, 468, 612, 734, 398, 442];
const CASH_OUT = [291, 334, 342, 305, 288, 296, 318, 352, 371, 402, 322, 317];

const WATERFALL = [
  { label: "Opening", value: 2147, kind: "total" as const },
  { label: "Fees", value: 938, kind: "in" as const },
  { label: "Commercial", value: 312, kind: "in" as const },
  { label: "Transfers", value: 420, kind: "in" as const },
  { label: "Payroll", value: -486, kind: "out" as const },
  { label: "Player care", value: -128, kind: "out" as const },
  { label: "Tax & VAT", value: -362, kind: "out" as const },
  { label: "Overheads", value: -94, kind: "out" as const },
  { label: "Closing", value: 0, kind: "total" as const },
];

// Timeline positions are in months from 1 Oct 2026 (0) to 31 Dec 2027 (15).
const CONTRACTS: Contract[] = [
  {
    id: "k1",
    player: "Aaron Whitlock",
    pos: "CM",
    club: "Greywater FC",
    startPos: -18,
    endY: 2026,
    endM: 12,
    stake: 36000,
    wage: "£9,500 pw",
    stage: "Heads of terms",
  },
  {
    id: "k2",
    player: "Callum Reyes",
    pos: "CB",
    club: "Redhill Rovers",
    startPos: -9,
    endY: 2027,
    endM: 1,
    stake: 22000,
    wage: "£4,200 pw",
    stage: "Not started",
  },
  {
    id: "k3",
    player: "Ben Carrow",
    pos: "ST",
    club: "Westmere City",
    startPos: -22,
    endY: 2027,
    endM: 5,
    stake: 148000,
    wage: "£31,000 pw",
    stage: "In talks",
  },
  {
    id: "k4",
    player: "Sami Haddad",
    pos: "RW",
    club: "Kingsmoor Town",
    startPos: -27,
    endY: 2027,
    endM: 6,
    stake: 41000,
    wage: "£6,800 pw",
    stage: "In talks",
  },
  {
    id: "k5",
    player: "Ollie Fenwick",
    pos: "RB",
    club: "Ashvale United",
    startPos: -15,
    endY: 2027,
    endM: 6,
    stake: 52000,
    wage: "£8,100 pw",
    stage: "Not started",
  },
  {
    id: "k6",
    player: "Kieran Walsh",
    pos: "DM",
    club: "Saltmarsh Rovers",
    startPos: -24,
    endY: 2027,
    endM: 6,
    stake: 14500,
    wage: "£2,300 pw",
    stage: "Not started",
  },
  {
    id: "k7",
    player: "Marcus Hale",
    pos: "CF",
    club: "Northbridge FC",
    startPos: -6,
    endY: 2027,
    endM: 6,
    stake: 9800,
    wage: "£1,600 pw",
    stage: "Not started",
  },
  {
    id: "k8",
    player: "Josh Amadi",
    pos: "GK",
    club: "Harbour Athletic",
    startPos: -30,
    endY: 2027,
    endM: 8,
    stake: 64000,
    wage: "£12,500 pw",
    stage: "Not started",
  },
  {
    id: "k9",
    player: "Rafael Duarte",
    pos: "AM",
    club: "Greywater FC",
    startPos: -4,
    endY: 2028,
    endM: 6,
    stake: 0,
    wage: "£14,000 pw",
    stage: "Signed",
  },
];

const TIMELINE_MONTHS = [
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TODAY_POS = 27 / 31;
const STAGES: Stage[] = ["Not started", "In talks", "Heads of terms", "Signed"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function commas(n: number) {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function gbp(n: number) {
  return (n < 0 ? "−" : "") + "£" + commas(Math.abs(n));
}
function gbpShort(n: number) {
  const a = Math.abs(n);
  const s = n < 0 ? "−" : "";
  if (a >= 1000000) return `${s}£${(a / 1000000).toFixed(2)}m`;
  if (a >= 1000) return `${s}£${(a / 1000).toFixed(a >= 100000 ? 0 : 1)}k`;
  return `${s}£${Math.round(a)}`;
}
/** value given in £k */
function kLabel(k: number) {
  if (k >= 1000) return `£${(k / 1000).toFixed(k % 1000 === 0 ? 0 : 1)}m`;
  return `£${Math.round(k)}k`;
}
function niceStep(max: number, ticks: number) {
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * mag;
}
function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}
const AVATAR_BG = [
  "linear-gradient(135deg,#0f9f6e,#5cc39b)",
  "linear-gradient(135deg,#2f4858,#55788c)",
  "linear-gradient(135deg,#c9814f,#e6b17e)",
  "linear-gradient(135deg,#6b5ca5,#9d8fd4)",
  "linear-gradient(135deg,#b4534a,#e08b7d)",
  "linear-gradient(135deg,#3c7a8a,#7ab6c2)",
];
function avatarBg(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return AVATAR_BG[h % AVATAR_BG.length];
}
function endPos(c: { endY: number; endM: number }) {
  return (c.endY - 2026) * 12 + (c.endM - 10) + 1;
}
function daysLeft(c: { endY: number; endM: number }) {
  const end = Date.UTC(c.endY, c.endM - 1, DAYS_IN[c.endM - 1]);
  const today = Date.UTC(2026, 9, 28);
  return Math.round((end - today) / 86400000);
}
function endLabel(c: { endY: number; endM: number }) {
  return `${DAYS_IN[c.endM - 1]} ${MONTH_NAMES[c.endM - 1]} ${c.endY}`;
}

function tipPos(x: number, bw: number, top: number, left: boolean) {
  return {
    left: left ? x - bw / 2 - 10 : x + bw / 2 + 10,
    top,
    transform: left ? "translateX(-100%)" : "none",
  };
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ d, size = 16 }: { d: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
  overview: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  commissions: (
    <>
      <path d="M4 20 20 4" />
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="17" cy="17" r="2.6" />
    </>
  ),
  cash: (
    <>
      <path d="M7 4v16M7 20l-3-3M7 20l3-3" />
      <path d="M17 20V4M17 4l-3 3M17 4l3 3" />
    </>
  ),
  contracts: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  bell: (
    <>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  bookmark: <path d="M7 4h10v16l-5-3.5L7 20z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  send: <path d="M4 12 20 4l-6 16-3-7z" />,
  arrowIn: <path d="M17 7 7 17M7 9v8h8" />,
  arrowOut: <path d="M7 17 17 7M9 7h8v8" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  sync: <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9M18 3v4h-4M6 21v-4h4" />,
};

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-af{--bg:#fbfaf7;--side:#f3f1eb;--card:#ffffff;--line:#ebe7dd;--line2:#f2efe8;--ink:#1d1c19;--ink2:#46433c;--mute:#77726a;--faint:#a29d92;--em:#0f9f6e;--em-d:#0b7f58;--em-s:#e4f4ec;--co:#e1664c;--co-s:#fcebe6;--am:#b7800f;--am-s:#fbf1dc;--bl:#3767c9;--bl-s:#e9effb;
  width:100%;height:100%;overflow:hidden;position:relative;display:grid;grid-template-columns:224px 1fr;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:1.4;font-feature-settings:"tnum" 1,"cv11" 1;-webkit-font-smoothing:antialiased;text-align:left}
.mk-af *{box-sizing:border-box}
.mk-af h1,.mk-af h2,.mk-af h3,.mk-af p,.mk-af ul,.mk-af li{margin:0;padding:0;list-style:none}
.mk-af button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;text-align:inherit}
.mk-af button:focus-visible{outline:2px solid var(--em);outline-offset:2px}
.mk-af .num{font-variant-numeric:tabular-nums}

/* sidebar */
.mk-af .side{background:var(--side);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:16px 12px 14px;min-height:0}
.mk-af .brand{display:flex;align-items:center;gap:10px;padding:2px 6px 16px}
.mk-af .logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(150deg,#13b07c,#0b7f58);display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 1px 2px rgba(11,127,88,.3)}
.mk-af .brand b{display:block;font-size:14px;font-weight:650;letter-spacing:-.01em}
.mk-af .brand small{display:block;font-size:11.5px;color:var(--mute)}
.mk-af .navlabel{font-size:11px;font-weight:600;color:var(--faint);letter-spacing:.06em;text-transform:uppercase;padding:14px 8px 6px}
.mk-af .navlist{display:flex;flex-direction:column;gap:2px}
.mk-af .navbtn{display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border-radius:7px;color:var(--ink2);font-weight:500;font-size:13.5px;transition:background .15s,color .15s}
.mk-af .navbtn svg{color:var(--mute);flex:none}
.mk-af .navbtn:hover{background:rgba(29,28,25,.045)}
.mk-af .navbtn[aria-current="page"]{background:var(--card);color:var(--ink);box-shadow:0 0 0 1px var(--line),0 1px 2px rgba(40,30,10,.05)}
.mk-af .navbtn[aria-current="page"] svg{color:var(--em)}
.mk-af .navbtn .badge{margin-left:auto;font-size:11px;font-weight:600;background:var(--co-s);color:#b8452e;border-radius:10px;padding:1px 7px}
.mk-af .navbtn .cnt{margin-left:auto;font-size:11.5px;color:var(--faint)}
.mk-af .saved{font-size:13px;font-weight:450}
.mk-af .saved svg{color:var(--faint)}
.mk-af .sidefoot{margin-top:auto;display:flex;flex-direction:column;gap:10px}
.mk-af .syncbox{border:1px solid var(--line);background:rgba(255,255,255,.6);border-radius:9px;padding:10px 11px;font-size:12px;color:var(--mute)}
.mk-af .syncbox b{display:flex;align-items:center;gap:6px;color:var(--ink2);font-weight:550;font-size:12.5px;margin-bottom:2px}
.mk-af .livedot{width:7px;height:7px;border-radius:50%;background:var(--em);box-shadow:0 0 0 3px var(--em-s);flex:none}
.mk-af .me{display:flex;align-items:center;gap:9px;padding:4px 4px 0}
.mk-af .av{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:600;font-size:11.5px;flex:none;letter-spacing:.02em}
.mk-af .me b{display:block;font-size:12.5px;font-weight:600}
.mk-af .me small{display:block;font-size:11.5px;color:var(--mute)}

/* main */
.mk-af .main{display:flex;flex-direction:column;min-width:0;min-height:0}
.mk-af .top{height:52px;flex:none;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px;padding:0 24px;background:rgba(251,250,247,.9)}
.mk-af .crumb{font-size:13px;color:var(--mute);display:flex;align-items:center;gap:6px}
.mk-af .crumb b{color:var(--ink);font-weight:550}
.mk-af .searchbtn{margin-left:auto;display:flex;align-items:center;gap:8px;width:280px;height:32px;border:1px solid var(--line);background:var(--card);border-radius:8px;padding:0 10px;color:var(--faint);font-size:13px}
.mk-af .searchbtn kbd{margin-left:auto;font-family:"IBM Plex Mono",monospace;font-size:11px;border:1px solid var(--line);border-radius:4px;padding:0 5px;color:var(--mute);background:var(--bg)}
.mk-af .iconbtn{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;color:var(--ink2);border:1px solid var(--line);background:var(--card);position:relative}
.mk-af .iconbtn:hover{background:var(--bg)}
.mk-af .iconbtn .pip{position:absolute;top:6px;right:7px;width:6px;height:6px;border-radius:50%;background:var(--co);box-shadow:0 0 0 2px var(--card)}
.mk-af .datechip{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--mute)}
.mk-af .body{flex:1;min-height:0;padding:20px 24px 20px;position:relative;display:flex;flex-direction:column;gap:14px;overflow:hidden}

.mk-af .phead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex:none}
.mk-af .phead h1{font-size:21px;font-weight:650;letter-spacing:-.02em;line-height:1.2}
.mk-af .phead p{font-size:13px;color:var(--mute);margin-top:3px}
.mk-af .actions{display:flex;gap:8px;align-items:center}
.mk-af .btn{height:32px;display:inline-flex;align-items:center;gap:7px;padding:0 12px;border-radius:8px;border:1px solid var(--line);background:var(--card);font-weight:550;font-size:13px;color:var(--ink2);box-shadow:0 1px 1px rgba(40,30,10,.04);transition:background .15s,border-color .15s}
.mk-af .btn:hover{background:#f7f5f0;border-color:#e0dbcf}
.mk-af .btn.pri{background:var(--ink);border-color:var(--ink);color:#fff}
.mk-af .btn.pri:hover{background:#34322d}
.mk-af .btn.em{background:var(--em);border-color:var(--em);color:#fff}
.mk-af .btn.em:hover{background:var(--em-d)}

.mk-af .seg{display:inline-flex;background:#efece5;border-radius:9px;padding:3px;gap:2px;border:1px solid #e8e4da}
.mk-af .seg button{height:26px;padding:0 12px;border-radius:6px;font-size:12.5px;font-weight:550;color:var(--mute);transition:background .15s,color .15s}
.mk-af .seg button:hover{color:var(--ink)}
.mk-af .seg button[aria-pressed="true"]{background:var(--card);color:var(--ink);box-shadow:0 1px 2px rgba(40,30,10,.1),0 0 0 1px rgba(40,30,10,.04)}

.mk-af .card{background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:0 1px 2px rgba(40,30,10,.03)}
.mk-af .chead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px 0}
.mk-af .chead h2{font-size:13.5px;font-weight:600;letter-spacing:-.005em}
.mk-af .chead p{font-size:12px;color:var(--mute);margin-top:1px}
.mk-af .linkbtn{font-size:12.5px;color:var(--em-d);font-weight:550;display:inline-flex;align-items:center;gap:2px}
.mk-af .linkbtn:hover{text-decoration:underline}

/* KPI */
.mk-af .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;flex:none}
.mk-af .kpi{padding:14px 16px 12px;position:relative;overflow:hidden;height:104px}
.mk-af .kpi .lab{font-size:12.5px;color:var(--mute);font-weight:500;display:flex;align-items:center;gap:6px}
.mk-af .kpi .val{font-size:24px;font-weight:650;letter-spacing:-.025em;margin-top:8px;line-height:1.1}
.mk-af .kpi .delta{display:flex;align-items:center;gap:6px;margin-top:9px;font-size:12px;color:var(--mute)}
.mk-af .kpi svg.spark{position:absolute;right:14px;top:16px}
.mk-af .chip{display:inline-flex;align-items:center;gap:3px;font-size:11.5px;font-weight:600;border-radius:6px;padding:1px 6px}
.mk-af .chip.up{background:var(--em-s);color:var(--em-d)}
.mk-af .chip.dn{background:var(--co-s);color:#b8452e}

/* overview grid */
.mk-af .ovgrid{display:grid;grid-template-columns:1fr 348px;gap:12px;flex:none;height:262px}
.mk-af .chartwrap{position:relative;padding:4px 12px 0 8px}
.mk-af .legend{display:flex;gap:14px;font-size:12px;color:var(--mute);align-items:center}
.mk-af .legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.mk-af .legend i.ln{height:0;border-top:2px dashed #b8b2a3;border-radius:0;width:14px;vertical-align:3px}
.mk-af .legend i.ht{background:repeating-linear-gradient(135deg,var(--em) 0 2px,#d5efe3 2px 5px)}
.mk-af .tip{position:absolute;pointer-events:none;background:var(--ink);color:#fff;border-radius:8px;padding:8px 10px;font-size:12px;min-width:136px;transition:left .15s ease,top .15s ease;box-shadow:0 6px 18px rgba(20,15,5,.18);white-space:nowrap;z-index:3}
.mk-af .tip b{display:block;font-size:14px;font-weight:650;margin:1px 0 2px}
.mk-af .tip span{color:#bdb8ad}
.mk-af .tip > span{display:block}
.mk-af .tip .g{color:#6ee0b2}
.mk-af .donutwrap{display:flex;flex-direction:column;align-items:stretch;padding:8px 16px 14px;gap:12px}
.mk-af .donutrow{display:flex;align-items:center;gap:16px}
.mk-af .srcs{flex:1;display:flex;flex-direction:column;gap:2px}
.mk-af .src{display:grid;grid-template-columns:10px 1fr auto;gap:8px;align-items:center;padding:5px 6px;border-radius:6px;font-size:12.5px;width:100%}
.mk-af .src:hover,.mk-af .src.on{background:#f6f4ee}
.mk-af .src i{width:9px;height:9px;border-radius:3px}
.mk-af .src em{font-style:normal;color:var(--mute);font-size:12px}
.mk-af .srcbar{display:flex;height:8px;border-radius:5px;overflow:hidden;gap:2px}
.mk-af .srcfoot{display:flex;justify-content:space-between;font-size:12px;color:var(--mute)}
.mk-af .srcfoot b{color:var(--ink);font-weight:600}

.mk-af .tri{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;flex:1;min-height:0}
.mk-af .tri .card{display:flex;flex-direction:column;min-height:0;overflow:hidden}
.mk-af .mini{padding:8px 8px 8px;display:flex;flex-direction:column}
.mk-af .mrow{display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:7px;width:100%}
.mk-af .mrow:hover{background:#f7f5f0}
.mk-af .mrow .av{width:26px;height:26px;font-size:10.5px}
.mk-af .mrow .t{flex:1;min-width:0}
.mk-af .mrow .t b{display:block;font-weight:550;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-af .mrow .t small{display:block;font-size:11.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-af .mrow .amt{font-weight:600;font-size:13px;text-align:right}
.mk-af .mrow .amt small{display:block;font-weight:500;font-size:11.5px;color:var(--mute)}
.mk-af .dirico{width:26px;height:26px;border-radius:7px;display:grid;place-items:center;flex:none}
.mk-af .dirico.in{background:var(--em-s);color:var(--em-d)}
.mk-af .dirico.out{background:var(--co-s);color:#c2523a}
.mk-af .pos{color:var(--em-d)}
.mk-af .neg{color:var(--ink)}

/* pills */
.mk-af .spill{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;border-radius:20px;padding:2px 8px 2px 7px;white-space:nowrap;line-height:1.35}
.mk-af .spill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.mk-af .spill.Paid{background:var(--em-s);color:var(--em-d)}
.mk-af .spill.Invoiced{background:var(--bl-s);color:var(--bl)}
.mk-af .spill.Due{background:var(--am-s);color:var(--am)}
.mk-af .spill.Overdue{background:var(--co-s);color:#c2492f}
.mk-af .spill.neutral{background:#f1eee7;color:var(--ink2)}
.mk-af .spill.Signed{background:var(--em-s);color:var(--em-d)}
.mk-af .spill.talks{background:var(--bl-s);color:var(--bl)}
.mk-af .spill.hot{background:var(--am-s);color:var(--am)}

/* commissions */
.mk-af .sumstrip{display:grid;grid-template-columns:repeat(4,1fr);flex:none}
.mk-af .sumstrip > div{padding:12px 16px;border-left:1px solid var(--line2)}
.mk-af .sumstrip > div:first-child{border-left:0}
.mk-af .sumstrip small{display:block;font-size:12px;color:var(--mute);font-weight:500}
.mk-af .sumstrip b{display:block;font-size:19px;font-weight:650;letter-spacing:-.02em;margin-top:3px}
.mk-af .sumstrip span{font-size:12px;color:var(--mute);font-weight:500}
.mk-af .sumstrip .sbar{display:flex;height:4px;border-radius:2px;overflow:hidden;margin-top:8px;background:var(--line2)}
.mk-af .tabsrow{display:flex;align-items:center;justify-content:space-between;flex:none;margin-bottom:-4px}
.mk-af .tabs{display:flex;gap:4px}
.mk-af .tab{height:30px;padding:0 11px;border-radius:7px;font-weight:550;font-size:13px;color:var(--mute);display:inline-flex;align-items:center;gap:7px;border:1px solid transparent}
.mk-af .tab:hover{color:var(--ink);background:#f3f1eb}
.mk-af .tab[aria-pressed="true"]{background:var(--card);color:var(--ink);border-color:var(--line);box-shadow:0 1px 2px rgba(40,30,10,.05)}
.mk-af .tab span{font-size:11.5px;color:var(--faint);font-weight:600;background:#f1eee7;border-radius:10px;padding:0 6px;min-width:20px;text-align:center}
.mk-af .tab[aria-pressed="true"] span{background:var(--ink);color:#fff}
.mk-af .sorthint{font-size:12px;color:var(--mute)}
.mk-af .tablecard{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}
.mk-af .tbl{display:grid;grid-template-columns:minmax(200px,1.5fr) 1.25fr 110px 92px 118px 124px 104px 28px;align-items:center}
.mk-af .thead{font-size:11.5px;color:var(--mute);font-weight:600;letter-spacing:.02em;text-transform:uppercase;border-bottom:1px solid var(--line);background:#fcfbf8;height:36px;padding:0 12px 0 16px;flex:none}
.mk-af .tbody{overflow:auto;flex:1}
.mk-af .trow{width:100%;height:43px;padding:0 12px 0 16px;border-bottom:1px solid var(--line2);transition:background .12s;font-size:13px}
.mk-af .trow:hover{background:#faf8f3}
.mk-af .trow.sel{background:#f2faf6;box-shadow:inset 3px 0 0 var(--em)}
.mk-af .r{text-align:right;justify-self:end}
.mk-af .pcell{display:flex;align-items:center;gap:10px;min-width:0}
.mk-af .pcell .av{width:28px;height:28px;font-size:10.5px}
.mk-af .pcell b{font-weight:550;display:block;white-space:nowrap}
.mk-af .pcell small,.mk-af .sub{display:block;font-size:11.5px;color:var(--mute)}
.mk-af .late{color:#c2492f;font-weight:500}
.mk-af .chev{color:var(--faint);justify-self:end}
.mk-af .empty{padding:40px;text-align:center;color:var(--mute)}

/* drawer */
.mk-af .scrim{position:absolute;inset:0;background:rgba(29,28,25,.06);z-index:4}
.mk-af .drawer{position:absolute;top:0;right:0;bottom:0;width:392px;background:var(--card);border-left:1px solid var(--line);box-shadow:-18px 0 40px rgba(30,22,8,.10);z-index:5;display:flex;flex-direction:column}
.mk-af .dhead{padding:18px 20px 14px;border-bottom:1px solid var(--line2);display:flex;gap:12px;align-items:flex-start}
.mk-af .dhead .av{width:42px;height:42px;font-size:14px}
.mk-af .dhead h3{font-size:16px;font-weight:650;letter-spacing:-.01em}
.mk-af .dhead p{font-size:12.5px;color:var(--mute);margin-top:1px}
.mk-af .dclose{margin-left:auto;width:28px;height:28px;border-radius:7px;display:grid;place-items:center;color:var(--mute)}
.mk-af .dclose:hover{background:#f3f1eb;color:var(--ink)}
.mk-af .dbody{flex:1;overflow:auto;padding:16px 20px;display:flex;flex-direction:column;gap:16px}
.mk-af .bigamt{display:flex;align-items:flex-end;justify-content:space-between}
.mk-af .bigamt small{display:block;font-size:12px;color:var(--mute)}
.mk-af .bigamt b{display:block;font-size:26px;font-weight:650;letter-spacing:-.025em;margin-top:2px}
.mk-af .prog{height:6px;border-radius:3px;background:var(--line2);overflow:hidden}
.mk-af .prog i{display:block;height:100%;background:var(--em);border-radius:3px;transition:width .4s}
.mk-af .progl{display:flex;justify-content:space-between;font-size:12px;color:var(--mute);margin-top:6px}
.mk-af .kv{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line2);border-radius:10px;overflow:hidden}
.mk-af .kv div{padding:9px 12px;border-bottom:1px solid var(--line2)}
.mk-af .kv div:nth-child(odd){border-right:1px solid var(--line2)}
.mk-af .kv div:nth-last-child(-n+2){border-bottom:0}
.mk-af .kv small{display:block;font-size:11.5px;color:var(--mute)}
.mk-af .kv b{display:block;font-size:13px;font-weight:550;margin-top:1px}
.mk-af .sect{font-size:11.5px;color:var(--faint);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.mk-af .acts{display:flex;flex-direction:column;gap:0}
.mk-af .act{display:grid;grid-template-columns:14px 1fr auto;gap:10px;font-size:12.5px;padding:6px 0;position:relative}
.mk-af .act i{width:8px;height:8px;border-radius:50%;margin-top:5px;background:#d6d1c4;justify-self:center;position:relative;z-index:1}
.mk-af .act i.on{background:var(--em)}
.mk-af .act i.bad{background:var(--co)}
.mk-af .act::before{content:"";position:absolute;left:6.5px;top:16px;bottom:-6px;width:1px;background:var(--line)}
.mk-af .act:last-child::before{display:none}
.mk-af .act span{color:var(--mute);font-size:12px}
.mk-af .dfoot{border-top:1px solid var(--line2);padding:14px 20px;display:flex;gap:8px;justify-content:flex-end}

/* cash */
.mk-af .stats4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;flex:none}
.mk-af .stat{padding:12px 16px;height:84px}
.mk-af .stat small{display:block;font-size:12px;color:var(--mute);font-weight:500}
.mk-af .stat b{display:block;font-size:20px;font-weight:650;letter-spacing:-.02em;margin-top:4px}
.mk-af .stat span{font-size:12px;color:var(--mute)}
.mk-af .cashgrid{display:grid;grid-template-columns:1fr 340px;gap:12px;flex:1;min-height:0}
.mk-af .cashleft{display:flex;flex-direction:column;gap:12px;min-height:0}
.mk-af .paylist{display:flex;flex-direction:column;min-height:0;overflow:hidden}
.mk-af .paylist .tabs{padding:10px 16px 6px}
.mk-af .payscroll{overflow:auto;flex:1;padding:0 8px 8px}
.mk-af .daygrp{font-size:11.5px;color:var(--faint);font-weight:600;padding:8px 8px 2px;letter-spacing:.04em;text-transform:uppercase}

/* contracts */
.mk-af .ctgrid{display:grid;grid-template-columns:1fr 330px;gap:12px;flex:1;min-height:0}
.mk-af .tlcard{display:flex;flex-direction:column;min-height:0;overflow:hidden}
.mk-af .tlhead{display:grid;grid-template-columns:190px 1fr;border-bottom:1px solid var(--line);height:34px;align-items:center;margin-top:12px;flex:none;position:relative;z-index:3}
.mk-af .tlmonths{display:grid;grid-template-columns:repeat(15,1fr);height:100%;position:relative}
.mk-af .tlmonths span{font-size:11.5px;color:var(--mute);padding-left:6px;border-left:1px solid var(--line2);display:flex;align-items:center;height:100%}
.mk-af .tlmonths span.yr{color:var(--ink);font-weight:600}
.mk-af .tlbody{flex:1;overflow:auto;position:relative}
.mk-af .tlrow{display:grid;grid-template-columns:190px 1fr;height:50px;width:100%;align-items:center;border-bottom:1px solid var(--line2);transition:background .12s}
.mk-af .tlrow:hover{background:#faf8f3}
.mk-af .tlrow.sel{background:#f2faf6}
.mk-af .tlname{display:flex;align-items:center;gap:9px;padding-left:16px;min-width:0}
.mk-af .tlname .av{width:26px;height:26px;font-size:10px}
.mk-af .tlname b{display:block;font-weight:550;font-size:13px;white-space:nowrap}
.mk-af .tlname small{display:block;font-size:11.5px;color:var(--mute);white-space:nowrap}
.mk-af .track{position:relative;height:100%;background-image:repeating-linear-gradient(90deg,var(--line2) 0 1px,transparent 1px calc(100%/15))}
.mk-af .bar{position:absolute;top:16px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;font-size:11px;font-weight:600;color:#fff;transition:width .5s cubic-bezier(.2,.8,.2,1),background .3s}
.mk-af .bar.clip{border-top-left-radius:0;border-bottom-left-radius:0}
.mk-af .bar.long{border-top-right-radius:0;border-bottom-right-radius:0}
.mk-af .bar.u1{background:linear-gradient(90deg,rgba(225,102,76,.25),#e1664c)}
.mk-af .bar.u2{background:linear-gradient(90deg,rgba(201,140,22,.22),#d29a2a)}
.mk-af .bar.u3{background:linear-gradient(90deg,rgba(47,72,88,.18),#4f6b7c)}
.mk-af .bar.ok{background:linear-gradient(90deg,rgba(15,159,110,.2),#0f9f6e)}
.mk-af .endmk{position:absolute;top:13px;width:2px;height:24px;border-radius:1px;background:var(--ink)}
.mk-af .today{position:absolute;top:0;bottom:0;width:0;border-left:1.5px dashed var(--co);z-index:2;pointer-events:none}
.mk-af .tlmonths span.todaylab{position:absolute;bottom:-9px;height:auto;display:block;border-left:0;color:#fff;transform:translateX(-50%);background:var(--co);color:#fff;font-size:10.5px;font-weight:650;border-radius:4px;padding:1px 5px;z-index:3;white-space:nowrap}
.mk-af .window{position:absolute;top:0;bottom:0;background:rgba(15,159,110,.045);border-right:1px solid rgba(15,159,110,.25);pointer-events:none}
.mk-af .exp{display:flex;flex-direction:column;min-height:0;overflow:hidden}
.mk-af .explist{padding:6px 8px;overflow:auto;flex:1}
.mk-af .erow{display:grid;grid-template-columns:26px 1fr auto;gap:10px;align-items:center;padding:7px 8px;border-radius:8px;width:100%}
.mk-af .erow:hover{background:#f7f5f0}
.mk-af .erow.sel{background:#f2faf6;box-shadow:inset 0 0 0 1px rgba(15,159,110,.25)}
.mk-af .erow .av{width:26px;height:26px;font-size:10px}
.mk-af .erow b{display:block;font-weight:550;font-size:13px}
.mk-af .erow small{display:block;font-size:11.5px;color:var(--mute)}
.mk-af .days{font-size:12px;font-weight:650;text-align:right}
.mk-af .days small{font-weight:500}
.mk-af .d1{color:#c2492f}.mk-af .d2{color:var(--am)}.mk-af .d3{color:var(--ink2)}.mk-af .d4{color:var(--em-d)}
.mk-af .selcard{border-top:1px solid var(--line);padding:14px 16px;background:#fcfbf8;flex:none}
.mk-af .stepper{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:10px 0 12px}
.mk-af .stepper div{height:4px;border-radius:2px;background:var(--line)}
.mk-af .stepper div.on{background:var(--em)}
.mk-af .steplab{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mute)}
.mk-af .selrow{display:flex;align-items:center;justify-content:space-between;gap:8px}

/* toast */
.mk-af .toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--ink);color:#fff;border-radius:10px;padding:10px 14px;font-size:13px;display:flex;align-items:center;gap:8px;box-shadow:0 10px 30px rgba(20,15,5,.25);z-index:20}
.mk-af .toast svg{color:#6ee0b2}

@media (prefers-reduced-motion: no-preference){
  .mk-af .grow{transform-box:fill-box;transform-origin:50% 100%;animation:mk-af-grow .6s cubic-bezier(.2,.8,.2,1) both}
  .mk-af .growx{transform-origin:0 50%;animation:mk-af-growx .7s cubic-bezier(.2,.8,.2,1) both}
  .mk-af .fade{animation:mk-af-fade .35s ease both}
  .mk-af .fadein{animation:mk-af-fadein .4s ease .35s both}
  .mk-af .drawer{animation:mk-af-slide .28s cubic-bezier(.2,.8,.2,1) both}
  .mk-af .toast{animation:mk-af-toast .3s cubic-bezier(.2,.8,.2,1) both}
  .mk-af .seg-arc{transition:stroke-dasharray .5s ease,stroke-dashoffset .5s ease,opacity .2s}
}
@keyframes mk-af-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes mk-af-growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes mk-af-fadein{from{opacity:0}to{opacity:1}}
@keyframes mk-af-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes mk-af-slide{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}
@keyframes mk-af-toast{from{transform:translate(-50%,10px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
`;

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Avatar({ name }: { name: string }) {
  return (
    <span className="av" style={{ background: avatarBg(name) }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

function Delta({ v, good }: { v: number; good: boolean }) {
  return (
    <span className={`chip ${good ? "up" : "dn"}`}>
      {v >= 0 ? "▲" : "▼"} {Math.abs(v).toFixed(1)}%
    </span>
  );
}

function Spark({ data, id, good }: { data: number[]; id: string; good: boolean }) {
  const w = 72;
  const h = 26;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => [
    4 + (i / (data.length - 1)) * (w - 8),
    h - 4 - ((v - min) / (max - min || 1)) * (h - 8),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
  const col = good ? "#0f9f6e" : "#e1664c";
  const last = pts[pts.length - 1];
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={col} stopOpacity=".18" />
          <stop offset="1" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line}L${w - 4},${h}L4,${h}Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={col} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill="#fff" stroke={col} strokeWidth="1.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

function RevenueChart({ data, period }: { data: PeriodData; period: Period }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 620;
  const H = 196;
  const padL = 46;
  const padR = 8;
  const padT = 14;
  const padB = 26;
  const n = data.values.length;
  const totals = data.values.map((v, i) => v + (data.forecast?.[i] ?? 0));
  const maxV = Math.max(...totals, ...(data.prior ?? [0]));
  const step = niceStep(maxV, 4);
  const top = Math.ceil(maxV / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const band = plotW / n;
  const bw = Math.min(band * 0.56, 46);
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const cx = (i: number) => padL + band * i + band / 2;
  const active = hover ?? n - 1;
  const priorPath = data.prior
    ?.map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join("");
  const tipV = data.values[active];
  const tipPrior = data.prior?.[active];
  const tipFc = data.forecast?.[active] ?? 0;
  return (
    <div className="chartwrap">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={data.chartTitle}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="mk-af-bar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#13ad79" />
            <stop offset="1" stopColor="#0b8a5f" />
          </linearGradient>
          <pattern
            id="mk-af-hatch"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="6" fill="#dff3ea" />
            <rect width="2" height="6" fill="#0f9f6e" opacity=".55" />
          </pattern>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? "#dcd7cb" : "#f0ede6"}
            />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#9a958a">
              {kLabel(t)}
            </text>
          </g>
        ))}
        <g key={period}>
          {data.values.map((v, i) => {
            const isActive = i === active;
            const fc = data.forecast?.[i] ?? 0;
            return (
              <g key={data.labels[i]}>
                <rect
                  className="grow"
                  style={{ animationDelay: `${i * 30}ms` }}
                  x={cx(i) - bw / 2}
                  y={y(v)}
                  width={bw}
                  height={Math.max(0, y(0) - y(v))}
                  rx="4"
                  fill={isActive ? "url(#mk-af-bar)" : "#cfeadd"}
                />
                {fc > 0 && (
                  <rect
                    className="grow"
                    style={{ animationDelay: `${i * 30 + 120}ms` }}
                    x={cx(i) - bw / 2}
                    y={y(v + fc)}
                    width={bw}
                    height={y(v) - y(v + fc) - 2}
                    rx="4"
                    fill="url(#mk-af-hatch)"
                    stroke="#0f9f6e"
                    strokeOpacity=".35"
                  />
                )}
                <text
                  x={cx(i)}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="11.5"
                  fill={isActive ? "#1d1c19" : "#9a958a"}
                  fontWeight={isActive ? 600 : 400}
                >
                  {data.labels[i]}
                </text>
              </g>
            );
          })}
          {priorPath && (
            <path
              d={priorPath}
              fill="none"
              stroke="#b8b2a3"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeLinejoin="round"
            />
          )}
          {data.prior?.map((v, i) => (
            <circle
              key={i}
              cx={cx(i)}
              cy={y(v)}
              r={i === active ? 3.5 : 0}
              fill="#fff"
              stroke="#8f897b"
              strokeWidth="1.5"
            />
          ))}
        </g>
        {data.values.map((_, i) => (
          <rect
            key={`h${i}`}
            x={padL + band * i}
            y={padT}
            width={band}
            height={plotH}
            fill={hover === i ? "rgba(15,159,110,0.05)" : "transparent"}
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {hover === null && (
          <text
            key={`v-${period}`}
            className="fadein"
            x={cx(active)}
            y={y(tipV + tipFc) - 8}
            textAnchor="middle"
            fontSize="12"
            fontWeight="650"
            fill="#0b7f58"
          >
            {gbpShort((tipV + tipFc) * 1000)}
            {tipFc > 0 ? " fcst" : ""}
          </text>
        )}
      </svg>
      {hover !== null && (
        <div
          className="tip"
          style={tipPos(8 + cx(active), bw, Math.max(4, y(tipV + tipFc)), active >= n / 2)}
        >
          <span>
            {period === "year"
              ? `${data.labels[active]}${tipFc ? " · YTD" : ""}`
              : data.labels[active]}
          </span>
          <b className="num">{gbp(tipV * 1000)}</b>
          {tipPrior !== undefined && (
            <span>
              <span className={tipV >= tipPrior ? "g" : ""}>
                {tipV >= tipPrior ? "+" : ""}
                {(((tipV - tipPrior) / tipPrior) * 100).toFixed(1)}%
              </span>{" "}
              vs prior year
            </span>
          )}
          {tipFc > 0 && <span>Forecast {gbpShort((tipV + tipFc) * 1000)} full year</span>}
        </div>
      )}
    </div>
  );
}

function Donut({
  values,
  hl,
  setHl,
}: {
  values: number[];
  hl: number | null;
  setHl: (i: number | null) => void;
}) {
  const total = values.reduce((a, b) => a + b, 0);
  const r = 54;
  const C = 2 * Math.PI * r;
  const gap = 3;
  let acc = 0;
  const shown = hl ?? 0;
  return (
    <svg
      width="136"
      height="136"
      viewBox="0 0 136 136"
      role="img"
      aria-label="Income split by source"
    >
      <circle cx="68" cy="68" r={r} fill="none" stroke="#f1eee7" strokeWidth="16" />
      {values.map((v, i) => {
        const len = (v / total) * C;
        const el = (
          <circle
            key={SOURCES[i]}
            className="seg-arc"
            cx="68"
            cy="68"
            r={r}
            fill="none"
            stroke={SOURCE_COLORS[i]}
            strokeWidth={hl === i ? 19 : 15}
            strokeDasharray={`${Math.max(0, len - gap)} ${C}`}
            strokeDashoffset={-acc}
            transform="rotate(-90 68 68)"
            opacity={hl === null || hl === i ? 1 : 0.35}
            onMouseEnter={() => setHl(i)}
            onMouseLeave={() => setHl(null)}
          />
        );
        acc += len;
        return el;
      })}
      <text x="68" y="62" textAnchor="middle" fontSize="11" fill="#77726a">
        {hl === null ? "Total income" : SOURCES[shown]}
      </text>
      <text
        x="68"
        y="82"
        textAnchor="middle"
        fontSize="18"
        fontWeight="650"
        fill="#1d1c19"
        letterSpacing="-0.3"
      >
        {hl === null ? gbpShort(total * 1000) : `${((values[shown] / total) * 100).toFixed(1)}%`}
      </text>
    </svg>
  );
}

function Overview({
  period,
  setPeriod,
  comms,
  contracts,
  openCommission,
  go,
  openContract,
}: {
  period: Period;
  setPeriod: (p: Period) => void;
  comms: Commission[];
  contracts: Contract[];
  openCommission: (id: string) => void;
  go: (v: View) => void;
  openContract: (id: string) => void;
}) {
  const data = PERIODS[period];
  const [hl, setHl] = useState<number | null>(null);
  const splitTotal = data.split.reduce((a, b) => a + b, 0);
  const receivables = comms
    .filter((c) => c.status !== "Paid")
    .sort((a, b) => b.due - a.due)
    .slice(0, 4);
  const renewals = contracts
    .filter((c) => c.stage !== "Signed")
    .sort((a, b) => daysLeft(a) - daysLeft(b))
    .slice(0, 4);
  return (
    <>
      <div className="phead">
        <div>
          <h1>Good morning, Amelia</h1>
          <p>
            Agency performance for{" "}
            <b style={{ color: "var(--ink)", fontWeight: 550 }}>{data.label}</b> · all entities, GBP
          </p>
        </div>
        <div className="seg" role="group" aria-label="Reporting period">
          {(["month", "quarter", "year"] as Period[]).map((p) => (
            <button key={p} type="button" aria-pressed={period === p} onClick={() => setPeriod(p)}>
              {p === "month" ? "Month" : p === "quarter" ? "Quarter" : "Year"}
            </button>
          ))}
        </div>
      </div>

      <div className="kpis">
        {data.kpis.map((k, i) => {
          const good = k.delta >= 0 === k.goodWhenUp;
          return (
            <div className="card kpi" key={k.label}>
              <div className="lab">{k.label}</div>
              <div className="val num fade" key={`${period}-${i}`}>
                {gbp(k.value)}
              </div>
              <div className="delta">
                <Delta v={k.delta} good={good} />
                {k.vs}
              </div>
              <Spark data={k.spark} id={`mk-af-sp-${i}`} good={good} />
            </div>
          );
        })}
      </div>

      <div className="ovgrid">
        <div className="card">
          <div className="chead">
            <div>
              <h2>{data.chartTitle}</h2>
              <p>{data.chartNote}</p>
            </div>
            <div className="legend">
              <span>
                <i style={{ background: "#0f9f6e" }} />
                Revenue
              </span>
              {data.prior ? (
                <span>
                  <i className="ln" />
                  Prior year
                </span>
              ) : (
                <span>
                  <i className="ht" />
                  Forecast
                </span>
              )}
            </div>
          </div>
          <RevenueChart data={data} period={period} />
        </div>
        <div className="card">
          <div className="chead">
            <div>
              <h2>Income by source</h2>
              <p>{data.label}</p>
            </div>
          </div>
          <div className="donutwrap">
            <div className="donutrow">
              <Donut values={data.split} hl={hl} setHl={setHl} />
              <div className="srcs">
                {data.split.map((v, i) => (
                  <div
                    key={SOURCES[i]}
                    className={`src${hl === i ? " on" : ""}`}
                    onMouseEnter={() => setHl(i)}
                    onMouseLeave={() => setHl(null)}
                  >
                    <i style={{ background: SOURCE_COLORS[i] }} />
                    <span>{SOURCES[i]}</span>
                    <em className="num">{((v / splitTotal) * 100).toFixed(0)}%</em>
                  </div>
                ))}
              </div>
            </div>
            <div className="srcfoot">
              <span>
                Player contracts <b className="num">{gbpShort(data.split[0] * 1000)}</b>
              </span>
              <span>
                Transfers <b className="num">{gbpShort(data.split[2] * 1000)}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="tri">
        <div className="card">
          <div className="chead">
            <h2>Largest receivables</h2>
            <button type="button" className="linkbtn" onClick={() => go("commissions")}>
              All commissions
              <Icon d={I.chevron} size={13} />
            </button>
          </div>
          <div className="mini">
            {receivables.map((c) => (
              <button
                type="button"
                className="mrow"
                key={c.id}
                onClick={() => openCommission(c.id)}
              >
                <Avatar name={c.player} />
                <span className="t">
                  <b>{c.player}</b>
                  <small>{c.club}</small>
                </span>
                <span className="amt num">
                  {gbp(c.due)}
                  <small>
                    <span
                      className={`spill ${c.status}`}
                      style={{ padding: "0 7px 0 6px", fontSize: 11 }}
                    >
                      {c.status}
                    </span>
                  </small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="chead">
            <h2>Next 14 days</h2>
            <button type="button" className="linkbtn" onClick={() => go("cash")}>
              Cash flow
              <Icon d={I.chevron} size={13} />
            </button>
          </div>
          <div className="mini">
            {PAYMENTS.slice(0, 4).map((p) => (
              <button
                type="button"
                className="mrow"
                key={p.date + p.who}
                onClick={() => go("cash")}
              >
                <span className={`dirico ${p.amount > 0 ? "in" : "out"}`}>
                  <Icon d={p.amount > 0 ? I.arrowIn : I.arrowOut} size={14} />
                </span>
                <span className="t">
                  <b>{p.who}</b>
                  <small>{p.what}</small>
                </span>
                <span className={`amt num ${p.amount > 0 ? "pos" : "neg"}`}>
                  {p.amount > 0 ? "+" : ""}
                  {gbp(p.amount)}
                  <small>{p.date}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="chead">
            <h2>Renewals coming up</h2>
            <button type="button" className="linkbtn" onClick={() => go("contracts")}>
              Contracts
              <Icon d={I.chevron} size={13} />
            </button>
          </div>
          <div className="mini">
            {renewals.map((c) => {
              const d = daysLeft(c);
              return (
                <button
                  type="button"
                  className="mrow"
                  key={c.id}
                  onClick={() => openContract(c.id)}
                >
                  <Avatar name={c.player} />
                  <span className="t">
                    <b>{c.player}</b>
                    <small>
                      {c.club} · {c.stage}
                    </small>
                  </span>
                  <span className={`amt num ${d <= 120 ? "d1" : d <= 240 ? "d2" : "d3"}`}>
                    {d} days
                    <small>{endLabel(c)}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Commissions                                                         */
/* ------------------------------------------------------------------ */

const STATUS_ORDER: Record<Status, number> = { Overdue: 0, Due: 1, Invoiced: 2, Paid: 3 };
function dateKey(d: string) {
  const [day, mon, yr] = d.split(" ");
  return Number(yr) * 400 + MONTH_NAMES.indexOf(mon) * 32 + Number(day);
}

const FILTERS: ("All" | Status)[] = ["All", "Overdue", "Due", "Invoiced", "Paid"];

function Commissions({
  comms,
  selected,
  setSelected,
  updateStatus,
  reminded,
  remind,
  toast,
}: {
  comms: Commission[];
  selected: string | null;
  setSelected: (id: string | null) => void;
  updateStatus: (id: string, s: Status) => void;
  reminded: Record<string, boolean>;
  remind: (id: string) => void;
  toast: (m: string) => void;
}) {
  const [filter, setFilter] = useState<"All" | Status>("All");
  const rows = (filter === "All" ? comms : comms.filter((c) => c.status === filter))
    .slice()
    .sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || dateKey(a.dueDate) - dateKey(b.dueDate),
    );
  const sum = (s: Status[]) =>
    comms.filter((c) => s.includes(c.status)).reduce((a, c) => a + c.due, 0);
  const count = (s: Status) => comms.filter((c) => c.status === s).length;
  const outstanding = sum(["Due", "Invoiced", "Overdue"]);
  const sel = comms.find((c) => c.id === selected) ?? null;
  const parts: [Status, string][] = [
    ["Overdue", "#e1664c"],
    ["Due", "#d29a2a"],
    ["Invoiced", "#3767c9"],
  ];

  return (
    <>
      <div className="phead">
        <div>
          <h1>Commissions</h1>
          <p>12 active agreements · 2026/27 season · instalments due Sep – Nov</p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn"
            onClick={() => toast("Commission ledger exported as CSV")}
          >
            <Icon d={I.download} size={15} />
            Export
          </button>
          <button
            type="button"
            className="btn pri"
            onClick={() => {
              setFilter("Due");
              toast("Showing instalments ready to invoice");
            }}
          >
            Raise invoices
          </button>
        </div>
      </div>

      <div className="card sumstrip">
        <div>
          <small>Outstanding</small>
          <b className="num">{gbp(outstanding)}</b>
          <div className="sbar">
            {parts.map(([s, col]) => (
              <i
                key={s}
                style={{
                  width: `${(sum([s]) / (outstanding || 1)) * 100}%`,
                  background: col,
                  display: "block",
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <small>Overdue</small>
          <b className="num" style={{ color: count("Overdue") ? "#c2492f" : undefined }}>
            {gbp(sum(["Overdue"]))}
          </b>
          <span>
            {count("Overdue")} {count("Overdue") === 1 ? "invoice" : "invoices"} · avg 20 days late
          </span>
        </div>
        <div>
          <small>Invoiced, awaiting payment</small>
          <b className="num">{gbp(sum(["Invoiced"]))}</b>
          <span>{count("Invoiced")} invoices · next 4 Nov</span>
        </div>
        <div>
          <small>Collected since 1 Sep</small>
          <b className="num" style={{ color: "var(--em-d)" }}>
            {gbp(sum(["Paid"]))}
          </b>
          <span>{count("Paid")} payments received</span>
        </div>
      </div>

      <div className="tabsrow">
        <div className="tabs" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="tab"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
              <span>{f === "All" ? comms.length : count(f)}</span>
            </button>
          ))}
        </div>
        <span className="sorthint">Overdue first, then by due date · click a row for detail</span>
      </div>

      <div className="card tablecard">
        <div className="tbl thead">
          <span>Player</span>
          <span>Club</span>
          <span>Contract end</span>
          <span className="r">Comm. %</span>
          <span className="r">Amount due</span>
          <span style={{ paddingLeft: 20 }}>Due date</span>
          <span>Status</span>
          <span />
        </div>
        <div className="tbody">
          {rows.length === 0 && <div className="empty">No commissions with this status.</div>}
          {rows.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`tbl trow${selected === c.id ? " sel" : ""}`}
              onClick={() => setSelected(c.id)}
              aria-pressed={selected === c.id}
            >
              <span className="pcell">
                <Avatar name={c.player} />
                <span>
                  <b>{c.player}</b>
                  <small>{c.pos}</small>
                </span>
              </span>
              <span>
                {c.club}
                <span className="sub">{c.league}</span>
              </span>
              <span className="num">{c.end}</span>
              <span className="r num">{c.pct}%</span>
              <span className="r num" style={{ fontWeight: 600 }}>
                {gbp(c.due)}
              </span>
              <span className="num" style={{ paddingLeft: 20 }}>
                {c.dueDate}
                {c.status === "Overdue" && c.late ? (
                  <span className="sub late">{c.late} days late</span>
                ) : null}
              </span>
              <span>
                <span className={`spill ${c.status}`}>{c.status}</span>
              </span>
              <span className="chev">
                <Icon d={I.chevron} size={15} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {sel && (
        <>
          <button
            type="button"
            className="scrim"
            aria-label="Close detail panel"
            onClick={() => setSelected(null)}
          />
          <aside className="drawer" key={sel.id} aria-label={`${sel.player} commission`}>
            <div className="dhead">
              <Avatar name={sel.player} />
              <div>
                <h3>{sel.player}</h3>
                <p>
                  {sel.pos} · {sel.club} · {sel.league}
                </p>
                <div style={{ marginTop: 8 }}>
                  <span className={`spill ${sel.status}`}>{sel.status}</span>
                </div>
              </div>
              <button
                type="button"
                className="dclose"
                aria-label="Close detail"
                onClick={() => setSelected(null)}
              >
                <Icon d={I.close} size={16} />
              </button>
            </div>
            <div className="dbody">
              {(() => {
                const total = (sel.gross * sel.pct) / 100;
                const collected = sel.collected + (sel.status === "Paid" ? sel.due : 0);
                return (
                  <>
                    <div>
                      <div className="bigamt">
                        <div>
                          <small>
                            {sel.status === "Paid" ? "Instalment received" : "Instalment due"}
                          </small>
                          <b className="num">{gbp(sel.due)}</b>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <small>Due date</small>
                          <b
                            style={{ fontSize: 14, fontWeight: 600 }}
                            className={sel.status === "Overdue" ? "late" : ""}
                          >
                            {sel.dueDate}
                          </b>
                        </div>
                      </div>
                      <div style={{ marginTop: 14 }}>
                        <div className="prog">
                          <i style={{ width: `${(collected / total) * 100}%` }} />
                        </div>
                        <div className="progl">
                          <span>
                            Collected <b style={{ color: "var(--ink)" }}>{gbp(collected)}</b>
                          </span>
                          <span>of {gbp(total)} total</span>
                        </div>
                      </div>
                    </div>
                    <div className="kv">
                      <div>
                        <small>Gross contract value</small>
                        <b className="num">{gbp(sel.gross)}</b>
                      </div>
                      <div>
                        <small>Commission rate</small>
                        <b className="num">{sel.pct}% of gross</b>
                      </div>
                      <div>
                        <small>Contract end</small>
                        <b>{sel.end}</b>
                      </div>
                      <div>
                        <small>Paid by</small>
                        <b>Club, in instalments</b>
                      </div>
                      <div>
                        <small>Invoice</small>
                        <b className="num">
                          INV-26-{String(140 + Number(sel.id.slice(1))).padStart(4, "0")}
                        </b>
                      </div>
                      <div>
                        <small>Remaining after this</small>
                        <b className="num">
                          {gbp(
                            Math.max(0, total - collected - (sel.status === "Paid" ? 0 : sel.due)),
                          )}
                        </b>
                      </div>
                    </div>
                    <div>
                      <div className="sect">Activity</div>
                      <div className="acts">
                        {sel.status === "Paid" && (
                          <div className="act">
                            <i className="on" />
                            <div>Payment received from {sel.club}</div>
                            <span>{sel.dueDate.replace(" 2026", "")}</span>
                          </div>
                        )}
                        {reminded[sel.id] && (
                          <div className="act">
                            <i />
                            <div>Reminder emailed to club finance</div>
                            <span>Today</span>
                          </div>
                        )}
                        {sel.status === "Overdue" && (
                          <div className="act">
                            <i className="bad" />
                            <div>Payment missed · {sel.late} days late</div>
                            <span>{sel.dueDate.replace(" 2026", "")}</span>
                          </div>
                        )}
                        {sel.status !== "Due" && (
                          <div className="act">
                            <i />
                            <div>Invoice sent to {sel.club}</div>
                            <span>{sel.status === "Invoiced" ? "Today" : "14 days prior"}</span>
                          </div>
                        )}
                        <div className="act">
                          <i />
                          <div>Instalment scheduled from contract</div>
                          <span>1 Jul</span>
                        </div>
                        <div className="act">
                          <i />
                          <div>Representation agreement registered</div>
                          <span>2025</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="dfoot">
              {sel.status === "Overdue" && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => remind(sel.id)}
                  disabled={reminded[sel.id]}
                >
                  <Icon d={I.send} size={14} />
                  {reminded[sel.id] ? "Reminder sent" : "Send reminder"}
                </button>
              )}
              {sel.status === "Due" && (
                <button
                  type="button"
                  className="btn pri"
                  onClick={() => updateStatus(sel.id, "Invoiced")}
                >
                  Raise invoice
                </button>
              )}
              {(sel.status === "Invoiced" || sel.status === "Overdue") && (
                <button
                  type="button"
                  className="btn em"
                  onClick={() => updateStatus(sel.id, "Paid")}
                >
                  <Icon d={I.check} size={15} />
                  Mark as paid
                </button>
              )}
              {sel.status === "Paid" && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => toast("Remittance advice downloaded")}
                >
                  <Icon d={I.download} size={15} />
                  Remittance
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Cash flow                                                           */
/* ------------------------------------------------------------------ */

function InOutChart() {
  const [hover, setHover] = useState<number | null>(null);
  const W = 630;
  const H = 196;
  const padL = 44;
  const padR = 8;
  const padT = 10;
  const padB = 24;
  const top = 800;
  const bottom = 450;
  const plotH = H - padT - padB;
  const y = (v: number) => padT + ((top - v) / (top + bottom)) * plotH;
  const band = (W - padL - padR) / 12;
  const bw = Math.min(band * 0.34, 16);
  const cx = (i: number) => padL + band * i + band / 2;
  const net = CASH_IN.map((v, i) => v - CASH_OUT[i]);
  const netPath = net
    .map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join("");
  const a = hover ?? 11;
  return (
    <div className="chartwrap" style={{ paddingTop: 6 }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Monthly cash in and out"
        onMouseLeave={() => setHover(null)}
      >
        {[800, 400, 0, -400].map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? "#cfc9bb" : "#f0ede6"}
            />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#9a958a">
              {t < 0 ? "−" : ""}
              {kLabel(Math.abs(t))}
            </text>
          </g>
        ))}
        {CASH_MONTHS.map((m, i) => (
          <g key={m + i} opacity={hover === null || hover === i ? 1 : 0.45}>
            <rect
              className="grow"
              style={{ animationDelay: `${i * 25}ms` }}
              x={cx(i) - bw - 1}
              y={y(CASH_IN[i])}
              width={bw}
              height={y(0) - y(CASH_IN[i])}
              rx="3"
              fill="#0f9f6e"
            />
            <rect
              x={cx(i) + 1}
              y={y(0)}
              width={bw}
              height={y(-CASH_OUT[i]) - y(0)}
              rx="3"
              fill="#ef9a87"
            />
            <text
              x={cx(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize="11.5"
              fill={a === i ? "#1d1c19" : "#9a958a"}
              fontWeight={a === i ? 600 : 400}
            >
              {m}
            </text>
          </g>
        ))}
        <path d={netPath} fill="none" stroke="#1d1c19" strokeWidth="1.6" strokeLinejoin="round" />
        {net.map((v, i) => (
          <circle
            key={i}
            cx={cx(i)}
            cy={y(v)}
            r={i === a ? 4 : 2.4}
            fill={i === a ? "#1d1c19" : "#fff"}
            stroke="#1d1c19"
            strokeWidth="1.5"
          />
        ))}
        {CASH_MONTHS.map((m, i) => (
          <rect
            key={`h${i}`}
            x={padL + band * i}
            y={padT}
            width={band}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>
      {hover !== null && (
        <div className="tip" style={tipPos(8 + cx(a), bw * 2, Math.max(4, y(CASH_IN[a])), a >= 6)}>
          <span>
            {CASH_MONTHS[a]} {a < 2 ? 2025 : 2026}
          </span>
          <b className="num">Net +{gbp(net[a] * 1000)}</b>
          <span>
            <span className="g">In {gbpShort(CASH_IN[a] * 1000)}</span> · Out{" "}
            {gbpShort(CASH_OUT[a] * 1000)}
          </span>
        </div>
      )}
    </div>
  );
}

function Waterfall() {
  const W = 630;
  const H = 184;
  const padL = 44;
  const padR = 8;
  const padT = 28;
  const padB = 24;
  const lo = 1500;
  const hi = 3700;
  const plotH = H - padT - padB;
  const y = (v: number) => padT + ((hi - v) / (hi - lo)) * plotH;
  const n = WATERFALL.length;
  const band = (W - padL - padR) / n;
  const bw = band * 0.62;
  let run = 0;
  const bars = WATERFALL.map((s) => {
    let from: number;
    let to: number;
    if (s.kind === "total") {
      if (s.label === "Opening") run = s.value;
      from = lo;
      to = run;
    } else {
      from = run;
      run += s.value;
      to = run;
    }
    return { ...s, from, to, end: run, shown: s.kind === "total" ? run : s.value };
  });
  return (
    <div className="chartwrap">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Q4 2026 cash waterfall"
      >
        {[1500, 2000, 2500, 3000, 3500].map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#f0ede6" />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#9a958a">
              {kLabel(t)}
            </text>
          </g>
        ))}
        {bars.map((b, i) => {
          const x = padL + band * i + (band - bw) / 2;
          const y1 = y(Math.max(b.from, b.to));
          const h = Math.max(2, Math.abs(y(b.from) - y(b.to)));
          const fill = b.kind === "total" ? "#2f4858" : b.kind === "in" ? "#0f9f6e" : "#ef9a87";
          return (
            <g key={b.label}>
              <rect
                className="grow"
                style={{ animationDelay: `${i * 40}ms` }}
                x={x}
                y={y1}
                width={bw}
                height={h}
                rx="3"
                fill={fill}
              />
              {i < n - 1 && (
                <line
                  x1={x + bw}
                  x2={x + band}
                  y1={y(b.end)}
                  y2={y(b.end)}
                  stroke="#b8b2a3"
                  strokeDasharray="2 2"
                />
              )}
              <text
                x={x + bw / 2}
                y={y1 - 5}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={b.kind === "out" ? "#c2523a" : b.kind === "in" ? "#0b7f58" : "#1d1c19"}
              >
                {b.kind === "in" ? "+" : ""}
                {b.kind === "out" ? "−" : ""}
                {kLabel(Math.abs(b.shown))}
              </text>
              <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#77726a">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CashFlow() {
  const [dir, setDir] = useState<"all" | "in" | "out">("all");
  const list = PAYMENTS.filter((p) =>
    dir === "all" ? true : dir === "in" ? p.amount > 0 : p.amount < 0,
  );
  const inSum = PAYMENTS.filter((p) => p.amount > 0).reduce((a, p) => a + p.amount, 0);
  const outSum = PAYMENTS.filter((p) => p.amount < 0).reduce((a, p) => a + p.amount, 0);
  const groups: { label: string; items: Payment[] }[] = [];
  list.forEach((p) => {
    const g = p.date.endsWith("Oct")
      ? "This week"
      : Number(p.date.split(" ")[0]) <= 14
        ? "Next 2 weeks"
        : "Later in November";
    const last = groups[groups.length - 1];
    if (last && last.label === g) last.items.push(p);
    else groups.push({ label: g, items: [p] });
  });
  return (
    <>
      <div className="phead">
        <div>
          <h1>Cash flow</h1>
          <p>Consolidated across 3 accounts · bank feed synced 09:12 today</p>
        </div>
        <div className="actions">
          <span className="datechip">
            <Icon d={I.calendar} size={14} />
            Nov 2025 – Oct 2026
          </span>
        </div>
      </div>
      <div className="stats4">
        <div className="card stat">
          <small>Cash in bank</small>
          <b className="num">£2,146,900</b>
          <span>
            <span className="chip up">▲ 3.2%</span> since 30 Sep
          </span>
        </div>
        <div className="card stat">
          <small>Money in · Oct</small>
          <b className="num pos">+£442,000</b>
          <span>11% above 12-month average</span>
        </div>
        <div className="card stat">
          <small>Money out · Oct</small>
          <b className="num">−£317,000</b>
          <span>Payroll 74% of outgoings</span>
        </div>
        <div className="card stat">
          <small>Runway at current burn</small>
          <b className="num">6.8 months</b>
          <span>Without any new income</span>
        </div>
      </div>
      <div className="cashgrid">
        <div className="cashleft">
          <div className="card" style={{ flex: "none" }}>
            <div className="chead">
              <div>
                <h2>Money in and out</h2>
                <p>Monthly totals with net movement</p>
              </div>
              <div className="legend">
                <span>
                  <i style={{ background: "#0f9f6e" }} />
                  In
                </span>
                <span>
                  <i style={{ background: "#ef9a87" }} />
                  Out
                </span>
                <span>
                  <i style={{ background: "#1d1c19", height: 2, width: 12, verticalAlign: 3 }} />
                  Net
                </span>
              </div>
            </div>
            <InOutChart />
          </div>
          <div className="card" style={{ flex: 1, minHeight: 0 }}>
            <div className="chead">
              <div>
                <h2>Q4 2026 cash bridge</h2>
                <p>Projected movement from 1 Oct to 31 Dec</p>
              </div>
              <span className="spill Paid">Closing {kLabel(2747)} projected</span>
            </div>
            <Waterfall />
          </div>
        </div>
        <div className="card paylist">
          <div className="chead">
            <div>
              <h2>Upcoming payments</h2>
              <p>
                <span className="pos">+{gbpShort(inSum)}</span> in · {gbpShort(outSum)} out · next
                30 days
              </p>
            </div>
          </div>
          <div className="tabs" role="group" aria-label="Payment direction">
            {(["all", "in", "out"] as const).map((d) => (
              <button
                key={d}
                type="button"
                className="tab"
                aria-pressed={dir === d}
                onClick={() => setDir(d)}
              >
                {d === "all" ? "All" : d === "in" ? "Incoming" : "Outgoing"}
                <span>
                  {d === "all"
                    ? PAYMENTS.length
                    : PAYMENTS.filter((p) => (d === "in" ? p.amount > 0 : p.amount < 0)).length}
                </span>
              </button>
            ))}
          </div>
          <div className="payscroll">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="daygrp">{g.label}</div>
                {g.items.map((p) => (
                  <div className="mrow fade" key={p.date + p.who + p.what}>
                    <span className={`dirico ${p.amount > 0 ? "in" : "out"}`}>
                      <Icon d={p.amount > 0 ? I.arrowIn : I.arrowOut} size={14} />
                    </span>
                    <span className="t">
                      <b>{p.who}</b>
                      <small>{p.what}</small>
                    </span>
                    <span className={`amt num ${p.amount > 0 ? "pos" : "neg"}`}>
                      {p.amount > 0 ? "+" : ""}
                      {gbp(p.amount)}
                      <small>
                        {p.date} · {p.tag}
                      </small>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contracts                                                           */
/* ------------------------------------------------------------------ */

function urgency(c: Contract) {
  if (c.stage === "Signed") return "ok";
  const d = daysLeft(c);
  return d <= 120 ? "u1" : d <= 240 ? "u2" : "u3";
}

function Contracts({
  contracts,
  selected,
  setSelected,
  advance,
}: {
  contracts: Contract[];
  selected: string;
  setSelected: (id: string) => void;
  advance: (id: string) => void;
}) {
  const [range, setRange] = useState<6 | 12 | 0>(12);
  const visible = contracts
    .filter((c) => range === 0 || c.stage === "Signed" || daysLeft(c) <= range * 30.5)
    .sort((a, b) => endPos(a) - endPos(b));
  const expiring = contracts
    .filter((c) => c.stage !== "Signed")
    .sort((a, b) => daysLeft(a) - daysLeft(b));
  const sel = contracts.find((c) => c.id === selected) ?? contracts[0];
  const pct = (p: number) => `${(p / 15) * 100}%`;
  const inTalks = contracts.filter(
    (c) => c.stage === "In talks" || c.stage === "Heads of terms",
  ).length;
  const stake = expiring.reduce((a, c) => a + c.stake, 0);
  const sixMonths = expiring.filter((c) => daysLeft(c) <= 183).length;
  const stageIdx = STAGES.indexOf(sel.stage);

  return (
    <>
      <div className="phead">
        <div>
          <h1>Contracts</h1>
          <p>
            {expiring.length} renewals open · {sixMonths} expiring within 6 months · {inTalks} in
            negotiation · <b style={{ color: "var(--ink)", fontWeight: 600 }}>{gbpShort(stake)}</b>{" "}
            commission at stake
          </p>
        </div>
        <div className="seg" role="group" aria-label="Expiry window">
          {([6, 12, 0] as const).map((r) => (
            <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>
              {r === 0 ? "All" : `${r} months`}
            </button>
          ))}
        </div>
      </div>
      <div className="ctgrid">
        <div className="card tlcard">
          <div className="chead">
            <div>
              <h2>Renewals timeline</h2>
              <p>Contract end dates, Oct 2026 – Dec 2027</p>
            </div>
            <div className="legend">
              <span>
                <i style={{ background: "#e1664c" }} />
                Under 4 months
              </span>
              <span>
                <i style={{ background: "#d29a2a" }} />
                Under 8 months
              </span>
              <span>
                <i style={{ background: "#0f9f6e" }} />
                Renewed
              </span>
            </div>
          </div>
          <div className="tlhead">
            <span
              style={{
                paddingLeft: 16,
                fontSize: 11.5,
                color: "var(--mute)",
                fontWeight: 600,
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              Player
            </span>
            <div className="tlmonths">
              {TIMELINE_MONTHS.map((m, i) => (
                <span key={i} className={i === 3 ? "yr" : ""}>
                  {m}
                </span>
              ))}
              <span className="todaylab" style={{ left: `${(TODAY_POS / 15) * 100}%` }}>
                Today
              </span>
            </div>
          </div>
          <div className="tlbody">
            {visible.map((c) => {
              const e = endPos(c);
              const s = Math.max(0, c.startPos);
              const clipped = c.startPos < 0;
              const long = e > 15;
              const w = Math.min(15, e) - s;
              return (
                <button
                  type="button"
                  key={c.id}
                  className={`tlrow${c.id === sel.id ? " sel" : ""}`}
                  onClick={() => setSelected(c.id)}
                  aria-pressed={c.id === sel.id}
                >
                  <span className="tlname">
                    <Avatar name={c.player} />
                    <span>
                      <b>{c.player}</b>
                      <small>
                        {c.pos} · {c.club}
                      </small>
                    </span>
                  </span>
                  <span className="track">
                    <span
                      className={`bar growx ${urgency(c)}${clipped ? " clip" : ""}${long ? " long" : ""}`}
                      style={{ left: pct(s), width: pct(w) }}
                    >
                      {long ? "2028 →" : endLabel(c).replace(/^\d+ /, "")}
                    </span>
                    {!long && <span className="endmk" style={{ left: `calc(${pct(e)} - 1px)` }} />}
                  </span>
                </button>
              );
            })}
            <div
              className="today"
              style={{ left: `calc(190px + (100% - 190px) * ${TODAY_POS / 15})` }}
            />
          </div>
        </div>
        <div className="card exp">
          <div className="chead">
            <div>
              <h2>Expiring soon</h2>
              <p>Sorted by days remaining</p>
            </div>
          </div>
          <div className="explist">
            {expiring.map((c) => {
              const d = daysLeft(c);
              return (
                <button
                  type="button"
                  key={c.id}
                  className={`erow${c.id === sel.id ? " sel" : ""}`}
                  onClick={() => setSelected(c.id)}
                >
                  <Avatar name={c.player} />
                  <span>
                    <b>{c.player}</b>
                    <small>
                      {c.club} · {c.stage}
                    </small>
                  </span>
                  <span className={`days ${d <= 120 ? "d1" : d <= 240 ? "d2" : "d3"}`}>
                    {d}d
                    <small style={{ display: "block", color: "var(--mute)" }}>
                      {gbpShort(c.stake)}
                    </small>
                  </span>
                </button>
              );
            })}
            {expiring.length === 0 && <div className="empty">Every renewal is signed.</div>}
          </div>
          <div className="selcard">
            <div className="selrow">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name={sel.player} />
                <div>
                  <b style={{ display: "block", fontWeight: 600 }}>{sel.player}</b>
                  <small style={{ fontSize: 11.5, color: "var(--mute)" }}>
                    {sel.wage} · to {endLabel(sel).replace(/^\d+ /, "")}
                  </small>
                </div>
              </div>
              <span
                className={`spill ${sel.stage === "Signed" ? "Signed" : sel.stage === "Not started" ? "neutral" : sel.stage === "In talks" ? "talks" : "hot"}`}
              >
                {sel.stage}
              </span>
            </div>
            <div className="stepper" aria-hidden="true">
              {STAGES.map((s, i) => (
                <div key={s} className={i <= stageIdx ? "on" : ""} />
              ))}
            </div>
            <div className="selrow">
              <span className="steplab" style={{ gap: 6 }}>
                Step {stageIdx + 1} of 4
                {sel.stake > 0 && sel.stage !== "Signed" ? ` · ${gbp(sel.stake)} at stake` : ""}
              </span>
              <button
                type="button"
                className={`btn ${sel.stage === "Signed" ? "" : "em"}`}
                onClick={() => advance(sel.id)}
                disabled={sel.stage === "Signed"}
              >
                {sel.stage === "Signed" ? (
                  <>
                    <Icon d={I.check} size={14} />
                    Renewed
                  </>
                ) : sel.stage === "Not started" ? (
                  "Start renewal"
                ) : sel.stage === "In talks" ? (
                  "Agree heads of terms"
                ) : (
                  "Mark as signed"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

const NAV: { id: View; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: I.overview },
  { id: "commissions", label: "Commissions", icon: I.commissions },
  { id: "cash", label: "Cash flow", icon: I.cash },
  { id: "contracts", label: "Contracts", icon: I.contracts },
];

export default function AgencyFinanceMockup() {
  const [view, setView] = useState<View>("overview");
  const [period, setPeriod] = useState<Period>("month");
  const [comms, setComms] = useState<Commission[]>(COMMISSIONS);
  const [selComm, setSelComm] = useState<string | null>(null);
  const [reminded, setReminded] = useState<Record<string, boolean>>({});
  const [contracts, setContracts] = useState<Contract[]>(CONTRACTS);
  const [selContract, setSelContract] = useState<string>("k2");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2400);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const overdue = useMemo(() => comms.filter((c) => c.status === "Overdue").length, [comms]);
  const openRenewals = contracts.filter((c) => c.stage !== "Signed").length;

  const go = (v: View) => {
    setView(v);
    if (v !== "commissions") setSelComm(null);
  };
  const updateStatus = (id: string, s: Status) => {
    setComms((cs) => cs.map((c) => (c.id === id ? { ...c, status: s } : c)));
    const c = comms.find((x) => x.id === id);
    if (c)
      setToastMsg(
        s === "Paid"
          ? `${gbp(c.due)} from ${c.club} marked as paid`
          : `Invoice raised to ${c.club}`,
      );
  };
  const advance = (id: string) => {
    setContracts((cs) =>
      cs.map((c) => {
        if (c.id !== id) return c;
        const next = STAGES[Math.min(3, STAGES.indexOf(c.stage) + 1)];
        if (next === "Signed") return { ...c, stage: next, endY: c.endY + 2 };
        return { ...c, stage: next };
      }),
    );
    const c = contracts.find((x) => x.id === id);
    if (c && c.stage === "Heads of terms")
      setToastMsg(`${c.player} renewed to ${endLabel({ endY: c.endY + 2, endM: c.endM })}`);
  };

  const crumb = NAV.find((n) => n.id === view)?.label;

  return (
    <div className="mk-af">
      <style>{CSS}</style>
      <aside className="side">
        <div className="brand">
          <span className="logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 17.5 10 12l3.5 3.5L19 8"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 8H19v4.5"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            <b>Agency Finance</b>
            <small>Leadership workspace</small>
          </span>
        </div>
        <nav className="navlist" aria-label="Main">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              className="navbtn"
              aria-current={view === n.id ? "page" : undefined}
              onClick={() => go(n.id)}
            >
              <Icon d={n.icon} />
              {n.label}
              {n.id === "commissions" && overdue > 0 && <span className="badge">{overdue}</span>}
              {n.id === "contracts" && <span className="cnt">{openRenewals}</span>}
            </button>
          ))}
        </nav>
        <div className="navlabel">Saved views</div>
        <div className="navlist">
          <button
            type="button"
            className="navbtn saved"
            onClick={() => {
              setPeriod("quarter");
              go("overview");
            }}
          >
            <Icon d={I.bookmark} size={15} />
            Board pack · Q3
          </button>
          <button
            type="button"
            className="navbtn saved"
            onClick={() => {
              setPeriod("year");
              go("overview");
            }}
          >
            <Icon d={I.bookmark} size={15} />
            Year on year
          </button>
          <button type="button" className="navbtn saved" onClick={() => go("cash")}>
            <Icon d={I.bookmark} size={15} />
            VAT &amp; payroll
          </button>
        </div>
        <div className="sidefoot">
          <div className="syncbox">
            <b>
              <span className="livedot" />
              Live bank feed
            </b>
            3 accounts · synced 09:12
          </div>
          <div className="me">
            <span className="av" style={{ background: "linear-gradient(135deg,#2f4858,#55788c)" }}>
              AL
            </span>
            <span>
              <b>Amelia Lowe</b>
              <small>Finance director</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="top">
          <span className="crumb">
            Leadership
            <Icon d={I.chevron} size={13} />
            <b>{crumb}</b>
          </span>
          <button
            type="button"
            className="searchbtn"
            onClick={() => setToastMsg("Search players, clubs and invoices")}
          >
            <Icon d={I.search} size={15} />
            Search players, invoices…
            <kbd>⌘K</kbd>
          </button>
          <span className="datechip">
            <Icon d={I.calendar} size={14} />
            Wed 28 Oct 2026
          </span>
          <button
            type="button"
            className="iconbtn"
            aria-label="Notifications"
            onClick={() => go("commissions")}
          >
            <Icon d={I.bell} size={16} />
            {overdue > 0 && <span className="pip" />}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setToastMsg("Board pack PDF ready to download")}
          >
            <Icon d={I.download} size={15} />
            Export
          </button>
        </header>
        <div className="body" key={view}>
          {view === "overview" && (
            <Overview
              period={period}
              setPeriod={setPeriod}
              comms={comms}
              contracts={contracts}
              go={go}
              openCommission={(id) => {
                setSelComm(id);
                setView("commissions");
              }}
              openContract={(id) => {
                setSelContract(id);
                setView("contracts");
              }}
            />
          )}
          {view === "commissions" && (
            <Commissions
              comms={comms}
              selected={selComm}
              setSelected={setSelComm}
              updateStatus={updateStatus}
              reminded={reminded}
              remind={(id) => {
                setReminded((r) => ({ ...r, [id]: true }));
                setToastMsg("Reminder sent to club finance team");
              }}
              toast={setToastMsg}
            />
          )}
          {view === "cash" && <CashFlow />}
          {view === "contracts" && (
            <Contracts
              contracts={contracts}
              selected={selContract}
              setSelected={setSelContract}
              advance={advance}
            />
          )}
        </div>
        {toastMsg && (
          <div className="toast" role="status">
            <Icon d={I.check} size={15} />
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
