import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileObject } from "../../Interface/ProfileObject";
import { AppsObject } from "../../Interface/AppsObject";
import { ContentDoc, primeContent } from "../../hooks/useContent";
import { Loading } from "../../Components/StatusPanel";
import ProfileEditor from "./ProfileEditor";
import AppsEditor from "./AppsEditor";
import {
  AdminError,
  DocSource,
  HistoryVersion,
  adminApi,
  downloadJson,
  rememberPassword,
  storedPassword,
} from "./adminApi";

type ProfileDoc = { data: Array<ProfileObject> };
type Docs = { profile: ProfileDoc; apps: Array<AppsObject> };
type Toast = { kind: "ok" | "error"; text: string } | null;

const TABS: Array<{ doc: ContentDoc; label: string }> = [
  { doc: "profile", label: "PROFILE" },
  { doc: "apps", label: "APPS" },
];
const FILE_NAMES: Record<ContentDoc, string> = { profile: "myProfile.json", apps: "myApps.json" };

// Apps are shown in list order, so persist that order explicitly.
const normalise = (doc: ContentDoc, data: any) =>
  doc === "apps" ? (data as Array<AppsObject>).map((a, i) => ({ ...a, order: i + 1 })) : data;

const Login = ({ onLogin, error, busy }: { onLogin: (p: string) => void; error: string; busy: boolean }) => {
  const [password, setPassword] = useState("");
  return (
    <div className="container page">
      <form
        className="panel login-card"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(password);
        }}
      >
        <span className="eyebrow mono">// RESTRICTED · ADMIN CONSOLE</span>
        <h1 className="h2">Authenticate</h1>
        <div className="field">
          <label htmlFor="admin-password" className="field-label mono">
            Password
          </label>
          <input
            id="admin-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn primary" disabled={busy || !password}>
          {busy ? "VERIFYING…" : "UNLOCK →"}
        </button>
      </form>
    </div>
  );
};

