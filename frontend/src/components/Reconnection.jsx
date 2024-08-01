// import { getDB } from "../../../backend/Configs/mongoConnection";
import api from '../api';

const reconnectingUser = async (token, gameId) => {
    try{
        const response = await api.post("/gambit/userinfo",{
            token : token
        });

        if(!response.data.status){
            return response;
            // status, status_code, error
        }
        const user = response.data.user;
        
        const gameRes = await api.post("/gambit/getgame",{
            gameId : gameId,
        })

        if(!gameRes.data.status){
            return gameRes
        }

        const player1 = gameRes.data.game.player1;
        const player2 = gameRes.data.game.player2;
        const player = user.email;

        if(player === player1 || player === player2){
            return{
                status : true,
                fen : gameRes.data.game.gameState,
                color : player===player1?'w':'b',
                player : player
            }
        }
    }
    catch(err){
        return{
            status : false,
            error : err.message
        }
    }
}

export default reconnectingUser;