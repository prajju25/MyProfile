import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppsObject } from "../../Interface/AppsObject";
import { useContent } from "../../hooks/useContent";
import { sortApps } from "../../utils/profile";
import { ErrorState, Loading } from "../../Components/StatusPanel";
import { AppImage, StatusTag, TechTags } from "../../Components/AppMedia";

const ALL = "All";
const IN_PROGRESS = "In progress";

const CardBody = ({ app, index }: { app: AppsObject; index: number }) => (
  <>
    <span className="c-media">
      <AppImage app={app} />
      <span className="c-status">
        <StatusTag status={app.status} />
      </span>
    </span>
    <span className="c-body">
      <span className="c-meta mono">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{(app.category ?? []).join(" · ").toUpperCase()}</span>
      </span>
      <span className="c-title">{app.name}</span>
      <span className="c-tagline">{app.tagline}</span>
      <TechTags items={app.techStack} />
      {app.url ? (
        <span className="c-cta mono">
          OPEN APP <span aria-hidden="true">↗</span>
        </span>
      ) : (
        <span className="c-cta private mono">● PRIVATE BUILD · DEMO ON REQUEST</span>
      )}
    </span>
  </>
);

const Apps = () => {
  const { data, loading, error } = useContent<Array<AppsObject>>("apps");
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const apps = useMemo(() => sortApps(data ?? []), [data]);

  const filters = useMemo(() => {
    const categories = Array.from(new Set(apps.flatMap((a) => a.category ?? [])));
    const hasWip = apps.some((a) => a.status !== "live");
    return [ALL, ...categories, ...(hasWip ? [IN_PROGRESS] : [])];
  }, [apps]);

  const visible = useMemo(
    () =>
      apps.filter((a) => {
        if (filter === ALL) return true;
        if (filter === IN_PROGRESS) return a.status !== "live";
        return a.category?.includes(filter);
      }),
    [apps, filter]
  );

  const cards = () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>(".c-card") ?? []);

  // Scale and fade each card by its distance from the centre; track which one is centred.
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards().forEach((card, i) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      card.style.setProperty("--d", Math.min(1, dist / card.offsetWidth).toFixed(3));
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goTo = useCallback((index: number, smooth = true) => {
    const card = cards()[index];
    const track = trackRef.current;
    if (!card || !track) return;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), measure()));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [measure, loading]);

  // Start on the app named in the URL (links from Home), else the first one.
  const requested = searchParams.get("app");
  useEffect(() => {
    if (loading) return;
    const index = Math.max(0, visible.findIndex((a) => a.id === requested));
    requestAnimationFrame(() => {
      goTo(index, false);
      measure();
    });
  }, [loading, visible, requested, goTo, measure]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.min(visible.length - 1, active + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.max(0, active - 1));
    }
  };

  if (loading) return <Loading label="Loading apps" />;
  if (error)
    return <ErrorState message="Failed to fetch Applications data. Please try again after some time." />;

  const current = visible[active];

  return (
    <div className="lab">
      <header className="container lab-bar">
        <div className="lab-intro">
          <span className="eyebrow mono violet-text">
            // APP LAB · {apps.length} {apps.length === 1 ? "BUILD" : "BUILDS"}
          </span>
          <h1 className="lab-title">
            Things I've <span className="violet-text">shipped.</span>
          </h1>
        </div>
        <div className="filters" role="group" aria-label="Filter by category">
          {filters.map((f) => (
            <button
              type="button"
              key={f}
              className={`chip-btn mono${filter === f ? " on" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section
        className="carousel"
        aria-roledescription="carousel"
        aria-label="Apps"
        onKeyDown={onKeyDown}
      >
        <div className="c-track" ref={trackRef}>
          {visible.map((app, i) =>
            app.url ? (
              <a
                key={app.id}
                className={`c-card${i === active ? " is-active" : ""}`}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${app.name} (opens in a new tab)`}
              >
                <CardBody app={app} index={i} />
              </a>
            ) : (
              <div key={app.id} className={`c-card private${i === active ? " is-active" : ""}`}>
                <CardBody app={app} index={i} />
              </div>
            )
          )}
        </div>

        {visible.length > 1 && (
          <>
            <button
              type="button"
              className="c-arrow prev"
              aria-label="Previous app"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
            >
              ←
            </button>
            <button
              type="button"
              className="c-arrow next"
              aria-label="Next app"
              disabled={active === visible.length - 1}
              onClick={() => goTo(active + 1)}
            >
              →
            </button>
          </>
        )}
      </section>

      <div className="container c-footer">
        <div className="c-dots" role="group" aria-label="Choose app">
          {visible.map((app, i) => (
            <button
              type="button"
              key={app.id}
              className={i === active ? "on" : ""}
              aria-label={app.name}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        {current?.repoUrl && (
          <a className="mono small text-link" href={current.repoUrl} target="_blank" rel="noreferrer">
            {current.name.toUpperCase()} SOURCE ↗
          </a>
        )}
        <span className="mono small muted c-hint">SWIPE OR USE ← → · CLICK A CARD TO OPEN</span>
      </div>
    </div>
  );
};

export default Apps;
