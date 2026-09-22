import { ArrowUpRight, History, Trash2, X } from "lucide-react";
import type { SearchHistoryItem } from "../types/github";

interface SearchHistoryProps {
  items: SearchHistoryItem[];
  onSelect: (username: string) => void;
  onRemove: (username: string) => void;
  onClear: () => void;
}

export function SearchHistory({
  items,
  onSelect,
  onRemove,
  onClear,
}: SearchHistoryProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2 px-1 text-[11px] text-[var(--text-dim)]">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" />
          <span>Recent</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.username}
            className="group flex items-center rounded-lg border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--text-primary)] transition-colors overflow-hidden text-xs"
          >
            <button
              type="button"
              onClick={() => onSelect(item.username)}
              className="flex items-center gap-1.5 py-1.5 pl-2.5 pr-1.5 text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <span className="text-[var(--text-dim)] font-bold">&gt;</span>
              <span>{item.username}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-dim)]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.username);
              }}
              title={`Remove ${item.username}`}
              className="p-1.5 text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors border-l border-[var(--border)] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}