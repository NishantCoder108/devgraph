import Fastify from "fastify";
import { driver, verifyDatabase } from "./db/neo4j";
import { env } from "./config/env";
import { searchRoutes } from "./routes/search";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.register(searchRoutes);

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
