import { useState } from "react";

const INITIAL_ITEMS = [
  {
    id: 1,
    title: "Medicamentos Manhã",
    time: "09:00 • 3 comprimidos",
    icon: "medical_services",
    completed: true,
  },
  {
    id: 2,
    title: "Almoço",
    time: "12:30 • Dieta leve",
    icon: "restaurant",
    completed: true,
  },
  {
    id: 3,
    title: "Passeio no Jardim",
    time: "16:00 • 20 minutos",
    icon: "directions_walk",
    completed: false,
  },
];

export default function UpcomingActivitiesList({ canManageActivities = false }) {
  const [activities, setActivities] = useState(INITIAL_ITEMS);

  const toggleActivity = (id) => {
    setActivities(
      activities.map((act) =>
        act.id === id ? { ...act, completed: !act.completed } : act
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
          Próximas Atividades
        </h2>

        {canManageActivities ? (
          <button className="px-5 py-2.5 bg-[#0d5c5a] hover:bg-[#084846] text-white font-bold rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Nova Atividade</span>
          </button>
        ) : (
          <button className="text-[#0d5c5a] dark:text-[#8ed2d4] hover:underline text-sm font-bold cursor-pointer">
            Ver todas
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-[#e4e8e5] dark:bg-[#282d2c] p-5 md:p-6 rounded-3xl flex items-center justify-between gap-4 transition-all hover:shadow-xs"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white dark:bg-[#343a39] rounded-2xl flex items-center justify-center text-[#0d5c5a] dark:text-[#8ed2d4] shadow-xs flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">{act.icon}</span>
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
    </div>
  );
}
