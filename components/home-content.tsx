"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/language-context";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import { getSkillCategories } from "@/lib/data/skills.data";
import { getLanguages } from "@/lib/data/languages.data";
import { getTimelineData } from "@/lib/data/timeline.data";
import { getEditableTimelineData } from "@/lib/data/editable-timeline.data";
import { HeroSection } from "@/components/sections/hero-section";

const SkillsSection = dynamic(
  () =>
    import("@/components/sections/skills-section").then(
      (mod) => mod.SkillsSection
    ),
  {
    loading: () => <SectionSkeleton />,
  }
);

const ExperienceSection = dynamic(
  () =>
    import("@/components/sections/experience-section").then(
      (mod) => mod.ExperienceSection
    ),
  {
    loading: () => <SectionSkeleton />,
  }
);

const LanguagesSection = dynamic(
  () =>
    import("@/components/sections/languages-section").then(
      (mod) => mod.LanguagesSection
    ),
  {
    loading: () => <SectionSkeleton height="h-48" />,
  }
);

const ContactSection = dynamic(
  () =>
    import("@/components/sections/contact-section").then(
      (mod) => mod.ContactSection
    ),
  {
    loading: () => <SectionSkeleton height="h-48" />,
  }
);

const Footer = dynamic(
  () => import("@/components/layout/footer").then((mod) => mod.Footer),
  {
    loading: () => <div className="h-16" />,
  }
);

function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`py-20 px-6 ${height} animate-pulse`}>
      <div className="max-w-6xl mx-auto">
        <div className="h-10 w-64 bg-surface-lighter rounded-lg mx-auto mb-4" />
        <div className="h-5 w-96 bg-surface-light rounded-lg mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-surface-light rounded-2xl" />
          <div className="h-32 bg-surface-light rounded-2xl" />
          <div className="h-32 bg-surface-light rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main id="main-content" className="min-h-screen bg-surface">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="h-8 w-48 bg-surface-lighter rounded-full mx-auto mb-8" />
          <div className="h-16 w-80 bg-surface-lighter rounded-lg mx-auto mb-6" />
          <div className="h-6 w-56 bg-surface-light rounded-lg mx-auto mb-8" />
          <div className="h-4 w-[28rem] max-w-full bg-surface-light rounded-lg mx-auto mb-12" />
          <div className="flex gap-4 justify-center">
            <div className="h-12 w-36 bg-surface-lighter rounded-full" />
            <div className="h-12 w-36 bg-surface-light rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function HomeContent() {
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const staticSkillCategories = getSkillCategories(t);
  const staticLanguages = getLanguages(t);
  const staticTimelineData = getTimelineData(t);

  const skillCategories =
    isUsingSupabase && skills.length > 0
      ? skills
      : staticSkillCategories.map((cat, index) => ({
          id: `static-${index}`,
          title: cat.title,
          icon: cat.icon,
          iconName: "Code2",
          skills: cat.skills,
        }));

  const languagesData =
    isUsingSupabase && dbLanguages.length > 0
      ? dbLanguages.map((l) => ({
          lang: l.lang,
          level: l.level,
          flag: l.flag,
        }))
      : staticLanguages;

  const hasTimelineData =
    workExperiences.length > 0 ||
    education.length > 0 ||
    projects.length > 0;
  const timelineData =
    isUsingSupabase && hasTimelineData
      ? getEditableTimelineData({
          t,
          workExperiences,
          education,
          projects,
          onAdd: refetch,
        })
      : staticTimelineData;

  return (
    <main id="main-content" className="min-h-screen bg-surface">
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
