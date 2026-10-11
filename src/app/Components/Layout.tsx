import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MobileTabBar from "./MobileTabBar";
import BootLoader from "./BootLoader";

const Layout = (props: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Thin page-progress line under the header.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${p})`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="deck">
      <BootLoader />
      <div className="grid-bg" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true" />
      <div className="page-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>
      <Header />
      <main className="site-main page-enter" key={pathname}>
        {props.children}
      </main>
      <footer className="site-footer mono">
        © {new Date().getFullYear()} PRAJWAL KOTIAN · BUILT WITH REACT · END OF
        TRANSMISSION
      </footer>
      <MobileTabBar />
    </div>
  );
};

export default Layout;
