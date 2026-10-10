import React from "react";

export const Loading = ({ label = "Loading" }: { label?: string }) => (
  <div className="status-panel" role="status">
    <span className="loader" aria-hidden="true" />
    <span className="mono">{label.toUpperCase()}…</span>
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="status-panel error" role="alert">
    <span className="mono">SIGNAL LOST</span>
    <span>{message}</span>
  </div>
);
