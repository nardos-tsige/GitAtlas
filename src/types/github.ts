export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepoOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  topics?: string[];
  license: GitHubLicense | null;
  owner: GitHubRepoOwner;
}

export interface GitHubReadme {
  name: string;
  path: string;
  content: string;
  encoding: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface SearchHistoryItem {
  username: string;
  timestamp: number;
  avatar_url?: string;
}

export type RepoSortOption = "updated" | "stars" | "forks" | "name";

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}