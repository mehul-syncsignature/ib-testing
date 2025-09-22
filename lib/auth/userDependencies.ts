// // lib/auth/userDependencies.ts
// import { Brand } from "@/contexts/BrandContext/types";

// export interface UserDependenciesOptions {
//   userId: string;
//   brand: Brand;
// }

// export async function handleUserDependencies({
//   userId,
//   brand,
// }: UserDependenciesOptions) {
//   const operations: string[] = [];

//   try {
//     // Create new brand
//     const brandToCreate = {
//       name: brand.name,
//       config: brand.config,
//       social_links: brand.socialLinks || {},
//       brand_images: brand.brandImages || [],
//       info_questions: brand.infoQuestions || {},
//       brand_mark: brand.brandMark || {
//         name: "",
//         socialHandle: "",
//         website: "",
//         logoUrl: "",
//         headshotUrl: "",
//       },
//     };

//     const { data: newBrand } = await supabase
//       .from("Brand")
//       .insert({ ...brandToCreate, user_id: userId })
//       .select("*")
//       .single();

//     operations.push(brand ? "Created brand from FE" : "Created default brand");

//     return { success: true, operations, brand: newBrand };
//   } catch (error) {
//     // Transform to BrandContext format
//     console.error("Error in handleUserDependencies:", error);
//     return { success: false, error: "Internal server error", operations };
//   }
// }
