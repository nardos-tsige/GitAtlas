import { useMemo, useState } from "react";
import { FolderGit2, Search } from "lucide-react";
import type { GitHubRepo, RepoSortOption } from "../types/github";
import { RepoCard } from "./RepoCard";
import { RepoCardSkeleton } from "./SkeletonLoader";
import { SortSelect } from "./SortSelect";
import { LanguageFilter } from "./LanguageFilter";

interface RepoListProps {
  repos: GitHubRepo[];
  loading: boolean;
}

function sortRepos(repos: GitHubRepo[], option: RepoSortOption): GitHubRepo[] {
  const copy = [...repos];
  switch (option) {
    case "stars":
      return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case "forks":
      return copy.sort((a, b) => b.forks_count - a.forks_count);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "updated":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }
}

export function RepoList({ repos, loading }: RepoListProps) {
  const [sort, setSort] = useState<RepoSortOption>("updated");
  const [language, setLanguage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach((repo) => {
      if (repo.language) {
        counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
      }
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [repos]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    let filtered = repos;
    if (language) {
      filtered = filtered.filter((r) => r.language === language);
    }
    if (q) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false)
      );
    }

    return sortRepos(filtered, sort);
  }, [repos, language, query, sort]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
          <div className="h-4 w-32 skeleton-shimmer rounded" />
          <div className="h-8 w-44 skeleton-shimmer rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const hasFilters = language !== null || query !== "";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[var(--text-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Repositories
          </h3>
          <span className="text-xs text-[var(--text-dim)]">
            {visible.length}
            {visible.length !== repos.length && ` of ${repos.length}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex items-center">
            <Search className="w-3 h-3 absolute left-2.5 text-[var(--text-dim)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="pl-7 pr-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--text-primary)] w-36 sm:w-48 transition-colors"
            />
          </div>

          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      {languages.length > 0 && (
        <LanguageFilter
          languages={languages}
          selected={language}
          onSelect={setLanguage}
        />
      )}

      {visible.length === 0 ? (
        <div className="py-12 px-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-center space-y-2">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            No repositories found
          </p>
          <p className="text-xs text-[var(--text-dim)]">
            {hasFilters
              ? "Try clearing the language filter or search."
              : "This user has no public repositories."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setLanguage(null);
                setQuery("");
              }}
              className="mt-2 px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}