export type SectionKey =
  | 'site'
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'achievements'
  | 'gallery'
  | 'contact'
  | 'resume'
  | 'projects';

export interface SitePayload {
  name: string;
  headline: string;
  location: string;
  availability: string;
  bioShort?: string;
}

export interface AboutPayload {
  heading: string;
  body: string;
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface SkillsPayload {
  groups: SkillGroup[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export interface ExperiencePayload {
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  description: string;
}

export interface EducationPayload {
  items: EducationItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  imageUrl: string;
  featured?: boolean;
}

export interface ProjectsPayload {
  items: ProjectItem[];
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
}

export interface AchievementsPayload {
  items: AchievementItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
}

export interface GalleryPayload {
  items: GalleryItem[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ContactPayload {
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
}

export interface ResumePayload {
  url: string;
  lastUpdated?: string;
  notes?: string;
}

export type SectionPayloadMap = {
  site: SitePayload;
  about: AboutPayload;
  skills: SkillsPayload;
  experience: ExperiencePayload;
  education: EducationPayload;
  achievements: AchievementsPayload;
  gallery: GalleryPayload;
  contact: ContactPayload;
  resume: ResumePayload;
  projects: ProjectsPayload;
};

export type PublishedMap = Record<SectionKey, boolean>;
export type PortfolioContentMap = Record<SectionKey, any>;
