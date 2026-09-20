import type { RateLimitInfo } from "../types/github";

const API_BASE = "https://api.github.com";
const TOKEN_KEY = "gitatlas:token";

let currentRateLimit: RateLimitInfo = {
  limit: 60,
  remaining: 60,
  reset: Math.floor(Date.now() / 1000) + 3600,
  used: 0,
};

type Listener = (info: RateLimitInfo) => void;
const listeners = new Set<Listener>();

export function subscribeToRateLimit(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentRateLimit);
  return () => listeners.delete(listener);
}

function emitRateLimit(): void {
  listeners.forEach((fn) => fn(currentRateLimit));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token.trim());
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function readRateLimit(headers: Headers): void {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");
  const used = headers.get("x-ratelimit-used");

  if (!limit || !remaining) return;

  currentRateLimit = {
    limit: Number(limit),
    remaining: Number(remaining),
    reset: reset ? Number(reset) : currentRateLimit.reset,
    used: used ? Number(used) : currentRateLimit.limit - Number(remaining),
  };

  emitRateLimit();
}

export class GitHubApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

export async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { headers });
  readRateLimit(response.headers);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // response body wasn't JSON — keep default message
    }
    throw new GitHubApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function refreshRateLimit(): Promise<void> {
  try {
    const data = await fetchGitHub<{
      resources: { core: RateLimitInfo };
    }>("/rate_limit");
    currentRateLimit = data.resources.core;
    emitRateLimit();
  } catch {
    // rate limit check failed — keep whatever we already have
  }
}