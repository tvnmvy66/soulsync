"use client";

import { ChatBox } from "@/components/chatbox";
import { useChatStore } from "@/stores/chat-store";

export default function Home() {
  const selectedPersonaId = useChatStore((s) => s.selectedPersonaId);

  return (
    <div className="h-screen bg-amber-100">
      <ChatBox persona={selectedPersonaId ?? undefined} />
    </div>
  );
}