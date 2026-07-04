import { io, type Socket } from "socket.io-client";
import { useChatStore, type Message } from "@/stores/chat-store";
import type { PersonaId } from "@/lib/personas";

interface ServerToClientEvents {
  message: (payload: { personaId: PersonaId; message: Message }) => void;
}

interface ClientToServerEvents {
  join: (payload: { personaId: PersonaId }) => void;
  message: (payload: { personaId: PersonaId; content: string }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL!,
  { autoConnect: false }
);

socket.on("connect", () => useChatStore.getState().setSocketStatus("connected"));
socket.on("disconnect", () => useChatStore.getState().setSocketStatus("disconnected"));
socket.on("connect_error", () => useChatStore.getState().setSocketStatus("disconnected"));

// Incoming chat messages (assistant replies, or messages from another tab)
// land straight in the store.
socket.on("message", ({ personaId, message }) => {
  useChatStore.getState().addMessage(personaId, message);
});

export function connectSocket() {
  if (socket.connected) return;
  useChatStore.getState().setSocketStatus("connecting");
  socket.connect();
}

export function disconnectSocket() {
  if (!socket.connected) return;
  socket.disconnect();
}

export function joinPersonaRoom(personaId: PersonaId) {
  socket.emit("join", { personaId });
}

export function sendSocketMessage(personaId: PersonaId, content: string) {
  socket.emit("message", { personaId, content });
}