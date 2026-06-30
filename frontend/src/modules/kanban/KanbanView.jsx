import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, Edit3, FileCode, Github, Plus, Timer, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "../../app/store/uiStore.js";
import { columns } from "../../constants/app.js";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { DueDatePicker } from "../../components/ui/DueDatePicker.jsx";
import { PriorityDropdown } from "../../components/ui/PriorityDropdown.jsx";
import { initials } from "../../lib/mappers.js";
import { sortTasks } from "../../lib/taskSort.js";

function KanbanCardContent({
  task,
  editing,
  title,
  setTitle,
  saveTitle,
  setEditing,
  updateTask,
  onEditTask,
  onRequestDelete,
  showActions
}) {
  return (
    <>
      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={(event) => {
            if (event.key === "Enter") saveTitle();
            if (event.key === "Escape") { setTitle(task.title); setEditing(false); }
          }}
          onPointerDown={(event) => event.stopPropagation()}
          className="mb-2.5 w-full cursor-text rounded border border-white/10 bg-[#0D1117] px-2 py-1 text-[11px] outline-none focus:border-[#3B82F6]"
          style={{ color: "#E6EDF3" }}
        />
      ) : (
        <p
          className="mb-2.5 text-[11px] font-medium leading-snug"
          style={{ color: "#E6EDF3", lineHeight: 1.45 }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {task.title}
        </p>
      )}

      <div className="mb-2.5 flex flex-wrap items-center gap-1">
        <PriorityDropdown
          priority={task.priority}
          onChange={(priority) => updateTask(task._id, { priority })}
        />
        {(task.markdownFiles || []).slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 text-[10px]"
            style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)", fontFamily: "monospace" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {task.markdownFiles?.length > 0 && <FileCode size={11} style={{ color: "#6E7681" }} />}
          {task.githubUrl && <Github size={11} style={{ color: "#6E7681" }} />}
          {task.completedPomodoros > 0 && (
            <div className="flex items-center gap-1">
              <Timer size={10} style={{ color: "#EF4444" }} />
              <span className="text-[10px]" style={{ color: "#EF4444", fontFamily: "monospace" }}>
                {task.completedPomodoros}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <DueDatePicker
            value={task.dueDate}
            onChange={(dueDate) => updateTask(task._id, { dueDate })}
          />
          <Avatar initials={initials(task.assignee)} size={17} />
        </div>
      </div>

      {showActions && (
        <div className="mt-2 flex justify-end gap-1.5 border-t border-white/5 pt-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEditTask(task);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            className="cursor-pointer rounded px-1.5 py-0.5"
            style={{ color: "#C9D1D9", background: "rgba(255,255,255,0.06)" }}
            title="Edit task"
          >
            <Edit3 size={10} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRequestDelete(task);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            className="cursor-pointer rounded px-1.5 py-0.5"
            style={{ color: "#EF4444", background: "rgba(239,68,68,0.1)" }}
            title="Delete task"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}
    </>
  );
}

function KanbanCard({ task, updateTask, onPreviewTask, onEditTask, onRequestDelete }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const saveTitle = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) updateTask(task._id, { title: trimmed });
    else setTitle(task.title);
    setEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 220ms cubic-bezier(0.2, 0, 0, 1)",
    opacity: isDragging ? 0.28 : 1,
    zIndex: isDragging ? 10 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group touch-none rounded-lg p-3 will-change-transform ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (!isDragging && !editing) onPreviewTask(task);
      }}
    >
      <div
        style={{
          background: hovered ? "#1C2128" : "#161B22",
          border: `1px solid ${hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)"}`
        }}
        className="rounded-lg p-3"
      >
        <KanbanCardContent
          task={task}
          editing={editing}
          title={title}
          setTitle={setTitle}
          saveTitle={saveTitle}
          setEditing={setEditing}
          updateTask={updateTask}
          onEditTask={onEditTask}
          onRequestDelete={onRequestDelete}
          showActions={hovered}
        />
      </div>
    </div>
  );
}

function KanbanColumn({ column, tasks, onAddTask, updateTask, onPreviewTask, onEditTask, onRequestDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex w-[268px] shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ background: column.color }} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: column.color }}>
          {column.label}
        </span>
        <span
          className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium"
          style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)" }}
        >
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-2 transition-colors"
        style={{
          background: isOver ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${isOver ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)"}`
        }}
      >
        <button
          type="button"
          onClick={onAddTask}
          className="flex w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] transition-all"
          style={{ color: "#6E7681", border: "1px dashed rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "#C9D1D9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "#6E7681";
          }}
        >
          <Plus size={11} /> Add task
        </button>
        <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              updateTask={updateTask}
              onPreviewTask={onPreviewTask}
              onEditTask={onEditTask}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

