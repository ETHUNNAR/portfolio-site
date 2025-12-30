"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";

interface AddProjectProps {
  onAdd: () => void;
}

export function AddProject({ onAdd }: AddProjectProps) {
  const { isEditMode, isAuthenticated } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    title_da: "",
    description_en: "",
    description_da: "",
    technologies: [""],
    points_en: [""],
    points_da: [""],
    label_en: "Personal Project",
    label_da: "Personligt Projekt",
  });

  if (!isEditMode || !isAuthenticated) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`"${file.name}" is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 5MB`);
        continue;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setImageFiles([...imageFiles, ...validFiles]);
    setImagePreviews([...imagePreviews, ...validPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setIsUploading(true);
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).storage
        .from("project-images")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: urlData } = (supabase as any).storage
        .from("project-images")
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    setIsUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!formData.title_en || !formData.description_en) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const imageUrls = await uploadImages();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("projects").insert({
      title_en: formData.title_en,
      title_da: formData.title_da || formData.title_en,
      description_en: formData.description_en,
      description_da: formData.description_da || formData.description_en,
      technologies: formData.technologies.filter((t) => t.trim()),
      points_en: formData.points_en.filter((p) => p.trim()),
      points_da: formData.points_da.filter((p) => p.trim()).length > 0
        ? formData.points_da.filter((p) => p.trim())
        : formData.points_en.filter((p) => p.trim()),
      label_en: formData.label_en,
      label_da: formData.label_da || formData.label_en,
      image_urls: imageUrls,
      year_label: null,
      sort_order: 0,
    });

    setIsSubmitting(false);

    if (!error) {
      setIsOpen(false);
      setFormData({
        title_en: "",
        title_da: "",
        description_en: "",
        description_da: "",
        technologies: [""],
        points_en: [""],
        points_da: [""],
        label_en: "Personal Project",
        label_da: "Personligt Projekt",
      });
      setImageFiles([]);
      setImagePreviews([]);
      onAdd();
    }
  };

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...formData.technologies, ""],
    });
  };

  const updateTechnology = (index: number, value: string) => {
    const newTech = [...formData.technologies];
    newTech[index] = value;
    setFormData({ ...formData, technologies: newTech });
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
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
        className="w-full p-4 border-2 border-dashed border-neutral-700 hover:border-pink-500/50 rounded-2xl text-neutral-500 hover:text-pink-400 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Project
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
              className="bg-surface-light border border-neutral-800 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">
                  Add Project
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
                    Project Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g., MyAwesomeApp"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) =>
                      setFormData({ ...formData, description_en: e.target.value })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent min-h-[80px]"
                    placeholder="Brief description of the project..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Project Images (optional)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-video">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-neutral-700"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video border-2 border-dashed border-neutral-700 hover:border-accent/50 rounded-lg flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-accent transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Add</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-600">Max 5MB per image</p>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Label
                  </label>
                  <select
                    value={formData.label_en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        label_en: e.target.value,
                        label_da:
                          e.target.value === "Personal Project"
                            ? "Personligt Projekt"
                            : e.target.value === "Mobile App"
                            ? "Mobil App"
                            : e.target.value,
                      })
                    }
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Personal Project">Personal Project</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web App">Web App</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => updateTechnology(index, e.target.value)}
                          className="bg-surface border border-neutral-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-accent w-28"
                          placeholder="Tech..."
                        />
                        {formData.technologies.length > 1 && (
                          <button
                            onClick={() => removeTechnology(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addTechnology}
                    className="text-accent text-sm hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add technology
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Key Points (English, optional)
                  </label>
                  {formData.points_en.map((point, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updatePoint(index, e.target.value, "en")}
                        className="flex-1 bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                        placeholder="Key feature or achievement..."
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
                    Danish translations (optional)
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.title_da}
                      onChange={(e) =>
                        setFormData({ ...formData, title_da: e.target.value })
                      }
                      className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="Project name (Danish)"
                    />
                    <textarea
                      value={formData.description_da}
                      onChange={(e) =>
                        setFormData({ ...formData, description_da: e.target.value })
                      }
                      className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent min-h-[60px]"
                      placeholder="Description (Danish)"
                    />
                    {formData.points_en.some(p => p.trim()) && (
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Key Points (Danish)
                        </label>
                        {formData.points_da.map((point, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => updatePoint(index, e.target.value, "da")}
                              className="flex-1 bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                              placeholder={formData.points_en[index] ? `Danish: "${formData.points_en[index].substring(0, 30)}..."` : "Key point (Danish)..."}
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
                  disabled={isSubmitting || isUploading || !formData.title_en || !formData.description_en}
                  className="flex-1 py-2 px-4 bg-pink-500 hover:bg-pink-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Adding..."}
                    </>
                  ) : (
                    "Add Project"
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
