import { driver } from "../src/db/neo4j.js";

const developers = [
  {
    id: "dev_001",
    name: "Nishant",
    title: "Backend Engineer",
    location: "India",
    yearsExperience: 4,
  },
  {
    id: "dev_002",
    name: "Rahul",
    title: "Full Stack Engineer",
    location: "India",
    yearsExperience: 5,
  },
  {
    id: "dev_003",
    name: "Priya",
    title: "Rust Engineer",
    location: "Singapore",
    yearsExperience: 3,
  },
  {
    id: "dev_004",
    name: "Amit",
    title: "Backend Engineer",
    location: "India",
    yearsExperience: 2,
  },
  {
    id: "dev_005",
    name: "Sara",
    title: "Platform Engineer",
    location: "Germany",
    yearsExperience: 6,
  },
];

const skills = [
  { id: "skill_001", name: "Rust", category: "Programming Language" },
  { id: "skill_002", name: "PostgreSQL", category: "Database" },
  { id: "skill_003", name: "TypeScript", category: "Programming Language" },
  { id: "skill_004", name: "System Design", category: "Engineering" },
  { id: "skill_005", name: "Database Design", category: "Engineering" },
  { id: "skill_006", name: "Distributed Systems", category: "Engineering" },
];

const technologies = [
  { id: "tech_001", name: "Axum", category: "Rust Framework" },
  { id: "tech_002", name: "Tokio", category: "Rust Runtime" },
  { id: "tech_003", name: "React", category: "Frontend" },
  { id: "tech_004", name: "Kafka", category: "Messaging" },
];

const domains = [
  { id: "domain_001", name: "Fintech" },
  { id: "domain_002", name: "E-commerce" },
  { id: "domain_003", name: "Developer Tools" },
];

const companies = [
  {
    id: "company_001",
    name: "Acme Technologies",
    industry: "Fintech",
  },
  {
    id: "company_002",
    name: "Orbit Commerce",
    industry: "E-commerce",
  },
  {
    id: "company_003",
    name: "DevWorks",
    industry: "Developer Tools",
  },
];

const projects = [
  {
    id: "project_001",
    name: "Invoice SaaS",
    description: "Billing and invoice management platform",
  },
  {
    id: "project_002",
    name: "Payment Platform",
    description: "Payment processing platform",
  },
  {
    id: "project_003",
    name: "Commerce Engine",
    description: "E-commerce order processing system",
  },
  {
    id: "project_004",
    name: "Developer Portal",
    description: "API documentation and developer platform",
  },
];

