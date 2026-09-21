import { useCallback, useEffect, useState } from "react";
import type { SearchHistoryItem } from "../types/github";

const STORAGE_KEY = "gitatlas:history";
const MAX_ITEMS = 12;

function readHistory(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>(readHistory);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [history]);

  const addSearch = useCallback((username: string, avatar_url?: string) => {
    const name = username.trim().toLowerCase();
    if (!name) return;

    setHistory((prev) => {
      const without = prev.filter((item) => item.username !== name);
      const entry: SearchHistoryItem = { username: name, timestamp: Date.now() };
      if (avatar_url) entry.avatar_url = avatar_url;
      return [entry, ...without].slice(0, MAX_ITEMS);
    });
  }, []);

  const removeSearch = useCallback((username: string) => {
    const name = username.trim().toLowerCase();
    setHistory((prev) => prev.filter((item) => item.username !== name));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addSearch, removeSearch, clearHistory };
}