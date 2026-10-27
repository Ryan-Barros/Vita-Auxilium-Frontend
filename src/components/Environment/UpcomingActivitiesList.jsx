import { useState, useEffect } from "react";
import { activityService } from "../../services/activityService";
import { useToastStore } from "../../stores/toastStore";

export default function UpcomingActivitiesList({ canManageActivities = false }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    let isMounted = true;
    activityService
      .getActivities()
      .then((data) => {
        if (isMounted) setActivities(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao carregar próximas atividades:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleActivity = async (id) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    const nextState = !act.completed;

    try {
      await activityService.toggleActivityCompletion(id, nextState);
      setActivities((prev) =>
        prev.map((item) => (item.id === id ? { ...item, completed: nextState } : item))
      );
    } catch {
      showToast("Não foi possível atualizar o status da atividade.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
          Próximas Atividades
        </h2>

        {!canManageActivities && (
          <span className="text-[#0d5c5a] dark:text-[#8ed2d4] text-xs font-bold uppercase tracking-wider">
            Visão Geral
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-secondary dark:text-[#b4cbcb]">
          <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
          <p className="text-xs font-semibold mt-2">Carregando próximas atividades...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-[#e4e8e5] dark:bg-[#282d2c] p-8 rounded-3xl text-center space-y-2 border border-black/5 dark:border-white/5">
          <span className="material-symbols-outlined text-4xl text-secondary dark:text-[#b4cbcb]">
            event_busy
          </span>
          <h3 className="text-base font-bold text-on-surface dark:text-[#e1e3e0]">
            Não há atividades agendadas no momento
          </h3>
          <p className="text-xs text-secondary dark:text-[#b4cbcb]">
            Novos compromissos e remédios aparecerão aqui assim que forem cadastrados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-[#e4e8e5] dark:bg-[#282d2c] p-5 md:p-6 rounded-3xl flex items-center justify-between gap-4 transition-all hover:shadow-xs"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white dark:bg-[#343a39] rounded-2xl flex items-center justify-center text-[#0d5c5a] dark:text-[#8ed2d4] shadow-xs flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {act.icon || "schedule"}
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold text-on-surface dark:text-[#e1e3e0] ${
                      act.completed ? "line-through opacity-70" : ""
                    }`}
                  >
                    {act.title}
                  </h3>
                  <span className="text-sm text-secondary dark:text-[#b4cbcb] font-medium">
                    {act.time}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleActivity(act.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  act.completed
                    ? "bg-[#ccebe5] text-[#0d5c5a] dark:bg-[#0d5c5a] dark:text-white"
                    : "bg-white dark:bg-[#343a39] text-secondary hover:text-primary"
                }`}
                title={act.completed ? "Desmarcar" : "Marcar como concluída"}
              >
                <span className="material-symbols-outlined text-2xl">
                  {act.completed ? "check" : "circle"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
