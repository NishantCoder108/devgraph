import { driver } from "../db/neo4j.js";

export interface SearchFilters {
  skills: string[];
  technologies: string[];
  domains: string[];
  projects: string[];
  companies: string[];
}

interface EntityNames {
  skills: string[];
  technologies: string[];
  domains: string[];
  projects: string[];
  companies: string[];
}

export async function resolveEntities(query: string): Promise<SearchFilters> {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)
      WHERE n:Skill
         OR n:Technology
         OR n:Domain
         OR n:Project
         OR n:Company

      RETURN
        CASE
          WHEN n:Skill THEN "Skill"
          WHEN n:Technology THEN "Technology"
          WHEN n:Domain THEN "Domain"
          WHEN n:Project THEN "Project"
          WHEN n:Company THEN "Company"
        END AS type,
        n.name AS name
      ORDER BY type, name
    `);

    const entities: EntityNames = {
      skills: [],
      technologies: [],
      domains: [],
      projects: [],
      companies: [],
    };

    for (const record of result.records) {
      const type = String(record.get("type"));
      const name = String(record.get("name"));

      switch (type) {
        case "Skill":
          entities.skills.push(name);
          break;

        case "Technology":
          entities.technologies.push(name);
          break;

        case "Domain":
          entities.domains.push(name);
          break;

        case "Project":
          entities.projects.push(name);
          break;

        case "Company":
          entities.companies.push(name);
          break;
      }
    }

    const normalizedQuery = query.toLowerCase();

    return {
      skills: entities.skills.filter((name) =>
        normalizedQuery.includes(name.toLowerCase()),
      ),

      technologies: entities.technologies.filter((name) =>
        normalizedQuery.includes(name.toLowerCase()),
      ),

      domains: entities.domains.filter((name) =>
        normalizedQuery.includes(name.toLowerCase()),
      ),

      projects: entities.projects.filter((name) =>
        normalizedQuery.includes(name.toLowerCase()),
      ),

      companies: entities.companies.filter((name) =>
        normalizedQuery.includes(name.toLowerCase()),
      ),
    };
  } finally {
    await session.close();
  }
}
