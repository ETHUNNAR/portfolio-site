"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";

const ICON_OPTIONS = [
  { value: "Code2", label: "Code" },
  { value: "Layers", label: "Layers (Frontend)" },
  { value: "Database", label: "Database (Backend)" },
  { value: "Smartphone", label: "Smartphone (Mobile)" },
  { value: "GitBranch", label: "Git (DevOps)" },
  { value: "Cloud", label: "Cloud" },
  { value: "TestTube2", label: "Test Tube (Testing)" },
];

interface AddSkillCategoryProps {
  onAdd: () => void;
}

export function AddSkillCategory({ onAdd }: AddSkillCategoryProps) {
  const { isEditMode, isAuthenticated } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title_en: "",
    title_da: "",
    icon_name: "Code2",
    skills: [""],
  });

  if (!isEditMode || !isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!formData.title_en || formData.skills.filter(s => s.trim()).length === 0) return;

    setIsSubmitting(true);
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("skill_categories").insert({
      title_en: formData.title_en,
      title_da: formData.title_da || formData.title_en,
      icon_name: formData.icon_name,
      skills: formData.skills.filter((s) => s.trim()),
      sort_order: 0,
    });

    setIsSubmitting(false);

    if (!error) {
      setIsOpen(false);
      setFormData({
        title_en: "",
        title_da: "",
        icon_name: "Code2",
        skills: [""],
      });
      onAdd();
    }
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="glass rounded-2xl p-6 border-2 border-dashed border-neutral-700 hover:border-accent/50 text-neutral-500 hover:text-accent transition-all flex items-center justify-center gap-2 min-h-[200px]"
      >
        <Plus className="w-5 h-5" />
        Add Category
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-light border border-neutral-800 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">
                  Add Skill Category
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Category Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g., Frontend"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) =>
                      setFormData({ ...formData, icon_name: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Skills
                  </label>
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          className="flex-1 bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                          placeholder="e.g., React"
                        />
                        {formData.skills.length > 1 && (
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addSkill}
                    className="text-accent text-sm hover:underline flex items-center gap-1 mt-2"
                  >
                    <Plus className="w-4 h-4" /> Add skill
                  </button>
                </div>

                <div className="border-t border-neutral-800 pt-4 mt-4">
                  <p className="text-xs text-neutral-500 mb-3">
                    Danish translation (optional)
                  </p>
                  <input
                    type="text"
                    value={formData.title_da}
                    onChange={(e) =>
                      setFormData({ ...formData, title_da: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Category name (Danish)"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 px-4 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.title_en || formData.skills.filter(s => s.trim()).length === 0}
                  className="flex-1 py-2 px-4 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
