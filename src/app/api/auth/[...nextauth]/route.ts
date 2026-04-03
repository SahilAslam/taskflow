import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/lib/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        try {
          const res = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (res.data?.success && res.data.user) {
            return {
              id: res.data.user._id,
              name: res.data.user.name,
              email: res.data.user.email,
              avatar: res.data.user.avatar,
              token: res.data.token,
            };
          }
          return null;
        } catch (e: any) {
          throw new Error(e.response?.data?.message || 'Login failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = (user as any).token;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session as any).token = token.token;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
