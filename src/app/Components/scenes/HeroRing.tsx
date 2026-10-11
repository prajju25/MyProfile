import React from "react";
import { Link } from "react-router-dom";
import { useScrollScene } from "../../hooks/useScrollScene";

export type RingTile =
  | { kind: "image"; src: string; label: string }
  | { kind: "text"; title: string; label: string; tone: "cyan" | "violet" | "green" | "amber" };

const ARC = 150; // degrees the cards are spread across

// Pinned hero: a concave ring of cards that turns and pushes towards you as you scroll,
// while the headline hands over from "Who am I?" to the answer.
const HeroRing = ({ tiles }: { tiles: Array<RingTile> }) => {
  // Only the visible copy layer should take clicks.
  const ref = useScrollScene<HTMLElement>((p) => {
    const stage = p > 0.45 ? "two" : "one";
    if (ref.current && ref.current.dataset.stage !== stage) ref.current.dataset.stage = stage;
  });
  const step = tiles.length > 1 ? ARC / (tiles.length - 1) : 0;

  return (
    <section ref={ref} className="scene scene-hero" data-stage="one" aria-label="Introduction">
      <div className="pin">
        <div className="ring-stage" aria-hidden="true">
          <div className="ring3d">
            <div className="ring-sway">
              {tiles.map((t, i) => (
                <div
                  key={i}
                  className={`ring-card${t.kind === "text" ? ` text ${t.tone}` : ""}`}
                  style={{ "--a": `${-ARC / 2 + i * step}deg` } as React.CSSProperties}
                >
                  {t.kind === "image" ? (
                    <img src={t.src} alt="" loading="eager" />
                  ) : (
                    <span className="ring-title">{t.title}</span>
                  )}
                  <span className="ring-label mono">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-shade" aria-hidden="true" />

        <div className="hero-copy-layer one">
          <span className="eyebrow mono">
            <span className="live-dot" />
            // SYS.ID — A BIT ABOUT ME
          </span>
          <h1 className="hero-big">
            Who am <span className="glow">I?</span>
            <span className="caret" aria-hidden="true" />
          </h1>
          <span className="scroll-cue mono" aria-hidden="true">
            SCROLL TO DECODE <span className="cue-line" />
          </span>
        </div>

        <div className="hero-copy-layer two">
          <p className="hero-answer">
            I'm <strong>Prajwal Kotian</strong> — Senior Frontend / Fullstack Lead by profession,
            digital explorer by choice. I turn complex tech into user-friendly magic.
          </p>
          <div className="actions center">
            <Link className="btn primary" to="/profile">
              EXPLORE MY CAREER <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn ghost" to="/apps">
              LAUNCH APP LAB
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroRing;
