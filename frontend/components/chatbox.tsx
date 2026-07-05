"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore, type Message } from "@/stores/chat-store";
import { getPersona } from "@/lib/personas";
import {
  connectSocket,
  disconnectSocket,
  joinPersonaRoom,
  sendSocketMessage,
} from "@/lib/socket";

// Stable reference so the selector below never returns a "new" empty array
// on renders where there's no persona/history yet — returning a fresh []
// literal every call makes Zustand think the snapshot changed every time,
// which is what caused the infinite update loop.
const EMPTY_MESSAGES: Message[] = [];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// No props needed — the selected persona lives in the Zustand store, so
// this component is always in sync with the sidebar without prop drilling.
export function ChatBox() {
  const selectedPersonaId = useChatStore((s) => s.selectedPersonaId);
  const messages = useChatStore((s) =>
    selectedPersonaId ? s.messagesByPersona[selectedPersonaId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES
  );
  const addMessage = useChatStore((s) => s.addMessage);
  const fetchMessageHistory = useChatStore((s) => s.fetchMessageHistory);
  const isHistoryLoading = useChatStore((s) => s.isHistoryLoading);
  const hasHydrated = useChatStore((s) => s.hasHydrated);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { getToken } = useAuth();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Connect the socket once for the lifetime of the chat view. The effect
  // callback itself stays synchronous — useEffect can't take an async
  // function directly, since a Promise return breaks React's cleanup
  // mechanism. connectSocket takes getToken itself and calls it fresh
  // before every (re)connection attempt, so we don't need to await
  // anything here.
  useEffect(() => {
    connectSocket(getToken);
    return () => disconnectSocket();
  }, [getToken]);

  // Join the persona's room and pull its history whenever selection changes.
  useEffect(() => {
    if (!selectedPersonaId) return;
    joinPersonaRoom(selectedPersonaId);
    (async () => {
      const token = await getToken();
      fetchMessageHistory(selectedPersonaId, token);
    })();
  }, [selectedPersonaId, fetchMessageHistory]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Auto-grow the textarea as the user types.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  // The assistant's reply arrives over the socket (which already writes it
  // into the store) — clear the typing indicator once it lands.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") setIsSending(false);
  }, [messages]);

  // All hooks are called above this line, unconditionally, before any
  // early return — required by the rules of hooks.
  if (!hasHydrated) return null; // or a skeleton

  const persona = getPersona(selectedPersonaId);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending || !selectedPersonaId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    addMessage(selectedPersonaId, userMessage);
    sendSocketMessage(selectedPersonaId, trimmed);
    setInput("");
    setIsSending(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#0b141a] text-zinc-200">
      {/* Header — avatar + name only, no video/search/menu icons */}
      <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-2.5 shadow-sm">
        {persona ? (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={persona.avatar} className="object-cover" />
              <AvatarFallback className="bg-zinc-700 text-xs text-white">
                AI
              </AvatarFallback>
            </Avatar>
            <p className="text-[15px] font-medium text-white">{persona.name}</p>
          </>
        ) : (
          <p className="text-[15px] font-medium text-zinc-400">
            Select a persona to start chatting
          </p>
        )}
      </div>

      {/* Messages — WhatsApp-style doodle background + bubble tails */}
      <div
        ref={scrollRef}
        className="relative flex-1 space-y-1.5 overflow-y-auto px-4 py-4 sm:px-10 md:px-16"
        style={{
          backgroundColor: "#0b141a",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.035' stroke-width='1.2'%3E%3Ccircle cx='20' cy='20' r='10'/%3E%3Cpath d='M55 15 L65 25 L55 35 L45 25 Z'/%3E%3Cpath d='M80 60 q10 -10 20 0 t0 20'/%3E%3Cpath d='M10 70 l10 15 h-20 z'/%3E%3Ccircle cx='75' cy='15' r='5'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      >
        {isHistoryLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-zinc-500">
            <p className="text-sm">Loading conversation…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-zinc-500">
            <p className="text-sm">
              {persona
                ? "Start the conversation whenever you're ready."
                : "Pick a persona from the sidebar to get started."}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "relative max-w-[75%] rounded-lg px-2.5 pb-1.5 pt-1.5 text-[14.5px] leading-[1.35] shadow-sm",
                    isUser
                      ? "rounded-tr-none bg-[#005c4b] text-zinc-50"
                      : "rounded-tl-none bg-[#1f2c34] text-zinc-50"
                  )}
                >
                  <span className="whitespace-pre-wrap wrap-break-words">{message.content}</span>
                  <span
                    className={cn(
                      "float-right ml-2 mt-1 flex translate-y-1 items-center gap-1 text-[11px] text-zinc-300/70",
                    )}
                  >
                    {formatTime(message.createdAt)}
                    {isUser && <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-lg rounded-tl-none bg-[#1f2c34] px-3 py-2.5 shadow-sm">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input — just a textarea and a send button, nothing else */}
      <div className="flex items-end gap-2 bg-[#1f2c34] px-3 py-2.5">
        <div className="flex flex-1 items-center rounded-3xl bg-[#2a3942] px-4 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={persona ? "Type a message" : "Select a persona first..."}
            disabled={!persona}
            className="max-h-40 w-full resize-none bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="button"
          disabled={!input.trim() || isSending || !persona}
          onClick={handleSend}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}