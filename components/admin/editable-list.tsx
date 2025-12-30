"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { Plus, X, GripVertical } from "lucide-react";

interface EditableListProps {
  items: string[];
  table: string;
  id: string;
  field: string;
  className?: string;
  itemClassName?: string;
  renderItem?: (item: string, index: number) => React.ReactNode;
  placeholder?: string;
  isTranslated?: boolean;
}

export function EditableList({
  items,
  table,
  id,
  field,
  className,
  itemClassName,
  renderItem,
  placeholder = "Add item...",
  isTranslated = false,
}: EditableListProps) {
  const { isEditMode, trackChange, pendingChanges } = useAdmin();
  const { language } = useLanguage();
  const [localItems, setLocalItems] = useState<string[]>(items);
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fieldWithLang = isTranslated ? `${field}_${language}` : field;
  const changeKey = `${table}:${id}:${fieldWithLang}`;

  const pendingChange = pendingChanges.get(changeKey);
  const hasChange = !!pendingChange;
  const displayItems = hasChange ? (pendingChange.newValue as string[]) : items;

  useEffect(() => {
    setLocalItems(displayItems);
  }, [displayItems]);

  const saveChanges = (newItems: string[]) => {
    trackChange({
      table,
      id,
      field: fieldWithLang,
      originalValue: items,
      newValue: newItems,
    });
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    const newItems = [...localItems, newItem.trim()];
    setLocalItems(newItems);
    setNewItem("");
    saveChanges(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = localItems.filter((_, i) => i !== index);
    setLocalItems(newItems);
    saveChanges(newItems);
  };

  const handleUpdateItem = (index: number, value: string) => {
    const newItems = [...localItems];
    newItems[index] = value;
    setLocalItems(newItems);
    saveChanges(newItems);
  };

  if (!isEditMode) {
    return (
      <div className={className}>
        {items.map((item, index) =>
          renderItem ? (
            <div key={index}>{renderItem(item, index)}</div>
          ) : (
            <span key={index} className={itemClassName}>
              {item}
            </span>
          )
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        className,
        "rounded-lg p-2",
        hasChange ? "ring-2 ring-amber-500/50 bg-amber-500/5" : ""
      )}
    >
      {localItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2 group">
          <GripVertical className="w-4 h-4 text-neutral-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />

          {editingIndex === index ? (
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...localItems];
                newItems[index] = e.target.value;
                setLocalItems(newItems);
              }}
              onBlur={() => {
                handleUpdateItem(index, localItems[index]);
                setEditingIndex(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateItem(index, localItems[index]);
                  setEditingIndex(null);
                }
                if (e.key === "Escape") {
                  setLocalItems(displayItems);
                  setEditingIndex(null);
                }
              }}
              autoFocus
              className="flex-1 bg-surface-light border border-accent rounded px-2 py-1 text-white text-sm focus:outline-none"
            />
          ) : renderItem ? (
            <div
              className="flex-1 cursor-pointer hover:bg-surface-light/50 rounded px-2 py-1 transition-colors"
              onClick={() => setEditingIndex(index)}
            >
              {renderItem(item, index)}
            </div>
          ) : (
            <span
              className={cn(
                itemClassName,
                "flex-1 cursor-pointer hover:bg-surface-light/50 rounded px-2 py-1 transition-colors"
              )}
              onClick={() => setEditingIndex(index)}
            >
              {item}
            </span>
          )}

          <button
            onClick={() => handleRemoveItem(index)}
            className="p-1 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddItem();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-surface-light border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItem.trim()}
          className="p-2 bg-accent/20 hover:bg-accent/30 text-accent rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add item"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
