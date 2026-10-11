import React, { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useScrollScene";

const SEEN_KEY = "pk-booted";
const LINES = ["LOADING PROFILE", "LINKING APP LAB", "CALIBRATING ORBIT", "SYSTEMS ONLINE"];

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

// One-time boot sequence: a counter runs to 100, then the curtains part.
const BootLoader = () => {
  const [phase, setPhase] = useState<"run" | "exit" | "done">(() =>
    alreadySeen() || prefersReducedMotion() ? "done" : "run"
  );
  const [count, setCount] = useState(0);
  const start = useRef(0);

  useEffect(() => {
    if (phase !== "run") return;
    document.documentElement.classList.add("booting");
    const duration = 1500;
    let raf = 0;
    const tick = (t: number) => {
      if (!start.current) start.current = t;
      const k = Math.min(1, (t - start.current) / duration);
      setCount(Math.round(100 * (1 - Math.pow(1 - k, 2))));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setPhase("exit");
    };
    raf = requestAnimationFrame(tick);
    // rAF pauses in background tabs; never let the loader hold the page hostage.
    const failsafe = setTimeout(() => setPhase("exit"), 3000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
    const t = setTimeout(() => {
      document.documentElement.classList.remove("booting");
      setPhase("done");
    }, 900);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`boot${phase === "exit" ? " exit" : ""}`} aria-hidden="true">
      <div className="boot-curtain top" />
      <div className="boot-curtain bottom" />
      <div className="boot-core">
        <span className="boot-brand">
          PK<span className="accent">//</span>
        </span>
        <span className="boot-count">{String(count).padStart(3, "0")}</span>
        <span className="boot-bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </span>
        <span className="boot-line mono">{LINES[Math.min(LINES.length - 1, Math.floor(count / 26))]}</span>
      </div>
    </div>
  );
};

export default BootLoader;
