// Importing code
const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const urlRoute = require('./Routes/route.js');
const socketControl = require('./Sockets/socketControl.js');
const { connectToDB } = require('./Configs/mongoConnection.js');
const { authenticateSocket } = require('./Middlewares/authenticateSocket.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Initializing Code
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:true,
        credentials:true
    }
});

// Middlewares
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());

// Routing code

app.use('/gambit', urlRoute);

// authenticate socket 
io.use(authenticateSocket);

// Connection to db
const mongo_uri = process.env.mongodb_uri;
connectToDB(mongo_uri).then(() => console.log("MongoDB Connected"));

// Initializing the game code(Socket.io)
socketControl(io); 
  
server.listen(7000, () => console.log("server started at 7000"));