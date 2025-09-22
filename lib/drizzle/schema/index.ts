// NextAuth schema exports
export * from "./nextauth";

// Main application schema exports  
export * from "./main";

// Re-export all tables for convenience
import * as nextAuth from "./nextauth";
import * as main from "./main";

export const nextAuthSchema = nextAuth;
export const mainSchema = main;