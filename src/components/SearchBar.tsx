import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Loader2, X } from "lucide-react";
import { useUserSearch } from "../hooks/useUserSearch";

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
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, loading: searching } = useUserSearch(value);
  const navigate = useNavigate();

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

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setHighlight(-1);
  }, [results]);

  function submit(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setOpen(false);
    onSearch(trimmed);
    inputRef.current?.blur();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (highlight >= 0 && results[highlight]) {
      submit(results[highlight].login);
    } else {
      submit(value);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div ref={containerRef} className="relative">
        <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] focus-within:border-[var(--text-primary)] transition-colors overflow-hidden">
          <span className="pl-4 pr-1 text-[var(--text-dim)] font-bold select-none">
            &gt;
          </span>

          <input
            ref={inputRef}
            id="search-user-input"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (value.trim().length >= 2) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
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
                  setOpen(false);
                  inputRef.current?.focus();
                }}
                title="Clear"
                className="p-1 rounded-md text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {loading || searching ? (
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

        {open && results.length > 0 && (
          <ul className="absolute left-0 right-0 top-full mt-2 z-[100] rounded-xl border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md overflow-hidden shadow-xl">
            {results.map((user, i) => (
              <li key={user.id}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => {
                    submit(user.login);
                    navigate(`/user/${user.login}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === highlight
                      ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="w-6 h-6 rounded-md border border-[var(--border)]"
                  />
                  <span className="font-mono">{user.login}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}