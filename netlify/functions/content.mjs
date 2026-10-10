import { DOCS, json, readDoc } from "../lib/store.mjs";

// Public read endpoint: GET /api/content?doc=profile|apps
export default async (req) => {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const doc = new URL(req.url).searchParams.get("doc");
  if (!DOCS[doc]) return json({ error: "Unknown document" }, 400);

  try {
    const { data, source } = await readDoc(doc, req.url);
    return json(data, 200, {
      "Cache-Control": "no-cache",
      "X-Content-Source": source,
    });
  } catch (error) {
    console.error("content read failed", error);
    return json({ error: "Failed to load content" }, 500);
  }
};

export const config = { path: "/api/content" };
