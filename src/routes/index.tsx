import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sprint Labs — New site coming soon" },
      {
        name: "description",
        content: "Sprint Labs is working on something new. Check back soon.",
      },
      { property: "og:title", content: "Sprint Labs — New site coming soon" },
      {
        property: "og:description",
        content: "Sprint Labs is working on something new. Check back soon.",
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
  --bg:#080808;
  --t:#f0ece4; --t2:rgba(240,236,228,0.55);
  --a:#ff5e00;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--t);font-family:"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.soon{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
.wordmark{font-weight:800;font-size:20px;letter-spacing:-0.4px;margin-bottom:28px}
.wordmark .a{color:var(--a)}
.soon h1{font-weight:900;font-size:clamp(32px,6vw,64px);letter-spacing:-2px;line-height:1.05}
.soon h1 .a{color:var(--a)}
.soon p{margin-top:18px;font-size:16px;color:var(--t2);max-width:420px;line-height:1.6}
.soon .contact{margin-top:36px;font-size:14px;color:var(--t2)}
.soon .contact a{color:var(--t);text-decoration:underline;text-underline-offset:3px}
`;

function Index() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="soon">
        <div className="wordmark">
          Sprint<span className="a">Labs.</span>
        </div>
        <h1>
          New site <span className="a">coming soon.</span>
        </h1>
        <p>We're building something new. Check back shortly.</p>
        <div className="contact">
          In the meantime, reach out at <a href="mailto:luke@sprintlabs.uk">luke@sprintlabs.uk</a>
        </div>
      </div>
    </>
  );
}