async function seed() {
  const session = driver.session();

  try {
    console.log("Clearing existing graph...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating nodes...");

    await session.run(
      `
      UNWIND $developers AS developer
      CREATE (d:Developer {
        id: developer.id,
        name: developer.name,
        title: developer.title,
        location: developer.location,
        yearsExperience: developer.yearsExperience
      })
      `,
      { developers },
    );

    await session.run(
      `
      UNWIND $skills AS skill
      CREATE (s:Skill {
        id: skill.id,
        name: skill.name,
        category: skill.category
      })
      `,
      { skills },
    );

    await session.run(
      `
      UNWIND $technologies AS technology
      CREATE (t:Technology {
        id: technology.id,
        name: technology.name,
        category: technology.category
      })
      `,
      { technologies },
    );

    await session.run(
      `
      UNWIND $domains AS domain
      CREATE (d:Domain {
        id: domain.id,
        name: domain.name
      })
      `,
      { domains },
    );

    await session.run(
      `
      UNWIND $companies AS company
      CREATE (c:Company {
        id: company.id,
        name: company.name,
        industry: company.industry
      })
      `,
      { companies },
    );

    await session.run(
      `
      UNWIND $projects AS project
      CREATE (p:Project {
        id: project.id,
        name: project.name,
        description: project.description
      })
      `,
      { projects },
    );

    console.log("Creating relationships...");

    const relationships = {
      developerSkills: [
        ["dev_001", "skill_001"],
        ["dev_001", "skill_002"],
        ["dev_001", "skill_004"],
        ["dev_001", "skill_005"],

        ["dev_002", "skill_003"],
        ["dev_002", "skill_002"],
        ["dev_002", "skill_004"],

        ["dev_003", "skill_001"],
        ["dev_003", "skill_002"],
        ["dev_003", "skill_006"],

        ["dev_004", "skill_003"],

        ["dev_005", "skill_001"],
        ["dev_005", "skill_006"],
      ],

      developerProjects: [
        ["dev_001", "project_001"],
        ["dev_001", "project_002"],

        ["dev_002", "project_001"],
        ["dev_002", "project_003"],

        ["dev_003", "project_002"],

        ["dev_004", "project_003"],

        ["dev_005", "project_002"],
        ["dev_005", "project_004"],
      ],

      developerCompanies: [
        ["dev_001", "company_001"],
        ["dev_002", "company_002"],
        ["dev_003", "company_001"],
        ["dev_004", "company_002"],
        ["dev_005", "company_003"],
      ],

      developerDomains: [
        ["dev_001", "domain_001"],
        ["dev_002", "domain_002"],
        ["dev_003", "domain_001"],
        ["dev_004", "domain_002"],
        ["dev_005", "domain_003"],
      ],

      projectTechnologies: [
        ["project_001", "tech_001"],
        ["project_001", "tech_002"],

        ["project_002", "tech_001"],
        ["project_002", "tech_002"],

        ["project_003", "tech_003"],

        ["project_004", "tech_003"],
        ["project_004", "tech_004"],
      ],

      projectSkills: [
        ["project_001", "skill_001"],
        ["project_001", "skill_002"],
        ["project_001", "skill_005"],

        ["project_002", "skill_001"],
        ["project_002", "skill_002"],
        ["project_002", "skill_006"],

        ["project_003", "skill_003"],
        ["project_003", "skill_002"],

        ["project_004", "skill_003"],
        ["project_004", "skill_006"],
      ],

      projectDomains: [
        ["project_001", "domain_001"],
        ["project_002", "domain_001"],
        ["project_003", "domain_002"],
        ["project_004", "domain_003"],
      ],

      projectCompanies: [
        ["project_001", "company_001"],
        ["project_002", "company_001"],
        ["project_003", "company_002"],
        ["project_004", "company_003"],
      ],
    };

    await session.run(
      `
      UNWIND $items AS item
      MATCH (d:Developer {id: item[0]})
      MATCH (s:Skill {id: item[1]})
      CREATE (d)-[:HAS_SKILL]->(s)
      `,
      { items: relationships.developerSkills },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (d:Developer {id: item[0]})
      MATCH (p:Project {id: item[1]})
      CREATE (d)-[:WORKED_ON]->(p)
      `,
      { items: relationships.developerProjects },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (d:Developer {id: item[0]})
      MATCH (c:Company {id: item[1]})
      CREATE (d)-[:WORKS_AT]->(c)
      `,
      { items: relationships.developerCompanies },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (d:Developer {id: item[0]})
      MATCH (domain:Domain {id: item[1]})
      CREATE (d)-[:HAS_DOMAIN_EXPERIENCE]->(domain)
      `,
      { items: relationships.developerDomains },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (p:Project {id: item[0]})
      MATCH (t:Technology {id: item[1]})
      CREATE (p)-[:USES]->(t)
      `,
      { items: relationships.projectTechnologies },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (p:Project {id: item[0]})
      MATCH (s:Skill {id: item[1]})
      CREATE (p)-[:REQUIRES_SKILL]->(s)
      `,
      { items: relationships.projectSkills },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (p:Project {id: item[0]})
      MATCH (domain:Domain {id: item[1]})
      CREATE (p)-[:IN_DOMAIN]->(domain)
      `,
      { items: relationships.projectDomains },
    );

    await session.run(
      `
      UNWIND $items AS item
      MATCH (p:Project {id: item[0]})
      MATCH (c:Company {id: item[1]})
      CREATE (p)-[:FOR_COMPANY]->(c)
      `,
      { items: relationships.projectCompanies },
    );

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    console.log("Closing session and driver...");
    await session.close();
    await driver.close();
  }
}

seed();