import type { SearchResult } from "../types/developer";
import { DeveloperCard } from "./DeveloperCard";
import { FilterChips } from "./FilterChips";

interface SearchResultsProps {
  result: SearchResult;
  onDeveloperClick: (id: string) => void;
}

export function SearchResults({
  result,
  onDeveloperClick,
}: SearchResultsProps) {
  const filterCount = Object.values(result.filters).reduce(
    (count, filters) => count + filters.length,
    0,
  );

  return (
    <section className="results">
      <div className="results-header">
        <div>
          <p className="eyebrow">SEARCH RESULTS</p>

          <h2>
            {result.total} developer
            {result.total !== 1 ? "s" : ""} found
          </h2>

          <p className="result-query">“{result.query}”</p>
        </div>

        <div className="result-summary">
          <span>{filterCount} graph filters</span>
          <strong>{result.developers.length} profiles shown</strong>
        </div>
      </div>

      <FilterChips
        skills={result.filters.skills}
        domains={result.filters.domains}
        technologies={result.filters.technologies}
        projects={result.filters.projects}
        companies={result.filters.companies}
      />

      {result.developers.length === 0 ? (
        <div className="state">
          <div className="state-icon">⌕</div>
          <h3>No developers found</h3>
          <p>
            Try fewer skills, another technology, or a different
            domain.
          </p>
        </div>
      ) : (
        <div className="developer-grid">
          {result.developers.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              onClick={onDeveloperClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}
