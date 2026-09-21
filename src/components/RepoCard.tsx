import { Link } from "react-router-dom";
import { CircleDot, Clock, ExternalLink, GitFork, Scale, Star } from "lucide-react";
import type { GitHubRepo } from "../types/github";
import { formatRelativeTime } from "../utils/formatDate";

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 hover:border-[var(--text-primary)] transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link
            to={`/repo/${repo.owner.login}/${repo.name}`}
            className="text-sm sm:text-base font-semibold text-[var(--text-primary)] hover:underline underline-offset-4 break-all"
          >
            {repo.name}
          </Link>

          <div className="flex items-center gap-1.5 shrink-0">
            {repo.fork && (
              <span className="text-[10px] uppercase border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-dim)]">
                fork
              </span>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open on GitHub"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4 min-h-8">
          {repo.description ?? "No description provided."}
        </p>
      </div>

      <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-[var(--text-dim)]">
        <div className="flex items-center gap-3">
          {repo.language && (
            <div className="flex items-center gap-1 text-[var(--text-muted)]">
              <CircleDot className="w-3 h-3 text-[var(--text-primary)]" />
              <span>{repo.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
            <Star className="w-3.5 h-3.5" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
            <GitFork className="w-3.5 h-3.5" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>

          {repo.license && (
            <div className="hidden sm:flex items-center gap-1">
              <Scale className="w-3 h-3" />
              <span className="truncate max-w-20">
                {repo.license.spdx_id ?? repo.license.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(repo.updated_at)}</span>
        </div>
      </div>
    </article>
  );
}