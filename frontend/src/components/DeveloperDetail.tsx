import type {
  Connection,
  DeveloperDetail as DeveloperDetailType,
} from "../types/developer";

interface DeveloperDetailProps {
  developer: DeveloperDetailType;
  connections: Connection[];
  onBack: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DeveloperDetail({
  developer,
  connections,
  onBack,
}: DeveloperDetailProps) {
  return (
    <section className="developer-detail">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back to results
      </button>

      <header className="profile-header">
        <div className="profile-avatar">{getInitials(developer.name)}</div>

        <div className="profile-copy">
          <p className="eyebrow">DEVELOPER PROFILE</p>

          <h2>{developer.name}</h2>

          <p className="profile-title">{developer.title}</p>

          <p className="meta">
            {developer.location} · {developer.yearsExperience} years experience
          </p>
        </div>

        <div className="profile-stats" aria-label="Profile graph summary">
          <span>
            <strong>{developer.skills.length}</strong>
            Skills
          </span>
          <span>
            <strong>{developer.projects.length}</strong>
            Projects
          </span>
          <span>
            <strong>{connections.length}</strong>
            Connections
          </span>
        </div>
      </header>

      <div className="detail-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CAPABILITIES</p>
            <h3>Skills</h3>
          </div>
        </div>

        <div className="skills">
          {developer.skills.length > 0 ? (
            developer.skills.map((skill) => <span key={skill}>{skill}</span>)
          ) : (
            <span>No skills listed</span>
          )}
        </div>
      </div>

      <div className="detail-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPERIENCE</p>
            <h3>Projects</h3>
          </div>
        </div>

        {developer.projects.length === 0 ? (
          <div className="connection-empty">No projects listed.</div>
        ) : (
          <div className="project-grid">
            {developer.projects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-card-top">
                  <div className="project-icon">↗</div>
                  <div className="project-context">
                    {project.domain && <span>{project.domain}</span>}
                    {project.company && <span>{project.company}</span>}
                  </div>
                </div>

                <h3>{project.name}</h3>

                <p>{project.description}</p>

                {project.technologies.length > 0 && (
                  <div className="project-meta">
                    <span className="project-label">Technologies</span>

                    <div className="skills">
                      {project.technologies.map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>
                  </div>
                )}

                {project.requiredSkills.length > 0 && (
                  <div className="project-meta">
                    <span className="project-label">Required skills</span>

                    <div className="skills">
                      {project.requiredSkills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="detail-columns">
        <div className="detail-section compact">
          <p className="eyebrow">DOMAIN</p>
          <h3>Domain experience</h3>

          <div className="skills">
            {developer.domains?.length > 0 ? (
              developer.domains?.map((domain) => (
                <span key={domain}>{domain}</span>
              ))
            ) : (
              <span>No domains listed</span>
            )}
          </div>
        </div>

        <div className="detail-section compact">
          <p className="eyebrow">COMPANY</p>
          <h3>Worked at</h3>

          <div className="skills">
            {developer.companies?.length > 0 ? (
              developer.companies?.map((company) => (
                <span key={company}>{company}</span>
              ))
            ) : (
              <span>No companies listed</span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GRAPH CONNECTIONS</p>
            <h3>Connected developers</h3>
          </div>
        </div>

        {connections?.length === 0 ? (
          <div className="connection-empty">
            No shared-project connections found.
          </div>
        ) : (
          <div className="connection-list">
            {connections?.map((connection) => (
              <div key={connection.id} className="connection-card">
                <div className="avatar small">{getInitials(connection.name)}</div>

                <div>
                  <h4>{connection.name}</h4>
                  <p>{connection.title}</p>
                  <span>Shared: {connection.sharedProjects.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
