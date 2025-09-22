import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Server-side Drizzle client for API routes
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a connection pool for server usage
const queryClient = postgres(connectionString, {
  prepare: false,
  // Connection pool settings for server environment
  max: 20,
  idle_timeout: 20,
  max_lifetime: 60 * 30, // 30 minutes
});

// Create Drizzle instance for server
export const serverDb = drizzle(queryClient, { 
  schema,
  logger: process.env.NODE_ENV === "development",
});

export type ServerDatabase = typeof serverDb;