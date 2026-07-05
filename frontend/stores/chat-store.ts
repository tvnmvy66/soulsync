import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PersonaId } from "@/lib/personas";
// ❌ removed: import { useAuth } from "@clerk/nextjs";
// ❌ removed: const { getToken } = useAuth();

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface ChatState {
  selectedPersonaId: PersonaId | null;
  messagesByPersona: Partial<Record<PersonaId, Message[]>>;
  historyLoadedFor: Partial<Record<PersonaId, boolean>>;
  isHistoryLoading: boolean;
  socketStatus: "idle" | "connecting" | "connected" | "disconnected";
  hasHydrated: boolean;

  setSelectedPersona: (id: PersonaId) => void;
  addMessage: (personaId: PersonaId, message: Message) => void;
  setMessages: (personaId: PersonaId, messages: Message[]) => void;
  setSocketStatus: (status: ChatState["socketStatus"]) => void;
  setHasHydrated: (state: boolean) => void;
  setHistoryLoading: (loading: boolean) => void;
  markHistoryLoaded: (personaId: PersonaId) => void;
  // 👇 now takes the token as a param instead of calling getToken() itself
  fetchMessageHistory: (personaId: PersonaId, token: string | null) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      selectedPersonaId: null,
      messagesByPersona: {},
      historyLoadedFor: {},
      isHistoryLoading: false,
      socketStatus: "idle",
      hasHydrated: false,

      setSelectedPersona: (id) => set({ selectedPersonaId: id }),

      addMessage: (personaId, message) =>
        set((state) => ({
          messagesByPersona: {
            ...state.messagesByPersona,
            [personaId]: [...(state.messagesByPersona[personaId] ?? []), message],
          },
        })),

      setMessages: (personaId, messages) =>
        set((state) => ({
          messagesByPersona: { ...state.messagesByPersona, [personaId]: messages },
        })),

      setSocketStatus: (status) => set({ socketStatus: status }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setHistoryLoading: (loading) => set({ isHistoryLoading: loading }),

      markHistoryLoaded: (personaId) =>
        set((state) => ({
          historyLoadedFor: { ...state.historyLoadedFor, [personaId]: true },
        })),

      fetchMessageHistory: async (personaId, token) => {
        if (get().historyLoadedFor[personaId]) return;

        get().setHistoryLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/message-history?personaId=${personaId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          if (!res.ok) {
            throw new Error(`Failed to fetch message history: ${res.status}`);
          }

          const data: Message[] = await res.json();
          get().setMessages(personaId, data);
          get().markHistoryLoaded(personaId);
        } catch (err) {
          console.error("[chat-store] fetchMessageHistory failed:", err);
        } finally {
          get().setHistoryLoading(false);
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedPersonaId: state.selectedPersonaId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);