import type { Developer } from "../types/developer";

interface DeveloperCardProps {
  developer: Developer;
  onClick: (id: string) => void;
}

export function DeveloperCard({
  developer,
  onClick,
}: DeveloperCardProps) {
  return (
    <button
      type="button"
      className="developer-card"
      onClick={() => onClick(developer.id)}
    >
      <div className="card-top">
        <div className="avatar">
          {developer.name.charAt(0)}
        </div>

        <span className="card-arrow">↗</span>
      </div>

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
    </button>
  );
}