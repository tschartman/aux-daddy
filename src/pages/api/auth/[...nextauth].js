import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import { refreshAccessToken } from '@/lib/spotify';

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    // OAuth authentication providers...
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: { params: { scope: 'user-modify-playback-state user-read-email user-read-private' } }
    })
  ],
  callbacks: {
    async session({session, token}) {
      // session.accessToken = token.accessToken;
      // session.refreshToken = token.refreshToken;
      // session.expiresIn = token.expiresIn;
      // return session;
    },
    async jwt({token, account}) {
      // if (account && account.access_token) {
      //   token.accessToken = account.access_token;
      //   token.refreshToken = account.refresh_token;
      //   token.expiresAt = account.expires_at * 1000;
      // }

      // // Return previous token if the access token has not expired yet
      // if (Date.now() < token.expiresAt) {
      //   return token;
      // }
  
      // // Access token has expired, try to update it
      // const { accessToken, expiresIn } = await refreshAccessToken(token.refreshToken);
      // return {
      //   ...token,
      //   accessToken,
      //   expiresAt: Date.now() + expiresIn * 1000,
      // };
    }
  }
};


export default NextAuth(authOptions)