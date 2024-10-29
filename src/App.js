import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import RoomList from "./components/RoomList";

const socket = io("http://localhost:4000"); // Sunucu bağlantı noktası

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [players, setPlayers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setPlayers(players);
    });
    return () => {
      socket.off("updatePlayers");
    };
  }, []);
  useEffect(() => {
    // Sunucudan mevcut odaları al
    socket.on("roomList", (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socket.off("roomList");
    };
  }, []);

  const createRoom = () => {
    if (username) {
      socket.emit("createRoom", username, ({ status, roomId, message }) => {
        if (status === "success") {
          setRoomId(roomId);
          setIsInRoom(true);
        } else {
          console.log(message);
        }
      });
    } else {
      console.log("Please enter both username and room name");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-black bg-opacity-50 w-full md:w-1/2 rounded-md">
        <div className="flex items-center justify-between p-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-opacity-50 bg-white text-white placeholder:text-gray-700 px-2 rounded-sm"
            placeholder="Username"
          />
          <button
            onClick={createRoom}
            className="bg-green-500 text-white p-2 rounded-md font-bold"
          >
            Create Room
          </button>
        </div>
        <div className="w-full bg-gray-400 p-[1px] mb-2"></div>
        <RoomList onJoinRoom={{}} rooms={rooms} />
      </div>
    </div>
  );
}

export default App;
