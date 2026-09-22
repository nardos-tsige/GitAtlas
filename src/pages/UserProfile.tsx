import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useGitHubUser } from "../hooks/useGitHubUser";
import { useGitHubRepos } from "../hooks/useGitHubRepos";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { UserCard } from "../components/UserCard";
import { RepoList } from "../components/RepoList";
import { SearchBar } from "../components/SearchBar";
import { UserCardSkeleton } from "../components/SkeletonLoader";
import { NotFound } from "./NotFound";

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { addSearch } = useSearchHistory();

  const user = useGitHubUser(username);
  const repos = useGitHubRepos(username);

  useEffect(() => {
    if (user.data) addSearch(user.data.login, user.data.avatar_url);
  }, [user.data, addSearch]);

  function jumpTo(raw: string) {
    const name = raw.trim().replace(/^@/, "");
    if (name && name.toLowerCase() !== username?.toLowerCase()) {
      navigate(`/user/${name}`);
    }
  }

  function refresh() {
    user.refetch();
    repos.refetch();
  }

  if (user.status === 404) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to search
        </Link>
        <NotFound kind="user" term={username} />
      </div>
    );
  }

  if (user.status === 403) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center space-y-3">
          <h2 className="font-semibold text-[var(--text-primary)]">
            GitHub rate limit reached
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Anonymous requests are capped at 60/hour. Wait for the reset, or add a
            personal access token from the header.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    );
  }

  const busy = user.loading || repos.loading;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Search
        </Link>

        <div className="flex items-center gap-2 flex-1 sm:max-w-md justify-end">
          <SearchBar
            placeholder="Jump to another user…"
            onSearch={jumpTo}
            autoFocusKey={false}
          />
          <button
            type="button"
            onClick={refresh}
            title="Refresh"
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {user.loading && !user.data ? (
        <UserCardSkeleton />
      ) : user.data ? (
        <UserCard user={user.data} />
      ) : null}

      {user.data && (
        <RepoList
          repos={repos.data ?? []}
          loading={repos.loading && !repos.data}
        />
      )}
    </div>
  );
}