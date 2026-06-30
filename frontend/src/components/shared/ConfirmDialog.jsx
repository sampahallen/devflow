import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/65 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-lg shadow-2xl"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ color: "#F59E0B", background: "rgba(245,158,11,0.12)" }}>
            <AlertTriangle size={16} />
          </div>
          <p className="min-w-0 flex-1 text-sm font-semibold" style={{ color: "#E6EDF3" }}>{title}</p>
          <button
            type="button"
            onClick={onCancel}
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ color: "#8B949E", background: "rgba(255,255,255,0.04)" }}
          >
            <X size={15} />
          </button>
        </div>

        <p className="px-4 py-4 text-sm leading-relaxed" style={{ color: "#8B949E" }}>{message}</p>

        <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-xs font-medium"
            style={{ color: "#8B949E", background: "rgba(255,255,255,0.04)" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg px-3 py-2 text-xs font-semibold"
            style={{ color: "#fff", background: "#EF4444" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

