import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Calendar,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  GitFork,
  Scale,
  Star,
  Terminal,
  AlertCircle,
} from "lucide-react";
import type { GitHubReadme, GitHubRepo } from "../types/github";
import { fetchGitHub, GitHubApiError } from "../utils/githubApi";
import { ReadmeSkeleton } from "../components/SkeletonLoader";
import { NotFound } from "./NotFound";

function decodeBase64(input: string): string {
  const binary = atob(input.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}


export function RepoDetail() {
  const { owner, repo: repoName } = useParams<{ owner: string; repo: string }>();

  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeName, setReadmeName] = useState("README.md");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!owner || !repoName) return;

    let cancelled = false;
    setLoading(true);
    setStatus(null);

    async function load() {
      try {
        const data = await fetchGitHub<GitHubRepo>(`/repos/${owner}/${repoName}`);
        if (cancelled) return;
        setRepo(data);
      } catch (err) {
        if (cancelled) return;
        setStatus(err instanceof GitHubApiError ? err.status : 500);
        setLoading(false);
        return;
      }

      try {
        const md = await fetchGitHub<GitHubReadme>(
          `/repos/${owner}/${repoName}/readme`
        );
        if (cancelled) return;
        setReadme(decodeBase64(md.content));
        setReadmeName(md.name || "README.md");
      } catch {
        // no README — that's fine
      }

      if (!cancelled) setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [owner, repoName]);

  async function copyClone() {
    if (!repo) return;
    try {
      await navigator.clipboard.writeText(`git clone ${repo.clone_url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard denied
    }
  }

  if (status === 404) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <NotFound kind="repo" term={`${owner}/${repoName}`} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border)] text-xs">
        <div className="flex items-center gap-3">
          <Link
            to={owner ? `/user/${owner}` : "/"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <span className="text-[var(--text-dim)]">
            {owner}/<span className="text-[var(--text-primary)]">{repoName}</span>
          </span>
        </div>

        {repo && (
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] font-semibold hover:opacity-85 transition-opacity"
          >
            View on GitHub
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {loading && !repo ? (
        <RepoHeaderSkeleton />
      ) : repo ? (
        <RepoHeader repo={repo} copied={copied} onCopy={copyClone} />
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <FileText className="w-4 h-4" />
            <span>{readmeName}</span>
          </div>
        </div>

        {loading && repo && readme === null ? (
          <ReadmeSkeleton />
        ) : readme ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8">
            <div className="markdown-body">
              <Markdown remarkPlugins={[remarkGfm]}>{readme}</Markdown>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-10 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              No README found.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function RepoHeader({
  repo,
  copied,
  onCopy,
}: {
  repo: GitHubRepo;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {repo.full_name}
          </h1>
          {repo.fork && (
            <span className="text-[10px] uppercase border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-dim)]">
              fork
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {repo.description ?? "No description provided."}
        </p>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[var(--border)]">
        <Metric icon={<Star className="w-3.5 h-3.5" />} label="Stars" value={repo.stargazers_count} />
        <Metric icon={<GitFork className="w-3.5 h-3.5" />} label="Forks" value={repo.forks_count} />
        <Metric icon={<Eye className="w-3.5 h-3.5" />} label="Watchers" value={repo.watchers_count} />
        <Metric icon={<AlertCircle className="w-3.5 h-3.5" />} label="Issues" value={repo.open_issues_count} />
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-dim)]">
          {repo.language && (
            <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
              <Code2 className="w-3.5 h-3.5" />
              {repo.language}
            </span>
          )}
          {repo.default_branch && (
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              {repo.default_branch}
            </span>
          )}
          {repo.license && (
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              {repo.license.spdx_id ?? repo.license.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Updated {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs">
          <Terminal className="w-3.5 h-3.5 text-[var(--text-dim)] mr-2 shrink-0" />
          <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px] sm:max-w-[280px]">
            git clone {repo.clone_url}
          </span>
          <button
            type="button"
            onClick={onCopy}
            title="Copy clone command"
            className="ml-2 p-1 text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-dim)] mb-1 uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold text-[var(--text-primary)]">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function RepoHeaderSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 space-y-4">
      <div className="h-6 w-60 skeleton-shimmer rounded" />
      <div className="h-4 w-full skeleton-shimmer rounded" />
      <div className="grid grid-cols-4 gap-3 pt-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 skeleton-shimmer rounded-lg" />
        ))}
      </div>
    </div>
  );
}