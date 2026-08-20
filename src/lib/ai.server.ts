import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { SYSTEM_PROMPTS, type FeatureKey } from "./prompts.server";

const MODEL = "google/gemini-3.7-flash";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing API key).");
  return createLovableAiGatewayProvider(key);
}

export async function runAssistant(feature: FeatureKey, prompt: string) {
  const result = streamText({
    model: gateway()(MODEL),
    system: SYSTEM_PROMPTS[feature],
    prompt,
  });
  return { text: await result.text };
}

export async function runChat(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
) {
  const result = streamText({
    model: gateway()(MODEL),
    system: SYSTEM_PROMPTS.chat,
    messages,
  });
  return { text: await result.text };
}
