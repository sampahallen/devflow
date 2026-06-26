export function createCrudService(Model) {
  return {
    list: (userId, projectId, q = "") => {
      const filter = { createdBy: userId };
      if (projectId) filter.projectId = projectId;
      if (q) filter.$or = [{ title: new RegExp(q, "i") }, { content: new RegExp(q, "i") }, { notes: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
      return Model.find(filter).sort({ updatedAt: -1 });
    },
    create: (userId, payload) => Model.create({ ...payload, createdBy: userId }),
    update: (userId, id, payload) => Model.findOneAndUpdate({ _id: id, createdBy: userId }, payload, { new: true }),
    remove: (userId, id) => Model.findOneAndDelete({ _id: id, createdBy: userId })
  };
}
