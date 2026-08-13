import { resolveEntities } from "../utils/entity-resolver.js";
import { findDevelopersByFilters } from "../repositories/developer.repository";

export async function searchDevelopers(query: string) {
  const filters = await resolveEntities(query);

  const developers = await findDevelopersByFilters({
    skills: filters.skills,
    domains: filters.domains,
  });

  return {
    query,
    filters,
    developers,
    total: developers.length,
  };
}