"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/lib/admin-context";
import {
  Edit3,
  Save,
  X,
  Loader2,
  LogOut,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditModeToolbar() {
  const {
    isAuthenticated,
    isEditMode,
    toggleEditMode,
    disableEditMode,
    hasUnsavedChanges,
    pendingChanges,
    saveAllChanges,
    discardChanges,
    isSaving,
    logout,
  } = useAdmin();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  if (!isAuthenticated) {
    return null;
  }

  const handleSave = async () => {
    const result = await saveAllChanges();
    setSaveStatus(result.success ? "success" : "error");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      >
        <AnimatePresence>
          {saveStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                saveStatus === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {saveStatus === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Changes saved!
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Save failed
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="glass rounded-2xl p-2 flex items-center gap-2 border border-neutral-800"
        >
          {isEditMode ? (
            <>
              <div className="px-3 py-1.5 bg-accent/20 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent text-sm font-medium">
                  Edit Mode
                </span>
              </div>

              {hasUnsavedChanges && (
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                  {pendingChanges.size} change{pendingChanges.size !== 1 && "s"}
                </span>
              )}

              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Save changes"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-sm hidden sm:inline">Save</span>
              </button>

              <button
                onClick={discardChanges}
                disabled={!hasUnsavedChanges || isSaving}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Discard changes"
              >
                <X className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Discard</span>
              </button>

              <button
                onClick={disableEditMode}
                className="px-3 py-1.5 bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors flex items-center gap-2"
                title="Exit edit mode"
              >
                <span className="text-sm">Exit</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleEditMode}
                className="px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors flex items-center gap-2"
                title="Enter edit mode"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
