import { Message } from "../models/message.js";

async function getOrCreateConversation(
  userId,
  persona
) {
  const existing = await Message.findOne({ user: userId, persona });
  if (existing) return existing;

  return Message.create({ user: userId, persona, messages: [] });
}

export async function appendMessage(
  userId,
  persona,
  role,
  content
){
  const conversation = await getOrCreateConversation(userId, persona);

  conversation.messages.push({ role, message: content, timestamp: new Date() });
  await conversation.save();

  const saved = conversation.messages[conversation.messages.length - 1];

  return {
    id: String(saved._id),
    role: saved.role,
    content: saved.message,
    createdAt: (saved.timestamp ?? new Date()).getTime(),
  };
}

export async function getHistory(
  userId,
  persona
){
  const conversation = await Message.findOne({ user: userId, persona });
  if (!conversation) return [];

  return conversation.messages.map((m) => ({
    id: String(m._id),
    role: m.role,
    content: m.message,
    createdAt: (m.timestamp ?? new Date()).getTime(),
  }));
}