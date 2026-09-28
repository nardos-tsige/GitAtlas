import { useEffect, useRef, useState } from "react";
import { fetchGitHub } from "../utils/githubApi";

export interface SearchUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

interface SearchResponse {
  items: SearchUser[];
}

const cache = new Map<string, SearchUser[]>();
const MAX_CACHE = 30;

function delayFor(query: string): number {
  if (query.length <= 3) return 120;
  if (query.length <= 6) return 200;
  return 300;
}

export function useUserSearch(query: string) {
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const latest = useRef("");

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const cached = cache.get(trimmed);
    if (cached) {
      setResults(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    latest.current = trimmed;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const data = await fetchGitHub<SearchResponse>(
          `/search/users?q=${encodeURIComponent(trimmed)}&per_page=6`
        );
        const items = data.items ?? [];

        if (latest.current === trimmed) {
          cache.set(trimmed, items);
          if (cache.size > MAX_CACHE) {
            const oldest = cache.keys().next().value;
            if (oldest) cache.delete(oldest);
          }
        }

        if (!cancelled) setResults(items);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, delayFor(trimmed));

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}