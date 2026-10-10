import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

export const DOCS = {
  profile: { key: "profile", fallback: "/myProfile.json" },
  apps: { key: "apps", fallback: "/myApps.json" },
};

export const HISTORY_LIMIT = 10;

export const contentStore = () => getStore({ name: "portfolio-content", consistency: "strong" });
export const mediaStore = () => getStore({ name: "portfolio-media", consistency: "strong" });

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

// Reads a document from Blobs, falling back to the JSON file bundled with the site.
export const readDoc = async (doc, requestUrl) => {
  const def = DOCS[doc];
  const stored = await contentStore().get(def.key, { type: "json" });
  if (stored) return { data: stored, source: "blobs" };

  const res = await fetch(new URL(def.fallback, requestUrl));
  if (!res.ok) throw new Error(`Fallback ${def.fallback} returned ${res.status}`);
  return { data: await res.json(), source: "file" };
};

const digest = (value) => createHash("sha256").update(String(value)).digest();

export const isAuthorized = (req) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  const header = req.headers.get("authorization") || "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  // Compare fixed-length digests so timing does not leak the password length.
  return provided.length > 0 && timingSafeEqual(digest(provided), digest(expected));
};

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export const validateDoc = (doc, data) => {
  if (doc === "profile") {
    const p = isObject(data) && Array.isArray(data.data) ? data.data[0] : null;
    if (!isObject(p)) return "Profile must look like { data: [ { ... } ] }";
    if (typeof p.name !== "string" || !p.name.trim()) return "Profile name is required";
    for (const key of ["skills", "workHistory", "education", "certifications", "accomplishments", "interests"]) {
      if (p[key] !== undefined && !Array.isArray(p[key])) return `Profile ${key} must be a list`;
    }
    return null;
  }
  if (doc === "apps") {
    if (!Array.isArray(data)) return "Apps must be a list";
    const ids = new Set();
    for (const [i, app] of data.entries()) {
      if (!isObject(app)) return `App #${i + 1} is not an object`;
      if (typeof app.id !== "string" || !/^[a-z0-9-]+$/.test(app.id))
        return `App #${i + 1} needs an id using lowercase letters, numbers and dashes`;
      if (ids.has(app.id)) return `Duplicate app id "${app.id}"`;
      ids.add(app.id);
      if (typeof app.name !== "string" || !app.name.trim()) return `App "${app.id}" needs a name`;
    }
    return null;
  }
  return "Unknown document";
};
