import { Socket } from "socket.io";
import { generateResponse } from "../services/responses.services";
import { type ChatMessage } from "../types/chat";

export function chatEvents(socket: Socket) {
  socket.on("chat-message", async (payload: ChatMessage) => {
    console.log(`${socket.id} - ${payload.persona} : ${payload.message}`);
    try {
      const res = await generateResponse(payload);
      socket.emit("chat-response", res);
    } catch (error: any) {
      console.error("Error generating response:", error.message);
      socket.emit("chat-error", error.message || "An error occurred while generating the response.");
    }
  });
}