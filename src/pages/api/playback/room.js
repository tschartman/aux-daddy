import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getSpotifyApi } from "@/lib/spotify";
import { getRoomAccessToken } from "@/lib/spotify";

const getPlayback = async (accessToken) => {
  const spotifyApi = getSpotifyApi(accessToken);
  const response = await spotifyApi.get('/me/player/queue');
  return response.data;
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const accessToken = await getRoomAccessToken(session.user);
    
    if (!accessToken) {
      res.status(404).json({ error: 'No host found' });
      return;
    }

    try {
      const data = await getPlayback(accessToken);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data from Spotify API:', error);
      res.status(500).json({ error: 'Error fetching data from Spotify API.' });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).json({message: 'Method not allowed'});
  }
}