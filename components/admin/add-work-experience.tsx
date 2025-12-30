"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";

interface AddWorkExperienceProps {
  onAdd: () => void;
  yearLabel: string;
}

export function AddWorkExperience({ onAdd, yearLabel }: AddWorkExperienceProps) {
  const { isEditMode, isAuthenticated } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title_en: "",
    title_da: "",
    position_en: "",
    position_da: "",
    points_en: [""],
    points_da: [""],
  });

  if (!isEditMode || !isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!formData.title_en || !formData.position_en) return;

    setIsSubmitting(true);
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("work_experiences").insert({
      title_en: formData.title_en,
      title_da: formData.title_da || formData.title_en,
      position_en: formData.position_en,
      position_da: formData.position_da || formData.position_en,
      points_en: formData.points_en.filter((p) => p.trim()),
      points_da: formData.points_da.filter((p) => p.trim()).length > 0
        ? formData.points_da.filter((p) => p.trim())
        : formData.points_en.filter((p) => p.trim()),
      year_label: yearLabel,
      sort_order: 0,
    });

    setIsSubmitting(false);

    if (!error) {
      setIsOpen(false);
      setFormData({
        title_en: "",
        title_da: "",
        position_en: "",
        position_da: "",
        points_en: [""],
        points_da: [""],
      });
      onAdd();
    }
  };

  const addPoint = () => {
    setFormData({
      ...formData,
      points_en: [...formData.points_en, ""],
      points_da: [...formData.points_da, ""],
    });
  };

  const updatePoint = (index: number, value: string, lang: "en" | "da") => {
    const key = `points_${lang}` as "points_en" | "points_da";
    const newPoints = [...formData[key]];
    newPoints[index] = value;
    setFormData({ ...formData, [key]: newPoints });
  };

  const removePoint = (index: number) => {
    setFormData({
      ...formData,
      points_en: formData.points_en.filter((_, i) => i !== index),
      points_da: formData.points_da.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-neutral-700 hover:border-accent/50 rounded-2xl text-neutral-500 hover:text-accent transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Work Experience
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
                  Add Work Experience
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
                    Company Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g., Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Position (English)
                  </label>
                  <input
                    type="text"
                    value={formData.position_en}
                    onChange={(e) =>
                      setFormData({ ...formData, position_en: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g., Senior Developer · Copenhagen"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Achievements/Points (English)
                  </label>
                  {formData.points_en.map((point, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updatePoint(index, e.target.value, "en")}
                        className="flex-1 bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                        placeholder="Achievement..."
                      />
                      {formData.points_en.length > 1 && (
                        <button
                          onClick={() => removePoint(index)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addPoint}
                    className="text-accent text-sm hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add point
                  </button>
                </div>

                <div className="border-t border-neutral-800 pt-4 mt-4">
                  <p className="text-xs text-neutral-500 mb-3">
                    Danish translations (optional - will use English if empty)
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.title_da}
                      onChange={(e) =>
                        setFormData({ ...formData, title_da: e.target.value })
                      }
                      className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="Company name (Danish)"
                    />
                    <input
                      type="text"
                      value={formData.position_da}
                      onChange={(e) =>
                        setFormData({ ...formData, position_da: e.target.value })
                      }
                      className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="Position (Danish)"
                    />
                  </div>
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
                  disabled={isSubmitting || !formData.title_en || !formData.position_en}
                  className="flex-1 py-2 px-4 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Experience"
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
