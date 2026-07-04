export type PersonaId = "piyush-garg" | "hitesh-choudhary";

export const PERSONA_IDS: PersonaId[] = ["piyush-garg", "hitesh-choudhary"];

export function isPersonaId(value: unknown): value is PersonaId {
  return value === "piyush-garg" || value === "hitesh-choudhary";
}