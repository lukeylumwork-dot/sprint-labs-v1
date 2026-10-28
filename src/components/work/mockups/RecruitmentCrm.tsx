import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type View = "players" | "clubs" | "reports" | "tasks";
type Group = "ALL" | "DEF" | "MID" | "ATT";
type Status = "Tracking" | "Contacted" | "Meeting set" | "Signed";
type LogKind = "call" | "message" | "meeting" | "report" | "note";
type NoteKind = "Key moment" | "Chance" | "Defensive" | "Note";
type Relation = "Warm" | "Active" | "New";

interface LogEntry {
  d: string;
  kind: LogKind;
  title: string;
  text: string;
  by: string;
}

interface Player {
  id: string;
  name: string;
  ini: string;
  pos: string[];
  group: Exclude<Group, "ALL">;
  age: number;
  club: string;
  league: string;
  status: Status;
  foot: string;
  height: string;
  contract: string;
  grad: [string, string];
  rating: number;
  reports: number;
  seen: string;
  /** apps, mins, goals, assists, pass %, duels %, top speed */
  s: [number, number, number, number, number, number, number];
  next: { text: string; due: string };
  log: LogEntry[];
}

interface Contact {
  name: string;
  ini: string;
  role: string;
  last: string;
}

interface Club {
  id: string;
  name: string;
  short: string;
  league: string;
  ground: string;
  colors: [string, string];
  relation: Relation;
  last: string;
  contacts: Contact[];
  notes: string;
}

interface MatchNote {
  m: string;
  kind: NoteKind;
  text: string;
}

