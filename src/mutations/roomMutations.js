export const addSongMutationConfig = (queryClient) => ({
    onMutate: async ({ code, song, session }) => {

      queryClient.invalidateQueries(["room", code]);

      const mappedSong = {
        imageUrl: song.album.images[0]?.url,
        name: song.name,
        artist: song.artists.map((artist) => artist.name).join(', '),
        songUri: song.uri,
        id: song.id
      }

      // Optimistic update: Store the previous state and update the UI
      const previousRoomData = queryClient.getQueryData(["room", code]);
  
      // Update the roomData state with the new song
      queryClient.setQueryData(["room", code], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          songs: [...oldData.data.songs, mappedSong],
        },
      }));
  
      return { previousRoomData };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous state if an error occurs
      if (context.previousRoomData) {
        queryClient.setQueryData(["room", code], context.previousRoomData);
      }
    }
});

export const deleteSongMutationConfig = (queryClient) => ({
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
  }
});

export const deleteAllSongsMutationConfig = (queryClient) => ({
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