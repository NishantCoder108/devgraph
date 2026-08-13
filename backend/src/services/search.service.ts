import { resolveEntities } from "../utils/entity-resolver";
import {
  findDeveloperById,
  findDeveloperConnections,
  findDevelopersByFilters,
} from "../repositories/developer.repository";

export async function searchDevelopers(query: string) {
  const filters = await resolveEntities(query);

const developers = await findDevelopersByFilters(filters);

  return {
    query,
    filters,
    developers,
    total: developers.length,
  };
}

export async function getDeveloper(id: string) {
  return findDeveloperById(id);
}

export async function getDeveloperConnections(id: string) {
  return findDeveloperConnections(id);
}
