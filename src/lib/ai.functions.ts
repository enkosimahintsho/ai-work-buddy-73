import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runAssistant, runChat } from "./ai.server";

const AssistantInput = z.object({
  feature: z.enum(["email", "notes", "planner", "research"]),
  prompt: z.string().min(1).max(20000),
});

export const generateAssistantOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistantInput.parse(input))
  .handler(async ({ data }) => runAssistant(data.feature, data.prompt));

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => runChat(data.messages));
