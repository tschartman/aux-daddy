import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]'
import {refreshAccessToken} from "@/lib/spotify";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.refreshToken) {
    res.status(400).json({ error: 'No refresh token found in session' });
    return;
  }

  try {
    const { accessToken, expiresIn } = await refreshAccessToken(session.refreshToken);

    res.status(200).json({ accessToken, expiresIn});
  } catch (error) {
    console.error('Error refreshing Spotify access token:', error);
    res.status(500).json({ error: 'Failed to refresh Spotify access token' });
  }
}