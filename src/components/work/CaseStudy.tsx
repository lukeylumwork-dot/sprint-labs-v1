import type { Project } from "./data";
import { BeforeAfter, Metrics, Process, Reveal, Stage, StatusPill } from "./ui";
import { MOCKUPS } from "./mockups";

export function CaseStudy({
  project,
  index,
  total,
  clientWho,
}: {
  project: Project;
  index: number;
  total: number;
  clientWho: string;
}) {
  const Mockup = MOCKUPS[project.id];
  const num = String(index + 1).padStart(2, "0");
  const head = (
    <Reveal as="header" className="cs-head">
      <div className="cs-meta">
        <span className="cs-num">
          {num}
          <span className="of"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span className="cs-kind">{project.kind}</span>
        <StatusPill status={project.status} />
      </div>
      <h3 className="cs-title" id={`${project.id}-title`}>
        {project.name}
      </h3>
      <p className="cs-headline">{project.headline}</p>
      <p className="cs-summary">{project.summary}</p>
      <div className="cs-facts">
        <span className="fact">
          <span className="bolt" aria-hidden="true">
            ⚡
          </span>
          {project.shipped}
        </span>
        <span className="fact muted">
          For {clientWho.charAt(0).toLowerCase() + clientWho.slice(1)}
        </span>
      </div>
    </Reveal>
  );
  const stage = Mockup ? (
    <Stage project={project}>
      <Mockup />
    </Stage>
  ) : null;
  const stack = (
    <ul className="stack" aria-label="Stack">
      {project.stack.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );

  // Phone previews sit beside the story; browser and tablet previews run full width.
  if (project.device === "phone") {
    return (
      <article
        id={project.id}
        className={`cs cs-compact dev-${project.device}`}
        aria-labelledby={`${project.id}-title`}
      >
        <div className="cs-bgnum" aria-hidden="true">
          {num}
        </div>
        <div className="cs-split">
          <div className="cs-a-head">{head}</div>
          <Reveal className="cs-stagecol" delay={120}>
            {stage}
          </Reveal>
          <Reveal className="cs-a-ba">
            <BeforeAfter project={project} />
          </Reveal>
        </div>
        <div className="cs-lower">
          <Reveal>
            <Process project={project} />
          </Reveal>
          <Reveal delay={100}>
            <Metrics project={project} />
            {stack}
          </Reveal>
        </div>
      </article>
    );
  }

  return (
    <article
      id={project.id}
      className={`cs cs-feature dev-${project.device}`}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="cs-bgnum" aria-hidden="true">
        {num}
      </div>
      {head}
      <Reveal className="cs-stagewrap" delay={80}>
        {stage}
      </Reveal>
      <Reveal>
        <BeforeAfter project={project} />
      </Reveal>
      <div className="cs-lower">
        <Reveal>
          <Process project={project} />
        </Reveal>
        <Reveal delay={100}>
          <Metrics project={project} />
          {stack}
        </Reveal>
      </div>
    </article>
  );
}
