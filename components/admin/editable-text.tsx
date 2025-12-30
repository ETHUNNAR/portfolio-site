"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  table: string;
  id: string;
  field: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "li";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  table,
  id,
  field,
  as: Component = "span",
  className,
  multiline = false,
  placeholder = "Enter text...",
}: EditableTextProps) {
  const { isEditMode, trackChange, pendingChanges } = useAdmin();
  const { language } = useLanguage();
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const fieldWithLang = `${field}_${language}`;
  const changeKey = `${table}:${id}:${fieldWithLang}`;

  const pendingChange = pendingChanges.get(changeKey);
  const hasChange = !!pendingChange;
  const displayValue = hasChange ? (pendingChange.newValue as string) : value;

  useEffect(() => {
    setLocalValue(displayValue);
  }, [displayValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (localValue !== value) {
      trackChange({
        table,
        id,
        field: fieldWithLang,
        originalValue: value,
        newValue: localValue,
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setLocalValue(displayValue);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (!isEditing) {
    return (
      <Component
        className={cn(
          className,
          "cursor-pointer transition-all duration-200",
          "outline-dashed outline-2 outline-offset-2",
          hasChange
            ? "outline-amber-500/50 bg-amber-500/5"
            : "outline-transparent hover:outline-accent/30"
        )}
        onClick={() => setIsEditing(true)}
        title="Click to edit"
      >
        {displayValue || <span className="text-neutral-500 italic">{placeholder}</span>}
      </Component>
    );
  }

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "bg-surface-light border-2 border-accent rounded-md px-2 py-1 w-full min-h-[100px]",
          "text-white focus:outline-none focus:ring-2 focus:ring-accent/50",
          "resize-y",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={cn(
        "bg-surface-light border-2 border-accent rounded-md px-2 py-1 w-full",
        "text-white focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
      placeholder={placeholder}
    />
  );
}
