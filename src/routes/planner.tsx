import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { AiOutputCard } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssistant } from "@/lib/use-assistant";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Prioritize and schedule your workday with an AI planner that weighs impact, urgency and deadlines.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI" },
      {
        property: "og:description",
        content: "Turn a messy to-do list into a prioritized, time-blocked plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("7");
  const [window, setWindow] = useState("09:00–17:00");
  const [constraints, setConstraints] = useState("");
  const { text, error, loading, generate } = useAssistant("planner");

  function submit() {
    if (!tasks.trim()) return;
    generate(
      [
        `WORKING WINDOW: ${window}`,
        `AVAILABLE FOCUS HOURS: ${hours}`,
        `CONSTRAINTS: ${constraints || "none provided"}`,
        `TASK LIST:`,
        tasks,
      ].join("\n"),
    );
  }

  return (
    <div>
      <PageHeader
        title="AI Task Planner"
        description="Drop in everything on your plate. The planner scores impact and urgency, then builds a realistic schedule."
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Your workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="window">Working window</Label>
                <Input
                  id="window"
                  value={window}
                  onChange={(e) => setWindow(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Focus hours available</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={16}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks, one per line</Label>
              <Textarea
                id="tasks"
                rows={10}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Finish Q3 report (due Friday)\nReview 3 PRs\nPrep client demo\nExpense claims"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constraints">Constraints and meetings</Label>
              <Textarea
                id="constraints"
                rows={4}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Standup 09:15, client call 14:00–15:00, leaving early Thursday"
              />
            </div>
            <Button onClick={submit} disabled={loading || !tasks.trim()} className="w-full">
              <CalendarClock className="size-4" />
              {loading ? "Planning…" : "Build my plan"}
            </Button>
          </CardContent>
        </Card>

        <AiOutputCard
          title="Prioritized plan"
          text={text}
          loading={loading}
          error={error}
          emptyHint="Priority order, a suggested schedule and what to defer will appear here."
        />
      </div>
    </div>
  );
}
