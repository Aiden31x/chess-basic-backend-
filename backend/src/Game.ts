import { Chess } from "chess.js";
import { BOARD_UPDATE, GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { WebSocket } from "ws";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private moves: String[];
    private startDate: Date;
    private moveCount=0;


    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.moves=[];
        this.startDate=new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:"white"
            }
        }))

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:"black"
            }
        }))
    }


    makeMove(socket:WebSocket, move:{
        from: string,
        to:string
    }){
        if(this.moveCount%2===0 && socket !== this.player1){
            console.log("Invalid move:White's turn but black tried to move");
            return
        }
        if(this.moveCount%2===1 && socket !== this.player2){
            console.log("Invalid move:Black's turn but white tried to move");
            return
        }

        console.log("Valid turn, attempting move");

        //BOARD UPDATION
        //chess library makes sure the move is valid
        try{
            const result=this.board.move(move);
            if(!result){
                console.log("Move made is invalid according to chess.js library");
                return;
            }
        }catch(e){
            console.log("Move failed",e);
            return
        }

        console.log("Move made successfulyy");

        this.moveCount++;

        //Send updated board state to both players
        const boardState=this.board.board();

        this.player1.send(JSON.stringify({
            type: BOARD_UPDATE,
            payload:{
                board: boardState,
                turn: this.board.turn()
            }
        }))

        this.player2.send(JSON.stringify({
            type:BOARD_UPDATE,
            payload:{
                board:boardState,
                turn:this.board.turn()
            }
        }))


        //checkign for game over

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload:{
                    winner: this.board.turn() ==="w" ? "black" : "white"
                }
            }))

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload:{
                    winner: this.board.turn() ==="w" ? "black" : "white"
                }
            }))
            return;
        }


            //sending move to other player
            if(socket===this.player1){
                this.player2.send(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
            } else {
                this.player1.send(JSON.stringify({
                    type:MOVE,
                    payload:move
                }))
            }

    }
}