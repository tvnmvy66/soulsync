export type PersonaId = "piyush-garg" | "hitesh-choudhary";

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  avatar: string;
}

// Only these two personas will ever exist. Adding a third means updating
// this map — every other file derives from it, nothing else hardcodes ids.
export const PERSONAS: Record<PersonaId, Persona> = {
  "piyush-garg": {
    id: "piyush-garg",
    name: "Piyush Garg",
    tagline: "Web Dev Mentor",
    avatar: "/piyush-garg.jpg",
  },
  "hitesh-choudhary": {
    id: "hitesh-choudhary",
    name: "Hitesh Choudhary",
    tagline: "Coding Educator",
    avatar: "/hitesh-choudhary.jpg",
  },
};

export const PERSONA_LIST: Persona[] = Object.values(PERSONAS);

export function getPersona(id: PersonaId | null | undefined): Persona | null {
  if (!id) return null;
  return PERSONAS[id] ?? null;
}

export function isPersonaId(id: string | null | undefined): id is PersonaId {
  return id === "piyush-garg" || id === "hitesh-choudhary";
}