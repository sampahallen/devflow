import { created, ok } from "../utils/apiResponse.js";

export function createCrudController(service) {
  return {
    list: async (req, res) => ok(res, await service.list(req.user._id, req.query.projectId, req.query.q)),
    create: async (req, res) => created(res, await service.create(req.user._id, req.body), "Created"),
    update: async (req, res) => ok(res, await service.update(req.user._id, req.params.id, req.body), "Updated"),
    remove: async (req, res) => ok(res, await service.remove(req.user._id, req.params.id), "Deleted")
  };
}
