import React from "react";

function Game({ gameData, currentTurn, socket }) {
  const playerData = gameData.find((data) => data.playerId === socket.id);
console.log(currentTurn)
  return (
    <div className="p-2">
      <h1 className="text-white font-bold text-2xl">Game Started!</h1>
      <h2 className="text-white text-lg">
        {currentTurn === socket.id ? "Your turn" : "Waiting for other players..."}
      </h2>
      <div className="mt-4">
        <h3 className="text-white font-bold text-lg">Your Hand:</h3>
        <div className="flex gap-2 mt-2">
          {playerData?.hand.map((card, index) => (
            <div key={index} className="bg-white text-black p-2 rounded-md">
              {card?.value || card?.type}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-white font-bold text-lg">Other Players:</h3>
        {playerData?.otherPlayerCardCounts.map((player) => (
          <div key={player.playerId} className="text-white">
            Player {player.playerId}: {player.cardCount} cards
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
