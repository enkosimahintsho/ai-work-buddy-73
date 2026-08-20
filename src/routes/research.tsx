import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { AiOutputCard } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssistant } from "@/lib/use-assistant";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Get executive summaries, key insights, trade-offs and next steps on any work topic.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "Structured insights and summaries for business decisions.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick brief", "Balanced analysis", "Deep dive"];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<string>("Balanced analysis");
  const { text, error, loading, generate } = useAssistant("research");

  function submit() {
    if (!topic.trim()) return;
    generate([`DEPTH: ${depth}`, `TOPIC OR QUESTION:`, topic].join("\n"));
  }

  return (
    <div>
      <PageHeader
        title="AI Research Assistant"
        description="Ask a work question and get a structured brief with insights, trade-offs and verification gaps."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Research request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Textarea
                id="topic"
                rows={8}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="How should a 40-person services firm approach AI adoption over the next two quarters?"
              />
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={submit} disabled={loading || !topic.trim()} className="w-full">
              <Search className="size-4" />
              {loading ? "Researching…" : "Run research"}
            </Button>
          </CardContent>
        </Card>

        <AiOutputCard
          title="Research brief"
          text={text}
          loading={loading}
          error={error}
          emptyHint="Executive summary, insights, trade-offs and next steps will appear here."
        />
      </div>
    </div>
  );
}
