export const addSongMutationConfig = (queryClient) => ({
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
  },
  onSettled: () => {
    queryClient.invalidateQueries(["room", code]);
  },
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