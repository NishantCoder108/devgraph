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
    ...skills.map((value) => ({ value, label: "Skill" })),
    ...technologies.map((value) => ({ value, label: "Tech" })),
    ...domains.map((value) => ({ value, label: "Domain" })),
    ...projects.map((value) => ({ value, label: "Project" })),
    ...companies.map((value) => ({ value, label: "Company" })),
  ];

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="filters" aria-label="Applied graph filters">
      {filters.map((filter) => (
        <span
          key={`${filter.label}-${filter.value}`}
          className="filter-chip"
        >
          <small>{filter.label}</small>
          {filter.value}
        </span>
      ))}
    </div>
  );
}
