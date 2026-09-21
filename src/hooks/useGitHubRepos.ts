import { useCallback, useEffect, useState } from "react";
import type { ApiState, GitHubRepo } from "../types/github";
import { fetchGitHub, GitHubApiError } from "../utils/githubApi";

export function useGitHubRepos(username: string | undefined) {
  const [state, setState] = useState<ApiState<GitHubRepo[]>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const load = useCallback(async (name: string) => {
    setState({ data: null, loading: true, error: null, status: null });

    try {
      const data = await fetchGitHub<GitHubRepo[]>(
        `/users/${name}/repos?per_page=100&sort=updated`
      );
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