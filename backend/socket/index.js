import { Server } from "socket.io";
import { chatEvents } from "./chat.js";
import { socketAuthMiddleware } from "../middlewares/socket-auth.js";

export function initializeSocket(io) {
  
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.id} (clerk: ${socket.data.clerkId})`);

    chatEvents(socket);

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
}