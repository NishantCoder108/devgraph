export interface Developer {
  id: string;
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  matchedSkills: string[];
}

export interface SearchFilters {
  skills: string[];
  technologies: string[];
  domains: string[];
  projects: string[];
  companies: string[];
}

export interface SearchResult {
  query: string;
  filters: SearchFilters;
  developers: Developer[];
  total: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface DeveloperDetail {
  id: string;
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  skills: string[];
  projects: Project[];
  companies: string[];
  domains: string[];
}

export interface Connection {
  id: string;
  name: string;
  title: string;
  sharedProjects: string[];
}