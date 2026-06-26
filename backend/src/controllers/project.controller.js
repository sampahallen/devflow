import * as service from "../services/project.service.js";
import { created, ok } from "../utils/apiResponse.js";

export const list = async (req, res) => ok(res, await service.listProjects(req.user._id));
export const create = async (req, res) => created(res, await service.createProject(req.user._id, req.body), "Project created");
export const update = async (req, res) => ok(res, await service.updateProject(req.user._id, req.params.id, req.body), "Project updated");
export const remove = async (req, res) => ok(res, await service.deleteProject(req.user._id, req.params.id), "Project deleted");
