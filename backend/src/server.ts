import Fastify from "fastify";
import { driver, verifyDatabase } from "./db/neo4j.js";
import { env } from "./config/env.js";
import { searchRoutes } from "./routes/search.js";
import cors from "@fastify/cors";
import { developerRoutes } from "./routes/developers.js";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: true,
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.register(searchRoutes);
app.register(developerRoutes);

app.addHook("onClose", async () => {
  await driver.close();
});

const start = async () => {
  try {
    await verifyDatabase();

    await app.listen({
      port: env.port,
      host: "0.0.0.0",
    });

    console.log(`API running on http://localhost:${env.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
