import { driver } from "../src/db/neo4j.js";
import { findDevelopersByFilters } from "../src/repositories/developer.repository.js";

async function main() {
  try {
    const developers = await findDevelopersByFilters({
      skills: ["Rust", "TypeScript"],
      domains: ["Fintech"],
    });

    console.dir(developers, { depth: null });
  } catch (error) {
    console.error(error);
  } finally {
    await driver.close();
  }
}

main();