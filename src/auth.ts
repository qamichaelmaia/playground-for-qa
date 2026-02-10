import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { verifyPassword, findOrCreateGoogleUser, toUserProfile } from "@/lib/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const user = await verifyPassword(email, password);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await findOrCreateGoogleUser({
            email: user.email!,
            name: user.name,
            image: user.image,
          });
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      const isSafeImageUrl = (value?: string | null) => {
        if (!value) return false;
        if (value.length > 2048) return false;
        return value.startsWith("http://") || value.startsWith("https://");
      };

      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.name = user.name;
        const image = (user as any).image as string | undefined;
        if (isSafeImageUrl(image)) {
          token.picture = image;
        }
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name || token.name;
        const image = (session.user as any).image as string | undefined;
        if (isSafeImageUrl(image)) {
          token.picture = image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  trustHost: true,
});
