const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const urlRoute = require('./Routes/route.js');
const Game = require('./Classes/Game.js');
const GameManager = require('./Classes/GameManager.js');

const gm = new GameManager();

io.on('connection', (socket)=>{
    console.log('a user connected');

    socket.on("create_game", ()=>{
        const game = new Game('first');
        game.p1 = socket.id;
        gm.addGame('first', game);
        io.to(socket.id).emit("gameId", game.gameId);
        console.log(gm.liveGames);
    })
    
    socket.on("join_game", (gameId)=>{
        const game = gm.getGame(gameId);
        if(game && (game.p1 == null || game.p2 == null)){
            console.log(game.p2);
            game.p2 = socket.id;
            io.to(socket.id).emit('connection', 'connection success');
        }
        else{
            io.to(socket.id).emit('connection', 'Sorry the game is full!');
            socket.disconnect();
        }
        console.log(gm.liveGames);
    })

    socket.on('move', (move, gameId)=>{
        const game = gm.getGame(gameId);
        if(game.moves.length % 2 == 0 && game.p1 === socket.id){
            const result = game.makeMove(move);
            console.log(result);
            if(!result.valid){
                io.to(socket.id).emit('warning', 'Please make a valid move!');
            }
            else{
                const moves = game.moves.join(',');
                io.emit('move', moves);
            }
        }
        else if(game.moves.length % 2 != 0 && game.p2 === socket.id){
            const result = game.makeMove(move);
            console.log(result);
            if(!result.valid){
                io.to(socket.id).emit('warning', 'Please make a valid move!');
            }
            else{
                const moves = game.moves.join(',');
                io.emit('move', moves);
            }
        }
        else {
            io.to(socket.id).emit('warning', 'wait for your turn');
        }
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})

app.get('/', urlRoute);
  
server.listen(7000, () => console.log("server started at 7000"));