// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";

// Define API response interface
interface ApiResponse {
  statusCode?: number;
  data?: string;
  headers?: Record<string, string>;
  error?: string;
}

// Define constants
const AI_API = {
  URL: process.env.AI_API_URL,
  AUTHORIZATION: process.env.AI_API_KEY,
};

/**
 * Calls external API to remove background from image using Web APIs
 */
async function removeImageBackground(
  imageBuffer: ArrayBuffer,
  filename: string
): Promise<ApiResponse> {
  try {
    // Create a browser-compatible FormData
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: "image/png" });
    formData.append("image", blob, filename);

    // Make the API call using fetch
    const response = await fetch(`${AI_API.URL}`, {
      method: "POST",
      headers: {
        Authorization: AI_API.AUTHORIZATION!,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Parse the response as JSON
    const imageResponse = (await response.json()) as ApiResponse;

    // Validate response structure
    if (!imageResponse || typeof imageResponse !== "object") {
      throw new Error("Invalid response from background removal API");
    }

    if (imageResponse.statusCode === 200) {
      return {
        data: imageResponse.data || "",
        headers: imageResponse.headers || {},
        statusCode: imageResponse.statusCode,
      };
    }

    throw new Error(JSON.stringify(imageResponse));
  } catch (err) {
    // Log error but suppress console warning in production
    /* eslint-disable-next-line no-console */
    console.error(`Error from external background removal API:`, err);
    throw err;
  }
}

/**
 * API route handler for background removal
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Get the filename from the form data or generate one
    const filename =
      (formData.get("filename") as string) || `image-${Date.now()}.png`;

    // Convert the image blob to an ArrayBuffer
    const arrayBuffer = await image.arrayBuffer();

    // Call the external API to remove the background
    const response = await removeImageBackground(arrayBuffer, filename);

    // The API response contains the processed image as base64
    // Convert to binary data for the response
    if (!response.data) {
      throw new Error("Missing image data in API response");
    }

    const base64Data = response.data;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Return the processed image
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    // Log error but suppress console warning in production
    /* eslint-disable-next-line no-console */
    console.error("Error in background removal:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
