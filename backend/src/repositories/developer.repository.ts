import { driver } from "../db/neo4j";

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


export async function findDeveloperById(id: string) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer {id: $id})

      OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
      OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)
      OPTIONAL MATCH (d)-[:WORKS_AT]->(c:Company)
      OPTIONAL MATCH (d)-[:HAS_DOMAIN_EXPERIENCE]->(domain:Domain)

      RETURN
        d.id AS id,
        d.name AS name,
        d.title AS title,
        d.location AS location,
        d.yearsExperience AS yearsExperience,
        collect(DISTINCT s.name) AS skills,
        collect(DISTINCT {
          id: p.id,
          name: p.name,
          description: p.description
        }) AS projects,
        collect(DISTINCT c.name) AS companies,
        collect(DISTINCT domain.name) AS domains
      `,
      { id },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      id: record.get("id"),
      name: record.get("name"),
      title: record.get("title"),
      location: record.get("location"),
      yearsExperience: record.get("yearsExperience"),
      skills: record.get("skills").filter(Boolean),
      projects: record.get("projects").filter((project: unknown) => {
        return project && typeof project === "object" && "id" in project;
      }),
      companies: record.get("companies").filter(Boolean),
      domains: record.get("domains").filter(Boolean),
    };
  } finally {
    await session.close();
  }
}


export async function findDeveloperConnections(id: string) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (target:Developer {id: $id})
            -[:WORKED_ON]->(p:Project)
            <-[:WORKED_ON]-(other:Developer)

      WHERE other.id <> target.id

      RETURN DISTINCT
        other.id AS id,
        other.name AS name,
        other.title AS title,
        collect(DISTINCT p.name) AS sharedProjects

      ORDER BY other.name
      `,
      { id },
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      title: record.get("title"),
      sharedProjects: record.get("sharedProjects"),
    }));
  } finally {
    await session.close();
  }
}