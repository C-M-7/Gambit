const Game = require('../Classes/Game.js');
const { v4: uuidv4 } = require('uuid');
const GameManager = require('../Classes/GameManager.js');
const { handleCreateGame } = require('../Controllers/Game/createGame.js');
const { handleJoinGame } = require('../Controllers/Game/joinGame.js');
const { handleGameState } = require('../Controllers/Game/gameState.js');
const { handleResign } = require('../Controllers/Game/resignGame.js');

const gm = new GameManager();   

const generateGameId = () =>{
    return uuidv4();
}

module.exports = (io) =>{ 
    io.on('connection', (socket)=>{
    console.log('a user connected');
    const player = socket.handshake.headers.email;

    socket.on("create_game", async ()=>{
        const gameId = generateGameId();
        const game = new Game(gameId);
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
            io.to(socket.id).emit('joinId', {status : true, res : 'connection success'});
            console.log(gm.liveGames);
        }
        else{
            io.to(socket.id).emit('joinId', {status : false, res : 'Sorry the room is full!'});
            socket.disconnect();
        }
    })

    socket.on('move', async (move, gameId)=>{
        const game = gm.getGame(gameId);
        const result = await handleGameState(gameId, player, move, game);
        console.log(result);
        console.log(move);
        if(result.status){
            const moves = game.moves.join(',');
            io.emit('move',moves);
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
        }

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
