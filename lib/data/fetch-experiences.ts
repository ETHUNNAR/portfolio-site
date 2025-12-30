import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

type WorkExperienceRow = Database["public"]["Tables"]["work_experiences"]["Row"];
type EducationRow = Database["public"]["Tables"]["education"]["Row"];

export interface WorkExperienceDB {
  id: string;
  title: string;
  position: string;
  points: string[];
  yearLabel: string;
  sortOrder: number;
}

export interface EducationDB {
  id: string;
  title: string;
  institution: string;
  competencies: string[];
  yearLabel: string;
  sortOrder: number;
}

export async function fetchWorkExperiences(
  language: "en" | "da"
): Promise<WorkExperienceDB[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("work_experiences")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching work experiences:", error);
    return [];
  }

  return ((data || []) as WorkExperienceRow[]).map((row) => ({
    id: row.id,
    title: language === "en" ? row.title_en : row.title_da,
    position: language === "en" ? row.position_en : row.position_da,
    points: language === "en" ? row.points_en : row.points_da,
    yearLabel: row.year_label,
    sortOrder: row.sort_order,
  }));
}

export async function fetchEducation(
  language: "en" | "da"
): Promise<EducationDB[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching education:", error);
    return [];
  }

  return ((data || []) as EducationRow[]).map((row) => ({
    id: row.id,
    title: language === "en" ? row.title_en : row.title_da,
    institution: language === "en" ? row.institution_en : row.institution_da,
    competencies: language === "en" ? row.competencies_en : row.competencies_da,
    yearLabel: row.year_label,
    sortOrder: row.sort_order,
  }));
}

export async function fetchWorkExperiencesRaw(): Promise<WorkExperienceRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("work_experiences")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching work experiences:", error);
    return [];
  }

  return (data || []) as WorkExperienceRow[];
}

export async function fetchEducationRaw(): Promise<EducationRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching education:", error);
    return [];
  }

  return (data || []) as EducationRow[];
}
