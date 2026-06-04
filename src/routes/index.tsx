import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sprint Labs — AI-native product studio, London" },
      {
        name: "description",
        content:
          "Sprint Labs is an AI-native product studio. We help founders and teams turn ideas into working products — in weeks, not quarters.",
      },
      { property: "og:title", content: "Sprint Labs — AI-native product studio" },
      {
        property: "og:description",
        content: "Ideas are easy. Execution is everything. Ship in weeks, not quarters.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  component: Index,
});

const CSS = `
:root{
  --bg:#080808; --s1:#0f0f0f; --s2:#161616;
  --b:rgba(255,255,255,0.07); --b2:rgba(255,255,255,0.13);
  --t:#f0ece4; --t2:rgba(240,236,228,0.55); --t3:rgba(240,236,228,0.38); --t4:rgba(240,236,228,0.16);
  --a:#ff5e00;
  --mono: "SF Mono","Fira Mono","Courier New",monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--t);font-family:"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
.wrap{max-width:1200px;margin:0 auto;padding:0 48px}
@media (max-width:640px){.wrap{padding:0 22px}}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;transition:background .25s ease,backdrop-filter .25s ease,border-color .25s ease;border-bottom:1px solid transparent}
.nav.scrolled{background:rgba(8,8,8,0.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom-color:var(--b)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.wordmark{font-weight:700;font-size:16px;letter-spacing:-0.4px;color:var(--t)}
.wordmark .a{color:var(--a)}
.nav-links{display:flex;gap:32px}
.nav-links a{font-size:13px;color:var(--t3);transition:color .2s}
.nav-links a:hover{color:var(--t)}
@media (max-width:768px){.nav-links{display:none}}
.btn-ghost-nav{font-size:13px;font-weight:500;color:var(--t);background:transparent;border:1px solid var(--b2);padding:7px 15px;border-radius:5px;transition:all .2s}
.btn-ghost-nav:hover{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.04)}

/* Mobile hamburger */
.menu-btn{display:none;flex-direction:column;justify-content:center;gap:5px;width:40px;height:40px;background:transparent;border:none;cursor:pointer;padding:8px}
.menu-btn span{display:block;height:1px;background:var(--t);transition:transform .25s ease,opacity .25s ease}
.menu-btn span:nth-child(1){width:20px}
.menu-btn span:nth-child(2){width:14px;margin-left:auto}
.menu-btn span:nth-child(3){width:20px}
.menu-btn.open span:nth-child(1){transform:translateY(3px) rotate(45deg)}
.menu-btn.open span:nth-child(2){opacity:0}
.menu-btn.open span:nth-child(3){transform:translateY(-3px) rotate(-45deg)}
@media (max-width:768px){.menu-btn{display:flex}.btn-ghost-nav{display:none}}

/* Mobile overlay */
.mobile-overlay{position:fixed;inset:0;z-index:40;background:var(--bg);opacity:0;pointer-events:none;transition:opacity .35s ease;display:flex;flex-direction:column;justify-content:center;align-items:center}
.mobile-overlay.open{opacity:1;pointer-events:auto}
.mobile-overlay .overlay-grid{position:absolute;inset:0;background-image:linear-gradient(var(--b) 1px,transparent 1px),linear-gradient(90deg,var(--b) 1px,transparent 1px);background-size:80px 80px;opacity:.3;pointer-events:none}
.mobile-nav-links{display:flex;flex-direction:column;align-items:center;gap:8px;position:relative;z-index:1}
.mobile-nav-links a{font-size:clamp(32px,8vw,56px);font-weight:800;letter-spacing:-1.5px;color:var(--t);line-height:1.1;transition:color .2s}
.mobile-nav-links a:hover{color:var(--a)}
.mobile-nav-links a.eyebrow-link{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px}
.mobile-nav-cta{margin-top:40px;position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:12px}
.mobile-nav-cta .btn-primary-mob{background:var(--a);color:#fff;font-weight:700;font-size:15px;padding:12px 28px;border-radius:5px;display:inline-block;box-shadow:0 8px 24px -12px rgba(255,94,0,.6)}
.mobile-nav-cta .btn-ghost-nav{display:inline-block;font-size:13px;padding:9px 18px}
.mobile-overlay .overlay-foot{position:absolute;bottom:0;left:0;right:0;border-top:1px solid var(--b);padding:20px 0}
.mobile-overlay .overlay-foot-inner{display:flex;justify-content:space-between;align-items:center;max-width:1200px;margin:0 auto;padding:0 48px}
@media (max-width:640px){.mobile-overlay .overlay-foot-inner{padding:0 22px}}

/* HERO */
.hero{min-height:calc(100vh - 64px);display:grid;grid-template-rows:1fr auto;position:relative;overflow:hidden;padding-top:64px}
.hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--b) 1px,transparent 1px),linear-gradient(90deg,var(--b) 1px,transparent 1px);background-size:80px 80px;opacity:.4;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent);mask-image:radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent)}
.hero-top{display:flex;flex-direction:column;justify-content:center;padding:20px 0 12px;position:relative;z-index:1}
.hero h1{font-weight:900;font-size:clamp(64px,9.5vw,148px);letter-spacing:-4px;line-height:.95;color:var(--t)}
.hero .mom{font-weight:900;font-size:clamp(64px,9.5vw,148px);letter-spacing:-4px;line-height:.95;color:var(--a);display:block}
.hero .philo{margin-top:20px;font-weight:700;font-size:clamp(15px,1.8vw,21px);color:var(--t3);letter-spacing:-0.3px}
.hero-bottom{border-top:1px solid var(--b);padding:20px 0 32px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start;position:relative;z-index:1}
.hero-left{display:flex;flex-direction:column;gap:14px}
.hero-marginnote{font-size:13px;color:var(--t3);font-style:italic;line-height:1.6;padding-left:12px;border-left:2px solid rgba(255,255,255,0.12)}
.hero-bottom .body{font-size:15px;color:var(--t2);line-height:1.72;max-width:460px}
.hero-cta{display:flex;flex-direction:column;align-items:flex-end;gap:12px}
.hero-cta .row{display:flex;gap:10px}
.btn-primary{background:var(--a);color:#fff;font-weight:700;font-size:14px;padding:11px 20px;border-radius:5px;transition:background .2s,transform .2s,box-shadow .2s;display:inline-block;box-shadow:0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px -12px rgba(255,94,0,.6)}
.btn-primary:hover{background:#ff7325;transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,0.1) inset, 0 12px 28px -10px rgba(255,94,0,.7)}
.btn-ghost{background:transparent;border:1px solid var(--b2);color:var(--t);font-weight:600;font-size:14px;padding:11px 18px;border-radius:5px;transition:all .2s;display:inline-block}
.btn-ghost:hover{border-color:rgba(255,255,255,0.28);background:rgba(255,255,255,0.03)}
.hero-cta .note{font-family:var(--mono);font-size:12px;color:var(--t3)}
@media (max-width:768px){
  .hero-bottom{grid-template-columns:1fr;gap:24px}
  .hero-cta{align-items:flex-start}
}
@media (max-width:640px){
  .hero-cta .row{flex-direction:column;width:100%}
  .btn-primary,.btn-ghost{text-align:center}
}

/* fade-up */
.fade-up{opacity:0;transform:translateY(18px);transition:opacity .8s ease,transform .8s ease}
.fade-up.in{opacity:1;transform:translateY(0)}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}

/* MANIFESTO */
.manifesto{background:var(--s1);border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:72px 0}
.manifesto-inner{max-width:720px;margin:0 auto;text-align:left}
.manifesto h2{font-size:clamp(28px,3.5vw,44px);font-weight:800;letter-spacing:-1.2px;color:var(--t);line-height:1.1}
.manifesto p{margin-top:20px;font-size:16px;color:var(--t2);line-height:1.78}
.manifesto .close{margin-top:24px;font-size:16px;font-weight:600;color:var(--t);line-height:1.6}

/* TICKER */
.ticker{height:32px;border-top:1px solid var(--b);border-bottom:1px solid var(--b);overflow:hidden;display:flex;align-items:center;position:relative}
.ticker-track{display:flex;gap:0;animation:tick 30s linear infinite;white-space:nowrap;padding-left:0}
.ticker:hover .ticker-track{animation-play-state:paused}
.ticker-item{font-family:var(--mono);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);padding:0 18px;display:inline-flex;align-items:center}
.ticker-sep{color:var(--t4);font-family:var(--mono);font-size:11px}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* PROOF */
.proof{padding:14px 0;border-bottom:1px solid var(--b);background:var(--bg)}
.proof-inner{display:flex;align-items:center;flex-wrap:wrap;justify-content:space-between;gap:8px}
.proof-label{font-family:var(--mono);font-size:10px;color:var(--t4);letter-spacing:.14em;text-transform:uppercase;padding-right:20px}
.proof-item{font-family:var(--mono);font-weight:500;font-size:12px;color:var(--t2);padding:0 18px;border-left:1px solid var(--b);transition:color .2s}
.proof-item:hover{color:var(--t)}
@media (max-width:768px){.proof-inner{justify-content:flex-start}.proof-item{padding:0 12px;font-size:11px}}

/* Section common */
section.std{padding:72px 0;background:var(--bg)}
.eyebrow{font-family:var(--mono);font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px}
.h2{font-size:clamp(28px,4vw,52px);font-weight:800;letter-spacing:-1.8px;color:var(--t);line-height:1.05}
.sub{margin-top:18px;font-size:16px;color:var(--t2);max-width:640px;line-height:1.65}

/* OUTCOMES */
.outcomes-grid{margin-top:64px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--b)}
.outcomes-grid > div{padding:36px 28px;border-right:1px solid var(--b)}
.outcomes-grid > div:last-child{border-right:none}
.out-idx{font-family:var(--mono);font-size:10px;color:var(--t4);margin-bottom:22px}
.out-prob{font-size:14px;font-weight:600;color:var(--t);letter-spacing:-0.2px;margin-bottom:18px;line-height:1.4}
.out-svc{display:flex;flex-direction:column;gap:9px}
.out-svc span{font-size:14px;color:var(--t2);font-weight:500;transition:color .2s;cursor:default}
.out-svc span:hover{color:var(--t)}
@media (max-width:900px){.outcomes-grid{grid-template-columns:repeat(2,1fr)}.outcomes-grid > div:nth-child(2){border-right:none}.outcomes-grid > div:nth-child(1),.outcomes-grid > div:nth-child(2){border-bottom:1px solid var(--b)}}
@media (max-width:560px){.outcomes-grid{grid-template-columns:1fr}.outcomes-grid > div{border-right:none;border-bottom:1px solid var(--b)}.outcomes-grid > div:last-child{border-bottom:none}}

/* PROCESS */
.process-grid{margin-top:44px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--b);border-bottom:1px solid var(--b)}
.process-grid > div{padding:36px 32px;border-right:1px solid var(--b);display:flex;flex-direction:column}
.process-grid > div:last-child{border-right:none}
.step-idx{font-family:var(--mono);font-size:11px;color:var(--a);letter-spacing:.14em;margin-bottom:24px;text-transform:uppercase}
.step-h{font-size:19px;font-weight:700;letter-spacing:-0.4px;color:var(--t);margin-bottom:14px}
.step-body{font-size:14px;color:var(--t2);line-height:1.7}
.step-close{font-weight:600;color:var(--t);margin-top:auto;padding-top:20px;font-size:14px;line-height:1.55}
@media (max-width:720px){.process-grid{grid-template-columns:1fr;margin-top:32px}.process-grid > div{padding:28px 0;border-right:none;border-bottom:1px solid var(--b)}.process-grid > div:last-child{border-bottom:none;padding-bottom:32px}.step-idx{margin-bottom:14px}.step-close{padding-top:18px}}

/* CAPABILITIES */
.capabilities{background:var(--s1);border-top:1px solid var(--b);padding:72px 0}
.cap-grid{margin-top:64px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b);border:1px solid var(--b)}
.cap-card{background:var(--s1);padding:44px;min-height:260px;display:flex;flex-direction:column;transition:background .2s}
.cap-card:hover{background:var(--s2)}
.cap-num{font-family:var(--mono);font-size:11px;color:var(--t3);letter-spacing:.08em;margin-bottom:28px}
.cap-title{font-size:20px;font-weight:700;letter-spacing:-0.4px;color:var(--t);line-height:1.2;margin-bottom:14px}
.cap-desc{font-size:14px;color:var(--t2);line-height:1.72;max-width:92%}
@media (max-width:640px){.cap-grid{grid-template-columns:1fr}.cap-card{padding:32px}}

/* FOUNDER */
.founder{background:var(--bg);border-top:1px solid var(--b);padding:72px 0}
.founder-grid{margin-top:44px;display:grid;grid-template-columns:240px 1fr;gap:56px;align-items:start;border-top:1px solid var(--b);padding-top:36px}
.f-card{border:1px solid var(--b);padding:32px;background:var(--s1);display:flex;flex-direction:column;gap:6px}
.f-monogram{width:56px;height:56px;border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;flex-shrink:0}
.f-monogram span{font-weight:900;font-size:20px;letter-spacing:-1px;color:var(--a);font-family:"Inter",system-ui,sans-serif}
.f-name{font-size:19px;font-weight:700;letter-spacing:-0.4px;color:var(--t)}
.f-role{font-size:13px;color:var(--t3);margin-bottom:18px;margin-top:2px}
.f-tags{font-family:var(--mono);font-size:11px;color:var(--t3);padding-top:18px;border-top:1px solid var(--b);letter-spacing:.04em}
.f-quote{border-left:2px solid var(--a);padding-left:22px;margin-bottom:28px;font-size:clamp(18px,2.3vw,25px);font-weight:700;letter-spacing:-0.6px;line-height:1.3;color:var(--t)}
.f-body p{font-size:15px;color:var(--t2);line-height:1.78;margin-bottom:18px}
.f-sig{font-size:14px;font-style:italic;color:var(--t3);margin-top:20px}
@media (max-width:768px){.founder-grid{grid-template-columns:1fr;gap:32px;padding-top:28px;margin-top:32px}.f-card{padding:24px}}

/* CTA */
.cta{background:var(--bg);border-top:1px solid var(--b);padding:72px 0;text-align:center}
.cta-inner{max-width:600px;margin:0 auto}
.cta-eyebrow{font-family:var(--mono);font-size:11px;color:var(--a);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px}
.cta h2{font-weight:900;font-size:clamp(42px,6.5vw,84px);letter-spacing:-3px;color:var(--t);line-height:.98}
.cta h2 .mom{color:var(--a);display:block}
.cta .csub{max-width:380px;margin:24px auto 40px;font-size:15px;color:var(--t2);line-height:1.72}
.cta-buttons{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.cta .btn-primary{font-size:15px;padding:13px 28px}
.cta .btn-ghost{font-size:14px;padding:12px 22px}
.cta .footnote{margin-top:28px;font-size:13px;color:var(--t3)}
.cta .footnote a{color:var(--t2);text-decoration:underline;text-underline-offset:3px}

/* TRY BEFORE YOU BUY */
.tbuyb{background:var(--bg);border-top:1px solid var(--b);padding:72px 0}
.tbuyb-inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;border-top:1px solid var(--b);padding-top:44px;margin-top:44px}
.tbuyb-left .tbuyb-h{font-size:clamp(24px,3vw,38px);font-weight:800;letter-spacing:-1px;color:var(--t);line-height:1.05;margin-bottom:20px}
.tbuyb-left p{font-size:15px;color:var(--t2);line-height:1.78;margin-bottom:14px}
.tbuyb-right{border:1px solid var(--b);background:var(--s1);padding:36px}
.tbuyb-offer{display:flex;flex-direction:column;gap:16px}
.tbuyb-item{display:flex;gap:14px;align-items:flex-start}
.tbuyb-dot{width:6px;height:6px;border-radius:50%;background:var(--a);margin-top:6px;flex-shrink:0}
.tbuyb-item p{font-size:14px;color:var(--t2);line-height:1.68;margin:0}
.tbuyb-cta{margin-top:28px;padding-top:24px;border-top:1px solid var(--b)}
.tbuyb-cta p{font-size:13px;color:var(--t3);margin-bottom:16px;font-style:italic;line-height:1.6}
@media (max-width:768px){.tbuyb-inner{grid-template-columns:1fr;gap:32px}}
@media (max-width:640px){.tbuyb-right{padding:24px}}

/* FOOTER */
footer{border-top:1px solid var(--b);padding:36px 0}
.foot{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px}
.foot-c{display:flex;gap:24px}
.foot-c a{font-size:12px;color:var(--t3);transition:color .2s}
.foot-c a:hover{color:var(--t2)}
.foot-r{text-align:right;font-family:var(--mono);font-size:11px;color:var(--t4);line-height:1.6}
.foot-r a{color:var(--t3);transition:color .2s;text-decoration:none}
.foot-r a:hover{color:var(--t2)}
@media (max-width:640px){.foot-r{text-align:left}}
`;

