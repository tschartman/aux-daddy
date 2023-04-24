import React from 'react';

const SearchResults = ({ showSearchResults, searchResults, handleSongSelection }) => {
  return (
    showSearchResults && (
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
    )
  );
};

export default SearchResults;