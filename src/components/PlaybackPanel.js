import React from "react";
import styled from "styled-components";
import MusicPlayer from '@/components/MusicPlayer'
import {resumePlayback, pausePlayback, nextTrack, previousTrack} from '@/services/spotifyService'
import { useQueryClient } from '@tanstack/react-query'

const PlaybackPanel = ({ visible, togglePanel, playback, currentlyPlaying, queue, code}) => {

  const queryClient = useQueryClient();

  const handleResume = async () => {
    await resumePlayback(code);    
      queryClient.invalidateQueries(['playback'])
  };

  const handlePause = async () => {
   await pausePlayback(code);
   queryClient.invalidateQueries(['playback'])
  };

  const handleNext = async () => {
   await nextTrack(code);
   queryClient.invalidateQueries(['playback'])
  };

  const handlePrevious = async () => {
   await previousTrack(code);
   queryClient.invalidateQueries(['playback'])
  };

  return (
    <Panel visible={visible}>
      <div className="flex justify-between m-4">
        <button
        onClick={togglePanel}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
        <button
          onClick={() => queryClient.invalidateQueries('playback')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 mx-4 px-4 rounded"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>

      <div className="min-h-screen">
        {playback ? (
        <MusicPlayer
          playback={playback}
          currentlyPlaying={currentlyPlaying}
          queue={queue}
          handlePrevious={handlePrevious}
          handlePause={handlePause}
          handleResume={handleResume}
          handleNext={handleNext}
        /> ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold m-4 text-stone-800">No Active PlayBack</h1>
          </div>
          )
        }
      </div>
    </Panel>
  );
};

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background-color: #fff;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  overflow-y: auto;
  z-index: 1000;
  transform: ${({ visible }) =>
    visible ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease;
`;

export default PlaybackPanel;