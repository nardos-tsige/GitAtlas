import { ArrowUpDown } from "lucide-react";
import type { RepoSortOption } from "../types/github";

interface SortSelectProps {
  value: RepoSortOption;
  onChange: (value: RepoSortOption) => void;
}

const OPTIONS: { value: RepoSortOption; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "stars", label: "Most stars" },
  { value: "forks", label: "Most forks" },
  { value: "name", label: "Name (A–Z)" },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--text-dim)] transition-colors">
      <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-dim)]" />
      <span className="text-[11px] text-[var(--text-dim)]">sort:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as RepoSortOption)}
        className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--bg)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}