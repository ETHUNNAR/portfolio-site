"use client";

import { useState, ReactNode } from "react";
import { Trash2, Loader2, Pencil } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";
import { EditWorkExperienceModal } from "@/components/admin/edit-work-experience-modal";

function highlightNumbers(text: string): ReactNode[] {
  const parts = text.split(/(\d+%|\d+\+)/g);
  return parts.map((part, index) => {
    if (/^\d+%$|^\d+\+$/.test(part)) {
      return (
        <span key={index} className="text-white font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
}

interface EditableWorkExperienceCardProps {
  id: string;
  label: string;
  title: string;
  position: string;
  points: string[];
  onDelete?: () => void;
}

export function EditableWorkExperienceCard({
  id,
  label,
  title,
  position,
  points,
  onDelete,
}: EditableWorkExperienceCardProps) {
  const { isEditMode } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("work_experiences").delete().eq("id", id);
    setIsDeleting(false);

    if (!error && onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <div className="glass rounded-2xl p-6 project-card relative group">
        {isEditMode && onDelete && (
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-2 text-neutral-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 text-xs font-mono bg-accent/20 text-accent rounded-full">
            {label}
          </span>
        </div>
        <h4 className="text-2xl font-display font-bold text-white mb-2">{title}</h4>
        <p className="text-accent text-sm mb-4">{position}</p>
        <div className="space-y-3">
          {points.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2 text-neutral-300 text-sm">
              <span className="text-accent mt-1">▹</span>
              <span>{highlightNumbers(point)}</span>
            </div>
          ))}
        </div>
      </div>

      {isEditOpen && (
        <EditWorkExperienceModal
          id={id}
          onClose={() => setIsEditOpen(false)}
          onSave={() => {
            setIsEditOpen(false);
            onDelete?.(); // Reuse onDelete as refetch
          }}
        />
      )}
    </>
  );
}
