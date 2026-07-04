import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket/index.js";

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