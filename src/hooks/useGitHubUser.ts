import { useCallback, useEffect, useState } from "react";
import type { ApiState, GitHubUser } from "../types/github";
import { fetchGitHub, GitHubApiError } from "../utils/githubApi";

export function useGitHubUser(username: string | undefined) {
  const [state, setState] = useState<ApiState<GitHubUser>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const load = useCallback(async (name: string) => {
    setState({ data: null, loading: true, error: null, status: null });

    try {
      const data = await fetchGitHub<GitHubUser>(`/users/${name}`);
      setState({ data, loading: false, error: null, status: 200 });
    } catch (err) {
      const status = err instanceof GitHubApiError ? err.status : 500;
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState({ data: null, loading: false, error: message, status });
    }
  }, []);

  useEffect(() => {
    const name = username?.trim();
    if (!name) {
      setState({ data: null, loading: false, error: null, status: null });
      return;
    }
    load(name);
  }, [username, load]);

  const refetch = useCallback(() => {
    const name = username?.trim();
    if (name) load(name);
  }, [username, load]);

  return { ...state, refetch };
}