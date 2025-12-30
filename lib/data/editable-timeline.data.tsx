import { TimelineItem } from "../types/portfolio.types";
import { Translations } from "../translations";
import { EditableWorkExperienceCard } from "@/components/timeline/editable-work-experience-card";
import { EditableEducationCard } from "@/components/timeline/editable-education-card";
import { EditableProjectCard } from "@/components/timeline/editable-project-card";
import { AddWorkExperience } from "@/components/admin/add-work-experience";
import { AddProject } from "@/components/admin/add-project";
import { WorkExperienceDB, EducationDB } from "./fetch-experiences";
import { ProjectDB } from "./fetch-projects";

interface EditableTimelineProps {
  t: Translations;
  workExperiences: WorkExperienceDB[];
  education: EducationDB[];
  projects: ProjectDB[];
  onAdd?: () => void;
}

export const getEditableTimelineData = ({
  t,
  workExperiences,
  education,
  projects,
  onAdd,
}: EditableTimelineProps): TimelineItem[] => {
  const timelineGroups = new Map<string, { work: WorkExperienceDB[]; edu: EducationDB[] }>();

  workExperiences.forEach((exp) => {
    const year = exp.yearLabel;
    if (!timelineGroups.has(year)) {
      timelineGroups.set(year, { work: [], edu: [] });
    }
    timelineGroups.get(year)!.work.push(exp);
  });

  education.forEach((edu) => {
    const year = edu.yearLabel;
    if (!timelineGroups.has(year)) {
      timelineGroups.set(year, { work: [], edu: [] });
    }
    timelineGroups.get(year)!.edu.push(edu);
  });

  const timelineItems: TimelineItem[] = [];

  const sortedYears = Array.from(timelineGroups.keys()).sort((a, b) => {
    const yearA = parseInt(a.split("-")[0]);
    const yearB = parseInt(b.split("-")[0]);
    return yearB - yearA;
  });

  sortedYears.forEach((year) => {
    const group = timelineGroups.get(year)!;
    const content = (
      <div className="space-y-6">
        {group.work.map((exp) => (
          <EditableWorkExperienceCard
            key={exp.id}
            id={exp.id}
            label={t.workExperience}
            title={exp.title}
            position={exp.position}
            points={exp.points}
            onDelete={onAdd}
          />
        ))}
        {group.edu.map((edu) => (
          <EditableEducationCard
            key={edu.id}
            id={edu.id}
            label={t.education}
            title={edu.title}
            institution={edu.institution}
            competencies={edu.competencies}
            onDelete={onAdd}
          />
        ))}
        {onAdd && <AddWorkExperience onAdd={onAdd} yearLabel={year} />}
      </div>
    );

    timelineItems.push({ title: year, content });
  });

  const projectItems = projects.filter((p) => !p.yearLabel);
  const yearProjects = projects.filter((p) => p.yearLabel);

  yearProjects.forEach((project) => {
    const existingItem = timelineItems.find((item) => item.title === project.yearLabel);
    if (existingItem) {
      // TODO: Handle appending projects to existing year groups
    }
  });

  if (projectItems.length > 0 || onAdd) {
    timelineItems.push({
      title: t.projectsTitle || "Projects",
      content: (
        <div className="space-y-6">
          {projectItems.map((project) => (
            <EditableProjectCard
              key={project.id}
              id={project.id}
              label={project.label}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              points={project.points || undefined}
              metricValue={project.metrics?.[0]?.value}
              metricLabel={project.metrics?.[0]?.label}
              imageUrls={project.imageUrls}
              onDelete={onAdd}
            />
          ))}
          {onAdd && <AddProject onAdd={onAdd} />}
        </div>
      ),
    });
  }

  return timelineItems;
};
