import { useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Tab = "home" | "learn" | "clips" | "live" | "profile";
type ArtKind = "set" | "dive" | "cross" | "spread" | "kick" | "wall";
type Tone = "lime" | "violet" | "pitch" | "night" | "slate" | "teal";

interface Coach {
  name: string;
  role: string;
  initials: string;
  tone: "lime" | "violet" | "white";
}

interface Lesson {
  title: string;
  secs: number;
}

interface Course {
  id: string;
  title: string;
  coach: string;
  level: string;
  art: ArtKind;
  tone: Tone;
  done: number;
  isNew?: boolean;
  lessons: Lesson[];
}

interface ClipNote {
  t: number;
  text: string;
  kind: "good" | "fix";
}

interface Clip {
  id: string;
  title: string;
  date: string;
  secs: number;
  art: ArtKind;
  tone: Tone;
  coach: string;
  status: "ready" | "awaiting";
  notes: ClipNote[];
  score?: string;
  focus?: string[];
}

interface Session {
  id: string;
  dow: string;
  day: string;
  month: string;
  time: string;
  mins: number;
  title: string;
  coach: string;
  level: string;
  joined: number;
  cap: number;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const COACHES: Record<string, Coach> = {
  MH: { name: "Marcus Hale", role: "Ex-Championship keeper", initials: "MH", tone: "lime" },
  SL: { name: "Sofia Lindqvist", role: "Pro keeper coach", initials: "SL", tone: "violet" },
  KA: { name: "Kwame Asante", role: "Academy GK lead", initials: "KA", tone: "white" },
  DM: { name: "Dan Mercer", role: "U18 goalkeeper coach", initials: "DM", tone: "violet" },
};

const L = (title: string, m: number, s: number): Lesson => ({ title, secs: m * 60 + s });

const COURSES: Course[] = [
  {
    id: "set",
    title: "Set position & footwork",
    coach: "MH",
    level: "Foundation",
    art: "set",
    tone: "lime",
    done: 5,
    lessons: [
      L("Why set position matters", 4, 12),
      L("Weight on the balls of your feet", 6, 40),
      L("Hand shape and height", 7, 5),
      L("Shuffle vs cross-over steps", 9, 18),
      L("Angle play: the arc", 8, 44),
      L("Set as the striker strikes", 7, 30),
      L("Recovery footwork after saves", 10, 2),
      L("Match clips, reviewed", 11, 26),
    ],
  },
  {
    id: "cross",
    title: "Crosses & claiming",
    coach: "SL",
    level: "Intermediate",
    art: "cross",
    tone: "violet",
    done: 3,
    lessons: [
      L("Starting position for crosses", 6, 10),
      L("Reading flight and pace", 7, 45),
      L("Calling early and loud", 4, 58),
      L("Take-off leg and knee drive", 8, 20),
      L("Catching at the highest point", 9, 12),
      L("Punching: when and where", 8, 40),
      L("Dealing with traffic", 9, 5),
      L("Inswingers from the right", 7, 55),
      L("Second balls", 6, 30),
      L("Match clips, reviewed", 10, 48),
    ],
  },
  {
    id: "spread",
    title: "1v1 spreading",
    coach: "KA",
    level: "Intermediate",
    art: "spread",
    tone: "teal",
    done: 0,
    isNew: true,
    lessons: [
      L("When to stay, when to go", 7, 20),
      L("Closing the space", 8, 5),
      L("The spread: shape and timing", 9, 40),
      L("Block saves", 7, 15),
      L("Smothering at the feet", 8, 30),
      L("Match clips, reviewed", 7, 10),
    ],
  },
  {
    id: "dive",
    title: "Shot-stopping: low dives",
    coach: "MH",
    level: "Foundation",
    art: "dive",
    tone: "night",
    done: 4,
    lessons: [
      L("The collapse dive", 6, 35),
      L("Leading with the bottom hand", 7, 50),
      L("Power off the near leg", 8, 15),
      L("Parrying wide, not back", 7, 40),
      L("Diving from a set start", 8, 5),
      L("Getting up in one move", 6, 55),
      L("Rebounds and second saves", 8, 30),
      L("Low drives through traffic", 7, 25),
      L("Match clips, reviewed", 9, 40),
    ],
  },
  {
    id: "dist",
    title: "Distribution under pressure",
    coach: "DM",
    level: "Intermediate",
    art: "kick",
    tone: "pitch",
    done: 7,
    lessons: [
      L("First touch with a defender closing", 8, 10),
      L("Driven passes to the full-back", 7, 45),
      L("Side-volleys to the wing", 9, 0),
      L("Goal kicks: short or long", 8, 20),
      L("Throws to feet", 6, 15),
      L("Scanning before it arrives", 7, 50),
      L("Match clips, reviewed", 8, 40),
    ],
  },
  {
    id: "read",
    title: "Reading the game",
    coach: "KA",
    level: "Advanced",
    art: "wall",
    tone: "slate",
    done: 0,
    isNew: true,
    lessons: [
      L("Starting position in open play", 7, 40),
      L("Sweeping behind a high line", 8, 55),
      L("Organising your back four", 7, 10),
      L("Spotting the through ball", 7, 35),
      L("Match clips, reviewed", 8, 20),
    ],
  },
];

const CLIPS: Clip[] = [
  {
    id: "c1",
    title: "Low dive, left side",
    date: "26 Oct",
    secs: 48,
    art: "dive",
    tone: "violet",
    coach: "DM",
    status: "ready",
    score: "7.5",
    focus: ["Bottom hand first", "Faster recovery"],
    notes: [
      {
        t: 6,
        kind: "good",
        text: "Great set position. Feet just wider than shoulders, weight forward. That's the base.",
      },
      {
        t: 14,
        kind: "fix",
        text: "Top hand drops early here. Lead with the bottom hand to the ball, top hand follows.",
      },
      {
        t: 27,
        kind: "good",
        text: "Real power off the left leg, you're driving across the goal, not falling.",
      },
      {
        t: 39,
        kind: "fix",
        text: "Get up quicker. One movement back to your feet, the rebound is the danger.",
      },
    ],
  },
  {
    id: "c2",
    title: "Claiming corners in traffic",
    date: "27 Oct",
    secs: 72,
    art: "cross",
    tone: "night",
    coach: "SL",
    status: "awaiting",
    notes: [],
  },
  {
    id: "c3",
    title: "1v1 vs Harbour Athletic U15",
    date: "19 Oct",
    secs: 36,
    art: "spread",
    tone: "teal",
    coach: "KA",
    status: "ready",
    score: "8.0",
    focus: ["Stay big longer"],
    notes: [
      { t: 5, kind: "good", text: "Brave decision to come. You read the heavy touch early." },
      {
        t: 17,
        kind: "fix",
        text: "You went to ground a fraction early. Stay big until the striker commits.",
      },
      { t: 29, kind: "good", text: "Lovely spread shape, hands low and wide. That's the save." },
    ],
  },
  {
    id: "c4",
    title: "Goal kicks: driven to the wing",
    date: "28 Oct",
    secs: 54,
    art: "kick",
    tone: "pitch",
    coach: "DM",
    status: "awaiting",
    notes: [],
  },
  {
    id: "c5",
    title: "Set position, wall work",
    date: "14 Oct",
    secs: 65,
    art: "wall",
    tone: "lime",
    coach: "MH",
    status: "ready",
    score: "7.0",
    focus: ["Hands higher", "Small steps"],
    notes: [
      {
        t: 9,
        kind: "fix",
        text: "Hands are by your knees. Bring them up to hip height, palms facing the ball.",
      },
      { t: 31, kind: "good", text: "Much better rhythm on the shuffle. Small, quick steps." },
      { t: 52, kind: "fix", text: "Don't cross your feet on the long side. Shuffle, then push." },
    ],
  },
  {
    id: "c6",
    title: "Penalty prep, Saturday",
    date: "11 Oct",
    secs: 42,
    art: "set",
    tone: "slate",
    coach: "SL",
    status: "ready",
    score: "8.5",
    focus: ["Hold your line"],
    notes: [
      { t: 8, kind: "good", text: "Calm and tall on the line. You're making the goal look small." },
      {
        t: 24,
        kind: "fix",
        text: "Small hop before the strike, but you landed flat. Stay on your toes.",
      },
    ],
  },
];

const SESSIONS: Session[] = [
  {
    id: "s1",
    dow: "Wed",
    day: "28",
    month: "Oct",
    time: "18:30",
    mins: 45,
    title: "Handling wet balls",
    coach: "SL",
    level: "U13 to U16",
    joined: 14,
    cap: 20,
  },
  {
    id: "s2",
    dow: "Thu",
    day: "29",
    month: "Oct",
    time: "17:45",
    mins: 60,
    title: "1v1 spreading: live Q&A",
    coach: "KA",
    level: "All ages",
    joined: 32,
    cap: 50,
  },
  {
    id: "s3",
    dow: "Sat",
    day: "31",
    month: "Oct",
    time: "09:30",
    mins: 30,
    title: "Match-day warm-up routine",
    coach: "DM",
    level: "U15 to U18",
    joined: 18,
    cap: 24,
  },
  {
    id: "s4",
    dow: "Mon",
    day: "2",
    month: "Nov",
    time: "18:00",
    mins: 45,
    title: "Crosses: positioning clinic",
    coach: "SL",
    level: "U13 to U16",
    joined: 9,
    cap: 20,
  },
  {
    id: "s5",
    dow: "Wed",
    day: "4",
    month: "Nov",
    time: "18:30",
    mins: 50,
    title: "Footwork ladder circuit",
    coach: "MH",
    level: "All ages",
    joined: 21,
    cap: 30,
  },
];

const TONE_BG: Record<Tone, string> = {
  lime: "radial-gradient(120% 90% at 85% 0%, rgba(212,255,58,.42), transparent 55%), linear-gradient(160deg,#25331a 0%,#0c1108 100%)",
  violet:
    "radial-gradient(120% 90% at 85% 0%, rgba(139,92,246,.6), transparent 58%), linear-gradient(160deg,#211a3d 0%,#0b0913 100%)",
  pitch:
    "repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 28px, transparent 28px 56px), radial-gradient(120% 90% at 80% 0%, rgba(212,255,58,.28), transparent 55%), linear-gradient(170deg,#173d24 0%,#081a0e 100%)",
  night:
    "radial-gradient(110% 80% at 15% 0%, rgba(139,92,246,.38), transparent 55%), radial-gradient(90% 70% at 100% 100%, rgba(212,255,58,.14), transparent 60%), linear-gradient(160deg,#141a2e 0%,#07080d 100%)",
  slate:
    "radial-gradient(120% 90% at 85% 0%, rgba(255,255,255,.2), transparent 55%), linear-gradient(160deg,#2a2b31 0%,#0d0d10 100%)",
  teal: "radial-gradient(120% 90% at 85% 0%, rgba(212,255,58,.3), transparent 55%), linear-gradient(160deg,#0f2d2b 0%,#06100f 100%)",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const courseTotal = (c: Course) => {
  const mins = Math.round(c.lessons.reduce((a, l) => a + l.secs, 0) / 60);
  return mins >= 60
    ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`
    : `${mins}m`;
};

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Ico({
  d,
  size = 22,
  fill,
  sw = 2,
}: {
  d: ReactNode;
  size?: number;
  fill?: boolean;
  sw?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}

const I = {
  home: (
    <path d="M3.5 10.2 12 3.5l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-6h-5.6v6H5A1.5 1.5 0 0 1 3.5 19z" />
  ),
  learn: (
    <>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
      <path d="M6.5 10.8v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5" />
      <path d="M21.5 8.5v5" />
    </>
  ),
  clips: (
    <>
      <rect x="2.5" y="5.5" width="13.5" height="13" rx="3" />
      <path d="m16 10.2 5.5-3v9.6l-5.5-3" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.2 5.2a9.6 9.6 0 0 0 0 13.6M18.8 5.2a9.6 9.6 0 0 1 0 13.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c.6-3.8 3.7-6 7.5-6s6.9 2.2 7.5 6" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" />
      <path d="M10 21h4" />
    </>
  ),
  bellOn: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" />
      <path d="m9.5 11.5 2 2 3.5-3.5" />
    </>
  ),
  chevR: <path d="m9 5 7 7-7 7" />,
  chevL: <path d="m15 5-7 7 7 7" />,
  play: <path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z" />,
  pause: (
    <>
      <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
      <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  flame: (
    <path d="M12.6 2.5c.6 3.4 4.9 5.6 4.9 10.6a5.5 5.5 0 0 1-11 0c0-2.4 1.1-4 2.4-5.2.1 2.1 1 3.3 2.3 3.6-.5-3.2.1-6.2 1.4-9z" />
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 19.5c.5-3.3 3.1-5 6.5-5s6 1.7 6.5 5" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.7.7 2.8 2.3 3 4.7" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5V4M7 8.5 12 3.8l5 4.7" />
      <path d="M4.5 14.5v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4.5h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6.5H5a2.5 2.5 0 0 0 3 3.5M16 6.5h3a2.5 2.5 0 0 1-3 3.5M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z" />
    </>
  ),
  shield: <path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />,
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  ),
};

/* ------------------------------------------------------------------ */
/* Artwork: abstract goalkeeper scenes for thumbnails                   */
/* ------------------------------------------------------------------ */

function Keeper({ pose }: { pose: "set" | "dive" | "spread" | "jump" | "kick" }) {
  const c = {
    stroke: "rgba(255,255,255,.92)",
    strokeWidth: 9,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  if (pose === "dive")
    return (
      <g transform="translate(150 118) rotate(-24)">
        <circle cx="-44" cy="-6" r="8.5" fill="#fff" />
        <path d="M-32 -3 L8 0" {...c} strokeWidth={13} />
        <path d="M-36 -10 L-62 -16 M-36 2 L-62 6" {...c} strokeWidth={7} />
        <path d="M8 0 L32 -8 L50 -4 M8 2 L30 10 L48 18" {...c} strokeWidth={8} />
      </g>
    );
  if (pose === "spread")
    return (
      <g transform="translate(160 132)">
        <circle cx="0" cy="-40" r="8.5" fill="#fff" />
        <path d="M0 -29 L0 -6" {...c} strokeWidth={13} />
        <path d="M-3 -24 L-34 -6 M3 -24 L34 -6" {...c} strokeWidth={7} />
        <path d="M0 -6 L-30 6 L-48 10 M0 -6 L30 6 L50 4" {...c} strokeWidth={8} />
      </g>
    );
  if (pose === "jump")
    return (
      <g transform="translate(176 96)">
        <circle cx="0" cy="-26" r="8.5" fill="#fff" />
        <path d="M0 -15 L-2 14" {...c} strokeWidth={13} />
        <path d="M-2 -12 L-14 -40 M3 -12 L12 -42" {...c} strokeWidth={7} />
        <path d="M-2 14 L-16 30 L-12 48 M-2 14 L10 24 L26 26" {...c} strokeWidth={8} />
      </g>
    );
  if (pose === "kick")
    return (
      <g transform="translate(140 104)">
        <circle cx="0" cy="-26" r="8.5" fill="#fff" />
        <path d="M0 -15 L4 12" {...c} strokeWidth={13} />
        <path d="M0 -10 L-24 2 M2 -10 L24 -18" {...c} strokeWidth={7} />
        <path d="M4 12 L-6 34 L-4 54 M4 12 L28 26 L46 22" {...c} strokeWidth={8} />
      </g>
    );
  return (
    <g transform="translate(160 104)">
      <circle cx="0" cy="-28" r="8.5" fill="#fff" />
      <path d="M0 -17 L0 10" {...c} strokeWidth={13} />
      <path d="M-3 -10 L-22 2 L-26 -8 M3 -10 L22 2 L26 -8" {...c} strokeWidth={7} />
      <path d="M0 10 L-18 26 L-20 46 M0 10 L18 26 L20 46" {...c} strokeWidth={8} />
    </g>
  );
}

function Art({ kind }: { kind: ArtKind }) {
  const pose = kind === "cross" ? "jump" : kind === "wall" ? "set" : kind;
  const ball: Record<ArtKind, [number, number]> = {
    set: [258, 128],
    dive: [86, 146],
    cross: [196, 44],
    spread: [118, 150],
    kick: [210, 112],
    wall: [64, 70],
  };
  const [bx, by] = ball[kind];
  return (
    <svg
      className="mk-gk-art"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* goal frame + net */}
      <g stroke="rgba(255,255,255,.13)" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={46 + i * 19} y1="34" x2={46 + i * 19} y2="160" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="40" y1={44 + i * 18} x2="280" y2={44 + i * 18} />
        ))}
      </g>
      <path d="M38 166 V30 H282 V166" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="5" />
      <path d="M0 166 H320" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
      <ellipse cx="160" cy="166" rx="70" ry="5" fill="rgba(0,0,0,.35)" />
      <Keeper pose={pose} />
      <circle cx={bx} cy={by} r="8" fill="#d4ff3a" />
      <circle cx={bx} cy={by} r="12" fill="none" stroke="rgba(212,255,58,.25)" strokeWidth="3" />
      <circle cx={bx - 2.5} cy={by - 2.5} r="2.5" fill="rgba(255,255,255,.7)" />
    </svg>
  );
}

function Thumb({
  art,
  tone,
  className,
  children,
}: {
  art: ArtKind;
  tone: Tone;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`mk-gk-thumb ${className ?? ""}`} style={{ background: TONE_BG[tone] }}>
      <Art kind={art} />
      <div className="mk-gk-thumb-shade" />
      {children}
    </div>
  );
}

function Avatar({ id, size = 32 }: { id: string; size?: number }) {
  const c = COACHES[id];
  return (
    <span
      className={`mk-gk-av mk-gk-av-${c.tone}`}
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.36)) }}
      aria-hidden="true"
    >
      {c.initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.mk-gk{--bg:#09090b;--s1:#141416;--s2:#1b1b1f;--s3:#242429;--b:rgba(255,255,255,.07);--b2:rgba(255,255,255,.12);--t1:#f6f6f4;--t2:#a3a3ad;--t3:#6f6f7a;--neon:#d4ff3a;--vio:#8b5cf6;--vio2:#a78bfa;
  width:100%;height:100%;overflow:hidden;position:relative;background:var(--bg);color:var(--t1);
  font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.35;-webkit-font-smoothing:antialiased;letter-spacing:-.01em}
.mk-gk *{box-sizing:border-box}
.mk-gk :where(h1,h2,h3,p,ul,ol){margin:0;padding:0}
.mk-gk :where(ul,ol){list-style:none}
.mk-gk :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;margin:0;text-align:inherit;letter-spacing:inherit}
.mk-gk button:focus-visible{outline:2px solid var(--neon);outline-offset:2px}

/* status bar */
.mk-gk-status{position:absolute;top:0;left:0;right:0;height:50px;display:flex;align-items:center;justify-content:space-between;padding:6px 26px 0 36px;z-index:6;background:linear-gradient(var(--bg) 65%,rgba(9,9,11,0))}
.mk-gk-time{font-size:16px;font-weight:600;letter-spacing:-.02em}
.mk-gk-sys{display:flex;align-items:center;gap:6px}
.mk-gk-batt{width:25px;height:12px;border:1.3px solid rgba(255,255,255,.5);border-radius:4px;padding:1.5px;position:relative}
.mk-gk-batt::after{content:"";position:absolute;right:-3.5px;top:3.5px;width:1.6px;height:4px;border-radius:0 1px 1px 0;background:rgba(255,255,255,.5)}
.mk-gk-batt i{display:block;height:100%;width:78%;background:#fff;border-radius:2px}

/* scroll area */
.mk-gk-scroll{position:absolute;top:50px;left:0;right:0;bottom:0;overflow-y:auto;overflow-x:hidden;padding:6px 16px 112px;scrollbar-width:none}
.mk-gk-scroll::-webkit-scrollbar{display:none}

/* tab bar */
.mk-gk-tabs{position:absolute;left:0;right:0;bottom:0;height:86px;padding:8px 6px 0;display:grid;grid-template-columns:repeat(5,1fr);align-items:start;background:rgba(12,12,14,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--b);z-index:6}
.mk-gk-tab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 0;color:var(--t3);font-size:11px;font-weight:600;position:relative;transition:color .15s}
.mk-gk-tab:hover{color:var(--t2)}
.mk-gk-tab[aria-current="page"]{color:var(--neon)}
.mk-gk-tab[aria-current="page"]::before{content:"";position:absolute;top:-9px;width:22px;height:3px;border-radius:0 0 3px 3px;background:var(--neon);box-shadow:0 0 12px rgba(212,255,58,.7)}
.mk-gk-tab-badge{position:absolute;top:1px;left:calc(50% + 7px);min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--vio);color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;border:2px solid #0c0c0e;line-height:1}
.mk-gk-live-dot{position:absolute;top:3px;left:calc(50% + 8px);width:8px;height:8px;border-radius:50%;background:var(--neon);border:2px solid #0c0c0e}
.mk-gk-homebar{position:absolute;bottom:8px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#fff;z-index:7}

/* generic */
.mk-gk-view{display:flex;flex-direction:column;gap:14px}
.mk-gk-eyebrow{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.mk-gk-eyebrow.neon{color:var(--neon)}
.mk-gk-h1{font-size:32px;font-weight:900;letter-spacing:-.045em;line-height:1.02}
.mk-gk-sub{font-size:14px;color:var(--t2);margin-top:4px}
.mk-gk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding-top:6px}
.mk-gk-sec{display:flex;align-items:baseline;justify-content:space-between;margin:4px 0 -4px}
.mk-gk-sec h2{font-size:17px;font-weight:800;letter-spacing:-.03em}
.mk-gk-sec span{font-size:13px;color:var(--t3);font-weight:500}
.mk-gk-card{background:var(--s1);border:1px solid var(--b);border-radius:20px}
.mk-gk-icbtn{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;background:var(--s1);border:1px solid var(--b);color:var(--t1);position:relative;transition:background .15s}
.mk-gk-icbtn:hover{background:var(--s2)}
.mk-gk-icbtn .dot{position:absolute;top:9px;right:10px;width:8px;height:8px;border-radius:50%;background:var(--vio);border:2px solid var(--s1)}
.mk-gk-back{display:inline-flex;align-items:center;gap:2px;color:var(--t2);font-size:15px;font-weight:600;margin-left:-6px;padding:4px 6px 4px 0;border-radius:10px;align-self:flex-start}
.mk-gk-back:hover{color:var(--t1)}
.mk-gk-av{display:inline-grid;place-items:center;border-radius:50%;font-weight:800;letter-spacing:-.05em;flex:none;line-height:1}
.mk-gk-av-lime{background:var(--neon);color:#0b0b0b}
.mk-gk-av-violet{background:var(--vio);color:#fff}
.mk-gk-av-white{background:#ececec;color:#0b0b0b}
.mk-gk-pill{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 9px;border-radius:12px;font-size:11px;font-weight:700;letter-spacing:.01em;white-space:nowrap}
.mk-gk-pill.ready{background:rgba(212,255,58,.14);color:var(--neon)}
.mk-gk-pill.await{background:rgba(255,255,255,.08);color:#d4d4d8}
.mk-gk-pill.vio{background:rgba(139,92,246,.2);color:var(--vio2)}
.mk-gk-pill i{width:6px;height:6px;border-radius:50%;background:currentColor}
.mk-gk-bar{height:5px;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden}
.mk-gk-bar i{display:block;height:100%;border-radius:3px;background:var(--neon)}
.mk-gk-chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -16px;padding:0 16px}
.mk-gk-chip{height:34px;padding:0 14px;border-radius:17px;background:var(--s1);border:1px solid var(--b);font-size:13px;font-weight:600;color:var(--t2);white-space:nowrap;display:inline-flex;align-items:center;gap:6px;transition:background .15s,color .15s}
.mk-gk-chip:hover{color:var(--t1)}
.mk-gk-chip[aria-pressed="true"]{background:var(--t1);color:#0b0b0b;border-color:var(--t1)}
.mk-gk-chip b{font-weight:700;opacity:.55}
.mk-gk-btn{white-space:nowrap;height:44px;border-radius:14px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:800;letter-spacing:-.01em;transition:transform .12s,background .15s,color .15s}
.mk-gk-btn:active{transform:scale(.97)}
.mk-gk-btn.neon{background:var(--neon);color:#0b0b0b;box-shadow:0 6px 22px -8px rgba(212,255,58,.6)}
.mk-gk-btn.neon:hover{background:#e0ff6e}
.mk-gk-btn.ghost{background:var(--s2);color:var(--t1);border:1px solid var(--b2)}
.mk-gk-btn.ghost:hover{background:var(--s3)}
.mk-gk-btn.sm{height:36px;border-radius:12px;padding:0 14px;font-size:13px}

/* thumbnails */
.mk-gk-thumb{position:relative;overflow:hidden;isolation:isolate}
.mk-gk-art{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.mk-gk-thumb-shade{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%)}
.mk-gk-thumb > :not(.mk-gk-art):not(.mk-gk-thumb-shade){position:relative;z-index:2}
.mk-gk-shift .mk-gk-art{transform:translateX(24%) scale(1.05)}
.mk-gk-shift .mk-gk-thumb-shade{background:linear-gradient(90deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,0) 65%),linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.6) 100%)}
.mk-gk-dur{position:absolute !important;right:8px;bottom:8px;height:22px;padding:0 7px;border-radius:7px;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);font-size:11px;font-weight:700;display:inline-flex;align-items:center;font-variant-numeric:tabular-nums}

/* HOME */
.mk-gk-greet{display:flex;align-items:flex-start;justify-content:space-between;padding-top:6px}
.mk-gk-greet .r{display:flex;gap:8px;align-items:center}
.mk-gk-me{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:14px;background:linear-gradient(135deg,#2b2b31,#17171a);border:2px solid var(--neon);box-shadow:0 0 0 3px rgba(212,255,58,.12)}
.mk-gk-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mk-gk-streak{padding:14px 14px 14px;display:flex;flex-direction:column;justify-content:space-between;min-height:142px;background:radial-gradient(120% 80% at 100% 0%,rgba(212,255,58,.14),transparent 60%),var(--s1)}
.mk-gk-streak-top{display:flex;align-items:center;justify-content:space-between}
.mk-gk-flame{width:32px;height:32px;border-radius:10px;background:rgba(212,255,58,.14);color:var(--neon);display:grid;place-items:center}
.mk-gk-big{font-size:44px;font-weight:900;letter-spacing:-.06em;line-height:.9;font-variant-numeric:tabular-nums}
.mk-gk-big small{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--t2);margin-left:4px}
.mk-gk-days{display:flex;justify-content:space-between}
.mk-gk-days span{width:18px;height:18px;border-radius:6px;display:grid;place-items:center;font-size:11px;font-weight:700;background:rgba(255,255,255,.06);color:var(--t3)}
.mk-gk-days span.on{background:var(--neon);color:#0b0b0b}
.mk-gk-days span.today{box-shadow:inset 0 0 0 1.5px var(--neon);color:var(--neon);background:transparent}
.mk-gk-goal{padding:14px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;min-height:142px}
.mk-gk-goal-row{display:flex;align-items:center;gap:10px;width:100%}
.mk-gk-ring{position:relative;width:78px;height:78px;flex:none;margin-left:-2px}
.mk-gk-ring svg{transform:rotate(-90deg)}
.mk-gk-ring circle{transition:stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)}
.mk-gk-ring-n{position:absolute;inset:0;display:grid;place-items:center;font-size:20px;font-weight:900;letter-spacing:-.04em}
.mk-gk-ring-n small{font-size:13px;color:var(--t3);font-weight:700}
.mk-gk-goal-meta{font-size:13px;color:var(--t2);line-height:1.3;white-space:nowrap}
.mk-gk-goal-meta b{display:block;color:var(--t1);font-size:15px;font-weight:800;letter-spacing:-.02em}
.mk-gk-notif{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 12px;border-radius:20px;width:100%;
  background:linear-gradient(120deg,rgba(139,92,246,.3),rgba(139,92,246,.08) 70%);border:1px solid rgba(139,92,246,.45);transition:border-color .15s,transform .12s}
.mk-gk-notif:hover{border-color:rgba(167,139,250,.8)}
.mk-gk-notif:active{transform:scale(.99)}
.mk-gk-notif .txt{flex:1;min-width:0}
.mk-gk-notif .t{font-size:15px;font-weight:800;letter-spacing:-.02em;display:flex;align-items:center;gap:6px}
.mk-gk-notif .d{font-size:13px;color:#cfc6f0;margin-top:2px}
.mk-gk-notif .chev{width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.08);display:grid;place-items:center;flex:none}
.mk-gk-drill{overflow:hidden;padding:0}
.mk-gk-drill .mk-gk-thumb{height:150px;padding:14px;display:flex;flex-direction:column;justify-content:space-between}
.mk-gk-drill-top{display:flex;justify-content:space-between;align-items:center}
.mk-gk-tag{white-space:nowrap;height:24px;padding:0 9px;border-radius:8px;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:5px;letter-spacing:.02em}
.mk-gk-tag.neon{background:var(--neon);color:#0b0b0b}
.mk-gk-drill-title{font-size:27px;font-weight:900;letter-spacing:-.045em;line-height:1;text-transform:uppercase;text-shadow:0 2px 18px rgba(0,0,0,.5)}
.mk-gk-drill-body{padding:12px 14px 14px;display:flex;align-items:center;gap:12px}
.mk-gk-drill-meta{flex:1;display:flex;gap:14px}
.mk-gk-drill-meta div{font-size:12px;color:var(--t3);font-weight:500}
.mk-gk-drill-meta b{display:block;font-size:15px;color:var(--t1);font-weight:800;letter-spacing:-.02em}
.mk-gk-done{background:rgba(212,255,58,.12) !important;color:var(--neon) !important;box-shadow:none !important;border:1px solid rgba(212,255,58,.35) !important}
.mk-gk-next{display:flex;align-items:center;gap:12px;padding:12px}
.mk-gk-next .cal{width:46px;height:50px;border-radius:14px;background:var(--s2);border:1px solid var(--b);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none}
.mk-gk-next .cal small{font-size:11px;font-weight:700;color:var(--neon);text-transform:uppercase;letter-spacing:.06em}
.mk-gk-next .cal b{font-size:19px;font-weight:900;letter-spacing:-.04em;line-height:1}
.mk-gk-next .txt{flex:1;min-width:0}
.mk-gk-next .t{font-size:15px;font-weight:800;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-gk-next .d{font-size:13px;color:var(--t2);margin-top:2px}

/* LEARN */
.mk-gk-courses{display:flex;flex-direction:column;gap:10px}
.mk-gk-course{display:flex;gap:12px;padding:10px;width:100%;align-items:stretch;transition:background .15s,border-color .15s}
.mk-gk-course:hover{background:var(--s2);border-color:var(--b2)}
.mk-gk-course .mk-gk-thumb{width:86px;height:92px;border-radius:14px;flex:none;display:flex;align-items:flex-end;padding:7px}
.mk-gk-course .info{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;padding:2px 2px 2px 0}
.mk-gk-course .top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.mk-gk-course .ttl{display:block;font-size:16px;font-weight:800;letter-spacing:-.03em;line-height:1.15;margin-top:3px}
.mk-gk-coachline{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--t2);white-space:nowrap}
.mk-gk-coachline .sep{color:var(--t3)}
.mk-gk-prog{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--t3);font-variant-numeric:tabular-nums}
.mk-gk-prog .mk-gk-bar{flex:1}
.mk-gk-new{font-size:11px;font-weight:800;color:#0b0b0b;background:var(--neon);padding:3px 7px;border-radius:6px;letter-spacing:.04em}
.mk-gk-complete{font-size:11px;font-weight:700;color:var(--neon);display:inline-flex;align-items:center;gap:3px}
.mk-gk-hero{height:196px;border-radius:22px;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;gap:8px}
.mk-gk-hero h1{font-size:30px;font-weight:900;letter-spacing:-.045em;line-height:1;text-transform:uppercase;text-shadow:0 2px 18px rgba(0,0,0,.55)}
.mk-gk-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mk-gk-fact{padding:10px 12px;border-radius:16px;background:var(--s1);border:1px solid var(--b)}
.mk-gk-fact small{display:block;font-size:11px;color:var(--t3);font-weight:600}
.mk-gk-fact b{font-size:16px;font-weight:800;letter-spacing:-.03em}
.mk-gk-resume{padding:14px;display:flex;flex-direction:column;gap:12px}
.mk-gk-resume-top{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--t2)}
.mk-gk-resume-top b{font-size:22px;color:var(--t1);font-weight:900;letter-spacing:-.04em;margin-right:4px}
.mk-gk-lessons{display:flex;flex-direction:column}
.mk-gk-lesson{display:flex;align-items:center;gap:12px;padding:10px 10px;border-radius:14px;width:100%;transition:background .15s}
.mk-gk-lesson:hover{background:var(--s1)}
.mk-gk-lesson[aria-current="true"]{background:var(--s1);box-shadow:inset 0 0 0 1px rgba(212,255,58,.35)}
.mk-gk-lnum{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;font-size:13px;font-weight:800;background:var(--s2);color:var(--t2);flex:none;font-variant-numeric:tabular-nums}
.mk-gk-lnum.done{background:rgba(212,255,58,.14);color:var(--neon)}
.mk-gk-lnum.cur{background:var(--neon);color:#0b0b0b}
.mk-gk-lesson .lt{flex:1;min-width:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-gk-lesson .lt small{display:block;font-size:12px;color:var(--t3);font-weight:500;margin-top:1px}
.mk-gk-lesson .ld{font-size:12px;color:var(--t3);font-weight:600;font-variant-numeric:tabular-nums}

/* CLIPS */
.mk-gk-quota{display:flex;align-items:center;gap:12px;padding:12px 14px}
.mk-gk-quota .txt{flex:1;font-size:13px;color:var(--t2)}
.mk-gk-quota .txt b{color:var(--t1);font-weight:800}
.mk-gk-quota .mk-gk-bar{margin-top:7px}
.mk-gk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mk-gk-clip{display:flex;flex-direction:column;overflow:hidden;width:100%;transition:border-color .15s,transform .12s}
.mk-gk-clip:hover{border-color:var(--b2)}
.mk-gk-clip:active{transform:scale(.98)}
.mk-gk-clip .mk-gk-thumb{height:108px;padding:8px}
.mk-gk-clip .body{padding:10px 11px 12px;display:flex;flex-direction:column;gap:4px}
.mk-gk-clip .ttl{font-size:14px;font-weight:700;letter-spacing:-.02em;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:34px}
.mk-gk-clip .m{font-size:12px;color:var(--t3);display:flex;align-items:center;gap:6px}
.mk-gk-player{border-radius:20px;overflow:hidden;position:relative}
.mk-gk-player .mk-gk-thumb{height:236px}
.mk-gk-player .mk-gk-art{transform:translateY(-11%)}
.mk-gk-player .mk-gk-thumb-shade{background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 60%,rgba(0,0,0,.6) 100%)}
.mk-gk-pbtn{position:absolute !important;left:50%;top:38%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:rgba(212,255,58,.95);color:#0b0b0b;display:grid;place-items:center;box-shadow:0 10px 30px -6px rgba(0,0,0,.6),0 0 0 8px rgba(212,255,58,.18);transition:transform .15s}
.mk-gk-pbtn:hover{transform:scale(1.05)}
.mk-gk-pbtn.playing{opacity:.0}
.mk-gk-player:hover .mk-gk-pbtn.playing{opacity:.85}
.mk-gk-ptop{position:absolute !important;top:10px;left:10px;right:10px;display:flex;justify-content:space-between}
.mk-gk-pnote{position:absolute !important;left:10px;right:10px;bottom:10px;padding:8px 10px;border-radius:12px;background:rgba(10,10,14,.72);backdrop-filter:blur(10px);font-size:13px;line-height:1.3;display:flex;gap:8px;align-items:flex-start;border:1px solid rgba(139,92,246,.4)}
.mk-gk-scrub{padding:14px 2px 0}
.mk-gk-track{position:relative;height:28px;width:100%;display:block}
.mk-gk-track .rail{position:absolute;left:0;right:0;top:11px;height:6px;border-radius:3px;background:rgba(255,255,255,.1)}
.mk-gk-track .fill{position:absolute;left:0;top:11px;height:6px;border-radius:3px;background:var(--neon)}
.mk-gk-track .head{position:absolute;top:6px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(212,255,58,.3)}
.mk-gk-mark{position:absolute;top:2px;width:24px;height:24px;margin-left:-12px;display:grid;place-items:center;z-index:2}
.mk-gk-mark i{width:12px;height:12px;border-radius:4px;transform:rotate(45deg);background:var(--vio);border:2px solid var(--bg);transition:transform .15s}
.mk-gk-mark.good i{background:var(--vio2)}
.mk-gk-mark[aria-pressed="true"] i{transform:rotate(45deg) scale(1.35);box-shadow:0 0 0 3px rgba(139,92,246,.35)}
.mk-gk-times{display:flex;justify-content:space-between;font-size:12px;color:var(--t3);font-weight:600;font-variant-numeric:tabular-nums;margin-top:2px}
.mk-gk-coachhead{display:flex;align-items:center;gap:10px}
.mk-gk-coachhead .n{flex:1;font-size:15px;font-weight:800;letter-spacing:-.02em}
.mk-gk-coachhead .n small{display:block;font-size:12px;color:var(--t3);font-weight:500;letter-spacing:0}
.mk-gk-score{text-align:right;font-size:11px;color:var(--t3);font-weight:600}
.mk-gk-score b{display:block;font-size:24px;font-weight:900;letter-spacing:-.05em;color:var(--neon);line-height:1}
.mk-gk-notes{display:flex;flex-direction:column;gap:8px}
.mk-gk-note{display:flex;gap:10px;padding:11px 12px;border-radius:16px;background:var(--s1);border:1px solid var(--b);width:100%;font-size:14px;line-height:1.35;color:var(--t2);transition:background .15s,border-color .15s}
.mk-gk-note:hover{background:var(--s2)}
.mk-gk-note[aria-pressed="true"]{border-color:rgba(139,92,246,.6);background:linear-gradient(120deg,rgba(139,92,246,.18),rgba(139,92,246,.04));color:var(--t1)}
.mk-gk-ts{height:22px;padding:0 7px;border-radius:7px;background:rgba(139,92,246,.2);color:var(--vio2);font-size:12px;font-weight:800;display:inline-flex;align-items:center;flex:none;font-variant-numeric:tabular-nums;margin-top:-1px}
.mk-gk-ts.good{background:rgba(212,255,58,.12);color:var(--neon)}
.mk-gk-focus{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:12px;color:var(--t3);font-weight:600}
.mk-gk-steps{display:flex;flex-direction:column;gap:0;padding:14px}
.mk-gk-step{display:flex;gap:12px;position:relative;padding-bottom:16px}
.mk-gk-step:last-child{padding-bottom:0}
.mk-gk-step::before{content:"";position:absolute;left:11px;top:24px;bottom:0;width:2px;background:var(--s3)}
.mk-gk-step:last-child::before{display:none}
.mk-gk-step .k{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:none;background:var(--neon);color:#0b0b0b}
.mk-gk-step .k.wait{background:transparent;box-shadow:inset 0 0 0 2px var(--vio);color:var(--vio)}
.mk-gk-step .t{font-size:14px;font-weight:700}
.mk-gk-step .t small{display:block;font-size:12px;color:var(--t3);font-weight:500;margin-top:1px}

/* LIVE */
.mk-gk-now{border-radius:22px;overflow:hidden;border:1px solid rgba(212,255,58,.3)}
.mk-gk-now .mk-gk-thumb{height:170px;padding:14px;display:flex;flex-direction:column;justify-content:space-between}
.mk-gk-onair{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:9px;background:#0b0b0b;color:var(--neon);font-size:11px;font-weight:800;letter-spacing:.08em}
.mk-gk-onair i{width:7px;height:7px;border-radius:50%;background:var(--neon);box-shadow:0 0 0 0 rgba(212,255,58,.6)}
.mk-gk-now-title{font-size:28px;font-weight:900;letter-spacing:-.045em;line-height:1.02;text-transform:uppercase;text-shadow:0 2px 18px rgba(0,0,0,.55)}
.mk-gk-now-body{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--s1)}
.mk-gk-stack{display:flex}
.mk-gk-stack span{width:26px;height:26px;border-radius:50%;border:2px solid var(--s1);margin-left:-6px;display:grid;place-items:center;font-size:11px;font-weight:800;letter-spacing:-.05em}
.mk-gk-stack span:first-child{margin-left:0}
.mk-gk-now-body .w{flex:1;font-size:13px;color:var(--t2)}
.mk-gk-now-body .w b{color:var(--t1);font-weight:800}
.mk-gk-sessions{display:flex;flex-direction:column;gap:10px}
.mk-gk-sess{display:flex;flex-direction:column;gap:12px;padding:12px}
.mk-gk-sess-top{display:flex;gap:12px;align-items:center}
.mk-gk-sess-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:12px;border-top:1px solid var(--b)}
.mk-gk-date{width:50px;height:58px;border-radius:14px;background:var(--s2);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;border:1px solid var(--b)}
.mk-gk-date small{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em}
.mk-gk-date b{font-size:22px;font-weight:900;letter-spacing:-.05em;line-height:1}
.mk-gk-date.today{background:rgba(212,255,58,.1);border-color:rgba(212,255,58,.3)}
.mk-gk-date.today small{color:var(--neon)}
.mk-gk-sess .txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.mk-gk-sess .t{font-size:15px;font-weight:800;letter-spacing:-.025em;line-height:1.15}
.mk-gk-sess .d{font-size:12px;color:var(--t2);display:flex;align-items:center;gap:5px;white-space:nowrap}
.mk-gk-sess .d .sep{color:var(--t3)}
.mk-gk-spots{white-space:nowrap;font-size:11px;color:var(--t3);font-weight:600;display:flex;align-items:center;gap:6px}
.mk-gk-spots .mk-gk-bar{width:64px;height:4px}
.mk-gk-join{min-width:94px}
.mk-gk-join[aria-pressed="true"]{background:rgba(139,92,246,.18);color:var(--vio2);border:1px solid rgba(139,92,246,.5);box-shadow:none}
.mk-gk-join[aria-pressed="true"]:hover{background:rgba(139,92,246,.26)}

/* PROFILE */
.mk-gk-prof{display:flex;flex-direction:column;align-items:center;text-align:center;padding:10px 0 2px;gap:6px}
.mk-gk-prof .me{width:84px;height:84px;border-radius:50%;display:grid;place-items:center;font-size:28px;font-weight:900;letter-spacing:-.04em;background:linear-gradient(135deg,#2c2c33,#141417);border:3px solid var(--neon);box-shadow:0 0 0 6px rgba(212,255,58,.1),0 0 40px -6px rgba(212,255,58,.4);margin-bottom:6px}
.mk-gk-prof h1{font-size:26px;font-weight:900;letter-spacing:-.045em}
.mk-gk-prof p{font-size:14px;color:var(--t2)}
.mk-gk-trio{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mk-gk-trio div{padding:12px;border-radius:18px;background:var(--s1);border:1px solid var(--b);text-align:center}
.mk-gk-trio b{display:block;font-size:24px;font-weight:900;letter-spacing:-.05em}
.mk-gk-trio small{font-size:12px;color:var(--t3);font-weight:600}
.mk-gk-badges{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mk-gk-badge{padding:12px 8px;border-radius:18px;background:var(--s1);border:1px solid var(--b);display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px;font-weight:700;text-align:center;line-height:1.2}
.mk-gk-badge .b{width:44px;height:44px;border-radius:14px;display:grid;place-items:center}
.mk-gk-badge.lock{color:var(--t3)}
.mk-gk-rows{overflow:hidden}
.mk-gk-row{display:flex;align-items:center;gap:12px;padding:13px 14px;width:100%;border-bottom:1px solid var(--b)}
.mk-gk-row:last-child{border-bottom:0}
.mk-gk-row .ic{width:32px;height:32px;border-radius:10px;background:var(--s2);display:grid;place-items:center;color:var(--t2);flex:none}
.mk-gk-row .t{flex:1;font-size:14px;font-weight:600}
.mk-gk-row .t small{display:block;font-size:12px;color:var(--t3);font-weight:500}
.mk-gk-row .v{font-size:13px;color:var(--t3)}
.mk-gk-toggle{width:46px;height:28px;border-radius:14px;background:var(--s3);position:relative;transition:background .2s;flex:none}
.mk-gk-toggle::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s cubic-bezier(.2,.8,.2,1)}
.mk-gk-toggle[aria-pressed="true"]{background:var(--neon)}
.mk-gk-toggle[aria-pressed="true"]::after{transform:translateX(18px);background:#0b0b0b}

@media (prefers-reduced-motion: no-preference){
  .mk-gk-view{animation:mk-gk-in .28s cubic-bezier(.2,.8,.2,1)}
  .mk-gk-onair i,.mk-gk-live-dot{animation:mk-gk-pulse 1.6s infinite}
  .mk-gk-eq i{animation:mk-gk-eq .9s ease-in-out infinite}
  .mk-gk-eq i:nth-child(2){animation-delay:.15s}
  .mk-gk-eq i:nth-child(3){animation-delay:.3s}
}
@keyframes mk-gk-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes mk-gk-pulse{0%{box-shadow:0 0 0 0 rgba(212,255,58,.6)}70%{box-shadow:0 0 0 7px rgba(212,255,58,0)}100%{box-shadow:0 0 0 0 rgba(212,255,58,0)}}
@keyframes mk-gk-eq{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
.mk-gk-eq{display:inline-flex;gap:2px;align-items:flex-end;height:11px}
.mk-gk-eq i{width:3px;height:11px;background:var(--neon);border-radius:1px;transform-origin:bottom}
`;

/* ------------------------------------------------------------------ */
/* Status bar                                                          */
/* ------------------------------------------------------------------ */

function StatusBar() {
  return (
    <div className="mk-gk-status">
      <span className="mk-gk-time">9:41</span>
      <span className="mk-gk-sys" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#fff">
          <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .6 10.4 10.4 0 0 0 .8 3.5L2 4.8a8.6 8.6 0 0 1 6-2.4z" />
          <path d="M8 5.9c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 4.1 7 7 0 0 0 3.2 6l1.2 1.3c1-.9 2.2-1.4 3.6-1.4z" />
          <path d="M8 9.3c.5 0 1 .2 1.3.5L8 11.4 6.7 9.8c.3-.3.8-.5 1.3-.5z" />
        </svg>
        <span className="mk-gk-batt">
          <i />
        </span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

function Home({
  drillDone,
  setDrillDone,
  reminders,
  toggleReminder,
  openClip,
  goLive,
}: {
  drillDone: boolean;
  setDrillDone: (v: boolean) => void;
  reminders: Record<string, boolean>;
  toggleReminder: (id: string) => void;
  openClip: (id: string) => void;
  goLive: () => void;
}) {
  const sessions = drillDone ? 5 : 4;
  const streak = drillDone ? 13 : 12;
  const R = 32;
  const C = 2 * Math.PI * R;
  const next = SESSIONS[0];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="mk-gk-view">
      <div className="mk-gk-greet">
        <div>
          <p className="mk-gk-eyebrow neon">Wednesday 28 Oct</p>
          <h1 className="mk-gk-h1" style={{ marginTop: 6 }}>
            Morning, Alfie
          </h1>
        </div>
        <div className="r">
          <button type="button" className="mk-gk-icbtn" aria-label="Notifications">
            <Ico d={I.bell} size={20} />
            <span className="dot" />
          </button>
          <span className="mk-gk-me" aria-hidden="true">
            AR
          </span>
        </div>
      </div>

      <div className="mk-gk-stats">
        <div className="mk-gk-card mk-gk-streak">
          <div className="mk-gk-streak-top">
            <span className="mk-gk-flame">
              <Ico d={I.flame} fill size={18} />
            </span>
            <span className="mk-gk-eyebrow">Streak</span>
          </div>
          <div className="mk-gk-big">
            {streak}
            <small>days</small>
          </div>
          <div className="mk-gk-days">
            {days.map((d, i) => (
              <span
                key={i}
                className={i < 2 || (i === 2 && drillDone) ? "on" : i === 2 ? "today" : ""}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="mk-gk-card mk-gk-goal">
          <span className="mk-gk-eyebrow">Weekly goal</span>
          <div className="mk-gk-goal-row">
            <div className="mk-gk-ring">
              <svg width="78" height="78" viewBox="0 0 78 78">
                <circle
                  cx="39"
                  cy="39"
                  r={R}
                  fill="none"
                  stroke="rgba(255,255,255,.08)"
                  strokeWidth="8"
                />
                <circle
                  cx="39"
                  cy="39"
                  r={R}
                  fill="none"
                  stroke="#d4ff3a"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - sessions / 5)}
                />
              </svg>
              <span className="mk-gk-ring-n">
                <span>
                  {sessions}
                  <small>/5</small>
                </span>
              </span>
            </div>
            <div className="mk-gk-goal-meta">
              <b>{drillDone ? "Goal hit" : "1 to go"}</b>
              {drillDone ? "5 of 5 done" : "4 of 5 done"}
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="mk-gk-notif" onClick={() => openClip("c1")}>
        <Avatar id="DM" size={42} />
        <span className="txt">
          <span className="t">Coach feedback ready</span>
          <span className="d" style={{ display: "block" }}>
            Dan left 4 notes on your low dive
          </span>
        </span>
        <span className="chev">
          <Ico d={I.chevR} size={16} sw={2.4} />
        </span>
      </button>

      <div className="mk-gk-sec">
        <h2>Today&rsquo;s drill</h2>
        <span>Week 6 plan</span>
      </div>
      <div className="mk-gk-card mk-gk-drill">
        <Thumb art="wall" tone="lime" className="mk-gk-shift">
          <div className="mk-gk-drill-top">
            <span className="mk-gk-tag neon">
              <Ico d={I.clock} size={12} sw={2.6} /> 18 MIN
            </span>
            <span className="mk-gk-tag">
              <Avatar id="MH" size={20} /> Marcus Hale
            </span>
          </div>
          <div className="mk-gk-drill-title">
            Reaction
            <br />
            wall
          </div>
        </Thumb>
        <div className="mk-gk-drill-body">
          <div className="mk-gk-drill-meta">
            <div>
              <b>3 × 40</b>reps
            </div>
            <div>
              <b>Reflexes</b>focus
            </div>
          </div>
          <button
            type="button"
            className={`mk-gk-btn neon sm${drillDone ? " mk-gk-done" : ""}`}
            aria-pressed={drillDone}
            onClick={() => setDrillDone(!drillDone)}
          >
            {drillDone ? (
              <>
                <Ico d={I.check} size={16} sw={3} /> Done
              </>
            ) : (
              <>
                <Ico d={I.play} size={14} fill /> Start drill
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mk-gk-sec">
        <h2>Live tonight</h2>
        <button
          type="button"
          onClick={goLive}
          style={{ fontSize: 13, color: "var(--t2)", fontWeight: 600 }}
        >
          See all
        </button>
      </div>
      <div className="mk-gk-card mk-gk-next">
        <span className="cal">
          <small>{next.time}</small>
          <b>{next.day}</b>
        </span>
        <span className="txt">
          <span className="t" style={{ display: "block" }}>
            {next.title}
          </span>
          <span className="d" style={{ display: "block" }}>
            {COACHES[next.coach].name} · {next.mins} min
          </span>
        </span>
        <button
          type="button"
          className={`mk-gk-btn sm mk-gk-join ${reminders[next.id] ? "" : "neon"}`}
          style={{ minWidth: 0 }}
          aria-pressed={!!reminders[next.id]}
          aria-label={reminders[next.id] ? "Reminder set" : "Join session"}
          onClick={() => toggleReminder(next.id)}
        >
          {reminders[next.id] ? <Ico d={I.bellOn} size={16} /> : "Join"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Learn                                                               */
/* ------------------------------------------------------------------ */

type LearnFilter = "all" | "progress" | "new" | "done";

function Learn({
  courseId,
  openCourse,
}: {
  courseId: string | null;
  openCourse: (id: string | null) => void;
}) {
  const [filter, setFilter] = useState<LearnFilter>("all");
  const [current, setCurrent] = useState<Record<string, number>>({});

  const course = COURSES.find((c) => c.id === courseId);
  if (course) {
    const coach = COACHES[course.coach];
    const pct = Math.round((course.done / course.lessons.length) * 100);
    const cur = current[course.id] ?? Math.min(course.done, course.lessons.length - 1);
    const complete = course.done === course.lessons.length;
    return (
      <div className="mk-gk-view">
        <button type="button" className="mk-gk-back" onClick={() => openCourse(null)}>
          <Ico d={I.chevL} size={20} sw={2.4} /> Learn
        </button>
        <Thumb art={course.art} tone={course.tone} className="mk-gk-hero mk-gk-shift">
          <span className="mk-gk-eyebrow neon">{course.level} course</span>
          <h1>{course.title}</h1>
          <span className="mk-gk-coachline" style={{ color: "#e4e4e7" }}>
            <Avatar id={course.coach} size={22} /> {coach.name} <span className="sep">·</span>{" "}
            {coach.role}
          </span>
        </Thumb>
        <div className="mk-gk-facts">
          <div className="mk-gk-fact">
            <small>Lessons</small>
            <b>{course.lessons.length}</b>
          </div>
          <div className="mk-gk-fact">
            <small>Total</small>
            <b>{courseTotal(course)}</b>
          </div>
          <div className="mk-gk-fact">
            <small>Drills</small>
            <b>{course.lessons.length * 2 + 3}</b>
          </div>
        </div>
        <div className="mk-gk-card mk-gk-resume">
          <div className="mk-gk-resume-top">
            <span>
              <b>{pct}%</b>complete
            </span>
            <span>
              {course.done}/{course.lessons.length} lessons
            </span>
          </div>
          <div className="mk-gk-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
          <button
            type="button"
            className="mk-gk-btn neon"
            onClick={() => setCurrent({ ...current, [course.id]: cur })}
          >
            <Ico d={I.play} size={14} fill />
            {complete
              ? "Watch again"
              : course.done === 0
                ? "Start course"
                : `Resume lesson ${cur + 1}`}
          </button>
        </div>
        <div className="mk-gk-sec">
          <h2>Lessons</h2>
          <span>{courseTotal(course)}</span>
        </div>
        <ol className="mk-gk-lessons">
          {course.lessons.map((l, i) => {
            const done = i < course.done;
            const isCur = i === cur;
            return (
              <li key={l.title}>
                <button
                  type="button"
                  className="mk-gk-lesson"
                  aria-current={isCur ? "true" : undefined}
                  onClick={() => setCurrent({ ...current, [course.id]: i })}
                >
                  <span className={`mk-gk-lnum${isCur ? " cur" : done ? " done" : ""}`}>
                    {isCur ? (
                      <Ico d={I.play} size={13} fill />
                    ) : done ? (
                      <Ico d={I.check} size={15} sw={3} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="lt">
                    {l.title}
                    <small>
                      {isCur ? "Up next" : done ? "Watched" : `Lesson ${i + 1} · 2 drills`}
                    </small>
                  </span>
                  <span className="ld">{mmss(l.secs)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const counts = {
    all: COURSES.length,
    progress: COURSES.filter((c) => c.done > 0 && c.done < c.lessons.length).length,
    new: COURSES.filter((c) => c.isNew).length,
    done: COURSES.filter((c) => c.done === c.lessons.length).length,
  };
  const list = COURSES.filter((c) =>
    filter === "all"
      ? true
      : filter === "progress"
        ? c.done > 0 && c.done < c.lessons.length
        : filter === "new"
          ? c.isNew
          : c.done === c.lessons.length,
  );
  const labels: [LearnFilter, string][] = [
    ["all", "All"],
    ["progress", "In progress"],
    ["new", "New"],
    ["done", "Completed"],
  ];
  return (
    <div className="mk-gk-view">
      <div className="mk-gk-head">
        <div>
          <h1 className="mk-gk-h1">Learn</h1>
          <p className="mk-gk-sub">Courses from professional keepers</p>
        </div>
        <button type="button" className="mk-gk-icbtn" aria-label="Search courses">
          <Ico d={I.search} size={20} />
        </button>
      </div>
      <div className="mk-gk-chips">
        {labels.map(([k, label]) => (
          <button
            key={k}
            type="button"
            className="mk-gk-chip"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
          >
            {label} <b>{counts[k]}</b>
          </button>
        ))}
      </div>
      <div className="mk-gk-courses">
        {list.map((c) => {
          const pct = Math.round((c.done / c.lessons.length) * 100);
          const complete = c.done === c.lessons.length;
          return (
            <button
              key={c.id}
              type="button"
              className="mk-gk-card mk-gk-course"
              onClick={() => openCourse(c.id)}
            >
              <Thumb art={c.art} tone={c.tone}>
                <span className="mk-gk-tag">{c.lessons.length} lessons</span>
              </Thumb>
              <span className="info">
                <span>
                  <span className="top">
                    <span className="mk-gk-eyebrow">{c.level}</span>
                    {c.isNew ? (
                      <span className="mk-gk-new">NEW</span>
                    ) : complete ? (
                      <span className="mk-gk-complete">
                        <Ico d={I.check} size={13} sw={3} /> Complete
                      </span>
                    ) : null}
                  </span>
                  <span className="ttl">{c.title}</span>
                </span>
                <span className="mk-gk-coachline">
                  <Avatar id={c.coach} size={20} /> {COACHES[c.coach].name}
                  <span className="sep">·</span> {courseTotal(c)}
                </span>
                <span className="mk-gk-prog">
                  <span className="mk-gk-bar">
                    <i style={{ width: `${pct}%` }} />
                  </span>
                  {c.done}/{c.lessons.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Clips                                                               */
/* ------------------------------------------------------------------ */

type ClipFilter = "all" | "ready" | "awaiting";

function ClipPlayer({ clip }: { clip: Clip }) {
  const [time, setTime] = useState(clip.notes[0]?.t ?? 0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTime((t) => {
        if (t + 0.25 >= clip.secs) {
          setPlaying(false);
          return clip.secs;
        }
        return t + 0.25;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing, clip.secs]);

  const active = [...clip.notes].reverse().find((n) => n.t <= time + 0.01) ?? null;
  const coach = COACHES[clip.coach];
  const pct = (time / clip.secs) * 100;

  return (
    <>
      <div className="mk-gk-player">
        <Thumb art={clip.art} tone={clip.tone}>
          <div className="mk-gk-ptop">
            <span className="mk-gk-tag">
              {playing ? (
                <span className="mk-gk-eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
              {mmss(time)} / {mmss(clip.secs)}
            </span>
            <span className="mk-gk-tag">1080p · 60fps</span>
          </div>
          <button
            type="button"
            className={`mk-gk-pbtn${playing ? " playing" : ""}`}
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (time >= clip.secs) setTime(0);
              setPlaying(!playing);
            }}
          >
            <Ico d={playing ? I.pause : I.play} size={24} fill />
          </button>
          {active && !playing ? (
            <div className="mk-gk-pnote">
              <Avatar id={clip.coach} size={22} />
              <span>{active.text}</span>
            </div>
          ) : null}
        </Thumb>
      </div>
      <div className="mk-gk-scrub">
        <div
          className="mk-gk-track"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            setTime(Math.round(p * clip.secs * 4) / 4);
          }}
        >
          <span className="rail" />
          <span className="fill" style={{ width: `${pct}%` }} />
          {clip.notes.map((n) => (
            <button
              key={n.t}
              type="button"
              className={`mk-gk-mark ${n.kind}`}
              style={{ left: `${(n.t / clip.secs) * 100}%` }}
              aria-label={`Coach note at ${mmss(n.t)}`}
              aria-pressed={active?.t === n.t}
              onClick={(e) => {
                e.stopPropagation();
                setPlaying(false);
                setTime(n.t);
              }}
            >
              <i />
            </button>
          ))}
          <span className="head" style={{ left: `${pct}%` }} />
        </div>
        <div className="mk-gk-times">
          <span>{mmss(time)}</span>
          <span>{clip.notes.length} coach notes</span>
          <span>{mmss(clip.secs)}</span>
        </div>
      </div>
      <div className="mk-gk-coachhead">
        <Avatar id={clip.coach} size={40} />
        <span className="n">
          {coach.name}
          <small>
            {coach.role} · reviewed {clip.date}
          </small>
        </span>
        <span className="mk-gk-score">
          <b>{clip.score}</b>
          out of 10
        </span>
      </div>
      <div className="mk-gk-notes">
        {clip.notes.map((n) => (
          <button
            key={n.t}
            type="button"
            className="mk-gk-note"
            aria-pressed={active?.t === n.t}
            onClick={() => {
              setPlaying(false);
              setTime(n.t);
            }}
          >
            <span className={`mk-gk-ts ${n.kind}`}>{mmss(n.t)}</span>
            <span>{n.text}</span>
          </button>
        ))}
      </div>
      {clip.focus ? (
        <div className="mk-gk-focus">
          Focus next:
          {clip.focus.map((f) => (
            <span key={f} className="mk-gk-pill vio">
              {f}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

function Clips({
  clipId,
  openClip,
  openCourse,
}: {
  clipId: string | null;
  openClip: (id: string | null) => void;
  openCourse: (id: string) => void;
}) {
  const [filter, setFilter] = useState<ClipFilter>("all");
  const clip = CLIPS.find((c) => c.id === clipId);

  if (clip) {
    const coach = COACHES[clip.coach];
    return (
      <div className="mk-gk-view">
        <button type="button" className="mk-gk-back" onClick={() => openClip(null)}>
          <Ico d={I.chevL} size={20} sw={2.4} /> My clips
        </button>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className={`mk-gk-pill ${clip.status === "ready" ? "ready" : "await"}`}>
              <i /> {clip.status === "ready" ? "Feedback ready" : "Awaiting feedback"}
            </span>
            <span style={{ fontSize: 13, color: "var(--t3)" }}>Uploaded {clip.date}</span>
          </div>
          <h1 className="mk-gk-h1" style={{ fontSize: 26 }}>
            {clip.title}
          </h1>
        </div>
        {clip.status === "ready" ? (
          <ClipPlayer key={clip.id} clip={clip} />
        ) : (
          <>
            <div className="mk-gk-player">
              <Thumb art={clip.art} tone={clip.tone}>
                <div className="mk-gk-ptop">
                  <span className="mk-gk-tag">0:00 / {mmss(clip.secs)}</span>
                  <span className="mk-gk-tag">1080p · 60fps</span>
                </div>
                <span className="mk-gk-pbtn" aria-hidden="true">
                  <Ico d={I.play} size={24} fill />
                </span>
              </Thumb>
            </div>
            <div className="mk-gk-card mk-gk-steps">
              <div className="mk-gk-step">
                <span className="k">
                  <Ico d={I.check} size={14} sw={3} />
                </span>
                <span className="t">
                  Clip uploaded
                  <small>{clip.date}, 19:12 · 214 MB</small>
                </span>
              </div>
              <div className="mk-gk-step">
                <span className="k">
                  <Ico d={I.check} size={14} sw={3} />
                </span>
                <span className="t">
                  Assigned to {coach.name}
                  <small>{coach.role}</small>
                </span>
              </div>
              <div className="mk-gk-step">
                <span className="k wait">
                  <Ico d={I.clock} size={14} sw={2.6} />
                </span>
                <span className="t">
                  Coach review in progress
                  <small>Usually back within 24 hours. We&rsquo;ll notify you.</small>
                </span>
              </div>
            </div>
            <div className="mk-gk-sec">
              <h2>While you wait</h2>
              <span>Picked for this clip</span>
            </div>
            <button
              type="button"
              className="mk-gk-card mk-gk-course"
              onClick={() => openCourse(clip.art === "kick" ? "dist" : "cross")}
            >
              <Thumb
                art={clip.art === "kick" ? "kick" : "cross"}
                tone={clip.art === "kick" ? "pitch" : "violet"}
              >
                <span className="mk-gk-tag">{clip.art === "kick" ? "7:45" : "8:20"}</span>
              </Thumb>
              <span className="info">
                <span>
                  <span className="mk-gk-eyebrow">
                    {clip.art === "kick" ? "Distribution · Lesson 2" : "Crosses · Lesson 4"}
                  </span>
                  <span className="ttl">
                    {clip.art === "kick"
                      ? "Driven passes to the full-back"
                      : "Take-off leg and knee drive"}
                  </span>
                </span>
                <span className="mk-gk-coachline">
                  <Avatar id={clip.art === "kick" ? "DM" : "SL"} size={20} />{" "}
                  {clip.art === "kick" ? "Dan Mercer" : "Sofia Lindqvist"}
                </span>
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  const list = CLIPS.filter((c) => filter === "all" || c.status === filter);
  const ready = CLIPS.filter((c) => c.status === "ready").length;
  const opts: [ClipFilter, string, number][] = [
    ["all", "All", CLIPS.length],
    ["ready", "Feedback ready", ready],
    ["awaiting", "Awaiting", CLIPS.length - ready],
  ];
  return (
    <div className="mk-gk-view">
      <div className="mk-gk-head">
        <div>
          <h1 className="mk-gk-h1">My clips</h1>
          <p className="mk-gk-sub">Coach notes on your saves</p>
        </div>
        <button type="button" className="mk-gk-btn neon sm" aria-label="Upload a clip">
          <Ico d={I.upload} size={16} sw={2.4} /> Upload
        </button>
      </div>
      <div className="mk-gk-card mk-gk-quota">
        <span
          className="mk-gk-flame"
          style={{ background: "rgba(139,92,246,.18)", color: "var(--vio2)" }}
        >
          <Ico d={I.spark} size={17} sw={2.2} />
        </span>
        <span className="txt">
          <b>3 of 8</b> coach reviews left this month
          <span className="mk-gk-bar">
            <i style={{ width: "62.5%", background: "var(--vio)" }} />
          </span>
        </span>
      </div>
      <div className="mk-gk-chips">
        {opts.map(([k, label, n]) => (
          <button
            key={k}
            type="button"
            className="mk-gk-chip"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
          >
            {label} <b>{n}</b>
          </button>
        ))}
      </div>
      <div className="mk-gk-grid">
        {list.map((c) => (
          <button
            key={c.id}
            type="button"
            className="mk-gk-card mk-gk-clip"
            onClick={() => openClip(c.id)}
          >
            <Thumb art={c.art} tone={c.tone}>
              <span
                className={`mk-gk-pill ${c.status === "ready" ? "ready" : "await"}`}
                style={{ background: c.status === "ready" ? "#0b0b0b" : "rgba(0,0,0,.6)" }}
              >
                <i /> {c.status === "ready" ? "Feedback ready" : "Awaiting"}
              </span>
              <span className="mk-gk-dur">{mmss(c.secs)}</span>
            </Thumb>
            <span className="body">
              <span className="ttl">{c.title}</span>
              <span className="m">
                <Avatar id={c.coach} size={20} />
                {c.date} · {c.status === "ready" ? `${c.notes.length} notes` : "In review"}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live                                                                */
/* ------------------------------------------------------------------ */

function Live({
  reminders,
  toggleReminder,
}: {
  reminders: Record<string, boolean>;
  toggleReminder: (id: string) => void;
}) {
  const [inRoom, setInRoom] = useState(false);
  const setCount = SESSIONS.filter((s) => reminders[s.id]).length;
  return (
    <div className="mk-gk-view">
      <div className="mk-gk-head">
        <div>
          <h1 className="mk-gk-h1">Live</h1>
          <p className="mk-gk-sub">Group sessions with pro coaches</p>
        </div>
        <span className="mk-gk-pill vio" style={{ height: 28 }}>
          <Ico d={I.bellOn} size={14} /> {setCount} booked
        </span>
      </div>

      <div className="mk-gk-now">
        <Thumb art="set" tone="violet" className="mk-gk-shift">
          <div className="mk-gk-drill-top">
            <span className="mk-gk-onair">
              <i /> LIVE NOW
            </span>
            <span className="mk-gk-tag">
              <Ico d={I.users} size={13} /> {inRoom ? 47 : 46} keepers
            </span>
          </div>
          <div>
            <p className="mk-gk-eyebrow neon" style={{ marginBottom: 6 }}>
              Lunchtime · started 12:30
            </p>
            <div className="mk-gk-now-title">
              Footwork
              <br />
              circuit
            </div>
          </div>
        </Thumb>
        <div className="mk-gk-now-body">
          <span className="mk-gk-stack" aria-hidden="true">
            <span className="mk-gk-av-lime">MH</span>
            <span style={{ background: "#3b3b44" }}>JT</span>
            <span style={{ background: "#2e2a44" }}>OB</span>
          </span>
          <span className="w">
            <b>Marcus Hale</b> · 22 min in
          </span>
          <button
            type="button"
            className={`mk-gk-btn sm ${inRoom ? "ghost" : "neon"}`}
            aria-pressed={inRoom}
            onClick={() => setInRoom(!inRoom)}
          >
            {inRoom ? "Leave" : "Join now"}
          </button>
        </div>
      </div>

      <div className="mk-gk-sec">
        <h2>Upcoming</h2>
        <span>Next 7 days</span>
      </div>
      <div className="mk-gk-sessions">
        {SESSIONS.map((s, i) => {
          const on = !!reminders[s.id];
          const joined = s.joined + (on ? 1 : 0);
          return (
            <div key={s.id} className="mk-gk-card mk-gk-sess">
              <div className="mk-gk-sess-top">
                <span className={`mk-gk-date${i === 0 ? " today" : ""}`}>
                  <small>{i === 0 ? "Today" : s.dow}</small>
                  <b>{s.day}</b>
                </span>
                <span className="txt">
                  <span className="mk-gk-eyebrow">{s.level}</span>
                  <span className="t">{s.title}</span>
                  <span className="d">
                    <Avatar id={s.coach} size={20} /> {COACHES[s.coach].name.split(" ")[0]}
                    <span className="sep">·</span>
                    {s.time}
                    <span className="sep">·</span>
                    {s.mins} min
                  </span>
                </span>
              </div>
              <div className="mk-gk-sess-foot">
                <span className="mk-gk-spots">
                  <span className="mk-gk-bar">
                    <i
                      style={{
                        width: `${(joined / s.cap) * 100}%`,
                        background: on ? "var(--vio)" : undefined,
                      }}
                    />
                  </span>
                  {joined}/{s.cap} joined
                </span>
                <button
                  type="button"
                  className={`mk-gk-btn sm mk-gk-join${on ? "" : " neon"}`}
                  aria-pressed={on}
                  onClick={() => toggleReminder(s.id)}
                >
                  {on ? (
                    <>
                      <Ico d={I.bellOn} size={15} /> Reminder set
                    </>
                  ) : (
                    "Join"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

function Profile({ drillDone }: { drillDone: boolean }) {
  const [notify, setNotify] = useState(true);
  const [parent, setParent] = useState(true);
  return (
    <div className="mk-gk-view">
      <div className="mk-gk-prof">
        <span className="me">AR</span>
        <h1>Alfie Rowe</h1>
        <p>Goalkeeper · U15 · Kingsmoor Town Academy</p>
        <span className="mk-gk-pill ready" style={{ marginTop: 4 }}>
          <Ico d={I.shield} size={12} sw={2.6} /> Academy plan
        </span>
      </div>
      <div className="mk-gk-trio">
        <div>
          <b>{drillDone ? 47 : 46}</b>
          <small>Sessions</small>
        </div>
        <div>
          <b>12</b>
          <small>Clips</small>
        </div>
        <div>
          <b>{drillDone ? "31.8" : "31.5"}</b>
          <small>Hours</small>
        </div>
      </div>
      <div className="mk-gk-sec">
        <h2>Badges</h2>
        <span>7 of 24</span>
      </div>
      <div className="mk-gk-badges">
        <div className="mk-gk-badge">
          <span className="b" style={{ background: "rgba(212,255,58,.14)", color: "var(--neon)" }}>
            <Ico d={I.flame} fill size={22} />
          </span>
          {drillDone ? 13 : 12}-day streak
        </div>
        <div className="mk-gk-badge">
          <span className="b" style={{ background: "rgba(139,92,246,.2)", color: "var(--vio2)" }}>
            <Ico d={I.trophy} size={22} />
          </span>
          Footwork I
        </div>
        <div className="mk-gk-badge lock">
          <span className="b" style={{ background: "var(--s2)" }}>
            <Ico d={I.lock} size={20} />
          </span>
          1v1 master
        </div>
      </div>
      <div className="mk-gk-card mk-gk-rows">
        <button
          type="button"
          className="mk-gk-row"
          aria-pressed={notify}
          onClick={() => setNotify(!notify)}
        >
          <span className="ic">
            <Ico d={I.bell} size={17} />
          </span>
          <span className="t">
            Training reminders
            <small>Daily at 16:30</small>
          </span>
          <span className="mk-gk-toggle" aria-pressed={notify} />
        </button>
        <button
          type="button"
          className="mk-gk-row"
          aria-pressed={parent}
          onClick={() => setParent(!parent)}
        >
          <span className="ic">
            <Ico d={I.link} size={17} />
          </span>
          <span className="t">
            Share progress with parent
            <small>Sarah Rowe</small>
          </span>
          <span className="mk-gk-toggle" aria-pressed={parent} />
        </button>
        <button type="button" className="mk-gk-row">
          <span className="ic">
            <Ico d={I.card} size={17} />
          </span>
          <span className="t">
            Subscription
            <small>Renews 14 Nov 2026</small>
          </span>
          <span className="v">£9.99/mo</span>
          <Ico d={I.chevR} size={16} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "home", label: "Home", icon: I.home },
  { id: "learn", label: "Learn", icon: I.learn },
  { id: "clips", label: "My clips", icon: I.clips },
  { id: "live", label: "Live", icon: I.live },
  { id: "profile", label: "Profile", icon: I.user },
];

export default function GkIconMockup() {
  const [tab, setTab] = useState<Tab>("home");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [clipId, setClipId] = useState<string | null>(null);
  const [drillDone, setDrillDone] = useState(false);
  const [reminders, setReminders] = useState<Record<string, boolean>>({ s2: true });
  const [seen, setSeen] = useState(false);

  const toggleReminder = (id: string) => setReminders((r) => ({ ...r, [id]: !r[id] }));
  const openClip = (id: string | null) => {
    setClipId(id);
    if (id) {
      setTab("clips");
      if (id === "c1") setSeen(true);
    }
  };
  const pick = (t: Tab) => {
    if (t === tab) {
      if (t === "learn") setCourseId(null);
      if (t === "clips") setClipId(null);
    }
    setTab(t);
  };

  const viewKey = `${tab}:${tab === "learn" ? courseId : tab === "clips" ? clipId : ""}`;

  return (
    <div className="mk-gk">
      <style>{CSS}</style>
      <StatusBar />
      <div className="mk-gk-scroll" key={viewKey}>
        {tab === "home" ? (
          <Home
            drillDone={drillDone}
            setDrillDone={setDrillDone}
            reminders={reminders}
            toggleReminder={toggleReminder}
            openClip={openClip}
            goLive={() => setTab("live")}
          />
        ) : tab === "learn" ? (
          <Learn courseId={courseId} openCourse={setCourseId} />
        ) : tab === "clips" ? (
          <Clips
            clipId={clipId}
            openClip={openClip}
            openCourse={(id) => {
              setCourseId(id);
              setTab("learn");
            }}
          />
        ) : tab === "live" ? (
          <Live reminders={reminders} toggleReminder={toggleReminder} />
        ) : (
          <Profile drillDone={drillDone} />
        )}
      </div>
      <nav className="mk-gk-tabs" aria-label="App sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="mk-gk-tab"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => pick(t.id)}
          >
            <Ico d={t.icon} size={24} sw={tab === t.id ? 2.3 : 1.9} />
            {t.label}
            {t.id === "clips" && !seen ? <span className="mk-gk-tab-badge">3</span> : null}
            {t.id === "live" ? <span className="mk-gk-live-dot" /> : null}
          </button>
        ))}
      </nav>
      <span className="mk-gk-homebar" aria-hidden="true" />
    </div>
  );
}
