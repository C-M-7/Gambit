const Game = require('../Classes/Game.js');
const { v4: uuidv4 } = require('uuid');
const GameManager = require('../Classes/GameManager.js');

const gm = new GameManager();   

const generateGameId = () =>{
    return uuidv4();
}

module.exports = (io) =>{ 
    io.on('connection', (socket)=>{
    console.log('a user connected');
    const player = socket.handshake.headers.email;

    socket.on("create_game", ()=>{
        const gameId = generateGameId();
        const game = new Game(gameId);
        game.p1 = player;
        gm.addGame(gameId, game);
        io.to(socket.id).emit('gameId', game.gameId);
        console.log(gm.liveGames);
    })
    
    socket.on("join_game", (gameId)=>{
        const game = gm.getGame(gameId);
        if(game && (game.p1 == null || game.p2 == null) && game.p1 != player){
            game.p2 = player;
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
