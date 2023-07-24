import express from 'express';
import {connectDB} from './config/database.js'
import bodyParser from 'body-parser';
import apiRoutes from './routes/index.js'
import cors from 'cors'
import { PORT } from './config/serverConfig.js';
import http from 'http'
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
  });

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('FromAPI', (msg) => {
        io.emit('FromAPI', msg);
    });

    getApiAndEmit(socket);

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });

});


const getApiAndEmit = (socket) => {
    const response = 'response you need';
    socket.emit('FromAPI', response);
  };
// const socket = io();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())
app.use('/api', apiRoutes)


server.listen(PORT, async ()=>{
    console.log("server started at port", PORT);
    await connectDB();
    console.log("Mongodb connect");
})