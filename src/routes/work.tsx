import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "Client work · Sprint Labs";
const DESCRIPTION =
  "Recent client work from Sprint Labs, from live production platforms to early prototypes, for RPM and Gareth Cadwallader.";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://sprintlabs.uk/work" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: "https://sprintlabs.uk/work" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  component: Work,
});

const CSS = `
:root{
  --bg:#080808; --s1:#0f0f0f; --s2:#161616;
  --b:rgba(255,255,255,0.07); --b2:rgba(255,255,255,0.13);
  --t:#f0ece4; --t2:rgba(240,236,228,0.55); --t3:rgba(240,236,228,0.38); --t4:rgba(240,236,228,0.16);
  --a:#ff5e00;
  --mono: "IBM Plex Mono","SF Mono","Fira Mono","Courier New",monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--t);font-family:"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:inherit;text-decoration:none}
a:focus-visible{outline:2px solid var(--a);outline-offset:2px;border-radius:3px}
.wrap{max-width:1200px;margin:0 auto;padding:0 48px}
@media (max-width:640px){.wrap{padding:0 22px}}

/* NAV */
.nav{border-bottom:1px solid var(--b)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.wordmark{font-weight:700;font-size:16px;letter-spacing:-0.4px;color:var(--t)}
.wordmark .a{color:var(--a)}
.btn-ghost-nav{font-size:13px;font-weight:500;color:var(--t);background:transparent;border:1px solid var(--b2);padding:7px 15px;border-radius:5px;transition:all .2s}
.btn-ghost-nav:hover{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.04)}

/* Section common */
.eyebrow{font-family:var(--mono);font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:22px}
.h2{font-size:clamp(30px,4.2vw,54px);font-weight:800;letter-spacing:-1.8px;color:var(--t);line-height:1.04}
.sub{margin-top:18px;font-size:16px;color:var(--t2);max-width:640px;line-height:1.65}

/* WORK */
.work-intro{padding-top:80px}
.clients{padding-bottom:88px}
.client{padding-top:64px}
.client-head{border-top:1px solid var(--b);padding-top:28px;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px 32px}
.client-name{font-size:clamp(24px,2.6vw,32px);font-weight:800;letter-spacing:-0.8px;color:var(--t);line-height:1.1}
.client-about{font-size:14px;color:var(--t2);line-height:1.6;max-width:520px}
.work-grid{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b);border:1px solid var(--b)}
.work-grid > :last-child:nth-child(odd){grid-column:1 / -1}
.work-card{background:var(--s1);padding:44px;display:flex;flex-direction:column;transition:background .2s}
.work-card:hover{background:var(--s2)}
.work-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:26px;font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase}
.work-client{color:var(--t3)}
.work-status{display:inline-flex;align-items:center;gap:8px;color:var(--t2);white-space:nowrap}
.work-status .dot{width:6px;height:6px;border-radius:50%;background:var(--t4);flex-shrink:0}
.work-status.live .dot{background:var(--a)}
.work-title{font-size:21px;font-weight:700;letter-spacing:-0.4px;color:var(--t);line-height:1.2;margin-bottom:14px}
.work-outcome{font-size:15px;font-weight:600;color:var(--t);line-height:1.5;margin-bottom:12px;max-width:560px}
.work-desc{font-size:14px;color:var(--t2);line-height:1.72;max-width:560px}
.work-foot{margin-top:auto;padding-top:32px;display:flex;flex-direction:column;align-items:flex-start;gap:20px}
.work-stack{display:flex;flex-wrap:wrap;gap:8px;list-style:none}
.work-stack li{font-family:var(--mono);font-size:12px;color:var(--t2);border:1px solid var(--b);padding:7px 12px;border-radius:5px}
.work-link{font-family:var(--mono);font-size:12px;color:var(--t);border-bottom:1px solid var(--b2);padding-bottom:2px;transition:border-color .2s}
.work-link:hover{border-color:var(--a)}
@media (max-width:640px){.work-grid{grid-template-columns:1fr}.work-card{padding:32px}}

/* CTA */
.cta{background:var(--bg);border-top:1px solid var(--b);padding:88px 0;text-align:center}
.cta-inner{max-width:620px;margin:0 auto}
.cta-eyebrow{font-family:var(--mono);font-size:11px;color:var(--a);text-transform:uppercase;letter-spacing:.12em;margin-bottom:24px}
.cta h2{font-weight:900;font-size:clamp(44px,6.5vw,86px);letter-spacing:-3px;color:var(--t);line-height:.98}
.cta h2 .mom{color:var(--a);display:block}
.cta .csub{max-width:420px;margin:24px auto 40px;font-size:15px;color:var(--t2);line-height:1.72}
.btn-primary{background:var(--a);color:var(--bg);font-weight:700;font-size:15px;padding:13px 28px;border-radius:5px;transition:background .2s,transform .2s,box-shadow .2s;display:inline-block;box-shadow:0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px -12px rgba(255,94,0,.6)}
.btn-primary:hover{background:#ff7325;transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,0.1) inset, 0 12px 28px -10px rgba(255,94,0,.7)}
.cta .footnote{margin-top:28px;font-size:13px;color:var(--t2)}
.cta .footnote a{color:var(--t2);text-decoration:underline;text-underline-offset:3px}

/* FOOTER */
footer{border-top:1px solid var(--b);padding:36px 0}
.foot{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px}
.foot-l{margin-top:10px;font-family:var(--mono);font-size:11px;line-height:1.6}
.foot-l a{color:var(--t3);transition:color .2s}
.foot-l a:hover{color:var(--t2)}
.foot-r{text-align:right;font-family:var(--mono);font-size:11px;color:var(--t4);line-height:1.6}
@media (max-width:640px){.foot-r{text-align:left}}
`;

