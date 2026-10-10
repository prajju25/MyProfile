import React, { useState } from "react";
import { AppsObject, AppStatus } from "../../Interface/AppsObject";
import { StatusTag } from "../../Components/AppMedia";
import {
  CheckboxField,
  ImageField,
  LinesField,
  NumberField,
  SelectField,
  TagsField,
  TextAreaField,
  TextField,
} from "./fields";
import { AdminApi, slugify } from "./adminApi";

const STATUS_OPTIONS: Array<{ value: AppStatus; label: string }> = [
  { value: "live", label: "Live" },
  { value: "beta", label: "Beta" },
  { value: "wip", label: "In progress" },
];

const uniqueId = (base: string, apps: Array<AppsObject>) => {
  let id = base || "new-app";
  let n = 2;
  while (apps.some((a) => a.id === id)) id = `${base || "new-app"}-${n++}`;
  return id;
};

const AppsEditor = ({
  apps,
  onChange,
  api,
}: {
  apps: Array<AppsObject>;
  onChange: (apps: Array<AppsObject>) => void;
  api: AdminApi;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Ids of apps created in this session keep following their name until edited by hand.
  const [autoIds, setAutoIds] = useState<Set<number>>(new Set());
  const index = Math.min(selectedIndex, apps.length - 1);
  const app = apps[index];

  const update = (patch: Partial<AppsObject>) =>
    onChange(apps.map((a, i) => (i === index ? { ...a, ...patch } : a)));

  const addApp = () => {
    const next: AppsObject = {
      id: uniqueId("new-app", apps),
      name: "",
      tagline: "",
      description: "",
      highlights: [],
      category: [],
      techStack: [],
      status: "beta",
      featured: false,
      year: new Date().getFullYear(),
      order: apps.length + 1,
      url: "",
      repoUrl: "",
      imageUrl: "",
    };
    onChange([...apps, next]);
    setAutoIds(new Set(autoIds).add(apps.length));
    setSelectedIndex(apps.length);
  };

  const removeApp = () => {
    if (!app || !window.confirm(`Delete "${app.name || app.id}"? You can still discard before saving.`)) return;
    onChange(apps.filter((_, i) => i !== index));
    setAutoIds(new Set());
    setSelectedIndex(Math.max(0, index - 1));
  };

  const move = (dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= apps.length) return;
    const next = [...apps];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setAutoIds(new Set());
    setSelectedIndex(target);
  };

  return (
    <div className="apps-editor">
      <aside className="apps-list panel" aria-label="Apps">
        <div className="apps-list-head">
          <span className="mono small muted">{apps.length} APPS · ORDER = DISPLAY ORDER</span>
        </div>
        {apps.map((a, i) => (
          <button
            type="button"
            key={`${a.id}-${i}`}
            className={`apps-list-item${i === index ? " on" : ""}`}
            aria-pressed={i === index}
            onClick={() => setSelectedIndex(i)}
          >
            <span className="mono small muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="apps-list-name">{a.name || "Untitled app"}</span>
            <StatusTag status={a.status} />
            {a.featured && <span className="mono small accent">★</span>}
          </button>
        ))}
        <button type="button" className="mini-btn add" onClick={addApp}>
          + ADD APP
        </button>
      </aside>

      {app ? (
        <div className="panel app-form">
          <div className="app-form-head">
            <span className="section-title">{app.name || "Untitled app"}</span>
            <div className="row-actions">
              <button type="button" className="mini-btn icon" aria-label="Move up" disabled={index === 0} onClick={() => move(-1)}>
                ↑
              </button>
              <button
                type="button"
                className="mini-btn icon"
                aria-label="Move down"
                disabled={index === apps.length - 1}
                onClick={() => move(1)}
              >
                ↓
              </button>
              <button type="button" className="mini-btn danger" onClick={removeApp}>
                DELETE
              </button>
            </div>
          </div>

          <div className="form-grid">
            <TextField
              label="Name"
              required
              value={app.name}
              onChange={(v) =>
                update(
                  autoIds.has(index)
                    ? { name: v, id: uniqueId(slugify(v), apps.filter((_, i) => i !== index)) }
                    : { name: v }
                )
              }
            />
            <TextField
              label="ID (used in links)"
              value={app.id}
              hint="lowercase-with-dashes"
              onChange={(v) => {
                const next = new Set(autoIds);
                next.delete(index);
                setAutoIds(next);
                update({ id: slugify(v) });
              }}
            />
          </div>
          <TextField label="Tagline" value={app.tagline} onChange={(v) => update({ tagline: v })} hint="One line, shown on cards" />
          <TextAreaField label="Description" value={app.description} onChange={(v) => update({ description: v })} />
          <LinesField label="Highlights" value={app.highlights} onChange={(v) => update({ highlights: v })} />
          <div className="form-grid">
            <TagsField label="Categories" value={app.category} onChange={(v) => update({ category: v })} hint="Used for App Lab filters, e.g. AI, Tools" />
            <TagsField label="Tech stack" value={app.techStack} onChange={(v) => update({ techStack: v })} />
          </div>
          <div className="form-grid three">
            <SelectField label="Status" value={app.status} options={STATUS_OPTIONS} onChange={(v) => update({ status: v })} />
            <NumberField label="Year" value={app.year} min={2000} max={2100} onChange={(v) => update({ year: v })} />
            <div className="field">
              <span className="field-label mono">Home page</span>
              <CheckboxField label="Featured" checked={app.featured} onChange={(v) => update({ featured: v })} />
            </div>
          </div>
          <div className="form-grid">
            <TextField label="Live URL" type="url" value={app.url} onChange={(v) => update({ url: v })} />
            <TextField
              label="Source URL"
              type="url"
              value={app.repoUrl}
              onChange={(v) => update({ repoUrl: v })}
              hint="Optional — shows a View Source button"
            />
          </div>
          <ImageField label="Screenshot" value={app.imageUrl} onChange={(v) => update({ imageUrl: v })} upload={api.upload} />
        </div>
      ) : (
        <div className="panel app-form empty">
          <p className="muted">No apps yet.</p>
          <button type="button" className="btn primary" onClick={addApp}>
            + ADD YOUR FIRST APP
          </button>
        </div>
      )}
    </div>
  );
};

export default AppsEditor;
