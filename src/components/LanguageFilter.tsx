import { Filter } from "lucide-react";

interface LanguageFilterProps {
  languages: { name: string; count: number }[];
  selected: string | null;
  onSelect: (language: string | null) => void;
}

export function LanguageFilter({ languages, selected, onSelect }: LanguageFilterProps) {
  if (languages.length === 0) return null;

  const pillBase =
    "px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer shrink-0";
  const pillActive =
    "bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)] font-medium";
  const pillIdle =
    "border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)]";

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
      <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)] shrink-0 pr-1">
        <Filter className="w-3 h-3" />
        <span>lang:</span>
      </div>

      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`${pillBase} ${selected === null ? pillActive : pillIdle}`}
      >
        All
      </button>

      {languages.map((lang) => {
        const active = selected === lang.name;
        return (
          <button
            key={lang.name}
            type="button"
            onClick={() => onSelect(active ? null : lang.name)}
            className={`${pillBase} ${active ? pillActive : pillIdle}`}
          >
            {lang.name}
            <span className="ml-1.5 text-[10px] opacity-60">{lang.count}</span>
          </button>
        );
      })}
    </div>
  );
}