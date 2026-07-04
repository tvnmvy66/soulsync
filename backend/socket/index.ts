import { Server } from "socket.io";
import { chatEvents } from "./chat";
import { socketAuthMiddleware } from "../middlewares/socket-auth";

export function initializeSocket(io: Server) {
  
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.id} (clerk: ${socket.data.clerkId})`);

    chatEvents(socket);

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
}