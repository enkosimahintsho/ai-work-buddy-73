import { useCallback, useEffect, useState } from "react";

export const CATEGORIES = ["Work", "Personal", "Admin", "Ideas"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Task = {
  id: string;
  title: string;
  category: Category;
  done: boolean;
  createdAt: number;
};

const KEY = "wpa-tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw) as Task[]);
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const addTask = useCallback((title: string, category: Category) => {
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        done: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  return { tasks, hydrated, addTask, toggleTask, removeTask, clearCompleted };
}
