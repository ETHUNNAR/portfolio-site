import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

const ALLOWED_TABLES = [
  "skill_categories",
  "work_experiences",
  "education",
  "projects",
  "languages",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

function isAllowedTable(table: string): table is AllowedTable {
  return ALLOWED_TABLES.includes(table as AllowedTable);
}

function isAdminUser(user: User): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  return adminEmails.includes(user.email?.toLowerCase() || "");
}

interface BatchChange {
  table: string;
  id: string;
  field: string;
  newValue: unknown;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!isAdminUser(user)) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { changes } = body as { changes: BatchChange[] };

    if (!changes || !Array.isArray(changes)) {
      return NextResponse.json(
        { error: "Changes array is required" },
        { status: 400 }
      );
    }

    const groupedChanges = new Map<string, Record<string, unknown>>();

    for (const change of changes) {
      if (!isAllowedTable(change.table)) {
        return NextResponse.json(
          { error: `Invalid table: ${change.table}` },
          { status: 400 }
        );
      }

      const key = `${change.table}:${change.id}`;
      const existing = groupedChanges.get(key) || {
        _table: change.table,
        _id: change.id,
      };
      existing[change.field] = change.newValue;
      groupedChanges.set(key, existing);
    }

    const results: { key: string; success: boolean; error?: string }[] = [];

    for (const [key, updates] of Array.from(groupedChanges.entries())) {
      const { _table: table, _id: id, ...fields } = updates;
      fields.updated_at = new Date().toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from(table as string)
        .update(fields)
        .eq("id", id as string);

      if (error) {
        results.push({ key, success: false, error: error.message });
      } else {
        results.push({ key, success: true });
      }
    }

    const failures = results.filter((r) => !r.success);
    if (failures.length > 0) {
      return NextResponse.json(
        {
          success: false,
          results,
          error: `${failures.length} update(s) failed`,
        },
        { status: 207 } // Multi-status
      );
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error processing batch update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
