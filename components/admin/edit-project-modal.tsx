"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Upload, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EditProjectModalProps {
  id: string;
  onClose: () => void;
  onSave: () => void;
}

export function EditProjectModal({ id, onClose, onSave }: EditProjectModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setFormData({
          title_en: data.title_en || "",
          title_da: data.title_da || "",
          description_en: data.description_en || "",
          description_da: data.description_da || "",
          technologies: data.technologies?.length > 0 ? data.technologies : [""],
          points_en: data.points_en?.length > 0 ? data.points_en : [""],
          points_da: data.points_da?.length > 0 ? data.points_da : [""],
          label_en: data.label_en || "Personal Project",
          label_da: data.label_da || "Personligt Projekt",
        });
        setExistingImageUrls(data.image_urls || []);
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [id]);

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

    setNewImageFiles([...newImageFiles, ...validFiles]);
    setNewImagePreviews([...newImagePreviews, ...validPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = (url: string) => {
    setExistingImageUrls(existingImageUrls.filter((u) => u !== url));
    setRemovedImageUrls([...removedImageUrls, url]);
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const uploadNewImages = async (): Promise<string[]> => {
    if (newImageFiles.length === 0) return [];

    setIsUploading(true);
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const file of newImageFiles) {
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

    const newUploadedUrls = await uploadNewImages();
    const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("projects")
      .update({
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
        image_urls: finalImageUrls,
      })
      .eq("id", id);

    setIsSubmitting(false);

    if (!error) {
      onSave();
    }
  };

  const addTechnology = () => {
    setFormData({ ...formData, technologies: [...formData.technologies, ""] });
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-surface-light border border-neutral-800 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-white">Edit Project</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Project Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Images</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {existingImageUrls.map((url, index) => (
                      <div key={`existing-${index}`} className="relative aspect-video">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-neutral-700"
                        />
                        <button
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {newImagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative aspect-video">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-accent/50"
                        />
                        <button
                          onClick={() => removeNewImage(index)}
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
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Label</label>
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
                  <label className="block text-sm text-neutral-400 mb-2">Technologies</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => updateTechnology(index, e.target.value)}
                          className="bg-surface border border-neutral-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-accent w-28"
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
                  <label className="block text-sm text-neutral-400 mb-2">Key Points (English)</label>
                  {formData.points_en.map((point, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updatePoint(index, e.target.value, "en")}
                        className="flex-1 bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
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
                  <p className="text-xs text-neutral-500 mb-3">Danish translations (optional)</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.title_da}
                      onChange={(e) => setFormData({ ...formData, title_da: e.target.value })}
                      className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                      placeholder="Project name (Danish)"
                    />
                    <textarea
                      value={formData.description_da}
                      onChange={(e) => setFormData({ ...formData, description_da: e.target.value })}
                      className="w-full bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent min-h-[60px]"
                      placeholder="Description (Danish)"
                    />
                    {formData.points_en.some((p) => p.trim()) && (
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
                              placeholder={
                                formData.points_en[index]
                                  ? `Danish: "${formData.points_en[index].substring(0, 30)}..."`
                                  : "Key point (Danish)..."
                              }
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
                  onClick={onClose}
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
                      {isUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
