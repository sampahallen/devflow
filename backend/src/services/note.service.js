import fs from "fs/promises";
import path from "path";
import { Note } from "../models/Note.js";
import { Project } from "../models/Project.js";
import { createCrudService } from "./crud.service.js";

const crud = createCrudService(Note);
const storageRoot = path.resolve("src", "storage", "projects");

async function projectNotesDir(projectId, userId) {
  const project = await Project.findOne({ _id: projectId, createdBy: userId });
  if (!project) throw Object.assign(new Error("Project not found"), { statusCode: 404 });
  const dir = path.join(storageRoot, project.slug, "notes");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function safeNotePath(base, requestedPath) {
  const resolved = path.resolve(base, requestedPath);
  if (!resolved.startsWith(path.resolve(base))) throw Object.assign(new Error("Invalid note path"), { statusCode: 400 });
  return resolved;
}

export async function listNotes(userId, projectId, q) {
  return crud.list(userId, projectId, q);
}

export async function createNote(userId, payload) {
  const dir = await projectNotesDir(payload.projectId, userId);
  const target = safeNotePath(dir, payload.path);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, payload.content || "", "utf8");
  return Note.create({ title: payload.title, path: payload.path, tags: payload.tags || [], projectId: payload.projectId, createdBy: userId, lastModified: new Date() });
}

export async function readNote(userId, id) {
  const note = await Note.findOne({ _id: id, createdBy: userId });
  if (!note) throw Object.assign(new Error("Note not found"), { statusCode: 404 });
  const dir = await projectNotesDir(note.projectId, userId);
  const content = await fs.readFile(safeNotePath(dir, note.path), "utf8").catch(() => "");
  return { ...note.toObject(), content };
}

export async function updateNote(userId, id, payload) {
  const note = await Note.findOne({ _id: id, createdBy: userId });
  if (!note) throw Object.assign(new Error("Note not found"), { statusCode: 404 });
  const dir = await projectNotesDir(note.projectId, userId);
  if (payload.path && payload.path !== note.path) await fs.rename(safeNotePath(dir, note.path), safeNotePath(dir, payload.path)).catch(() => undefined);
  if (payload.content !== undefined) await fs.writeFile(safeNotePath(dir, payload.path || note.path), payload.content, "utf8");
  return Note.findOneAndUpdate({ _id: id, createdBy: userId }, { ...payload, lastModified: new Date(), content: undefined }, { new: true });
}

export async function deleteNote(userId, id) {
  const note = await Note.findOneAndDelete({ _id: id, createdBy: userId });
  if (note) {
    const dir = await projectNotesDir(note.projectId, userId);
    await fs.rm(safeNotePath(dir, note.path), { force: true }).catch(() => undefined);
  }
  return note;
}
