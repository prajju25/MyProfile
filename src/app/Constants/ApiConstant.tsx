import type { IconName } from "../Components/Icons";

export const PROFILE_API: string = "/api/v1/getProfile";
export const PROFILE_JSON: string = "./myProfile.json";
export const APPS_DATA_JSON: string = "./myApps.json";

export const CONTENT_API = "/api/content";
export const ADMIN_API = "/api/admin";
export const STATIC_JSON = { profile: PROFILE_JSON, apps: APPS_DATA_JSON };

export const CONTACT_EMAIL = "prajju.personal@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/prajju25/";

export const SOCIAL_LINKS: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "GitHub", href: "https://github.com/prajju25", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/prajwal-kotian-4ba48980/",
    icon: "linkedin",
  },
  { label: "X / Twitter", href: "https://twitter.com/prajju2511", icon: "twitter" },
  { label: "Instagram", href: INSTAGRAM_URL, icon: "instagram" },
];
