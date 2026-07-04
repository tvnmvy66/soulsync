import type mongoose from "mongoose";
import { Message } from "../models/message";
import type { PersonaId } from "../types/persona";
import type { ChatMessage } from "../types/chat";

async function getOrCreateConversation(
  userId: mongoose.Types.ObjectId,
  persona: PersonaId
) {
  const existing = await Message.findOne({ user: userId, persona });
  if (existing) return existing;

  return Message.create({ user: userId, persona, messages: [] });
}

export async function appendMessage(
  userId: mongoose.Types.ObjectId,
  persona: PersonaId,
  role: "user" | "assistant",
  content: string
): Promise<ChatMessage> {
  const conversation = await getOrCreateConversation(userId, persona);

  conversation.messages.push({ role, message: content, timestamp: new Date() });
  await conversation.save();

  const saved = conversation.messages[conversation.messages.length - 1]!;

  return {
    id: String(saved._id),
    role: saved.role as "user" | "assistant",
    content: saved.message,
    createdAt: (saved.timestamp ?? new Date()).getTime(),
  };
}

export async function getHistory(
  userId: mongoose.Types.ObjectId,
  persona: PersonaId
): Promise<ChatMessage[]> {
  const conversation = await Message.findOne({ user: userId, persona });
  if (!conversation) return [];

  return conversation.messages.map((m) => ({
    id: String(m._id),
    role: m.role as "user" | "assistant",
    content: m.message,
    createdAt: (m.timestamp ?? new Date()).getTime(),
  }));
}