import type {
  Connection,
  DeveloperDetail,
  SearchResult,
} from "../types/developer";

const API_URL = "http://localhost:3000";

interface ApiResponse<T> {
  status: string;
  result: T;
}

export async function searchDevelopers(
  query: string,
): Promise<SearchResult> {
  const response = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  const data: ApiResponse<SearchResult> = await response.json();

  return data.result;
}

export async function getDeveloper(
  id: string,
): Promise<DeveloperDetail> {
  const response = await fetch(`${API_URL}/api/developers/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load developer");
  }

  const data: ApiResponse<DeveloperDetail> = await response.json();

  return data.result;
}

export async function getDeveloperConnections(
  id: string,
): Promise<Connection[]> {
  const response = await fetch(
    `${API_URL}/api/developers/${id}/connections`,
  );

  if (!response.ok) {
    throw new Error("Failed to load connections");
  }

  const data: ApiResponse<Connection[]> = await response.json();

  return data.result;
}