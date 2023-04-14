import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import { getSpotifyApi } from "@/lib/spotify";

const playSong = async (uris, accessToken) => {
  const spotifyApi = getSpotifyApi(accessToken);

  await spotifyApi.put('/me/player/play', {
    uris: uris,
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songUris } = req.body;
      if (!songUris || !songUris.length) {
        res.status(400).json({ error: 'Missing required property' });
        return;
      }
      const session = await getServerSession(req, res, authOptions)

      await playSong(songUris, session.accessToken);

      res.status(200).json({ message: 'Song played successfully' });
    } catch (error) {
      console.error('Error fetching data from Spotify API:', error);
      res.status(500).json({ error: 'Error fetching data from Spotify API.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}