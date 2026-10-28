import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type { Device, Metric, Phase, Project } from "./data";

/** True once the element has scrolled into view (stays true). */
function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, seen]);
  return [ref, seen] as const;
}

/** Fades and lifts its children in when scrolled into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "header" | "li";
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`rv${seen ? " in" : ""} ${className}`}
      style={{ "--rv-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Animated number that counts up from zero the first time it is seen. */
export function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(value);
  const started = useRef(false);
  useEffect(() => {
    if (!seen || started.current) return;
    started.current = true;
    if (prefersReducedMotion() || value === 0) {
      setShown(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setShown(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);
  return <span ref={ref}>{shown}</span>;
}

export function MetricValue({ m }: { m: Metric }) {
  if (m.value === undefined) return <>{m.display}</>;
  return (
    <>
      {m.prefix}
      <CountUp value={m.value} />
      {m.suffix && <span className="unit">{m.suffix}</span>}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Device frames. Mockups are designed on a fixed canvas and scaled.   */
/* ------------------------------------------------------------------ */

const CANVAS: Record<Device, { w: number; h: number }> = {
  browser: { w: 1280, h: 800 },
  tablet: { w: 1180, h: 820 },
  phone: { w: 390, h: 844 },
};

function ScaledCanvas({ device, children }: { device: Device; children: ReactNode }) {
  const { w, h } = CANVAS[device];
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / w);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="canvas" style={{ aspectRatio: `${w} / ${h}` }}>
      <div
        className="canvas-inner"
        style={{
          width: w,
          height: h,
          transform: `scale(${scale ?? 0})`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Full-screen viewer so a preview can be explored at a readable size, even on a phone. */
function Viewer({
  device,
  name,
  onClose,
  children,
}: {
  device: Device;
  name: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { w, h } = CANVAS[device];
  const closeRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 700) {
        // Small screens: keep the app legible and let people pan around it.
        const fit = (vw - 28) / w;
        setScale(device === "phone" ? Math.min(1, fit) : Math.max(0.6, fit));
      } else {
        setScale(Math.min(1, (vw - 48) / w, (vh - 120) / h));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [w, h, device, onClose]);
  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`${name} preview`}>
      <div className="viewer-bar">
        <div className="viewer-title">
          {name}
          <span>Interactive preview</span>
        </div>
        <button ref={closeRef} type="button" className="viewer-close" onClick={onClose}>
          Close ✕
        </button>
      </div>
      <div className="viewer-hint">Drag to pan around the app</div>
      <div className="viewer-body">
        {scale > 0 && (
          <div
            className={`viewer-frame${device === "phone" ? " phone-frame" : ""}`}
            style={{ width: w * scale, height: h * scale }}
          >
            <div style={{ width: w, height: h, transform: `scale(${scale})` }}>{children}</div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function Stage({
  project,
  children,
}: {
  project: Pick<Project, "device" | "name" | "id">;
  children: ReactNode;
}) {
  const { device, name } = project;
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const top = (
    <div className="stage-top">
      <div className="stage-hint" aria-hidden="true">
        <span className="pulse" />
        Interactive preview · click around
      </div>
      <button type="button" className="expand-btn" onClick={() => setOpen(true)}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
        Expand
      </button>
    </div>
  );
  const viewer = open ? (
    <Viewer device={device} name={name} onClose={close}>
      {children}
    </Viewer>
  ) : null;
  if (device === "phone") {
    return (
      <figure className="stage stage-phone" aria-label={`Interactive preview of ${name}`}>
        {top}
        <div className="phone">
          <div className="phone-screen">
            <ScaledCanvas device="phone">{children}</ScaledCanvas>
            <div className="phone-island" aria-hidden="true" />
          </div>
        </div>
        {viewer}
      </figure>
    );
  }
  if (device === "tablet") {
    return (
      <figure className="stage stage-tablet" aria-label={`Interactive preview of ${name}`}>
        {top}
        <div className="tablet">
          <div className="tablet-screen">
            <ScaledCanvas device="tablet">{children}</ScaledCanvas>
          </div>
        </div>
        {viewer}
      </figure>
    );
  }
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return (
    <figure className="stage stage-browser" aria-label={`Interactive preview of ${name}`}>
      {top}
      <div className="browser">
        <div className="browser-bar" aria-hidden="true">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="url">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="2.4"
              />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2.4" />
            </svg>
            {slug}.app
          </span>
          <span className="bar-end" />
        </div>
        <ScaledCanvas device="browser">{children}</ScaledCanvas>
      </div>
      {viewer}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Case-study building blocks                                          */
/* ------------------------------------------------------------------ */

const TILTS = [-4, 3, -2, 5, -3, 2, -5, 4];

export function BeforeAfter({ project }: { project: Project }) {
  const { before, after, name } = project;
  return (
    <div className="ba">
      <div className="ba-card ba-before">
        <div className="ba-label">
          <span className="ba-tag">Before</span>
          How they were working
        </div>
        <ul className="chaos" aria-label="Tools used before">
          {before.tools.map((t, i) => (
            <li key={t} style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}>
              {t}
            </li>
          ))}
        </ul>
        <ul className="pains">
          {before.pains.map((p) => (
            <li key={p}>
              <span className="x" aria-hidden="true">
                ✕
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="ba-arrow" aria-hidden="true">
        <span>→</span>
      </div>
      <div className="ba-card ba-after">
        <div className="ba-label">
          <span className="ba-tag on">After</span>
          {name}
        </div>
        <ul className="wins">
          {after.wins.map((w) => (
            <li key={w}>
              <span className="tick" aria-hidden="true">
                ✓
              </span>
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Process({ project }: { project: Project }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const total = project.timeline.reduce((s, p) => s + p.days, 0);
  return (
    <div className="proc" ref={ref}>
      <div className="blk-label">How it got built</div>
      <div className={`tl${seen ? " go" : ""}`}>
        {project.timeline.map((ph: Phase, i) => (
          <div
            key={ph.label}
            className="tl-seg"
            style={
              {
                flexGrow: Math.max(ph.days, total * 0.2),
                "--i": i,
              } as CSSProperties
            }
          >
            <div className="tl-bar">
              <span />
            </div>
            <div className="tl-name">{ph.label}</div>
            <div className="tl-dur">{ph.duration}</div>
          </div>
        ))}
      </div>
      <ol className="steps">
        {project.built.map((b, i) => (
          <li key={b}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            {b}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Metrics({ project }: { project: Project }) {
  const isTarget = project.metricsLabel === "Targets";
  return (
    <div className="mx">
      <div className="blk-label">
        {project.metricsLabel}
        {isTarget && <span className="blk-note"> · goals for the finished build</span>}
      </div>
      <div className={`mx-grid n${project.metrics.length}`}>
        {project.metrics.map((m) => (
          <div key={m.label} className="mx-cell">
            <div className="mx-num">
              <MetricValue m={m} />
            </div>
            <div className="mx-lbl">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: Project["status"] }) {
  const cls = status === "Live" ? "live" : status === "In development" ? "dev" : "proto";
  return (
    <span className={`pill ${cls}`}>
      <span className="dot" aria-hidden="true" />
      {status}
    </span>
  );
}

/** Thin orange bar showing how far down the page you are. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}
