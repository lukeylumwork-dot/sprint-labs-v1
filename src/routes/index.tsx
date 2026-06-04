import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sprint Labs — AI-native product studio, London" },
      {
        name: "description",
        content:
          "Sprint Labs is an AI-native product studio run by Luke. I help founders, startups, SMEs and product teams turn ideas into working products — in days or weeks, not quarters.",
      },
      { property: "og:title", content: "Sprint Labs — AI-native product studio" },
      {
        property: "og:description",
        content:
          "Founder-led product building, powered by AI. Idea to working product in days or weeks, not quarters.",
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
html{scroll-behavior:smooth}
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
.mobile-nav-links a{font-size:clamp(30px,7.5vw,52px);font-weight:800;letter-spacing:-1.5px;color:var(--t);line-height:1.1;transition:color .2s}
.mobile-nav-links a:hover{color:var(--a)}
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
.hero .philo{margin-top:22px;font-weight:700;font-size:clamp(15px,1.8vw,21px);color:var(--t3);letter-spacing:-0.3px}
.hero-bottom{border-top:1px solid var(--b);padding:20px 0 32px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start;position:relative;z-index:1}
.hero-left{display:flex;flex-direction:column;gap:14px}
.hero-marginnote{font-size:13px;color:var(--t3);font-style:italic;line-height:1.6;padding-left:12px;border-left:2px solid var(--a)}
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
@media (prefers-reduced-motion:reduce){.fade-up{opacity:1;transform:none;transition:none}}

/* POSITIONING */
.manifesto{background:var(--s1);border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:80px 0}
.manifesto-inner{max-width:760px;margin:0 auto;text-align:left}
.manifesto h2{font-size:clamp(28px,3.6vw,46px);font-weight:800;letter-spacing:-1.4px;color:var(--t);line-height:1.08}
.manifesto p{margin-top:22px;font-size:16px;color:var(--t2);line-height:1.78}
.manifesto .close{margin-top:24px;font-size:17px;font-weight:600;color:var(--t);line-height:1.6}

/* TICKER */
.ticker{height:32px;border-bottom:1px solid var(--b);overflow:hidden;display:flex;align-items:center;position:relative}
.ticker-track{display:flex;gap:0;animation:tick 30s linear infinite;white-space:nowrap;padding-left:0}
.ticker:hover .ticker-track{animation-play-state:paused}
.ticker-item{font-family:var(--mono);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);padding:0 18px;display:inline-flex;align-items:center}
.ticker-sep{color:var(--t4);font-family:var(--mono);font-size:11px}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.ticker-track{animation:none}}

/* AUDIENCE STRIP */
.proof{padding:14px 0;border-bottom:1px solid var(--b);background:var(--bg)}
.proof-inner{display:flex;align-items:center;flex-wrap:wrap;justify-content:space-between;gap:8px}
.proof-label{font-family:var(--mono);font-size:10px;color:var(--t4);letter-spacing:.14em;text-transform:uppercase;padding-right:20px}
.proof-item{font-family:var(--mono);font-weight:500;font-size:12px;color:var(--t2);padding:0 18px;border-left:1px solid var(--b);transition:color .2s}
.proof-item:hover{color:var(--t)}
@media (max-width:768px){.proof-inner{justify-content:flex-start}.proof-item{padding:0 12px;font-size:11px}}

/* Section common */
section.std{padding:80px 0;background:var(--bg)}
.eyebrow{font-family:var(--mono);font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:22px}
.h2{font-size:clamp(30px,4.2vw,54px);font-weight:800;letter-spacing:-1.8px;color:var(--t);line-height:1.04}
.sub{margin-top:18px;font-size:16px;color:var(--t2);max-width:640px;line-height:1.65}

