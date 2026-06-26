import * as service from "../services/note.service.js";
import { created, ok } from "../utils/apiResponse.js";

export const list = async (req, res) => ok(res, await service.listNotes(req.user._id, req.query.projectId, req.query.q));
export const create = async (req, res) => created(res, await service.createNote(req.user._id, req.body), "Note created");
export const read = async (req, res) => ok(res, await service.readNote(req.user._id, req.params.id));
export const update = async (req, res) => ok(res, await service.updateNote(req.user._id, req.params.id, req.body), "Note updated");
export const remove = async (req, res) => ok(res, await service.deleteNote(req.user._id, req.params.id), "Note deleted");
