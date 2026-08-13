import neo4j, { Driver } from "neo4j-driver";
import { env } from "../config/env";

export const driver: Driver = neo4j.driver(
  env.cognodbUri,
  neo4j.auth.basic(
    env.cognodbUsername,
    env.cognodbPassword,
  ),
);

export async function verifyDatabase(): Promise<void> {
  const session = driver.session();

  try {
    const result = await session.run("RETURN 1 AS ok");
    console.log("CognoDB:", result.records[0].get("ok"));
  } finally {
    await session.close();
  }
}