/* CAPABILITIES / WHAT I BUILD */
.capabilities{background:var(--bg);border-top:1px solid var(--b);padding:80px 0}
.cap-grid{margin-top:56px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b);border:1px solid var(--b)}
.cap-card{background:var(--s1);padding:44px;min-height:240px;display:flex;flex-direction:column;transition:background .2s}
.cap-card:hover{background:var(--s2)}
.cap-num{font-family:var(--mono);font-size:11px;color:var(--a);letter-spacing:.08em;margin-bottom:26px}
.cap-title{font-size:21px;font-weight:700;letter-spacing:-0.4px;color:var(--t);line-height:1.2;margin-bottom:14px}
.cap-desc{font-size:14px;color:var(--t2);line-height:1.72;max-width:94%}
.cap-skills{margin-top:36px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.cap-skills .skills-label{font-family:var(--mono);font-size:10px;color:var(--t4);letter-spacing:.14em;text-transform:uppercase;margin-right:6px}
.cap-skills span.chip{font-family:var(--mono);font-size:12px;color:var(--t2);border:1px solid var(--b);padding:7px 12px;border-radius:5px;transition:border-color .2s,color .2s}
.cap-skills span.chip:hover{border-color:var(--b2);color:var(--t)}
@media (max-width:640px){.cap-grid{grid-template-columns:1fr}.cap-card{padding:32px;min-height:0}}

/* PROCESS */
.process{background:var(--s1);border-top:1px solid var(--b);padding:80px 0}
.process-grid{margin-top:48px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--b);border-bottom:1px solid var(--b)}
.process-grid > div{padding:40px 32px;border-right:1px solid var(--b);display:flex;flex-direction:column}
.process-grid > div:last-child{border-right:none}
.step-idx{font-family:var(--mono);font-size:11px;color:var(--a);letter-spacing:.14em;margin-bottom:18px;text-transform:uppercase}
.step-name{font-size:clamp(28px,3.4vw,38px);font-weight:800;letter-spacing:-1.2px;color:var(--t);line-height:1;margin-bottom:18px}
.step-body{font-size:14px;color:var(--t2);line-height:1.7}
.step-close{font-weight:600;color:var(--t);margin-top:auto;padding-top:22px;font-size:14px;line-height:1.55}
@media (max-width:720px){.process-grid{grid-template-columns:1fr;margin-top:36px}.process-grid > div{padding:30px 0;border-right:none;border-bottom:1px solid var(--b)}.process-grid > div:last-child{border-bottom:none;padding-bottom:34px}.step-idx{margin-bottom:12px}.step-name{margin-bottom:14px}.step-close{padding-top:20px}}

/* FOUNDER */
.founder{background:var(--bg);border-top:1px solid var(--b);padding:80px 0}
.founder-grid{margin-top:48px;display:grid;grid-template-columns:260px 1fr;gap:56px;align-items:start;border-top:1px solid var(--b);padding-top:40px}
.f-card{border:1px solid var(--b);padding:32px;background:var(--s1);display:flex;flex-direction:column;gap:4px;position:sticky;top:88px}
.f-monogram{width:56px;height:56px;border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;flex-shrink:0}
.f-monogram span{font-weight:900;font-size:22px;letter-spacing:-1px;color:var(--a);font-family:"Inter",system-ui,sans-serif}
.f-name{font-size:20px;font-weight:700;letter-spacing:-0.4px;color:var(--t)}
.f-role{font-size:13px;color:var(--t3);margin-top:3px}
.f-loc{font-size:13px;color:var(--t3);margin-bottom:18px}
.f-tags{font-family:var(--mono);font-size:11px;color:var(--t3);padding-top:18px;border-top:1px solid var(--b);letter-spacing:.04em;line-height:1.7}
.f-quote{border-left:2px solid var(--a);padding-left:22px;margin-bottom:30px;font-size:clamp(19px,2.4vw,27px);font-weight:700;letter-spacing:-0.6px;line-height:1.32;color:var(--t)}
.f-body p{font-size:15px;color:var(--t2);line-height:1.8;margin-bottom:18px}
.f-body p strong{color:var(--t);font-weight:600}
.f-sig{font-size:14px;font-style:italic;color:var(--t3);margin-top:22px}
.f-points{display:flex;flex-wrap:wrap;gap:14px 28px;margin-top:30px;padding-top:26px;border-top:1px solid var(--b)}
.f-point{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--t2);line-height:1.5;max-width:260px}
.f-point .dot{width:6px;height:6px;border-radius:50%;background:var(--a);margin-top:5px;flex-shrink:0}
@media (max-width:768px){.founder-grid{grid-template-columns:1fr;gap:32px;padding-top:30px;margin-top:34px}.f-card{padding:24px;position:static}.f-point{max-width:none}}

