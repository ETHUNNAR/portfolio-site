"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "./supabase/client";
import { User } from "@supabase/supabase-js";

export interface PendingChange {
  table: string;
  id: string;
  field: string;
  originalValue: unknown;
  newValue: unknown;
}

interface AdminContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  enableEditMode: () => void;
  disableEditMode: () => void;
  pendingChanges: Map<string, PendingChange>;
  hasUnsavedChanges: boolean;
  trackChange: (change: Omit<PendingChange, "originalValue"> & { originalValue?: unknown }) => void;
  discardChanges: () => void;
  removeChange: (key: string) => void;
  saveAllChanges: () => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(
    new Map()
  );
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsEditMode(false);
        setPendingChanges(new Map());
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsEditMode(false);
    setPendingChanges(new Map());
  };

  const toggleEditMode = () => setIsEditMode((prev) => !prev);
  const enableEditMode = () => setIsEditMode(true);
  const disableEditMode = () => {
    if (pendingChanges.size > 0) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to exit edit mode?"
      );
      if (!confirmed) return;
    }
    setIsEditMode(false);
    setPendingChanges(new Map());
  };

  const trackChange = useCallback(
    (change: Omit<PendingChange, "originalValue"> & { originalValue?: unknown }) => {
      const key = `${change.table}:${change.id}:${change.field}`;
      setPendingChanges((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(key);

        if (existing && change.newValue === existing.originalValue) {
          newMap.delete(key);
        } else {
          newMap.set(key, {
            ...change,
            originalValue: existing?.originalValue ?? change.originalValue,
          } as PendingChange);
        }

        return newMap;
      });
    },
    []
  );

  const removeChange = useCallback((key: string) => {
    setPendingChanges((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const discardChanges = useCallback(() => {
    setPendingChanges(new Map());
  }, []);

  const saveAllChanges = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (pendingChanges.size === 0) {
      return { success: true };
    }

    setIsSaving(true);

    try {
      const changesByTableAndId = new Map<string, Record<string, unknown>>();

      pendingChanges.forEach((change) => {
        const tableIdKey = `${change.table}:${change.id}`;
        const existing = changesByTableAndId.get(tableIdKey) || {};
        existing[change.field] = change.newValue;
        changesByTableAndId.set(tableIdKey, existing);
      });

      const updates: Promise<{ error: Error | null }>[] = [];

      changesByTableAndId.forEach((fields, tableIdKey) => {
        const [table, id] = tableIdKey.split(":");
        updates.push(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any)
            .from(table)
            .update({ ...fields, updated_at: new Date().toISOString() })
            .eq("id", id)
            .then(({ error }: { error: Error | null }) => ({ error }))
        );
      });

      const results = await Promise.all(updates);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) {
        return {
          success: false,
          error: `Failed to save ${errors.length} update(s)`,
        };
      }

      setPendingChanges(new Map());
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSaving(false);
    }
  };

  const value: AdminContextType = {
    isAuthenticated: !!user,
    user,
    isLoading,
    isEditMode,
    toggleEditMode,
    enableEditMode,
    disableEditMode,
    pendingChanges,
    hasUnsavedChanges: pendingChanges.size > 0,
    trackChange,
    discardChanges,
    removeChange,
    saveAllChanges,
    isSaving,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
