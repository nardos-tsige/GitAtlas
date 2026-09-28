import { useEffect, useState } from "react";
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
const MAX_CACHE = 40;

function findInCache(query: string): SearchUser[] | null {
  const direct = cache.get(query);
  if (direct) return direct;

  for (const [key, value] of cache) {
    if (key.length > query.length && key.startsWith(query)) {
      return value.filter((u) =>
        u.login.toLowerCase().startsWith(query.toLowerCase())
      );
    }
  }
  return null;
}

export function useUserSearch(query: string) {
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const cached = findInCache(trimmed);
    if (cached) {
      setResults(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const data = await fetchGitHub<SearchResponse>(
          `/search/users?q=${encodeURIComponent(trimmed)}&per_page=8`
        );
        const items = data.items ?? [];

        cache.set(trimmed, items);
        if (cache.size > MAX_CACHE) {
          const oldest = cache.keys().next().value;
          if (oldest) cache.delete(oldest);
        }

        if (!cancelled) {
          setResults(items);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { results, loading };
}