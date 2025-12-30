import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

type LanguageRow = Database["public"]["Tables"]["languages"]["Row"];

export interface LanguageDB {
  id: string;
  lang: string;
  level: string;
  flag: string;
  sortOrder: number;
}

export async function fetchLanguages(
  language: "en" | "da"
): Promise<LanguageDB[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching languages:", error);
    return [];
  }

  return ((data || []) as LanguageRow[]).map((row) => ({
    id: row.id,
    lang: language === "en" ? row.lang_en : row.lang_da,
    level: language === "en" ? row.level_en : row.level_da,
    flag: row.flag,
    sortOrder: row.sort_order,
  }));
}

export async function fetchLanguagesRaw(): Promise<LanguageRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching languages:", error);
    return [];
  }

  return (data || []) as LanguageRow[];
}
