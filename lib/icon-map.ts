import {
  Code2,
  Layers,
  Database,
  Smartphone,
  GitBranch,
  Cloud,
  SearchCode,
  LucideIcon,
  Briefcase,
  GraduationCap,
  Rocket,
  Globe,
  Settings,
  Zap,
  Shield,
  Palette,
  Terminal,
  Server,
  Layout,
  FileCode,
  Package,
  Cpu,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Code2,
  Layers,
  Database,
  Smartphone,
  GitBranch,
  Cloud,
  SearchCode,
  Briefcase,
  GraduationCap,
  Rocket,
  Globe,
  Settings,
  Zap,
  Shield,
  Palette,
  Terminal,
  Server,
  Layout,
  FileCode,
  Package,
  Cpu,
};

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Code2;
}

export function getAvailableIcons(): string[] {
  return Object.keys(iconMap);
}
