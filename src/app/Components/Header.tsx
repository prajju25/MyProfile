import React from "react";
import { Link, NavLink } from "react-router-dom";
import { menus } from "../Constants/Constants";
import { SOCIAL_LINKS } from "../Constants/ApiConstant";
import Icon from "./Icons";

const Header = () => {
  return (
    <header className="site-header">
      <nav aria-label="Primary" className="container nav">
        <Link to="/" className="brand" aria-label="Prajwal Kotian — home">
          PK<span className="accent">//</span>
          <span className="brand-version">v3.0</span>
        </Link>
        <div className="nav-links">
          {menus.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}
            >
              {m.code} {m.menuItem.toUpperCase()}
            </NavLink>
          ))}
        </div>
        <div className="nav-social">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              className="icon-btn"
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
            >
              <Icon name={s.icon} />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
