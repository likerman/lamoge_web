import type { Locale } from "../lib/i18n";

export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export interface ActivityItem {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface ResearchLine {
  title: LocalizedText;
  summary: LocalizedText;
  detail: LocalizedText;
  keywords: LocalizedList;
  image?: string;
}

export interface TeamLink {
  platform?: string;
  label: string;
  url: string;
}

export interface TeamMember {
  category: string;
  name: string;
  role: LocalizedText;
  affiliation: string;
  area: LocalizedText;
  bio?: LocalizedText;
  email?: string;
  photo?: string;
  links: TeamLink[];
}

export interface Publication {
  featured: boolean;
  year: number;
  type: string;
  topic: string;
  tags?: string[];
  title: string;
  authors: string;
  journal: string;
  doi?: string;
  url?: string;
}

export interface ServiceItem {
  title: LocalizedText;
  summary: LocalizedText;
  audience: LocalizedText;
  applications: LocalizedList;
  status: LocalizedText;
}

export interface FacilityItem {
  name: LocalizedText;
  category: LocalizedText;
  use: LocalizedText;
  description: LocalizedText;
  image?: string;
}

export interface GalleryItem {
  type: "image" | "video";
  title: LocalizedText;
  caption: LocalizedText;
  asset: string;
  embedUrl?: string;
}

export interface CollaborationItem {
  name: string;
  kind: LocalizedText;
  scope: LocalizedText;
  summary: LocalizedText;
  url: string;
  logo?: string;
}

export interface TeachingItem {
  title: LocalizedText;
  format: LocalizedText;
  audience: LocalizedText;
  description: LocalizedText;
}

export interface FaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface NewsItem {
  date: string;
  category: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  image?: string;
  url?: string;
}

export interface ProjectItem {
  id: string;
  featured: boolean;
  status: LocalizedText;
  period: string;
  title: LocalizedText;
  summary: LocalizedText;
  partners: string[];
  tags: LocalizedList;
  image?: string;
  url?: string;
}

export interface EventItem {
  id: string;
  date: string;
  place: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  registrationUrl?: string;
}

export interface OpportunityItem {
  id: string;
  type: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  deadline?: string;
  status: LocalizedText;
  url?: string;
}

export interface DownloadItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  kind: LocalizedText;
  file: string;
}
