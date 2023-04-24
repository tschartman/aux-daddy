import axios from 'axios';

export const searchSpotify = async (query) => {
  try {
    const response = await axios.get('/api/spotify-search', {
      params: {
        q: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
  }
}

export const addToPlaylist = async (code, song) => {
  return await axios.post(`/api/room/${code}/add-to-playlist`, {
    songUri: song.songUri,
  });
}

export const resumePlayback = async (code) => {
  await axios.post(`/api/room/${code}/resume-playback`);
}

export const pausePlayback = async (code) => {
  await axios.post(`/api/room/${code}/pause-playback`);
}

export const skipSong = async (code) => {
  await axios.post(`/api/room/${code}/skip-song`);
}

export const previousSong = async (code) => {
  await axios.post(`/api/room/${code}/previous-song`);
}

export const playSong = async (code, songs) => {
  return await axios.post(`/api/room/${code}/play-song`, {
    songUris: songs.map((song) => song.songUri),
  });
}

export const getPlayback = async () => {
  const response = await axios.get('/api/playback/room');
  return response.data;
}