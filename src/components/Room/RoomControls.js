import React from 'react';

const RoomControls = ({ room, handlePlayAllSongs, handleDeleteAllSongs }) => {
  return (
    <div className="flex items-center">
      <button onClick={(e) => { e.stopPropagation(); handlePlayAllSongs(room.songs); }} className="px-2 py-1 bg-green-500 text-white rounded my-2 mx-2">Play All</button>
      <button onClick={(e) => { e.stopPropagation(); handleDeleteAllSongs(); }} className="px-2 py-1 bg-red-500 text-white rounded my-2 mx-2">Delete All</button>
    </div>
  );
};

export default RoomControls;