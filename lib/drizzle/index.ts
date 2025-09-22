import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection
const connectionString = process.env.DATABASE_URL!;

// For serverless environments, we need to handle connections carefully
let client: postgres.Sql | undefined;

export function getDbClient() {
  if (!client) {
    client = postgres(connectionString, {
      prepare: false,
      max: 1, // Limit connection pool for serverless
    });
  }
  return client;
}

// Create Drizzle instance
export const db = drizzle(getDbClient(), { 
  schema,
  logger: process.env.NODE_ENV === "development",
});

// Export types
export type Database = typeof db;
export type Schema = typeof schema;