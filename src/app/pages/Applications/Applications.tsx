import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppsObject } from "../../Interface/AppsObject";
import { useContent } from "../../hooks/useContent";
import { sortApps } from "../../utils/profile";
import Icon from "../../Components/Icons";
import { ErrorState, Loading } from "../../Components/StatusPanel";
import { AppImage, StatusTag, TechTags } from "../../Components/AppMedia";

const ALL = "All";
const IN_PROGRESS = "In progress";

const Apps = () => {
  const { data, loading, error } = useContent<Array<AppsObject>>("apps");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(ALL);

  const apps = useMemo(() => sortApps(data ?? []), [data]);

  const filters = useMemo(() => {
    const categories = Array.from(new Set(apps.flatMap((a) => a.category ?? [])));
    const hasWip = apps.some((a) => a.status !== "live");
    return [ALL, ...categories, ...(hasWip ? [IN_PROGRESS] : [])];
  }, [apps]);

  const visible = apps.filter((a) => {
    if (filter === ALL) return true;
    if (filter === IN_PROGRESS) return a.status !== "live";
    return a.category?.includes(filter);
  });

  const selectedId = searchParams.get("app");
  const selected = apps.find((a) => a.id === selectedId) ?? visible[0] ?? apps[0];

  const select = (id: string) => setSearchParams({ app: id }, { replace: true });

  if (loading) return <Loading label="Loading apps" />;
  if (error)
    return <ErrorState message="Failed to fetch Applications data. Please try again after some time." />;

  return (
    <div className="container page">
      <section className="lab-head">
        <div className="lab-intro">
          <span className="eyebrow mono violet-text">
            // APP LAB · {apps.length} {apps.length === 1 ? "BUILD" : "BUILDS"}
          </span>
          <h1 className="page-title">
            Things I've
            <br />
            <span className="violet-text">shipped.</span>
          </h1>
          <p className="lead muted">
            Side projects, experiments and tools — each one a chance to try a new stack. Pick one
            to load it into the viewer.
          </p>
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
      </section>

      {selected && (
        <section className="viewer" aria-live="polite" aria-label="Selected app" key={selected.id}>
          <div className="viewer-media">
            <AppImage app={selected} label="APP SCREENSHOT" />
            <span className="sweep" aria-hidden="true" />
            <span className="viewer-status">
              <StatusTag status={selected.status} />
            </span>
          </div>
          <div className="viewer-body">
            <div className="viewer-meta mono">
              <span>{(selected.category ?? []).join(" · ").toUpperCase()}</span>
              <span>{selected.year}</span>
            </div>
            <h2 className="viewer-title">{selected.name}</h2>
            <p className="viewer-tagline">{selected.tagline}</p>
            <p className="muted">{selected.description}</p>
            {selected.highlights?.length > 0 && (
              <ul className="viewer-list">
                {selected.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <TechTags items={selected.techStack} />
            <div className="actions push-bottom">
              {selected.url ? (
                <a className="btn primary" href={selected.url} target="_blank" rel="noreferrer">
                  LAUNCH APP ↗
                </a>
              ) : (
                <span className="private-note mono">● PRIVATE BUILD · DEMO ON REQUEST</span>
              )}
              {selected.repoUrl && (
                <a className="btn ghost" href={selected.repoUrl} target="_blank" rel="noreferrer">
                  VIEW SOURCE
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="lab-grid" aria-label="All apps">
        {visible.map((app) => (
          <button
            type="button"
            key={app.id}
            className={`app-card${selected?.id === app.id ? " sel" : ""}`}
            aria-pressed={selected?.id === app.id}
            onClick={() => select(app.id)}
          >
            <span className="app-card-media">
              <AppImage app={app} />
            </span>
            <span className="app-card-body">
              <span className="app-card-head">
                <span className="app-card-title">{app.name}</span>
                <StatusTag status={app.status} />
              </span>
              <span className="muted small-text">{app.tagline}</span>
              <TechTags items={app.techStack} />
            </span>
          </button>
        ))}
        <div className="next-build">
          <Icon name="plus" size={40} strokeWidth={1.5} className="violet-text" />
          <span className="mono violet-text">NEXT BUILD IN PROGRESS</span>
          <span className="small-text">Something new is on the workbench.</span>
        </div>
      </section>
    </div>
  );
};

export default Apps;
