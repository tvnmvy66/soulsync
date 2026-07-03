import openaiClient from "../libs/openai"
import SYSTEM_PROMPT from "../prompts/system-prompt"
import { type ChatMessage } from "../types/chat"

async function generateResponse(payload: ChatMessage): Promise<string> {

    const response = await openaiClient.chat.completions.create({
        model: "gpt-5.5",
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT,
            },
            {   
                role: "user",
                content: payload.message,
            },
        ]
    });

    return response.choices[0]!.message.content || "OpenAI did not return a response.";
}

export { generateResponse };