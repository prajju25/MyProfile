import {
  DOCS,
  HISTORY_LIMIT,
  contentStore,
  isAuthorized,
  json,
  mediaStore,
  readDoc,
  validateDoc,
} from "../lib/store.mjs";

const MAX_DOC_BYTES = 512 * 1024;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const historyPrefix = (doc) => `history/${doc}/`;

// History keys end in a millisecond timestamp (plain digits, so nothing gets URL-encoded).
const historyKey = (doc) => `${historyPrefix(doc)}${String(Date.now()).padStart(15, "0")}`;

const listHistory = async (doc) => {
  const { blobs } = await contentStore().list({ prefix: historyPrefix(doc) });
  // Zero-padded timestamps sort lexically in chronological order.
  return blobs.map((b) => decodeURIComponent(b.key)).sort().reverse();
};

const pruneHistory = async (doc) => {
  const keys = await listHistory(doc);
  await Promise.all(keys.slice(HISTORY_LIMIT).map((k) => contentStore().delete(k)));
};

const saveDoc = async (doc, data, requestUrl) => {
  const store = contentStore();
  // Snapshot what is live now (Blobs or the bundled file) before overwriting.
  const current = await readDoc(doc, requestUrl);
  await store.setJSON(historyKey(doc), current.data);
  await store.setJSON(DOCS[doc].key, data);
  await pruneHistory(doc);
};

const actions = {
  verify: async () => json({ ok: true }),

  load: async ({ doc }, req) => {
    if (!DOCS[doc]) return json({ error: "Unknown document" }, 400);
    const { data, source } = await readDoc(doc, req.url);
    return json({ data, source });
  },

  save: async ({ doc, data }, req) => {
    if (!DOCS[doc]) return json({ error: "Unknown document" }, 400);
    const problem = validateDoc(doc, data);
    if (problem) return json({ error: problem }, 422);
    if (JSON.stringify(data).length > MAX_DOC_BYTES) return json({ error: "Document is too large" }, 413);
    await saveDoc(doc, data, req.url);
    return json({ ok: true, savedAt: new Date().toISOString() });
  },

  history: async ({ doc }) => {
    if (!DOCS[doc]) return json({ error: "Unknown document" }, 400);
    const keys = await listHistory(doc);
    return json({
      versions: keys.map((key) => ({
        key,
        savedAt: new Date(Number(key.slice(historyPrefix(doc).length))).toISOString(),
      })),
    });
  },

  restore: async ({ doc, key }, req) => {
    if (!DOCS[doc] || typeof key !== "string" || !/^\d+$/.test(key.slice(historyPrefix(doc).length)) || !key.startsWith(historyPrefix(doc)))
      return json({ error: "Unknown version" }, 400);
    const data = await contentStore().get(key, { type: "json" });
    if (!data) return json({ error: "Version not found" }, 404);
    await saveDoc(doc, data, req.url);
    return json({ ok: true, data });
  },

  upload: async ({ contentType, dataBase64 }) => {
    const ext = IMAGE_TYPES[contentType];
    if (!ext || typeof dataBase64 !== "string") return json({ error: "Only JPEG, PNG or WebP images" }, 415);
    const bytes = Buffer.from(dataBase64, "base64");
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) return json({ error: "Image must be under 3 MB" }, 413);
    const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await mediaStore().set(key, bytes, { metadata: { contentType } });
    return json({ ok: true, url: `/api/media/${key}` });
  },
};

// Authenticated admin endpoint: POST /api/admin { action, ...payload }
export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!process.env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD is not configured" }, 503);
  if (!isAuthorized(req)) return json({ error: "Unauthorized" }, 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const handler = actions[body?.action];
  if (!handler) return json({ error: "Unknown action" }, 400);

  try {
    return await handler(body, req);
  } catch (error) {
    console.error(`admin ${body.action} failed`, error);
    return json({ error: "Something went wrong on the server" }, 500);
  }
};

export const config = { path: "/api/admin" };