const TICKER_ITEMS = [
  "MVPs",
  "Prototypes",
  "Landing Pages",
  "Web Apps",
  "AI Workflows",
  "Dashboards",
  "Ship Fast. Build Smarter.",
];

const SECTORS = [
  "Fintech",
  "SaaS",
  "Creative & Media",
  "E-Commerce",
  "Professional Services",
  "Consumer Apps",
];

const OUTCOMES = [
  {
    idx: "01",
    prob: "I need to test if this idea is worth building.",
    svcs: [
      "Product Strategy",
      "MVP Scoping",
      "Technical Discovery",
      "Rapid Prototyping",
      "Market Validation",
    ],
  },
  {
    idx: "02",
    prob: "I need something tangible to show users, investors or my team.",
    svcs: [
      "UX & UI Design",
      "Branding",
      "Visual Identity",
      "Design Systems",
      "Interactive Prototypes",
    ],
  },
  {
    idx: "03",
    prob: "I need a working product live in the hands of users.",
    svcs: ["Websites", "Web Applications", "AI-Enabled Tools", "Dashboards", "Internal Tools"],
  },
  {
    idx: "04",
    prob: "I need to do more with what I've already built.",
    svcs: [
      "Workflow Automation",
      "API Integrations",
      "AI Implementation",
      "Database Design",
      "Process Engineering",
    ],
  },
];

