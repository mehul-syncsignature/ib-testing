import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

// Plan table
export const plans = pgTable("Plan", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .notNull()
    .defaultNow(),
  planType: text("planType").notNull(),
  allowedTemplates: jsonb("allowedTemplates").notNull().default({}),
});

// User table - our custom user data with NextAuth user ID as primary key
export const users = pgTable("User", {
  id: uuid("id").primaryKey(), // NextAuth user ID is now the primary key
  email: text("email").notNull(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  profileUrl: text("profileUrl"),
  password: text("password"), // Optional for OAuth users, required for credentials users
  createdAt: timestamp("createdAt", { withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .notNull()
    .defaultNow(),
  planId: integer("planId").default(1),
  onboardingStatus: text("onboardingStatus", {
    enum: ["PENDING", "COMPLETE"],
  })
    .notNull()
    .default("PENDING"),
});

// Brand table
export const brands = pgTable("Brand", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Use 'name' consistently
  config: jsonb("config").notNull().default({}),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
  socialLinks: jsonb("socialLinks").default({}),
  brandImages: text("brandImages").array().default([]),
  infoQuestions: jsonb("infoQuestions").default({}),
  brandMark: jsonb("brandMark").default({}),
});

// Designs table
export const designs = pgTable("Designs", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brandId")
    .notNull()
    .references(() => brands.id, {
      onDelete: "cascade",
    }),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  assetType: text("assetType").notNull(),
  styleId: integer("styleId").notNull(),
  templateId: integer("templateId").notNull(),
  data: jsonb("data").notNull().default({}),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

// GeneratedContent table
export const generatedContent = pgTable("GeneratedContent", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  keywords: text("keywords").array(),
  promptType: text("promptType").notNull(),
  generatedText: text("generatedText").notNull(),
  model: text("model").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

// Post table
export const posts = pgTable("Post", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  brandId: uuid("brandId")
    .notNull()
    .references(() => brands.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  designId: uuid("designId").references(() => designs.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  content: text("content"),
  imageUrl: text("imageUrl"),
  pdfUrl: text("pdfUrl"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

// Relations
export const plansRelations = relations(plans, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  plan: one(plans, {
    fields: [users.planId],
    references: [plans.id],
  }),
  generatedContent: many(generatedContent),
  posts: many(posts),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  designs: many(designs),
  posts: many(posts),
}));

export const designsRelations = relations(designs, ({ one, many }) => ({
  brand: one(brands, {
    fields: [designs.brandId],
    references: [brands.id],
  }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  brand: one(brands, {
    fields: [posts.brandId],
    references: [brands.id],
  }),
  design: one(designs, {
    fields: [posts.designId],
    references: [designs.id],
  }),
}));

export const generatedContentRelations = relations(
  generatedContent,
  ({ one }) => ({
    user: one(users, {
      fields: [generatedContent.userId],
      references: [users.id],
    }),
  })
);
