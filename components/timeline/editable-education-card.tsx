"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { EditableText } from "@/components/admin/editable-text";
import { EditableList } from "@/components/admin/editable-list";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";

interface EditableEducationCardProps {
  id: string;
  label: string;
  title: string;
  institution: string;
  competencies: string[];
  onDelete?: () => void;
}

export function EditableEducationCard({
  id,
  label,
  title,
  institution,
  competencies,
  onDelete,
}: EditableEducationCardProps) {
  const { isEditMode } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("education").delete().eq("id", id);
    setIsDeleting(false);

    if (!error && onDelete) {
      onDelete();
    }
  };

  return (
    <div className="glass rounded-2xl p-6 project-card relative group">
      {isEditMode && onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-mono bg-green-500/20 text-green-400 rounded-full">
          {label}
        </span>
      </div>
      <EditableText
        value={title}
        table="education"
        id={id}
        field="title"
        as="h4"
        className="text-2xl font-display font-bold text-white mb-2"
      />
      <EditableText
        value={institution}
        table="education"
        id={id}
        field="institution"
        as="p"
        className="text-accent text-sm mb-4"
      />
      <EditableList
        items={competencies}
        table="education"
        id={id}
        field="competencies"
        isTranslated={true}
        className="flex flex-wrap gap-2"
        placeholder="Add competency..."
        renderItem={(comp) => (
          <span className="px-3 py-1 text-xs bg-surface-lighter text-neutral-400 rounded-full">
            {comp}
          </span>
        )}
      />
    </div>
  );
}
