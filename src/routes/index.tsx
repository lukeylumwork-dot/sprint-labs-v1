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
  --t:#f0ece4; --t2:rgba(240,236,228,0.48); --t3:rgba(240,236,228,0.24); --t4:rgba(240,236,228,0.10);
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
.wordmark{font-weight:700;font-size:14px;letter-spacing:-0.3px;color:var(--t)}
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
.mobile-nav-links a.eyebrow-link{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px;letter-spacing:.12em}
.mobile-nav-cta{margin-top:48px;position:relative;z-index:1}
.mobile-nav-cta .btn-ghost-nav{display:inline-block;font-size:14px;padding:11px 20px}
.mobile-overlay .overlay-foot{position:absolute;bottom:0;left:0;right:0;border-top:1px solid var(--b);padding:20px 0}
.mobile-overlay .overlay-foot-inner{display:flex;justify-content:space-between;align-items:center;max-width:1200px;margin:0 auto;padding:0 48px}
@media (max-width:640px){.mobile-overlay .overlay-foot-inner{padding:0 22px}}

/* HERO */
.hero{min-height:calc(100vh - 64px);display:grid;grid-template-rows:1fr auto;position:relative;overflow:hidden;padding-top:64px}
.hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--b) 1px,transparent 1px),linear-gradient(90deg,var(--b) 1px,transparent 1px);background-size:80px 80px;opacity:.4;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent);mask-image:radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent)}
.hero-top{display:flex;flex-direction:column;justify-content:center;padding:20px 0 12px;position:relative;z-index:1}
.hero h1{font-weight:900;font-size:clamp(80px,12vw,180px);letter-spacing:-5px;line-height:.95;color:var(--t)}
.hero .mom{font-weight:900;font-size:clamp(56px,8.5vw,128px);letter-spacing:-4px;line-height:.95;color:var(--a);display:block}
.hero .philo{margin-top:16px;font-weight:700;font-size:clamp(16px,2vw,24px);color:var(--t2);letter-spacing:-0.4px}
.hero-bottom{border-top:1px solid var(--b);padding:16px 0 28px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start;position:relative;z-index:1}
.hero-bottom .body{font-size:15px;color:var(--t2);line-height:1.72;max-width:460px}
.hero-cta{display:flex;flex-direction:column;align-items:flex-end;gap:12px}
.hero-cta .row{display:flex;gap:10px}
.btn-primary{background:var(--t);color:var(--bg);font-weight:700;font-size:14px;padding:11px 20px;border-radius:5px;transition:opacity .2s,transform .2s;display:inline-block}
.btn-primary:hover{opacity:.88;transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid var(--b);color:var(--t2);font-weight:600;font-size:14px;padding:11px 18px;border-radius:5px;transition:all .2s;display:inline-block}
.btn-ghost:hover{border-color:var(--b2);color:var(--t)}
.hero-cta .note{font-family:var(--mono);font-size:12px;color:var(--t3)}
@media (max-width:640px){
  .hero-bottom{grid-template-columns:1fr}
  .hero-cta{align-items:flex-start}
  .hero-cta .row{flex-direction:column;width:100%}
  .btn-primary,.btn-ghost{text-align:center}
}

/* fade-up */
.fade-up{opacity:0;transform:translateY(18px);transition:opacity .8s ease,transform .8s ease}
.fade-up.in{opacity:1;transform:translateY(0)}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}

/* TICKER */
.ticker{height:32px;border-top:1px solid var(--b);border-bottom:1px solid var(--b);overflow:hidden;display:flex;align-items:center;position:relative}
.ticker-track{display:flex;gap:0;animation:tick 45s linear infinite;white-space:nowrap;padding-left:0}
.ticker:hover .ticker-track{animation-play-state:paused}
.ticker-item{font-family:var(--mono);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);padding:0 18px;display:inline-flex;align-items:center}
.ticker-sep{color:var(--t4);font-family:var(--mono);font-size:11px}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* PROOF */
.proof{padding:18px 0;border-bottom:1px solid var(--b);background:var(--bg)}
.proof-inner{display:flex;align-items:center;flex-wrap:wrap}
.proof-label{font-family:var(--mono);font-size:10px;color:var(--t4);letter-spacing:.12em;text-transform:uppercase;padding-right:16px}
.proof-item{font-family:var(--mono);font-weight:500;font-size:12px;color:var(--t3);padding:0 16px;border-left:1px solid var(--b)}
.proof-item:first-of-type{border-left:1px solid var(--b)}

