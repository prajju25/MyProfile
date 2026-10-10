import React, { useEffect, useRef, useState } from "react";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

// Fades children up into view the first time they scroll into the viewport.
const Reveal = ({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  ...rest
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return React.createElement(
    Tag,
    {
      ...rest,
      ref,
      className: `reveal${visible ? " in" : ""} ${className}`.trim(),
      style: { ...rest.style, transitionDelay: `${delay}ms` },
    },
    children
  );
};

export default Reveal;
