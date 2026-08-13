import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  cognodbUri: required("COGNODB_URI"),
  cognodbUsername: required("COGNODB_USERNAME"),
  cognodbPassword: required("COGNODB_PASSWORD"),
  port: Number(process.env.PORT ?? 3000),
};