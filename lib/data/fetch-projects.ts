import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export interface ProjectMetricDB {
  value: string;
  label_en: string;
  label_da: string;
  label?: string;
}

export interface ProjectDB {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  points: string[] | null;
  metrics: ProjectMetricDB[] | null;
  label: string;
  yearLabel: string | null;
  sortOrder: number;
  imageUrls: string[];
}

export async function fetchProjects(
  language: "en" | "da"
): Promise<ProjectDB[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return ((data || []) as ProjectRow[]).map((row) => {
    const metrics = row.metrics as ProjectMetricDB[] | null;

    return {
      id: row.id,
      title: language === "en" ? row.title_en : row.title_da,
      description: language === "en" ? row.description_en : row.description_da,
      technologies: row.technologies,
      points: language === "en" ? row.points_en : row.points_da,
      metrics: metrics?.map((m) => ({
        ...m,
        label: language === "en" ? m.label_en : m.label_da,
      })) as ProjectMetricDB[] | null,
      label: language === "en" ? row.label_en : row.label_da,
      yearLabel: row.year_label,
      sortOrder: row.sort_order,
      imageUrls: (row as ProjectRow & { image_urls?: string[] }).image_urls || [],
    };
  });
}

export async function fetchProjectsRaw(): Promise<ProjectRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data || []) as ProjectRow[];
}
