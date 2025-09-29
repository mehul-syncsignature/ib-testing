import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/drizzle";
import {
  nextAuthUsers,
  nextAuthSessions,
  nextAuthAccounts,
  nextAuthVerificationTokens,
} from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { users, brands } from "@/lib/drizzle/schema";
import { defaultBrand } from "@/contexts/BrandContext/helpers/initialState";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation schema for credentials
const authSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isSignUp: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: nextAuthUsers,
    accountsTable: nextAuthAccounts,
    sessionsTable: nextAuthSessions,
    verificationTokensTable: nextAuthVerificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        isSignUp: { label: "Sign Up", type: "text" },
      },
      async authorize(credentials) {
        try {
          const validatedData = await authSchema.parseAsync(credentials);
          const { email, password, firstName, lastName, isSignUp } =
            validatedData;

          if (isSignUp === "true") {
            // Handle sign-up
            const existingUser = await db
              .select()
              .from(users)
              .where(eq(users.email, email))
              .limit(1);

            if (existingUser.length > 0) {
              throw new Error("User already exists");
            }

            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(password, 12);
            const userId = crypto.randomUUID();
            const [newUser] = await db
              .insert(users)
              .values({
                id: userId, // Use the generated UUID as primary key
                email,
                password: hashedPassword,
                firstName: firstName || null,
                lastName: lastName || null,
                planId: 1, // Default to free plan
                onboardingStatus: "PENDING",
              })
              .returning();

            return {
              id: newUser.id, // Return the User table ID directly
              email: newUser.email,
              name:
                `${newUser.firstName || ""} ${newUser.lastName || ""}`.trim() ||
                null,
              image: newUser.profileUrl,
            };
          } else {
            // Handle sign-in
            const user = await db
              .select()
              .from(users)
              .where(eq(users.email, email))
              .limit(1);

            if (!user.length) {
              throw new Error("Invalid credentials");
            }

            // Verify password
            if (!user[0].password) {
              throw new Error("Password not set for this user");
            }

            const passwordMatch = await bcrypt.compare(
              password,
              user[0].password
            );
            if (!passwordMatch) {
              throw new Error("Invalid credentials");
            }

            return {
              id: user[0].id, // Return the User table ID directly
              email: user[0].email,
              name:
                `${user[0].firstName || ""} ${user[0].lastName || ""}`.trim() ||
                null,
              image: user[0].profileUrl,
            };
          }
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/app/design-templates/social-banner",
    error: "/app/design-templates/social-banner",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      // Persist user ID and other info to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        
        // Handle OAuth user creation after NextAuth user is created
        if (account?.provider === "google" && user.email) {
          try {
            // Check if user exists in our custom User table using the correct NextAuth user ID
            const existingUser = await db
              .select()
              .from(users)
              .where(eq(users.id, user.id))
              .limit(1);

            if (!existingUser.length) {
              // Create new user record with correct NextAuth user ID
              const [newUser] = await db.insert(users).values({
                id: user.id, // This is now the correct NextAuth user ID
                email: user.email,
                firstName: user.name?.split(" ")[0] || null,
                lastName: user.name?.split(" ").slice(1).join(" ") || null,
                profileUrl: user.image || null,
                planId: 1,
                onboardingStatus: "COMPLETE", // Skip onboarding for OAuth users
              }).returning();

              // Check if user already has brands (to prevent duplicates)
              const existingBrands = await db
                .select()
                .from(brands)
                .where(eq(brands.userId, newUser.id))
                .limit(1);

              // Only create default brand if none exists
              if (!existingBrands.length) {
                const brandName = newUser.firstName ? `${newUser.firstName}'s Brand` : "My Brand";
                await db.insert(brands).values({
                  id: crypto.randomUUID(),
                  userId: newUser.id,
                  name: brandName,
                  config: defaultBrand.config,
                  socialLinks: defaultBrand.socialLinks,
                  brandImages: defaultBrand.brandImages,
                  infoQuestions: defaultBrand.infoQuestions,
                  brandMark: {
                    ...defaultBrand.brandMark,
                    name: newUser.firstName || "User",
                    headshotUrl: newUser.profileUrl || defaultBrand.brandMark.headshotUrl,
                  },
                });
              }
            }
          } catch {
            // If user creation fails, continue with OAuth flow
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ account }) {
      // For credentials provider, just allow sign-in (user already created in authorize)
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers, just allow sign-in - we'll handle user creation in jwt callback
      if (account?.provider === "google") {
        return true;
      }
      
      return true;
    },
  },
});
