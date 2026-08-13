import { FormEvent, useState } from "react";

interface Developer {
  id: string;
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  matchedSkills: string[];
}

interface SearchResult {
  query: string;
  filters: {
    skills: string[];
    technologies: string[];
    domains: string[];
    projects: string[];
    companies: string[];
  };
  developers: Developer[];
  total: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface DeveloperDetail {
  id: string;
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  skills: string[];
  projects: Project[];
  companies: string[];
  domains: string[];
}

interface Connection {
  id: string;
  name: string;
  title: string;
  sharedProjects: string[];
}

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string | null>(
    null,
  );
  const [developerDetail, setDeveloperDetail] =
    useState<DeveloperDetail | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setError("Unable to search the developer network.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeveloperClick(id: string) {
    setSelectedDeveloperId(id);
    setDeveloperDetail(null);
    setConnections([]);

    try {
      const [detailResponse, connectionResponse] = await Promise.all([
        fetch(`http://localhost:3000/api/developers/${id}`),
        fetch(`http://localhost:3000/api/developers/${id}/connections`),
      ]);

      if (!detailResponse.ok || !connectionResponse.ok) {
        throw new Error("Failed to load developer");
      }

      const detailData = await detailResponse.json();
      const connectionData = await connectionResponse.json();

      setDeveloperDetail(detailData.result);
      setConnections(connectionData.result);
    } catch (error) {
      console.error(error);
      setError("Unable to load developer details.");
    }
  }
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">DEVGRAPH</p>

        <h1>Discover developers through their connections.</h1>

        <p className="subtitle">
          Search skills, projects and experience across the developer network.
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find Rust developers with PostgreSQL experience in fintech..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {error && (
        <section className="state error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </section>
      )}

      {loading && (
        <section className="state">
          <p>Searching the developer network...</p>
        </section>
      )}

      {!loading && result && (
        <section className="results">
          <div className="results-header">
            <div>
              <p className="eyebrow">SEARCH RESULTS</p>
              <h2>
                {result.total} developer{result.total !== 1 ? "s" : ""} found
              </h2>
            </div>

            <div className="filters">
              {result.filters.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}

              {result.filters.domains.map((domain) => (
                <span key={domain}>{domain}</span>
              ))}
            </div>
          </div>

          {result.developers.length === 0 ? (
            <div className="state">
              <h3>No developers found</h3>
              <p>Try fewer skills or another domain.</p>
            </div>
          ) : (
            <div className="developer-grid">
              {result.developers.map((developer) => (
                <article
                  key={developer.id}
                  className="developer-card"
                  onClick={() => handleDeveloperClick(developer.id)}
                >
                  <div className="avatar">{developer.name.charAt(0)}</div>

                  <h3>{developer.name}</h3>
                  <p className="title">{developer.title}</p>

                  <p className="meta">
                    {developer.location} · {developer.yearsExperience} years
                  </p>

                  <div className="skills">
                    {developer.matchedSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {developerDetail && (
        <section className="developer-detail">
          <button onClick={() => setDeveloperDetail(null)}>
            ← Back to results
          </button>

          <div className="detail-header">
            <div className="avatar">{developerDetail.name.charAt(0)}</div>

            <div>
              <p className="eyebrow">DEVELOPER</p>
              <h2>{developerDetail.name}</h2>
              <p className="title">{developerDetail.title}</p>
              <p className="meta">
                {developerDetail.location} · {developerDetail.yearsExperience}{" "}
                years experience
              </p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Skills</h3>

            <div className="skills">
              {developerDetail.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Projects</h3>

            <div className="developer-grid">
              {developerDetail.projects.map((project) => (
                <article key={project.id} className="developer-card">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Domain experience</h3>

            <div className="skills">
              {developerDetail.domains.map((domain) => (
                <span key={domain}>{domain}</span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Connected developers</h3>

            {connections.length === 0 ? (
              <p>No shared-project connections found.</p>
            ) : (
              <div className="developer-grid">
                {connections.map((connection) => (
                  <article key={connection.id} className="developer-card">
                    <h3>{connection.name}</h3>
                    <p className="title">{connection.title}</p>

                    <p className="meta">
                      Shared projects: {connection.sharedProjects.join(", ")}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
