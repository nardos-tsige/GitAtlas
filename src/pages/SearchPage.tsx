import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { SearchHistory } from "../components/SearchHistory";
import { useSearchHistory } from "../hooks/useSearchHistory";

const FEATURED = [
  { login: "torvalds", name: "Linus Torvalds", role: "Linux kernel, Git" },
  { login: "gaearon", name: "Dan Abramov", role: "React, Redux" },
  { login: "antfu", name: "Anthony Fu", role: "Vue, Vite, Nuxt" },
  { login: "shadcn", name: "shadcn", role: "shadcn/ui" },
  { login: "sindresorhus", name: "Sindre Sorhus", role: "npm, CLI tooling" },
  { login: "tj", name: "TJ Holowaychuk", role: "Express, Koa" },
];

export function SearchPage() {
  const navigate = useNavigate();
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();

  function search(raw: string) {
    const name = raw.trim().replace(/^@/, "");
    if (!name) return;
    addSearch(name);
    navigate(`/user/${name}`);
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          <img src="/favicon.svg" alt="" className="w-10 h-10 sm:w-11 sm:h-11" />
          <span>GitAtlas</span>
          <span className="animate-cursor">_</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
          Look up any GitHub user, browse their repositories, and read READMEs.
        </p>
      </div>

      <div className="space-y-4">
        <SearchBar onSearch={search} />
        <SearchHistory
          items={history}
          onSelect={search}
          onRemove={removeSearch}
          onClear={clearHistory}
        />
      </div>

      <section className="pt-6 border-t border-[var(--border)] space-y-3">
        <h2 className="text-xs uppercase tracking-wide text-[var(--text-dim)]">
          Some people to try
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURED.map((dev) => (
            <button
              key={dev.login}
              type="button"
              onClick={() => search(dev.login)}
              className="group p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--text-primary)] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  @{dev.login}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-dim)] group-hover:text-[var(--text-primary)] transition-colors" />
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate">
                {dev.name}
              </div>
              <div className="text-[10px] text-[var(--text-dim)] truncate">
                {dev.role}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}