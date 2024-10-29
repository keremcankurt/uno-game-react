import React, { useState } from 'react';

const RoomList = ({ rooms, onJoinRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Oda arama fonksiyonu
  const filteredRooms = rooms.filter(room =>
    room.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full pb-2">
      <h2 className="text-2xl font-bold text-center my-4 text-white">Available Rooms</h2>
      <div className="w-[90%] bg-white shadow-md rounded-md p-4 bg-opacity-80">
        <input
          type='text'
          placeholder='Search by Room ID...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        {filteredRooms.length > 0 ? (
          <div className='max-h-[40vh] overflow-auto px-4'>
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <h1 className="font-semibold text-xl">Oda Kodu: {room.id}</h1>
                  <p className="text-sm text-gray-600 font-bold">
                    Players: {room.players} / 4
                  </p>
                  <p className={`text-sm font-bold ${room.isStarted || room.players === 4 ? 'text-red-500' : 'text-green-500'}`}>
                    {room.players === 4 ? "Full" : room.isStarted ? 'In Progress' : 'Waiting'}
                  </p>
                </div>
                {!room.isStarted && room.players < 4 && (
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => onJoinRoom(room.id)}
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No rooms available</p>
        )}
      </div>
    </div>
  );
};

export default RoomList;
