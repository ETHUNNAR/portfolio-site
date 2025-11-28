import {
  Code2,
  Layers,
  Database,
  Smartphone,
  GitBranch,
  Cloud,
  SearchCode,
} from "lucide-react";
import { SkillCategory } from "../types/portfolio.types";
import { Translations } from "../translations";

export const getSkillCategories = (t: Translations): SkillCategory[] => [
  {
    title: t.skillCategories.languages,
    icon: Code2,
    skills: ["TypeScript", "JavaScript", "Python", "Java", "Dart", "SQL/NoSQL"],
  },
  {
    title: t.skillCategories.frontend,
    icon: Layers,
    skills: ["React", "Angular", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: t.skillCategories.backendData,
    icon: Database,
    skills: ["Node.js", "RESTful APIs", "Firebase", "PostgreSQL"],
  },
  {
    title: t.skillCategories.mobile,
    icon: Smartphone,
    skills: ["Flutter", "React Native"],
  },
  {
    title: t.skillCategories.devopsTools,
    icon: GitBranch,
    skills: ["Docker", "Git", "CI/CD" ,"GitHub Actions"],
  },
  {
    title: t.skillCategories.cloudServices,
    icon: Cloud,
    skills: ["Firebase", "Pewer.js (serverless platform)", "Vercel"],
  },
  {
    title: t.skillCategories.testing,
    icon: SearchCode,
    skills: ["Jest", "Cypress"],
  }
];
