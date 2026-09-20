import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { TopProgressBar } from "./components/TopProgressBar";
import { SearchPage } from "./pages/SearchPage";
import { UserProfile } from "./pages/UserProfile";
import { RepoDetail } from "./pages/RepoDetail";
import { NotFound } from "./pages/NotFound";

function Shell() {
  const location = useLocation();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(true);
    const t = setTimeout(() => setNavigating(false), 250);
    return () => clearTimeout(t);
  }, [location.pathname]);

  function focusSearch() {
    const input = document.querySelector<HTMLInputElement>("#search-user-input");
    if (input) {
      input.focus();
      input.select();
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="dot-grid-canvas" aria-hidden />

      <TopProgressBar isLoading={navigating} />
      <Header onQuickSearch={focusSearch} />

      <main className="relative z-10 flex-1 w-full">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/repo/:owner/:repo" element={<RepoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="relative z-10 border-t border-[var(--border)] py-5 text-center text-xs text-[var(--text-dim)]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GitAtlas</span>
          <span>Data from the GitHub public API</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}