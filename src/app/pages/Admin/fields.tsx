import React, { useEffect, useId, useRef, useState } from "react";
import { compressImage } from "./adminApi";

type Base = { label: string; hint?: string; className?: string };

const FieldShell = ({
  id,
  label,
  hint,
  className = "",
  children,
}: Base & { id: string; children: React.ReactNode }) => (
  <div className={`field ${className}`}>
    <label htmlFor={id} className="field-label mono">
      {label}
    </label>
    {children}
    {hint && <span className="field-hint">{hint}</span>}
  </div>
);

export const TextField = ({
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  list,
  ...base
}: Base & {
  value: string | undefined;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  list?: string;
}) => {
  const id = useId();
  return (
    <FieldShell id={id} {...base}>
      <input
        id={id}
        className="input"
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        required={required}
        list={list}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
};

export const NumberField = ({
  value,
  onChange,
  min,
  max,
  ...base
}: Base & { value: number | undefined; onChange: (v: number) => void; min?: number; max?: number }) => {
  const id = useId();
  return (
    <FieldShell id={id} {...base}>
      <input
        id={id}
        className="input"
        type="number"
        value={value ?? ""}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </FieldShell>
  );
};

export const TextAreaField = ({
  value,
  onChange,
  rows = 4,
  ...base
}: Base & { value: string | undefined; onChange: (v: string) => void; rows?: number }) => {
  const id = useId();
  return (
    <FieldShell id={id} {...base}>
      <textarea
        id={id}
        className="input"
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
};

// A list of strings edited as one line per item.
export const LinesField = ({
  value,
  onChange,
  rows = 4,
  ...base
}: Base & { value: Array<string> | undefined; onChange: (v: Array<string>) => void; rows?: number }) => {
  const id = useId();
  const [raw, setRaw] = useState((value ?? []).join("\n"));
  const lastSent = useRef(value);

  useEffect(() => {
    if (value !== lastSent.current) setRaw((value ?? []).join("\n"));
  }, [value]);

  return (
    <FieldShell id={id} hint={base.hint ?? "One item per line"} label={base.label} className={base.className}>
      <textarea
        id={id}
        className="input"
        rows={rows}
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          const next = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
          lastSent.current = next;
          onChange(next);
        }}
      />
    </FieldShell>
  );
};

// A list of short strings edited as comma-separated text.
export const TagsField = ({
  value,
  onChange,
  placeholder,
  ...base
}: Base & { value: Array<string> | undefined; onChange: (v: Array<string>) => void; placeholder?: string }) => {
  const id = useId();
  const [raw, setRaw] = useState((value ?? []).join(", "));
  const lastSent = useRef(value);

  useEffect(() => {
    if (value !== lastSent.current) setRaw((value ?? []).join(", "));
  }, [value]);

  return (
    <FieldShell id={id} hint={base.hint ?? "Separate with commas"} label={base.label} className={base.className}>
      <input
        id={id}
        className="input"
        value={raw}
        placeholder={placeholder}
        onChange={(e) => {
          setRaw(e.target.value);
          const next = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
          lastSent.current = next;
          onChange(next);
        }}
      />
    </FieldShell>
  );
};

export const SelectField = <T extends string | number>({
  value,
  onChange,
  options,
  ...base
}: Base & {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) => {
  const id = useId();
  return (
    <FieldShell id={id} {...base}>
      <select
        id={id}
        className="input"
        value={String(value)}
        onChange={(e) => {
          const picked = options.find((o) => String(o.value) === e.target.value);
          if (picked) onChange(picked.value);
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
};

export const CheckboxField = ({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean | undefined;
  onChange: (v: boolean) => void;
  hint?: string;
}) => (
  <label className="check">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
    <span>
      {label}
      {hint && <span className="field-hint"> — {hint}</span>}
    </span>
  </label>
);

export const ImageField = ({
  value,
  onChange,
  upload,
  ...base
}: Base & {
  value: string | undefined;
  onChange: (v: string) => void;
  upload: (contentType: string, dataBase64: string) => Promise<{ url: string }>;
}) => {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { contentType, dataBase64 } = await compressImage(file);
      const { url } = await upload(contentType, dataBase64);
      onChange(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <FieldShell id={id} {...base}>
      <div className="image-field">
        <span className="image-preview">
          {value ? <img src={value} alt="" /> : <span className="mono small">NO IMAGE</span>}
        </span>
        <div className="image-controls">
          <input
            id={id}
            className="input"
            value={value ?? ""}
            placeholder="/my-image.jpg or https://…"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="row-actions">
            <button type="button" className="mini-btn" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "UPLOADING…" : "UPLOAD IMAGE"}
            </button>
            {value && (
              <button type="button" className="mini-btn" onClick={() => onChange("")}>
                CLEAR
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {error && <span className="field-error">{error}</span>}
        </div>
      </div>
    </FieldShell>
  );
};

// Editable list of objects with add / remove / reorder controls.
export const Repeater = <T,>({
  items,
  onChange,
  newItem,
  itemLabel,
  renderItem,
  addLabel = "ADD ITEM",
  compact,
}: {
  items: Array<T> | undefined;
  onChange: (items: Array<T>) => void;
  newItem: () => T;
  itemLabel: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  compact?: boolean;
}) => {
  const list = items ?? [];
  const replace = (index: number, item: T) => onChange(list.map((it, i) => (i === index ? item : it)));
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className={`repeater${compact ? " compact" : ""}`}>
      {list.map((item, i) => (
        <div className="repeat-item" key={i}>
          <div className="repeat-head">
            <span className="mono small repeat-title">{itemLabel(item, i) || `#${i + 1}`}</span>
            <div className="row-actions">
              <button type="button" className="mini-btn icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button
                type="button"
                className="mini-btn icon"
                aria-label="Move down"
                disabled={i === list.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="mini-btn danger"
                onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              >
                REMOVE
              </button>
            </div>
          </div>
          <div className="repeat-body">
            {renderItem(item, (patch) => replace(i, { ...item, ...patch }), i)}
          </div>
        </div>
      ))}
      <button type="button" className="mini-btn add" onClick={() => onChange([...list, newItem()])}>
        + {addLabel}
      </button>
    </div>
  );
};

export const Section = ({
  title,
  count,
  defaultOpen,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => (
  <details className="admin-section panel" open={defaultOpen}>
    <summary>
      <span className="section-title">{title}</span>
      {count !== undefined && <span className="mono small muted">{count}</span>}
    </summary>
    <div className="section-body">{children}</div>
  </details>
);
