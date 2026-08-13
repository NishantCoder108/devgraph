import { driver } from "../db/neo4j.js";

export interface DeveloperSearchFilters {
  skills: string[];
  domains: string[];
}

export async function findDevelopersByFilters(
  filters: DeveloperSearchFilters,
) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer)-[:HAS_SKILL]->(s:Skill)
      MATCH (d)-[:WORKED_ON]->(p:Project)-[:IN_DOMAIN]->(domain:Domain)

      WHERE s.name IN $skills
        AND domain.name IN $domains

      WITH d, collect(DISTINCT s.name) AS matchedSkills
      WHERE size(matchedSkills) = size($skills)

      RETURN
        d.id AS id,
        d.name AS name,
        d.title AS title,
        d.location AS location,
        d.yearsExperience AS yearsExperience,
        matchedSkills
      ORDER BY d.name
      `,
      {
        skills: filters.skills,
        domains: filters.domains,
      },
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      title: record.get("title"),
      location: record.get("location"),
      yearsExperience: record.get("yearsExperience"),
      matchedSkills: record.get("matchedSkills"),
    }));
  } finally {
    await session.close();
  }
}