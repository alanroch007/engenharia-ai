import { NextResponse } from "next/server";
import { readDB, writeDB } from "../../../lib/db";

export async function GET() {
  const db = await readDB();
  return NextResponse.json(db.projects || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body || !body.title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }
  const db = await readDB();
  const id = String(Date.now());
  const project = { id, title: body.title, description: body.description || "", createdAt: new Date().toISOString() };
  db.projects.push(project);
  await writeDB(db);
  return NextResponse.json(project, { status: 201 });
}
