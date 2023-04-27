import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import withAuth from '@/components/withAuth'
import { useSession } from 'next-auth/react'
import useDebounce from '@/hooks/useDebounce'
import UsersPanel from '@/components/UsersPanel'
import SearchBar from '@/components/Room/SearchBar';
import SearchResults from '@/components/Room/SearchResults';
import SongListItem from '@/components/Room/SongListItem';
import RoomControls from '@/components/Room/RoomControls';
import DeviceDropdown from '@/components/DeviceDropdown'
import { getRoomByCode, addSongToRoom, deleteSongFromRoom, deleteAllSongsFromRoom, leaveRoom, deleteRoom } from '@/services/roomService';
import { searchSpotify, getPlayback, playSong, addToPlaylist } from '@/services/spotifyService';
import { addSongMutationConfig, deleteSongMutationConfig, deleteAllSongsMutationConfig } from '@/mutations/roomMutations';
import PlaybackPanel from '@/components/PlaybackPanel'


function Room() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const {data: session} = useSession();

  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userPanelVisible, setUserPanelVisible] = useState(false);
  const [playbackPanelVisible, setPlaybackPanelVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({})

  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const addSongMutation = useMutation({
    mutationFn: addSongToRoom,
    onSuccess: () => {
      queryClient.invalidateQueries('room', [code])
    }
  });

  const deleteSongMutation = useMutation(deleteSongFromRoom, deleteSongMutationConfig(queryClient));
  const deleteAllSongsMutation = useMutation(deleteAllSongsFromRoom, deleteAllSongsMutationConfig(queryClient));

  const toggleUserPanel = () => {
    setUserPanelVisible(!userPanelVisible);
  };

  const togglePlaybackPanel = () => {
    setPlaybackPanelVisible(!playbackPanelVisible);
  };

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
      refetchOnWindowFocus: true
    }
  );

  const { data: playbackData } = useQuery(
    ['playback'],
    () => getPlayback()
  );

  const room = data?.data;

  if (isLoading || router.isFallback) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-stone-100">
        Loading...
      </div>

    );
  }

  if (isError || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-stone-100">
        Failed to load room
      </div>
    );
  }

  async function handlePlayAllSongs(songs) {
    let response = await playSong(code, songs, selectedDevice);
    if (response.status === 200) {
      handleDeleteAllSongs()
      queryClient.invalidateQueries('playback')
    }
  }
  
  async function handlePlaySong(song) {
    let response = await playSong(code, [song], selectedDevice);
    if (response.status === 200) {
      handleDeleteSong(song)
      queryClient.invalidateQueries('playback')
    }
  }
  

  async function handleAddToPlaylist(song) {
    const response = await addToPlaylist(code, song);
    if (response.status === 200) {
      handleDeleteSong(song)
      queryClient.invalidateQueries('playback')
    }
  }

  function handleDeleteSong(song) {
    deleteSongMutation.mutate({ code, songId: song.id, session });
  }

  function handleDeleteAllSongs() {
    deleteAllSongsMutation.mutate({ code, session });
  }

  async function handleDeleteRoom() {
    const confirmDelete = window.confirm("Are you sure you want to delete the room for all users?");
  
    if (confirmDelete) {
      const res = await deleteRoom(code, session);
      console.log(res)
      if (res.message === "Deleted Room") {
        router.push('/');
      }
    }
  }

  async function handleLeaveRoom() {
    const confirmDelete = window.confirm("Are you sure you want to leave the room?");
  
    if (confirmDelete) {
      await leaveRoom(code, session);
      if (res.message === "Left Room") {
        router.push('/');
      }
    }
  }

  const isRoomHost = session?.user?.id === room?.roomHost?.id;
  return (
    <div className="min-h-screen flex flex-col items-center bg-stone-100">
      <div flex flex-col items-center className='mt-4'>
        {isRoomHost ? (
          <button
            title="Delete"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2"
            onClick={handleDeleteRoom}
          >
            <i className="fas fa-trash"></i>
          </button> ) : (
          <button
            title="Leave"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2"
            onClick={handleLeaveRoom}
          >
            <i class="fa-solid fa-person-walking-arrow-right"></i>          
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
          title="Users"
          onClick={toggleUserPanel}
        >
          <i className="fas fa-user"></i>
        </button>
        <button
          title="Playback"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
          onClick={togglePlaybackPanel}
        >
          <i className="fas fa-list"></i>
        </button>
        <button
          onClick={() => {
            queryClient.invalidateQueries(['room', code])
            queryClient.invalidateQueries(['playback'])
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
      <div className="p-8 rounded">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-stone-800">
            {room.name} #{room.code}
          </h1>
          <DeviceDropdown
            selectedDevice={selectedDevice}
            handleDeviceChange={setSelectedDevice}
            devices={playbackData?.devices.devices}
          />
          <SearchBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
          />
          <SearchResults
            showSearchResults={showSearchResults}
            searchResults={searchResults}
            handleSongSelection={handleSongSelection}
          />
          {room.songs.length > 0 && (
            <RoomControls
              room={room}
              handlePlayAllSongs={handlePlayAllSongs}
              handleDeleteAllSongs={handleDeleteAllSongs}
            />
          )}
          <div className="w-full max-w-2xl max-h-fit overflow-auto">
            <div className="grid-list my-10 relative">
              {room?.songs.map((song) => (
                <SongListItem
                  song={song}
                  handleSongSelection={handleSongSelection}
                  handlePlaySong={handlePlaySong}
                  handleDeleteSong={handleDeleteSong}
                  handleAddToPlaylist={handleAddToPlaylist}
                />
              ))}
            </div>
          </div>
          <UsersPanel
            visible={userPanelVisible}
            togglePanel={toggleUserPanel}
            users={room.users}
            host={room.roomHost}
          />
          <PlaybackPanel
            visible={playbackPanelVisible}
            togglePanel={togglePlaybackPanel}
            code={code}
            currentlyPlaying={playbackData?.queue?.currently_playing}
            queue={playbackData?.queue?.queue}
            playback={playbackData?.playback}
          />
          </div>
        </div>
    </div>
  )
}

export default withAuth(Room);