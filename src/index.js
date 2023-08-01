import express from "express";
import { connectDB } from "./config/database.js";
import bodyParser from "body-parser";
import apiRoutes from "./routes/index.js";
import cors from "cors";
import { PORT } from "./config/serverConfig.js";
import http from "http";
import { Server } from "socket.io";
import socketHandlers from "./socket.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User with id: " + socket.id + " has connected");
  socketHandlers(socket);
});

// const socket = io();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use("/api", apiRoutes);

server.listen(PORT, async () => {
  console.log("server started at port", PORT);
  await connectDB();
  console.log("Mongodb connect");
});
