import { ADMIN_API } from "../../Constants/ApiConstant";
import type { ContentDoc } from "../../hooks/useContent";

const PASSWORD_KEY = "pk-admin-password";

export class AdminError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export const storedPassword = () => {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) || "";
  } catch {
    return "";
  }
};

export const rememberPassword = (password: string) => {
  try {
    if (password) sessionStorage.setItem(PASSWORD_KEY, password);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    // storage unavailable (private mode) — the user just has to log in again
  }
};

export const callAdmin = async <T = any>(
  password: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
      body: JSON.stringify({ action, ...payload }),
    });
  } catch {
    throw new AdminError("Network error — check your connection.", 0);
  }

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  if (!isJson) {
    throw new AdminError(
      "Admin API not reachable. Locally, run `npx netlify dev` instead of `npm run dev`.",
      res.status
    );
  }
  const body = await res.json();
  if (!res.ok) throw new AdminError(body.error || `Request failed (${res.status})`, res.status);
  return body as T;
};

export type DocSource = "blobs" | "file";
export type HistoryVersion = { key: string; savedAt: string };

export const adminApi = (password: string) => ({
  verify: () => callAdmin(password, "verify"),
  load: (doc: ContentDoc) => callAdmin<{ data: any; source: DocSource }>(password, "load", { doc }),
  save: (doc: ContentDoc, data: unknown) =>
    callAdmin<{ savedAt: string }>(password, "save", { doc, data }),
  history: (doc: ContentDoc) =>
    callAdmin<{ versions: Array<HistoryVersion> }>(password, "history", { doc }),
  restore: (doc: ContentDoc, key: string) =>
    callAdmin<{ data: any }>(password, "restore", { doc, key }),
  upload: (contentType: string, dataBase64: string) =>
    callAdmin<{ url: string }>(password, "upload", { contentType, dataBase64 }),
});

export type AdminApi = ReturnType<typeof adminApi>;

// Downscales an image in the browser so uploads stay small (max 1600px, JPEG/WebP).
export const compressImage = (file: File, maxSize = 1600): Promise<{ contentType: string; dataBase64: string }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const contentType = file.type === "image/png" ? "image/webp" : "image/jpeg";
      const dataUrl = canvas.toDataURL(contentType, 0.85);
      // Browsers without WebP encoding fall back to PNG; report the real type.
      const actualType = dataUrl.slice(5, dataUrl.indexOf(";"));
      resolve({ contentType: actualType, dataBase64: dataUrl.slice(dataUrl.indexOf(",") + 1) });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });

export const downloadJson = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
