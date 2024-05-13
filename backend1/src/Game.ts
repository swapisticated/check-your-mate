import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messaages";
import { createLanguageService } from "typescript";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    // private board: string; // board is stored as a string // rather than maintaing a board, maintain a variable board of type chess
    public board: Chess;// coming from chess.js 
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();// anytime a game is created, we create a new instance of the chess class
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }
    makeMove(socket: WebSocket, move: {

        from: string;
        to: string;
    }) {
        console.log(move)

        //validate the type of move using zod 
        // validation, i.e is it this users move
        if (this.board.move.length % 2 === 0 && socket !== this.player1) {
            console.log("eaarly return")

            return;
            
        }
        if (this.board.move.length % 2 === 0 && socket !== this.player2) {
            return;
        }
        console.log("did not eaarly return")
        try {
            this.board.move(move);
        } catch (e) {
            console.log(e);
            return;
        }
        console.log("move success");

        //is this move valid // chess.js takes care
        //update the board // no need, chess.js takes care of it
        //check if the game is over
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"

                }
            }))
            return;
        }

        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move

            }))
        }
        this.moveCount++;

        //send the updated board to both the players
    }
}