import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

// todo: move together, there is a code repetition here
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

export const Game = () => {
  const socket = useSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true)
          console.log("Game Initialised");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move Made");
          break;
        case GAME_OVER:
          console.log("Game Over");
          break;
      }
    };
  }, [socket]);
  if (!socket) return <div>Conncecting...</div>;
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 flex justify-center  w-auto">
            <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
          </div>
          <div className="col-span-2 flex justify-center bg-[#262522] w-full">
            <div className="p-10">
              {!started && <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
