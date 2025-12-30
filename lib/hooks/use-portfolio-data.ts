"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/language-context";
import { fetchSkillCategories, SkillCategoryDB } from "@/lib/data/fetch-skills";
import {
  fetchWorkExperiences,
  fetchEducation,
  WorkExperienceDB,
  EducationDB,
} from "@/lib/data/fetch-experiences";
import { fetchProjects, ProjectDB } from "@/lib/data/fetch-projects";
import { fetchLanguages, LanguageDB } from "@/lib/data/fetch-languages";
import { getSkillCategories } from "@/lib/data/skills.data";
import { getLanguages } from "@/lib/data/languages.data";
import { translations } from "@/lib/translations";

interface PortfolioData {
  skills: SkillCategoryDB[];
  workExperiences: WorkExperienceDB[];
  education: EducationDB[];
  projects: ProjectDB[];
  languages: LanguageDB[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isUsingSupabase: boolean;
}

export function usePortfolioData(): PortfolioData {
  const { language } = useLanguage();
  const [skills, setSkills] = useState<SkillCategoryDB[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceDB[]>([]);
  const [education, setEducation] = useState<EducationDB[]>([]);
  const [projects, setProjects] = useState<ProjectDB[]>([]);
  const [languages, setLanguages] = useState<LanguageDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const loadStaticData = useCallback(() => {
    const t = translations[language];

    const staticSkills = getSkillCategories(t).map((cat, index) => ({
      id: `static-skill-${index}`,
      title: cat.title,
      icon: cat.icon,
      iconName: cat.icon.displayName || "Code2",
      skills: cat.skills,
      sortOrder: index,
    }));

    const staticLanguages = getLanguages(t).map((lang, index) => ({
      id: `static-lang-${index}`,
      lang: lang.lang,
      level: lang.level,
      flag: lang.flag,
      sortOrder: index,
    }));

    setSkills(staticSkills);
    setLanguages(staticLanguages);
    setWorkExperiences([]);
    setEducation([]);
    setProjects([]);
    setIsUsingSupabase(false);
  }, [language]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      loadStaticData();
      setIsLoading(false);
      return;
    }

    try {
      const [
        skillsData,
        workData,
        eduData,
        projectsData,
        languagesData,
      ] = await Promise.all([
        fetchSkillCategories(language),
        fetchWorkExperiences(language),
        fetchEducation(language),
        fetchProjects(language),
        fetchLanguages(language),
      ]);

      if (skillsData.length > 0 || languagesData.length > 0) {
        setSkills(skillsData);
        setWorkExperiences(workData);
        setEducation(eduData);
        setProjects(projectsData);
        setLanguages(languagesData);
        setIsUsingSupabase(true);
      } else {
        loadStaticData();
      }
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setError("Failed to load data from database");
      loadStaticData();
    } finally {
      setIsLoading(false);
    }
  }, [language, loadStaticData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    skills,
    workExperiences,
    education,
    projects,
    languages,
    isLoading,
    error,
    refetch: fetchData,
    isUsingSupabase,
  };
}
