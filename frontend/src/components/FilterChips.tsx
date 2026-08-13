interface FilterChipsProps {
  skills: string[];
  domains: string[];
  technologies?: string[];
  projects?: string[];
  companies?: string[];
}

export function FilterChips({
  skills,
  domains,
  technologies = [],
  projects = [],
  companies = [],
}: FilterChipsProps) {
  const filters = [
    ...skills,
    ...domains,
    ...technologies,
    ...projects,
    ...companies,
  ];

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="filters">
      {filters.map((filter) => (
        <span key={filter} className="filter-chip">
          {filter}
        </span>
      ))}
    </div>
  );
}