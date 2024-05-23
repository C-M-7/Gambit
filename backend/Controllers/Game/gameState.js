const { getDB } = require("../../Configs/mongoConnection");

const handleGameState = async () =>{
    try{
        const db = await getDB();
        
    }
    catch(err){
        return new Error(err.message);
    }
}

module.exports = {handleGameState};