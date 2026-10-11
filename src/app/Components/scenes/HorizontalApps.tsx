import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AppsObject } from "../../Interface/AppsObject";
import { useScrollScene } from "../../hooks/useScrollScene";
import { AppImage, StatusTag, TechTags } from "../AppMedia";

// Pinned horizontal showcase: scrolling down slides the app cards sideways.
const HorizontalApps = ({ apps }: { apps: Array<AppsObject> }) => {
  const ref = useScrollScene<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);

  // The track's overflow decides how far it has to travel.
  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      const scene = ref.current;
      if (!track || !scene) return;
      const shift = Math.max(0, track.scrollWidth - window.innerWidth);
      scene.style.setProperty("--shift", `${shift}px`);
    };
    update();
    window.addEventListener("resize", update);
    const t = setTimeout(update, 600); // after images settle
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(t);
    };
  }, [apps.length, ref]);

  return (
    <section
      ref={ref}
      className="scene scene-h"
      style={{ height: `${Math.max(2, apps.length) * 75 + 100}vh` }}
      aria-labelledby="builds-title"
    >
      <div className="pin h-pin">
        <div className="h-head container">
          <span className="eyebrow mono violet-text">// APP LAB · {apps.length} BUILDS</span>
          <h2 id="builds-title" className="h2">
            Things I've shipped
          </h2>
        </div>
        <div className="h-viewport">
          <div className="h-track" ref={trackRef}>
            {apps.map((app, i) => (
              <Link key={app.id} className="h-card" to={`/apps?app=${app.id}`}>
                <span className="h-media">
                  <AppImage app={app} />
                </span>
                <span className="h-body">
                  <span className="h-index mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="app-card-head">
                    <span className="h-title">{app.name}</span>
                    <StatusTag status={app.status} />
                  </span>
                  <span className="muted">{app.tagline}</span>
                  <TechTags items={app.techStack} />
                </span>
              </Link>
            ))}
            <Link className="h-card h-more" to="/apps">
              <span className="h-more-title">Open the App Lab</span>
              <span className="mono accent">VIEW ALL →</span>
            </Link>
          </div>
        </div>
        <div className="h-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
};

export default HorizontalApps;
