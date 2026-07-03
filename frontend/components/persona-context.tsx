"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
}

interface PersonaContextType {
  selectedPersona: Persona | null;
  setSelectedPersona: (persona: Persona) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  return (
    <PersonaContext.Provider value={{ selectedPersona, setSelectedPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
}