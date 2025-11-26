import { LucideIcon } from "lucide-react";

export interface SkillCategory {
  title: string;
  icon: LucideIcon;
  skills: string[];
}

export interface WorkExperience {
  title: string;
  position: string;
  points: string[];
}

export interface Education {
  title: string;
  institution: string;
  competencies: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  points?: string[];
  metrics?: ProjectMetric[];
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface LanguageInfo {
  lang: string;
  level: string;
  flag: string;
}

export interface TimelineItem {
  title: string;
  content: React.ReactNode;
}