const PROCESS_STEPS = [
  {
    idx: "01 — BRIEF",
    h: "Understand the problem",
    body: "We start with a conversation, not a form. You tell us what you're trying to achieve. We ask the right questions and find the real problem fast.",
    close: "We find the real problem before a line of code is written.",
  },
  {
    idx: "02 — BUILD",
    h: "Move quickly and visibly",
    body: "We use AI-native tooling and a lean build process to move faster than any traditional agency. You see working output in days — not Jira tickets and weekly standups.",
    close: "You see progress in days, not monthly status reports.",
  },
  {
    idx: "03 — SHIP",
    h: "Launch with momentum",
    body: "We deploy and hand over cleanly. You own everything — code, assets, infrastructure. We make sure you can operate what we've built.",
    close: "No lock-in. No ongoing dependency unless you want one.",
  },
];

const CAPABILITIES = [
  {
    n: "01",
    title: "MVPs & Prototypes",
    desc: "Turn your idea into something testable. We scope, design and build an early version of your product fast — so you can put something real in front of users, not just a deck.",
  },
  {
    n: "02",
    title: "Websites & Landing Pages",
    desc: "From zero to live in days. Fast, clean, conversion-ready sites that look like you mean business — without the agency timeline or the agency price tag.",
  },
  {
    n: "03",
    title: "Internal Tools & Dashboards",
    desc: "Replace the spreadsheets. We build custom tools for ops, data and reporting that your team will actually use — without the enterprise software price.",
  },
  {
    n: "04",
    title: "AI Workflows & Automations",
    desc: "Put AI to work inside your business. We design and build automations that save time, cut manual effort and give your team real leverage.",
  },
];

