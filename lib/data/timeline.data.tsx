import { TimelineItem } from "../types/portfolio.types";
import { Translations } from "../translations";
import { WorkExperienceCard } from "@/components/timeline/work-experience-card";
import { EducationCard } from "@/components/timeline/education-card";
import { ThesisCard } from "@/components/timeline/thesis-card";
import { ProjectCard } from "@/components/timeline/project-card";

export const getTimelineData = (t: Translations): TimelineItem[] => [
  {
    title: "2025",
    content: (
      <div className="space-y-6">
        <WorkExperienceCard
          label={t.workExperience}
          title={t.sneakerzone.title}
          position={t.sneakerzone.position}
          points={t.sneakerzone.points}
        />
        <EducationCard
          label={t.education}
          title={t.educationData.title}
          institution={t.educationData.institution}
          competencies={t.educationData.competencies}
        />
      </div>
    ),
  },
  {
    title: "2024-2025",
    content: (
      <div className="space-y-6">
        <WorkExperienceCard
          label={t.workExperience}
          title={t.universalRobots.title}
          position={t.universalRobots.position}
          points={t.universalRobots.points}
        />
        <ThesisCard
          thesisLabel={t.bachelorsThesis}
          deployedLabel={t.productionDeployed}
          title={t.migrationTool.title}
          description={t.migrationTool.description}
          metrics={[
            { value: "2 weeks → 3 days", label: t.migrationTool.metrics.onboarding },
            { value: "98%", label: t.migrationTool.metrics.accuracy },
            { value: "40+", label: t.migrationTool.metrics.configs },
            { value: "-45%", label: t.migrationTool.metrics.tickets },
          ]}
          points={t.migrationTool.points}
        />
      </div>
    ),
  },
  {
    title: "Projects",
    content: (
      <div className="space-y-6">
        <ProjectCard
          label={t.personalProject}
          secondaryLabel={t.serverless}
          title={t.resumeAI.title}
          description={t.resumeAI.description}
          technologies={["React", "TypeScript", "Tailwind CSS", "Zustand", "GPT", "Claude", "Grok"]}
          points={t.resumeAI.points}
        />
        <ProjectCard
          label={t.mobileApp}
          secondaryLabel={t.crossPlatform}
          title={t.trackit.title}
          description={t.trackit.description}
          technologies={["Flutter", "Dart", "Firebase", "OCR", "Real-time Sync"]}
          metricValue="95%"
          metricLabel={t.trackit.accuracy}
        />
      </div>
    ),
  },
];
