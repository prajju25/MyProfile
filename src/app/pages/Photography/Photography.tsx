import React from "react";
import { INSTAGRAM_URL } from "../../Constants/ApiConstant";

const TILE_SPANS = [3, 2, 3, 2, 3, 3, 2, 2];

const Photography = () => (
  <div className="container page photo-page">
    <div className="photo-skeleton" aria-hidden="true">
      {TILE_SPANS.map((span, i) => (
        <span
          key={i}
          className="tile"
          style={{ gridRow: `span ${span}`, animationDelay: `${-i * 0.4}s` }}
        />
      ))}
    </div>
    <section className="photo-card">
      <div className="lens" aria-hidden="true">
        <span className="iris" />
        <span className="iris2" />
        <span className="core" />
      </div>
      <span className="mono beta-text small">● SENSOR CALIBRATING</span>
      <h1 className="photo-title">
        The gallery is
        <br />
        still developing.
      </h1>
      <p className="muted">
        Frames from bike rides and travels are being curated. Until then, follow along on
        Instagram.
      </p>
      <a className="btn ghost" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
        FOLLOW @PRAJJU25 ↗
      </a>
    </section>
  </div>
);

export default Photography;
