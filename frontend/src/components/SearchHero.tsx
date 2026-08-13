import { useState } from "react";
import type { FormEvent } from "react";

interface SearchHeroProps {
  query: string;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onSearch: (event: FormEvent) => void;
}

const suggestions = [
  "Find Rust developers with PostgreSQL experience",
  "Find Rust developers in fintech",
  "Find developers who worked on Invoice SaaS",
  "Find developers with Axum experience",
  "Find developers connected through shared projects",
];

export function SearchHero({
  query,
  loading,
  onQueryChange,
  onSearch,
}: SearchHeroProps) {
  const [focused, setFocused] = useState(false);

  const visibleSuggestions =
    query.trim().length === 0
      ? suggestions
      : suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <section className="hero">
      <div className="brand-mark">DG</div>

      <p className="eyebrow">DEVGRAPH</p>

      <h1>
        Discover developers
        <span> through their connections.</span>
      </h1>

      <p className="subtitle">
        Explore skills, projects, technologies and professional
        connections in one developer graph.
      </p>

      <div className="search-wrapper">
        <form onSubmit={onSearch} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">⌕</span>

            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                // Give click events time to fire before hiding.
                setTimeout(() => setFocused(false), 120);
              }}
              placeholder="Find Rust developers with PostgreSQL experience..."
            />
          </div>

          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {focused && visibleSuggestions.length > 0 && (
          <div className="suggestions">
            <div className="suggestions-label">Suggested searches</div>

            {visibleSuggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                className="suggestion-item"
                onClick={() => {
                  onQueryChange(suggestion);
                  setFocused(false);
                }}
              >
                <span className="suggestion-icon">↗</span>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}