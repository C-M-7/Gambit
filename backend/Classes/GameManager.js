class GameManager{
    constructor(){
        this.liveGames = new Map();
    }

    addGame(gameId, game){
        this.liveGames.set(gameId, game);
    }

    getGame(gameId){
        if(!this.liveGames.has(gameId)) return false;
        return this.liveGames.get(gameId);
    }

}

module.exports = GameManager;