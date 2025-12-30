"use client";

import { useLanguage } from "@/lib/language-context";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import { getSkillCategories } from "@/lib/data/skills.data";
import { getLanguages } from "@/lib/data/languages.data";
import { getTimelineData } from "@/lib/data/timeline.data";
import { getEditableTimelineData } from "@/lib/data/editable-timeline.data";
import { HeroSection } from "@/components/sections/hero-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { LanguagesSection } from "@/components/sections/languages-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/layout/footer";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const {
    skills,
    workExperiences,
    education,
    projects,
    languages: dbLanguages,
    isLoading,
    isUsingSupabase,
    refetch,
  } = usePortfolioData();

  const staticSkillCategories = getSkillCategories(t);
  const staticLanguages = getLanguages(t);
  const staticTimelineData = getTimelineData(t);

  const skillCategories = isUsingSupabase && skills.length > 0
    ? skills
    : staticSkillCategories.map((cat, index) => ({
        id: `static-${index}`,
        title: cat.title,
        icon: cat.icon,
        iconName: "Code2",
        skills: cat.skills,
      }));

  const languagesData = isUsingSupabase && dbLanguages.length > 0
    ? dbLanguages.map(l => ({
        lang: l.lang,
        level: l.level,
        flag: l.flag,
      }))
    : staticLanguages;

  const hasTimelineData = workExperiences.length > 0 || education.length > 0 || projects.length > 0;
  const timelineData = isUsingSupabase && hasTimelineData
    ? getEditableTimelineData({
        t,
        workExperiences,
        education,
        projects,
        onAdd: refetch,
      })
    : staticTimelineData;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <HeroSection
        location={t.location}
        name={t.name}
        title={t.title}
        bio={t.bio}
        viewMyWorkText={t.viewMyWork}
        getInTouchText={t.getInTouch}
      />

      <SkillsSection
        title={t.technicalSkills}
        subtitle={t.skillsSubtitle}
        categories={skillCategories}
        onRefresh={refetch}
      />

      <ExperienceSection
        title={t.experienceProjects}
        subtitle={t.experienceSubtitle}
        timelineData={timelineData}
      />

      <LanguagesSection
        title={t.languagesTitle}
        languages={languagesData}
      />

      <ContactSection
        title={t.letsConnect}
        subtitle={t.contactSubtitle}
      />

      <Footer footerText={t.footerText} />
    </main>
  );
}
