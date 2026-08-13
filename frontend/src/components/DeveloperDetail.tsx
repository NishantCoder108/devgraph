import type {
  Connection,
  DeveloperDetail as DeveloperDetailType,
} from "../types/developer";

interface DeveloperDetailProps {
  developer: DeveloperDetailType;
  connections: Connection[];
  onBack: () => void;
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
        <div className="profile-avatar">{developer.name.charAt(0)}</div>

        <div>
          <p className="eyebrow">DEVELOPER PROFILE</p>

          <h2>{developer.name}</h2>

          <p className="profile-title">{developer.title}</p>

          <p className="meta">
            {developer.location} · {developer.yearsExperience} years experience
          </p>
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
          {developer.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPERIENCE</p>
            <h3>Projects</h3>
          </div>
        </div>

        <div className="project-grid">
          {developer.projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-icon">↗</div>

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

              <div className="project-context">
                {project.domain && <span>{project.domain}</span>}
                {project.company && <span>{project.company}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="detail-columns">
        <div className="detail-section compact">
          <p className="eyebrow">DOMAIN</p>
          <h3>Domain experience</h3>

          <div className="skills">
            {developer?.domains?.map((domain) => (
              <span key={domain}>{domain}</span>
            ))}
          </div>
        </div>

        <div className="detail-section compact">
          <p className="eyebrow">COMPANY</p>
          <h3>Worked at</h3>

          <div className="skills">
            {developer?.companies?.map((company) => (
              <span key={company}>{company}</span>
            ))}
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

        {connections.length === 0 ? (
          <div className="connection-empty">
            No shared-project connections found.
          </div>
        ) : (
          <div className="connection-list">
            {connections.map((connection) => (
              <div key={connection.id} className="connection-card">
                <div className="avatar small">{connection.name.charAt(0)}</div>

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
