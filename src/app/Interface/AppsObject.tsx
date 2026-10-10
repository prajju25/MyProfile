export type AppStatus = "live" | "beta" | "wip";

export interface AppsObject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: Array<string>;
  category: Array<string>;
  techStack: Array<string>;
  status: AppStatus;
  featured: boolean;
  year: number;
  order: number;
  url: string;
  repoUrl?: string;
  imageUrl?: string;
}
