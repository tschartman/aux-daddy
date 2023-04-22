import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    // OAuth authentication providers...
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: { params: { scope: 'user-modify-playback-state' } }
    })
  ],
  callbacks: {
    async session({session, token, user}) {
      if (user) {
        session.user = user;
      }
      return session;
    }
  }
};


export default NextAuth(authOptions)