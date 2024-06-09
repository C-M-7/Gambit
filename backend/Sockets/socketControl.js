const Game = require('../Classes/Game.js');
const { v4: uuidv4 } = require('uuid');
const GameManager = require('../Classes/GameManager.js');
const { handleCreateGame } = require('../Controllers/Game/createGame.js');
const { handleJoinGame } = require('../Controllers/Game/joinGame.js');
const { handleGameState } = require('../Controllers/Game/gameState.js');
const { handleResign } = require('../Controllers/Game/resignGame.js');
const gm = new GameManager();   
const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateGameId = () =>{
    return uuidv4();
}

module.exports = (io) =>{ 
    const authenticateToken = (token, callback) =>{
        jwt.verify(
            token,
            String(process.env.jwt_secret_key),
            (err)=>{
                if(err) {
                    console.log(err)
                    callback(false);
                }
                callback(true);
            }
        )
    }

    io.on('connection', (socket)=>{
    console.log('a user connected');
    const player = socket.handshake.headers.email;
    const token = socket.handshake.auth.token;

    socket.on("create_game", async ()=>{
        const gameId = generateGameId();
        const game = new Game(gameId);
        game.p1 = player;
        game.socket1 = socket.id;
        // Creating game doc in DB
        try{
            await handleCreateGame(gameId, player);
            gm.addGame(gameId, game);
            io.to(socket.id).emit('gameId', game.gameId);
            console.log(gm.liveGames);
        }
        catch(err){
            io.to(socket.id).emit('gameUpdates', 'Unable to create game please try again in some time!');
            socket.disconnect();
        }
    })
    
    socket.on("join_game", async (gameId)=>{
        const game = gm.getGame(gameId);
        if(await handleJoinGame(gameId, player)){
            game.p2 = player;
            game.socket2 = socket.id;
            io.to(socket.id).emit('joinId', {status : true, res : gameId});
            console.log(gm.liveGames);
        }
        else{
            io.to(socket.id).emit('joinId', {status : false, res : 'Sorry the room is full!'});
            socket.disconnect();
        }
    })

    socket.on('move', async (fen, lastmove, gameId)=>{
        console.log(lastmove);
        authenticateToken(token, async (isValid) =>{
            if(isValid){
                const game = gm.getGame(gameId);
                const result = await handleGameState(gameId, player, fen, game, lastmove);

                if(result.status){
                    if(socket.id === game.socket1) {
                        io.to(game.socket2).emit('oppMove',fen,lastmove);
                    }
                    else {
                        io.to(game.socket1).emit('oppMove', fen,lastmove);
                    }
                    if(result.reason === 'Draw' || result.reason === 'Stalemate' || result.reason === 'Threefold repetition' || result.reason === 'Insufficient material'){
                        io.emit('gameUpdates', `Game ends via ${result.update}`);
                        // io.disconnect();
                    }
                    else if(result.update === 'Checkmate'){
                        // gm.delete(gameId);
                        io.emit('gameUpdates', `${result.reason} is the Winner via ${result.update}`);
                    }
                }
                else{
                    if(result.reason === "GNF"){
                        io.to(socket.id).emit('gameUpdates', 'No such game exists!');
                        // socket.disconnect();
                    }
                    else if(result.reason === "MNV"){
                        io.to(socket.id).emit('gameUpdates', 'Please make a valid move');
                    }
                    else if(result.reason === "WFT"){
                        io.to(socket.id).emit("gameUpdates", 'Wait for your turn please!');
                    }
                    else if(result.reason === 'GC'){
                        io.to(socket.id).emit("gameUpdates", 'Gambit Created');
                    }
                }
            }
            else{
                io.to(socket.id).emit('gameUpdates', 'Invalid Token!');
            }   
        })
    })

    socket.on('resign', async (gameId)=>{
        const game = gm.getGame(gameId);
        const result = await handleResign(gameId, player, game);
        if(result.status){
            io.emit('gameUpdates', `The winner of the game is ${game.reason}`);
        }
        else{
            if(result.reason === "GNF"){
                io.to(socket.id).emit('gameUpdates', 'No such game exists!');
                // socket.disconnect();
            }
        }
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.handshake.auth = "";
    });
})}
