import { createFileRoute, Link } from "@tanstack/react-router";
import workCss from "../components/work/work.css?url";
import { CLIENTS, HERO_STATS } from "../components/work/data";
import { CaseStudy } from "../components/work/CaseStudy";
import { MetricValue, Reveal, ScrollProgress, StatusPill } from "../components/work/ui";

const TITLE = "Client work · Sprint Labs";
const DESCRIPTION =
  "Case studies from Sprint Labs: seven products for a top football agency and an entrepreneur, from first call to live software in weeks.";

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
      { rel: "stylesheet", href: workCss },
    ],
  }),
  component: Work,
});

const CTA_EMAIL = "mailto:luke@sprintlabs.uk?subject=Sprint%20Labs%20enquiry";

const TOTAL = CLIENTS.reduce((n, c) => n + c.projects.length, 0);

const SPRINT_STEPS = [
  {
    when: "Day 1",
    what: "Discovery",
    detail: "One call to map how you work today and what's slowing you down.",
  },
  {
    when: "Days 2–5",
    what: "Clickable prototype",
    detail: "Something real to tap through, tested with your team, not a slide deck.",
  },
  {
    when: "Weeks 2–4",
    what: "Production build",
    detail: "The real thing on a modern stack, with your data and your roles.",
  },
  {
    when: "Launch",
    what: "Go live and hand over",
    detail: "Migration, training and a product your team actually uses.",
  },
];

function Work() {
  let running = 0;
  return (
    <div className="wk">
      <ScrollProgress />

      <nav className="nav">
        <div className="wrap nav-inner">
          <Link to="/" className="wordmark">
            Sprint<span className="a">Labs.</span>
          </Link>
          <div className="nav-r">
            <a href="#index" className="nav-link">
              The work
            </a>
            <a href="#process" className="nav-link">
              How I work
            </a>
            <a href={CTA_EMAIL} className="btn-ghost-nav">
              Email me
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <header className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="wrap">
            <Reveal className="eyebrow">
              <span className="dot" aria-hidden="true" />
              Selected client work · 2026
            </Reveal>
            <Reveal delay={60}>
              <h1 className="hero-h">
                Seven products.
                <br />
                Two clients.
                <br />
                <span className="a">Weeks, not months.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="hero-sub">
                Real software for a top football agency and an entrepreneur. Every project below has
                a working preview you can click through, plus how they worked before, what I built,
                how fast it shipped and what changed.
              </p>
            </Reveal>
            <Reveal delay={220} className="hero-stats">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="hs">
                  <div className="hs-num">
                    <MetricValue m={s} />
                  </div>
                  <div className="hs-lbl">{s.label}</div>
                </div>
              ))}
            </Reveal>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[0, 1].map((k) => (
                <span key={k} className="marquee-set">
                  {CLIENTS.flatMap((c) => c.projects).map((p) => (
                    <span key={p.id} className="mq">
                      {p.name}
                      <span className="mq-sep">»</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* INDEX */}
        <section id="index" className="index wrap" aria-labelledby="index-h">
          <Reveal className="sec-head">
            <div className="eyebrow plain">Index</div>
            <h2 id="index-h" className="sec-h">
              The work, at a glance.
            </h2>
          </Reveal>
          <ol className="idx">
            {CLIENTS.flatMap((c) => c.projects.map((p) => ({ p, who: c.who }))).map(
              ({ p, who }, i) => (
                <Reveal as="li" key={p.id} delay={i * 40}>
                  <a href={`#${p.id}`} className="idx-row">
                    <span className="idx-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="idx-name">{p.name}</span>
                    <span className="idx-kind">{p.kind}</span>
                    <span className="idx-who">{who}</span>
                    <span className="idx-ship">{p.shipped}</span>
                    <StatusPill status={p.status} />
                    <span className="idx-go" aria-hidden="true">
                      ↓
                    </span>
                  </a>
                </Reveal>
              ),
            )}
          </ol>
        </section>

        {/* CLIENTS + CASE STUDIES */}
        {CLIENTS.map((c) => (
          <section key={c.id} className="chapter" aria-labelledby={`client-${c.id}`}>
            <div className="wrap">
              <Reveal className="ch-head">
                <div className="ch-label">{c.label}</div>
                <h2 id={`client-${c.id}`} className="ch-who">
                  {c.who}
                </h2>
                <p className="ch-about">{c.about}</p>
                <div className="ch-count">
                  {c.projects.length} {c.projects.length === 1 ? "product" : "products"} ·{" "}
                  {c.projects.filter((p) => p.status === "Live").length} live
                </div>
              </Reveal>
              {c.projects.map((p) => {
                const i = running++;
                return (
                  <CaseStudy key={p.id} project={p} index={i} total={TOTAL} clientWho={c.who} />
                );
              })}
            </div>
          </section>
        ))}

        {/* PROCESS */}
        <section id="process" className="process" aria-labelledby="process-h">
          <div className="wrap">
            <Reveal className="sec-head">
              <div className="eyebrow plain">How every project runs</div>
              <h2 id="process-h" className="sec-h">
                From first call to live product
                <br />
                <span className="a">before most agencies finish the proposal.</span>
              </h2>
            </Reveal>
            <ol className="sprint">
              {SPRINT_STEPS.map((s, i) => (
                <Reveal as="li" key={s.what} delay={i * 80} className="sp">
                  <div className="sp-when">{s.when}</div>
                  <div className="sp-what">{s.what}</div>
                  <p className="sp-detail">{s.detail}</p>
                </Reveal>
              ))}
            </ol>
            <Reveal className="race">
              <div className="race-row">
                <div className="race-lbl">Typical agency build</div>
                <div className="race-track">
                  <div className="race-bar slow">
                    <span>3 to 6 months</span>
                  </div>
                </div>
              </div>
              <div className="race-row">
                <div className="race-lbl">
                  Sprint<span className="a">Labs.</span>
                </div>
                <div className="race-track">
                  <div className="race-bar fast">
                    <span>1 to 5 weeks</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* CTA */}
      <section className="cta">
        <div className="wrap cta-inner">
          <div className="cta-eyebrow">START A SPRINT</div>
          <h2>
            Your project
            <span className="mom">could be next.</span>
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
    </div>
  );
}
