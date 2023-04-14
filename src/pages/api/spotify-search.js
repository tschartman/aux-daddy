import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]'
import { getSpotifyApi } from "@/lib/spotify";

const searchSpotify = async (query, accessToken) => {
  const spotifyApi = getSpotifyApi(accessToken);

  const response = await spotifyApi.get('/search', {
    params: {
      q: query,
      type: 'track',
      market: 'US',
      limit: 10,
    }
  });

  return response.data.tracks.items;
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = req.query.q;
      if (!query) {
        res.status(400).json({ error: 'Missing query parameter "q".' });
        return;
      }

      const session = await getServerSession(req, res, authOptions)
      const searchResults = await searchSpotify(query, session.accessToken);
      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data from Spotify API.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}