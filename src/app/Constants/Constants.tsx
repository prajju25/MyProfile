export const menus = [
  { menuItem: "Home", code: "01", to: "/", icon: "home" },
  { menuItem: "Career", code: "02", to: "/profile", icon: "user" },
  { menuItem: "App Lab", code: "03", to: "/apps", icon: "grid" },
  { menuItem: "Photography", code: "04", to: "/photography", icon: "camera" },
] as const;

export const APP_STATUS = {
  live: { label: "Live", className: "status-live" },
  beta: { label: "Beta", className: "status-beta" },
  wip: { label: "In progress", className: "status-wip" },
};
