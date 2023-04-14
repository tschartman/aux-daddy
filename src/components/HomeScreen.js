import React, {useState} from "react";
import {signOut, useSession} from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

const createRoomAsync = async (roomName) => {
  const {data} = await axios.post('/api/room', {name: roomName});
  return data;
}

const HomeScreen = () => {
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const {mutate: createRoom} = useMutation(createRoomAsync, {
    onSuccess: (data) => {
      navigateToRoom(data.code);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const navigateToRoom = (roomCode) => {
    router.push(`/room/${roomCode}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100">
      <div className="p-8 rounded">
        <h1 className="text-2xl font-bold mb-4 text-stone-800">
          Welcome to Aux Daddy!
        </h1>
        <button
          onClick={() => {signOut()}}
          className="bg-stone-500 text-white px-4 m-2 py-2 rounded"
        >
          signOut
        </button>
      </div>
      <div className="bg-stone-200 p-8 m-4 flex flex-col items-center rounded shadow-md">
        <label htmlFor="room-name" className="block text-md font-bold text-gray-700 mb-2">Create a Room</label>
        <input
          id="room-name"
          placeholder="Name"
          className="w-full m-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onChange={(event) => {setRoomName(event.target.value)}}
        />
        <button
          onClick={() => {createRoom(roomName)}}
          className="bg-stone-500 text-white px-4 m-2 py-2 rounded"
        >
          New Room
        </button>
      </div>
      <h1 className="text-2xl font-bold m-4 text-stone-800">
        OR
      </h1>
      <div className="bg-stone-200 p-5 m-2 flex flex-col items-center rounded shadow-md">
        <label htmlFor="room-code" className="block text-md font-bold text-gray-700 mb-2">Join with room code:</label>
        <input
          id="room-code"
          placeholder="Code"
          className="w-full m-4 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onChange={(event) => {setRoomCode(event.target.value)}}
        />
        <button
          onClick={(event) => {navigateToRoom(roomCode)}}
          className="bg-stone-500 text-white px-4 m-2 py-2 rounded"
        >
          Join
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;