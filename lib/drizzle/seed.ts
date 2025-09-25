import { serverDb } from "./server";
import { plans } from "./schema";
// Remove unused eq import

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Plans
  console.log("📋 Seeding plans...");
  
  const planData = [
    {
      id: 1,
      name: "Free",
      description: "Basic features for individuals just getting started",
      planType: "free",
      allowedTemplates: {
        "featured-post": [1],
        "social-banner": [1],
        "textimg-post": [1],
        "quote-card": [1],
        "mockup-post": [1],
        "social-post": [1],
        "social-carousel": [1],
      },
    },
    {
      id: 2,
      name: "Bento",
      description: "Full access to all features of Bento with one-time purchase or subscription",
      planType: "one-time",
      allowedTemplates: {
        "featured-post": [1, 2, 3, 4, 5, 6],
        "social-banner": [1, 2, 3],
        "textimg-post": [3, 4, 5, 6],
        "quote-card": [1, 5, 6],
        "mockup-post": [2, 3, 4],
        "social-post": [1, 2],
      },
    },
    {
      id: 3,
      name: "Pro",
      description: "Full access to all features with subscription",
      planType: "subscription",
      allowedTemplates: {
        "featured-post": [1, 2, 3, 4, 5, 6],
        "social-banner": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        "textimg-post": [1, 2, 3, 4, 5, 6],
        "quote-card": [1, 2, 3, 4, 5, 6],
        "mockup-post": [1, 2, 3, 4],
        "social-post": [1, 2, 3, 4],
        "social-carousel": [1, 2, 3, 4],
      },
    },
  ] as const;

  for (const plan of planData) {
    await serverDb
      .insert(plans)
      .values({
        ...plan,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: plans.id,
        set: {
          name: plan.name,
          description: plan.description,
          planType: plan.planType,
          allowedTemplates: plan.allowedTemplates,
          updatedAt: new Date(),
        },
      });
  }


  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });