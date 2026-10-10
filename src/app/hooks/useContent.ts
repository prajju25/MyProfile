import { useEffect, useState } from "react";
import { fetchJson } from "../Components/ApiCalls";
import { CONTENT_API, STATIC_JSON } from "../Constants/ApiConstant";

export type ContentDoc = keyof typeof STATIC_JSON;

const cache = new Map<ContentDoc, Promise<any>>();

// Reads from the content API (Netlify Blobs). When the API is not available,
// e.g. under plain `npm run dev`, falls back to the JSON files shipped with the site.
const fetchContent = async (doc: ContentDoc) => {
  try {
    const res = await fetch(`${CONTENT_API}?doc=${doc}`);
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.includes("application/json")) return await res.json();
  } catch {
    // fall through to the static file
  }
  return fetchJson(STATIC_JSON[doc]);
};

export const loadContent = (doc: ContentDoc) => {
  if (!cache.has(doc)) {
    const request = fetchContent(doc).catch((err) => {
      cache.delete(doc);
      throw err;
    });
    cache.set(doc, request);
  }
  return cache.get(doc)!;
};

// Lets the admin screen push freshly saved data to the public pages.
export const primeContent = (doc: ContentDoc, data: unknown) => {
  cache.set(doc, Promise.resolve(data));
};

export const useContent = <T,>(doc: ContentDoc) => {
  const [state, setState] = useState<{ data?: T; loading: boolean; error: boolean }>({
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    loadContent(doc)
      .then((data: T) => active && setState({ data, loading: false, error: false }))
      .catch(() => active && setState({ loading: false, error: true }));
    return () => {
      active = false;
    };
  }, [doc]);

  return state;
};