/* TRY BEFORE YOU BUY */
.tbuyb{background:var(--s1);border-top:1px solid var(--b);padding:80px 0}
.tbuyb-inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;border-top:1px solid var(--b);padding-top:48px;margin-top:48px}
.tbuyb-left .tbuyb-h{font-size:clamp(28px,3.4vw,42px);font-weight:800;letter-spacing:-1.2px;color:var(--t);line-height:1.04;margin-bottom:22px}
.tbuyb-left p{font-size:15px;color:var(--t2);line-height:1.8;margin-bottom:14px}
.tbuyb-right{border:1px solid var(--b);background:var(--bg);padding:36px}
.tbuyb-right-h{font-family:var(--mono);font-size:10px;color:var(--t4);letter-spacing:.14em;text-transform:uppercase;margin-bottom:24px}
.tbuyb-offer{display:flex;flex-direction:column;gap:18px}
.tbuyb-item{display:flex;gap:14px;align-items:flex-start}
.tbuyb-dot{width:6px;height:6px;border-radius:50%;background:var(--a);margin-top:7px;flex-shrink:0}
.tbuyb-item p{font-size:14px;color:var(--t2);line-height:1.6;margin:0}
.tbuyb-item p strong{color:var(--t);font-weight:600}
.tbuyb-cta{margin-top:30px;padding-top:26px;border-top:1px solid var(--b)}
.tbuyb-cta p{font-size:14px;color:var(--t);margin-bottom:18px;font-weight:600;line-height:1.5}
@media (max-width:768px){.tbuyb-inner{grid-template-columns:1fr;gap:32px;padding-top:34px;margin-top:34px}}
@media (max-width:640px){.tbuyb-right{padding:24px}}

/* CTA */
.cta{background:var(--bg);border-top:1px solid var(--b);padding:88px 0;text-align:center}
.cta-inner{max-width:620px;margin:0 auto}
.cta-eyebrow{font-family:var(--mono);font-size:11px;color:var(--a);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px}
.cta h2{font-weight:900;font-size:clamp(44px,6.5vw,86px);letter-spacing:-3px;color:var(--t);line-height:.98}
.cta h2 .mom{color:var(--a);display:block}
.cta .csub{max-width:420px;margin:24px auto 40px;font-size:15px;color:var(--t2);line-height:1.72}
.cta-buttons{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.cta .btn-primary{font-size:15px;padding:13px 28px}
.cta .btn-ghost{font-size:14px;padding:12px 22px}
.cta .footnote{margin-top:28px;font-size:13px;color:var(--t3)}
.cta .footnote a{color:var(--t2);text-decoration:underline;text-underline-offset:3px}

/* FOOTER */
footer{border-top:1px solid var(--b);padding:36px 0}
.foot{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px}
.foot-c{display:flex;gap:24px;flex-wrap:wrap}
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
  "Ship fast. Build smarter.",
];

const AUDIENCE = [
  "Founders",
  "Early-stage startups",
  "SMEs",
  "Product teams",
  "Non-technical operators",
];

const CAPABILITIES = [
  {
    n: "01",
    title: "MVPs & prototypes",
    desc: "Turn an idea into something testable. I scope, design and build an early version of your product fast — so you can put something real in front of users and investors, not just a deck.",
  },
  {
    n: "02",
    title: "Websites & landing pages",
    desc: "Zero to live in days. Fast, clean, conversion-ready sites that look like you mean business — without the agency timeline or the agency price tag.",
  },
  {
    n: "03",
    title: "Internal tools & dashboards",
    desc: "Replace the spreadsheets. Custom tools for ops, data and reporting your team will actually use — without the enterprise software price.",
  },
  {
    n: "04",
    title: "AI workflows & automations",
    desc: "Put AI to work inside your business. Automations that cut manual effort and give a small team real leverage.",
  },
];

const SKILLS = [
  "Product strategy",
  "Branding & logos",
  "Design systems",
  "Web & mobile apps",
  "Database design",
  "API integrations",
  "Process automation",
  "AI-enabled delivery",
];

const PROCESS_STEPS = [
  {
    idx: "01",
    name: "Brief",
    body: "We start with a conversation, not a form. You tell me what you're trying to achieve. I ask the right questions and find the real problem fast.",
    close: "We find the real problem before a line of code is written.",
  },
  {
    idx: "02",
    name: "Build",
    body: "I use AI-native tooling and a lean build process to move faster than a traditional agency. You see working output in days — not Jira tickets and weekly stand-ups.",
    close: "Progress you can see in days, not monthly status reports.",
  },
  {
    idx: "03",
    name: "Ship",
    body: "I deploy and hand over cleanly. You own everything — code, design and infrastructure — and you can run it without me.",
    close: "No lock-in. No ongoing dependency unless you want one.",
  },
];

