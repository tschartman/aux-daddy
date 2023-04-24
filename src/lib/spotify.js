import axios from 'axios';
import prisma from './prisma';

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

export async function getRoomAccessToken(user) {

  const combinedQuery = await prisma.room.findFirst({
    where: {
      code: user.roomId,
    },
    include: {
      roomHost: {
        include: {
          user: {
            include: {
              accounts: true,
            }
          },
        }
      },
    },
  });

  const account = await prisma.account.findFirst({
    where: {
      userId: combinedQuery.roomHost.id,
    },
  });

  if (account) {
    return inspectAccessToken(account);
  }

  return null;
}


export async function getAccessToken(user) {
  
  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (account) {
    return inspectAccessToken(account);
  }

  return null;
}

const inspectAccessToken = async (account) => {

  if (Date.now() < account.expires_at) {
    return account.access_token;
  }

  const {accessToken, expiresIn} = await refreshAccessToken(account.refresh_token);

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      access_token: accessToken,
      expires_at: BigInt(Date.now()) + (BigInt(expiresIn) * 1000n),
    },
  });

  return accessToken; 
};

export function getSpotifyApi(accessToken) {
  return axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}