import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import connectDB from "./config/db";
import { initializeSocket } from "./socket/index";

const PORT = process.env.PORT || 4000;

async function main() {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  initializeSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

main();