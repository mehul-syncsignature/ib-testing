// app/api/assets/svg/[filename]/route.ts
import ServerApi from "@/lib/serverApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const filename = pathname.split("/").pop();

    if (!filename || filename === "null") {
      return NextResponse.json(
        { error: "Missing or invalid filename" },
        { status: 400 }
      );
    }

    // Determine the environment and construct AWS URL
    const isDev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
    const domain = isDev
      ? "assets.dev.instantbranding.ai"
      : "assets.dev.instantbranding.ai";
    const svgUrl = `https://${domain}/${filename}.svg`;

    // Fetch the SVG from AWS
    const response = await ServerApi.getExternal(svgUrl);

    if (!response) {
      return NextResponse.json({ error: "SVG not found" }, { status: 404 });
    }

    // Get the SVG content
    const svgContent = await response;

    // Return the SVG with proper headers
    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching SVG:", error);
    return NextResponse.json({ error: "Failed to fetch SVG" }, { status: 500 });
  }
}
