// app/api/designs/upsert-design/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { designs, brands } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const designSchema = z.object({
  id: z.string().uuid().optional(),
  brandId: z.string().uuid(),
  assetType: z.string().min(1, "Asset type is required"),
  styleId: z.number().int().nonnegative(),
  templateId: z.number().int().nonnegative(),
  data: z.union([
    z.record(z.any()), 
    z.array(z.object({
      data: z.record(z.any())
    })) 
  ]).default({}),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validatedData = designSchema.parse(body);

    const brand = await serverDb
      .select({ id: brands.id })
      .from(brands)
      .where(
        and(
          eq(brands.id, validatedData.brandId),
          eq(brands.userId, user.id)
        )
      )
      .limit(1);

    if (!brand.length) {
      return NextResponse.json(
        { success: false, error: "Brand not found or access denied" },
        { status: 404 }
      );
    }

    let data;
    let action: "created" | "updated";

    if (validatedData.id) {
      const updateResult = await serverDb
        .update(designs)
        .set({
          brandId: validatedData.brandId,
          assetType: validatedData.assetType,
          styleId: validatedData.styleId,
          templateId: validatedData.templateId,
          data: validatedData.data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(designs.id, validatedData.id),
            eq(designs.userId, user.id) 
          )
        )
        .returning();

      if (!updateResult.length) {
        return NextResponse.json(
          { success: false, error: "Design not found or access denied" },
          { status: 404 }
        );
      }

      data = updateResult[0];
      action = "updated";
    } else {
      const createResult = await serverDb
        .insert(designs)
        .values({
          brandId: validatedData.brandId,
          assetType: validatedData.assetType,
          styleId: validatedData.styleId,
          templateId: validatedData.templateId,
          data: validatedData.data,
          userId: user.id,
        })
        .returning();

      data = createResult[0];
      action = "created";
    }

    return NextResponse.json({
      success: true,
      data,
      action,
    });
  } catch (error) {
    console.log('error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return handleAuthError(error);
  }
}