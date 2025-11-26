"use client";

import { useLanguage } from "@/lib/language-context";
import { getSkillCategories } from "@/lib/data/skills.data";
import { getLanguages } from "@/lib/data/languages.data";
import { getTimelineData } from "@/lib/data/timeline.data";
import { HeroSection } from "@/components/sections/hero-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { LanguagesSection } from "@/components/sections/languages-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  const { t } = useLanguage();

  const skillCategories = getSkillCategories(t);
  const languages = getLanguages(t);
  const timelineData = getTimelineData(t);

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
      />

      <ExperienceSection
        title={t.experienceProjects}
        subtitle={t.experienceSubtitle}
        timelineData={timelineData}
      />

      <LanguagesSection
        title={t.languagesTitle}
        languages={languages}
      />

      <ContactSection
        title={t.letsConnect}
        subtitle={t.contactSubtitle}
      />

      <Footer footerText={t.footerText} />
    </main>
  );
}
