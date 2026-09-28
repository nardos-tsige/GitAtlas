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

export function useUserSearch(query: string) {
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    //don't search for short or empty queries.
    //the GitHub /search/users endpoint rejects queries under 2 chars
    //and we don't want to burn rate limit on single letters.
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;

    //debounce: wait 300ms after the user stops typing before firing.
    const timer = setTimeout(async () => {
      try {
        const data = await fetchGitHub<SearchResponse>(
          `/search/users?q=${encodeURIComponent(trimmed)}&per_page=6`
        );
        if (!cancelled) {
          setResults(data.items ?? []);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}