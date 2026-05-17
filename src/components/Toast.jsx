import { useEffect } from "react";

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!onClose) return;
    const id = setTimeout(() => onClose(), duration);
    return () => clearTimeout(id);
  }, [onClose, duration]);

  const bgClass =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
        ? "bg-rose-600"
        : "bg-gray-800";

  const icon =
    type === "success" ? "check_circle" : type === "error" ? "error" : "info";

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-xs w-full ${bgClass} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in`}
      role="status"
      aria-live="polite"
    >
      <span className="material-symbols-outlined text-2xl">{icon}</span>
      <div className="text-sm leading-tight break-words">{message}</div>
      <button
        onClick={() => onClose && onClose()}
        className="ml-auto text-white opacity-80 hover:opacity-100"
        aria-label="Fechar aviso"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
