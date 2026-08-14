import { FastifyInstance } from "fastify";
import { searchDevelopers } from "../services/search.service.js";

interface SearchBody {
  query: string;
}

export async function searchRoutes(app: FastifyInstance) {
  app.post<{ Body: SearchBody }>("/api/search", async (request, reply) => {
    const query = request.body?.query?.trim();

    if (!query) {
      return reply.code(400).send({
        status: "error",
        message: "Search query is required",
      });
    }

    try {
      const result = await searchDevelopers(query);

      return reply.send({
        status: "ok",
        result,
      });
    } catch (error) {
      request.log.error(error);

      return reply.code(500).send({
        status: "error",
        message: "Unable to search the developer network",
      });
    }
  });
}
