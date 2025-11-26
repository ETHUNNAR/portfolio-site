import {
  Code2,
  Layers,
  Database,
  Smartphone,
  GitBranch,
  Cloud,
} from "lucide-react";
import { SkillCategory } from "../types/portfolio.types";
import { Translations } from "../translations";

export const getSkillCategories = (t: Translations): SkillCategory[] => [
  {
    title: t.skillCategories.languages,
    icon: Code2,
    skills: ["TypeScript", "JavaScript", "Python", "Java", "Dart", "SQL"],
  },
  {
    title: t.skillCategories.frontend,
    icon: Layers,
    skills: ["React", "Angular", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: t.skillCategories.backendData,
    icon: Database,
    skills: ["Node.js", "RESTful APIs", "Firebase", "NoSQL", "PostgreSQL"],
  },
  {
    title: t.skillCategories.mobile,
    icon: Smartphone,
    skills: ["Flutter", "React Native", "Cross-platform"],
  },
  {
    title: t.skillCategories.devopsTools,
    icon: GitBranch,
    skills: ["Docker", "Git", "CI/CD", "Agile", "Automated Testing"],
  },
  {
    title: t.skillCategories.cloudServices,
    icon: Cloud,
    skills: ["Firebase", "Serverless", "Cloud Integration"],
  },
];