const FOUNDER_POINTS = [
  "A direct line to the person actually building your product.",
  "Commercial and technical judgement in one head, not two teams.",
  "Decisions made in minutes, not in meetings.",
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
            <a href="#build">What I build</a>
            <a href="#process">How it works</a>
            <a href="#founder">About</a>
          </div>
          <a
            href={CALENDLY_URL}
            className="btn-ghost-nav"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a free call
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
          <a href="#build" onClick={() => setMenuOpen(false)}>
            What I build
          </a>
          <a href="#process" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="#founder" onClick={() => setMenuOpen(false)}>
            About
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
            Book a free call
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
              North London, UK
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap hero-top">
          <h1 id="hero-h1" className="fade-up hero-fade">
            Your idea,
          </h1>
          <span id="hero-mom" className="mom fade-up hero-fade">
            built in days.
          </span>
          <p id="hero-philo" className="philo fade-up hero-fade">
            Founder-led, AI-native product building. Days or weeks — never quarters.
          </p>
        </div>
        <div className="wrap">
          <div id="hero-bottom" className="hero-bottom fade-up hero-fade">
            <div className="hero-left">
              <p className="hero-marginnote">
                You deal directly with me — not an agency, an account manager or an offshore team.
              </p>
              <p className="body">
                Sprint Labs is an AI-native product studio run by Luke. I help founders, startups,
                SMEs and product teams turn ideas into working products — in days or weeks, not
                quarters.
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
                  Book a free call
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

      {/* POSITIONING — what Sprint Labs is */}
      <section className="manifesto">
        <div className="wrap manifesto-inner fade-up">
          <h2>A product studio that behaves like a co-founder, not an agency.</h2>
          <p>
            Most ideas don't stall for lack of ambition. They stall in the gap between a plan and
            something real — a gap traditional agencies tend to make wider, slower and more
            expensive than it needs to be. Sprint Labs exists to close it. There's no brief to write
            and no discovery phase to fund. I ask one question: what are you trying to build?
          </p>
          <p className="close">You don't need a technical spec. You need momentum.</p>
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

      {/* AUDIENCE — who it's for */}
      <div className="proof">
        <div className="wrap proof-inner">
          <span className="proof-label">WHO IT'S FOR</span>
          {AUDIENCE.map((s) => (
            <span key={s} className="proof-item">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* WHAT I BUILD */}
      <section className="capabilities" id="build">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">WHAT I BUILD</div>
            <h2 className="h2">From a rough idea to a working product.</h2>
            <p className="sub">
              Whatever stage you're at, I can take it from zero to something real — fast. These are
              the things I'm asked to build most often.
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
          <div className="cap-skills fade-up">
            <span className="skills-label">ALSO</span>
            {SKILLS.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="process" id="process">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2 className="h2">Brief. Build. Ship.</h2>
            <p className="sub">
              A lean process built around speed and visibility. No hidden phases. No status meetings
              standing in for progress.
            </p>
          </div>
          <div className="process-grid">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.idx} className={`fade-up d${i + 1}`}>
                <div className="step-idx">STEP {s.idx}</div>
                <div className="step-name">{s.name}</div>
                <div className="step-body">{s.body}</div>
                <div className="step-close">{s.close}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT LUKE — founder */}
      <section className="founder" id="founder">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">WHO YOU'RE WORKING WITH</div>
            <h2 className="h2">You're dealing directly with me.</h2>
          </div>
          <div className="founder-grid fade-up">
            <div className="f-card">
              <div className="f-monogram">
                <span>L</span>
              </div>
              <div className="f-name">Luke</div>
              <div className="f-role">Founder, Sprint Labs</div>
              <div className="f-loc">North London, UK</div>
              <div className="f-tags">AI · Product · GTM · Startups · 10 years</div>
            </div>
            <div className="f-body">
              <div className="f-quote">
                "You're dealing directly with me — a real person — not a faceless team, an offshore
                delivery model or a support bot."
              </div>
              <p>
                I'm Luke, a real person from North London. I've spent the last ten years working
                across AI, technology startups and scaleups — commercially and operationally, across
                sales, product, clients, customers and technology. I've managed teams, shipped
                products, bought hundreds of thousands of pounds of technology, and sold a great
                deal more of it.
              </p>
              <p>
                I've also been a founder myself. <strong>That business failed</strong> — but it
                failed fast, and that experience shaped how I think about momentum, validation and
                execution.
              </p>
              <p>
                The AI revolution has dramatically cut the speed and cost of producing high-quality
                technology — and that's still one of the industry's best-kept secrets. I use the
                best AI tools and modern workflows to help individuals and small teams move faster
                than a traditional agency would usually allow.
              </p>
              <p>
                Because I've always worked in commercially minded GTM teams, I understand the
                intersection of sales, product, clients, customers and technology. That means I
                think strategically, pragmatically and commercially — while still moving quickly.
              </p>
              <p>
                I can support across product strategy, prototypes, MVPs, websites, apps, workflows,
                branding, logos, design systems, database design, automation and AI-enabled
                delivery.
              </p>
              <div className="f-points">
                {FOUNDER_POINTS.map((p) => (
                  <div key={p} className="f-point">
                    <span className="dot" />
                    {p}
                  </div>
                ))}
              </div>
              <div className="f-sig">— Luke, Founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRY BEFORE YOU BUY */}
      <section className="tbuyb" id="try">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">A LOW-RISK START</div>
          </div>
          <div className="tbuyb-inner fade-up">
            <div className="tbuyb-left">
              <h2 className="tbuyb-h">Try before you buy.</h2>
              <p>
                Before you commit a budget, let's prove it's worth it. We start with a free call —
                no lengthy proposal to wait for, no commitment and no obligation.
              </p>
              <p>
                At a minimum, you'll walk away with a genuinely useful conversation, a mini
                masterclass in what's now possible, and a clear head start on your idea.
              </p>
              <p>
                Where scope and availability allow, I'll go further and build a lightweight
                prototype — sometimes in hours or days — so you have something tangible to react to
                before spending a penny.
              </p>
            </div>
            <div className="tbuyb-right">
              <div className="tbuyb-right-h">WHAT YOU GET</div>
              <div className="tbuyb-offer">
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>
                    <strong>A free initial call.</strong> No commitment, no obligation, no lengthy
                    proposal process.
                  </p>
                </div>
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>
                    <strong>An honest, useful conversation</strong> about your idea and what's
                    genuinely possible.
                  </p>
                </div>
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>
                    <strong>A mini masterclass</strong> on how modern AI workflows change the cost
                    and speed of building.
                  </p>
                </div>
                <div className="tbuyb-item">
                  <div className="tbuyb-dot" />
                  <p>
                    <strong>Where scope allows, a lightweight prototype</strong> built around your
                    idea — not a generic demo.
                  </p>
                </div>
              </div>
              <div className="tbuyb-cta">
                <p>
                  Worst case, you leave with clarity and a head start. Best case, you leave with the
                  start of your product.
                </p>
                <a
                  href={CALENDLY_URL}
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a free call
                </a>
              </div>
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
            Book a free 30-minute call. We'll talk through your idea and I'll give you a straight
            view on what's possible, how long it takes and what it costs. No deck. No proposal.
          </p>
          <div className="cta-buttons">
            <a
              href={CALENDLY_URL}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a free call
            </a>
            <a href={CTA_EMAIL} className="btn-ghost">
              Talk through an idea
            </a>
          </div>
          <div className="footnote">
            Or email directly: <a href={CTA_EMAIL}>luke@sprintlabs.uk</a> · North London, UK
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
              AI-native product studio based in North London.
              <br />
              <a href={CTA_EMAIL} style={{ color: "var(--t3)", textDecoration: "none" }}>
                luke@sprintlabs.uk
              </a>
            </div>
          </div>
          <div className="foot-c">
            <a href="#build">What I build</a>
            <a href="#process">How it works</a>
            <a href="#founder">About</a>
            <a href="#try">Try before you buy</a>
            <a href={CTA_EMAIL}>Contact</a>
          </div>
          <div className="foot-r">
            © {new Date().getFullYear()} Sprint Labs Ltd
            <br />
            North London, UK
          </div>
        </div>
      </footer>
    </>
  );
}
