const priorityRank = { high: 3, medium: 2, low: 1 };

export function sortTasks(tasks, { field = "priority", direction = "desc" } = {}) {
  const mult = direction === "asc" ? 1 : -1;
  return [...tasks].sort((a, b) => {
    if (field === "position") {
      const aPosition = Number.isFinite(a.position) ? a.position : new Date(a.createdAt || 0).getTime();
      const bPosition = Number.isFinite(b.position) ? b.position : new Date(b.createdAt || 0).getTime();
      const diff = aPosition - bPosition;
      if (diff !== 0) return mult * diff;
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    if (field === "priority") {
      const diff = (priorityRank[a.priority] || 0) - (priorityRank[b.priority] || 0);
      if (diff !== 0) return mult * diff;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return mult * (aTime - bTime);
  });
}
