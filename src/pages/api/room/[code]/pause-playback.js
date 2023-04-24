import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import { getSpotifyApi } from "@/lib/spotify";
import { getRoomAccessToken } from "@/lib/spotify";


const pausePlayback = async (accessToken) => {
  const spotifyApi = getSpotifyApi(accessToken);
  await spotifyApi.put('/me/player/pause');
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
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
      
      await pausePlayback(accessToken);
      res.status(200).json({ message: 'Paused Successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data from Spotify API.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}