interface Task {
  id: string;
  text: string;
  link: string;
  due: string;
  who: string;
  group: "Today" | "This week";
  done: boolean;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const STATUSES: Status[] = ["Tracking", "Contacted", "Meeting set", "Signed"];

const PLAYERS: Player[] = [
  {
    id: "lb",
    name: "Luca Brennan",
    ini: "LB",
    pos: ["RW", "LW"],
    group: "ATT",
    age: 21,
    club: "Harbour Athletic",
    league: "League One",
    status: "Meeting set",
    foot: "Left",
    height: "1.78 m",
    contract: "Jun 2027",
    grad: ["#ff9f0a", "#ff375f"],
    rating: 4.1,
    reports: 6,
    seen: "2h",
    s: [14, 1162, 5, 6, 81, 54, 34.6],
    next: { text: "Meet agent and family at Harbour Park", due: "Thu 30 Oct · 18:30" },
    log: [
      {
        d: "27 Oct",
        kind: "call",
        title: "Call with agent",
        text: "Open to a January move if game time is guaranteed. Wants a clear development plan.",
        by: "Dan Mercer",
      },
      {
        d: "25 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Harbour Athletic 2–1 Kingsmoor Town · 4/5 · Shortlist",
        by: "Priya Shah",
      },
      {
        d: "18 Oct",
        kind: "message",
        title: "Intro message sent",
        text: "Shared club overview and a 6-minute highlights reel with the agent.",
        by: "Dan Mercer",
      },
      {
        d: "09 Oct",
        kind: "note",
        title: "Added to Summer 2027 window",
        text: "Flagged after 2 goals and an assist away at Redcliffe.",
        by: "Priya Shah",
      },
    ],
  },
  {
    id: "to",
    name: "Tom Okafor",
    ini: "TO",
    pos: ["CB"],
    group: "DEF",
    age: 23,
    club: "Kingsmoor Town",
    league: "League One",
    status: "Contacted",
    foot: "Right",
    height: "1.91 m",
    contract: "Jun 2027",
    grad: ["#0a84ff", "#5e5ce6"],
    rating: 3.8,
    reports: 4,
    seen: "5h",
    s: [15, 1350, 2, 0, 88, 71, 31.2],
    next: { text: "Follow up with Kingsmoor recruitment", due: "Fri 31 Oct" },
    log: [
      {
        d: "24 Oct",
        kind: "call",
        title: "Spoke to Sarah Whitlock",
        text: "Club would listen to offers in the summer. No release clause.",
        by: "Dan Mercer",
      },
      {
        d: "25 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Dominant in the air, 9 of 11 aerials won · 4/5",
        by: "Priya Shah",
      },
      {
        d: "11 Oct",
        kind: "note",
        title: "Data flag",
        text: "Top 5% for progressive passes among League One centre-backs.",
        by: "Alex Kerr",
      },
    ],
  },
  {
    id: "sh",
    name: "Sami Haddad",
    ini: "SH",
    pos: ["CM", "CDM"],
    group: "MID",
    age: 20,
    club: "Ashvale United",
    league: "U21 League",
    status: "Tracking",
    foot: "Right",
    height: "1.80 m",
    contract: "Jun 2028",
    grad: ["#30d158", "#0a84ff"],
    rating: 3.6,
    reports: 3,
    seen: "1d",
    s: [11, 904, 1, 3, 91, 62, 30.1],
    next: { text: "Live watch vs Northbridge U21", due: "Sat 1 Nov · 13:00" },
    log: [
      {
        d: "22 Oct",
        kind: "report",
        title: "Video report",
        text: "Calm under pressure, always half-turned. Needs more forward passes.",
        by: "Alex Kerr",
      },
      {
        d: "15 Oct",
        kind: "note",
        title: "Added to U21 targets",
        text: "Recommended by our academy contact at Ashvale.",
        by: "Dan Mercer",
      },
      {
        d: "02 Oct",
        kind: "message",
        title: "Fixture list requested",
        text: "Asked Hannah Royce for the U21 schedule to November.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "jw",
    name: "Jonah Whitfield",
    ini: "JW",
    pos: ["ST"],
    group: "ATT",
    age: 24,
    club: "Northbridge FC",
    league: "League Two",
    status: "Tracking",
    foot: "Right",
    height: "1.86 m",
    contract: "Jun 2027",
    grad: ["#bf5af2", "#ff375f"],
    rating: 3.4,
    reports: 2,
    seen: "2d",
    s: [16, 1288, 9, 2, 72, 49, 32.8],
    next: { text: "Second live watch at The Bridge Ground", due: "Tue 4 Nov · 19:45" },
    log: [
      {
        d: "21 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Two poacher's goals, little in build-up · 3/5 · Monitor",
        by: "Priya Shah",
      },
      {
        d: "14 Oct",
        kind: "note",
        title: "Scoring run",
        text: "7 goals in his last 6 league games. Worth a second look.",
        by: "Alex Kerr",
      },
      {
        d: "30 Sep",
        kind: "note",
        title: "Profile created",
        text: "Added from the League Two shortlist export.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "rm",
    name: "Rafael Moreno",
    ini: "RM",
    pos: ["LB", "LWB"],
    group: "DEF",
    age: 19,
    club: "Redcliffe Rovers",
    league: "National League",
    status: "Contacted",
    foot: "Left",
    height: "1.76 m",
    contract: "Jun 2027",
    grad: ["#ff9f0a", "#ffd60a"],
    rating: 3.7,
    reports: 3,
    seen: "3h",
    s: [13, 1102, 0, 4, 84, 58, 33.9],
    next: { text: "Send video package to parents", due: "Today · 17:00" },
    log: [
      {
        d: "26 Oct",
        kind: "call",
        title: "Call with parents",
        text: "Keen on a pathway club near home. Asked for clips of similar full-backs.",
        by: "Dan Mercer",
      },
      {
        d: "19 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Relentless overlaps, 4 chances created · 4/5",
        by: "Priya Shah",
      },
      {
        d: "07 Oct",
        kind: "message",
        title: "Club permission granted",
        text: "Redcliffe happy for us to speak to the family.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "kd",
    name: "Kieran Doyle",
    ini: "KD",
    pos: ["CAM", "CM"],
    group: "MID",
    age: 22,
    club: "Westmarsh City",
    league: "League One",
    status: "Meeting set",
    foot: "Right",
    height: "1.75 m",
    contract: "Jun 2027",
    grad: ["#64d2ff", "#0a84ff"],
    rating: 3.9,
    reports: 5,
    seen: "6h",
    s: [14, 1190, 4, 5, 86, 52, 31.5],
    next: { text: "Meeting with Westmarsh sporting director", due: "Mon 3 Nov · 11:00" },
    log: [
      {
        d: "26 Oct",
        kind: "meeting",
        title: "Meeting booked",
        text: "Alan Brook confirmed Monday at the training ground.",
        by: "Dan Mercer",
      },
      {
        d: "20 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Best player on the pitch. Finds pockets constantly · 4/5",
        by: "Priya Shah",
      },
      {
        d: "06 Oct",
        kind: "call",
        title: "Intro call",
        text: "Agent confirmed interest from two Championship clubs.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "ea",
    name: "Ethan Asante",
    ini: "EA",
    pos: ["RB"],
    group: "DEF",
    age: 20,
    club: "Port Calder",
    league: "League Two",
    status: "Signed",
    foot: "Right",
    height: "1.79 m",
    contract: "Jun 2029",
    grad: ["#34c759", "#30b0c7"],
    rating: 4.0,
    reports: 7,
    seen: "1d",
    s: [16, 1410, 1, 3, 85, 63, 35.1],
    next: { text: "Send medical paperwork to admin", due: "Wed 29 Oct" },
    log: [
      {
        d: "23 Oct",
        kind: "meeting",
        title: "Contract signed",
        text: "Three-year deal agreed. Joins the first-team squad in January.",
        by: "Dan Mercer",
      },
      {
        d: "16 Oct",
        kind: "meeting",
        title: "Visit to training ground",
        text: "Met the head coach and toured the facilities with family.",
        by: "Dan Mercer",
      },
      {
        d: "02 Oct",
        kind: "report",
        title: "Final match report",
        text: "Recommend. Elite recovery pace · 4/5",
        by: "Priya Shah",
      },
    ],
  },
  {
    id: "mv",
    name: "Marcus Vale",
    ini: "MV",
    pos: ["CDM"],
    group: "MID",
    age: 26,
    club: "Brackenridge FC",
    league: "League One",
    status: "Tracking",
    foot: "Right",
    height: "1.84 m",
    contract: "Jun 2027",
    grad: ["#8e8e93", "#48484a"],
    rating: 3.3,
    reports: 2,
    seen: "4d",
    s: [15, 1325, 0, 1, 89, 66, 29.4],
    next: { text: "Check availability with agent", due: "Fri 7 Nov" },
    log: [
      {
        d: "18 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Screens well, limited range of passing · 3/5 · Monitor",
        by: "Alex Kerr",
      },
      {
        d: "03 Oct",
        kind: "note",
        title: "Experience option",
        text: "Possible free in 2027 if not extended.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "op",
    name: "Owen Pryce",
    ini: "OP",
    pos: ["CB"],
    group: "DEF",
    age: 18,
    club: "Elmstead Wanderers",
    league: "U18 League",
    status: "Tracking",
    foot: "Left",
    height: "1.88 m",
    contract: "Scholar",
    grad: ["#5e5ce6", "#bf5af2"],
    rating: 3.5,
    reports: 2,
    seen: "3d",
    s: [10, 860, 1, 0, 87, 68, 30.6],
    next: { text: "Request access to watch training", due: "Thu 6 Nov" },
    log: [
      {
        d: "20 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Left-footed, brave, reads danger early · 3/5",
        by: "Alex Kerr",
      },
      {
        d: "12 Oct",
        kind: "message",
        title: "Messaged Kate Lennox",
        text: "Asked about his scholarship terms and next steps.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "dk",
    name: "Dario Kelleher",
    ini: "DK",
    pos: ["ST"],
    group: "ATT",
    age: 21,
    club: "Ashvale United",
    league: "Championship",
    status: "Contacted",
    foot: "Left",
    height: "1.83 m",
    contract: "Jun 2028",
    grad: ["#ff453a", "#ff9f0a"],
    rating: 3.7,
    reports: 4,
    seen: "8h",
    s: [12, 712, 4, 1, 74, 47, 33.2],
    next: { text: "Loan enquiry call with Ashvale", due: "Fri 31 Oct · 10:00" },
    log: [
      {
        d: "27 Oct",
        kind: "message",
        title: "Loan enquiry",
        text: "Pete Morrow open to a January loan with a minutes clause.",
        by: "Dan Mercer",
      },
      {
        d: "17 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Sharp off the bench, runs in behind well · 4/5",
        by: "Priya Shah",
      },
    ],
  },
  {
    id: "cr",
    name: "Callum Reyes",
    ini: "CR",
    pos: ["LW", "RW"],
    group: "ATT",
    age: 19,
    club: "Northbridge FC",
    league: "League Two",
    status: "Tracking",
    foot: "Right",
    height: "1.72 m",
    contract: "Jun 2027",
    grad: ["#0a84ff", "#64d2ff"],
    rating: 3.5,
    reports: 2,
    seen: "5d",
    s: [9, 541, 2, 2, 79, 51, 35.6],
    next: { text: "Watch U21 fixture vs Port Calder", due: "Wed 5 Nov · 14:00" },
    log: [
      {
        d: "16 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Electric in 1v1s, decision-making still raw · 3/5",
        by: "Alex Kerr",
      },
      {
        d: "05 Oct",
        kind: "note",
        title: "Tip from Ian Calloway",
        text: "Expected to break into the first team this season.",
        by: "Dan Mercer",
      },
    ],
  },
  {
    id: "tl",
    name: "Theo Lindqvist",
    ini: "TL",
    pos: ["CM"],
    group: "MID",
    age: 25,
    club: "Harbour Athletic",
    league: "League One",
    status: "Meeting set",
    foot: "Right",
    height: "1.82 m",
    contract: "Jun 2027",
    grad: ["#ffd60a", "#ff9f0a"],
    rating: 3.6,
    reports: 3,
    seen: "1d",
    s: [15, 1298, 2, 4, 90, 57, 30.8],
    next: { text: "Lunch with agent in town", due: "Tue 4 Nov · 12:30" },
    log: [
      {
        d: "25 Oct",
        kind: "report",
        title: "Match report filed",
        text: "Tidy, controls tempo, 94% passing · 3/5",
        by: "Priya Shah",
      },
      {
        d: "21 Oct",
        kind: "call",
        title: "Call with agent",
        text: "Would consider a move up a division. Lunch arranged.",
        by: "Dan Mercer",
      },
    ],
  },
];

const SHORTLISTS: { id: string; name: string; color: string; ids: string[] }[] = [
  { id: "s27", name: "Summer 2027 window", color: "#0a66ff", ids: ["lb", "to", "kd", "tl"] },
  { id: "u21", name: "U21 targets", color: "#34c759", ids: ["sh", "rm", "op", "cr"] },
  { id: "loan", name: "Loan options", color: "#ff9500", ids: ["dk", "cr", "sh"] },
];

const CLUBS: Club[] = [
  {
    id: "ha",
    name: "Harbour Athletic",
    short: "HA",
    league: "League One",
    ground: "Harbour Park",
    colors: ["#0a3d91", "#ffd60a"],
    relation: "Warm",
    last: "Yesterday",
    contacts: [
      { name: "Mark Ellison", ini: "ME", role: "Head of Recruitment", last: "Yesterday" },
      { name: "Jo Fairbairn", ini: "JF", role: "Sporting Director", last: "21 Oct" },
      { name: "Liam Prosser", ini: "LP", role: "Loans Manager", last: "2 Oct" },
    ],
    notes:
      "Will sell for the right fee but want a sell-on clause. Mark prefers WhatsApp before 10am on matchdays.",
  },
  {
    id: "kt",
    name: "Kingsmoor Town",
    short: "KT",
    league: "League One",
    ground: "Moor Lane",
    colors: ["#c8102e", "#ffffff"],
    relation: "Active",
    last: "24 Oct",
    contacts: [
      { name: "Sarah Whitlock", ini: "SW", role: "Chief Scout", last: "24 Oct" },
      { name: "Ben Adeyemi", ini: "BA", role: "Head of Football Ops", last: "16 Oct" },
    ],
    notes: "Listening to offers for Okafor in the summer. No release clause in his contract.",
  },
  {
    id: "au",
    name: "Ashvale United",
    short: "AU",
    league: "Championship",
    ground: "Vale Road",
    colors: ["#1d1d1f", "#ff9f0a"],
    relation: "Active",
    last: "27 Oct",
    contacts: [
      { name: "Chris Danvers", ini: "CD", role: "Technical Director", last: "20 Oct" },
      { name: "Hannah Royce", ini: "HR", role: "Academy Manager", last: "12 Oct" },
      { name: "Pete Morrow", ini: "PM", role: "Loans Manager", last: "27 Oct" },
    ],
    notes:
      "Loan-friendly. Expect a minutes clause and a recall option in January for any first-team player.",
  },
  {
    id: "nb",
    name: "Northbridge FC",
    short: "NB",
    league: "League Two",
    ground: "The Bridge Ground",
    colors: ["#0a2540", "#64d2ff"],
    relation: "Warm",
    last: "22 Oct",
    contacts: [
      { name: "Ian Calloway", ini: "IC", role: "Head of Recruitment", last: "22 Oct" },
      { name: "Megan Ruiz", ini: "MR", role: "Performance Analyst", last: "8 Oct" },
    ],
    notes: "Ian shares match footage within 24 hours. Good relationship, worth keeping warm.",
  },
  {
    id: "wc",
    name: "Westmarsh City",
    short: "WC",
    league: "League One",
    ground: "Marsh Park",
    colors: ["#5e5ce6", "#ffffff"],
    relation: "Active",
    last: "26 Oct",
    contacts: [
      { name: "Alan Brook", ini: "AB", role: "Sporting Director", last: "26 Oct" },
      { name: "Rhys Talbot", ini: "RT", role: "Chief Scout", last: "13 Oct" },
    ],
    notes: "Meeting on Monday 3 Nov about Doyle. Bring the comparison pack and wage benchmarks.",
  },
  {
    id: "pc",
    name: "Port Calder",
    short: "PC",
    league: "League Two",
    ground: "Dockside Stadium",
    colors: ["#0a3d2e", "#34c759"],
    relation: "Warm",
    last: "Today",
    contacts: [
      { name: "Rob Kinnear", ini: "RK", role: "Chief Executive", last: "23 Oct" },
      { name: "Sian Hale", ini: "SH", role: "Football Administrator", last: "Today" },
    ],
    notes: "Asante deal complete. Sian handling registration and medical paperwork.",
  },
  {
    id: "rr",
    name: "Redcliffe Rovers",
    short: "RR",
    league: "National League",
    ground: "Cliffside",
    colors: ["#ff453a", "#1d1d1f"],
    relation: "New",
    last: "14 Oct",
    contacts: [{ name: "Nadia Firth", ini: "NF", role: "Club Secretary", last: "14 Oct" }],
    notes: "First contact this season. Permission given to speak to Moreno's family.",
  },
  {
    id: "bf",
    name: "Brackenridge FC",
    short: "BF",
    league: "League One",
    ground: "Ridge Park",
    colors: ["#7a4b22", "#ffd60a"],
    relation: "New",
    last: "3 Oct",
    contacts: [{ name: "Gavin Shore", ini: "GS", role: "Head of Recruitment", last: "3 Oct" }],
    notes: "No formal relationship yet. Introduced at the regional scouting forum.",
  },
  {
    id: "ew",
    name: "Elmstead Wanderers",
    short: "EW",
    league: "National League South",
    ground: "Elm Park",
    colors: ["#0a84ff", "#ff9f0a"],
    relation: "New",
    last: "12 Oct",
    contacts: [{ name: "Kate Lennox", ini: "KL", role: "Academy Manager", last: "12 Oct" }],
    notes: "Small academy, very open. Training visits on Tuesday and Thursday evenings.",
  },
];

const TAGS = [
  "Pace",
  "Press resistance",
  "Aerial",
  "1v1 attacking",
  "Work rate",
  "Weak foot",
  "Crossing",
  "Scanning",
  "Final third",
  "Leadership",
];

const RATING_ROWS = [
  { key: "tech", label: "Technical", hint: "First touch, passing, finishing" },
  { key: "tact", label: "Tactical", hint: "Positioning, decisions, pressing" },
  { key: "phys", label: "Physical", hint: "Pace, strength, repeat sprints" },
  { key: "ment", label: "Mental", hint: "Bravery, reaction to mistakes" },
  { key: "pot", label: "Potential", hint: "Ceiling in two to three years" },
];

const INITIAL_RATINGS: Record<string, number> = { tech: 4, tact: 3, phys: 4, ment: 4, pot: 5 };
const INITIAL_TAGS = ["Pace", "1v1 attacking", "Crossing"];

const INITIAL_NOTES: MatchNote[] = [
  { m: "7'", kind: "Chance", text: "Drove inside from the right, shot blocked. Wants it early." },
  {
    m: "12'",
    kind: "Key moment",
    text: "Beat the LB on the outside, cross to back post. Assist, 1–0.",
  },
  {
    m: "27'",
    kind: "Defensive",
    text: "Lost it under a two-man press, won it back within 4 seconds.",
  },
  { m: "44'", kind: "Note", text: "Drifts central when the ball is on the far side. Scans well." },
  {
    m: "63'",
    kind: "Key moment",
    text: "Disguised pass through the lines for 2–0. Second assist.",
  },
  {
    m: "71'",
    kind: "Defensive",
    text: "Tracked the runner 40 yards and won it on the edge of the box.",
  },
];

const NOTE_KINDS: NoteKind[] = ["Key moment", "Chance", "Defensive", "Note"];
const ADD_MINUTES = ["78'", "83'", "88'", "90+2'"];
const ADD_TEXT: Record<NoteKind, string> = {
  "Key moment": "Won a free kick on the edge of the box after a quick one-two.",
  Chance: "Cut inside onto his left foot, curled effort just wide.",
  Defensive: "Blocked a cross in his own half to help see the game out.",
  Note: "Still sprinting late on. Pressed the keeper twice in stoppage time.",
};

const REPORT_PLAYERS = ["lb", "tl", "to"];

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    text: "Send video package to Rafael Moreno's parents",
    link: "Rafael Moreno",
    due: "17:00",
    who: "DM",
    group: "Today",
    done: false,
  },
  {
    id: "t2",
    text: "Confirm Thursday venue with Luca Brennan's agent",
    link: "Luca Brennan",
    due: "15:30",
    who: "DM",
    group: "Today",
    done: false,
  },
  {
    id: "t3",
    text: "Upload clips from Harbour Athletic vs Kingsmoor Town",
    link: "Match report",
    due: "12:00",
    who: "PS",
    group: "Today",
    done: true,
  },
  {
    id: "t4",
    text: "Medical paperwork for Ethan Asante",
    link: "Port Calder",
    due: "Wed 29 Oct",
    who: "DM",
    group: "This week",
    done: false,
  },
  {
    id: "t5",
    text: "Loan enquiry call with Pete Morrow about Dario Kelleher",
    link: "Ashvale United",
    due: "Fri 31 Oct",
    who: "DM",
    group: "This week",
    done: false,
  },
  {
    id: "t6",
    text: "Follow up with Sarah Whitlock on Tom Okafor",
    link: "Kingsmoor Town",
    due: "Fri 31 Oct",
    who: "AK",
    group: "This week",
    done: false,
  },
  {
    id: "t7",
    text: "Live watch: Sami Haddad vs Northbridge U21",
    link: "Sami Haddad",
    due: "Sat 1 Nov",
    who: "PS",
    group: "This week",
    done: false,
  },
  {
    id: "t8",
    text: "Shortlist review with head of recruitment",
    link: "Summer 2027 window",
    due: "Mon 3 Nov",
    who: "DM",
    group: "This week",
    done: false,
  },
];

const UPCOMING = [
  { dow: "Sat", day: "1", fx: "v Northbridge U21 (H)", time: "13:00", who: "Sami Haddad" },
  {
    dow: "Tue",
    day: "4",
    fx: "v Port Calder (H)",
    time: "19:45",
    who: "Jonah Whitfield",
  },
  {
    dow: "Wed",
    day: "5",
    fx: "v Port Calder U21 (A)",
    time: "14:00",
    who: "Callum Reyes",
  },
];

const TEAM: Record<string, [string, string]> = {
  DM: ["#0a66ff", "#5e5ce6"],
  PS: ["#ff375f", "#ff9f0a"],
  AK: ["#30b0c7", "#34c759"],
};

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, ReactNode> = {
  players: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .6 3.2 2.4 3.5 5.2" />
    </>
  ),
  clubs: <path d="M12 3l7 2.5v5.8c0 4.4-3 8-7 9.7-4-1.7-7-5.3-7-9.7V5.5L12 3z" />,
  reports: (
    <>
      <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5M9.5 13h6M9.5 17h4" />
    </>
  ),
  tasks: (
    <path d="M4 6.5l1.6 1.6L8.5 5M4 12.5l1.6 1.6 2.9-3.1M4 18.5l1.6 1.6 2.9-3.1M11.5 7h8.5M11.5 13h8.5M11.5 19h8.5" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  phone: (
    <path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
  ),
  message: <path d="M4 5.5h16v10.5H9l-5 4V5.5z" />,
  back: <path d="M15 5l-7 7 7 7" />,
  chev: <path d="M9 5l7 7-7 7" />,
  cloud: (
    <>
      <path d="M7 18.5h10.5a4 4 0 0 0 .6-8 6 6 0 0 0-11.6-1.4A4.6 4.6 0 0 0 7 18.5z" />
      <path d="M9.5 13.5l2 2 3.5-3.6" />
    </>
  ),
  cloudOff: (
    <>
      <path d="M7 18.5h10.5a4 4 0 0 0 .6-8 6 6 0 0 0-11.6-1.4A4.6 4.6 0 0 0 7 18.5z" />
      <path d="M12 11v3.2M12 16.6v.1" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8.5 3v4M15.5 3v4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  star: <path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  pitch: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 5v14" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </>
  ),
  note: <path d="M4 20h4L19 9l-4-4L4 16v4z" />,
  swap: <path d="M7 4L4 7l3 3M4 7h13M17 20l3-3-3-3M20 17H7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  filter: <path d="M4 7h16M7 12h10M10 17h4" />,
  more: (
    <>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" />
    </>
  ),
};

function Icon({ name, size = 20, sw = 1.8 }: { name: string; size?: number; sw?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

function Avatar({ ini, grad, size = 40 }: { ini: string; grad: [string, string]; size?: number }) {
  return (
    <span
      className="av"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: `linear-gradient(140deg, ${grad[0]}, ${grad[1]})`,
      }}
      aria-hidden="true"
    >
      {ini}
    </span>
  );
}

function Crest({ club, size = 34 }: { club: Club; size?: number }) {
  const [a, b] = club.colors;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" aria-hidden="true">
      <path d="M20 2L37 7v14c0 11-7 19-17 23C10 40 3 32 3 21V7z" fill={a} />
      <path
        d="M20 6.2L33.4 10v11c0 8.6-5.4 15-13.4 18.4C12 36 6.6 29.6 6.6 21V10z"
        fill="none"
        stroke={b}
        strokeWidth="1.4"
        opacity="0.9"
      />
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11.5"
        fontWeight="800"
        fill={b}
      >
        {club.short}
      </text>
    </svg>
  );
}

function StatusPill({ s }: { s: Status }) {
  const cls = s === "Meeting set" ? "meet" : s.toLowerCase();
  return <span className={`stp st-${cls}`}>{s}</span>;
}

function PosChip({ p, g }: { p: string; g: string }) {
  return <span className={`pos pos-${g.toLowerCase()}`}>{p}</span>;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function RecruitmentCrmMockup() {
  const [view, setView] = useState<View>("players");
  const [online, setOnline] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Players
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("ALL");
  const [shortlist, setShortlist] = useState<string | null>(null);
  const [selected, setSelected] = useState("lb");
  const [statusOverride, setStatusOverride] = useState<Record<string, Status>>({});
  const [starred, setStarred] = useState<Record<string, boolean>>({ lb: true, kd: true });
  const [doneNext, setDoneNext] = useState<Record<string, boolean>>({});

  // Clubs
  const [clubQuery, setClubQuery] = useState("");
  const [relation, setRelation] = useState<"All" | Relation>("All");
  const [clubSel, setClubSel] = useState("ha");
  const [contactedNow, setContactedNow] = useState<Record<string, string>>({});

  // Report
  const [ratings, setRatings] = useState<Record<string, number>>(INITIAL_RATINGS);
  const [tags, setTags] = useState<string[]>(INITIAL_TAGS);
  const [notes, setNotes] = useState<MatchNote[]>(INITIAL_NOTES);
  const [verdict, setVerdict] = useState("Shortlist");
  const [reportPlayer, setReportPlayer] = useState(0);
  const [filed, setFiled] = useState(false);
  const [filedCount, setFiledCount] = useState(9);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const statusOf = (p: Player) => statusOverride[p.id] ?? p.status;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = shortlist ? (SHORTLISTS.find((s) => s.id === shortlist)?.ids ?? []) : null;
    return PLAYERS.filter(
      (p) =>
        (group === "ALL" || p.group === group) &&
        (!list || list.includes(p.id)) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.club.toLowerCase().includes(q) ||
          p.pos.some((x) => x.toLowerCase() === q)),
    );
  }, [query, group, shortlist]);

  const player = PLAYERS.find((p) => p.id === selected) ?? PLAYERS[0];

  const clubs = useMemo(() => {
    const q = clubQuery.trim().toLowerCase();
    return CLUBS.filter(
      (c) =>
        (relation === "All" || c.relation === relation) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.contacts.some((x) => x.name.toLowerCase().includes(q))),
    );
  }, [clubQuery, relation]);
  const club = CLUBS.find((c) => c.id === clubSel) ?? CLUBS[0];

  const tasksLeft = tasks.filter((t) => !t.done).length;
  const rp = PLAYERS.find((p) => p.id === REPORT_PLAYERS[reportPlayer]) ?? PLAYERS[0];
  const avg = RATING_ROWS.reduce((n, r) => n + ratings[r.key], 0) / RATING_ROWS.length;

  const openPlayer = (id: string) => {
    setView("players");
    setShortlist(null);
    setGroup("ALL");
    setQuery("");
    setSelected(id);
  };

  const cycleStatus = (p: Player) => {
    const i = STATUSES.indexOf(statusOf(p));
    setStatusOverride({ ...statusOverride, [p.id]: STATUSES[(i + 1) % STATUSES.length] });
  };

  const contact = (c: Contact, how: "call" | "message") => {
    setContactedNow({
      ...contactedNow,
      [c.name]: how === "call" ? "Called just now" : "Messaged just now",
    });
    setToast(how === "call" ? `Calling ${c.name}…` : `New message to ${c.name}`);
  };

  const resetReport = () => {
    setRatings(INITIAL_RATINGS);
    setTags(INITIAL_TAGS);
    setNotes(INITIAL_NOTES);
    setVerdict("Shortlist");
    setFiled(false);
  };

  const NAV: { id: View; label: string; icon: string; count: number }[] = [
    { id: "players", label: "Players", icon: "players", count: PLAYERS.length },
    { id: "clubs", label: "Clubs & contacts", icon: "clubs", count: CLUBS.length },
    { id: "reports", label: "Match reports", icon: "reports", count: filedCount },
    { id: "tasks", label: "Tasks", icon: "tasks", count: tasksLeft },
  ];

  /* ---------------- Sidebar ---------------- */
  const sidebar = (
    <aside className="side">
      <div className="brand">
        <span className="logo" aria-hidden="true">
          <Icon name="pitch" size={18} sw={2} />
        </span>
        <div>
          <div className="brand-n">Recruitment CRM</div>
          <div className="brand-s">Outfield · 2026/27</div>
        </div>
      </div>
      <button
        type="button"
        className="new-rep"
        onClick={() => {
          setView("reports");
          if (filed) resetReport();
        }}
      >
        <Icon name="plus" size={18} sw={2.2} />
        New match report
      </button>
      <nav className="navl" aria-label="Sections">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`nav-i${view === n.id ? " on" : ""}`}
            aria-current={view === n.id ? "page" : undefined}
            onClick={() => setView(n.id)}
          >
            <Icon name={n.icon} size={20} />
            <span className="nav-l">{n.label}</span>
            <span className="nav-c">{n.count}</span>
          </button>
        ))}
      </nav>
      <div className="side-h">Shortlists</div>
      <div className="navl">
        {SHORTLISTS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`nav-i sl${view === "players" && shortlist === s.id ? " on-soft" : ""}`}
            aria-pressed={view === "players" && shortlist === s.id}
            onClick={() => {
              setView("players");
              setGroup("ALL");
              setQuery("");
              setShortlist(s.id);
              setSelected(s.ids[0]);
            }}
          >
            <span className="sldot" style={{ background: s.color }} />
            <span className="nav-l">{s.name}</span>
            <span className="nav-c">{s.ids.length}</span>
          </button>
        ))}
      </div>
      <div className="side-h">Upcoming watches</div>
      <ul className="up">
        {UPCOMING.map((u) => (
          <li key={u.fx}>
            <span className="up-d">
              <span>{u.dow}</span>
              <b>{u.day}</b>
            </span>
            <span className="up-m">
              <b>{u.who}</b>
              <span>
                {u.time} · {u.fx}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="side-foot">
        <button
          type="button"
          className={`sync${online ? "" : " off"}`}
          aria-pressed={!online}
          aria-label="Toggle offline mode"
          onClick={() => setOnline(!online)}
        >
          <span className="sync-i">
            <Icon name={online ? "cloud" : "cloudOff"} size={20} />
          </span>
          <span className="sync-t">
            <b>{online ? "Offline ready" : "Working offline"}</b>
            <span>{online ? "All synced · 9:38" : "2 changes queued"}</span>
          </span>
          <span className={`sw${online ? "" : " sw-off"}`} aria-hidden="true">
            <i />
          </span>
        </button>
        <div className="me">
          <Avatar ini="DM" grad={TEAM.DM} size={32} />
          <div>
            <b>Dan Mercer</b>
            <span>Lead scout · North</span>
          </div>
        </div>
      </div>
    </aside>
  );

  /* ---------------- Players ---------------- */
  const sl = SHORTLISTS.find((s) => s.id === shortlist);
  const pStatus = statusOf(player);
  const isDone = !!doneNext[player.id];
  const log: LogEntry[] = isDone
    ? [
        {
          d: "Today",
          kind: "note",
          title: "Action completed",
          text: player.next.text,
          by: "Dan Mercer",
        },
        ...player.log,
      ]
    : player.log;

  const playersView = (
    <>
      <section className="col list">
        <div className="col-top">
          <div className="tb">
            <span className="tb-sync">
              <span className={`led${online ? "" : " led-off"}`} />
              {online ? "Synced" : "Offline"}
            </span>
            <div className="tb-r">
              <button type="button" className="ib" aria-label="Sort and filter">
                <Icon name="filter" />
              </button>
              <button type="button" className="ib" aria-label="Add player">
                <Icon name="plus" />
              </button>
            </div>
          </div>
          <h2 className="lt">{sl ? sl.name : "Players"}</h2>
          <label className="search">
            <Icon name="search" size={17} />
            <input
              type="text"
              value={query}
              placeholder="Search name, club or position"
              aria-label="Search players"
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="clr"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <Icon name="x" size={12} sw={2.6} />
              </button>
            )}
          </label>
          <div className="seg" role="group" aria-label="Position group">
            {(["ALL", "DEF", "MID", "ATT"] as Group[]).map((g) => (
              <button
                key={g}
                type="button"
                className={group === g ? "on" : ""}
                aria-pressed={group === g}
                onClick={() => setGroup(g)}
              >
                {g === "ALL"
                  ? "All"
                  : g === "DEF"
                    ? "Defence"
                    : g === "MID"
                      ? "Midfield"
                      : "Attack"}
              </button>
            ))}
          </div>
          <div className="meta-row">
            <span>
              {filtered.length} {filtered.length === 1 ? "player" : "players"}
              {sl ? " in shortlist" : " · last activity"}
            </span>
            {sl && (
              <button type="button" className="link" onClick={() => setShortlist(null)}>
                Show all
              </button>
            )}
          </div>
        </div>
        <div className="rows">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`row${p.id === selected ? " sel" : ""}`}
              aria-current={p.id === selected ? "true" : undefined}
              onClick={() => setSelected(p.id)}
            >
              <Avatar ini={p.ini} grad={p.grad} size={42} />
              <span className="row-m">
                <span className="row-t">
                  <b>{p.name}</b>
                  {starred[p.id] && (
                    <span className="star-s">
                      <Icon name="star" size={12} sw={0} />
                    </span>
                  )}
                </span>
                <span className="row-s">
                  {p.pos.map((x) => (
                    <PosChip key={x} p={x} g={p.group} />
                  ))}
                  <span className="row-c">
                    {p.age} · {p.club}
                  </span>
                </span>
              </span>
              <span className="row-r">
                <StatusPill s={statusOf(p)} />
                <span className="ago">{p.seen}</span>
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="empty">
              <Icon name="search" size={28} />
              <b>No players found</b>
              <span>Try another name, club or position.</span>
            </div>
          )}
        </div>
      </section>

      <section className="col detail">
        <div className="tb tb-d">
          <span className="crumb">
            {player.club} · {player.league}
          </span>
          <div className="tb-r">
            <button
              type="button"
              className={`ib${starred[player.id] ? " ib-on" : ""}`}
              aria-label="Star player"
              aria-pressed={!!starred[player.id]}
              onClick={() => setStarred({ ...starred, [player.id]: !starred[player.id] })}
            >
              <Icon name="star" />
            </button>
            <button
              type="button"
              className="ib"
              aria-label="Message agent"
              onClick={() => setToast(`New message to ${player.name}'s agent`)}
            >
              <Icon name="message" />
            </button>
            <button
              type="button"
              className="ib"
              aria-label="Call agent"
              onClick={() => setToast(`Calling ${player.name}'s agent…`)}
            >
              <Icon name="phone" />
            </button>
          </div>
        </div>
        <div className="d-scroll">
          <div className="card phero" key={player.id}>
            <div className="phero-top">
              <Avatar ini={player.ini} grad={player.grad} size={64} />
              <div className="phero-m">
                <h3>{player.name}</h3>
                <div className="phero-s">
                  {player.pos.map((x) => (
                    <PosChip key={x} p={x} g={player.group} />
                  ))}
                  <span>
                    {player.age} yrs · {player.club}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="st-btn"
                onClick={() => cycleStatus(player)}
                aria-label={`Status: ${pStatus}. Tap to change`}
              >
                <StatusPill s={pStatus} />
                <span className="st-steps" aria-hidden="true">
                  {STATUSES.map((s, i) => (
                    <i key={s} className={i <= STATUSES.indexOf(pStatus) ? "on" : ""} />
                  ))}
                </span>
              </button>
            </div>
            <div className="facts">
              <div>
                <span>Foot</span>
                <b>{player.foot}</b>
              </div>
              <div>
                <span>Height</span>
                <b>{player.height}</b>
              </div>
              <div>
                <span>Contract</span>
                <b>{player.contract}</b>
              </div>
              <div>
                <span>Scout avg</span>
                <b>
                  {player.rating.toFixed(1)}
                  <em> / 5 · {player.reports} reports</em>
                </b>
              </div>
            </div>
          </div>

          <div className={`card next${isDone ? " next-done" : ""}`}>
            <span className="next-i">
              <Icon name={isDone ? "check" : "calendar"} size={20} sw={2} />
            </span>
            <div className="next-m">
              <span className="next-l">{isDone ? "Done · added to log" : "Next action"}</span>
              <b>{player.next.text}</b>
              <span className="next-d">{player.next.due}</span>
            </div>
            <button
              type="button"
              className={`btn${isDone ? " btn-ghost" : ""}`}
              onClick={() => setDoneNext({ ...doneNext, [player.id]: !isDone })}
            >
              {isDone ? "Undo" : "Mark done"}
            </button>
          </div>

          <div className="card">
            <div className="card-h">
              <h4>Key stats</h4>
              <span>2026/27 · {player.league}</span>
            </div>
            <div className="stats">
              {(
                [
                  ["Apps", player.s[0]],
                  ["Minutes", player.s[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")],
                  ["Goals", player.s[2]],
                  ["Assists", player.s[3]],
                  ["Pass acc.", `${player.s[4]}%`],
                  ["Duels won", `${player.s[5]}%`],
                  ["Top speed", player.s[6].toFixed(1)],
                  ["Per 90 G+A", (((player.s[2] + player.s[3]) / player.s[1]) * 90).toFixed(2)],
                ] as [string, string | number][]
              ).map(([l, v], i) => (
                <div key={l} className="stat">
                  <b>
                    {v}
                    {i === 6 && <em> km/h</em>}
                  </b>
                  <span>{l}</span>
                  {(i === 4 || i === 5) && (
                    <span className="bar">
                      <i style={{ width: `${v.toString().replace("%", "")}%` }} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h4>Contact log</h4>
              <span>{log.length} entries</span>
            </div>
            <ol className="clog">
              {log.map((e, i) => (
                <li key={`${e.d}-${i}`} className={`tl-${e.kind}`}>
                  <span className="tl-i">
                    <Icon
                      name={
                        e.kind === "call"
                          ? "phone"
                          : e.kind === "message"
                            ? "message"
                            : e.kind === "meeting"
                              ? "calendar"
                              : e.kind === "report"
                                ? "reports"
                                : "note"
                      }
                      size={14}
                      sw={2}
                    />
                  </span>
                  <div className="tl-m">
                    <div className="tl-t">
                      <b>{e.title}</b>
                      <span>{e.d}</span>
                    </div>
                    <p>{e.text}</p>
                    <span className="tl-by">{e.by}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );

  /* ---------------- Clubs ---------------- */
  const clubPlayers = PLAYERS.filter((p) => p.club === club.name);
  const clubsView = (
    <>
      <section className="col list">
        <div className="col-top">
          <div className="tb">
            <span className="tb-sync">
              <span className={`led${online ? "" : " led-off"}`} />
              {online ? "Shared with team" : "Offline"}
            </span>
            <div className="tb-r">
              <button type="button" className="ib" aria-label="Add club">
                <Icon name="plus" />
              </button>
            </div>
          </div>
          <h2 className="lt">Clubs &amp; contacts</h2>
          <label className="search">
            <Icon name="search" size={17} />
            <input
              type="text"
              value={clubQuery}
              placeholder="Search clubs or people"
              aria-label="Search clubs and contacts"
              onChange={(e) => setClubQuery(e.target.value)}
            />
            {clubQuery && (
              <button
                type="button"
                className="clr"
                aria-label="Clear search"
                onClick={() => setClubQuery("")}
              >
                <Icon name="x" size={12} sw={2.6} />
              </button>
            )}
          </label>
          <div className="seg" role="group" aria-label="Relationship">
            {(["All", "Warm", "Active", "New"] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={relation === r ? "on" : ""}
                aria-pressed={relation === r}
                onClick={() => setRelation(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="meta-row">
            <span>
              {clubs.length} clubs · {clubs.reduce((n, c) => n + c.contacts.length, 0)} contacts
            </span>
          </div>
        </div>
        <div className="rows">
          {clubs.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`row${c.id === clubSel ? " sel" : ""}`}
              aria-current={c.id === clubSel ? "true" : undefined}
              onClick={() => setClubSel(c.id)}
            >
              <span className="crest-w">
                <Crest club={c} size={32} />
              </span>
              <span className="row-m">
                <span className="row-t">
                  <b>{c.name}</b>
                </span>
                <span className="row-s">
                  <span className="row-c">
                    {c.league} · {c.contacts.length}{" "}
                    {c.contacts.length === 1 ? "contact" : "contacts"}
                  </span>
                </span>
              </span>
              <span className="row-r">
                <span className={`rel rel-${c.relation.toLowerCase()}`}>{c.relation}</span>
                <span className="ago">{c.last}</span>
              </span>
            </button>
          ))}
          {clubs.length === 0 && (
            <div className="empty">
              <Icon name="search" size={28} />
              <b>No clubs found</b>
              <span>Try a club or contact name.</span>
            </div>
          )}
        </div>
      </section>

      <section className="col detail">
        <div className="tb tb-d">
          <span className="crumb">Clubs &amp; contacts</span>
          <div className="tb-r">
            <button type="button" className="ib" aria-label="More options">
              <Icon name="more" />
            </button>
          </div>
        </div>
        <div className="d-scroll">
          <div className="card phero" key={club.id}>
            <div className="phero-top">
              <span className="crest-big">
                <Crest club={club} size={54} />
              </span>
              <div className="phero-m">
                <h3>{club.name}</h3>
                <div className="phero-s">
                  <span className="inl">
                    <Icon name="pin" size={14} />
                    {club.ground}
                  </span>
                  <span>· {club.league}</span>
                </div>
              </div>
              <span className={`rel rel-lg rel-${club.relation.toLowerCase()}`}>
                {club.relation} relationship
              </span>
            </div>
            <div className="facts">
              <div>
                <span>Players tracked</span>
                <b>{clubPlayers.length}</b>
              </div>
              <div>
                <span>Contacts</span>
                <b>{club.contacts.length}</b>
              </div>
              <div>
                <span>Last contact</span>
                <b>{club.last}</b>
              </div>
              <div>
                <span>Owner</span>
                <b>Dan Mercer</b>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h4>Contacts</h4>
              <span>Shared across the team</span>
            </div>
            <ul className="contacts">
              {club.contacts.map((c) => (
                <li key={c.name}>
                  <Avatar ini={c.ini} grad={[club.colors[0], "#8e8e93"]} size={40} />
                  <div className="ct-m">
                    <b>{c.name}</b>
                    <span>{c.role}</span>
                    <span className={`ct-l${contactedNow[c.name] ? " ct-now" : ""}`}>
                      <Icon name="clock" size={12} sw={2} />
                      {contactedNow[c.name] ?? `Last contacted ${c.last}`}
                    </span>
                  </div>
                  <div className="ct-a">
                    <button
                      type="button"
                      className="round"
                      aria-label={`Message ${c.name}`}
                      onClick={() => contact(c, "message")}
                    >
                      <Icon name="message" size={18} />
                    </button>
                    <button
                      type="button"
                      className="round round-g"
                      aria-label={`Call ${c.name}`}
                      onClick={() => contact(c, "call")}
                    >
                      <Icon name="phone" size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-h">
              <h4>Players of interest</h4>
              <span>{clubPlayers.length || "None yet"}</span>
            </div>
            {clubPlayers.length ? (
              <div className="poi">
                {clubPlayers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="poi-i"
                    onClick={() => openPlayer(p.id)}
                  >
                    <Avatar ini={p.ini} grad={p.grad} size={32} />
                    <span className="poi-m">
                      <b>{p.name}</b>
                      <span>
                        {p.pos.join(" / ")} · {p.age}
                      </span>
                    </span>
                    <StatusPill s={statusOf(p)} />
                    <Icon name="chev" size={16} sw={2} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mutedt">No players tracked at this club yet.</p>
            )}
          </div>

          <div className="card">
            <div className="card-h">
              <h4>Notes</h4>
              <span>Edited {club.last}</span>
            </div>
            <p className="note-p">{club.notes}</p>
          </div>
        </div>
      </section>
    </>
  );

  /* ---------------- Match report ---------------- */
  const reportView = (
    <section className="col main">
      <div className="tb tb-main">
        <button type="button" className="back" onClick={() => setView("players")}>
          <Icon name="back" size={20} sw={2.2} />
          Players
        </button>
        <div className="tb-title">
          <b>{filed ? "Report filed" : "New match report"}</b>
          <span>
            {filed
              ? `${filedCount} reports this month`
              : online
                ? "Draft · autosaved 9:40"
                : "Draft · saved on this iPad"}
          </span>
        </div>
        <div className="tb-r">
          <span className={`chip-s${online ? "" : " chip-off"}`}>
            <Icon name={online ? "cloud" : "cloudOff"} size={16} />
            {online ? "Offline ready" : "Offline"}
          </span>
        </div>
      </div>

      {filed ? (
        <div className="filed">
          <div className="filed-card">
            <span className="filed-i">
              <Icon name="check" size={34} sw={2.6} />
            </span>
            <h3>Report filed</h3>
            <p>
              {rp.name} · Harbour Athletic 2–1 Kingsmoor Town
              <br />
              {online
                ? "Synced to the recruitment team at 9:41."
                : "Saved on this iPad. It will sync automatically when you're back online."}
            </p>
            <div className="filed-sum">
              <div>
                <b>{avg.toFixed(1)}</b>
                <span>Avg rating</span>
              </div>
              <div>
                <b>{verdict}</b>
                <span>Verdict</span>
              </div>
              <div>
                <b>{notes.length}</b>
                <span>Minute notes</span>
              </div>
              <div>
                <b>{tags.length}</b>
                <span>Tags</span>
              </div>
            </div>
            <div className="filed-tags">
              {tags.map((t) => (
                <span key={t} className="tag on static">
                  {t}
                </span>
              ))}
            </div>
            <div className="filed-a">
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={() => openPlayer(rp.id)}
              >
                View {rp.name.split(" ")[0]}'s profile
              </button>
              <button type="button" className="btn btn-lg" onClick={resetReport}>
                Start another report
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="form">
          <div className="form-l">
            <div className="card fixture">
              <div className="fx-top">
                <span>League One · Matchday 14</span>
                <span className="inl">
                  <Icon name="eye" size={14} />
                  Watched live
                </span>
              </div>
              <div className="fx">
                <div className="fx-t">
                  <Crest club={CLUBS[0]} size={40} />
                  <b>Harbour Athletic</b>
                </div>
                <div className="fx-sc">
                  <b>2 – 1</b>
                  <span>Full time</span>
                </div>
                <div className="fx-t">
                  <Crest club={CLUBS[1]} size={40} />
                  <b>Kingsmoor Town</b>
                </div>
              </div>
              <div className="fx-meta">
                <span className="inl">
                  <Icon name="calendar" size={14} />
                  Sat 25 Oct 2026 · 15:00
                </span>
                <span className="inl">
                  <Icon name="pin" size={14} />
                  Harbour Park · Main stand
                </span>
              </div>
              <div className="subject">
                <Avatar ini={rp.ini} grad={rp.grad} size={40} />
                <div className="subj-m">
                  <span>Reporting on</span>
                  <b>
                    {rp.name}
                    <PosChip p={rp.pos[0]} g={rp.group} />
                  </b>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setReportPlayer((reportPlayer + 1) % REPORT_PLAYERS.length)}
                >
                  <Icon name="swap" size={15} sw={2} />
                  Switch player
                </button>
              </div>
            </div>

            <div className="card notes">
              <div className="card-h">
                <h4>Minute notes</h4>
                <span>{notes.length} notes · tap to add</span>
              </div>
              <ol className="mn">
                {notes.map((n, i) => (
                  <li key={`${n.m}-${i}`} className={i >= INITIAL_NOTES.length ? "fresh" : ""}>
                    <span className="mn-m">{n.m}</span>
                    <div className="mn-b">
                      <span className={`mn-k k-${n.kind.split(" ")[0].toLowerCase()}`}>
                        {n.kind}
                      </span>
                      <p>{n.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="quick">
                {NOTE_KINDS.map((k) => {
                  const full = notes.length - INITIAL_NOTES.length >= ADD_MINUTES.length;
                  return (
                    <button
                      key={k}
                      type="button"
                      className={`qa k-${k.split(" ")[0].toLowerCase()}`}
                      disabled={full}
                      onClick={() =>
                        setNotes([
                          ...notes,
                          {
                            m: ADD_MINUTES[notes.length - INITIAL_NOTES.length],
                            kind: k,
                            text: ADD_TEXT[k],
                          },
                        ])
                      }
                    >
                      <Icon name="plus" size={14} sw={2.4} />
                      {k}
                    </button>
                  );
                })}
                <button type="button" className="qa mic" aria-label="Dictate a note">
                  <Icon name="mic" size={16} sw={2} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-r">
            <div className="card">
              <div className="card-h">
                <h4>Ratings</h4>
                <span className="avg">
                  <b>{avg.toFixed(1)}</b> avg
                </span>
              </div>
              <ul className="rates">
                {RATING_ROWS.map((r) => {
                  const v = ratings[r.key];
                  return (
                    <li key={r.key}>
                      <div className="rt-m">
                        <b>{r.label}</b>
                        <span>{r.hint}</span>
                        <span className="pips" aria-hidden="true">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <i key={n} className={n <= v ? "on" : ""} />
                          ))}
                        </span>
                      </div>
                      <div className="stepper">
                        <button
                          type="button"
                          aria-label={`Decrease ${r.label}`}
                          disabled={v <= 1}
                          onClick={() => setRatings({ ...ratings, [r.key]: Math.max(1, v - 1) })}
                        >
                          <Icon name="minus" size={18} sw={2.4} />
                        </button>
                        <span className="sv">{v}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${r.label}`}
                          disabled={v >= 5}
                          onClick={() => setRatings({ ...ratings, [r.key]: Math.min(5, v + 1) })}
                        >
                          <Icon name="plus" size={18} sw={2.4} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="card">
              <div className="card-h">
                <h4>Quick tags</h4>
                <span>{tags.length} selected</span>
              </div>
              <div className="tags">
                {TAGS.map((t) => {
                  const on = tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`tag${on ? " on" : ""}`}
                      aria-pressed={on}
                      onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t])}
                    >
                      {on && <Icon name="check" size={13} sw={2.6} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card verdict">
              <div className="card-h">
                <h4>Verdict</h4>
              </div>
              <div className="seg seg-lg" role="group" aria-label="Verdict">
                {["Monitor", "Shortlist", "Recommend"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={verdict === v ? "on" : ""}
                    aria-pressed={verdict === v}
                    onClick={() => setVerdict(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="file"
              onClick={() => {
                setFiled(true);
                setFiledCount(filedCount + 1);
              }}
            >
              <Icon name="check" size={20} sw={2.6} />
              File report
            </button>
            <p className="file-n">
              {online
                ? "Shared with the recruitment team instantly"
                : "Saved on this iPad, syncs when back online"}
            </p>
          </div>
        </div>
      )}
    </section>
  );

  /* ---------------- Tasks ---------------- */
  const tasksView = (
    <section className="col main">
      <div className="tb tb-main">
        <span className="tb-sync">
          <span className={`led${online ? "" : " led-off"}`} />
          {online ? "Synced" : "Offline"}
        </span>
        <div className="tb-r">
          <button type="button" className="ib" aria-label="Add task">
            <Icon name="plus" />
          </button>
        </div>
      </div>
      <div className="tasks-wrap">
        <h2 className="lt">Tasks</h2>
        <div className="t-sum">
          {(
            [
              ["Due today", tasks.filter((t) => t.group === "Today" && !t.done).length, "#ff9500"],
              [
                "This week",
                tasks.filter((t) => t.group === "This week" && !t.done).length,
                "#0a66ff",
              ],
              ["Completed", tasks.filter((t) => t.done).length + 11, "#34c759"],
              ["Overdue", 0, "#8e8e93"],
            ] as [string, number, string][]
          ).map(([l, n, c]) => (
            <div key={l} className="card t-s">
              <span className="t-dot" style={{ background: c }} />
              <b>{n}</b>
              <span>{l}</span>
            </div>
          ))}
        </div>
        {(["Today", "This week"] as const).map((g) => (
          <div key={g} className="t-group">
            <div className="t-gh">
              {g}
              <span>{g === "Today" ? "Tue 28 Oct" : "29 Oct – 3 Nov"}</span>
            </div>
            <div className="card t-list">
              {tasks
                .filter((t) => t.group === g)
                .map((t) => (
                  <div key={t.id} className={`t-row${t.done ? " done" : ""}`}>
                    <button
                      type="button"
                      className="cb"
                      aria-pressed={t.done}
                      aria-label={`Mark "${t.text}" ${t.done ? "not done" : "done"}`}
                      onClick={() =>
                        setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                      }
                    >
                      {t.done && <Icon name="check" size={14} sw={3} />}
                    </button>
                    <div className="t-m">
                      <b>{t.text}</b>
                      <span className="t-link">{t.link}</span>
                    </div>
                    <span className={`t-due${g === "Today" && !t.done ? " t-today" : ""}`}>
                      <Icon name="clock" size={13} sw={2} />
                      {t.due}
                    </span>
                    <Avatar ini={t.who} grad={TEAM[t.who]} size={28} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="mk-rc">
      <style>{CSS}</style>
      <div className="sb" aria-hidden="true">
        <span className="sb-l">
          <b>9:41</b>
          <span>Tue 28 Oct</span>
        </span>
        <span className="sb-r">
          <svg width="17" height="12" viewBox="0 0 17 12">
            <path
              d="M8.5 2.2c2.4 0 4.6.9 6.3 2.5l1.1-1.1A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1.1 3.6l1.1 1.1a9 9 0 0 1 6.3-2.5z"
              fill="currentColor"
              opacity={online ? 1 : 0.3}
            />
            <path
              d="M8.5 5.4c1.5 0 2.9.6 4 1.6l1.1-1.1a7.3 7.3 0 0 0-10.2 0L4.5 7a5.7 5.7 0 0 1 4-1.6z"
              fill="currentColor"
              opacity={online ? 1 : 0.3}
            />
            <path
              d="M8.5 8.6c.7 0 1.3.3 1.8.7L8.5 11.2 6.7 9.3c.5-.4 1.1-.7 1.8-.7z"
              fill="currentColor"
            />
          </svg>
          <span>100%</span>
          <svg width="27" height="13" viewBox="0 0 27 13">
            <rect
              x="0.5"
              y="0.5"
              width="23"
              height="12"
              rx="3.6"
              fill="none"
              stroke="currentColor"
              opacity="0.4"
            />
            <rect x="2" y="2" width="20" height="9" rx="2.2" fill="currentColor" />
            <path
              d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z"
              fill="currentColor"
              opacity="0.4"
            />
          </svg>
        </span>
      </div>
      <div className="app">
        {sidebar}
        {view === "players" && playersView}
        {view === "clubs" && clubsView}
        {view === "reports" && reportView}
        {view === "tasks" && tasksView}
      </div>
      {toast && (
        <div className="toast" role="status">
          <Icon name={toast.startsWith("Calling") ? "phone" : "message"} size={16} sw={2} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-rc{--bg:#f2f2f7;--card:#fff;--ink:#1c1c1e;--ink2:#3a3a3c;--mut:#8a8a8e;--mut2:#aeaeb2;--sep:rgba(60,60,67,.13);--fill:rgba(118,118,128,.12);--blue:#0a66ff;--blue-t:rgba(10,102,255,.1);
  width:100%;height:100%;overflow:hidden;position:relative;background:var(--bg);color:var(--ink);
  font-family:Inter,-apple-system,system-ui,sans-serif;font-size:14px;line-height:1.35;letter-spacing:-.006em;-webkit-font-smoothing:antialiased}
.mk-rc *{box-sizing:border-box}
.mk-rc h2,.mk-rc h3,.mk-rc h4,.mk-rc p,.mk-rc ol,.mk-rc ul{margin:0;padding:0}
.mk-rc ol,.mk-rc ul{list-style:none}
.mk-rc button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;margin:0;text-align:left}
.mk-rc button:disabled{cursor:default}
.mk-rc input{font:inherit;color:inherit;border:0;background:none;outline:none;min-width:0;flex:1}
.mk-rc em{font-style:normal}

/* status bar */
.mk-rc .sb{position:absolute;top:0;left:0;right:0;height:24px;display:flex;align-items:center;justify-content:space-between;padding:0 22px 0 24px;font-size:13px;z-index:5;pointer-events:none}
.mk-rc .sb-l{display:flex;gap:7px;font-weight:600}
.mk-rc .sb-l b{font-weight:600}
.mk-rc .sb-r{display:flex;align-items:center;gap:6px;font-weight:600;font-size:12.5px}

.mk-rc .app{display:flex;height:100%}

/* sidebar */
.mk-rc .side{width:256px;flex:none;background:#ececf1;border-right:1px solid var(--sep);padding:38px 12px 14px;display:flex;flex-direction:column}
.mk-rc .brand{display:flex;align-items:center;gap:10px;padding:0 6px 16px}
.mk-rc .logo{width:36px;height:36px;border-radius:9px;display:grid;place-items:center;color:#fff;background:linear-gradient(150deg,#3d8bff,#0a52d6);box-shadow:inset 0 0 0 .5px rgba(0,0,0,.08),0 1px 2px rgba(10,82,214,.3)}
.mk-rc .brand-n{font-size:16px;font-weight:700;letter-spacing:-.02em}
.mk-rc .brand-s{font-size:12px;color:var(--mut)}
.mk-rc .new-rep{display:flex;align-items:center;justify-content:center;gap:7px;height:40px;border-radius:12px;background:var(--blue);color:#fff;font-weight:600;font-size:14px;margin:0 2px 14px;box-shadow:0 1px 2px rgba(10,102,255,.3)}
.mk-rc .new-rep:hover{background:#0058e6}
.mk-rc .navl{display:flex;flex-direction:column;gap:2px}
.mk-rc .nav-i{display:flex;align-items:center;gap:11px;height:42px;padding:0 10px;border-radius:10px;color:var(--ink);font-size:15px;transition:background .15s}
.mk-rc .nav-i svg{color:var(--blue);flex:none}
.mk-rc .nav-i:hover{background:rgba(118,118,128,.1)}
.mk-rc .nav-i.on{background:var(--blue);color:#fff}
.mk-rc .nav-i.on svg{color:#fff}
.mk-rc .nav-i.on .nav-c{color:rgba(255,255,255,.85)}
.mk-rc .nav-i.on-soft{background:rgba(118,118,128,.16)}
.mk-rc .nav-l{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-rc .nav-c{font-size:13px;color:var(--mut);font-variant-numeric:tabular-nums}
.mk-rc .side-h{font-size:13px;font-weight:600;color:var(--mut);padding:16px 10px 4px}
.mk-rc .sl{height:38px;font-size:14px}
.mk-rc .sldot{width:10px;height:10px;border-radius:50%;margin:0 5px;flex:none}
.mk-rc .up{display:flex;flex-direction:column;gap:2px;padding:0 4px}
.mk-rc .up li{display:flex;align-items:center;gap:10px;padding:6px}
.mk-rc .up-d{width:36px;height:38px;border-radius:9px;background:#fff;box-shadow:0 0 0 1px var(--sep);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;line-height:1.05}
.mk-rc .up-d span{font-size:11px;font-weight:700;color:#ff3b30;text-transform:uppercase;letter-spacing:.03em}
.mk-rc .up-d b{font-size:16px;font-weight:700}
.mk-rc .up-m{display:flex;flex-direction:column;min-width:0}
.mk-rc .up-m b{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-rc .up-m span{font-size:12px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-rc .side-foot{margin-top:auto;display:flex;flex-direction:column;gap:10px}
.mk-rc .sync{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--sep)}
.mk-rc .sync-i{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:rgba(52,199,89,.14);color:#1f9d45;flex:none}
.mk-rc .sync.off .sync-i{background:rgba(255,149,0,.15);color:#c26a00}
.mk-rc .sync-t{display:flex;flex-direction:column;flex:1;min-width:0}
.mk-rc .sync-t b{font-size:13.5px;font-weight:600}
.mk-rc .sync-t span{font-size:12px;color:var(--mut);white-space:nowrap}
.mk-rc .sw{width:34px;height:20px;border-radius:10px;background:#34c759;position:relative;flex:none;transition:background .2s}
.mk-rc .sw i{position:absolute;top:2px;left:16px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .2s}
.mk-rc .sw-off{background:#d1d1d6}
.mk-rc .sw-off i{left:2px}
.mk-rc .me{display:flex;align-items:center;gap:10px;padding:2px 8px}
.mk-rc .me b{display:block;font-size:13.5px;font-weight:600}
.mk-rc .me span{font-size:12px;color:var(--mut)}

.mk-rc .av{display:inline-grid;place-items:center;border-radius:50%;color:#fff;font-weight:650;flex:none;letter-spacing:.01em;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.08)}

/* columns */
.mk-rc .col{height:100%;display:flex;flex-direction:column;min-width:0}
.mk-rc .list{width:372px;flex:none;background:#fff;border-right:1px solid var(--sep)}
.mk-rc .detail,.mk-rc .main{flex:1;background:var(--bg)}
.mk-rc .col-top{padding:30px 16px 6px}
.mk-rc .tb{display:flex;align-items:center;justify-content:space-between;height:40px}
.mk-rc .tb-r{display:flex;gap:4px;align-items:center}
.mk-rc .tb-d{padding:30px 16px 0 22px;height:auto;min-height:70px}
.mk-rc .tb-main{padding:30px 22px 0;height:auto;min-height:70px;position:relative}
.mk-rc .tb-sync{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:var(--mut)}
.mk-rc .led{width:7px;height:7px;border-radius:50%;background:#34c759;box-shadow:0 0 0 3px rgba(52,199,89,.18)}
.mk-rc .led-off{background:#ff9500;box-shadow:0 0 0 3px rgba(255,149,0,.18)}
.mk-rc .ib{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:var(--blue);transition:background .15s}
.mk-rc .ib:hover{background:var(--blue-t)}
.mk-rc .ib-on{color:#ff9f0a}
.mk-rc .ib-on svg{fill:#ff9f0a}
.mk-rc .crumb{font-size:13px;color:var(--mut);font-weight:500}
.mk-rc .lt{font-size:30px;font-weight:750;letter-spacing:-.03em;margin:2px 0 10px;line-height:1.1}
.mk-rc .search{display:flex;align-items:center;gap:7px;height:36px;padding:0 10px;border-radius:10px;background:var(--fill);color:var(--mut);font-size:15px}
.mk-rc .search input{color:var(--ink)}
.mk-rc .search input::placeholder{color:#8e8e93}
.mk-rc .clr{width:17px;height:17px;border-radius:50%;background:#aeaeb2;color:#fff;display:grid;place-items:center}
.mk-rc .seg{display:flex;background:var(--fill);border-radius:9px;padding:2px;margin-top:10px}
.mk-rc .seg button{flex:1;height:28px;border-radius:7px;font-size:13px;font-weight:500;text-align:center;color:var(--ink);transition:background .15s,box-shadow .15s}
.mk-rc .seg button.on{background:#fff;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.08),0 0 0 .5px rgba(0,0,0,.05)}
.mk-rc .seg-lg button{height:36px;font-size:14px}
.mk-rc .meta-row{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--mut);padding:12px 4px 4px}
.mk-rc .link{color:var(--blue);font-weight:500;font-size:13px}

.mk-rc .rows{flex:1;overflow-y:auto;padding:2px 8px 16px;scrollbar-width:none}
.mk-rc .rows::-webkit-scrollbar{display:none}
.mk-rc .row{display:flex;align-items:center;gap:12px;width:100%;padding:9px 10px;border-radius:12px;position:relative;transition:background .12s}
.mk-rc .row:not(.sel)+.row:not(.sel)::before{content:"";position:absolute;left:64px;right:10px;top:0;height:1px;background:var(--sep)}
.mk-rc .row:hover{background:rgba(118,118,128,.07)}
.mk-rc .row.sel{background:var(--blue-t)}
.mk-rc .row-m{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.mk-rc .row-t{display:flex;align-items:center;gap:5px}
.mk-rc .row-t b{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-rc .star-s{color:#ff9f0a;display:flex}
.mk-rc .star-s svg{fill:#ff9f0a}
.mk-rc .row-s{display:flex;align-items:center;gap:4px;min-width:0}
.mk-rc .row-c{font-size:13px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-left:2px}
.mk-rc .row-r{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex:none}
.mk-rc .ago{font-size:12px;color:var(--mut2)}
.mk-rc .crest-w{width:42px;display:grid;place-items:center;flex:none}
.mk-rc .empty{display:flex;flex-direction:column;align-items:center;gap:6px;padding:48px 20px;color:var(--mut);text-align:center;font-size:13px}
.mk-rc .empty b{color:var(--ink);font-size:15px}

.mk-rc .pos{display:inline-flex;align-items:center;height:19px;padding:0 6px;border-radius:5px;font-size:11px;font-weight:700;letter-spacing:.02em}
.mk-rc .pos-def{background:rgba(10,102,255,.1);color:#0a56d6}
.mk-rc .pos-mid{background:rgba(48,176,199,.14);color:#127a8c}
.mk-rc .pos-att{background:rgba(255,69,58,.11);color:#d4271c}
.mk-rc .stp{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:11px;font-size:12px;font-weight:600;white-space:nowrap}
.mk-rc .st-tracking{background:rgba(142,142,147,.15);color:#5d5d63}
.mk-rc .st-contacted{background:rgba(255,149,0,.15);color:#b86200}
.mk-rc .st-meet{background:rgba(175,82,222,.14);color:#8a3cba}
.mk-rc .st-signed{background:rgba(52,199,89,.16);color:#1c8a3a}
.mk-rc .rel{font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px}
.mk-rc .rel-warm{background:rgba(52,199,89,.15);color:#1c8a3a}
.mk-rc .rel-active{background:var(--blue-t);color:#0a56d6}
.mk-rc .rel-new{background:rgba(142,142,147,.15);color:#5d5d63}
.mk-rc .rel-lg{font-size:13px;padding:5px 11px;border-radius:14px;align-self:flex-start}

/* detail */
.mk-rc .d-scroll{flex:1;overflow-y:auto;padding:4px 22px 22px;display:flex;flex-direction:column;gap:12px;scrollbar-width:none}
.mk-rc .d-scroll::-webkit-scrollbar{display:none}
.mk-rc .d-scroll>.card,.mk-rc .form-r>*{flex:none}
.mk-rc .card{background:var(--card);border-radius:16px;padding:16px;box-shadow:0 0 0 .5px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.03)}
.mk-rc .card-h{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px}
.mk-rc .card-h h4{font-size:16px;font-weight:650;letter-spacing:-.015em}
.mk-rc .card-h>span{font-size:12.5px;color:var(--mut)}
.mk-rc .phero{padding:18px}
.mk-rc .phero-top{display:flex;align-items:center;gap:14px}
.mk-rc .phero-m{flex:1;min-width:0}
.mk-rc .phero-m h3{font-size:23px;font-weight:750;letter-spacing:-.025em;line-height:1.15}
.mk-rc .phero-s{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:13.5px;color:var(--mut)}
.mk-rc .phero-s span+span{margin-left:4px}
.mk-rc .inl{display:inline-flex;align-items:center;gap:4px}
.mk-rc .st-btn{display:flex;flex-direction:column;align-items:flex-end;gap:7px;padding:6px;border-radius:10px;align-self:flex-start}
.mk-rc .st-btn:hover{background:rgba(118,118,128,.08)}
.mk-rc .st-btn .stp{height:26px;font-size:13px;padding:0 11px;border-radius:13px}
.mk-rc .st-steps{display:flex;gap:3px}
.mk-rc .st-steps i{width:18px;height:4px;border-radius:2px;background:#e5e5ea}
.mk-rc .st-steps i.on{background:var(--blue)}
.mk-rc .facts{display:grid;grid-template-columns:repeat(4,1fr);margin-top:16px;border-top:1px solid var(--sep);padding-top:14px}
.mk-rc .facts div{display:flex;flex-direction:column;gap:3px;padding:0 12px;border-left:1px solid var(--sep)}
.mk-rc .facts div:first-child{border-left:0;padding-left:0}
.mk-rc .facts span{font-size:12px;color:var(--mut)}
.mk-rc .facts b{font-size:15px;font-weight:600;white-space:nowrap}
.mk-rc .facts em{font-size:12px;color:var(--mut);font-weight:500}

.mk-rc .next{display:flex;align-items:center;gap:14px;padding:14px 16px;background:linear-gradient(180deg,#f3f7ff,#fff);box-shadow:0 0 0 1px rgba(10,102,255,.16)}
.mk-rc .next-i{width:40px;height:40px;border-radius:12px;background:var(--blue);color:#fff;display:grid;place-items:center;flex:none}
.mk-rc .next-m{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.mk-rc .next-l{font-size:12px;font-weight:600;color:var(--blue);text-transform:uppercase;letter-spacing:.05em}
.mk-rc .next-m b{font-size:15px;font-weight:600}
.mk-rc .next-d{font-size:13px;color:var(--mut)}
.mk-rc .next-done{background:linear-gradient(180deg,#f1fbf4,#fff);box-shadow:0 0 0 1px rgba(52,199,89,.25)}
.mk-rc .next-done .next-i{background:#34c759}
.mk-rc .next-done .next-l{color:#1c8a3a}
.mk-rc .next-done .next-m b{color:var(--mut);text-decoration:line-through}
.mk-rc .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 16px;border-radius:18px;background:var(--blue);color:#fff;font-weight:600;font-size:14px;white-space:nowrap;flex:none;transition:background .15s}
.mk-rc .btn:hover{background:#0058e6}
.mk-rc .btn-ghost{background:var(--blue-t);color:var(--blue)}
.mk-rc .btn-ghost:hover{background:rgba(10,102,255,.16)}
.mk-rc .btn-sm{height:32px;padding:0 12px;font-size:13px}
.mk-rc .btn-lg{height:48px;padding:0 22px;border-radius:14px;font-size:15px}

.mk-rc .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.mk-rc .stat{background:#f7f7fa;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;min-height:64px}
.mk-rc .stat b{font-size:20px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.mk-rc .stat b em{font-size:12px;font-weight:500;color:var(--mut)}
.mk-rc .stat>span{font-size:12px;color:var(--mut)}
.mk-rc .bar{height:4px;border-radius:2px;background:#e5e5ea;margin-top:5px;overflow:hidden}
.mk-rc .bar i{display:block;height:100%;border-radius:2px;background:var(--blue)}

.mk-rc .clog li{display:flex;gap:12px;position:relative;padding-bottom:14px}
.mk-rc .clog li:last-child{padding-bottom:0}
.mk-rc .clog li:not(:last-child)::before{content:"";position:absolute;left:13px;top:30px;bottom:2px;width:2px;border-radius:1px;background:#ececf0}
.mk-rc .tl-i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;flex:none;background:var(--blue-t);color:var(--blue)}
.mk-rc .tl-call .tl-i{background:rgba(52,199,89,.14);color:#1c8a3a}
.mk-rc .tl-meeting .tl-i{background:rgba(175,82,222,.13);color:#8a3cba}
.mk-rc .tl-report .tl-i{background:rgba(255,149,0,.14);color:#b86200}
.mk-rc .tl-note .tl-i{background:rgba(142,142,147,.15);color:#5d5d63}
.mk-rc .tl-m{flex:1;min-width:0;padding-top:4px}
.mk-rc .tl-t{display:flex;justify-content:space-between;gap:8px}
.mk-rc .tl-t b{font-size:14px;font-weight:600}
.mk-rc .tl-t span{font-size:12px;color:var(--mut);white-space:nowrap}
.mk-rc .tl-m p{font-size:13.5px;color:var(--ink2);margin-top:2px;line-height:1.4}
.mk-rc .tl-by{font-size:12px;color:var(--mut2);margin-top:3px;display:block}

/* clubs */
.mk-rc .crest-big{display:grid;place-items:center;width:64px;flex:none}
.mk-rc .contacts li{display:flex;align-items:center;gap:12px;padding:10px 0;border-top:1px solid var(--sep)}
.mk-rc .contacts li:first-child{border-top:0;padding-top:0}
.mk-rc .contacts li:last-child{padding-bottom:0}
.mk-rc .ct-m{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.mk-rc .ct-m b{font-size:15px;font-weight:600}
.mk-rc .ct-m>span{font-size:13px;color:var(--mut)}
.mk-rc .ct-m .ct-l{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--mut2);margin-top:2px}
.mk-rc .ct-m .ct-now{color:#1c8a3a;font-weight:600}
.mk-rc .ct-a{display:flex;gap:8px}
.mk-rc .round{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--blue-t);color:var(--blue);transition:transform .1s,background .15s}
.mk-rc .round:hover{background:rgba(10,102,255,.17)}
.mk-rc .round:active{transform:scale(.94)}
.mk-rc .round-g{background:rgba(52,199,89,.14);color:#1c8a3a}
.mk-rc .round-g:hover{background:rgba(52,199,89,.22)}
.mk-rc .poi{display:flex;flex-direction:column}
.mk-rc .poi-i{display:flex;align-items:center;gap:11px;padding:9px 6px;margin:0 -6px;border-radius:10px;color:var(--mut2)}
.mk-rc .poi-i+.poi-i{border-top:1px solid var(--sep);border-radius:0 0 10px 10px}
.mk-rc .poi-i:hover{background:rgba(118,118,128,.07)}
.mk-rc .poi-m{flex:1;display:flex;flex-direction:column;color:var(--ink)}
.mk-rc .poi-m b{font-size:14.5px;font-weight:600}
.mk-rc .poi-m span{font-size:12.5px;color:var(--mut)}
.mk-rc .note-p{font-size:14px;line-height:1.5;color:var(--ink2)}
.mk-rc .mutedt{font-size:13.5px;color:var(--mut)}

/* report */
.mk-rc .back{display:flex;align-items:center;gap:2px;color:var(--blue);font-size:16px;font-weight:500;margin-left:-6px;height:38px;padding-right:8px}
.mk-rc .tb-title{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}
.mk-rc .tb-title b{font-size:17px;font-weight:650;letter-spacing:-.02em}
.mk-rc .tb-title span{font-size:12px;color:var(--mut)}
.mk-rc .chip-s{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:15px;background:rgba(52,199,89,.13);color:#1c8a3a;font-size:13px;font-weight:600}
.mk-rc .chip-off{background:rgba(255,149,0,.15);color:#b86200}
.mk-rc .form{flex:1;display:grid;grid-template-columns:1fr 372px;gap:14px;padding:8px 22px 16px;min-height:0}
.mk-rc .form-l,.mk-rc .form-r{display:flex;flex-direction:column;gap:12px;min-height:0}
.mk-rc .form-r{gap:10px}
.mk-rc .form-r>.card{padding:14px 16px}
.mk-rc .form-r .card-h{margin-bottom:10px}
.mk-rc .fixture{padding:16px 18px}
.mk-rc .fx-top{display:flex;justify-content:space-between;font-size:12.5px;color:var(--mut);font-weight:500}
.mk-rc .fx{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin:12px 0 10px}
.mk-rc .fx-t{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.mk-rc .fx-t b{font-size:14.5px;font-weight:650}
.mk-rc .fx-sc{display:flex;flex-direction:column;align-items:center}
.mk-rc .fx-sc b{font-size:34px;font-weight:750;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
.mk-rc .fx-sc span{font-size:12px;color:var(--mut);font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.mk-rc .fx-meta{display:flex;justify-content:center;gap:18px;font-size:13px;color:var(--mut);padding-bottom:12px;border-bottom:1px solid var(--sep)}
.mk-rc .subject{display:flex;align-items:center;gap:12px;padding-top:12px}
.mk-rc .subj-m{flex:1;display:flex;flex-direction:column}
.mk-rc .subj-m span{font-size:12px;color:var(--mut)}
.mk-rc .subj-m b{font-size:16px;font-weight:650;display:flex;align-items:center;gap:7px}
.mk-rc .notes{flex:1;display:flex;flex-direction:column;min-height:0}
.mk-rc .mn{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;scrollbar-width:none;margin:0 -4px;padding:0 4px}
.mk-rc .mn::-webkit-scrollbar{display:none}
.mk-rc .mn li{display:flex;gap:10px;align-items:flex-start;background:#f7f7fa;border-radius:12px;padding:9px 12px}
.mk-rc .mn-m{min-width:44px;height:26px;padding:0 8px;border-radius:8px;background:#1c1c1e;color:#fff;font-size:13px;font-weight:700;display:grid;place-items:center;font-variant-numeric:tabular-nums;flex:none}
.mk-rc .mn-b{flex:1;min-width:0}
.mk-rc .mn-k{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.mk-rc .mn-b p{font-size:13.5px;color:var(--ink2);line-height:1.38;margin-top:1px}
.mk-rc .k-key{color:var(--blue)}
.mk-rc .k-chance{color:#c26a00}
.mk-rc .k-defensive{color:#1c8a3a}
.mk-rc .k-note{color:#6e6e73}
.mk-rc .quick{display:flex;gap:6px;margin-top:12px;padding-top:12px;border-top:1px solid var(--sep)}
.mk-rc .qa{display:inline-flex;align-items:center;gap:5px;height:36px;padding:0 12px;border-radius:18px;background:#f2f2f7;font-size:13px;font-weight:600;white-space:nowrap;transition:background .15s}
.mk-rc .qa:hover:not(:disabled){background:#e8e8ee}
.mk-rc .qa:disabled{opacity:.4}
.mk-rc .qa.mic{margin-left:auto;width:36px;padding:0;justify-content:center;background:var(--blue);color:#fff}
.mk-rc .avg{font-size:13px;color:var(--mut)}
.mk-rc .avg b{font-size:17px;color:var(--ink);font-weight:700}
.mk-rc .rates li{display:flex;align-items:center;gap:12px;padding:6px 0;border-top:1px solid var(--sep)}
.mk-rc .rates li:first-child{border-top:0;padding-top:0}
.mk-rc .rates li:last-child{padding-bottom:0}
.mk-rc .rt-m{flex:1;min-width:0;display:grid;grid-template-columns:1fr auto;column-gap:8px;align-items:center}
.mk-rc .rt-m b{font-size:14.5px;font-weight:600}
.mk-rc .rt-m>span:not(.pips){grid-column:1/-1;grid-row:2;font-size:12px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-rc .pips{display:flex;gap:3px;grid-row:1;grid-column:2}
.mk-rc .pips i{width:7px;height:7px;border-radius:50%;background:#e1e1e6;transition:background .15s}
.mk-rc .pips i.on{background:var(--blue)}
.mk-rc .stepper{display:flex;align-items:center;background:#f2f2f7;border-radius:11px;height:38px;flex:none}
.mk-rc .stepper button{width:40px;height:38px;display:grid;place-items:center;color:var(--blue);border-radius:11px}
.mk-rc .stepper button:hover:not(:disabled){background:rgba(118,118,128,.12)}
.mk-rc .stepper button:disabled{color:#c7c7cc}
.mk-rc .sv{width:26px;text-align:center;font-size:17px;font-weight:700;font-variant-numeric:tabular-nums;border-left:1px solid rgba(60,60,67,.12);border-right:1px solid rgba(60,60,67,.12);line-height:20px}
.mk-rc .tags{display:flex;flex-wrap:wrap;gap:7px}
.mk-rc .tag{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 12px;border-radius:16px;background:#f2f2f7;font-size:13px;font-weight:500;transition:background .15s,color .15s}
.mk-rc .tag:hover{background:#e8e8ee}
.mk-rc .tag.on{background:var(--blue);color:#fff}
.mk-rc .tag.static{cursor:default}
.mk-rc .verdict .seg{margin-top:0}
.mk-rc .verdict .card-h{margin-bottom:10px}
.mk-rc .file{display:flex;align-items:center;justify-content:center;gap:8px;height:56px;border-radius:16px;background:var(--blue);color:#fff;font-size:17px;font-weight:650;box-shadow:0 6px 16px -4px rgba(10,102,255,.5);transition:background .15s,transform .1s}
.mk-rc .file:hover{background:#0058e6}
.mk-rc .file:active{transform:scale(.985)}
.mk-rc .file-n{text-align:center;font-size:12px;color:var(--mut);margin-top:-4px}
.mk-rc .filed{flex:1;display:grid;place-items:center;padding:20px}
.mk-rc .filed-card{width:520px;background:#fff;border-radius:22px;padding:32px 32px 26px;text-align:center;box-shadow:0 0 0 .5px rgba(0,0,0,.05),0 12px 32px -12px rgba(0,0,0,.12)}
.mk-rc .filed-i{width:72px;height:72px;border-radius:50%;background:#34c759;color:#fff;display:inline-grid;place-items:center;box-shadow:0 0 0 8px rgba(52,199,89,.14)}
.mk-rc .filed-card h3{font-size:24px;font-weight:750;letter-spacing:-.025em;margin-top:18px}
.mk-rc .filed-card p{font-size:14px;color:var(--mut);margin-top:6px;line-height:1.5}
.mk-rc .filed-sum{display:grid;grid-template-columns:repeat(4,1fr);margin:20px 0 14px;background:#f7f7fa;border-radius:14px;padding:12px 4px}
.mk-rc .filed-sum div{display:flex;flex-direction:column;gap:2px}
.mk-rc .filed-sum div+div{border-left:1px solid var(--sep)}
.mk-rc .filed-sum b{font-size:17px;font-weight:700}
.mk-rc .filed-sum span{font-size:12px;color:var(--mut)}
.mk-rc .filed-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}
.mk-rc .filed-a{display:flex;gap:10px;margin-top:22px}
.mk-rc .filed-a .btn{flex:1}

/* tasks */
.mk-rc .tasks-wrap{flex:1;overflow-y:auto;padding:0 22px 22px;scrollbar-width:none}
.mk-rc .t-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:6px 0 20px}
.mk-rc .t-s{display:flex;flex-direction:column;gap:2px;padding:14px 16px;position:relative}
.mk-rc .t-s b{font-size:28px;font-weight:750;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.mk-rc .t-s span{font-size:13px;color:var(--mut);font-weight:500}
.mk-rc .t-dot{position:absolute;top:16px;right:16px;width:10px;height:10px;border-radius:50%}
.mk-rc .t-group{margin-bottom:18px}
.mk-rc .t-gh{display:flex;align-items:baseline;gap:8px;font-size:17px;font-weight:650;letter-spacing:-.015em;padding:0 4px 8px}
.mk-rc .t-gh span{font-size:13px;color:var(--mut);font-weight:500}
.mk-rc .t-list{padding:0 16px}
.mk-rc .t-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-top:1px solid var(--sep)}
.mk-rc .t-row:first-child{border-top:0}
.mk-rc .cb{width:26px;height:26px;border-radius:50%;border:2px solid #c7c7cc;display:grid;place-items:center;color:#fff;flex:none;transition:background .15s,border-color .15s}
.mk-rc .cb:hover{border-color:var(--blue)}
.mk-rc .done .cb{background:var(--blue);border-color:var(--blue)}
.mk-rc .t-m{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.mk-rc .t-m b{font-size:15px;font-weight:500}
.mk-rc .done .t-m b{color:var(--mut);text-decoration:line-through}
.mk-rc .t-link{font-size:12.5px;color:var(--blue);font-weight:500}
.mk-rc .t-due{display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--mut);white-space:nowrap}
.mk-rc .t-today{color:#c26a00;font-weight:600}

.mk-rc .toast{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:22px;background:rgba(28,28,30,.92);color:#fff;font-size:14px;font-weight:500;box-shadow:0 10px 30px -8px rgba(0,0,0,.35);z-index:6;white-space:nowrap}

@media (prefers-reduced-motion: no-preference){
  .mk-rc .phero,.mk-rc .filed-card{animation:mk-rc-in .28s ease-out}
  .mk-rc .mn li.fresh{animation:mk-rc-in .3s ease-out}
  .mk-rc .toast{animation:mk-rc-toast .25s ease-out}
  .mk-rc .filed-i{animation:mk-rc-pop .45s cubic-bezier(.2,1.4,.4,1)}
}
@keyframes mk-rc-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes mk-rc-toast{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes mk-rc-pop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
`;
