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
        game.addP1(socket.id);
        gm.addGame('first', game);
        io.to(socket.id).emit("gameId", game.gameId);
        console.log(gm.liveGames);
    })
    
    socket.on("join_game", (gameId)=>{
        const game = gm.getGame(gameId);
        if(game){
            game.addP2(socket.id);
            io.to(socket.id).emit('connection', 'connection success');
        }
        console.log(gm.liveGames);
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})

app.get('/', urlRoute);
  
server.listen(7000, () => console.log("server started at 7000"));