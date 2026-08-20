import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { AiOutputCard } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional work emails in seconds with tone and audience controls powered by AI.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI" },
      {
        property: "og:description",
        content: "Generate polished, audience-aware work emails with AI.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Formal"];
const AUDIENCES = [
  "Manager",
  "Client",
  "Teammate",
  "Direct report",
  "Executive leadership",
  "External vendor",
];
const LENGTHS = ["Short", "Standard", "Detailed"];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const { text, error, loading, generate } = useAssistant("email");

  function submit() {
    if (!purpose.trim()) return;
    generate(
      [
        `PURPOSE: ${purpose}`,
        `AUDIENCE: ${audience}`,
        `TONE: ${tone}`,
        `LENGTH: ${length}`,
        `CONTEXT AND DETAILS: ${details || "none provided"}`,
      ].join("\n"),
    );
  }

  return (
    <div>
      <PageHeader
        title="Smart Email Generator"
        description="Describe what you need to say. The assistant adapts wording, structure and tone to your audience."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">What is the email about?</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Request a two-day deadline extension for the Q3 report"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Key points to include</Label>
              <Textarea
                id="details"
                rows={6}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Blocked on data from finance, new date 12 Sep, offer interim summary"
              />
            </div>
            <Button onClick={submit} disabled={loading || !purpose.trim()} className="w-full">
              <Wand2 className="size-4" />
              {loading ? "Drafting…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <AiOutputCard
          title="Draft"
          text={text}
          loading={loading}
          error={error}
          emptyHint="Your generated email will appear here, ready to copy into your mail client."
        />
      </div>
    </div>
  );
}
