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
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
  planType: text("planType").notNull(),
});

// PlanLimit table
export const planLimits = pgTable("PlanLimit", {
  id: text("id").primaryKey(),
  planId: text("planId").notNull().references(() => plans.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
  allowedTemplates: jsonb("allowedTemplates").notNull(),
});

// User table - our custom user data with NextAuth user ID as primary key
export const users = pgTable("User", {
  id: uuid("id").primaryKey(), // NextAuth user ID is now the primary key
  email: text("email").notNull(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  profileUrl: text("profileUrl"),
  password: text("password"), // Optional for OAuth users, required for credentials users
  createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
  planId: text("planId").default("1").references(() => plans.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  onboardingStatus: text("onboarding_status", {
    enum: ["PENDING", "COMPLETE"],
  }).notNull().default("PENDING"),
});

// Brand table  
export const brands = pgTable("Brand", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Use 'name' consistently
  config: jsonb("config").notNull().default({}),
  userId: uuid("user_id").notNull().references(() => users.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  socialLinks: jsonb("social_links").default({}),
  brandImages: text("brand_images").array().default([]),
  infoQuestions: jsonb("info_questions").default({}),
  brandMark: jsonb("brand_mark").default({}),
});

// Designs table
export const designs = pgTable("Designs", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull().references(() => brands.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").notNull().references(() => users.id, {
    onUpdate: "cascade", 
    onDelete: "cascade",
  }),
  assetType: text("asset_type").notNull(),
  styleId: integer("style_id").notNull(),
  templateId: integer("template_id").notNull(),
  data: jsonb("data").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// AssetCategory table
export const assetCategories = pgTable("AssetCategory", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
});

// AssetTemplate table
export const assetTemplates = pgTable("AssetTemplate", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetCategoryId: uuid("assetCategoryId").notNull().references(() => assetCategories.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  templates: integer("templates").array(),
  createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
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
  createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
});

// Relations
export const plansRelations = relations(plans, ({ one, many }) => ({
  planLimit: one(planLimits, {
    fields: [plans.id],
    references: [planLimits.planId],
  }),
  users: many(users),
}));

export const planLimitsRelations = relations(planLimits, ({ one }) => ({
  plan: one(plans, {
    fields: [planLimits.planId],
    references: [plans.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  plan: one(plans, {
    fields: [users.planId],
    references: [plans.id],
  }),
  generatedContent: many(generatedContent),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  designs: many(designs),
}));

export const designsRelations = relations(designs, ({ one }) => ({
  brand: one(brands, {
    fields: [designs.brandId],
    references: [brands.id],
  }),
}));

export const assetCategoriesRelations = relations(assetCategories, ({ many }) => ({
  templates: many(assetTemplates),
}));

export const assetTemplatesRelations = relations(assetTemplates, ({ one }) => ({
  category: one(assetCategories, {
    fields: [assetTemplates.assetCategoryId],
    references: [assetCategories.id],
  }),
}));

export const generatedContentRelations = relations(generatedContent, ({ one }) => ({
  user: one(users, {
    fields: [generatedContent.userId],
    references: [users.id],
  }),
}));