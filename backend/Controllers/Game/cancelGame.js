const { getDB } = require("../../Configs/mongoConnection");

const handleCancelgame = async (req, res) => {
  try {
    const db = await getDB();
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "GameId not found",
      });
    }

    const game = await db.collection("games").findOneAndDelete({gameId : gameId});

    if(game.gameId !== gameId){
        return res.status(400).json({
            status: false,
            status_code: 400,
            error: "Game not found",
          });
    }

    return res.status(200).json({
        status : true,
        staus_code : 200,
        result : "Game deleted successfully!"
    })
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, status_code: 400, error: err.message });
  }
};

module.exports = handleCancelgame;
