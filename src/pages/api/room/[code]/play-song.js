import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import { getSpotifyApi } from "@/lib/spotify";
import { getRoomAccessToken } from "@/lib/spotify";


const playSong = async (uris, deviceId, accessToken) => {
  const spotifyApi = getSpotifyApi(accessToken);

  const requestBody = {
    uris: uris,
  };

  const activePlayback = await spotifyApi.get('/me/player')

  
  if (!activePlayback.data) {
    if (deviceId) {
      await spotifyApi.put('/me/player', {
        device_ids: [deviceId],
        play: true
      })

      requestBody.device_id = deviceId;
      return await spotifyApi.put('/me/player/play', requestBody)
    }
  } else {
    return await spotifyApi.put('/me/player/play', requestBody)
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songUris, deviceId } = req.body;
      if (!songUris || !songUris.length) {
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
      await playSong(songUris, deviceId, accessToken);
      res.status(200).json({ message: 'Song played successfully'});
      return;
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: 'Error fetching data from Spotify API.' });
      return;
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}