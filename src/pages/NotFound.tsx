import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, User } from "lucide-react";

interface NotFoundProps {
  kind?: "user" | "repo" | "page";
  term?: string;
}

const SUGGESTIONS = ["torvalds", "gaearon", "antfu", "shadcn", "sindresorhus"];

export function NotFound({ kind = "page", term }: NotFoundProps) {
  const navigate = useNavigate();

  const heading =
    kind === "user" && term
      ? `User "${term}" not found`
      : kind === "repo" && term
        ? `Repository "${term}" not found`
        : "Page not found";

  const body =
    kind === "user"
      ? "The handle may be misspelled, renamed, or deleted."
      : kind === "repo"
        ? "This repository could not be located."
        : "The page you're looking for doesn't exist.";

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-center space-y-6">
      <div className="inline-flex p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
          {heading}
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">{body}</p>
      </div>

      <div className="pt-4 border-t border-[var(--border)] text-left">
        <p className="text-xs text-[var(--text-dim)] mb-3">
          Try one of these instead:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => navigate(`/user/${name}`)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--text-primary)] text-xs transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[var(--text-dim)] group-hover:text-[var(--text-primary)]" />
              <span className="text-[var(--text-primary)]">@{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-xs font-semibold hover:opacity-85 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to search
        </Link>
      </div>
    </div>
  );
}