const CALENDLY_URL = "https://calendly.com/luke-sprintlabs/30min";
const CTA_EMAIL = "mailto:luke@sprintlabs.uk?subject=Sprint%20Labs%20enquiry";

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const heroEls: Array<[string, number]> = [
      ["hero-h1", 80],
      ["hero-mom", 220],
      ["hero-philo", 340],
      ["hero-bottom", 500],
    ];
    const timers = heroEls.map(([id, ms]) =>
      window.setTimeout(() => document.getElementById(id)?.classList.add("in"), ms),
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -28px 0px" },
    );
    document.querySelectorAll(".fade-up:not(.hero-fade)").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      timers.forEach((t) => clearTimeout(t));
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const tickerLoop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* NAV */}
      <nav className="nav" id="nav">
        <div className="wrap nav-inner">
          <a href="#" className="wordmark" onClick={() => setMenuOpen(false)}>
            Sprint<span className="a">Labs.</span>
          </a>
          <div className="nav-links">
            <a href="#outcomes">Services</a>
            <a href="#capabilities">Work</a>
            <a href="#founder">Studio</a>
          </div>
          <a
            href={CALENDLY_URL}
            className="btn-ghost-nav"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book free discovery call
          </a>
          <button
            className={`menu-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div className={`mobile-overlay ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="overlay-grid" />
        <div className="mobile-nav-links">
          <a href="#outcomes" className="eyebrow-link" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#capabilities" onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="#founder" onClick={() => setMenuOpen(false)}>
            Studio
          </a>
          <a href={CTA_EMAIL} onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>
        <div className="mobile-nav-cta">
          <a
            href={CALENDLY_URL}
            className="btn-primary-mob"
            onClick={() => setMenuOpen(false)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book free discovery call
          </a>
          <a href={CTA_EMAIL} className="btn-ghost-nav" onClick={() => setMenuOpen(false)}>
            Talk through an idea
          </a>
        </div>
        <div className="overlay-foot">
          <div className="overlay-foot-inner">
            <span className="wordmark">
              Sprint<span className="a">Labs.</span>
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--t4)" }}>
              London, UK
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap hero-top">
          <h1 id="hero-h1" className="fade-up hero-fade">
            From idea to
          </h1>
          <span id="hero-mom" className="mom fade-up hero-fade">
            live product.
          </span>
          <p id="hero-philo" className="philo fade-up hero-fade">
            Ideas are easy. Execution is everything.
          </p>
        </div>
        <div className="wrap">
          <div id="hero-bottom" className="hero-bottom fade-up hero-fade">
            <div className="hero-left">
              <p className="hero-marginnote">
                Most agencies were built to protect their margins. Sprint Labs was built to ship
                your product.
              </p>
              <p className="body">
                Sprint Labs is an AI-native product studio helping founders, startups and product
                teams turn ideas into working products — in weeks, not quarters.
              </p>
            </div>
            <div className="hero-cta">
              <div className="row">
                <a
                  href={CALENDLY_URL}
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book free discovery call
                </a>
                <a href={CTA_EMAIL} className="btn-ghost">
                  Talk through an idea
                </a>
              </div>
              <div className="note">No spec needed. Just an idea.</div>
            </div>
          </div>
        </div>
      </header>

      {/* MANIFESTO — moved directly after hero */}
      <section className="manifesto">
        <div className="wrap manifesto-inner fade-up">
          <h2>Most products don't fail for lack of ideas.</h2>
          <p>
            They fail because the gap between an idea and something real is wider — and more
            expensive — than most founders anticipated. Sprint Labs exists to close that gap. We
            don't ask for a brief. We don't run a discovery phase. We ask one question: what are you
            trying to achieve? Everything else follows from there.
          </p>
          <p className="close">You don't need a technical specification. You need momentum.</p>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {tickerLoop.map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-sep" style={{ marginLeft: 18 }}>
                ·
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* SECTORS */}
      <div className="proof">
        <div className="wrap proof-inner">
          <span className="proof-label">SECTORS</span>
          {SECTORS.map((s) => (
            <span key={s} className="proof-item">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="std" id="outcomes">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">WHAT WE DO</div>
            <h2 className="h2">Pick your starting point.</h2>
            <p className="sub">
              Every founder's starting point is different. These are the four most common entry
              points.
            </p>
          </div>
          <div className="outcomes-grid">
            {OUTCOMES.map((c, i) => (
              <div key={c.idx} className={`fade-up d${(i % 4) + 1}`}>
                <div className="out-idx">{c.idx}</div>
                <div className="out-prob">{c.prob}</div>
                <div className="out-svc">
                  {c.svcs.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="std" id="process">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">PROCESS</div>
            <h2 className="h2">Brief. Build. Ship.</h2>
            <p className="sub">
              A lean process built around visibility and speed. No hidden phases. No status updates
              instead of progress.
            </p>
          </div>
          <div className="process-grid">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.idx} className={`fade-up d${i + 1}`}>
                <div className="step-idx">{s.idx}</div>
                <div className="step-h">{s.h}</div>
                <div className="step-body">{s.body}</div>
                <div className="step-close">{s.close}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRY BEFORE YOU BUY */}
      <section className="tbuyb" id="try">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">LOW RISK START</div>
          </div>
          <div className="tbuyb-inner fade-up">
            <div className="tbuyb-left">
              <h2 className="tbuyb-h">Try before you buy.</h2>
              <p>
                Not sure whether your idea is worth pursuing? Before committing to a project, I'll
                build a lightweight prototype of your idea free of charge.
              </p>
              <p>No lengthy proposal process. No commitment. No obligation.</p>
              <p>
                The goal is simple: give you something tangible to react to, test and evaluate
                before deciding whether to invest further.
              </p>
              <p>
                If the prototype helps clarify the opportunity, we can discuss the next step
                together. If not, you've still gained insight without spending a penny.
              </p>
            </div>
            <div className="tbuyb-right">
              <div className="tbuyb-offer">
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>A working prototype built around your specific idea — not a generic demo.</p>
                </div>
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>Delivered fast. Usually within a week of our first conversation.</p>
                </div>
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>No contract, no invoice, no commitment required to receive it.</p>
                </div>
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>
                    You keep the prototype and any insight it generates, regardless of what you
                    decide next.
                  </p>
                </div>
              </div>
              <div className="tbuyb-cta">
                <p>
                  Book a free 30-minute call and we'll figure out if this makes sense for your idea.
                </p>
                <a
                  href={CALENDLY_URL}
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book free discovery call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="capabilities" id="capabilities">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">CAPABILITIES</div>
            <h2 className="h2">What we can build.</h2>
            <p className="sub">
              Four areas where we take an idea from zero to working product — fast.
            </p>
          </div>
          <div className="cap-grid">
            {CAPABILITIES.map((c, i) => (
              <div key={c.n} className={`cap-card fade-up d${(i % 4) + 1}`}>
                <div className="cap-num">{c.n}</div>
                <div className="cap-title">{c.title}</div>
                <div className="cap-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder" id="founder">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">FROM THE FOUNDER</div>
          </div>
          <div className="founder-grid fade-up">
            <div className="f-card">
              <div className="f-monogram">
                <span>SL</span>
              </div>
              <div className="f-name">Luke</div>
              <div className="f-role">Founder, Sprint Labs</div>
              <div className="f-tags">SaaS · Fintech · Product · Sales · AI Dev</div>
            </div>
            <div className="f-body">
              <div className="f-quote">
                "Most agencies were built to protect their margins. Sprint Labs was built to ship
                your product."
              </div>
              <p>
                I've spent time on both sides of the table — selling technology, buying it, and
                building it. I've watched great ideas get delayed by six-week discovery phases,
                inflated by unnecessary process, and ultimately abandoned because momentum ran out
                before the product reached users.
              </p>
              <p>
                Sprint Labs is the build partner I always wanted and couldn't find. Small enough to
                move fast. Experienced enough to make the right calls early. AI-native enough to do
                in two weeks what used to take two months. If you have an idea worth building —
                let's build it.
              </p>
              <div className="f-sig">— Luke</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="wrap cta-inner fade-up">
          <div className="cta-eyebrow">START A SPRINT</div>
          <h2>
            Ready to build
            <span className="mom">momentum?</span>
          </h2>
          <p className="csub">
            Book a free 30-minute discovery call. We'll talk through your idea and give you a real
            view on what's possible, how long it takes, and what it costs. No deck, no proposal.
          </p>
          <div className="cta-buttons">
            <a
              href={CALENDLY_URL}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book free discovery call
            </a>
            <a href={CTA_EMAIL} className="btn-ghost">
              Talk through an idea
            </a>
          </div>
          <div className="footnote">
            Or email directly: <a href={CTA_EMAIL}>luke@sprintlabs.uk</a> · London, UK
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot">
          <div>
            <a href="#" className="wordmark">
              Sprint<span className="a">Labs.</span>
            </a>
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--t4)",
                lineHeight: 1.6,
              }}
            >
              AI-native product studio based in London.
              <br />
              <a href={CTA_EMAIL} style={{ color: "var(--t3)", textDecoration: "none" }}>
                luke@sprintlabs.uk
              </a>
            </div>
          </div>
          <div className="foot-c">
            <a href="#outcomes">Services</a>
            <a href="#capabilities">Work</a>
            <a href="#founder">Studio</a>
            <a href={CTA_EMAIL}>Contact</a>
          </div>
          <div className="foot-r">
            © {new Date().getFullYear()} Sprint Labs Ltd
            <br />
            London, UK
          </div>
        </div>
      </footer>
    </>
  );
}
