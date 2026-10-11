import React from "react";
import { useScrollScene } from "../../hooks/useScrollScene";

// Headline whose words start scattered across the screen and pull together as you scroll.
const WordSpread = ({ lines, accentFrom }: { lines: Array<string>; accentFrom?: number }) => {
  const ref = useScrollScene<HTMLElement>();
  let wordIndex = 0;

  return (
    <section ref={ref} className="scene scene-words" aria-label={lines.join(" ")}>
      <div className="pin words-pin">
        <h2 className="words" aria-hidden="true">
          {lines.map((line, li) => (
            <span className="words-line" key={li}>
              {line.split(" ").map((w) => {
                const i = wordIndex++;
                return (
                  <span
                    key={i}
                    className={`word${accentFrom !== undefined && i >= accentFrom ? " accent" : ""}`}
                    style={{ "--w": i % 2 === 0 ? -1 : 1, "--k": (i % 3) + 1 } as React.CSSProperties}
                  >
                    {w}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};

export default WordSpread;
