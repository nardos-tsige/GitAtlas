import { useState } from "react";
import {
  Building2,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  MapPin,
  Twitter,
} from "lucide-react";
import type { GitHubUser } from "../types/github";

interface UserCardProps {
  user: GitHubUser;
}

export function UserCard({ user }: UserCardProps) {
  const [copied, setCopied] = useState(false);

  const joined = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  async function copyProfileUrl() {
    try {
      await navigator.clipboard.writeText(user.html_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard denied — do nothing
    }
  }

  const blogHref = user.blog
    ? user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`
    : null;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-xl border border-[var(--border)] object-cover bg-[var(--surface)]"
          />

          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                {user.name ?? user.login}
              </h2>
              {user.name && (
                <span className="text-xs text-[var(--text-dim)]">
                  @{user.login}
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--text-dim)] mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {joined}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={copyProfileUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy link"}</span>
          </button>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-85 text-xs font-semibold transition-opacity"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {user.bio && (
        <p className="py-4 border-b border-[var(--border)] text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
          {user.bio}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[var(--border)]">
        <Stat label="Repositories" value={user.public_repos} />
        <Stat label="Followers" value={user.followers} />
        <Stat label="Following" value={user.following} />
        <Stat label="Gists" value={user.public_gists} />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 pt-4 text-xs">
        {user.location && (
          <Detail icon={<MapPin className="w-3.5 h-3.5" />} text={user.location} />
        )}
        {user.company && (
          <Detail icon={<Building2 className="w-3.5 h-3.5" />} text={user.company} />
        )}
        {blogHref && (
          <Detail
            icon={<LinkIcon className="w-3.5 h-3.5" />}
            href={blogHref}
            text={blogHref.replace(/^https?:\/\//, "")}
          />
        )}
        {user.twitter_username && (
          <Detail
            icon={<Twitter className="w-3.5 h-3.5" />}
            href={`https://twitter.com/${user.twitter_username}`}
            text={`@${user.twitter_username}`}
          />
        )}
      </dl>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="text-[10px] text-[var(--text-dim)] mb-1 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function Detail({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}) {
  const body = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="truncate text-[var(--text-primary)] underline underline-offset-2 hover:opacity-75"
    >
      {text}
    </a>
  ) : (
    <span className="truncate">{text}</span>
  );

  return (
    <div className="flex items-center gap-2 text-[var(--text-muted)]">
      <span className="text-[var(--text-dim)] shrink-0">{icon}</span>
      {body}
    </div>
  );
}