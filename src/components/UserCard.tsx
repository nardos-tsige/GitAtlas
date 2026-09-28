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
import { Typewriter } from "./Typewriter";
import { useCountUp } from "../hooks/useCountUp";

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
      // clipboard denied
    }
  }

  const blogHref = user.blog
    ? user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`
    : null;

  const displayName = user.name ?? user.login;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-xl border border-[var(--border)] object-cover bg-[var(--surface)] animate-fade-up"
          />

          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                <Typewriter text={displayName} speed={35} startDelay={150} />
              </h2>
              {user.name && (
                <span
                  className="text-xs text-[var(--text-dim)] animate-fade-up"
                  style={{ animationDelay: "700ms" }}
                >
                  @{user.login}
                </span>
              )}
            </div>

            <div className="mt-2 h-px bg-[var(--border)] overflow-hidden">
              <div className="h-full bg-[var(--text-primary)] animate-draw" />
            </div>

            <p
              className="text-xs text-[var(--text-dim)] mt-2 flex items-center gap-1.5 animate-fade-up"
              style={{ animationDelay: "900ms" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {joined}</span>
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 self-stretch sm:self-auto justify-end animate-fade-up"
          style={{ animationDelay: "1000ms" }}
        >
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
        <p
          className="py-4 border-b border-[var(--border)] text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line animate-fade-up"
          style={{ animationDelay: "1100ms" }}
        >
          {user.bio}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[var(--border)]">
        <Stat label="Repositories" value={user.public_repos} delay={1200} />
        <Stat label="Followers" value={user.followers} delay={1280} />
        <Stat label="Following" value={user.following} delay={1360} />
        <Stat label="Gists" value={user.public_gists} delay={1440} />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 pt-4 text-xs">
        {user.location && (
          <Detail
            icon={<MapPin className="w-3.5 h-3.5" />}
            text={user.location}
            delay={1550}
          />
        )}
        {user.company && (
          <Detail
            icon={<Building2 className="w-3.5 h-3.5" />}
            text={user.company}
            delay={1620}
          />
        )}
        {blogHref && (
          <Detail
            icon={<LinkIcon className="w-3.5 h-3.5" />}
            href={blogHref}
            text={blogHref.replace(/^https?:\/\//, "")}
            delay={1690}
          />
        )}
        {user.twitter_username && (
          <Detail
            icon={<Twitter className="w-3.5 h-3.5" />}
            href={`https://twitter.com/${user.twitter_username}`}
            text={`@${user.twitter_username}`}
            delay={1760}
          />
        )}
      </dl>
    </section>
  );
}

function Stat({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const display = useCountUp(value, 700);

  return (
    <div
      className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-[10px] text-[var(--text-dim)] mb-1 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
        {display.toLocaleString()}
      </div>
    </div>
  );
}

function Detail({
  icon,
  text,
  href,
  delay,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
  delay: number;
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
    <div
      className="flex items-center gap-2 text-[var(--text-muted)] animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-[var(--text-dim)] shrink-0">{icon}</span>
      {body}
    </div>
  );
}