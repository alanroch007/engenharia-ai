import { NextResponse } from "next/server";
import { readDB, writeDB } from "../../../lib/db";

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.tasks || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body || !body.title || !body.projectId) {
    return NextResponse.json({ error: "Missing title or projectId" }, { status: 400 });
  }
  const db = await readDB();
  const id = String(Date.now());
  const task = { id, title: body.title, projectId: body.projectId, status: body.status || "todo", createdAt: new Date().toISOString() };
  db.tasks.push(task);
  await writeDB(db);
  return NextResponse.json(task, { status: 201 });
}
