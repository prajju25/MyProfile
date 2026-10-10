import { json, mediaStore } from "../lib/store.mjs";

// Public read endpoint for uploaded images: GET /api/media/<key>
export default async (req, context) => {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const key = context.params.key;
  if (!key || !/^[a-z0-9._-]+$/i.test(key)) return json({ error: "Not found" }, 404);

  const entry = await mediaStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (!entry) return json({ error: "Not found" }, 404);

  return new Response(entry.data, {
    headers: {
      "Content-Type": entry.metadata?.contentType || "application/octet-stream",
      // Keys are unique per upload, so the file never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/api/media/:key" };
