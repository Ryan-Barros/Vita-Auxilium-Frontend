import { useState, useMemo } from "react";

const CATEGORY_MAP = {
  MEDICATION: { label: "Medicamento", icon: "medical_services", color: "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300" },
  MEAL: { label: "Alimentação", icon: "restaurant", color: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300" },
  EXERCISE: { label: "Exercício", icon: "fitness_center", color: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300" },
  APPOINTMENT: { label: "Consulta", icon: "medical_information", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300" },
  HYGIENE: { label: "Higiene", icon: "clean_hands", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" },
  ROUTINE: { label: "Rotina", icon: "schedule", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
};

const PRIORITY_MAP = {
  HIGH: { label: "Alta", color: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800/40" },
  MEDIUM: { label: "Média", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/40" },
  LOW: { label: "Baixa", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40" },
};

export default function ActivityListView({
  activities = [],
  onToggleComplete,
  onEdit,
  onDelete,
  canManageActivities = false,
  canInteractActivities = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, COMPLETED

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Search filter
      const matchesSearch =
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "ALL" || act.category === selectedCategory;

      // Status filter
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" && !act.completed) ||
        (statusFilter === "COMPLETED" && act.completed);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [activities, searchQuery, selectedCategory, statusFilter]);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters Controls */}
      <div className="bg-white dark:bg-[#202524] p-5 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por nome ou instrução..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface dark:bg-[#191c1b] border border-outline-variant/40 text-sm text-on-surface dark:text-[#e1e3e0] focus:outline-none focus:ring-2 focus:ring-[#0d5c5a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-surface dark:bg-[#191c1b] p-1 rounded-2xl border border-outline-variant/30 w-full md:w-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#0d5c5a] text-white shadow-xs"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Todas ({activities.length})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "PENDING"
                  ? "bg-[#0d5c5a] text-white shadow-xs"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Pendentes ({activities.filter((a) => !a.completed).length})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "COMPLETED"
                  ? "bg-[#0d5c5a] text-white shadow-xs"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Concluídas ({activities.filter((a) => a.completed).length})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-[#0d5c5a] text-white"
                : "bg-surface-container dark:bg-[#252a29] text-secondary hover:text-primary"
            }`}
          >
            Todas Categorias
          </button>
          {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? "bg-[#0d5c5a] text-white border-[#0d5c5a]"
                    : "bg-surface dark:bg-[#252a29] text-secondary border-outline-variant/30 hover:border-primary"
                }`}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Cards List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white dark:bg-[#202524] rounded-3xl border border-outline-variant/30 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-surface-container dark:bg-[#252a29] rounded-2xl flex items-center justify-center mx-auto text-secondary">
            <span className="material-symbols-outlined text-3xl">event_busy</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface dark:text-[#e1e3e0]">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-sm text-secondary dark:text-[#b4cbcb] mt-1 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "ALL" || statusFilter !== "ALL"
                ? "Tente ajustar seus filtros ou busca para encontrar os compromissos."
                : "Ainda não existem atividades cadastradas na agenda."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((act) => {
            const categoryInfo = CATEGORY_MAP[act.category] || CATEGORY_MAP.ROUTINE;
            const priorityInfo = PRIORITY_MAP[act.priority] || PRIORITY_MAP.MEDIUM;

            return (
              <div
                key={act.id}
                className={`bg-white dark:bg-[#202524] p-5 md:p-6 rounded-3xl border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  act.completed
                    ? "border-outline-variant/20 opacity-80 bg-surface-container-lowest dark:bg-[#1d2221]"
                    : "border-outline-variant/40"
                }`}
              >
                {/* Left Section: Icon & Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Category Icon Badge */}
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${categoryInfo.color}`}
                  >
                    <span className="material-symbols-outlined text-2xl">{categoryInfo.icon}</span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-base md:text-lg font-bold text-on-surface dark:text-[#e1e3e0] ${
                          act.completed ? "line-through text-secondary" : ""
                        }`}
                      >
                        {act.title}
                      </h3>

                      {/* Category Badge */}
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-surface-container dark:bg-[#282d2c] text-secondary">
                        {categoryInfo.label}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-secondary dark:text-[#b4cbcb]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#0d5c5a] dark:text-[#8ed2d4]">
                          schedule
                        </span>
                        {act.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#0d5c5a] dark:text-[#8ed2d4]">
                          calendar_today
                        </span>
                        {formatDateLabel(act.date)}
                      </span>
                    </div>

                    {/* Description / Instructions */}
                    {act.description && (
                      <p className="text-xs text-secondary dark:text-[#b4cbcb] pt-1 font-normal line-clamp-2">
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section: Action Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/20">
                  {/* Status Indicator / Completion Button */}
                  {canInteractActivities ? (
                    <button
                      onClick={() => onToggleComplete(act.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                        act.completed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200"
                          : "bg-[#0d5c5a] text-white hover:bg-[#084846] shadow-xs"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {act.completed ? "task_alt" : "radio_button_unchecked"}
                      </span>
                      <span>{act.completed ? "Concluída" : "Marcar Concluída"}</span>
                    </button>
                  ) : (
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        act.completed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {act.completed ? "check_circle" : "pending"}
                      </span>
                      <span>{act.completed ? "Concluída" : "Pendente"}</span>
                    </span>
                  )}

                  {/* Management Actions (FAMILY only) */}
                  {canManageActivities && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(act)}
                        className="p-2 rounded-xl text-secondary hover:text-[#0d5c5a] hover:bg-[#0d5c5a]/10 transition-all cursor-pointer"
                        title="Editar Atividade"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(act.id)}
                        className="p-2 rounded-xl text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                        title="Excluir Atividade"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
