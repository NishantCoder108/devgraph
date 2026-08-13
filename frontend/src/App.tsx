import { useState } from "react";
import type { FormEvent } from "react";
import {
  getDeveloper,
  getDeveloperConnections,
  searchDevelopers,
} from "./api/client";
import { DeveloperDetail } from "./components/DeveloperDetail";
import { SearchHero } from "./components/SearchHero";
import { SearchResults } from "./components/SearchResults";
import type {
  Connection,
  DeveloperDetail as DeveloperDetailType,
  SearchResult,
} from "./types/developer";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [developerDetail, setDeveloperDetail] =
    useState<DeveloperDetailType | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setDeveloperDetail(null);

    try {
      const data = await searchDevelopers(query.trim());
      setResult(data);
    } catch (error) {
      console.error(error);
      setError("Unable to search the developer network.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeveloperClick(id: string) {
    setDetailLoading(true);
    setError("");

    try {
      const [developer, developerConnections] = await Promise.all([
        getDeveloper(id),
        getDeveloperConnections(id),
      ]);

      setDeveloperDetail(developer);
      setConnections(developerConnections);
    } catch (error) {
      console.error(error);
      setError("Unable to load developer details.");
    } finally {
      setDetailLoading(false);
    }
  }

  function handleBack() {
    setDeveloperDetail(null);
    setConnections([]);
    setError("");
  }

  return (
    <main>
      <SearchHero
        query={query}
        loading={loading}
        onQueryChange={setQuery}
        onSearch={handleSearch}
      />

      {error && (
        <section className="state error-state">
          <div className="state-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </section>
      )}

      {loading && (
        <section className="state">
          <div className="loader" />
          <h3>Searching the developer network...</h3>
          <p>Following skills, projects and domain connections.</p>
        </section>
      )}

      {!loading && !developerDetail && result && (
        <SearchResults
          result={result}
          onDeveloperClick={handleDeveloperClick}
        />
      )}

      {detailLoading && (
        <section className="state">
          <div className="loader" />
          <h3>Exploring developer connections...</h3>
        </section>
      )}

      {!detailLoading && developerDetail && (
        <DeveloperDetail
          developer={developerDetail}
          connections={connections}
          onBack={handleBack}
        />
      )}
    </main>
  );
}

export default App;