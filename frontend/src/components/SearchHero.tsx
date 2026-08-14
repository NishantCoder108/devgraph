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

const graphNodes = [
  { label: "Rust", tone: "teal" },
  { label: "PostgreSQL", tone: "blue" },
  { label: "Fintech", tone: "amber" },
  { label: "Invoice SaaS", tone: "rose" },
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
      <div className="hero-copy">
        <p className="eyebrow">GRAPH-POWERED TALENT SEARCH</p>

        <h1>
          Discover developers by the work, tools and teams around
          them.
        </h1>

        <p className="subtitle">
          Search natural language across skills, projects,
          technologies, companies and domain experience.
        </p>

        <div className="search-wrapper">
          <form onSubmit={onSearch} className="search-form" role="search">
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>

              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  // Give click events time to fire before hiding.
                  setTimeout(() => setFocused(false), 120);
                }}
                aria-label="Search developer graph"
                placeholder="Find Rust developers with PostgreSQL experience..."
              />
            </div>

            <button type="submit" disabled={loading || !query.trim()}>
              {loading ? "Searching" : "Search"}
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
                  <span className="suggestion-icon" aria-hidden="true">
                    ↗
                  </span>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hero-metrics" aria-label="Graph coverage">
          <span>Skills</span>
          <span>Projects</span>
          <span>Technologies</span>
          <span>Connections</span>
        </div>
      </div>

      <aside className="graph-preview" aria-label="Example graph signals">
        <div className="graph-preview-header">
          <span className="graph-kicker">Query signals</span>
          <span className="graph-badge">Live graph</span>
        </div>

        <div className="graph-canvas" aria-hidden="true">
          <div className="graph-line line-a" />
          <div className="graph-line line-b" />
          <div className="graph-line line-c" />

          <div className="graph-node node-main">
            <span>Dev</span>
            <strong>Matched profile</strong>
          </div>

          {graphNodes.map((node, index) => (
            <div
              key={node.label}
              className={`graph-node node-${index + 1} tone-${node.tone}`}
            >
              <span>{node.label.charAt(0)}</span>
              <strong>{node.label}</strong>
            </div>
          ))}
        </div>

        <div className="graph-list">
          <div>
            <span>Relationship path</span>
            <strong>Developer - Project - Technology</strong>
          </div>
          <div>
            <span>Ranked by</span>
            <strong>Skills, domains and shared work</strong>
          </div>
        </div>
      </aside>
    </section>
  );
}
