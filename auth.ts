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
import { users } from "@/lib/drizzle/schema";
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
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      // Persist user ID and other info to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
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
    async signIn({ user, account }) {
      // For credentials provider, just allow sign-in (user already created in authorize)
      if (account?.provider === "credentials") {
        return true;
      }

      // Only run this logic for OAuth providers, not credentials
      if (account?.provider === "google" && user.email && user.id) {
        try {
          // Check if user exists in our custom User table
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          if (!existingUser.length) {
            // Create new user record in our custom table using NextAuth user ID
            await db.insert(users).values({
              id: user.id, // Use NextAuth user ID as our User table ID
              email: user.email,
              firstName: user.name?.split(" ")[0] || null,
              lastName: user.name?.split(" ").slice(1).join(" ") || null,
              profileUrl: user.image || null,
              planId: 1,
              onboardingStatus: "PENDING",
            });
          } else {
            // Update existing user profile and ensure ID consistency
            await db
              .update(users)
              .set({
                profileUrl: user.image || existingUser[0].profileUrl,
                firstName:
                  user.name?.split(" ")[0] || existingUser[0].firstName,
                lastName:
                  user.name?.split(" ").slice(1).join(" ") ||
                  existingUser[0].lastName,
              })
              .where(eq(users.email, user.email));

            // If the existing user has a different ID, we need to handle this carefully
            if (existingUser[0].id !== user.id) {
              console.warn(
                `User ID mismatch for ${user.email}: existing=${existingUser[0].id}, auth=${user.id}`
              );
              // Update the user ID to match NextAuth
              await db
                .update(users)
                .set({ id: user.id })
                .where(eq(users.email, user.email));
            }
          }
        } catch (error) {
          console.error("SignIn callback error:", error);
          // Log more details for debugging
          console.error("User data:", {
            id: user.id,
            email: user.email,
            name: user.name,
          });
          console.error("Account data:", { provider: account.provider });
          return false;
        }
      }
      return true;
    },
  },
});
