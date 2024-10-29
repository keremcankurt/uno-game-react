import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import RoomList from "./components/RoomList";

const socket = io("http://localhost:4000"); // Sunucu bağlantı noktası

function App() {
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [room, setRoom] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Sunucudan mevcut odaları al
    socket.on("roomList", (rooms) => {
      setRooms(rooms);
    });
    // Sunucudan oda verilerini al
    socket.on("updatePlayers", (room) => {
      setRoom(room);
    });

    // Oda silindiğinde
    socket.on("roomDeleted", () => {
      setIsInRoom(false); // Ana menüye dön
      setRoom([]); // Oda bilgilerini sıfırla
    });

    return () => {
      socket.off("roomList");
      socket.off("updatePlayers");
      socket.off("roomDeleted"); // Olay dinleyicisini temizle
    };
  }, []);

  const createRoom = () => {
    if (username) {
      socket.emit("createRoom", username, ({ status, message }) => {
        if (status === "success") {
          setIsInRoom(true);
        } else {
          console.log(message);
        }
      });
    } else {
      console.log("Please enter both username and room name");
    }
  };

  // Odaya katılma işlemi
  const joinRoom = (roomId) => {
    if (username) {
      socket.emit("joinRoom", { roomId, username }, ({ status, message }) => {
        if (status === "success") {
          setIsInRoom(true);
        } else {
          console.log(message);
        }
      });
    } else {
      console.log("Please enter both username and room ID");
    }
  };
console.log(room)
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-900 bg-opacity-80 w-full md:w-1/2 rounded-md shadow-lg p-4">
        {/* MAIN MENU */}
        {
          !isInRoom ? (
            <div>
              <div className="flex items-center justify-between p-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-opacity-70 bg-white text-black placeholder:text-gray-700 px-2 rounded-md"
                  placeholder="Username"
                />
                <button
                  onClick={createRoom}
                  className="bg-green-600 text-white p-2 rounded-md font-bold hover:bg-green-500 transition duration-300"
                >
                  Create Room
                </button>
              </div>
              <div className="w-full bg-gray-600 h-[1px] my-2"></div>
              <RoomList onJoinRoom={joinRoom} rooms={rooms} />
            </div>
          ) : (
            // LOBBY
            <div>
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-white font-bold text-2xl">Room: {room.id}</h1>
                  <button className="bg-red-600 text-white hover:bg-red-500 p-2 rounded-md transition duration-300">Leave Room</button>
                </div>
                <span className="text-white text-xl">Players</span>
                <div className="bg-gray-700 p-2 rounded-md mt-2">
                  {
                    room?.players?.map(player => (
                      <div key={player.id} className="text-white py-1">
                        <span>{player.username} {player.id === room.owner && "👑"}</span>
                      </div>
                    ))
                  }
                </div>
                {
                  room.players.length > 1 && socket.id === room.owner &&
                  <button className="bg-blue-600 text-white p-2 rounded-md mt-2 hover:bg-blue-500 transition duration-300">Start Game</button>
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
