import React, { useState } from "react";
import { prefersReducedMotion, useScrollScene } from "../../hooks/useScrollScene";

export type StoryStep = { kicker: string; title: string; body: string; tone: string };

// Pinned split screen: the portrait holds still on the left while the story
// on the right advances one beat per stretch of scrolling.
const StorySplit = ({ steps, portrait }: { steps: Array<StoryStep>; portrait: string }) => {
  const [active, setActive] = useState(0);
  const ref = useScrollScene<HTMLElement>((p) => {
    const next = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
    setActive((cur) => (cur === next ? cur : next));
  });

  if (prefersReducedMotion()) {
    return (
      <section className="container story-static" aria-label="My story">
        {steps.map((s) => (
          <div key={s.title} className="panel story-static-item">
            <span className="eyebrow mono">{s.kicker}</span>
            <h2 className="h2">{s.title}</h2>
            <p className="muted">{s.body}</p>
          </div>
        ))}
      </section>
    );
  }

  const step = steps[active];

  return (
    <section
      ref={ref}
      className="scene scene-story"
      style={{ height: `${steps.length * 90 + 60}vh` }}
      aria-label="My story"
    >
      <div className="pin story-pin">
        <div className="story-visual">
          <div className="story-orbit">
            <span className="ring r3" />
            <span className="ring r2">
              <span className="node violet" />
            </span>
            <span className="ring r1">
              <span className="node" />
            </span>
            <div className="portrait">
              <img src={portrait} alt="Portrait of Prajwal Kotian" />
            </div>
          </div>
          <span className="story-index mono">
            {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>

        <div className="story-panel" style={{ "--tone": step.tone } as React.CSSProperties}>
          <div className="story-copy" key={active}>
            <span className="eyebrow mono">{step.kicker}</span>
            <h2 className="story-title">{step.title}</h2>
            <p className="story-body">{step.body}</p>
          </div>
          <div className="story-dots" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.title} className={i === active ? "on" : i < active ? "done" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySplit;