/* MANIFESTO */
.manifesto{background:var(--s1);border-top:1px solid var(--b);border-bottom:1px solid var(--b);padding:72px 0}
.manifesto-inner{max-width:720px;margin:0 auto;text-align:left}
.manifesto h2{font-size:clamp(28px,3.5vw,44px);font-weight:800;letter-spacing:-1.2px;color:var(--t);line-height:1.1}
.manifesto p{margin-top:20px;font-size:16px;color:var(--t2);line-height:1.78}
.manifesto .close{margin-top:24px;font-size:16px;font-weight:600;color:var(--t);line-height:1.6}

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
.process-grid{margin-top:64px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--b)}
.process-grid > div{padding:44px 36px;border-right:1px solid var(--b)}
.process-grid > div:last-child{border-right:none}
.step-idx{font-family:var(--mono);font-size:11px;color:var(--t3);letter-spacing:.1em;margin-bottom:28px;text-transform:uppercase}
.step-h{font-size:18px;font-weight:700;letter-spacing:-0.4px;color:var(--t);margin-bottom:16px}
.step-body{font-size:14px;color:var(--t2);line-height:1.72}
.step-close{font-weight:500;color:var(--t);margin-top:12px;font-size:14px;line-height:1.6}
@media (max-width:720px){.process-grid{grid-template-columns:1fr}.process-grid > div{border-right:none;border-bottom:1px solid var(--b)}.process-grid > div:last-child{border-bottom:none}}

