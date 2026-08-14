import { FastifyInstance } from "fastify";
import {
  getDeveloper,
  getDeveloperConnections,
} from "../services/search.service.js";

export async function developerRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/api/developers/:id",
    async (request, reply) => {
      try {
        const developer = await getDeveloper(request.params.id);

        if (!developer) {
          return reply.code(404).send({
            status: "error",
            message: "Developer not found",
          });
        }

        return {
          status: "ok",
          result: developer,
        };
      } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
          status: "error",
          message: "Unable to load developer",
        });
      }
    },
  );

  app.get<{ Params: { id: string } }>(
    "/api/developers/:id/connections",
    async (request, reply) => {
      try {
        const connections = await getDeveloperConnections(
          request.params.id,
        );

        return {
          status: "ok",
          result: connections,
        };
      } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
          status: "error",
          message: "Unable to load developer connections",
        });
      }
    },
  );
}
