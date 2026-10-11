import React, { useLayoutEffect, useRef, useState } from "react";
import { easeOut, prefersReducedMotion, segment, useScrollScene } from "../../hooks/useScrollScene";

export type CascadeStat = { value: number; suffix: string; label: string };

const format = (n: number) => n.toLocaleString("en-IN");

// Pinned stats: one number at a time counts up while a column of images
// slides diagonally behind it.
const StatsCascade = ({ stats, images }: { stats: Array<CascadeStat>; images: Array<string> }) => {
  const [active, setActive] = useState(0);
  const numberRef = useRef<HTMLSpanElement>(null);
  // The counter is written straight to the DOM every frame; this keeps the
  // latest value so a React re-render (e.g. switching stat) doesn't reset it.
  const shown = useRef(0);

  const ref = useScrollScene<HTMLElement>((p) => {
    const n = stats.length;
    const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
    setActive((cur) => (cur === idx ? cur : idx));
    // Count within the first 60% of this stat's slice of the scroll.
    const local = segment(p, idx / n, (idx + 0.6) / n);
    shown.current = Math.round(stats[idx].value * easeOut(local));
    if (numberRef.current) numberRef.current.textContent = format(shown.current);
  });

  useLayoutEffect(() => {
    if (numberRef.current) numberRef.current.textContent = format(shown.current);
  });

  if (prefersReducedMotion()) {
    return (
      <section className="container stats" aria-label="Quick stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-value">
              {format(s.value)}
              <span className="accent">{s.suffix}</span>
            </span>
            <span className="stat-label mono">{s.label.toUpperCase()}</span>
          </div>
        ))}
      </section>
    );
  }

  const stat = stats[active];
  // Repeat the images so the cascade never runs dry.
  const strip = [...images, ...images, ...images].slice(0, 9);

  return (
    <section
      ref={ref}
      className="scene scene-stats"
      style={{ height: `${stats.length * 80 + 60}vh` }}
      aria-label="Quick stats"
    >
      <div className="pin stats-pin">
        <div className="cascade" aria-hidden="true">
          {strip.map((src, i) => (
            <span className="cascade-card" key={i} style={{ "--i": i } as React.CSSProperties}>
              <img src={src} alt="" loading="lazy" />
            </span>
          ))}
        </div>
        <div className="stats-copy">
          <span className="eyebrow mono">// TELEMETRY</span>
          <div className="stats-number" key={active}>
            <span ref={numberRef} />
            <span className="accent">{stat.suffix}</span>
          </div>
          <span className="stats-label">{stat.label}</span>
          <div className="story-dots" aria-hidden="true">
            {stats.map((s, i) => (
              <span key={s.label} className={i === active ? "on" : i < active ? "done" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCascade;
