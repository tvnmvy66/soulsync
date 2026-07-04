import openaiClient from "../libs/openai.js";
import { getSystemPrompt } from "../prompts/system-prompt.js";


const MODEL = "gpt-4o-mini";

export async function generateResponse(
  personaId,
  history
) {
  const response = await openaiClient.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: getSystemPrompt(personaId) },
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ],
  });

  return (
    response.choices[0]?.message.content ||
    "Sorry, I couldn't come up with a response just now."
  );
}