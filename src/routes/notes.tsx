import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { AiOutputCard } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssistant } from "@/lib/use-assistant";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into key points, owners, action items and deadlines with AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI" },
      {
        property: "og:description",
        content: "Extract decisions, actions and deadlines from any meeting transcript.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const { text, error, loading, generate } = useAssistant("notes");

  function submit() {
    if (!notes.trim()) return;
    generate(
      [
        `MEETING: ${title || "untitled meeting"}`,
        `ATTENDEES: ${attendees || "not specified"}`,
        `RAW NOTES / TRANSCRIPT:`,
        notes,
      ].join("\n"),
    );
  }

  return (
    <div>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. You get a summary, key points, owners, action items and deadlines."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Meeting input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Weekly product sync"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input
                  id="attendees"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="Ayanda, Priya, Tom"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Raw notes or transcript</Label>
              <Textarea
                id="notes"
                rows={14}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste everything, however messy…"
              />
            </div>
            <Button onClick={submit} disabled={loading || !notes.trim()} className="w-full">
              <ListChecks className="size-4" />
              {loading ? "Summarizing…" : "Summarize meeting"}
            </Button>
          </CardContent>
        </Card>

        <AiOutputCard
          title="Structured summary"
          text={text}
          loading={loading}
          error={error}
          emptyHint="Summary, key points, action items and deadlines will appear here."
        />
      </div>
    </div>
  );
}
