import axios from 'axios';

export const getRoomByCode = (code) => {
  return axios.get(`/api/room/${code}`)
}

export async function addSongToRoom({ code, song, session }) {
  const { name, artists, album, uri } = song;
  const artistName = artists.map((artist) => artist.name).join(', ');
  const imageUrl = album.images[0]?.url

  const response = await axios.post(`/api/room/${code}/add-song`, {
    songName: name,
    artistName,
    imageUrl,
    songUri: uri,
  })

  return response.data;
}

export async function deleteSongFromRoom({ code, songId, session }) {

  const response = await axios.delete(`/api/room/${code}/${songId}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    }
  });

  return response.data;
}

export async function deleteAllSongsFromRoom({ code, session }) {

  const response = await axios.delete(`/api/room/${code}/delete-all-songs`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    }
  });

  return response.data;
}

export const createRoomAsync = async (roomName) => {
  const {data} = await axios.post('/api/room', {name: roomName});
  return data;
}

export const joinRoom = async (roomCode) => {
  const {data} = await axios.post(`/api/room/${roomCode}/join`);
  return data;
}

export const leaveRoom = async (roomCode) => {
  const {data} = await axios.post(`/api/room/${roomCode}/leave`);
  return data;
}

export const deleteRoom = async (roomCode) => {
  const {data} = await axios.delete(`/api/room/${roomCode}`);
  return data;
}
