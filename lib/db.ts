import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function ensureDB() {
  try {
    await fs.access(DB_PATH);
  } catch (err) {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ projects: [], tasks: [] }, null, 2));
  }
}

export async function readDB() {
  await ensureDB();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw || "{}");
}

export async function writeDB(db: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function addProject(project: any) {
  const db = await readDB();
  const id = String(Date.now());
  const p = { id, ...project, createdAt: new Date().toISOString() };
  db.projects.push(p);
  await writeDB(db);
  return p;
}

export async function addTask(task: any) {
  const db = await readDB();
  const id = String(Date.now());
  const t = { id, ...task, createdAt: new Date().toISOString(), status: task.status || "todo" };
  db.tasks.push(t);
  await writeDB(db);
  return t;
}
