"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  persona?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export function ChatBox({ persona }: any) {
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const messages = useChatStore((s) => s.messagesByPersona[persona ?? ""] ?? []);
  const addMessage = useChatStore((s) => s.addMessage);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasHydrated = useChatStore((s) => s.hasHydrated);
  if (!hasHydrated) return null; // or a skeleton
  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Auto-grow the textarea as the user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    // Replace with your actual API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "This is a placeholder reply — wire this up to your API.",
        },
      ]);
      setIsSending(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#232221] text-zinc-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        {persona ? (
          <>
            <Avatar className="h-8 w-8 ring-1 ring-white/10">
              <AvatarImage src={persona.avatar} className="object-cover" />
              <AvatarFallback className="bg-zinc-700 text-xs text-white">
                AI
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium text-white">{persona.name}</p>
          </>
        ) : (
          <p className="text-sm font-medium text-zinc-400">Select a persona to start chatting</p>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-6 py-6"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-zinc-500">
            <Sparkles className="h-6 w-6" />
            <p className="text-sm">Start the conversation whenever you're ready.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-white text-black"
                    : "bg-white/10 text-zinc-100"
                )}
              >
                {message.content}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl bg-white/10 px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#1b1a19] px-4 py-3 transition-colors duration-200 focus-within:border-white/30">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message..."
            className="max-h-40 flex-1 resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <Button
            size="icon"
            disabled={!input.trim() || isSending}
            onClick={handleSend}
            className="h-8 w-8 shrink-0 rounded-full bg-white text-black transition-transform duration-200 hover:scale-105 hover:bg-zinc-200 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}