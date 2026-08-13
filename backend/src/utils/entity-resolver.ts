import { driver } from "../db/neo4j.js";

export interface SearchFilters {
  skills: string[];
  technologies: string[];
  domains: string[];
  projects: string[];
  companies: string[];
}

export async function resolveEntities(
  query: string,
): Promise<SearchFilters> {
  const session = driver.session();

  try {
    const skillsResult = await session.run(`
      MATCH (s:Skill)
      RETURN s.name AS name
      ORDER BY s.name
    `);

    const domainsResult = await session.run(`
      MATCH (d:Domain)
      RETURN d.name AS name
      ORDER BY d.name
    `);

    const skills = skillsResult.records.map((record) =>
      String(record.get("name"))
    );

    const domains = domainsResult.records.map((record) =>
      String(record.get("name"))
    );

    const normalizedQuery = query.toLowerCase();

    return {
      skills: skills.filter((skill) =>
        normalizedQuery.includes(skill.toLowerCase())
      ),
      technologies: [],
      domains: domains.filter((domain) =>
        normalizedQuery.includes(domain.toLowerCase())
      ),
      projects: [],
      companies: [],
    };
  } finally {
    await session.close();
  }
}