class Game{
    constructor(gameId){
        this.gameId = gameId;
    }

    addP1(p1){
        this.p1 = p1;
    }

    addP2(p2){
        this.p2 = p2;
    }
}

module.exports = Game;