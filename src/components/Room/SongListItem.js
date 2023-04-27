import React from 'react';

const SongListItem = ({ song, handlePlaySong, handleDeleteSong, handleAddToPlaylist }) => {
  return (
    <div
      key={song.id}
      className="song-item p-4 bg-stone-200 text-gray-700 shadow-md rounded flex items-center"
    >
      <div className="song-item-content">
        <img src={song.imageUrl} alt="Album cover" className="w-16 h-16 mr-4" />
        <div className="song-info">
          <h3 className="text-xl font-semibold truncate">{song.name}</h3>
          <p className="text-sm truncate">{song.artist}</p>
        </div>
      </div>
      <div className="song-item-actions mt-4">
        <button
          title="Play Now"
          onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }}
          className="px-3 py-1 bg-green-500 text-white rounded mr-2"
        >
          <i className="fas fa-play"></i>
        </button>
        <button
          title="Add to Playlist"
          onClick={(e) => { e.stopPropagation(); handleAddToPlaylist(song); }}
          className="px-3 py-1 bg-green-500 text-white rounded mr-2 ">
            <i className="fas fa-add"></i>
        </button>
        <button 
          title="Delete Song"
          onClick={(e) => { e.stopPropagation(); handleDeleteSong(song); }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default SongListItem;