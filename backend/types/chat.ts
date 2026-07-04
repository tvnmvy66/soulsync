import type { PersonaId } from "./persona";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface JoinPayload {
  personaId: PersonaId;
}

export interface IncomingChatPayload {
  personaId: PersonaId;
  content: string;
}

export interface OutgoingChatPayload {
  personaId: PersonaId;
  message: ChatMessage;
}