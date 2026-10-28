import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type View =
  | "dashboard"
  | "roster"
  | "reports"
  | "interactions"
  | "duty"
  | "calendar"
  | "media"
  | "bulletin"
  | "users";
type Role = "Mentor" | "Manager" | "Admin";
type Welfare = "green" | "amber" | "red";
type Check = "ok" | "due" | "over" | "na";
type Group = "champ" | "l1" | "youth" | "loan";

interface Keeper {
  id: string;
  name: string;
  initials: string;
  age: number;
  club: string;
  level: string;
  group: Group;
  parent?: string;
  mentor: string;
  lastReport: string;
  trend: number;
  pillars: number[];
  hue: number;
  apps: number;
  cleanSheets: number;
  next: string;
  lastCheck: string;
  note?: string;
  checks: Check[];
}

interface Note {
  min: number;
  pillar: number;
  tone: "pos" | "neg" | "neu";
  text: string;
}

interface Report {
  id: string;
  keeperId: string;
  home: string;
  away: string;
  hs: number;
  as: number;
  side: "H" | "A";
  comp: string;
  date: string;
  short: string;
  saves: number;
  conceded: number;
  pass: number;
  claims: number;
  avg: number[];
  status: "Awaiting sign-off" | "Signed off";
  mentor: string;
  submitted: string;
  notes: Note[];
  focus: string[];
}

/* ------------------------------------------------------------------ */
/* Data (fictional)                                                    */
/* ------------------------------------------------------------------ */

const PILLARS = [
  "Shot stopping",
  "Distribution",
  "Command of area",
  "Communication",
  "Decision making",
  "Mentality",
  "Physical",
];

const CHECK_COLS = ["Wellbeing", "Safeguarding", "Family", "Education", "Medical", "Housing"];

const KEEPERS: Keeper[] = [
  {
    id: "tom",
    name: "Tom Okafor",
    initials: "TO",
    age: 21,
    club: "Northbridge FC",
    level: "Championship",
    group: "champ",
    mentor: "Dan Whitfield",
    lastReport: "24 Oct",
    trend: 0.4,
    pillars: [8.4, 7.9, 8.2, 8.0, 7.8, 8.5, 7.9],
    hue: 168,
    apps: 14,
    cleanSheets: 5,
    next: "Sat 31 Oct · Stanmoor City (A) · 15:00",
    lastCheck: "26 Oct",
    checks: ["ok", "ok", "na", "na", "ok", "ok"],
  },
  {
    id: "luca",
    name: "Luca Brennan",
    initials: "LB",
    age: 19,
    club: "Harbour Athletic",
    level: "U21",
    group: "youth",
    mentor: "Priya Nair",
    lastReport: "25 Oct",
    trend: -0.2,
    pillars: [7.8, 6.9, 7.1, 7.0, 7.4, 7.2, 8.1],
    hue: 215,
    apps: 11,
    cleanSheets: 2,
    next: "Today · Redcliffe Albion U21 (H) · 19:00",
    lastCheck: "15 Oct",
    note: "Reported poor sleep after U21 defeat",
    checks: ["due", "ok", "ok", "na", "ok", "ok"],
  },
  {
    id: "sami",
    name: "Sami Haddad",
    initials: "SH",
    age: 23,
    club: "Ashvale United",
    level: "League One",
    group: "l1",
    mentor: "Dan Whitfield",
    lastReport: "24 Oct",
    trend: 0.1,
    pillars: [8.0, 8.3, 7.4, 7.6, 7.9, 7.8, 7.6],
    hue: 28,
    apps: 15,
    cleanSheets: 4,
    next: "Sat 31 Oct · Thornbury Rovers (H) · 15:00",
    lastCheck: "23 Oct",
    checks: ["ok", "ok", "na", "na", "ok", "ok"],
  },
  {
    id: "josh",
    name: "Josh Adeyemi",
    initials: "JA",
    age: 18,
    club: "Ashvale United",
    level: "U21",
    group: "youth",
    mentor: "Marcus Bell",
    lastReport: "18 Oct",
    trend: -0.6,
    pillars: [7.4, 6.6, 6.8, 6.2, 6.9, 6.1, 7.9],
    hue: 280,
    apps: 9,
    cleanSheets: 1,
    next: "Tue 3 Nov · Easterby United U21 (A) · 19:00",
    lastCheck: "12 Oct",
    note: "Missed two training sessions, family contact requested",
    checks: ["over", "ok", "over", "due", "ok", "na"],
  },
  {
    id: "ryan",
    name: "Ryan Calloway",
    initials: "RC",
    age: 20,
    club: "Fenwick Rovers",
    level: "League Two",
    group: "loan",
    parent: "Northbridge FC",
    mentor: "Priya Nair",
    lastReport: "25 Oct",
    trend: 0.5,
    pillars: [7.5, 7.0, 6.9, 7.3, 7.1, 7.6, 7.0],
    hue: 340,
    apps: 12,
    cleanSheets: 3,
    next: "Sun 1 Nov · Larkhill Town (H) · 13:00",
    lastCheck: "22 Oct",
    checks: ["ok", "ok", "na", "na", "ok", "ok"],
  },
  {
    id: "oskar",
    name: "Oskar Lindqvist",
    initials: "OL",
    age: 24,
    club: "Northbridge FC",
    level: "Championship",
    group: "champ",
    mentor: "Dan Whitfield",
    lastReport: "21 Oct",
    trend: 0,
    pillars: [7.9, 7.8, 7.2, 7.5, 7.6, 7.7, 7.5],
    hue: 196,
    apps: 4,
    cleanSheets: 1,
    next: "Tue 3 Nov · U23 run-out (H) · 14:00",
    lastCheck: "20 Oct",
    checks: ["ok", "ok", "na", "na", "ok", "ok"],
  },
  {
    id: "kieran",
    name: "Kieran Doyle",
    initials: "KD",
    age: 22,
    club: "Westmere City",
    level: "League One",
    group: "l1",
    mentor: "Marcus Bell",
    lastReport: "24 Oct",
    trend: -0.3,
    pillars: [6.9, 6.1, 6.5, 6.0, 6.4, 6.2, 6.7],
    hue: 48,
    apps: 15,
    cleanSheets: 2,
    next: "Sat 31 Oct · Penhallow Town (A) · 15:00",
    lastCheck: "14 Oct",
    note: "Contract talks, stress flagged by club staff",
    checks: ["due", "ok", "na", "na", "ok", "ok"],
  },
  {
    id: "ethan",
    name: "Ethan Marsh",
    initials: "EM",
    age: 17,
    club: "Harbour Athletic",
    level: "U18",
    group: "youth",
    mentor: "Priya Nair",
    lastReport: "27 Oct",
    trend: 0.2,
    pillars: [7.2, 6.8, 6.7, 7.1, 6.9, 7.4, 6.9],
    hue: 140,
    apps: 10,
    cleanSheets: 3,
    next: "Tue 3 Nov · Millbrook Athletic U18 (H) · 19:00",
    lastCheck: "26 Oct",
    checks: ["ok", "ok", "ok", "ok", "ok", "na"],
  },
  {
    id: "mateo",
    name: "Mateo Ruiz",
    initials: "MR",
    age: 20,
    club: "Brackwater FC",
    level: "National League",
    group: "loan",
    parent: "Kingsmoor Town",
    mentor: "Marcus Bell",
    lastReport: "24 Oct",
    trend: 0.3,
    pillars: [7.6, 7.4, 6.9, 7.0, 7.2, 7.6, 7.4],
    hue: 6,
    apps: 13,
    cleanSheets: 4,
    next: "Fri 30 Oct · Holloway Park (H) · 19:45",
    lastCheck: "21 Oct",
    checks: ["ok", "ok", "na", "na", "ok", "ok"],
  },
  {
    id: "callum",
    name: "Callum Price",
    initials: "CP",
    age: 25,
    club: "Kingsmoor Town",
    level: "League One",
    group: "l1",
    mentor: "Dan Whitfield",
    lastReport: "24 Oct",
    trend: 0.2,
    pillars: [8.7, 8.1, 8.6, 8.5, 8.2, 8.4, 8.3],
    hue: 250,
    apps: 15,
    cleanSheets: 7,
    next: "Sat 31 Oct · Penhallow Town (H) · 15:00",
    lastCheck: "27 Oct",
    checks: ["ok", "ok", "na", "na", "ok", "ok"],
  },
];

const REPORTS: Report[] = [
  {
    id: "r1",
    keeperId: "tom",
    home: "Northbridge FC",
    away: "Redcliffe Albion",
    hs: 2,
    as: 1,
    side: "H",
    comp: "Championship",
    date: "Sat 24 Oct 2026",
    short: "24 Oct",
    saves: 6,
    conceded: 1,
    pass: 81,
    claims: 4,
    avg: [7.9, 7.6, 7.8, 7.7, 7.6, 8.0, 7.8],
    status: "Awaiting sign-off",
    mentor: "Dan Whitfield",
    submitted: "Sun 25 Oct, 10:12",
    notes: [
      {
        min: 12,
        pillar: 0,
        tone: "pos",
        text: "Strong low save to his left from a deflected strike. Set early and didn't drop his weight.",
      },
      {
        min: 38,
        pillar: 2,
        tone: "pos",
        text: "Claimed two consecutive corners under pressure. Called it loud and early both times.",
      },
      {
        min: 64,
        pillar: 4,
        tone: "neg",
        text: "Came for a through ball he couldn't win. Starting position was 2–3 yards too deep.",
      },
      {
        min: 81,
        pillar: 1,
        tone: "pos",
        text: "Quick throw to the left-back broke the press and led directly to the winner.",
      },
    ],
    focus: ["Starting position vs balls in behind", "Driven passes into the half-spaces"],
  },
  {
    id: "r2",
    keeperId: "callum",
    home: "Kingsmoor Town",
    away: "Stanmoor City",
    hs: 0,
    as: 0,
    side: "H",
    comp: "League One",
    date: "Sat 24 Oct 2026",
    short: "24 Oct",
    saves: 4,
    conceded: 0,
    pass: 77,
    claims: 5,
    avg: [8.3, 8.0, 8.4, 8.4, 8.1, 8.2, 8.2],
    status: "Signed off",
    mentor: "Dan Whitfield",
    submitted: "Sat 24 Oct, 21:40",
    notes: [
      {
        min: 22,
        pillar: 2,
        tone: "pos",
        text: "Dominated the six-yard box from set pieces. Five claims, zero spills.",
      },
      {
        min: 57,
        pillar: 0,
        tone: "pos",
        text: "Reaction save from close range at the near post kept the clean sheet alive.",
      },
      {
        min: 70,
        pillar: 3,
        tone: "pos",
        text: "Reorganised the back line after the double substitution without being prompted.",
      },
      {
        min: 88,
        pillar: 1,
        tone: "neu",
        text: "Chose safety over the switch late on. Right call at 0–0, but the option was on.",
      },
    ],
    focus: ["Range of passing under no pressure", "Leading the warm-up routine"],
  },
  {
    id: "r3",
    keeperId: "luca",
    home: "Harbour Athletic U21",
    away: "Penhallow Town U21",
    hs: 1,
    as: 3,
    side: "H",
    comp: "U21 League",
    date: "Sun 25 Oct 2026",
    short: "25 Oct",
    saves: 7,
    conceded: 3,
    pass: 68,
    claims: 2,
    avg: [7.6, 7.2, 7.0, 7.1, 7.3, 7.6, 7.8],
    status: "Awaiting sign-off",
    mentor: "Priya Nair",
    submitted: "Mon 26 Oct, 08:55",
    notes: [
      {
        min: 9,
        pillar: 5,
        tone: "neu",
        text: "Conceded early from a penalty and his body language dipped for ten minutes.",
      },
      {
        min: 33,
        pillar: 0,
        tone: "pos",
        text: "Excellent double save to keep it 1–1 at the break. Best moment of his month.",
      },
      {
        min: 52,
        pillar: 1,
        tone: "neg",
        text: "Played into a crowded midfield twice under pressure. Both led to turnovers.",
      },
      {
        min: 74,
        pillar: 3,
        tone: "neg",
        text: "Quiet when the line was dropping. Needs to own the space in front of him.",
      },
    ],
    focus: ["Reset routine after mistakes", "Scanning before receiving"],
  },
  {
    id: "r4",
    keeperId: "ryan",
    home: "Fenwick Rovers",
    away: "Thornbury Rovers",
    hs: 1,
    as: 1,
    side: "H",
    comp: "League Two",
    date: "Sun 25 Oct 2026",
    short: "25 Oct",
    saves: 5,
    conceded: 1,
    pass: 72,
    claims: 3,
    avg: [7.0, 6.8, 6.7, 6.9, 6.8, 7.1, 6.9],
    status: "Signed off",
    mentor: "Priya Nair",
    submitted: "Sun 25 Oct, 19:03",
    notes: [
      {
        min: 17,
        pillar: 6,
        tone: "pos",
        text: "Explosive push off his right foot to tip a header onto the bar.",
      },
      {
        min: 45,
        pillar: 5,
        tone: "pos",
        text: "Responded well after conceding on the stroke of half-time. Composed restart.",
      },
      {
        min: 66,
        pillar: 3,
        tone: "pos",
        text: "Much louder than last month. Organised the wall cleanly on all three free kicks.",
      },
      {
        min: 85,
        pillar: 4,
        tone: "neu",
        text: "Stayed on his line for a cross he could have attacked. Worth a clip review.",
      },
    ],
    focus: ["Attacking crosses from the right", "Settling into the loan dressing room"],
  },
  {
    id: "r5",
    keeperId: "sami",
    home: "Easterby United",
    away: "Ashvale United",
    hs: 1,
    as: 2,
    side: "A",
    comp: "League One",
    date: "Sat 24 Oct 2026",
    short: "24 Oct",
    saves: 5,
    conceded: 1,
    pass: 84,
    claims: 2,
    avg: [7.8, 8.1, 7.5, 7.4, 7.7, 7.7, 7.6],
    status: "Signed off",
    mentor: "Dan Whitfield",
    submitted: "Sun 25 Oct, 09:30",
    notes: [
      {
        min: 14,
        pillar: 1,
        tone: "pos",
        text: "Bypassed the first line with a driven pass into the No. 6, exactly the work from Tuesday.",
      },
      {
        min: 41,
        pillar: 0,
        tone: "pos",
        text: "Big save one-on-one. Stayed big and made the forward decide.",
      },
      {
        min: 59,
        pillar: 2,
        tone: "neg",
        text: "Hesitated on a deep cross and was beaten to it at the back post. Goal conceded.",
      },
      {
        min: 90,
        pillar: 5,
        tone: "pos",
        text: "Calm game management in stoppage time. Took the sting out of the game.",
      },
    ],
    focus: ["Attacking deep crosses", "Variety in goal kicks"],
  },
  {
    id: "r6",
    keeperId: "kieran",
    home: "Westmere City",
    away: "Millbrook Athletic",
    hs: 2,
    as: 2,
    side: "H",
    comp: "League One",
    date: "Sat 24 Oct 2026",
    short: "24 Oct",
    saves: 3,
    conceded: 2,
    pass: 70,
    claims: 1,
    avg: [7.0, 6.5, 6.8, 6.4, 6.7, 6.6, 6.8],
    status: "Awaiting sign-off",
    mentor: "Marcus Bell",
    submitted: "Mon 26 Oct, 13:20",
    notes: [
      {
        min: 6,
        pillar: 4,
        tone: "neg",
        text: "Rushed a clearance straight to the opposition, which led to the opening goal.",
      },
      {
        min: 29,
        pillar: 3,
        tone: "neg",
        text: "Very little organisation at set pieces in the first half.",
      },
      {
        min: 61,
        pillar: 0,
        tone: "pos",
        text: "Good low save to keep it level at 2–2. Hands led, body behind the ball.",
      },
      {
        min: 78,
        pillar: 5,
        tone: "neu",
        text: "Visibly frustrated after a foul was given against him. Recovered by full-time.",
      },
    ],
    focus: ["Pre-match routine with the sports psychologist", "Set-piece organisation script"],
  },
];

