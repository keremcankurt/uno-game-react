import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import RoomList from "./components/RoomList";
import Game from "./components/Game";

const socket = io("http://localhost:4000"); // Sunucu bağlantı noktası

function App() {
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [room, setRoom] = useState({});
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("");

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
      setRoom({}); // Oda bilgilerini sıfırla
      setGameData([]);
      setCurrentTurn("");
      setGameStarted(false);
    });

    // Oyun başladığında
    socket.on("gameStarted", (gameData, currentTurn) => {
      setGameData(gameData);
      setCurrentTurn(currentTurn);
      setGameStarted(true);
    });

    return () => {
      socket.off("roomList");
      socket.off("updatePlayers");
      socket.off("roomDeleted");
      socket.off("gameStarted");
    };
  }, []);

  const createRoom = () => {
    if (username) {
      setErrorMessage(""); // Hata mesajını temizle
      socket.emit("createRoom", username, ({ status, message }) => {
        if (status === "success") {
          setIsInRoom(true);
        } else {
          setErrorMessage(message || "Failed to create room");
        }
      });
    } else {
      setErrorMessage("Please enter a username");
    }
  };

  const joinRoom = (roomId) => {
    if (username) {
      setErrorMessage("");
      socket.emit("joinRoom", { roomId, username }, ({ status, message }) => {
        if (status === "success") {
          setIsInRoom(true);
        } else {
          setErrorMessage(message || "Failed to join room");
        }
      });
    } else {
      setErrorMessage("Please enter a username");
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", room.id, ({ status }) => {
      if (status === "success") {
        setIsInRoom(false);
        setRoom({});
        setGameStarted(false);
        setGameData([]);
        setCurrentTurn("");
      }
    });
  };

  const startGame = () => {
    socket.emit("startGame", room.id, ({ status, message }) => {
      if (status !== "success") {
        setErrorMessage(message || "Failed to start game");
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-900 bg-opacity-80 w-full md:w-1/2 rounded-md shadow-lg p-4">
        {errorMessage && <div className="bg-red-500 text-white p-2 rounded-md mb-2">{errorMessage}</div>}

        {!isInRoom ? (
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
        ) : gameStarted ? (
          <Game gameData={gameData} currentTurn={currentTurn} socket={socket} />
        ) : (
          <div>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <h1 className="text-white font-bold text-2xl">Room: {room.id}</h1>
                <button
                  onClick={leaveRoom}
                  className="bg-red-600 text-white hover:bg-red-500 p-2 rounded-md transition duration-300"
                >
                  Leave Room
                </button>
              </div>
              <span className="text-white text-xl">Players</span>
              <div className="bg-gray-700 p-2 rounded-md mt-2">
                {room?.players?.map((player) => (
                  <div key={player.id} className="text-white py-1">
                    <span>
                      {player.username} {player.id === room.owner && "👑"}
                    </span>
                  </div>
                ))}
              </div>
              {room.players.length > 1 && socket.id === room.owner && (
                <button
                  onClick={startGame}
                  className="bg-blue-600 text-white p-2 rounded-md mt-2 hover:bg-blue-500 transition duration-300"
                >
                  Start Game
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
