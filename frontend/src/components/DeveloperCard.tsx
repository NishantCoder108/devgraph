import type { Developer } from "../types/developer";

interface DeveloperCardProps {
  developer: Developer;
  onClick: (id: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
      aria-label={`Open ${developer.name}'s profile`}
    >
      <div className="card-top">
        <div className="avatar">
          {getInitials(developer.name)}
        </div>

        <span className="card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <h3>{developer.name}</h3>

      <p className="title">{developer.title}</p>

      <p className="meta">
        {developer.location} · {developer.yearsExperience} years
      </p>

      <div className="card-footer">
        <div className="skills">
          {developer.matchedSkills.slice(0, 4).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        {developer.matchedSkills.length > 4 && (
          <span className="more-count">
            +{developer.matchedSkills.length - 4}
          </span>
        )}
      </div>
    </button>
  );
}
