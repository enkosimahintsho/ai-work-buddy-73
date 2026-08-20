import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateAssistantOutput } from "@/lib/ai.functions";

type Feature = "email" | "notes" | "planner" | "research";

export function useAssistant(feature: Feature) {
  const run = useServerFn(generateAssistantOutput);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate(prompt: string) {
    setLoading(true);
    setError(null);
    setText(null);
    try {
      const result = await run({ data: { feature, prompt } });
      setText(result.text);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? `Could not generate a response: ${e.message}`
          : "Could not generate a response. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return { text, error, loading, generate };
}
