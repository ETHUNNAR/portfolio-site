"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Trash2, Loader2 } from "lucide-react";
import { EditableText } from "@/components/admin/editable-text";
import { EditableList } from "@/components/admin/editable-list";
import { AddSkillCategory } from "@/components/admin/add-skill-category";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";

export interface SkillCategoryWithId {
  id: string;
  title: string;
  icon: LucideIcon;
  iconName: string;
  skills: string[];
}

interface SkillsSectionProps {
  title: string;
  subtitle: string;
  categories: SkillCategoryWithId[];
  onRefresh?: () => void;
}

function SkillCategoryCard({
  category,
  index,
  onDelete,
}: {
  category: SkillCategoryWithId;
  index: number;
  onDelete?: () => void;
}) {
  const { isEditMode } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${category.title}" category? This cannot be undone.`)) return;

    setIsDeleting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("skill_categories").delete().eq("id", category.id);
    setIsDeleting(false);

    if (!error && onDelete) {
      onDelete();
    }
  };

  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 relative group"
    >
      {isEditMode && onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="Delete category"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <category.icon className="w-5 h-5 text-accent" />
        </div>
        <EditableText
          value={category.title}
          table="skill_categories"
          id={category.id}
          field="title"
          as="h3"
          className="font-display text-lg font-semibold text-white"
        />
      </div>
      <EditableList
        items={category.skills}
        table="skill_categories"
        id={category.id}
        field="skills"
        className="flex flex-wrap gap-2"
        isTranslated={false}
        renderItem={(skill) => (
          <span className="skill-badge px-3 py-1.5 text-sm bg-surface-light border border-neutral-800 text-neutral-300 rounded-lg">
            {skill}
          </span>
        )}
        placeholder="Add a skill..."
      />
    </motion.div>
  );
}

export function SkillsSection({ title, subtitle, categories, onRefresh }: SkillsSectionProps) {
  const { isEditMode } = useAdmin();

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <SkillCategoryCard
              key={category.id}
              category={category}
              index={index}
              onDelete={onRefresh}
            />
          ))}
          {isEditMode && onRefresh && (
            <AddSkillCategory onAdd={onRefresh} />
          )}
        </div>
      </div>
    </section>
  );
}
