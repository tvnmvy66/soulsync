import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { initializeSocket } from "./socket";
import connectdb from "./config/db"

await connectdb();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});