import { relations, sql } from "drizzle-orm";
import {
  pgSchema,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

// Create the next_auth schema if it doesn't exist
export const createNextAuthSchema = sql`CREATE SCHEMA IF NOT EXISTS next_auth`;

// Define the next_auth schema
const nextAuthSchema = pgSchema("next_auth");

// NextAuth schema - these tables are in the "next_auth" schema
export const nextAuthUsers = nextAuthSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { withTimezone: true }),
  image: text("image"),
});

export const nextAuthSessions = nextAuthSchema.table("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId").notNull().references(() => nextAuthUsers.id, {
    onDelete: "cascade",
  }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const nextAuthAccounts = nextAuthSchema.table("accounts", {
  userId: uuid("userId").notNull().references(() => nextAuthUsers.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  oauth_token_secret: text("oauth_token_secret"),
  oauth_token: text("oauth_token"),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

export const nextAuthVerificationTokens = nextAuthSchema.table("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
}, (verificationToken) => ({
  compoundKey: primaryKey({
    columns: [verificationToken.identifier, verificationToken.token],
  }),
}));

// Relations
export const nextAuthUsersRelations = relations(nextAuthUsers, ({ many }) => ({
  accounts: many(nextAuthAccounts),
  sessions: many(nextAuthSessions),
}));

export const nextAuthAccountsRelations = relations(
  nextAuthAccounts,
  ({ one }) => ({
    user: one(nextAuthUsers, {
      fields: [nextAuthAccounts.userId],
      references: [nextAuthUsers.id],
    }),
  })
);

export const nextAuthSessionsRelations = relations(
  nextAuthSessions,
  ({ one }) => ({
    user: one(nextAuthUsers, {
      fields: [nextAuthSessions.userId],
      references: [nextAuthUsers.id],
    }),
  })
);