import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, SendHorizontal } from "lucide-react";
import { AiDisclaimer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendChatMessage } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for quick answers, drafting help and decision support.",
      },
      { property: "og:title", content: "Assistant Chat | Workplace AI" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday work questions.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this update so it sounds more confident",
  "How do I run a 30-minute retrospective?",
  "Help me say no to a low-priority request",
];

function ChatPage() {
  const send = useServerFn(sendChatMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const result = await send({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: result.text }]);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? `The assistant could not reply: ${e.message}`
          : "The assistant could not reply. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <PageHeader
        title="Assistant Chat"
        description="Ask anything about your work day — drafting, planning, prioritizing or thinking a problem through."
      />

      <Card className="flex min-h-[26rem] flex-1 flex-col shadow-soft">
        <CardContent className="flex flex-1 flex-col gap-4 pt-6">
          <div className="flex-1 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="surface-sky rounded-xl p-5">
                <p className="text-sm font-medium">Try one of these to get started</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => submit(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "ai-output max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-foreground"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Assistant is thinking…
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex gap-2 border-t border-border pt-4"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the assistant…"
              aria-label="Message"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <SendHorizontal className="size-4" />
              Send
            </Button>
          </form>
          <AiDisclaimer />
        </CardContent>
      </Card>
    </div>
  );
}
