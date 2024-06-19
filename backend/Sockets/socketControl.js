const Game = require('../Classes/Game.js');
const { v4: uuidv4 } = require('uuid');
const GameManager = require('../Classes/GameManager.js');
const { handleCreateGame } = require('../Controllers/Game/createGame.js');
const { handleJoinGame } = require('../Controllers/Game/joinGame.js');
const { handleResign } = require('../Controllers/Game/resignGame.js');
const gm = new GameManager();   
const jwt = require("jsonwebtoken");
const { handleEndGame } = require('../Controllers/Game/endGame.js');
const { storeGame } = require('../Controllers/Game/storeGame.js');
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
    console.log('a user connected '+socket.id);
    const player = socket.handshake.headers.email;
    const token = socket.handshake.auth.token;

    socket.on("create_game", async ()=>{
        const gameId = generateGameId();
        const game = new Game(gameId);
        socket.join(gameId);
        game.p1 = player;
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
            socket.join(gameId);
            io.to(socket.id).emit('joinId', {status : true, res : gameId});
            console.log(gm.liveGames);
        }
        else{
            io.to(socket.id).emit('joinId', {status : false, res : 'Sorry the room is full!'});
            socket.disconnect();
        }
    })

    socket.on('move', async (currFen, lastmove, gameId)=>{
        authenticateToken(token, async (isValid) =>{
            if(isValid){
                const game = gm.getGame(gameId);
                // console.log("lastmove : ", lastmove);
                if(lastmove){ 
                    game.chess.move(lastmove);
                    // console.log("game : ", game);
                }
                const result = await storeGame(gameId, currFen);
                if(result.status){
                    socket.to(gameId).emit('oppMove',currFen,   lastmove);
                }
                else{
                    io.to(socket.id).emit('gameUpdates', result.reason);
                }
            }
            else{
                io.to(socket.id).emit('gameUpdates', 'Invalid Token!');
            }   
        })
    })

    socket.on('reconnection', (fen, gameId)=>{
        console.log('reconnected ', socket.id);
        socket.join(gameId);
        io.to(socket.id).emit('reconnection', true);
        socket.to(gameId).emit('oppMove', fen, 'reconnection');
    })

    socket.on('resign', async (gameId, color)=>{
        const game = gm.getGame(gameId);
        const result = await handleResign(gameId, player, game, color);
        if(result.status){
            io.to(gameId).emit('resign', `${color === 'b' ? 'White' : 'Black'} wins the game!`);
        }
        else{
            if(result.reason === "GNF"){
                io.to(socket.id).emit('gameUpdates', 'No such game exists!');
                // socket.disconnect();
            }
            else{
                io.to(socket.id).emit('gameUpdates', result.reason);
            }
        }
    })

    socket.on('endGame', async(gameId, player, res)=>{
        const game = gm.getGame(gameId);
        const result = await handleEndGame(gameId, player, res, game);
        if(result.status){
            io.to(gameId).emit('gameUpdates', `${result.reason ==='w'?'Black':'White'} wins the game!`);
        }
        else{
            io.to(socket.id).emit('gameUpdates', result.reason);
        }
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected '+socket.id);
        socket.handshake.auth = "";
    });
})}
