"use client";

import { useState } from "react";
import { Trash2, Loader2, Pencil } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";
import { EditProjectModal } from "@/components/admin/edit-project-modal";

interface EditableProjectCardProps {
  id: string;
  label: string;
  secondaryLabel?: string;
  title: string;
  description: string;
  technologies: string[];
  points?: string[];
  metricValue?: string;
  metricLabel?: string;
  imageUrls?: string[];
  onDelete?: () => void;
}

export function EditableProjectCard({
  id,
  label,
  secondaryLabel,
  title,
  description,
  technologies,
  points,
  metricValue,
  metricLabel,
  imageUrls = [],
  onDelete,
}: EditableProjectCardProps) {
  const { isEditMode } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("projects").delete().eq("id", id);
    setIsDeleting(false);

    if (!error && onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <div className="glass rounded-2xl p-6 project-card relative group">
        {isEditMode && onDelete && (
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
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
          <span className="px-3 py-1 text-xs font-mono bg-pink-500/20 text-pink-400 rounded-full">
            {label}
          </span>
          {secondaryLabel && (
            <span className="px-3 py-1 text-xs font-mono bg-surface-lighter text-neutral-400 rounded-full">
              {secondaryLabel}
            </span>
          )}
        </div>
        <h4 className="text-2xl font-display font-bold text-white mb-2">{title}</h4>
        <p className="text-neutral-300 text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, idx) => (
            <span
              key={idx}
              className="skill-badge px-3 py-1 text-xs bg-surface-light border border-neutral-800 text-neutral-300 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        {points && points.length > 0 && (
          <div className="space-y-2">
            {points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-neutral-400 text-sm">
                <span className="text-accent mt-1">▹</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        )}
        {metricValue && metricLabel && (
          <div className="bg-surface-light rounded-xl p-4 inline-block mt-4">
            <p className="text-2xl font-display font-bold gradient-text">{metricValue}</p>
            <p className="text-xs text-neutral-500 mt-1">{metricLabel}</p>
          </div>
        )}
        {imageUrls.length > 0 && (
          <div className={`grid gap-2 mt-4 ${
            imageUrls.length === 1 ? 'grid-cols-1' :
            imageUrls.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {imageUrls.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedImage(url)}
                className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 hover:border-accent/50 transition-colors"
              >
                <img
                  src={url}
                  alt={`${title} - Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}

      {isEditOpen && (
        <EditProjectModal
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