/* WORK */
.work{background:var(--s1);border-top:1px solid var(--b);padding:72px 0}
.work-grid{margin-top:64px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b);border:1px solid var(--b)}
.work-card{background:var(--s1);padding:44px;min-height:300px;display:flex;flex-direction:column;justify-content:space-between;position:relative;transition:background .2s;cursor:pointer}
.work-card:hover{background:var(--s2)}
.work-top{display:flex;justify-content:space-between;align-items:flex-start}
.work-num{font-family:var(--mono);font-size:11px;color:var(--t3);letter-spacing:.08em}
.work-pill{font-family:var(--mono);font-size:10px;color:var(--t3);border:1px solid var(--b);border-radius:100px;padding:4px 10px;letter-spacing:.08em}
.work-bottom{padding-top:48px}
.work-cat{font-family:var(--mono);font-size:11px;color:var(--t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px}
.work-title{font-size:20px;font-weight:700;letter-spacing:-0.4px;color:var(--t2);line-height:1.2;margin-bottom:10px;transition:color .2s}
.work-card:hover .work-title{color:var(--t)}
.work-desc{font-size:13px;color:var(--t3);line-height:1.6;max-width:90%}
.work-arrow{position:absolute;bottom:44px;right:44px;color:var(--t4);transition:color .2s,transform .2s;font-size:18px}
.work-card:hover .work-arrow{color:var(--a);transform:translate(3px,-3px)}
@media (max-width:640px){.work-grid{grid-template-columns:1fr}}

/* FOUNDER */
.founder{background:var(--bg);border-top:1px solid var(--b);padding:72px 0}
.founder-grid{margin-top:48px;display:grid;grid-template-columns:280px 1fr;gap:88px}
.f-letter{font-weight:900;font-size:64px;color:var(--t2);letter-spacing:-2px;line-height:1}
.f-name{font-size:19px;font-weight:700;letter-spacing:-0.4px;margin-top:16px;color:var(--t)}
.f-role{font-size:13px;color:var(--t3);margin-bottom:24px;margin-top:4px}
.f-tags{font-family:var(--mono);font-size:11px;color:var(--t3)}
.f-quote{border-left:2px solid var(--b2);padding-left:22px;margin-bottom:28px;font-size:clamp(18px,2.3vw,25px);font-weight:700;letter-spacing:-0.6px;line-height:1.3;color:var(--t)}
.f-body p{font-size:15px;color:var(--t2);line-height:1.78;margin-bottom:18px}
.f-sig{font-size:14px;font-style:italic;color:var(--t3);margin-top:20px}
@media (max-width:820px){.founder-grid{grid-template-columns:1fr;gap:40px}}

/* CTA */
.cta{background:var(--bg);border-top:1px solid var(--b);padding:72px 0;text-align:center}
.cta-inner{max-width:600px;margin:0 auto}
.cta-eyebrow{font-family:var(--mono);font-size:11px;color:var(--a);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px}
.cta h2{font-weight:900;font-size:clamp(42px,6.5vw,84px);letter-spacing:-3px;color:var(--t);line-height:.98}
.cta h2 .mom{color:var(--a);display:block}
.cta .csub{max-width:380px;margin:24px auto 40px;font-size:15px;color:var(--t2);line-height:1.72}
.cta .btn-primary{font-size:15px;padding:13px 28px}
.cta .footnote{margin-top:24px;font-size:13px;color:var(--t3)}
.cta .footnote a{color:var(--t2);text-decoration:underline;text-underline-offset:3px}

/* FOOTER */
footer{border-top:1px solid var(--b);padding:36px 0}
.foot{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px}
.foot-c{display:flex;gap:24px}
.foot-c a{font-size:12px;color:var(--t3);transition:color .2s}
.foot-c a:hover{color:var(--t2)}
.foot-r{text-align:right;font-family:var(--mono);font-size:11px;color:var(--t4);line-height:1.6}
@media (max-width:640px){.foot-r{text-align:left}}
`;

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

    // hero load animation
    const heroEls: Array<[string, number]> = [
      ["hero-build", 80],
      ["hero-mom", 280],
      ["hero-philo", 380],
      ["hero-bottom", 560],
    ];
    const timers = heroEls.map(([id, ms]) =>
      window.setTimeout(() => document.getElementById(id)?.classList.add("in"), ms),
    );

    // intersection observer
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
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const tickerItems = [
    "Product Strategy",
    "MVP Scoping",
    "UX & UI Design",
    "Branding",
    "Visual Identity",
    "Web Applications",
    "AI Tools",
    "Workflow Automation",
    "Dashboard Design",
    "Database Design",
    "Product Roadmapping",
    "Ship Fast. Build Smarter.",
  ];
  const tickerLoop = [...tickerItems, ...tickerItems];

  const sectors = [
    "Fintech",
    "SaaS",
    "Creative & Media",
    "E-Commerce",
    "Professional Services",
    "Consumer Apps",
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <nav className="nav" id="nav">
        <div className="wrap nav-inner">
          <a href="#" className="wordmark" onClick={() => setMenuOpen(false)}>
            Sprint<span className="a">Labs.</span>
          </a>
          <div className="nav-links">
            <a href="#outcomes">Services</a>
            <a href="#work">Work</a>
            <a href="#founder">Studio</a>
          </div>
          <a href="mailto:hello@sprintlabs.uk" className="btn-ghost-nav">
            Start a Sprint →
          </a>
          <button
            className={`menu-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-overlay ${menuOpen ? "open" : ""}`}>
        <div className="overlay-grid" />
        <div className="mobile-nav-links">
          <a href="#outcomes" className="eyebrow-link" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#founder" onClick={() => setMenuOpen(false)}>Studio</a>
          <a href="mailto:hello@sprintlabs.uk" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
        <div className="mobile-nav-cta">
          <a href="mailto:hello@sprintlabs.uk" className="btn-ghost-nav" onClick={() => setMenuOpen(false)}>
            Start a Sprint →
          </a>
        </div>
        <div className="overlay-foot">
          <div className="overlay-foot-inner">
            <span className="wordmark">Sprint<span className="a">Labs.</span></span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t4)' }}>London, UK</span>
          </div>
        </div>
      </div>

      <header className="hero">
        <div className="hero-grid-bg" />
        <div className="wrap hero-top">
          <h1 id="hero-build" className="fade-up hero-fade">
            BUILD
          </h1>
          <span id="hero-mom" className="mom fade-up hero-fade">
            momentum.
          </span>
          <p id="hero-philo" className="philo fade-up hero-fade">
            Ideas are easy. Execution is everything.
          </p>
        </div>
        <div className="wrap">
          <div id="hero-bottom" className="hero-bottom fade-up hero-fade">
            <p className="body">
              Sprint Labs is an AI-native product studio. We help founders, startups and innovation
              teams turn ideas into working products — in weeks, not quarters.
            </p>
            <div className="hero-cta">
              <div className="row">
                <a href="mailto:hello@sprintlabs.uk" className="btn-primary">
                  Start a Sprint →
                </a>
                <a href="#process" className="btn-ghost">
                  See how we work ↓
                </a>
              </div>
              <div className="note">No spec needed. Just an idea.</div>
            </div>
          </div>
        </div>
      </header>

      <div className="ticker">
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

      <div className="proof">
        <div className="wrap proof-inner">
          <span className="proof-label">SECTORS</span>
          {sectors.map((s) => (
            <span key={s} className="proof-item">
              {s}
            </span>
          ))}
        </div>
      </div>

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
            {[
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
                svcs: [
                  "Websites",
                  "Web Applications",
                  "AI-Enabled Tools",
                  "Dashboards",
                  "Internal Tools",
                ],
              },
              {
                idx: "04",
                prob: "I need to do more with what I've already built.",
                svcs: [
                  "Workflow Automation",
                  "Database Design",
                  "API Integrations",
                  "AI Implementation",
                  "Process Engineering",
                ],
              },
            ].map((c, i) => (
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
            {[
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
                body: "We deploy, hand over cleanly and make sure you can operate what we've built. You own everything — code, assets, infrastructure.",
                close: "No lock-in. No ongoing dependency unless you want one.",
              },
            ].map((s, i) => (
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

      <section className="work" id="work">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">SELECTED WORK</div>
            <h2 className="h2">Built with intention.</h2>
            <p className="sub">
              A growing portfolio of products, platforms and tools — from idea to launch.
            </p>
          </div>
          <div className="work-grid">
            {[
              {
                n: "001",
                cat: "Platform / Media",
                t: "Media Catalog Platform",
                d: "A full-stack media management tool built for a creative production company.",
              },
              {
                n: "002",
                cat: "Brand / Investor",
                t: "Investor Intelligence Deck",
                d: "End-to-end brand, design and interactive deck for a financial media company.",
              },
              {
                n: "003",
                cat: "E-Commerce / Fashion",
                t: "Editorial Storefront",
                d: "An editorial Shopify storefront for an independent fashion and leather goods label.",
              },
              {
                n: "004",
                cat: "App / Consumer",
                t: "Digital Memory Archive",
                d: "A private platform for preserving family history and personal legacy.",
              },
            ].map((c, i) => (
              <div key={c.n} className={`work-card fade-up d${(i % 4) + 1}`}>
                <div className="work-top">
                  <span className="work-num">{c.n}</span>
                  <span className="work-pill">IN BUILD</span>
                </div>
                <div className="work-bottom">
                  <div className="work-cat">{c.cat}</div>
                  <div className="work-title">{c.t}</div>
                  <div className="work-desc">{c.d}</div>
                </div>
                <span className="work-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="founder" id="founder">
        <div className="wrap">
          <div className="fade-up">
            <div className="eyebrow">FROM THE FOUNDER</div>
          </div>
          <div className="founder-grid fade-up">
            <div>
              <div className="f-letter">L</div>
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

      <section className="cta">
        <div className="wrap cta-inner fade-up">
          <div className="cta-eyebrow">START A SPRINT</div>
          <h2>
            Ready to build
            <span className="mom">momentum?</span>
          </h2>
          <p className="csub">
            Tell us what you're building. We'll come back in 24 hours with a real view on scope,
            cost and timeline. No deck.
          </p>
          <a href="mailto:hello@sprintlabs.uk" className="btn-primary">
            Start a Sprint →
          </a>
          <div className="footnote">
            Or reach us at{" "}
            <a href="mailto:hello@sprintlabs.uk">hello@sprintlabs.uk</a> · London, UK
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot">
          <a href="#" className="wordmark">
            Sprint<span className="a">Labs.</span>
          </a>
          <div className="foot-c">
            <a href="#outcomes">Services</a>
            <a href="#work">Work</a>
            <a href="#founder">Studio</a>
            <a href="mailto:hello@sprintlabs.uk">Contact</a>
          </div>
          <div className="foot-r">
            Sprint Labs Ltd · Company No. [XXXXXXXX]
            <br />
            sprintlabs.uk — © 2025
          </div>
        </div>
      </footer>
    </>
  );
}
