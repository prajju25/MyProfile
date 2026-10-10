import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MobileTabBar from "./MobileTabBar";

const Layout = (props: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="deck">
      <div className="grid-bg" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true" />
      <Header />
      <main className="site-main">{props.children}</main>
      <footer className="site-footer mono">
        © {new Date().getFullYear()} PRAJWAL KOTIAN · BUILT WITH REACT · END OF
        TRANSMISSION
      </footer>
      <MobileTabBar />
    </div>
  );
};

export default Layout;
