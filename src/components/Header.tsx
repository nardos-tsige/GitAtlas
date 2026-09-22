import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Terminal, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useRateLimit } from "../hooks/useRateLimit";
import { getToken, saveToken } from "../utils/githubApi";

interface HeaderProps {
  onQuickSearch?: () => void;
}

export function Header({ onQuickSearch }: HeaderProps) {
  const { rateLimit, refresh } = useRateLimit();
  const [modalOpen, setModalOpen] = useState(false);

  const minutesToReset = Math.max(
    0,
    Math.round((rateLimit.reset * 1000 - Date.now()) / 60000)
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]"
            >
              <img src="/favicon.svg" alt="" className="w-6 h-6" />
              <span>GitAtlas</span>
              <span className="animate-cursor text-[var(--text-primary)]">_</span>
            </Link>

            <span className="hidden md:inline-block text-[10px] text-[var(--text-dim)] border border-[var(--border)] px-1.5 py-0.5 rounded">
              v0.1.0
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onQuickSearch && (
              <button
                type="button"
                onClick={onQuickSearch}
                title="Focus search (/)"
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="text-[11px]">Search</span>
                <kbd className="text-[10px] border border-[var(--border)] px-1 rounded">
                  /
                </kbd>
              </button>
            )}

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              title="API rate limit"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">
                {rateLimit.remaining}
              </span>
              <span className="text-[11px]">left</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {modalOpen && (
        <RateLimitModal
          remaining={rateLimit.remaining}
          limit={rateLimit.limit}
          minutesToReset={minutesToReset}
          onClose={() => setModalOpen(false)}
          onTokenSaved={refresh}
        />
      )}
    </>
  );
}

interface RateLimitModalProps {
  remaining: number;
  limit: number;
  minutesToReset: number;
  onClose: () => void;
  onTokenSaved: () => void;
}

function RateLimitModal({
  remaining,
  limit,
  minutesToReset,
  onClose,
  onTokenSaved,
}: RateLimitModalProps) {
  const [token, setToken] = useState(() => getToken() ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    saveToken(token.trim() || null);
    setSaved(true);
    onTokenSaved();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  }

  function handleClear() {
    saveToken(null);
    setToken("");
    onTokenSaved();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-[var(--border)] bg-[var(--card-bg)] p-6 rounded-xl shadow-2xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--text-primary)]" />
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              API rate limit
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <ModalStat label="Remaining" value={remaining} />
          <ModalStat label="Limit" value={limit} />
          <ModalStat label="Resets in" value={`${minutesToReset}m`} />
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
          Anonymous requests to the GitHub API are limited to 60 per hour. Adding a
          personal access token raises the limit to 5,000. The token stays in your
          browser&apos;s localStorage.
        </p>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label
              htmlFor="github-pat"
              className="block text-[11px] text-[var(--text-dim)] mb-1"
            >
              Personal access token (optional)
            </label>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
              <input
                id="github-pat"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_…"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {getToken() ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] text-[var(--text-dim)] hover:text-[var(--text-primary)] underline underline-offset-2 cursor-pointer"
              >
                Clear saved token
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="px-3 py-1.5 text-xs rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold hover:opacity-85 transition-opacity cursor-pointer"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="text-[10px] text-[var(--text-dim)] mb-0.5 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-lg font-semibold text-[var(--text-primary)]">{value}</div>
    </div>
  );
}