// Grouped by client, live work first within each group.
const CLIENTS = [
  {
    id: "rpm",
    name: "RPM",
    about: "Refuel Performance Management, a goalkeeper representation and scouting agency.",
    projects: [
      {
        name: "Mentor Hub",
        status: "Live",
        outcome: "The mentor team's work, in one place.",
        desc: "A production platform for RPM's mentor team, live since August 2026. Goalkeeper roster, match reports scored on RPM's seven pillars, interaction logs, duty of care tracking, calendar, media library and bulletin boards, with role-based access for mentors, managers and admins.",
        stack: ["React", "TanStack Start", "Supabase", "Vercel"],
        link: { href: "https://rpmmentor.com", label: "rpmmentor.com" },
      },
      {
        name: "GKHQ Scouting Hub",
        status: "Live",
        outcome: "One shared memory for goalkeeper scouting and recruitment.",
        desc: "A goalkeeper scouting and recruitment platform. Profiles, assessments and match reports sit in one shared intelligence database, so what one scout learns, others can build on.",
        stack: ["React", "TanStack Start", "Supabase"],
        link: { href: "https://scout.gkhq.app", label: "scout.gkhq.app" },
      },
      {
        name: "RPM Finance",
        status: "In progress",
        outcome: "Built to make the agency's finances readable at a glance.",
        desc: "A finance app for RPM's leadership team. It started as a prototype and is now in development.",
        stack: ["React", "TanStack Start", "Supabase"],
      },
      {
        name: "Recruitment CRM",
        status: "In progress",
        outcome: "Outfield recruitment, organised on phone and iPad.",
        desc: "An outfield recruitment app for phone and iPad, covering player profiles, contact tracking, club contacts and match reports.",
        stack: ["Next.js", "Vercel"],
      },
      {
        name: "GK Icon",
        status: "Prototype",
        outcome: "Coaching for aspiring goalkeepers, in their pocket.",
        desc: "A mobile app concept for aspiring goalkeepers: learning content, feedback from coaches on their own clips, and live sessions.",
        stack: ["React Native", "Expo"],
      },
    ],
  },
  {
    id: "gareth",
    name: "Gareth Cadwallader",
    about: "Two sites, both live.",
    projects: [
      {
        name: "The Founders' Way",
        status: "Live",
        outcome: "Gareth's video series for founders, on a portal of its own.",
        desc: "An editorial video portal for founders and founding teams. Featured and latest episodes lead the homepage, with gated Academy content planned next.",
        stack: ["React", "TanStack Start", "Supabase"],
        link: { href: "https://founders-way.com", label: "founders-way.com" },
      },
      {
        name: "Sandalwood & Sage",
        status: "Live",
        outcome: "A proper home online for a podcast built on evidence, not opinion.",
        desc: "The site for a podcast of short, structured debates, where each episode takes one question and looks at it from two perspectives in around fifteen minutes.",
        stack: ["React", "Vite", "Vercel"],
        link: { href: "https://sandalwood-and-sage.com", label: "sandalwood-and-sage.com" },
      },
    ],
  },
];

const CTA_EMAIL = "mailto:luke@sprintlabs.uk?subject=Sprint%20Labs%20enquiry";

function Work() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* NAV */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <Link to="/" className="wordmark">
            Sprint<span className="a">Labs.</span>
          </Link>
          <a href={CTA_EMAIL} className="btn-ghost-nav">
            Email me
          </a>
        </div>
      </nav>

      <main>
        <header className="wrap work-intro">
          <div className="eyebrow">CLIENT WORK</div>
          <h1 className="h2">Real products for real clients.</h1>
          <p className="sub">
            A selection of recent client work, from production platforms to early prototypes. Live
            projects link out; anything still in progress stays private for now.
          </p>
        </header>

        <div className="clients">
          {CLIENTS.map((c) => (
            <section key={c.id} className="client" aria-labelledby={`client-${c.id}`}>
              <div className="wrap">
                <div className="client-head">
                  <h2 id={`client-${c.id}`} className="client-name">
                    {c.name}
                  </h2>
                  <p className="client-about">{c.about}</p>
                </div>
                <div className="work-grid">
                  {c.projects.map((p) => (
                    <article key={p.name} className="work-card">
                      <div className="work-meta">
                        <span className="work-client">{c.name}</span>
                        <span className={`work-status${p.status === "Live" ? " live" : ""}`}>
                          <span className="dot" aria-hidden="true" />
                          {p.status}
                        </span>
                      </div>
                      <h3 className="work-title">{p.name}</h3>
                      <p className="work-outcome">{p.outcome}</p>
                      <p className="work-desc">{p.desc}</p>
                      <div className="work-foot">
                        <ul className="work-stack" aria-label="Stack">
                          {p.stack.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                        {p.link && (
                          <a
                            href={p.link.href}
                            className="work-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {p.link.label}
                            <span aria-hidden="true"> ↗</span>
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="cta">
        <div className="wrap cta-inner">
          <div className="cta-eyebrow">START A SPRINT</div>
          <h2>
            Ready to build
            <span className="mom">momentum?</span>
          </h2>
          <p className="csub">
            Tell me what you're trying to build. I'll give you a straight view on what's possible
            and how long it takes. No deck. No proposal.
          </p>
          <a href={CTA_EMAIL} className="btn-primary">
            Talk through an idea
          </a>
          <div className="footnote">
            Or email directly: <a href={CTA_EMAIL}>luke@sprintlabs.uk</a> · North London, UK
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot">
          <div>
            <Link to="/" className="wordmark">
              Sprint<span className="a">Labs.</span>
            </Link>
            <div className="foot-l">
              <a href={CTA_EMAIL}>luke@sprintlabs.uk</a>
            </div>
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
