// lib/socket.ts
import { io } from "socket.io-client";
import { useChatStore } from "@/stores/chat-store";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  autoConnect: false,
});

socket.on("connect", () => useChatStore.getState().setSocketStatus("connected"));
socket.on("disconnect", () => useChatStore.getState().setSocketStatus("disconnected"));

socket.on("message", (msg: { personaId: string; message: Message }) => {
  useChatStore.getState().addMessage(msg.personaId, msg.message);
});