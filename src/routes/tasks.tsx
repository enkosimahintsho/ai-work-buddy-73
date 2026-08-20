import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES, useTasks, type Category } from "@/lib/tasks";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "My Tasks | Workplace AI" },
      {
        name: "description",
        content:
          "A calm, minimal task manager: add tasks, organize them by category and check them off.",
      },
      { property: "og:title", content: "My Tasks | Workplace AI" },
      {
        property: "og:description",
        content: "Add, categorize and complete your daily work tasks.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, hydrated, addTask, toggleTask, removeTask, clearCompleted } = useTasks();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Work");
  const [filter, setFilter] = useState<"All" | Category>("All");

  const visible = useMemo(
    () => (filter === "All" ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter],
  );
  const completed = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, category);
    setTitle("");
  }

  return (
    <div>
      <PageHeader
        title="My Tasks"
        description="Capture work as it lands, group it by category and keep momentum visible."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a task…"
                  aria-label="Task title"
                />
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as Category)}
                >
                  <SelectTrigger className="sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={!title.trim()}>
                  <Plus className="size-4" />
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <Button
                key={c}
                size="sm"
                variant={filter === c ? "default" : "outline"}
                onClick={() => setFilter(c)}
                className="rounded-full"
              >
                {c}
              </Button>
            ))}
          </div>

          <Card className="shadow-soft">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                {filter === "All" ? "All tasks" : filter}
              </CardTitle>
              {completed > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Clear completed
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!hydrated ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-2/3" />
                </div>
              ) : visible.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nothing here yet. Add your first task above.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {visible.map((task) => (
                    <li key={task.id} className="flex items-center gap-3 py-3">
                      <Checkbox
                        checked={task.done}
                        onCheckedChange={() => toggleTask(task.id)}
                        aria-label={`Mark ${task.title} as ${task.done ? "incomplete" : "complete"}`}
                      />
                      <span
                        className={
                          task.done
                            ? "flex-1 text-sm text-muted-foreground line-through"
                            : "flex-1 text-sm"
                        }
                      >
                        {task.title}
                      </span>
                      <Badge variant="secondary">{task.category}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold">
                  {completed}/{tasks.length}
                </span>
              </div>
              <Progress value={pct} className="mt-2" />
            </div>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c} className="flex justify-between text-muted-foreground">
                  <span>{c}</span>
                  <span>{tasks.filter((t) => t.category === c && !t.done).length} open</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
