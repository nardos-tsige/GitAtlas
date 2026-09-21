import { useEffect, useState } from "react";
import type { RateLimitInfo } from "../types/github";
import { refreshRateLimit, subscribeToRateLimit } from "../utils/githubApi";

export function useRateLimit() {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    limit: 60,
    remaining: 60,
    reset: Math.floor(Date.now() / 1000) + 3600,
    used: 0,
  });

  useEffect(() => {
    const unsubscribe = subscribeToRateLimit(setRateLimit);
    void refreshRateLimit();
    return unsubscribe;
  }, []);

  return { rateLimit, refresh: refreshRateLimit };
}