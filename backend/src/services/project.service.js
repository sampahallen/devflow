import slugify from "slugify";
import { Project } from "../models/Project.js";

export const listProjects = (userId) => Project.find({ createdBy: userId }).sort({ updatedAt: -1 });
export const createProject = (userId, payload) => Project.create({ ...payload, slug: slugify(payload.name, { lower: true, strict: true }), createdBy: userId });
export const updateProject = (userId, id, payload) => Project.findOneAndUpdate({ _id: id, createdBy: userId }, payload.name ? { ...payload, slug: slugify(payload.name, { lower: true, strict: true }) } : payload, { new: true });
export const deleteProject = (userId, id) => Project.findOneAndDelete({ _id: id, createdBy: userId });
