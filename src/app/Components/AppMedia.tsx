import React from "react";
import { APP_STATUS } from "../Constants/Constants";
import { AppsObject } from "../Interface/AppsObject";

export const AppImage = ({ app, label = "SCREENSHOT" }: { app: AppsObject; label?: string }) =>
  app.imageUrl ? (
    <img src={app.imageUrl} alt="" loading="lazy" className="app-img" />
  ) : (
    <span className="img-placeholder mono">[ {label} ]</span>
  );

export const StatusTag = ({ status }: { status: AppsObject["status"] }) => {
  const s = APP_STATUS[status] ?? APP_STATUS.wip;
  return <span className={`status mono ${s.className}`}>● {s.label.toUpperCase()}</span>;
};

export const TechTags = ({ items }: { items: Array<string> }) => (
  <span className="tags">
    {items.map((t) => (
      <span className="tag mono" key={t}>
        {t}
      </span>
    ))}
  </span>
);
