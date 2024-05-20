const {MongoClient} = require('mongodb');
let db;

async function connectToDB(uri){
    const client = new MongoClient(uri);
    try{
        await client.connect();
        db = client.db("gambit");
    }
    catch(error){
        console.error;
    }
}

async function getDB(){
    return db;
}

module.exports = {
    connectToDB,
    getDB
}