
const MusicPlayer = ({ playback, currentlyPlaying, queue, handlePrevious, handleResume, handlePlay, handlePause, handleNext }) => {

  return (
    <div className="bg-gray-100">
      {currentlyPlaying && (
        <div className="flex flex-col items-center text-center mt-10">
          <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
          <img
            className="rounded"
            src={currentlyPlaying.album.images[0].url}
            alt={currentlyPlaying.name}
            width="200"
            height="200"
          />
          <p className="mt-4">{currentlyPlaying.name}</p>
          <p>{currentlyPlaying.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
      )}

      <div className="text-center mt-6 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
          onClick={handlePrevious}
        >
          <i className="fas fa-backward"></i>
        </button>

          {playback && playback.is_playing ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
              onClick={handlePause}
            >
              <i className="fas fa-pause"></i>
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
              onClick={handleResume}
            >
              <i className="fas fa-play"></i>
            </button>
          )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
          onClick={handleNext}
        >
          <i className="fas fa-forward"></i>
        </button>
      </div>
      {queue && (
        <div>
          <ul className="divide-y divide-gray-400">
            {queue.map((item, index) => (
              <li key={index} className="p-4">
                <div className='flex flex-row '>
                  <img
                    className="rounded"
                    src={item.album.images[0].url}
                    alt={item.name}
                    width="50"
                    height="50"
                  />
                  <div className='flex flex-col ml-4 truncate'>
                    <p>{item.name}</p>
                    <p>{item.artists.map((artist) => artist.name).join(', ')}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;