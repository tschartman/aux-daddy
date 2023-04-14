import axios from 'axios';

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    });

    const { access_token: newAccessToken, expires_in: expiresIn } = response.data;

    return {
      accessToken: newAccessToken,
      expiresIn,
    };
  } catch (error) {
    throw error;
  }
}

export function getSpotifyApi(accessToken) {
  return axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}