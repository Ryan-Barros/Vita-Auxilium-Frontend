import { useState } from "react";

export default function NextActivityCard({ activity, onToggle, showConcludeButton = true }) {
  const [completed, setCompleted] = useState(activity?.completed || false);

  if (!activity) {
    return (
      <div className="bg-white dark:bg-[#282d2c] p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col justify-center items-start gap-4 h-full">
        <span className="inline-block bg-[#0d5c5a]/10 text-[#0d5c5a] dark:text-[#8ed2d4] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Próxima atividade
        </span>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
            Não há nenhuma atividade próxima agendada
          </h2>
          <p className="text-secondary dark:text-[#b4cbcb] text-base font-light mt-1">
            Tudo em dia com a sua rotina no momento.
          </p>
        </div>
      </div>
    );
  }

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
            {activity.time} - {activity.title}
          </h2>
          {activity.details && (
            <p className="text-secondary dark:text-[#b4cbcb] text-lg md:text-xl font-medium mt-2">
              {activity.details}
            </p>
          )}
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
