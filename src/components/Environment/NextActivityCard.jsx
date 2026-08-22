import { useState } from "react";

export default function NextActivityCard({ activity, onToggle, showConcludeButton = true }) {
  const [completed, setCompleted] = useState(activity?.completed || false);

  const defaultActivity = {
    time: "14:00",
    title: "Tomar Remédio",
    details: "Aspirina (500mg) - Com água",
  };

  const currentActivity = activity || defaultActivity;

  const handleToggle = () => {
    const nextState = !completed;
    setCompleted(nextState);
    if (onToggle) onToggle(nextState);
  };

  return (
    <div className="bg-white dark:bg-[#282d2c] p-8 md:p-10 rounded-[2.5rem] border border-[#0d5c5a]/20 dark:border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden h-full">
      <div className="space-y-4 flex-1">
        <span className="inline-block bg-[#0d5c5a] text-white px-5 py-2 rounded-full text-xs md:text-sm font-extrabold tracking-wide uppercase">
          Sua próxima atividade
        </span>

        <div>
          <h2
            className={`text-3xl md:text-4xl font-extrabold text-on-surface dark:text-[#e1e3e0] ${
              completed ? "line-through opacity-60" : ""
            }`}
          >
            {currentActivity.time} - {currentActivity.title}
          </h2>
          <p className="text-secondary dark:text-[#b4cbcb] text-lg md:text-xl font-medium mt-2">
            {currentActivity.details}
          </p>
        </div>
      </div>

      {showConcludeButton && (
        <button
          onClick={handleToggle}
          className={`w-full md:w-32 h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 flex-shrink-0 ${
            completed
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#054a48] text-white hover:bg-[#033433]"
          }`}
        >
          <span className="material-symbols-outlined text-4xl font-bold">
            {completed ? "task_alt" : "check"}
          </span>
          <span className="font-extrabold text-xs uppercase tracking-wider">
            {completed ? "Concluído" : "Concluir"}
          </span>
        </button>
      )}
    </div>
  );
}
