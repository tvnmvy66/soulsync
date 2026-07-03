import { Server } from "socket.io";
import { chatEvents } from "./chat";

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.id}`);

    chatEvents(socket);

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
}