import { useEffect, useRef } from "react";

// A "scene" is a tall section whose sticky child stays pinned while the page
// scrolls through it. Progress p goes 0 → 1 across that distance and is written
// to the section as the CSS variable --p, so most animation lives in CSS.

type Scene = {
  el: HTMLElement;
  onProgress?: (p: number) => void;
  last: number;
};

const scenes = new Set<Scene>();
let ticking = false;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const measure = () => {
  ticking = false;
  const vh = window.innerHeight;
  scenes.forEach((scene) => {
    const rect = scene.el.getBoundingClientRect();
    if (rect.bottom < -vh || rect.top > vh * 2) return; // far off screen
    const travel = rect.height - vh;
    const p = travel > 0 ? clamp(-rect.top / travel) : clamp(1 - rect.top / vh);
    if (Math.abs(p - scene.last) < 0.0005) return;
    scene.last = p;
    scene.el.style.setProperty("--p", p.toFixed(4));
    scene.onProgress?.(p);
  });
};

const schedule = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(measure);
  }
};

let listening = false;
const listen = () => {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const useScrollScene = <T extends HTMLElement = HTMLElement>(
  onProgress?: (p: number) => void
) => {
  const ref = useRef<T>(null);
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--p", "1");
      callback.current?.(1);
      return;
    }
    const scene: Scene = { el, last: -1, onProgress: (p) => callback.current?.(p) };
    scenes.add(scene);
    listen();
    schedule();
    return () => {
      scenes.delete(scene);
    };
  }, []);

  return ref;
};

// Maps p from [start, end] onto 0..1 — handy for staging several beats in one scene.
export const segment = (p: number, start: number, end: number) => clamp((p - start) / (end - start));

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
