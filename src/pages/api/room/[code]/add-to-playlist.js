import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import { getSpotifyApi } from "@/lib/spotify";
import { getRoomAccessToken } from "@/lib/spotify";


const addSongToPlaylist = async (uri, accessToken) => {
  const spotifyApi = getSpotifyApi(accessToken);
  return await spotifyApi.post(`/me/player/queue?uri=${encodeURIComponent(uri)}`);
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songUri } = req.body;
      if (!songUri) {
        res.status(400).json({ error: 'Missing required property' });
        return;
      }
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
      
      await addSongToPlaylist(songUri, accessToken);
      res.status(200).json({ message: 'Added Song To Playlist' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data from Spotify API.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}