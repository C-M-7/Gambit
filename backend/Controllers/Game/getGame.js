const { getDB } = require("../../Configs/mongoConnection");

const getGame = async(req, res) => {
    try{
        const db = await getDB();
        const {gameId} = req.body;

        const game = await db.collection('games').findOne({
            gameId : gameId
        })

        if(!game){
            return res.status(400).json({
                status: false,
                status_code: 400,
                error: "Game doesn't exist",
            })
        }

        return res.status(200).json({
            status : true,
            status_code : 200,
            game : {
                gameId : game.gameId,
                player1 : game.player1,
                player2 : game.player2,
                gameState : game.gameState
            }
        })
    }
    catch(err){
        return res
        .status(400)
        .json({ status: false, status_code: 400, error: err.message });
    }
}

module.exports = {getGame}