function SortBar({ sort, onChange }) {
  const DirectionIcon = sort.direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <div className="mb-3 flex shrink-0 items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>Sort by</span>
      <div
        className="flex items-center gap-1 rounded-lg p-1"
        style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {[
          { field: "position", label: "Manual" },
          { field: "priority", label: "Priority" },
          { field: "createdAt", label: "Date added" }
        ].map(({ field, label }) => (
          <button
            key={field}
            type="button"
            onClick={() => onChange({ ...sort, field })}
            className="cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-all"
            style={sort.field === field ? { background: "#3B82F6", color: "#fff" } : { color: "#6E7681" }}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...sort, direction: sort.direction === "asc" ? "desc" : "asc" })}
        className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
        style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)", color: "#E6EDF3" }}
        title={sort.direction === "asc" ? "Ascending" : "Descending"}
      >
        <DirectionIcon size={12} />
        {sort.direction === "asc" ? "Asc" : "Desc"}
      </button>
    </div>
  );
}

const POSITION_STEP = 1024;

function applyPositions(columnTasks, status) {
  return columnTasks.map((task, index) => ({
    ...task,
    status,
    position: (index + 1) * POSITION_STEP
  }));
}

export function KanbanView({ project, tasks, onAddTask, updateTask, reorderTasks, onPreviewTask, onEditTask, onRequestDelete }) {
  const [activeTask, setActiveTask] = useState(null);
  const kanbanSort = useUiStore((state) => state.kanbanSort);
  const setKanbanSort = useUiStore((state) => state.setKanbanSort);

  const sortedTasks = useMemo(() => sortTasks(tasks, kanbanSort), [tasks, kanbanSort]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const resolveStatus = (overId) => {
    const column = columns.find((col) => col.id === overId);
    if (column) return column.id;
    return tasks.find((task) => task._id === overId)?.status;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const newStatus = resolveStatus(over.id);
    const task = tasks.find((item) => item._id === active.id);
    if (!task || !newStatus) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const sourceStatus = task.status;
    const sourceColumn = sortedTasks.filter((item) => item.status === sourceStatus);
    const targetColumn = sortedTasks.filter((item) => item.status === newStatus);
    let updates = [];

    if (sourceStatus === newStatus) {
      const oldIndex = sourceColumn.findIndex((item) => item._id === activeId);
      const newIndex = sourceColumn.findIndex((item) => item._id === overId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
      updates = applyPositions(arrayMove(sourceColumn, oldIndex, newIndex), newStatus);
    } else {
      const sourceWithoutActive = sourceColumn.filter((item) => item._id !== activeId);
      const targetWithoutActive = targetColumn.filter((item) => item._id !== activeId);
      const overIndex = targetWithoutActive.findIndex((item) => item._id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : targetWithoutActive.length;
      const targetWithActive = [
        ...targetWithoutActive.slice(0, insertIndex),
        { ...task, status: newStatus },
        ...targetWithoutActive.slice(insertIndex)
      ];
      updates = [
        ...applyPositions(sourceWithoutActive, sourceStatus),
        ...applyPositions(targetWithActive, newStatus)
      ];
    }

    reorderTasks(updates);
    setKanbanSort({ field: "position", direction: "asc" });
    updates.forEach((item) => {
      updateTask(item._id, { status: item.status, position: item.position });
    });
  };

  return (
    <div className="flex h-full flex-col">
      <SortBar sort={kanbanSort} onChange={setKanbanSort} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => setActiveTask(tasks.find((task) => task._id === event.active.id) || null)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={sortedTasks.filter((task) => task.status === column.id)}
              onAddTask={() => onAddTask(column.id)}
              updateTask={updateTask}
              onPreviewTask={onPreviewTask}
              onEditTask={onEditTask}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div
              className="cursor-grabbing rounded-lg p-3 shadow-2xl"
              style={{ background: "#1C2128", border: "1px solid rgba(255,255,255,0.15)", width: 252 }}
            >
              <KanbanCardContent
                task={activeTask}
                editing={false}
                title={activeTask.title}
                setTitle={() => {}}
                saveTitle={() => {}}
                setEditing={() => {}}
                updateTask={() => {}}
                onEditTask={() => {}}
                onRequestDelete={() => {}}
                showActions={false}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
