export function createRepository(Model) {
  return {
    list: (filter = {}) => Model.find(filter).sort({ updatedAt: -1 }),
    get: (filter) => Model.findOne(filter),
    create: (payload) => Model.create(payload),
    update: (filter, payload) => Model.findOneAndUpdate(filter, payload, { new: true }),
    remove: (filter) => Model.findOneAndDelete(filter),
    count: (filter = {}) => Model.countDocuments(filter)
  };
}
