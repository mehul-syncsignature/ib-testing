ALTER TABLE "AssetCategory" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "AssetTemplate" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "AssetCategory" CASCADE;--> statement-breakpoint
DROP TABLE "AssetTemplate" CASCADE;--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "social_links" TO "socialLinks";--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "brand_images" TO "brandImages";--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "info_questions" TO "infoQuestions";--> statement-breakpoint
ALTER TABLE "Brand" RENAME COLUMN "brand_mark" TO "brandMark";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "brand_id" TO "brandId";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "asset_type" TO "assetType";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "style_id" TO "styleId";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "template_id" TO "templateId";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "Designs" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "User" RENAME COLUMN "onboarding_status" TO "onboardingStatus";--> statement-breakpoint
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Designs" DROP CONSTRAINT "Designs_brand_id_Brand_id_fk";
--> statement-breakpoint
ALTER TABLE "Designs" DROP CONSTRAINT "Designs_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Designs" ADD CONSTRAINT "Designs_brandId_Brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Designs" ADD CONSTRAINT "Designs_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;