const WEEK = [
  { d: "Mon", n: 26 },
  { d: "Tue", n: 27 },
  { d: "Wed", n: 28 },
  { d: "Thu", n: 29 },
  { d: "Fri", n: 30 },
  { d: "Sat", n: 31 },
  { d: "Sun", n: 1 },
];
const TODAY = 2;

type EvKind = "fix" | "care" | "meet";
interface Ev {
  day: number;
  start: number;
  end: number;
  kind: EvKind;
  title: string;
  sub: string;
  lines?: string[];
}

const EVENTS: Ev[] = [
  {
    day: 0,
    start: 10,
    end: 11,
    kind: "meet",
    title: "Mentor stand-up",
    sub: "Team room · 6 attending",
  },
  { day: 0, start: 14, end: 15, kind: "care", title: "Check-in · Tom Okafor", sub: "Video call" },
  {
    day: 1,
    start: 11,
    end: 12.5,
    kind: "meet",
    title: "Training visit",
    sub: "Harbour Athletic academy",
  },
  {
    day: 1,
    start: 19,
    end: 21,
    kind: "fix",
    title: "Ethan Marsh",
    sub: "Harbour U18 v Easterby U18",
  },
  {
    day: 2,
    start: 10,
    end: 11,
    kind: "meet",
    title: "Mentor stand-up",
    sub: "Team room · 5 attending",
  },
  {
    day: 2,
    start: 16.5,
    end: 17.5,
    kind: "care",
    title: "Welfare call · Josh Adeyemi",
    sub: "Marcus Bell",
  },
  {
    day: 2,
    start: 19,
    end: 21,
    kind: "fix",
    title: "Luca Brennan",
    sub: "Harbour U21 v Redcliffe U21",
  },
  {
    day: 3,
    start: 9.5,
    end: 11,
    kind: "meet",
    title: "Video review",
    sub: "Kieran Doyle · 6 clips",
  },
  { day: 3, start: 13, end: 14, kind: "care", title: "Check-in · Luca Brennan", sub: "Priya Nair" },
  {
    day: 3,
    start: 15.5,
    end: 16.5,
    kind: "care",
    title: "Family meeting",
    sub: "Josh Adeyemi · at club",
  },
  { day: 4, start: 10, end: 11, kind: "meet", title: "Report sign-off", sub: "Hannah Cole" },
  {
    day: 4,
    start: 19.75,
    end: 21,
    kind: "fix",
    title: "Mateo Ruiz",
    sub: "Brackwater v Holloway Park",
  },
  {
    day: 5,
    start: 15,
    end: 17.25,
    kind: "fix",
    title: "4 fixtures · 15:00",
    sub: "",
    lines: ["Tom Okafor", "Callum Price", "Sami Haddad", "Kieran Doyle"],
  },
  {
    day: 6,
    start: 13,
    end: 15,
    kind: "fix",
    title: "Ryan Calloway",
    sub: "Fenwick v Larkhill Town",
  },
];

const DAY_AGENDA: { time: string; kind: EvKind; title: string; sub: string; done?: boolean }[][] = [
  [
    { time: "10:00", kind: "meet", title: "Mentor stand-up", sub: "Team room", done: true },
    {
      time: "14:00",
      kind: "care",
      title: "Check-in · Tom Okafor",
      sub: "Dan Whitfield",
      done: true,
    },
  ],
  [
    {
      time: "11:00",
      kind: "meet",
      title: "Training visit",
      sub: "Harbour Athletic academy",
      done: true,
    },
    {
      time: "19:00",
      kind: "fix",
      title: "Ethan Marsh",
      sub: "Harbour U18 v Easterby U18 · W 2–0",
      done: true,
    },
  ],
  [
    { time: "10:00", kind: "meet", title: "Mentor stand-up", sub: "Team room", done: true },
    {
      time: "16:30",
      kind: "care",
      title: "Welfare call · Josh Adeyemi",
      sub: "Marcus Bell · flagged red",
    },
    {
      time: "19:00",
      kind: "fix",
      title: "Luca Brennan",
      sub: "Harbour U21 v Redcliffe Albion U21",
    },
  ],
  [
    {
      time: "09:30",
      kind: "meet",
      title: "Video review · Kieran Doyle",
      sub: "6 clips · Westmere 2–2",
    },
    { time: "13:00", kind: "care", title: "Check-in · Luca Brennan", sub: "Priya Nair" },
    {
      time: "15:30",
      kind: "care",
      title: "Family meeting · Josh Adeyemi",
      sub: "At Ashvale training ground",
    },
  ],
  [
    { time: "10:00", kind: "meet", title: "Report sign-off", sub: "Hannah Cole · 3 pending" },
    { time: "19:45", kind: "fix", title: "Mateo Ruiz", sub: "Brackwater FC v Holloway Park" },
  ],
  [
    { time: "15:00", kind: "fix", title: "Tom Okafor", sub: "Stanmoor City v Northbridge FC" },
    { time: "15:00", kind: "fix", title: "Callum Price", sub: "Kingsmoor Town v Penhallow Town" },
    { time: "15:00", kind: "fix", title: "Sami Haddad", sub: "Ashvale United v Thornbury Rovers" },
    { time: "15:00", kind: "fix", title: "Kieran Doyle", sub: "Penhallow Town v Westmere City" },
  ],
  [{ time: "13:00", kind: "fix", title: "Ryan Calloway", sub: "Fenwick Rovers v Larkhill Town" }],
];

const USERS = [
  {
    name: "Dan Whitfield",
    initials: "DW",
    hue: 168,
    role: "Admin",
    title: "Senior mentor",
    keepers: 4,
    active: "Now",
    mfa: true,
    status: "Active",
  },
  {
    name: "Hannah Cole",
    initials: "HC",
    hue: 320,
    role: "Manager",
    title: "Head of mentoring",
    keepers: 10,
    active: "12 min ago",
    mfa: true,
    status: "Active",
  },
  {
    name: "Femi Adebayo",
    initials: "FA",
    hue: 30,
    role: "Manager",
    title: "Safeguarding lead",
    keepers: 10,
    active: "1 h ago",
    mfa: true,
    status: "Active",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    hue: 215,
    role: "Mentor",
    title: "Mentor",
    keepers: 3,
    active: "2 h ago",
    mfa: true,
    status: "Active",
  },
  {
    name: "Marcus Bell",
    initials: "MB",
    hue: 48,
    role: "Mentor",
    title: "Mentor",
    keepers: 3,
    active: "Yesterday",
    mfa: false,
    status: "Active",
  },
  {
    name: "Sophie Grant",
    initials: "SG",
    hue: 260,
    role: "Admin",
    title: "Operations",
    keepers: 0,
    active: "Mon 26 Oct",
    mfa: true,
    status: "Active",
  },
  {
    name: "Joe Turner",
    initials: "JT",
    hue: 140,
    role: "Mentor",
    title: "Mentor (part-time)",
    keepers: 0,
    active: "Not yet",
    mfa: false,
    status: "Invited",
  },
];

const NOTIFS = [
  { t: "Priya Nair submitted a match report for Luca Brennan", s: "Mon 26 Oct · 08:55", c: "teal" },
  { t: "Welfare check overdue for Josh Adeyemi (16 days)", s: "Today · 07:00", c: "red" },
  { t: "Kieran Doyle flagged amber by Marcus Bell", s: "Tue 27 Oct · 17:42", c: "amber" },
  { t: "New bulletin: November fixtures schedule published", s: "Tue 27 Oct · 09:10", c: "slate" },
];

const GROUP_LABEL: Record<Group, string> = {
  champ: "Championship",
  l1: "League One",
  youth: "Academy",
  loan: "Loan",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const avg = (a: number[]) => a.reduce((s, n) => s + n, 0) / a.length;
const f1 = (n: number) => n.toFixed(1);
const keeperById = (id: string) => KEEPERS.find((k) => k.id === id) as Keeper;

function worst(checks: Check[]): Welfare {
  if (checks.includes("over")) return "red";
  if (checks.includes("due")) return "amber";
  return "green";
}

function Avatar({ initials, hue, size = 28 }: { initials: string; hue: number; size?: number }) {
  return (
    <span
      className="av"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.round(size * 0.38)),
        background: `linear-gradient(140deg, hsl(${hue} 42% 38%), hsl(${(hue + 40) % 360} 46% 22%))`,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

type IconName =
  | "dashboard"
  | "roster"
  | "reports"
  | "interactions"
  | "duty"
  | "calendar"
  | "media"
  | "bulletin"
  | "users"
  | "search"
  | "bell"
  | "plus"
  | "close"
  | "check"
  | "arrow"
  | "alert"
  | "chevron"
  | "clock"
  | "radar"
  | "bars";

const ICONS: Record<IconName, string> = {
  dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  roster:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2",
  reports: "M8 4h8v3H8zM6 5.5H5v15h14v-15h-1M8.5 16v-2.5M12 16v-5M15.5 16v-3.5",
  interactions: "M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5",
  duty: "M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6zM8.8 12.2l2.3 2.3 4.2-4.6",
  calendar: "M4 6h16v14H4zM4 10h16M8.5 3.5v4M15.5 3.5v4",
  media: "M4 5h16v14H4zM4 16l4.5-4.5 4 4 2.5-2.5 5 5M15.5 9.5h.01",
  bulletin: "M4 10v4l3 .5V9.5zM7 9.5L17 5v14L7 14.5M19.5 9.5v5M9 15l1.2 4.5",
  users:
    "M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3.5 20c.6-3.4 3.2-5.5 6.5-5.5 1.3 0 2.5.3 3.5.9M18 14v2M18 20v.01M15.5 17h5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2.2 2.2 0 0 0 4 0",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  alert: "M12 4l9 16H3zM12 10v4.5M12 17.5v.01",
  chevron: "M9 6l6 6-6 6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  radar: "M12 3l8.5 6.2-3.2 10H6.7l-3.2-10zM12 8l4 3-1.5 4.7h-5L8 11z",
  bars: "M4 6h12M4 12h16M4 18h9",
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={ICONS[name]}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="#2dd4bf" />
      <path
        d="M8 19V9.5l6 5 6-5V19"
        stroke="#06231f"
        strokeWidth="2.6"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spark({ pts, color }: { pts: number[]; color: string }) {
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const d = pts
    .map(
      (p, i) =>
        `${((i / (pts.length - 1)) * 96 + 2).toFixed(1)},${(30 - ((p - min) / (max - min || 1)) * 24).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg width="76" height="34" viewBox="0 0 100 34" aria-hidden="true">
      <polyline
        points={d}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniBars({ vals }: { vals: number[] }) {
  const max = Math.max(...vals);
  return (
    <svg width="72" height="30" viewBox="0 0 84 34" aria-hidden="true">
      {vals.map((v, i) => {
        const h = Math.max(3, (v / max) * 28);
        return (
          <rect
            key={i}
            x={i * 12 + 1}
            y={32 - h}
            width="8"
            height={h}
            rx="2"
            fill={i === TODAY ? "#2dd4bf" : "rgba(45,212,191,.35)"}
          />
        );
      })}
    </svg>
  );
}

function ScorePill({ v }: { v: number }) {
  const cls = v >= 8 ? "hi" : v >= 7 ? "mid" : "lo";
  return <span className={`score ${cls}`}>{f1(v)}</span>;
}

function LevelTag({ k }: { k: Keeper }) {
  return <span className={`lvl lvl-${k.group}`}>{k.level}</span>;
}

/* ------------------------------------------------------------------ */
/* Radar + bars                                                         */
/* ------------------------------------------------------------------ */

const R = 104;
function pt(i: number, v: number) {
  const a = ((-90 + (i * 360) / 7) * Math.PI) / 180;
  const r = (Math.max(0, v - 4) / 6) * R;
  return [r * Math.cos(a), r * Math.sin(a)];
}
const poly = (vals: number[]) =>
  vals
    .map((v, i) =>
      pt(i, v)
        .map((n) => n.toFixed(1))
        .join(","),
    )
    .join(" ");

function Radar({ values, base }: { values: number[]; base: number[] }) {
  const rings = [5, 6, 7, 8, 9, 10];
  return (
    <svg
      className="radar"
      viewBox="-232 -146 464 296"
      role="img"
      aria-label="Seven-pillar radar chart"
    >
      {rings.map((r) => (
        <polygon
          key={r}
          points={poly(Array(7).fill(r))}
          className={r === 10 ? "ring outer" : "ring"}
        />
      ))}
      {PILLARS.map((_, i) => {
        const [x, y] = pt(i, 10);
        return <line key={i} x1="0" y1="0" x2={x.toFixed(1)} y2={y.toFixed(1)} className="spoke" />;
      })}
      {[6, 8].map((r) => (
        <text key={r} x="4" y={(-((r - 4) / 6) * R + 4).toFixed(1)} className="rlab">
          {r}
        </text>
      ))}
      <polygon points={poly(base)} className="area base" />
      <polygon points={poly(values)} className="area cur" />
      {values.map((v, i) => {
        const [x, y] = pt(i, v);
        return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.2" className="rdot" />;
      })}
      {PILLARS.map((p, i) => {
        const [x, y] = pt(i, 10.9);
        const anchor = Math.abs(x) < 8 ? "middle" : x > 0 ? "start" : "end";
        return (
          <g key={p}>
            <text
              x={x.toFixed(1)}
              y={(y + (y < -80 ? -2 : 4)).toFixed(1)}
              textAnchor={anchor}
              className="plab"
            >
              {p}
            </text>
            <text
              x={x.toFixed(1)}
              y={(y + (y < -80 ? 13 : 19)).toFixed(1)}
              textAnchor={anchor}
              className="pval"
            >
              {f1(values[i])}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PillarBars({
  values,
  base,
  compact,
}: {
  values: number[];
  base?: number[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "pbars compact" : "pbars"}>
      {PILLARS.map((p, i) => {
        const v = values[i];
        const d = base ? v - base[i] : 0;
        return (
          <div key={p} className="pbar">
            <span className="pname">{p}</span>
            <span className="ptrack">
              <span
                className={`pfill ${v >= 8 ? "hi" : v >= 7 ? "mid" : "lo"}`}
                style={{ width: `${v * 10}%` }}
              />
              {base && (
                <span
                  className="ptick"
                  style={{ left: `${base[i] * 10}%` }}
                  title="Season average"
                />
              )}
            </span>
            <span className="pv">{f1(v)}</span>
            {base && (
              <span className={`pd ${d > 0.05 ? "up" : d < -0.05 ? "down" : ""}`}>
                {d > 0.05 ? "+" : ""}
                {Math.abs(d) < 0.05 ? "0.0" : f1(d)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-mh{--bg:#0d1015;--sb:#0a0c10;--p1:#12161d;--p2:#171c25;--p3:#1d2430;--ln:#1f2631;--ln2:#2a3341;--tx:#e7ecf2;--mu:#8e99a8;--di:#5f6a79;--ac:#2dd4bf;--acd:rgba(45,212,191,.12);--acl:rgba(45,212,191,.32);--am:#f5b544;--amd:rgba(245,181,68,.13);--rd:#f87171;--rdd:rgba(248,113,113,.13);--gr:#34d399;--grd:rgba(52,211,153,.12);
width:100%;height:100%;overflow:hidden;position:relative;background:var(--bg);color:var(--tx);font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:1.45;-webkit-font-smoothing:antialiased;font-feature-settings:"cv11","ss01"}
.mk-mh *{box-sizing:border-box}
.mk-mh h1,.mk-mh h2,.mk-mh h3,.mk-mh p,.mk-mh ul,.mk-mh ol{margin:0;padding:0}
.mk-mh ul,.mk-mh ol{list-style:none}
.mk-mh button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;text-align:inherit}
.mk-mh input{font:inherit;color:inherit}
.mk-mh .num{font-variant-numeric:tabular-nums}
.mk-mh .av{display:inline-grid;place-items:center;border-radius:50%;color:#f3f6f9;font-weight:600;letter-spacing:.02em;flex:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}

/* Sidebar */
.mk-mh .sb{position:absolute;left:0;top:0;bottom:0;width:224px;background:var(--sb);border-right:1px solid var(--ln);display:flex;flex-direction:column;padding:14px 10px 12px}
.mk-mh .brand{display:flex;align-items:center;gap:10px;padding:2px 6px 14px}
.mk-mh .brand b{font-size:15px;font-weight:650;letter-spacing:-.01em;display:block}
.mk-mh .brand small{display:block;font-size:11px;color:var(--di);margin-top:1px}
.mk-mh .navlab{font-size:11px;color:var(--di);font-weight:500;padding:14px 10px 6px;letter-spacing:.02em}
.mk-mh .mnav{display:flex;flex-direction:column;gap:1px}
.mk-mh .ni{display:flex;align-items:center;gap:10px;height:32px;padding:0 10px;border-radius:7px;color:var(--mu);font-weight:500;font-size:13px;transition:background .12s,color .12s;width:100%}
.mk-mh .ni:hover{background:rgba(255,255,255,.04);color:var(--tx)}
.mk-mh .ni[aria-current="page"]{background:var(--p2);color:var(--tx);box-shadow:inset 0 0 0 1px var(--ln)}
.mk-mh .ni[aria-current="page"] svg{color:var(--ac)}
.mk-mh .ni .cnt{margin-left:auto;font-size:11px;color:var(--di);font-variant-numeric:tabular-nums}
.mk-mh .ni .bdg{margin-left:auto;font-size:11px;font-weight:600;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center}
.mk-mh .bdg.am{background:var(--amd);color:var(--am)}
.mk-mh .bdg.teal{background:var(--acd);color:var(--ac)}
.mk-mh .bdg.ok{background:var(--grd);color:var(--gr)}
.mk-mh .sbfoot{margin-top:auto;display:flex;flex-direction:column;gap:10px;padding-top:12px;border-top:1px solid var(--ln)}
.mk-mh .rolelab{font-size:11px;color:var(--di);padding:0 4px;display:flex;justify-content:space-between}
.mk-mh .roles{display:grid;grid-template-columns:repeat(3,1fr);background:var(--p1);border:1px solid var(--ln);border-radius:8px;padding:2px;gap:2px}
.mk-mh .roles button{height:26px;border-radius:6px;font-size:12px;font-weight:500;color:var(--mu);text-align:center;transition:background .12s,color .12s}
.mk-mh .roles button:hover{color:var(--tx)}
.mk-mh .roles button[aria-pressed="true"]{background:var(--p3);color:var(--tx);box-shadow:0 1px 2px rgba(0,0,0,.4),inset 0 0 0 1px var(--ln2)}
.mk-mh .me{display:flex;align-items:center;gap:10px;padding:4px}
.mk-mh .me b{display:block;font-weight:600;font-size:13px}
.mk-mh .me small{display:block;font-size:11px;color:var(--mu)}
.mk-mh .me .online{width:8px;height:8px;border-radius:50%;background:var(--gr);margin-left:auto;box-shadow:0 0 0 3px rgba(52,211,153,.15)}

/* Main */
.mk-mh .main{position:absolute;left:224px;right:0;top:0;bottom:0;display:flex;flex-direction:column}
.mk-mh .top{height:52px;flex:none;border-bottom:1px solid var(--ln);display:flex;align-items:center;gap:12px;padding:0 24px;background:rgba(13,16,21,.9)}
.mk-mh .crumb{display:flex;align-items:center;gap:6px;color:var(--di);font-size:13px}
.mk-mh .crumb b{color:var(--tx);font-weight:550}
.mk-mh .crumb svg{width:12px;height:12px}
.mk-mh .search{margin-left:auto;display:flex;align-items:center;gap:8px;height:32px;width:280px;padding:0 10px;border-radius:8px;background:var(--p1);border:1px solid var(--ln);color:var(--di);font-size:13px}
.mk-mh .search:hover{border-color:var(--ln2)}
.mk-mh .kbd{margin-left:auto;font-family:"IBM Plex Mono",monospace;font-size:11px;padding:1px 5px;border-radius:4px;border:1px solid var(--ln2);color:var(--mu)}
.mk-mh .ib{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;color:var(--mu);border:1px solid var(--ln);position:relative;background:var(--p1)}
.mk-mh .ib:hover{color:var(--tx);border-color:var(--ln2)}
.mk-mh .ib[aria-expanded="true"]{color:var(--tx);border-color:var(--ln2);background:var(--p2)}
.mk-mh .ib .pip{position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--rd);box-shadow:0 0 0 2px var(--p1)}
.mk-mh .btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:8px;font-weight:550;font-size:13px;white-space:nowrap;transition:background .12s,border-color .12s,color .12s}
.mk-mh .btn.pri{background:var(--ac);color:#04201c}
.mk-mh .btn.pri:hover{background:#5eead4}
.mk-mh .btn.sec{background:var(--p2);border:1px solid var(--ln2);color:var(--tx)}
.mk-mh .btn.sec:hover{background:var(--p3)}
.mk-mh .btn.gh{color:var(--mu);border:1px solid var(--ln)}
.mk-mh .btn.gh:hover{color:var(--tx);border-color:var(--ln2)}
.mk-mh .btn.sm{height:28px;padding:0 10px;font-size:12px;border-radius:7px}
.mk-mh .content{flex:1;position:relative;overflow:hidden}
.mk-mh .page{position:absolute;inset:0;padding:22px 24px 24px;overflow:auto;scrollbar-width:thin;scrollbar-color:var(--ln2) transparent}
.mk-mh .ph{display:flex;align-items:flex-end;gap:16px;margin-bottom:18px}
.mk-mh .ph h1{font-size:21px;font-weight:650;letter-spacing:-.02em;line-height:1.2}
.mk-mh .ph p{color:var(--mu);margin-top:4px;font-size:13px}
.mk-mh .ph .acts{margin-left:auto;display:flex;gap:8px;align-items:center}
.mk-mh .card{background:var(--p1);border:1px solid var(--ln);border-radius:12px}
.mk-mh .ch{display:flex;align-items:center;gap:8px;padding:14px 16px 10px}
.mk-mh .ch h2{font-size:13px;font-weight:600}
.mk-mh .ch .meta{color:var(--di);font-size:12px}
.mk-mh .ch .lnk{margin-left:auto;color:var(--mu);font-size:12px;display:inline-flex;align-items:center;gap:4px}
.mk-mh .ch .lnk:hover{color:var(--ac)}
.mk-mh .ch .lnk svg{width:13px;height:13px}

/* Pills */
.mk-mh .score{display:inline-grid;place-items:center;min-width:36px;height:22px;padding:0 6px;border-radius:6px;font-weight:600;font-size:12px;font-variant-numeric:tabular-nums}
.mk-mh .score.hi{background:var(--acd);color:var(--ac)}
.mk-mh .score.mid{background:rgba(148,163,184,.12);color:#cbd5e1}
.mk-mh .score.lo{background:var(--amd);color:var(--am)}
.mk-mh .lvl{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap;border:1px solid}
.mk-mh .lvl-champ{color:#99f6e4;border-color:rgba(45,212,191,.28);background:rgba(45,212,191,.07)}
.mk-mh .lvl-l1{color:#bfdbfe;border-color:rgba(96,165,250,.28);background:rgba(96,165,250,.07)}
.mk-mh .lvl-youth{color:#d4d9e1;border-color:var(--ln2);background:rgba(255,255,255,.03)}
.mk-mh .lvl-loan{color:#ddd6fe;border-color:rgba(167,139,250,.3);background:rgba(167,139,250,.08)}
.mk-mh .wd{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--mu)}
.mk-mh .wd i{width:8px;height:8px;border-radius:50%;flex:none}
.mk-mh .wd-green i{background:var(--gr);box-shadow:0 0 0 3px rgba(52,211,153,.14)}
.mk-mh .wd-amber i{background:var(--am);box-shadow:0 0 0 3px rgba(245,181,68,.16)}
.mk-mh .wd-red i{background:var(--rd);box-shadow:0 0 0 3px rgba(248,113,113,.18)}
.mk-mh .wd-red{color:#fca5a5}
.mk-mh .wd-amber{color:#fcd38d}
.mk-mh .st{white-space:nowrap;display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:12px;font-size:12px;font-weight:550}
.mk-mh .st.wait{background:var(--amd);color:var(--am)}
.mk-mh .st.done{background:var(--grd);color:var(--gr)}
.mk-mh .st svg{width:13px;height:13px}
.mk-mh .seg{display:inline-flex;background:var(--p1);border:1px solid var(--ln);border-radius:8px;padding:2px;gap:2px}
.mk-mh .seg button{height:26px;padding:0 10px;border-radius:6px;font-size:12px;font-weight:500;color:var(--mu);display:inline-flex;align-items:center;gap:6px}
.mk-mh .seg button:hover{color:var(--tx)}
.mk-mh .seg button[aria-pressed="true"]{background:var(--p3);color:var(--tx);box-shadow:inset 0 0 0 1px var(--ln2)}
.mk-mh .seg .c{font-size:11px;color:var(--di);font-variant-numeric:tabular-nums}

/* Dashboard */
.mk-mh .alert{display:flex;align-items:center;gap:14px;padding:10px 12px 10px 14px;border-radius:10px;border:1px solid rgba(245,181,68,.28);background:linear-gradient(90deg,rgba(245,181,68,.10),rgba(245,181,68,.03));margin-bottom:16px}
.mk-mh .alert.clear{border-color:rgba(52,211,153,.25);background:linear-gradient(90deg,rgba(52,211,153,.08),rgba(52,211,153,.02))}
.mk-mh .alert .ai{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:var(--amd);color:var(--am);flex:none}
.mk-mh .alert.clear .ai{background:var(--grd);color:var(--gr)}
.mk-mh .alert .at{font-weight:600;white-space:nowrap}
.mk-mh .alert .flags{display:flex;gap:8px;overflow:hidden}
.mk-mh .flag{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 10px;border-radius:13px;background:rgba(10,12,16,.55);border:1px solid var(--ln2);font-size:12px;white-space:nowrap;color:var(--tx)}
.mk-mh .flag .r{color:var(--mu)}
.mk-mh .alert .btn{margin-left:auto}
.mk-mh .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
.mk-mh .kpi{padding:14px 16px 12px;position:relative;overflow:hidden}
.mk-mh .kpi .kl{display:flex;align-items:center;gap:7px;color:var(--mu);font-size:12px;font-weight:500}
.mk-mh .kpi .kl svg{width:14px;height:14px}
.mk-mh .kpi .kv{display:flex;align-items:baseline;gap:6px;margin-top:8px;height:34px}
.mk-mh .kpi .kv b{font-size:28px;font-weight:650;letter-spacing:-.03em;line-height:1}
.mk-mh .kpi .kv span{color:var(--di);font-size:13px}
.mk-mh .kpi .ks{margin-top:8px;font-size:12px;color:var(--mu);display:flex;gap:6px;align-items:center}
.mk-mh .kpi .up{color:var(--gr)}
.mk-mh .kpi .spk{margin-left:auto;align-self:flex-end;opacity:.95}
.mk-mh .kpi.warn{border-color:rgba(245,181,68,.22)}
.mk-mh .kpi.warn .kl svg{color:var(--am)}
.mk-mh .dgrid{display:grid;grid-template-columns:1fr 352px;gap:12px}
.mk-mh .rl{padding:0 8px 8px}
.mk-mh .rli{display:grid;grid-template-columns:28px 1fr 96px 44px 14px;gap:12px;align-items:center;width:100%;padding:9px 8px;border-radius:8px;transition:background .12s}
.mk-mh .rli:hover{background:var(--p2)}
.mk-mh .rli:hover .chev{color:var(--ac)}
.mk-mh .rli .nm{font-weight:550;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .rli .fx{display:block;color:var(--mu);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .rli .by{font-size:12px;color:var(--di);text-align:right;line-height:1.35}
.mk-mh .rli .by em{font-style:normal;display:block;color:var(--mu)}
.mk-mh .chev{color:var(--di);display:grid}
.mk-mh .chev svg{width:14px;height:14px}
.mk-mh .rhead{display:grid;grid-template-columns:28px 1fr 96px 44px 14px;gap:12px;padding:0 16px 6px;font-size:11px;color:var(--di);font-weight:500;letter-spacing:.02em;border-bottom:1px solid var(--ln);margin-bottom:6px}
.mk-mh .rhead span:nth-child(3){text-align:right}
.mk-mh .wk{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;padding:0 12px 12px}
.mk-mh .wd2{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 0 8px;border-radius:8px;color:var(--mu);border:1px solid transparent}
.mk-mh .wd2:hover{background:var(--p2)}
.mk-mh .wd2 small{font-size:11px;color:var(--di)}
.mk-mh .wd2 b{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--tx)}
.mk-mh .wd2 .ddots{display:flex;gap:3px;height:5px}
.mk-mh .wd2 .ddots i{width:5px;height:5px;border-radius:50%;background:var(--ac)}
.mk-mh .wd2 .ddots i.care{background:var(--am)}
.mk-mh .wd2 .ddots i.meet{background:#64748b}
.mk-mh .wd2.today b{color:var(--ac)}
.mk-mh .wd2[aria-pressed="true"]{background:var(--p2);border-color:var(--ln2)}
.mk-mh .agenda{border-top:1px solid var(--ln);padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px}
.mk-mh .agh{display:flex;justify-content:space-between;font-size:12px;color:var(--mu);padding:2px 4px 4px}
.mk-mh .agh b{color:var(--tx);font-weight:600}
.mk-mh .ag{display:grid;grid-template-columns:44px 3px 1fr;gap:10px;align-items:center;padding:7px 8px;border-radius:8px;background:var(--p2);border:1px solid var(--ln)}
.mk-mh .ag .t{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--mu)}
.mk-mh .ag .bar{height:28px;border-radius:2px;background:var(--ac)}
.mk-mh .ag .bar.care{background:var(--am)}
.mk-mh .ag .bar.meet{background:#64748b}
.mk-mh .ag b{display:block;font-weight:550;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .ag small{display:block;font-size:12px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .ag.done{opacity:.55}

.mk-mh .wkcard{display:flex;flex-direction:column}
.mk-mh .cov{margin-top:auto;border-top:1px solid var(--ln);padding:12px 16px 14px}
.mk-mh .covh{display:flex;justify-content:space-between;font-size:12px;color:var(--mu);margin-bottom:8px}
.mk-mh .covh b{color:var(--tx);font-weight:600;font-variant-numeric:tabular-nums}
.mk-mh .covbar{height:6px;border-radius:3px;background:var(--p3);overflow:hidden}
.mk-mh .covbar i{display:block;height:100%;border-radius:3px;background:var(--ac)}
.mk-mh .cov small{display:block;font-size:12px;color:var(--di);margin-top:8px}

/* Roster */
.mk-mh .tb{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.mk-mh .inp{display:flex;align-items:center;gap:8px;height:32px;width:240px;padding:0 10px;border-radius:8px;background:var(--p1);border:1px solid var(--ln);color:var(--di)}
.mk-mh .inp:focus-within{border-color:var(--acl)}
.mk-mh .inp input{background:none;border:0;outline:0;width:100%;font-size:13px;color:var(--tx)}
.mk-mh .inp input::placeholder{color:var(--di)}
.mk-mh .tb .hint{margin-left:auto;color:var(--di);font-size:12px}
.mk-mh .tbl{overflow:hidden}
.mk-mh .tr{display:grid;grid-template-columns:minmax(0,1.7fr) 48px minmax(0,1.35fr) 150px 120px 92px 120px 88px;gap:12px;align-items:center;padding:0 16px;width:100%}
.mk-mh .thd{height:38px;font-size:11px;color:var(--di);font-weight:500;letter-spacing:.02em;border-bottom:1px solid var(--ln);background:rgba(255,255,255,.015)}
.mk-mh .trow{height:52px;border-bottom:1px solid var(--ln);transition:background .1s}
.mk-mh .trow:last-child{border-bottom:0}
.mk-mh .trow:hover{background:var(--p2)}
.mk-mh .trow[aria-pressed="true"]{background:var(--p2);box-shadow:inset 2px 0 0 var(--ac)}
.mk-mh .kc{display:flex;align-items:center;gap:10px;min-width:0}
.mk-mh .kc b{font-weight:550;display:block;white-space:nowrap}
.mk-mh .kc small{display:block;font-size:12px;color:var(--di);white-space:nowrap}
.mk-mh .club b{display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .club small{display:block;font-size:12px;color:var(--di);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .mut{color:var(--mu)}
.mk-mh .sc{display:flex;align-items:center;gap:8px}
.mk-mh .tr-n{font-size:12px;font-variant-numeric:tabular-nums}
.mk-mh .tr-n.up{color:var(--gr)}
.mk-mh .tr-n.down{color:var(--rd)}
.mk-mh .tr-n.flat{color:var(--di)}
.mk-mh .empty{padding:40px;text-align:center;color:var(--mu)}
.mk-mh .scrim{position:absolute;inset:0;background:rgba(5,7,10,.45);z-index:4;width:100%;cursor:default}
.mk-mh .drawer{position:absolute;top:0;right:0;bottom:0;width:392px;background:var(--p1);border-left:1px solid var(--ln2);z-index:5;box-shadow:-24px 0 48px rgba(0,0,0,.45);display:flex;flex-direction:column;overflow:auto;scrollbar-width:thin;scrollbar-color:var(--ln2) transparent}
.mk-mh .dh{display:flex;gap:14px;align-items:center;padding:20px 20px 16px;border-bottom:1px solid var(--ln)}
.mk-mh .dh h2{font-size:17px;font-weight:650;letter-spacing:-.01em}
.mk-mh .dh p{color:var(--mu);font-size:12px;margin-top:2px}
.mk-mh .dh .ib{margin-left:auto;align-self:flex-start}
.mk-mh .dstats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--ln)}
.mk-mh .dstats div{padding:12px 20px}
.mk-mh .dstats div+div{border-left:1px solid var(--ln)}
.mk-mh .dstats small{display:block;font-size:11px;color:var(--di)}
.mk-mh .dstats b{display:block;font-size:19px;font-weight:650;margin-top:2px;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.mk-mh .ds{padding:16px 20px;border-bottom:1px solid var(--ln)}
.mk-mh .ds h3{font-size:12px;font-weight:600;color:var(--mu);margin-bottom:12px;display:flex;justify-content:space-between}
.mk-mh .ds h3 span{font-weight:400;color:var(--di)}
.mk-mh .wbox{padding:10px 12px;border-radius:8px;background:var(--p2);border:1px solid var(--ln)}
.mk-mh .wtop{display:flex;align-items:center;justify-content:space-between;gap:10px}
.mk-mh .wbox .wd{font-size:13px;font-weight:550}
.mk-mh .wlc{font-size:12px;color:var(--mu)}
.mk-mh .wbox p{font-size:12px;color:var(--mu);margin-top:6px;padding-left:15px}
.mk-mh .nfx{display:flex;align-items:center;gap:10px;color:var(--tx)}
.mk-mh .nfx svg{color:var(--ac)}
.mk-mh .dacts{display:flex;gap:8px;padding:16px 20px;margin-top:auto}
.mk-mh .dacts .btn{flex:1;justify-content:center}

/* Pillar bars */
.mk-mh .pbars{display:flex;flex-direction:column;gap:10px}
.mk-mh .pbar{display:grid;grid-template-columns:118px 1fr 30px 34px;align-items:center;gap:10px}
.mk-mh .pbars.compact .pbar{grid-template-columns:118px 1fr 30px;gap:10px}
.mk-mh .pname{font-size:12px;color:var(--mu);white-space:nowrap}
.mk-mh .ptrack{position:relative;height:8px;border-radius:4px;background:var(--p3)}
.mk-mh .pfill{position:absolute;left:0;top:0;bottom:0;border-radius:4px}
.mk-mh .pfill.hi{background:linear-gradient(90deg,#14b8a6,#2dd4bf)}
.mk-mh .pfill.mid{background:linear-gradient(90deg,#0f766e,#24a597)}
.mk-mh .pfill.lo{background:linear-gradient(90deg,#b7791f,#f5b544)}
.mk-mh .ptick{position:absolute;top:-4px;bottom:-4px;width:2px;margin-left:-1px;border-radius:1px;background:#e7ecf2;opacity:.8}
.mk-mh .pv{font-weight:600;font-size:13px;text-align:right;font-variant-numeric:tabular-nums}
.mk-mh .pd{font-size:12px;text-align:right;color:var(--di);font-variant-numeric:tabular-nums}
.mk-mh .pd.up{color:var(--gr)}
.mk-mh .pd.down{color:var(--rd)}

/* Reports */
.mk-mh .rgrid{display:grid;grid-template-columns:236px 1fr;gap:16px;height:100%}
.mk-mh .rlist{display:flex;flex-direction:column;overflow:hidden}
.mk-mh .rlist .ch{padding-bottom:8px;border-bottom:1px solid var(--ln)}
.mk-mh .rlwrap{padding:6px;display:flex;flex-direction:column;gap:2px;overflow:auto}
.mk-mh .rcard{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;padding:9px 8px;border-radius:8px;width:100%;border:1px solid transparent}
.mk-mh .rcard:hover{background:var(--p2)}
.mk-mh .rcard[aria-pressed="true"]{background:var(--p2);border-color:var(--ln2)}
.mk-mh .rcard b{display:block;font-weight:550;font-size:13px}
.mk-mh .rcard small{display:block;font-size:12px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .rcard{align-items:start}
.mk-mh .rcard .score{margin-top:2px}
.mk-mh .rcard .av{margin-top:2px}
.mk-mh .rcard .rmeta{display:flex;align-items:center;gap:6px;color:var(--di);margin-top:2px}
.mk-mh .rcard .sdot{flex:none}
.mk-mh .rcard .sdot{width:7px;height:7px;border-radius:50%;background:var(--am)}
.mk-mh .rcard .sdot.done{background:var(--gr)}
.mk-mh .rdet{display:flex;flex-direction:column;gap:12px;min-width:0}
.mk-mh .rhd{display:flex;align-items:center;gap:14px;padding:14px 16px}
.mk-mh .rhd h2{font-size:17px;font-weight:650;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}
.mk-mh .rhd p{color:var(--mu);font-size:12px;margin-top:3px}
.mk-mh .rhd .acts{margin-left:auto;display:flex;gap:8px;align-items:center}
.mk-mh .fxl{display:flex;align-items:center;border-top:1px solid var(--ln)}
.mk-mh .fxl>div{padding:10px 16px;flex:1}
.mk-mh .fxl>div+div{border-left:1px solid var(--ln)}
.mk-mh .fxl small{display:block;font-size:11px;color:var(--di)}
.mk-mh .fxl b{display:block;font-size:16px;font-weight:650;margin-top:1px;font-variant-numeric:tabular-nums}
.mk-mh .fxl .big b{font-size:22px;color:var(--ac);letter-spacing:-.02em;line-height:1.1}
.mk-mh .fxl .scoreline b{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:22px}
.mk-mh .fxl small{white-space:nowrap}
.mk-mh .r2{display:grid;grid-template-columns:392px 1fr;gap:12px}
.mk-mh .chart{padding-bottom:6px}
.mk-mh .radar{display:block;width:100%;height:auto}
.mk-mh .radar .ring{fill:none;stroke:var(--ln2);stroke-width:1}
.mk-mh .radar .ring.outer{stroke:#36404f}
.mk-mh .radar .spoke{stroke:var(--ln2);stroke-width:1}
.mk-mh .radar .rlab{fill:var(--di);font-size:11px;font-family:"IBM Plex Mono",monospace}
.mk-mh .radar .area.base{fill:rgba(148,163,184,.08);stroke:#7c8899;stroke-width:1.2;stroke-dasharray:4 3}
.mk-mh .radar .area.cur{fill:rgba(45,212,191,.2);stroke:var(--ac);stroke-width:2;stroke-linejoin:round}
.mk-mh .radar .rdot{fill:var(--bg);stroke:var(--ac);stroke-width:2}
.mk-mh .radar .plab{fill:var(--mu);font-size:11.5px;font-weight:500}
.mk-mh .radar .pval{fill:var(--tx);font-size:12px;font-weight:650;font-family:Inter,sans-serif}
.mk-mh .legend{display:flex;gap:16px;padding:0 16px 12px;font-size:12px;color:var(--mu)}
.mk-mh .legend i{display:inline-block;width:14px;height:3px;border-radius:2px;background:var(--ac);vertical-align:middle;margin-right:6px}
.mk-mh .legend i.b{background:none;border-top:2px dashed #7c8899;height:0}
.mk-mh .bd{padding:4px 16px 16px}
.mk-mh .notes{display:flex;flex-direction:column}
.mk-mh .note{display:grid;grid-template-columns:34px 1fr;gap:10px;padding:9px 16px;border-top:1px solid var(--ln)}
.mk-mh .note .m{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--mu);padding-top:1px}
.mk-mh .note .tg{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;margin-bottom:3px;color:var(--mu);letter-spacing:.01em}
.mk-mh .note .tg i{width:6px;height:6px;border-radius:50%}
.mk-mh .note.pos .tg i{background:var(--ac)}
.mk-mh .note.neg .tg i{background:var(--am)}
.mk-mh .note.neu .tg i{background:#64748b}
.mk-mh .note p{font-size:13px;color:#d3dae3;line-height:1.45}
.mk-mh .r3{display:grid;grid-template-columns:1fr 300px}
.mk-mh .r3f{padding:14px 16px}
.mk-mh .r3f h3{font-size:13px;font-weight:600;margin-bottom:10px}
.mk-mh .r3f h3 span{color:var(--di);font-weight:400;font-size:12px}
.mk-mh .focus{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mk-mh .fi{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;border-radius:8px;background:var(--p2);border:1px solid var(--ln);font-size:13px}
.mk-mh .fi span{color:var(--ac);font-family:"IBM Plex Mono",monospace;font-size:12px;padding-top:1px}
.mk-mh .trail{padding:14px 16px;display:flex;flex-direction:column;justify-content:center;gap:12px;border-left:1px solid var(--ln)}
.mk-mh .trail div{display:flex;gap:10px;align-items:center;font-size:12px;color:var(--mu)}
.mk-mh .trail div b{color:var(--tx);font-weight:550}
.mk-mh .trail .tdot{width:8px;height:8px;border-radius:50%;border:2px solid var(--ln2);flex:none}
.mk-mh .trail .tdot.ok{border-color:var(--gr);background:var(--gr)}
.mk-mh .trail .tdot.wait{border-color:var(--am)}

.mk-mh .res{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:5px;font-size:11px;font-weight:700;margin-right:8px;vertical-align:1px}
.mk-mh .res-W{background:var(--grd);color:var(--gr)}
.mk-mh .res-D{background:rgba(148,163,184,.14);color:#cbd5e1}
.mk-mh .res-L{background:var(--rdd);color:var(--rd)}
.mk-mh .rlfoot{margin-top:auto;display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--ln)}
.mk-mh .rlfoot div{padding:12px 16px}
.mk-mh .rlfoot div+div{border-left:1px solid var(--ln)}
.mk-mh .rlfoot small{display:block;font-size:11px;color:var(--di)}
.mk-mh .rlfoot b{display:block;font-size:18px;font-weight:650;font-variant-numeric:tabular-nums;margin-top:2px}
.mk-mh .rlfoot b.pend{color:var(--am)}

/* Duty */
.mk-mh .dsum{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
.mk-mh .dsum .card{padding:10px 14px;display:flex;align-items:center;gap:12px}
.mk-mh .dsum .ring{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
.mk-mh .dsum .g{background:var(--grd);color:var(--gr)}
.mk-mh .dsum .ca{background:var(--amd);color:var(--am)}
.mk-mh .dsum .r{background:var(--rdd);color:var(--rd)}
.mk-mh .dsum .t{background:var(--acd);color:var(--ac)}
.mk-mh .dsum b{display:block;font-size:20px;font-weight:650;letter-spacing:-.02em;line-height:1.1;font-variant-numeric:tabular-nums}
.mk-mh .dsum small{display:block;font-size:12px;color:var(--mu)}
.mk-mh .dr{display:grid;grid-template-columns:minmax(0,1fr) repeat(6,74px) 92px 120px;gap:8px;align-items:center;padding:0 14px}
.mk-mh .dhd{height:34px;font-size:11px;color:var(--di);font-weight:500;border-bottom:1px solid var(--ln);background:rgba(255,255,255,.015)}
.mk-mh .dhd span{text-align:center}
.mk-mh .dhd span:first-child{text-align:left}
.mk-mh .drow{height:45px;border-bottom:1px solid var(--ln)}
.mk-mh .drow:last-child{border-bottom:0}
.mk-mh .drow.red{box-shadow:inset 2px 0 0 var(--rd);background:linear-gradient(90deg,rgba(248,113,113,.05),transparent 40%)}
.mk-mh .drow.amber{box-shadow:inset 2px 0 0 var(--am)}
.mk-mh .dk{display:flex;align-items:center;gap:10px;min-width:0}
.mk-mh .dk b{display:block;font-weight:550;white-space:nowrap}
.mk-mh .dk small{display:block;font-size:12px;color:var(--di);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .dk small.fl{color:#fcd38d}
.mk-mh .drow.red .dk small.fl{color:#fca5a5}
.mk-mh .cell{justify-self:center;width:26px;height:26px;border-radius:8px;display:grid;place-items:center}
.mk-mh .cell svg{width:14px;height:14px}
.mk-mh .cell.ok{color:var(--gr);background:var(--grd)}
.mk-mh .cell.due{color:var(--am);background:var(--amd);box-shadow:inset 0 0 0 1px rgba(245,181,68,.35)}
.mk-mh .cell.over{color:var(--rd);background:var(--rdd);box-shadow:inset 0 0 0 1px rgba(248,113,113,.4)}
.mk-mh .cell.na{color:var(--di)}
.mk-mh button.cell:hover{filter:brightness(1.3);transform:scale(1.06)}
.mk-mh .cell .bang{font-weight:700;font-size:13px}
.mk-mh .lc{font-size:12px;text-align:center;font-variant-numeric:tabular-nums}
.mk-mh .lc b{display:block;font-weight:550;color:var(--tx)}
.mk-mh .lc small{display:block;color:var(--di);font-size:11px}
.mk-mh .lc.late small{color:var(--rd)}
.mk-mh .lc.today b{color:var(--gr)}
.mk-mh .dlegend{display:flex;gap:16px;align-items:center;font-size:12px;color:var(--mu);margin-left:auto}
.mk-mh .dlegend span{display:inline-flex;gap:6px;align-items:center}
.mk-mh .dlegend i{width:10px;height:10px;border-radius:3px}

/* Calendar */
.mk-mh .cal{display:grid;grid-template-columns:52px repeat(7,1fr);overflow:hidden}
.mk-mh .calh{display:contents}
.mk-mh .calh>div{height:46px;border-bottom:1px solid var(--ln);display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:var(--mu)}
.mk-mh .calh>div+div{border-left:1px solid var(--ln)}
.mk-mh .calh b{font-size:15px;color:var(--tx);font-weight:600;font-variant-numeric:tabular-nums}
.mk-mh .calh .td b{background:var(--ac);color:#04201c;border-radius:6px;padding:1px 6px}
.mk-mh .calc{position:relative;border-left:1px solid var(--ln)}
.mk-mh .calc.td{background:rgba(45,212,191,.025)}
.mk-mh .hrs{position:relative}
.mk-mh .hr{position:absolute;left:0;right:0;font-size:11px;color:var(--di);font-family:"IBM Plex Mono",monospace;text-align:right;padding-right:8px;transform:translateY(-7px)}
.mk-mh .hl{position:absolute;left:0;right:0;border-top:1px solid rgba(31,38,49,.8)}
.mk-mh .ev{position:absolute;left:4px;right:4px;border-radius:6px;padding:5px 7px;overflow:hidden;font-size:12px;line-height:1.3;border:1px solid}
.mk-mh .ev b{display:block;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .ev small{display:block;font-size:11px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-mh .ev.fix{background:rgba(45,212,191,.14);border-color:rgba(45,212,191,.35);color:#ccfbf1}
.mk-mh .ev.care{background:rgba(245,181,68,.12);border-color:rgba(245,181,68,.32);color:#fde7bd}
.mk-mh .ev.meet{background:rgba(100,116,139,.16);border-color:rgba(100,116,139,.35);color:#d6dde6}
.mk-mh .now{position:absolute;left:-1px;right:0;border-top:2px solid var(--rd);z-index:2}
.mk-mh .now::before{content:"";position:absolute;left:-4px;top:-5px;width:8px;height:8px;border-radius:50%;background:var(--rd)}

/* Users */
.mk-mh .ur{display:grid;grid-template-columns:minmax(0,1.6fr) 130px 90px 120px 80px 100px 40px;gap:12px;align-items:center;padding:0 16px}
.mk-mh .urow{height:54px;border-bottom:1px solid var(--ln)}
.mk-mh .urow:last-child{border-bottom:0}
.mk-mh .rp{display:inline-flex;height:22px;align-items:center;padding:0 8px;border-radius:6px;font-size:12px;font-weight:550}
.mk-mh .rp.Admin{background:var(--acd);color:var(--ac)}
.mk-mh .rp.Manager{background:rgba(96,165,250,.12);color:#93c5fd}
.mk-mh .rp.Mentor{background:rgba(148,163,184,.12);color:#cbd5e1}
.mk-mh .mfa{font-size:12px;display:inline-flex;gap:5px;align-items:center}
.mk-mh .mfa.yes{color:var(--gr)}
.mk-mh .mfa.no{color:var(--am)}
.mk-mh .ust{font-size:12px;color:var(--mu)}
.mk-mh .ust.inv{color:var(--am)}

/* Popover + toast */
.mk-mh .pop{position:absolute;top:46px;right:142px;width:340px;z-index:20;background:var(--p2);border:1px solid var(--ln2);border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.55);overflow:hidden}
.mk-mh .pop h3{font-size:13px;font-weight:600;padding:12px 14px;border-bottom:1px solid var(--ln);display:flex;justify-content:space-between}
.mk-mh .pop h3 span{font-weight:400;color:var(--ac);font-size:12px}
.mk-mh .pn{display:grid;grid-template-columns:8px 1fr;gap:10px;padding:10px 14px;border-bottom:1px solid var(--ln)}
.mk-mh .pn:last-child{border-bottom:0}
.mk-mh .pn i{width:8px;height:8px;border-radius:50%;margin-top:5px}
.mk-mh .pn i.teal{background:var(--ac)}
.mk-mh .pn i.red{background:var(--rd)}
.mk-mh .pn i.amber{background:var(--am)}
.mk-mh .pn i.slate{background:#64748b}
.mk-mh .pn p{font-size:13px}
.mk-mh .pn small{font-size:11px;color:var(--di)}
.mk-mh .toast{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);z-index:30;background:#1f2732;border:1px solid var(--ln2);color:var(--tx);border-radius:10px;padding:10px 14px;font-size:13px;display:flex;gap:10px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.5);white-space:nowrap}
.mk-mh .toast svg{color:var(--ac)}

@media (prefers-reduced-motion: no-preference){
  .mk-mh .drawer{animation:mk-mh-slide .22s cubic-bezier(.2,.8,.2,1)}
  .mk-mh .scrim{animation:mk-mh-fade .2s ease}
  .mk-mh .pop{animation:mk-mh-pop .16s ease-out}
  .mk-mh .toast{animation:mk-mh-up .2s ease-out}
  .mk-mh .page{animation:mk-mh-fade .18s ease}
  .mk-mh .radar .area.cur{animation:mk-mh-grow .4s cubic-bezier(.2,.8,.2,1);transform-origin:0 0}
  .mk-mh .ag.lv .bar{animation:mk-mh-pulse 2s ease-in-out infinite}
}
@keyframes mk-mh-slide{from{transform:translateX(28px);opacity:0}to{transform:none;opacity:1}}
@keyframes mk-mh-fade{from{opacity:0}to{opacity:1}}
@keyframes mk-mh-pop{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@keyframes mk-mh-up{from{opacity:0;transform:translate(-50%,6px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes mk-mh-grow{from{transform:scale(.85);opacity:.3}to{transform:none;opacity:1}}
@keyframes mk-mh-pulse{0%,100%{opacity:1}50%{opacity:.45}}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const TITLES: Record<View, string> = {
  dashboard: "Dashboard",
  roster: "Roster",
  reports: "Match reports",
  interactions: "Interactions",
  duty: "Duty of care",
  calendar: "Calendar",
  media: "Media",
  bulletin: "Bulletin",
  users: "Users",
};

const INIT_CHECKS: Record<string, Check[]> = Object.fromEntries(
  KEEPERS.map((k) => [k.id, k.checks]),
);
const INIT_LAST: Record<string, string> = Object.fromEntries(
  KEEPERS.map((k) => [k.id, k.lastCheck]),
);
const DAYS_AGO: Record<string, number> = {
  "26 Oct": 2,
  "15 Oct": 13,
  "23 Oct": 5,
  "12 Oct": 16,
  "22 Oct": 6,
  "20 Oct": 8,
  "14 Oct": 14,
  "21 Oct": 7,
  "27 Oct": 1,
  Today: 0,
};

export default function MentorHubMockup() {
  const [view, setView] = useState<View>("dashboard");
  const [role, setRole] = useState<Role>("Mentor");
  const [checks, setChecks] = useState<Record<string, Check[]>>(INIT_CHECKS);
  const [lastCheck, setLastCheck] = useState<Record<string, string>>(INIT_LAST);
  const [reportId, setReportId] = useState("r1");
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [chartMode, setChartMode] = useState<"radar" | "bars">("radar");
  const [drawer, setDrawer] = useState<string | null>(null);
  const [group, setGroup] = useState<"all" | Group>("all");
  const [query, setQuery] = useState("");
  const [day, setDay] = useState(TODAY);
  const [dutyFilter, setDutyFilter] = useState<"all" | Welfare>("all");
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const welfare = useMemo(() => {
    const out: Record<string, Welfare> = {};
    KEEPERS.forEach((k) => (out[k.id] = worst(checks[k.id])));
    return out;
  }, [checks]);

  const flagged = KEEPERS.filter((k) => welfare[k.id] !== "green").sort((a, b) =>
    welfare[a.id] === welfare[b.id] ? 0 : welfare[a.id] === "red" ? -1 : 1,
  );
  const nRed = flagged.filter((k) => welfare[k.id] === "red").length;
  const nAmber = flagged.length - nRed;

  const go = (v: View) => {
    if (v === "interactions" || v === "media" || v === "bulletin") {
      setToast(
        `${TITLES[v]} isn't included in this preview. Try Roster, Match reports or Duty of care.`,
      );
      return;
    }
    setView(v);
    setDrawer(null);
    setNotifOpen(false);
  };

  const pickRole = (r: Role) => {
    setRole(r);
    if (r !== "Admin" && view === "users") setView("dashboard");
  };

  const openReport = (id: string) => {
    setReportId(id);
    setView("reports");
    setDrawer(null);
  };

  const logCheck = (id: string) => {
    setChecks((c) => ({ ...c, [id]: c[id].map((s, i) => (i === 0 ? "ok" : s)) }));
    setLastCheck((l) => ({ ...l, [id]: "Today" }));
  };
  const resolveCell = (id: string, idx: number) => {
    setChecks((c) => ({ ...c, [id]: c[id].map((s, i) => (i === idx ? "ok" : s)) }));
    if (idx === 0) setLastCheck((l) => ({ ...l, [id]: "Today" }));
  };

  const nav: { v: View; icon: IconName; extra?: ReactNode }[] = [
    { v: "dashboard", icon: "dashboard" },
    { v: "roster", icon: "roster", extra: <span className="cnt">10</span> },
    {
      v: "reports",
      icon: "reports",
      extra: (
        <span className="bdg teal">
          {REPORTS.filter((r) => r.status !== "Signed off" && !signed[r.id]).length}
        </span>
      ),
    },
    { v: "interactions", icon: "interactions" },
    {
      v: "duty",
      icon: "duty",
      extra: flagged.length ? (
        <span className="bdg am">{flagged.length}</span>
      ) : (
        <span className="bdg ok">0</span>
      ),
    },
    { v: "calendar", icon: "calendar" },
    { v: "media", icon: "media" },
    { v: "bulletin", icon: "bulletin", extra: <span className="cnt">2 new</span> },
  ];

  const meTitle =
    role === "Mentor"
      ? "Senior mentor"
      : role === "Manager"
        ? "Mentoring manager"
        : "Administrator";

  /* ---------------- Views ---------------- */

  const renderDashboard = () => {
    const agenda = DAY_AGENDA[day];
    return (
      <div className="page" key="dash">
        <div className="ph">
          <div>
            <h1>Good morning, Dan</h1>
            <p>
              Wednesday 28 October 2026 ·{" "}
              {role === "Mentor"
                ? "4 of your keepers play this weekend"
                : "Team overview · 3 mentors, 10 keepers, 3 reports to sign off"}
            </p>
          </div>
          <div className="acts">
            <button type="button" className="btn gh" onClick={() => go("calendar")}>
              <Icon name="calendar" size={15} /> This week
            </button>
            <button type="button" className="btn pri" onClick={() => openReport("r1")}>
              <Icon name="plus" size={15} /> New match report
            </button>
          </div>
        </div>

        {flagged.length ? (
          <div className="alert" role="status">
            <span className="ai">
              <Icon name="alert" size={15} />
            </span>
            <span className="at">
              {flagged.length} welfare flag{flagged.length > 1 ? "s" : ""} need attention
            </span>
            <span className="flags">
              {flagged.map((k) => (
                <span key={k.id} className={`flag wd-${welfare[k.id]}`}>
                  <span className={`wd wd-${welfare[k.id]}`}>
                    <i />
                  </span>
                  {k.name}
                  <span className="r">{DAYS_AGO[lastCheck[k.id]] ?? 0} days</span>
                </span>
              ))}
            </span>
            <button type="button" className="btn sec sm" onClick={() => go("duty")}>
              Review <Icon name="arrow" size={13} />
            </button>
          </div>
        ) : (
          <div className="alert clear" role="status">
            <span className="ai">
              <Icon name="check" size={15} />
            </span>
            <span className="at">All duty-of-care checks are up to date</span>
            <button type="button" className="btn sec sm" onClick={() => go("duty")}>
              Open board <Icon name="arrow" size={13} />
            </button>
          </div>
        )}

        <div className="kpis">
          <div className="card kpi">
            <div className="kl">
              <Icon name="roster" /> Keepers
            </div>
            <div className="kv num">
              <b>10</b>
              <span>active</span>
              <span className="spk">
                <Spark pts={[6, 6, 7, 7, 8, 8, 9, 9, 10]} color="#2dd4bf" />
              </span>
            </div>
            <div className="ks">
              <span className="up">+1</span> signed this month
            </div>
          </div>
          <div className="card kpi">
            <div className="kl">
              <Icon name="reports" /> Reports this week
            </div>
            <div className="kv num">
              <b>7</b>
              <span>/ 9 fixtures</span>
              <span className="spk">
                <Spark pts={[5, 7, 6, 8, 6, 9, 7, 8, 7]} color="#2dd4bf" />
              </span>
            </div>
            <div className="ks">
              <span className="up">78%</span> filed within 48 hours
            </div>
          </div>
          <div className={`card kpi ${flagged.length ? "warn" : ""}`}>
            <div className="kl">
              <Icon name="duty" /> Open welfare flags
            </div>
            <div className="kv num">
              <b>{flagged.length}</b>
              <span>keepers</span>
              <span className="spk">
                <Spark
                  pts={[1, 2, 2, 1, 3, 2, 4, 3, Math.max(flagged.length, 0)]}
                  color="#f5b544"
                />
              </span>
            </div>
            <div className="ks">
              <span className="wd wd-red">
                <i />
                {nRed} red
              </span>
              <span className="wd wd-amber">
                <i />
                {nAmber} amber
              </span>
            </div>
          </div>
          <div className="card kpi">
            <div className="kl">
              <Icon name="calendar" /> Upcoming fixtures
            </div>
            <div className="kv num">
              <b>8</b>
              <span>next 7 days</span>
              <span className="spk">
                <MiniBars vals={[0, 1, 1, 0, 1, 4, 1]} />
              </span>
            </div>
            <div className="ks">Next: Luca Brennan, today 19:00</div>
          </div>
        </div>

        <div className="dgrid">
          <div className="card">
            <div className="ch">
              <h2>Recent match reports</h2>
              <span className="meta">Last 7 days</span>
              <button type="button" className="lnk" onClick={() => go("reports")}>
                View all <Icon name="arrow" />
              </button>
            </div>
            <div className="rhead">
              <span />
              <span>Keeper · fixture</span>
              <span>Mentor</span>
              <span>Score</span>
              <span />
            </div>
            <div className="rl">
              {REPORTS.map((r) => {
                const k = keeperById(r.keeperId);
                return (
                  <button type="button" key={r.id} className="rli" onClick={() => openReport(r.id)}>
                    <Avatar initials={k.initials} hue={k.hue} />
                    <span style={{ minWidth: 0 }}>
                      <span className="nm">{k.name}</span>
                      <span className="fx">
                        {r.home} {r.hs}–{r.as} {r.away} · {r.short}
                      </span>
                    </span>
                    <span className="by">
                      <em>{r.mentor.split(" ")[0]}</em>
                      {r.status === "Signed off" || signed[r.id] ? "Signed off" : "Awaiting"}
                    </span>
                    <ScorePill v={avg(k.pillars)} />
                    <span className="chev">
                      <Icon name="chevron" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card wkcard">
            <div className="ch">
              <h2>This week</h2>
              <span className="meta">26 Oct – 1 Nov</span>
              <button type="button" className="lnk" onClick={() => go("calendar")}>
                Calendar <Icon name="arrow" />
              </button>
            </div>
            <div className="wk">
              {WEEK.map((w, i) => (
                <button
                  type="button"
                  key={w.d}
                  className={`wd2 ${i === TODAY ? "today" : ""}`}
                  aria-pressed={day === i}
                  onClick={() => setDay(i)}
                >
                  <small>{w.d}</small>
                  <b>{w.n}</b>
                  <span className="ddots">
                    {DAY_AGENDA[i].slice(0, 4).map((e, j) => (
                      <i key={j} className={e.kind} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
            <div className="agenda">
              <div className="agh">
                <b>
                  {day === TODAY ? "Today" : WEEK[day].d}, {WEEK[day].n} {day === 6 ? "Nov" : "Oct"}
                </b>
                <span>{agenda.length} items</span>
              </div>
              {agenda.map((e, i) => (
                <div
                  key={i}
                  className={`ag ${e.done ? "done" : ""} ${day === TODAY && i === 1 ? "lv" : ""}`}
                >
                  <span className="t">{e.time}</span>
                  <span className={`bar ${e.kind}`} />
                  <span style={{ minWidth: 0 }}>
                    <b>{e.title}</b>
                    <small>{e.sub}</small>
                  </span>
                </div>
              ))}
            </div>
            <div className="cov">
              <div className="covh">
                <span>Report coverage · last weekend</span>
                <b>7 / 9</b>
              </div>
              <div className="covbar">
                <i style={{ width: "78%" }} />
              </div>
              <small>Outstanding: Josh Adeyemi, Oskar Lindqvist</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRoster = () => {
    const q = query.trim().toLowerCase();
    const rows = KEEPERS.filter(
      (k) =>
        (group === "all" || k.group === group) &&
        (!q || k.name.toLowerCase().includes(q) || k.club.toLowerCase().includes(q)),
    );
    const counts = (g: Group) => KEEPERS.filter((k) => k.group === g).length;
    const dk = drawer ? keeperById(drawer) : null;
    const dkReport = dk ? REPORTS.find((r) => r.keeperId === dk.id) : undefined;
    return (
      <>
        <div className="page" key="roster">
          <div className="ph">
            <div>
              <h1>Roster</h1>
              <p>10 goalkeepers across 8 clubs · 2 on loan · season 2026/27</p>
            </div>
            <div className="acts">
              <button
                type="button"
                className="btn gh"
                onClick={() => setToast("Roster exported to CSV (10 keepers)")}
              >
                Export
              </button>
              <button
                type="button"
                className="btn pri"
                onClick={() => setToast("Add keeper opens the onboarding form in the full app")}
              >
                <Icon name="plus" size={15} /> Add keeper
              </button>
            </div>
          </div>
          <div className="tb">
            <label className="inp">
              <Icon name="search" size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search keepers or clubs"
                aria-label="Search keepers or clubs"
              />
            </label>
            <div className="seg" role="group" aria-label="Filter by level">
              {(["all", "champ", "l1", "youth", "loan"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  aria-pressed={group === g}
                  onClick={() => setGroup(g)}
                >
                  {g === "all" ? "All" : GROUP_LABEL[g]}
                  <span className="c">{g === "all" ? 10 : counts(g)}</span>
                </button>
              ))}
            </div>
            <span className="hint">Sorted by surname · click a keeper for profile</span>
          </div>
          <div className="card tbl">
            <div className="tr thd">
              <span>Keeper</span>
              <span>Age</span>
              <span>Club</span>
              <span>Level</span>
              <span>Mentor</span>
              <span>Last report</span>
              <span>Report score</span>
              <span>Welfare</span>
            </div>
            {rows.length === 0 && <div className="empty">No keepers match “{query}”</div>}
            {rows.map((k) => {
              const s = avg(k.pillars);
              return (
                <button
                  type="button"
                  key={k.id}
                  className="tr trow"
                  aria-pressed={drawer === k.id}
                  onClick={() => setDrawer(k.id)}
                >
                  <span className="kc">
                    <Avatar initials={k.initials} hue={k.hue} size={30} />
                    <span>
                      <b>{k.name}</b>
                      <small>GK · {k.apps} apps</small>
                    </span>
                  </span>
                  <span className="num mut">{k.age}</span>
                  <span className="club">
                    <b>{k.club}</b>
                    <small>
                      {k.parent
                        ? `On loan from ${k.parent}`
                        : k.group === "youth"
                          ? "Academy"
                          : "First team"}
                    </small>
                  </span>
                  <span>
                    <LevelTag k={k} />
                  </span>
                  <span className="mut">{k.mentor}</span>
                  <span className="mut num">{k.lastReport}</span>
                  <span className="sc">
                    <ScorePill v={s} />
                    <span className={`tr-n ${k.trend > 0 ? "up" : k.trend < 0 ? "down" : "flat"}`}>
                      {k.trend > 0 ? "▲" : k.trend < 0 ? "▼" : "–"} {Math.abs(k.trend).toFixed(1)}
                    </span>
                  </span>
                  <span className={`wd wd-${welfare[k.id]}`}>
                    <i />
                    {welfare[k.id] === "green"
                      ? "Clear"
                      : welfare[k.id] === "amber"
                        ? "Monitor"
                        : "Action"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {dk && (
          <>
            <button
              type="button"
              className="scrim"
              aria-label="Close profile"
              onClick={() => setDrawer(null)}
            />
            <aside className="drawer" aria-label={`${dk.name} profile`}>
              <div className="dh">
                <Avatar initials={dk.initials} hue={dk.hue} size={48} />
                <div>
                  <h2>{dk.name}</h2>
                  <p>
                    {dk.age} · {dk.club}
                    {dk.parent ? ` (loan from ${dk.parent})` : ""}
                  </p>
                  <div style={{ marginTop: 8 }}>
                    <LevelTag k={dk} />
                  </div>
                </div>
                <button
                  type="button"
                  className="ib"
                  aria-label="Close"
                  onClick={() => setDrawer(null)}
                >
                  <Icon name="close" />
                </button>
              </div>
              <div className="dstats">
                <div>
                  <small>Latest score</small>
                  <b style={{ color: "var(--ac)" }}>{f1(avg(dk.pillars))}</b>
                </div>
                <div>
                  <small>Appearances</small>
                  <b>{dk.apps}</b>
                </div>
                <div>
                  <small>Clean sheets</small>
                  <b>{dk.cleanSheets}</b>
                </div>
              </div>
              <div className="ds">
                <h3>
                  Seven pillars <span>Report · {dk.lastReport}</span>
                </h3>
                <PillarBars values={dk.pillars} compact />
              </div>
              <div className="ds">
                <h3>
                  Duty of care <span>Mentor · {dk.mentor}</span>
                </h3>
                <div className="wbox">
                  <div className="wtop">
                    <span className={`wd wd-${welfare[dk.id]}`}>
                      <i />
                      {welfare[dk.id] === "green"
                        ? "All checks clear"
                        : welfare[dk.id] === "amber"
                          ? "Monitor"
                          : "Action needed"}
                    </span>
                    <span className="wlc">Last check-in {lastCheck[dk.id]}</span>
                  </div>
                  {dk.note && welfare[dk.id] !== "green" && <p>{dk.note}</p>}
                </div>
              </div>
              <div className="ds">
                <h3>Next fixture</h3>
                <div className="nfx">
                  <Icon name="calendar" size={15} /> {dk.next}
                </div>
              </div>
              <div className="dacts">
                <button
                  type="button"
                  className="btn sec"
                  onClick={() =>
                    dkReport
                      ? openReport(dkReport.id)
                      : setToast(`${dk.name}'s ${dk.lastReport} report is in the archive`)
                  }
                >
                  Open latest report
                </button>
                <button
                  type="button"
                  className="btn pri"
                  onClick={() => setToast(`Interaction logged for ${dk.name}`)}
                >
                  <Icon name="plus" size={14} /> Log interaction
                </button>
              </div>
            </aside>
          </>
        )}
      </>
    );
  };

  const renderReports = () => {
    const r = REPORTS.find((x) => x.id === reportId) as Report;
    const k = keeperById(r.keeperId);
    const overall = avg(k.pillars);
    const isSigned = r.status === "Signed off" || !!signed[r.id];
    const canSign = role !== "Mentor";
    const gf = r.side === "H" ? r.hs : r.as;
    const ga = r.side === "H" ? r.as : r.hs;
    const res = gf > ga ? "W" : gf < ga ? "L" : "D";
    const pending = REPORTS.filter((x) => x.status !== "Signed off" && !signed[x.id]).length;
    return (
      <div className="page" key="reports">
        <div className="rgrid">
          <div className="card rlist">
            <div className="ch">
              <h2>Match reports</h2>
              <span className="meta">This week · {REPORTS.length}</span>
            </div>
            <div className="rlwrap">
              {REPORTS.map((x) => {
                const xk = keeperById(x.keeperId);
                const xs = x.status === "Signed off" || !!signed[x.id];
                return (
                  <button
                    type="button"
                    key={x.id}
                    className="rcard"
                    aria-pressed={x.id === reportId}
                    onClick={() => setReportId(x.id)}
                  >
                    <Avatar initials={xk.initials} hue={xk.hue} />
                    <span style={{ minWidth: 0 }}>
                      <b>{xk.name}</b>
                      <small>
                        {x.side === "H" ? "v" : "at"} {x.side === "H" ? x.away : x.home}
                      </small>
                      <small className="rmeta">
                        <span className={`sdot ${xs ? "done" : ""}`} />
                        {x.short} · {xs ? "Signed off" : "Awaiting"}
                      </small>
                    </span>
                    <ScorePill v={avg(xk.pillars)} />
                  </button>
                );
              })}
            </div>
            <div className="rlfoot">
              <div>
                <small>Avg score</small>
                <b>7.5</b>
              </div>
              <div>
                <small>To sign off</small>
                <b className={pending ? "pend" : ""}>{pending}</b>
              </div>
            </div>
          </div>

          <div className="rdet">
            <div className="card">
              <div className="rhd">
                <Avatar initials={k.initials} hue={k.hue} size={42} />
                <div>
                  <h2>
                    {k.name} <LevelTag k={k} />
                  </h2>
                  <p>
                    {r.date} · {r.side === "H" ? "Home" : "Away"} · Report by {r.mentor}
                  </p>
                </div>
                <div className="acts">
                  <span className={`st ${isSigned ? "done" : "wait"}`}>
                    <Icon name={isSigned ? "check" : "clock"} />
                    {isSigned ? "Signed off" : "Awaiting sign-off"}
                  </span>
                  {canSign && !isSigned ? (
                    <button
                      type="button"
                      className="btn pri sm"
                      onClick={() => setSigned((s) => ({ ...s, [r.id]: true }))}
                    >
                      <Icon name="check" size={14} /> Sign off
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn sec sm"
                      onClick={() => setToast("Editing opens the report form in the full app")}
                    >
                      Edit report
                    </button>
                  )}
                </div>
              </div>
              <div className="fxl">
                <div className="big">
                  <small>Overall</small>
                  <b>{f1(overall)}</b>
                </div>
                <div className="scoreline" style={{ flex: 3, minWidth: 0 }}>
                  <small>Result</small>
                  <b>
                    <span className={`res res-${res}`}>{res}</span>
                    {gf}–{ga} {r.side === "H" ? "v" : "at"} {r.side === "H" ? r.away : r.home}
                  </b>
                </div>
                <div>
                  <small>Saves</small>
                  <b>{r.saves}</b>
                </div>
                <div>
                  <small>Conceded</small>
                  <b>{r.conceded}</b>
                </div>
                <div>
                  <small>Passing</small>
                  <b>{r.pass}%</b>
                </div>
                <div>
                  <small>Claims</small>
                  <b>{r.claims}</b>
                </div>
              </div>
            </div>

            <div className="r2">
              <div className="card chart">
                <div className="ch">
                  <h2>Seven pillars</h2>
                  <span
                    style={{ marginLeft: "auto" }}
                    className="seg"
                    role="group"
                    aria-label="Chart type"
                  >
                    <button
                      type="button"
                      aria-pressed={chartMode === "radar"}
                      onClick={() => setChartMode("radar")}
                    >
                      <Icon name="radar" size={14} /> Radar
                    </button>
                    <button
                      type="button"
                      aria-pressed={chartMode === "bars"}
                      onClick={() => setChartMode("bars")}
                    >
                      <Icon name="bars" size={14} /> Bars
                    </button>
                  </span>
                </div>
                {chartMode === "radar" ? (
                  <Radar key={r.id} values={k.pillars} base={r.avg} />
                ) : (
                  <div className="bd" style={{ paddingTop: 14, paddingBottom: 20 }}>
                    <PillarBars values={k.pillars} base={r.avg} />
                  </div>
                )}
                <div className="legend">
                  <span>
                    <i />
                    This match
                  </span>
                  <span>
                    <i className="b" />
                    Season average
                  </span>
                </div>
              </div>
              <div className="card">
                <div className="ch">
                  <h2>Mentor notes</h2>
                  <span className="meta">{r.notes.length} moments tagged</span>
                </div>
                <div className="notes">
                  {r.notes.map((n) => (
                    <div key={n.min} className={`note ${n.tone}`}>
                      <span className="m">{n.min}′</span>
                      <div>
                        <span className="tg">
                          <i />
                          {PILLARS[n.pillar]}
                        </span>
                        <p>{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card r3">
              <div className="r3f">
                <h3>
                  Development focus <span>· next two weeks</span>
                </h3>
                <div className="focus">
                  {r.focus.map((f, i) => (
                    <div key={f} className="fi">
                      <span>0{i + 1}</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="trail">
                <div>
                  <span className="tdot ok" />
                  <span>
                    Submitted by <b>{r.mentor}</b> · {r.submitted}
                  </span>
                </div>
                <div>
                  <span className={`tdot ${isSigned ? "ok" : "wait"}`} />
                  <span>
                    {isSigned ? (
                      <>
                        Signed off by <b>{signed[r.id] ? "Dan Whitfield" : "Hannah Cole"}</b>
                        {signed[r.id] ? " · just now" : ""}
                      </>
                    ) : (
                      <>Waiting for a manager to sign off</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDuty = () => {
    const nGreen = KEEPERS.length - flagged.length;
    const rows = KEEPERS.filter((k) => dutyFilter === "all" || welfare[k.id] === dutyFilter).sort(
      (a, b) => {
        const o = { red: 0, amber: 1, green: 2 };
        return o[welfare[a.id]] - o[welfare[b.id]];
      },
    );
    return (
      <div className="page" key="duty">
        <div className="ph">
          <div>
            <h1>Duty of care</h1>
            <p>Fortnightly wellbeing check-ins, safeguarding and family contact for every keeper</p>
          </div>
          <div className="acts">
            <button
              type="button"
              className="btn gh"
              onClick={() => setToast("Safeguarding policy v4.2 opened")}
            >
              Policy
            </button>
            <button
              type="button"
              className="btn pri"
              onClick={() => setToast("Weekly duty-of-care summary sent to managers")}
            >
              Send summary
            </button>
          </div>
        </div>
        <div className="dsum">
          <div className="card">
            <span className="ring g">
              <Icon name="check" />
            </span>
            <span>
              <b>{nGreen}</b>
              <small>Clear</small>
            </span>
          </div>
          <div className="card">
            <span className="ring ca">
              <Icon name="clock" />
            </span>
            <span>
              <b>{nAmber}</b>
              <small>Monitor · check due</small>
            </span>
          </div>
          <div className="card">
            <span className="ring r">
              <Icon name="alert" />
            </span>
            <span>
              <b>{nRed}</b>
              <small>Action · overdue</small>
            </span>
          </div>
          <div className="card">
            <span className="ring t">
              <Icon name="interactions" />
            </span>
            <span>
              <b>{34 + Object.values(lastCheck).filter((v) => v === "Today").length}</b>
              <small>Check-ins in October</small>
            </span>
          </div>
        </div>
        <div className="tb">
          <div className="seg" role="group" aria-label="Filter by status">
            {(["all", "red", "amber", "green"] as const).map((f) => (
              <button
                type="button"
                key={f}
                aria-pressed={dutyFilter === f}
                onClick={() => setDutyFilter(f)}
              >
                {f !== "all" && (
                  <span className={`wd wd-${f}`}>
                    <i />
                  </span>
                )}
                {f === "all"
                  ? "All keepers"
                  : f === "red"
                    ? "Action"
                    : f === "amber"
                      ? "Monitor"
                      : "Clear"}
              </button>
            ))}
          </div>
          <div className="dlegend">
            <span>
              <i style={{ background: "var(--gr)" }} /> Complete
            </span>
            <span>
              <i style={{ background: "var(--am)" }} /> Due
            </span>
            <span>
              <i style={{ background: "var(--rd)" }} /> Overdue · click to resolve
            </span>
          </div>
        </div>
        <div className="card tbl">
          <div className="dr dhd">
            <span>Keeper</span>
            {CHECK_COLS.map((c) => (
              <span key={c}>{c}</span>
            ))}
            <span>Last check-in</span>
            <span />
          </div>
          {rows.map((k) => {
            const w = welfare[k.id];
            const lc = lastCheck[k.id];
            const ago = DAYS_AGO[lc] ?? 0;
            return (
              <div key={k.id} className={`dr drow ${w}`}>
                <span className="dk">
                  <Avatar initials={k.initials} hue={k.hue} size={30} />
                  <span style={{ minWidth: 0 }}>
                    <b>
                      {k.name}{" "}
                      <span className={`wd wd-${w}`} style={{ marginLeft: 4 }}>
                        <i />
                      </span>
                    </b>
                    {w !== "green" && k.note ? (
                      <small className="fl">{k.note}</small>
                    ) : (
                      <small>
                        {k.club} · {k.mentor}
                      </small>
                    )}
                  </span>
                </span>
                {checks[k.id].map((s, i) =>
                  s === "na" || s === "ok" ? (
                    <span
                      key={i}
                      className={`cell ${s}`}
                      title={`${CHECK_COLS[i]}: ${s === "ok" ? "complete" : "not applicable"}`}
                    >
                      {s === "ok" ? <Icon name="check" /> : "–"}
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={i}
                      className={`cell ${s}`}
                      aria-label={`Mark ${CHECK_COLS[i]} complete for ${k.name}`}
                      onClick={() => resolveCell(k.id, i)}
                    >
                      {s === "over" ? <span className="bang">!</span> : <Icon name="clock" />}
                    </button>
                  ),
                )}
                <span className={`lc ${ago > 12 ? "late" : ""} ${lc === "Today" ? "today" : ""}`}>
                  <b>{lc}</b>
                  <small>{lc === "Today" ? "just logged" : `${ago} days ago`}</small>
                </span>
                <span style={{ justifySelf: "end" }}>
                  {checks[k.id][0] !== "ok" ? (
                    <button type="button" className="btn pri sm" onClick={() => logCheck(k.id)}>
                      Log check-in
                    </button>
                  ) : (
                    <button type="button" className="btn gh sm" onClick={() => logCheck(k.id)}>
                      Log check-in
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const H0 = 8;
    const H1 = 21;
    const PX = 44;
    const hours = Array.from({ length: H1 - H0 + 1 }, (_, i) => H0 + i);
    return (
      <div className="page" key="cal">
        <div className="ph">
          <div>
            <h1>Calendar</h1>
            <p>Week 44 · 26 October – 1 November 2026 · 8 fixtures, 5 welfare touchpoints</p>
          </div>
          <div className="acts">
            <div className="seg" role="group" aria-label="Calendar range">
              <button
                type="button"
                aria-pressed="false"
                onClick={() => setToast("Day view is available in the full app")}
              >
                Day
              </button>
              <button type="button" aria-pressed="true">
                Week
              </button>
              <button
                type="button"
                aria-pressed="false"
                onClick={() => setToast("Month view is available in the full app")}
              >
                Month
              </button>
            </div>
            <button
              type="button"
              className="btn pri"
              onClick={() => setToast("New event: choose fixture, check-in or meeting")}
            >
              <Icon name="plus" size={15} /> New event
            </button>
          </div>
        </div>
        <div className="card cal">
          <div className="calh">
            <div />
            {WEEK.map((w, i) => (
              <div key={w.d} className={i === TODAY ? "td" : ""}>
                {w.d} <b>{w.n}</b>
              </div>
            ))}
          </div>
          <div className="hrs" style={{ height: (H1 - H0) * PX + 12 }}>
            {hours.map((h) => (
              <span key={h} className="hr" style={{ top: (h - H0) * PX + 6 }}>
                {String(h).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {WEEK.map((w, i) => (
            <div key={w.d} className={`calc ${i === TODAY ? "td" : ""}`}>
              {hours.map((h) => (
                <span key={h} className="hl" style={{ top: (h - H0) * PX + 6 }} />
              ))}
              {i === TODAY && <span className="now" style={{ top: (11.33 - H0) * PX + 6 }} />}
              {EVENTS.filter((e) => e.day === i).map((e, j) => (
                <div
                  key={j}
                  className={`ev ${e.kind}`}
                  style={{ top: (e.start - H0) * PX + 7, height: (e.end - e.start) * PX - 3 }}
                >
                  <b>{e.title}</b>
                  {e.sub && <small>{e.sub}</small>}
                  {e.lines?.map((l) => (
                    <small key={l}>{l}</small>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="page" key="users">
      <div className="ph">
        <div>
          <h1>Users</h1>
          <p>7 people · role-based access for mentors, managers and admins</p>
        </div>
        <div className="acts">
          <button
            type="button"
            className="btn gh"
            onClick={() => setToast("Audit log: 1,284 events this month")}
          >
            Audit log
          </button>
          <button type="button" className="btn pri" onClick={() => setToast("Invite sent")}>
            <Icon name="plus" size={15} /> Invite user
          </button>
        </div>
      </div>
      <div className="card tbl">
        <div className="ur thd">
          <span>Name</span>
          <span>Role</span>
          <span>Keepers</span>
          <span>Last active</span>
          <span>2FA</span>
          <span>Status</span>
          <span />
        </div>
        {USERS.map((u) => (
          <div key={u.name} className="ur urow">
            <span className="kc">
              <Avatar initials={u.initials} hue={u.hue} size={30} />
              <span>
                <b>{u.name}</b>
                <small>{u.title}</small>
              </span>
            </span>
            <span>
              <span className={`rp ${u.role}`}>{u.role}</span>
            </span>
            <span className="num mut">{u.keepers || "–"}</span>
            <span className="mut">{u.active}</span>
            <span className={`mfa ${u.mfa ? "yes" : "no"}`}>{u.mfa ? "On" : "Off"}</span>
            <span className={`ust ${u.status === "Invited" ? "inv" : ""}`}>{u.status}</span>
            <button
              type="button"
              className="ib"
              aria-label={`Manage ${u.name}`}
              onClick={() => setToast(`Permissions for ${u.name}`)}
            >
              <Icon name="chevron" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mk-mh">
      <style>{CSS}</style>
      <aside className="sb">
        <div className="brand">
          <Logo />
          <span>
            <b>Mentor Hub</b>
            <small>Goalkeeper mentoring</small>
          </span>
        </div>
        <div className="navlab">Workspace</div>
        <div className="mnav" role="navigation" aria-label="Main">
          {nav.map((n) => (
            <button
              type="button"
              key={n.v}
              className="ni"
              aria-current={view === n.v ? "page" : undefined}
              onClick={() => go(n.v)}
            >
              <Icon name={n.icon} />
              {TITLES[n.v]}
              {n.extra}
            </button>
          ))}
        </div>
        {role === "Admin" && (
          <>
            <div className="navlab">Admin</div>
            <div className="mnav">
              <button
                type="button"
                className="ni"
                aria-current={view === "users" ? "page" : undefined}
                onClick={() => go("users")}
              >
                <Icon name="users" />
                Users
                <span className="cnt">7</span>
              </button>
            </div>
          </>
        )}
        <div className="sbfoot">
          <div className="rolelab">
            <span>Viewing as</span>
            <span>{role === "Mentor" ? "4 keepers" : "All keepers"}</span>
          </div>
          <div className="roles" role="group" aria-label="Role">
            {(["Mentor", "Manager", "Admin"] as Role[]).map((r) => (
              <button type="button" key={r} aria-pressed={role === r} onClick={() => pickRole(r)}>
                {r}
              </button>
            ))}
          </div>
          <div className="me">
            <Avatar initials="DW" hue={168} size={32} />
            <span>
              <b>Dan Whitfield</b>
              <small>{meTitle}</small>
            </span>
            <span className="online" aria-hidden="true" />
          </div>
        </div>
      </aside>

      <section className="main">
        <header className="top">
          <div className="crumb">
            <span>Mentor team</span>
            <Icon name="chevron" />
            <b>{TITLES[view]}</b>
            {view === "reports" && (
              <>
                <Icon name="chevron" />
                <span>
                  {keeperById((REPORTS.find((r) => r.id === reportId) as Report).keeperId).name}
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            className="search"
            onClick={() => setToast("Search covers keepers, reports and notes in the full app")}
          >
            <Icon name="search" size={15} />
            Search keepers, reports, notes
            <span className="kbd">⌘K</span>
          </button>
          <button
            type="button"
            className="ib"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Icon name="bell" />
            <span className="pip" />
          </button>
          <button type="button" className="btn pri" onClick={() => openReport("r1")}>
            <Icon name="plus" size={15} /> New report
          </button>
          {notifOpen && (
            <div className="pop" role="dialog" aria-label="Notifications">
              <h3>
                Notifications <span>4 unread</span>
              </h3>
              {NOTIFS.map((n) => (
                <div key={n.t} className="pn">
                  <i className={n.c} />
                  <div>
                    <p>{n.t}</p>
                    <small>{n.s}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>
        <div className="content">
          {view === "dashboard" && renderDashboard()}
          {view === "roster" && renderRoster()}
          {view === "reports" && renderReports()}
          {view === "duty" && renderDuty()}
          {view === "calendar" && renderCalendar()}
          {view === "users" && renderUsers()}
        </div>
      </section>
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}
