import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, Loader2, Search, X } from "lucide-react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  loading?: boolean;
  onSearch: (username: string) => void;
  autoFocusKey?: boolean;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search a GitHub username…",
  loading = false,
  onSearch,
  autoFocusKey = true,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!autoFocusKey) return;

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const editing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (e.key === "/" && !editing) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [autoFocusKey]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    onSearch(name);
    inputRef.current?.blur();
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] focus-within:border-[var(--text-primary)] transition-colors overflow-hidden">
        <span className="pl-4 pr-1 text-[var(--text-dim)] font-bold select-none">
          &gt;
        </span>

        <input
          ref={inputRef}
          id="search-user-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 py-3.5 px-2 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:outline-none"
        />

        <div className="flex items-center pr-3 gap-1.5">
          {value && !loading && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                inputRef.current?.focus();
              }}
              title="Clear"
              className="p-1 rounded-md text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {loading ? (
            <Loader2 className="w-4 h-4 text-[var(--text-dim)] animate-spin" />
          ) : (
            <button
              type="submit"
              disabled={!value.trim()}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Run</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}