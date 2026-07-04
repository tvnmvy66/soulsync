import { clerkClient } from "@clerk/express";
import { getOrCreateUser } from "../services/user.services.js";
import { appendMessage, getHistory } from "../services/message.services.js";
import { generateResponse } from "../services/responses.services.js";
import { isPersonaId } from "../types/persona.js";

async function resolveUser(socket) {
  if (socket.data.user) return socket.data.user;

  const clerkUser = await clerkClient.users.getUser(socket.data.clerkId);
  const user = await getOrCreateUser({
    clerkId: clerkUser.id,
    name:
      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
      "Anonymous",
    email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
    avatar: clerkUser.imageUrl,
  });

  socket.data.user = user;
  return user;
}

function roomFor(clerkId, personaId) {
  return `${clerkId}:${personaId}`;
}

function emitToRoom(socket, room, payload) {
  socket.nsp.to(room).emit("message", payload);
}

export function chatEvents(socket) {
  
  socket.on("join", ({ personaId }) => {
    if (!isPersonaId(personaId)) return;
    socket.join(roomFor(socket.data.clerkId, personaId));
  });

  socket.on("message", async (payload) => {
    const { personaId, content } = payload ?? {};

    if (!isPersonaId(personaId) || !content?.trim()) {
      socket.emit("chat-error", "Invalid message payload.");
      return;
    }

    const room = roomFor(socket.data.clerkId, personaId);
    
    socket.join(room);

    console.log(`${socket.id} - ${personaId}: ${content}`);

    try {
      const user = await resolveUser(socket);

      const userMessage = await appendMessage(user._id, personaId, "user", content.trim());
      
      const history = await getHistory(user._id, personaId);
      const replyContent = await generateResponse(personaId, history);

      const assistantMessage = await appendMessage(user._id, personaId, "assistant", replyContent);
      emitToRoom(socket, room, { personaId, message: assistantMessage });
    } catch (error) {
      console.error("Error generating response:", error.message);
      socket.emit(
        "chat-error",
        error.message || "An error occurred while generating the response."
      );
    }
  });
}