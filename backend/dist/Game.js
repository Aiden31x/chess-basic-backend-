"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startDate = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Invalid move:White's turn but black tried to move");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Invalid move:Black's turn but white tried to move");
            return;
        }
        console.log("Valid turn, attempting move");
        //BOARD UPDATION
        //chess library makes sure the move is valid
        try {
            const result = this.board.move(move);
            if (!result) {
                console.log("Move made is invalid according to chess.js library");
                return;
            }
        }
        catch (e) {
            console.log("Move failed", e);
            return;
        }
        console.log("Move made successfulyy");
        this.moveCount++;
        //Send updated board state to both players
        const boardState = this.board.board();
        this.player1.send(JSON.stringify({
            type: messages_1.BOARD_UPDATE,
            payload: {
                board: boardState,
                turn: this.board.turn()
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.BOARD_UPDATE,
            payload: {
                board: boardState,
                turn: this.board.turn()
            }
        }));
        //checkign for game over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        //sending move to other player
        if (socket === this.player1) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
    }
}
exports.Game = Game;
