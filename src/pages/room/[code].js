import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import useDebounce from '@/hooks/useDebounce'
import AppHeader from '@/components/AppHeader'

const getRoomByCode = (code) => {
  return axios.get(`/api/room/${code}`)
}

const searchSpotify = async (query) => {
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

const playSong = async (code, songs, session) => {
  await axios.post(`/api/room/${code}/play-song`, {
    songUris: songs.map((song) => song.songUri),
  }, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
  });
}

async function addSongToRoom({ code, song, session }) {
  const { name, artists, album, uri } = song;
  const artistName = artists.map((artist) => artist.name).join(', ');
  const imageUrl = album.images[0]?.url

  const response = await axios.post(`/api/room/${code}/add-song`, {
    songName: name,
    artistName,
    imageUrl,
    songUri: uri,
  }, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
  })

  return response.data;
}

async function deleteSongFromRoom({ code, songId, session }) {

  const response = await axios.delete(`/api/room/${code}/${songId}`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    }
  });

  return response.data;
}

async function deleteAllSongsFromRoom({ code, session }) {

  const response = await axios.delete(`/api/room/${code}/delete-all-songs`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    }
  });

  return response.data;
}


export default function Room() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const {data: session} = useSession();

  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const addSongMutation = useMutation(addSongToRoom, {
    onMutate: async ({ code, song, session }) => {
      // Optimistic update: Store the previous state and update the UI
      const previousRoomData = queryClient.getQueryData(["room", code]);
  
      // Update the roomData state with the new song
      queryClient.setQueryData(["room", code], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          songs: [...oldData.data.songs, song],
        },
      }));
  
      return { previousRoomData };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous state if an error occurs
      if (context.previousRoomData) {
        queryClient.setQueryData(["room", code], context.previousRoomData);
      }
    },
    onSettled: () => {
      // Invalidate the room query to refetch the data after the mutation
      queryClient.invalidateQueries(["room", code]);
    },
  });

  const deleteSongMutation = useMutation(deleteSongFromRoom, {
    onMutate: async ({code, songId }) => {
      // Optimistically remove the song from the list
      await queryClient.cancelQueries(["room", code]);
  
      const previousData = queryClient.getQueryData(["room", code]);

      queryClient.setQueryData(["room", code], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          songs: oldData.data.songs.filter((s) => s.id !== songId),
        }
      }));
  
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Revert the UI changes if an error occurs
      queryClient.setQueryData(["room", code], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["room", code]);
    },
  });

  const deleteAllSongsMutation = useMutation(deleteAllSongsFromRoom, {
    onMutate: async ({code, songId }) => {
      // Optimistically remove the song from the list
      await queryClient.cancelQueries(["room", code]);
  
      const previousData = queryClient.getQueryData(["room", code]);

      queryClient.setQueryData(["room", code], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          songs: [],
        }
      }));
  
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Revert the UI changes if an error occurs
      queryClient.setQueryData(["room", code], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["room", code]);
    },
  });

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  async function handleSongSelection(song) {
    try {
      const data = await addSongMutation.mutateAsync({ code, song, session });
      setShowSearchResults(false);
      setInputValue('');
    } catch (error) {
      console.error('Error adding song to the room:', error);
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchSpotify(debouncedSearchTerm).then((results) => {
        setSearchResults(results);
        if (results.length > 0) {
          setShowSearchResults(true);
        } else {
          setShowSearchResults(false);
        }
      });
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [debouncedSearchTerm]);

  const { code } = router.query;
  const { data, isLoading, isError } = useQuery(
    ['room', code],
    () => getRoomByCode(code),
    {
      enabled: !!code,
    }
    );
  const room = data?.data;

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Failed to load room</div>
  }

  function handlePlaySong(songs) {
    playSong(code, songs, session);
  }
  
  function handleDeleteSong(song) {
    deleteSongMutation.mutate({ code, songId: song.id, session });
  }

  function handleDeleteAllSongs() {
    deleteAllSongsMutation.mutate({ code, session });
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-stone-100">
      <div className="p-8 rounded">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-stone-800">
            {room.name} #{room.code}
          </h1>
          <input
            type="text"
            value={inputValue}
            placeholder="Search Music..."
            className="w-full md:w-96 m-4 px-3 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={(event) => setInputValue(event.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {showSearchResults && (
            <div className="w-full md:w-96 z-10 h-96 mt-32 bg-white border border-gray-300 rounded shadow absolute overflow-auto">
              <ul className="divide-y divide-gray-300">
                {searchResults.map((item) => (
                  <li key={item.id} className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200" onClick={() => handleSongSelection(item)}>
                    <img className="w-16 h-16 rounded" src={item.album.images[0]?.url} alt={item.name} />
                    <div>
                      <h3 className="text-gray-700 font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.artists.map((artist) => artist.name).join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {room?.songs && room.songs.length > 0 &&
            <div className="flex items-center">
              <button onClick={(e) => { e.stopPropagation(); handlePlaySong(room.songs); }} className="px-2 py-1 bg-green-500 text-white rounded my-2 mx-2">Play All</button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteAllSongs(); }} className="px-2 py-1 bg-red-500 text-white rounded my-2 mx-2">Delete All</button>
            </div>}
          <div className="w-full max-w-2xl overflow-auto">
            <div className="grid-list my-10 relative">
              {room?.songs.map((song) => (
                <div
                  key={song.id}
                  className="song-item p-4 bg-stone-200 text-gray-700 shadow-md rounded flex items-center"
                  onClick={() => handleSongSelection(song)}
                >
                  <div className="song-item-content">
                    <img src={song.imageUrl} alt="Album cover" className="w-16 h-16 mr-4" />
                    <div className="song-info">
                      <h3 className="text-xl font-semibold truncate">{song.name}</h3>
                      <p className="text-sm truncate">{song.artist}</p>
                    </div>
                  </div>
                  <div className="song-item-actions ml-auto">
                    <button onClick={(e) => { e.stopPropagation(); handlePlaySong([song]); }} className="px-2 py-1 bg-green-500 text-white rounded mr-2">Play</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSong(song); }} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
