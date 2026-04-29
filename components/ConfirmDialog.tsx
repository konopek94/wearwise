"use client";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm glass rounded-lg shadow-ambient p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">{title}</h2>
          <p className="text-primary-design opacity-70">{description}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-surface-low text-primary-design font-bold text-sm uppercase tracking-widest hover:bg-surface-highest/20 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-error-design text-white font-bold text-sm uppercase tracking-widest hover:bg-error-design/90 active:scale-[0.98] transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
