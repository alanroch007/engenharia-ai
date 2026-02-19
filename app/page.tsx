"use client";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
};
type Task = { id: string; title: string; projectId: string; status?: string };

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projTitle, setProjTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  async function fetchData() {
    const [pjRes, tRes] = await Promise.all([fetch("/api/projects"), fetch("/api/tasks")]);
    const [pjJson, tJson] = await Promise.all([pjRes.json(), tRes.json()]);
    setProjects(pjJson || []);
    setTasks(tJson || []);
    if (!selectedProject && (pjJson || []).length > 0) setSelectedProject(pjJson[0].id);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projTitle.trim()) return;
    const res = await fetch("/api/projects", { method: "POST", body: JSON.stringify({ title: projTitle }) });
    if (res.ok) {
      setProjTitle("");
      fetchData();
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedProject) return;
    const res = await fetch("/api/tasks", { method: "POST", body: JSON.stringify({ title: taskTitle, projectId: selectedProject }) });
    if (res.ok) {
      setTaskTitle("");
      fetchData();
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">Painel — Gestão de Obras (Mínimo)</h1>

        <section className="mb-6 rounded bg-white p-4 shadow">
          <h2 className="text-lg font-medium">Criar Obra</h2>
          <form onSubmit={createProject} className="mt-3 flex gap-2">
            <input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Título da obra" className="flex-1 rounded border px-3 py-2" />
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Criar</button>
          </form>
        </section>

        <section className="mb-6 rounded bg-white p-4 shadow">
          <h2 className="text-lg font-medium">Criar Tarefa</h2>
          <form onSubmit={createTask} className="mt-3 flex gap-2 items-center">
            <select value={selectedProject ?? ""} onChange={(e) => setSelectedProject(e.target.value)} className="rounded border px-3 py-2">
              <option value="">Selecione obra</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Título da tarefa" className="flex-1 rounded border px-3 py-2" />
            <button className="rounded bg-green-600 px-4 py-2 text-white">Criar</button>
          </form>
        </section>

        <section className="rounded bg-white p-4 shadow">
          <h2 className="text-lg font-medium mb-2">Obras e Tarefas</h2>
          {projects.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhuma obra criada ainda.</p>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="mb-4 rounded border p-3">
                <div className="flex items-center justify-between">
                  <strong>{p.title}</strong>
                  <span className="text-sm text-zinc-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</span>
                </div>
                <ul className="mt-2 ml-4 list-disc">
                  {tasks.filter((t) => t.projectId === p.id).length === 0 && <li className="text-sm text-zinc-500">Nenhuma tarefa.</li>}
                  {tasks.filter((t) => t.projectId === p.id).map((t) => (
                    <li key={t.id}>{t.title} <span className="text-xs text-zinc-400">({t.status})</span></li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
