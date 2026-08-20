import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckSquare,
  Mail,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import { AiDisclaimer, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work: draft emails, summarize meetings, plan tasks, research topics and chat with an AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "A calm, professional dashboard for AI-assisted emails, meeting notes, task planning and research.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Tone and audience-aware drafts, ready to send in seconds.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Key points, owners, action items and deadlines from raw notes.",
  },
  {
    to: "/planner",
    icon: Sparkles,
    title: "AI Task Planner",
    body: "Prioritized order plus a realistic time-blocked schedule.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Executive summaries, insights, trade-offs and next steps.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "Assistant Chat",
    body: "A conversational partner for everyday work questions.",
  },
  {
    to: "/tasks",
    icon: CheckSquare,
    title: "My Tasks",
    body: "Capture tasks, group by category and track completion.",
  },
] as const;

function Dashboard() {
  const { tasks } = useTasks();
  const open = tasks.filter((t) => !t.done).length;
  const done = tasks.filter((t) => t.done).length;

  return (
    <div>
      <section className="surface-sky mb-8 rounded-2xl p-6 shadow-soft lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Workplace AI
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight lg:text-4xl">
          Automate the busywork in your day
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Five focused AI tools for professionals — drafting, summarizing, planning,
          researching and thinking out loud.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/email">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Open assistant</Link>
          </Button>
        </div>
        <AiDisclaimer className="mt-6" />
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open tasks", value: open },
          { label: "Completed tasks", value: done },
          { label: "AI tools available", value: 5 },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-soft">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <PageHeader
        title="Your toolkit"
        description="Pick a workflow and the assistant handles the structure, tone and formatting."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-shadow shadow-soft group-hover:shadow-lift">
              <CardHeader>
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
