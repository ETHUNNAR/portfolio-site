import { createClient } from "@/lib/supabase/client";
import { getIcon } from "@/lib/icon-map";
import { LucideIcon } from "lucide-react";
import { Database } from "@/lib/supabase/database.types";

type SkillCategoryRow = Database["public"]["Tables"]["skill_categories"]["Row"];

export interface SkillCategoryDB {
  id: string;
  title: string;
  icon: LucideIcon;
  iconName: string;
  skills: string[];
  sortOrder: number;
}

export async function fetchSkillCategories(
  language: "en" | "da"
): Promise<SkillCategoryDB[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching skill categories:", error);
    return [];
  }

  return ((data || []) as SkillCategoryRow[]).map((row) => ({
    id: row.id,
    title: language === "en" ? row.title_en : row.title_da,
    icon: getIcon(row.icon_name),
    iconName: row.icon_name,
    skills: row.skills,
    sortOrder: row.sort_order,
  }));
}

export async function fetchSkillCategoriesRaw(): Promise<SkillCategoryRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching skill categories:", error);
    return [];
  }

  return (data || []) as SkillCategoryRow[];
}