const Admin = () => {
  const [password, setPassword] = useState(storedPassword);
  const [authed, setAuthed] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tab, setTab] = useState<ContentDoc>("profile");
  const [saved, setSaved] = useState<Partial<Docs>>({});
  const [draft, setDraft] = useState<Partial<Docs>>({});
  const [source, setSource] = useState<Partial<Record<ContentDoc, DocSource>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [history, setHistory] = useState<Array<HistoryVersion> | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const api = useMemo(() => adminApi(password), [password]);

  const handleError = useCallback((e: unknown) => {
    if (e instanceof AdminError && e.status === 401) {
      rememberPassword("");
      setAuthed(false);
      setAuthError("Session expired or wrong password.");
      return;
    }
    setToast({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong" });
  }, []);

  const loadAll = useCallback(
    async (pw: string) => {
      const client = adminApi(pw);
      const [profile, apps] = await Promise.all([client.load("profile"), client.load("apps")]);
      setSaved({ profile: profile.data, apps: apps.data });
      setDraft({ profile: profile.data, apps: apps.data });
      setSource({ profile: profile.source, apps: apps.source });
    },
    []
  );

  const login = useCallback(
    async (pw: string) => {
      setAuthBusy(true);
      setAuthError("");
      try {
        await adminApi(pw).verify();
        await loadAll(pw);
        rememberPassword(pw);
        setPassword(pw);
        setAuthed(true);
      } catch (e) {
        rememberPassword("");
        setAuthError(
          e instanceof AdminError && e.status === 401 ? "Wrong password." : (e as Error).message
        );
      } finally {
        setAuthBusy(false);
      }
    },
    [loadAll]
  );

  // Resume a session from this tab without asking again.
  useEffect(() => {
    if (password && !authed) login(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = (doc: ContentDoc) => JSON.stringify(saved[doc]) !== JSON.stringify(draft[doc]);
  const anyDirty = dirty("profile") || dirty("apps");

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => setHistory(null), [tab]);

  const save = async () => {
    const data = normalise(tab, draft[tab]);
    setSaving(true);
    try {
      await api.save(tab, data);
      setSaved((s) => ({ ...s, [tab]: data }));
      setDraft((d) => ({ ...d, [tab]: data }));
      setSource((s) => ({ ...s, [tab]: "blobs" }));
      primeContent(tab, data);
      setHistory(null);
      setToast({ kind: "ok", text: `${tab === "profile" ? "Profile" : "Apps"} saved — live on the site now.` });
    } catch (e) {
      handleError(e);
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (window.confirm("Discard all unsaved changes on this tab?")) {
      setDraft((d) => ({ ...d, [tab]: saved[tab] }));
    }
  };

  const showHistory = async () => {
    try {
      setHistory((await api.history(tab)).versions);
    } catch (e) {
      handleError(e);
    }
  };

  const restore = async (v: HistoryVersion) => {
    if (!window.confirm(`Restore the version from ${new Date(v.savedAt).toLocaleString()}? The current live version is kept in history.`))
      return;
    try {
      const { data } = await api.restore(tab, v.key);
      setSaved((s) => ({ ...s, [tab]: data }));
      setDraft((d) => ({ ...d, [tab]: data }));
      setSource((s) => ({ ...s, [tab]: "blobs" }));
      primeContent(tab, data);
      setHistory((await api.history(tab)).versions);
      setToast({ kind: "ok", text: "Version restored." });
    } catch (e) {
      handleError(e);
    }
  };

  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const looksRight =
        tab === "apps" ? Array.isArray(parsed) : Array.isArray(parsed?.data) && parsed.data[0]?.name;
      if (!looksRight) throw new Error(`That file doesn't look like ${FILE_NAMES[tab]}.`);
      setDraft((d) => ({ ...d, [tab]: parsed }));
      setToast({ kind: "ok", text: "Imported into the editor — review, then Save to publish." });
    } catch (e) {
      setToast({ kind: "error", text: e instanceof SyntaxError ? "That file isn't valid JSON." : (e as Error).message });
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };

  const logout = () => {
    if (anyDirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    rememberPassword("");
    setPassword("");
    setAuthed(false);
  };

  if (!authed) {
    if (authBusy && password) return <Loading label="Unlocking" />;
    return <Login onLogin={login} error={authError} busy={authBusy} />;
  }

  const profileDoc = draft.profile;
  const appsDoc = draft.apps;

  return (
    <div className="container page admin-page">
      <header className="admin-head">
        <div className="stack-sm">
          <span className="eyebrow mono">// ADMIN CONSOLE</span>
          <h1 className="page-title admin-title">Content editor</h1>
        </div>
        <div className="row-actions">
          <Link className="mini-btn" to={tab === "apps" ? "/apps" : "/profile"} target="_blank">
            VIEW SITE ↗
          </Link>
          <button type="button" className="mini-btn" onClick={logout}>
            LOG OUT
          </button>
        </div>
      </header>

      <div className="admin-toolbar panel">
        <div className="filters" role="tablist" aria-label="Document">
          {TABS.map((t) => (
            <button
              key={t.doc}
              type="button"
              role="tab"
              aria-selected={tab === t.doc}
              className={`chip-btn mono${tab === t.doc ? " on" : ""}`}
              onClick={() => setTab(t.doc)}
            >
              {t.label}
              {dirty(t.doc) && <span className="dirty-dot" aria-label="unsaved changes" />}
            </button>
          ))}
        </div>
        <span className="mono small muted source-note">
          {source[tab] === "file" ? "SHOWING BUNDLED JSON · FIRST SAVE MOVES IT TO NETLIFY BLOBS" : "LIVE DATA · NETLIFY BLOBS"}
        </span>
        <div className="row-actions">
          <button type="button" className="mini-btn" onClick={() => downloadJson(FILE_NAMES[tab], normalise(tab, draft[tab]))}>
            EXPORT
          </button>
          <button type="button" className="mini-btn" onClick={() => importRef.current?.click()}>
            IMPORT
          </button>
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(e) => importFile(e.target.files?.[0])} />
          <button type="button" className="mini-btn" onClick={history ? () => setHistory(null) : showHistory}>
            {history ? "HIDE HISTORY" : "HISTORY"}
          </button>
          <button type="button" className="mini-btn" disabled={!dirty(tab)} onClick={discard}>
            DISCARD
          </button>
          <button type="button" className="btn primary save-btn" disabled={!dirty(tab) || saving} onClick={save}>
            {saving ? "SAVING…" : dirty(tab) ? "SAVE & PUBLISH" : "SAVED"}
          </button>
        </div>
      </div>

      {history && (
        <div className="panel history">
          <span className="mono small muted">LAST {history.length} SAVED VERSIONS (BEFORE EACH SAVE)</span>
          {history.length === 0 && <p className="muted">No history yet — it starts with your first save.</p>}
          {history.map((v) => (
            <div className="history-row" key={v.key}>
              <span>{new Date(v.savedAt).toLocaleString()}</span>
              <button type="button" className="mini-btn" onClick={() => restore(v)}>
                RESTORE
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && profileDoc?.data?.[0] && (
        <ProfileEditor
          profile={profileDoc.data[0]}
          api={api}
          onChange={(p) => setDraft((d) => ({ ...d, profile: { ...profileDoc, data: [p, ...profileDoc.data.slice(1)] } }))}
        />
      )}
      {tab === "apps" && appsDoc && (
        <AppsEditor apps={appsDoc} api={api} onChange={(apps) => setDraft((d) => ({ ...d, apps }))} />
      )}

      {toast && (
        <div className={`toast ${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"}>
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default Admin;
