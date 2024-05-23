const Game = require('../Classes/Game.js');
const { v4: uuidv4 } = require('uuid');
const GameManager = require('../Classes/GameManager.js');
const { handleCreateGame } = require('../Controllers/Game/createGame.js');
const { handleJoinGame } = require('../Controllers/Game/joinGame.js');
const { handleGameState } = require('../Controllers/Game/gameState.js');

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
            io.to(socket.id).emit('connection', 'connection success');
            console.log(gm.liveGames);
        }
        else{
            io.to(socket.id).emit('connection', 'Sorry the game is full!');
            socket.disconnect();
        }
    })

    socket.on('move', (move, gameId)=>{
        const game = gm.getGame(gameId);
        if(game.moves.length % 2 == 0 && game.p1 === player){
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
        else if(game.moves.length % 2 != 0 && game.p2 === player){
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

    // socket.on('end_game', (gameId)=>{
    //     const game = gm.getGame(gameId);

    // })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})}
