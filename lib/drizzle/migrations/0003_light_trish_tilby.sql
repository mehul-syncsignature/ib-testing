CREATE TABLE "Post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"designId" uuid NOT NULL,
	"content" text,
	"imageUrl" text,
	"pdfUrl" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_designId_Designs_id_fk" FOREIGN KEY ("designId") REFERENCES "public"."Designs"("id") ON DELETE cascade ON UPDATE cascade;