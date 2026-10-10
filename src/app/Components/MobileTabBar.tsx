import React from "react";
import { NavLink } from "react-router-dom";
import { menus } from "../Constants/Constants";
import Icon from "./Icons";

const shortLabel: Record<string, string> = {
  "/": "HOME",
  "/profile": "CAREER",
  "/apps": "APPS",
  "/photography": "PHOTOS",
};

const MobileTabBar = () => (
  <nav aria-label="Primary mobile" className="tab-bar">
    {menus.map((m) => (
      <NavLink
        key={m.to}
        to={m.to}
        end={m.to === "/"}
        className={({ isActive }) => `tab${isActive ? " on" : ""}`}
      >
        <Icon name={m.icon} />
        {shortLabel[m.to]}
      </NavLink>
    ))}
  </nav>
);

export default MobileTabBar;
