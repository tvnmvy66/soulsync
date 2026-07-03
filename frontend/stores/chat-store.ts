import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: number;
}

interface ChatState {
    selectedPersonaId: string | null;
    messagesByPersona: Record<string, Message[]>;
    socketStatus: "idle" | "connecting" | "connected" | "disconnected";
    hasHydrated: boolean;

    setSelectedPersona: (id: string) => void;
    addMessage: (personaId: string, message: Message) => void;
    setMessages: (personaId: string, messages: Message[]) => void;
    setSocketStatus: (status: ChatState["socketStatus"]) => void;
    setHasHydrated: (state: boolean) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            selectedPersonaId: null,
            messagesByPersona: {},
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
        }),
        {
            name: "chat-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ messagesByPersona: state.messagesByPersona }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);