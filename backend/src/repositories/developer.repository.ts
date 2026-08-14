import { driver } from "../db/neo4j.js";

export interface DeveloperSearchFilters {
  skills: string[];
  domains: string[];
}

export interface DeveloperSearchFilters {
  skills: string[];
  technologies: string[];
  domains: string[];
  projects: string[];
  companies: string[];
}

export async function findDevelopersByFilters(
  filters: DeveloperSearchFilters,
) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer)

      OPTIONAL MATCH (d)-[:HAS_SKILL]->(skill:Skill)

      OPTIONAL MATCH (d)-[:WORKED_ON]->(project:Project)

      OPTIONAL MATCH (project)-[:USES]->(technology:Technology)

      OPTIONAL MATCH (project)-[:IN_DOMAIN]->(domain:Domain)

      OPTIONAL MATCH (project)-[:FOR_COMPANY]->(company:Company)

      WITH
        d,
        collect(DISTINCT skill.name) AS developerSkills,
        collect(DISTINCT project.name) AS projectNames,
        collect(DISTINCT technology.name) AS technologyNames,
        collect(DISTINCT domain.name) AS domainNames,
        collect(DISTINCT company.name) AS companyNames

      WHERE
        (
          size($skills) = 0
          OR all(skill IN $skills WHERE skill IN developerSkills)
        )
        AND
        (
          size($technologies) = 0
          OR all(technology IN $technologies WHERE technology IN technologyNames)
        )
        AND
        (
          size($domains) = 0
          OR any(domain IN $domains WHERE domain IN domainNames)
        )
        AND
        (
          size($projects) = 0
          OR any(project IN $projects WHERE project IN projectNames)
        )
        AND
        (
          size($companies) = 0
          OR any(company IN $companies WHERE company IN companyNames)
        )

      RETURN
        d.id AS id,
        d.name AS name,
        d.title AS title,
        d.location AS location,
        d.yearsExperience AS yearsExperience,
        [
          skill IN $skills
          WHERE skill IN developerSkills
        ] AS matchedSkills

      ORDER BY d.name
      `,
      {
        skills: filters.skills,
        technologies: filters.technologies,
        domains: filters.domains,
        projects: filters.projects,
        companies: filters.companies,
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
      OPTIONAL MATCH (p)-[:USES]->(t:Technology)
      OPTIONAL MATCH (p)-[:REQUIRES_SKILL]->(required:Skill)
      OPTIONAL MATCH (p)-[:IN_DOMAIN]->(domain:Domain)
      OPTIONAL MATCH (p)-[:FOR_COMPANY]->(company:Company)

      WITH
        d,
        collect(DISTINCT s.name) AS skills,
        p,
        collect(DISTINCT t.name) AS technologies,
        collect(DISTINCT required.name) AS requiredSkills,
        collect(DISTINCT domain.name)[0] AS domain,
        collect(DISTINCT company.name)[0] AS company

      WITH
        d,
        skills,
        collect(
          CASE
            WHEN p IS NULL THEN NULL
            ELSE {
              id: p.id,
              name: p.name,
              description: p.description,
              technologies: technologies,
              requiredSkills: requiredSkills,
              domain: domain,
              company: company
            }
          END
        ) AS projects

      RETURN
        d.id AS id,
        d.name AS name,
        d.title AS title,
        d.location AS location,
        d.yearsExperience AS yearsExperience,
        skills,
        [project IN projects WHERE project IS NOT NULL] AS projects
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
      projects: record.get("projects"),
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
