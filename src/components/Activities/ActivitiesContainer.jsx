import { useState, useEffect } from "react";
import { useToastStore } from "../../stores/toastStore";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { activityService } from "../../services/activityService";
import { environmentService } from "../../services/environmentService";
import ActivityListView from "./ActivityListView";
import ActivityCalendarView from "./ActivityCalendarView";
import ActivityFormModal from "./ActivityFormModal";

export default function ActivitiesContainer({
  canManageActivities = false,
  canInteractActivities = true,
}) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const currentEnvironment = useEnvironmentStore((s) => s.currentEnvironment);
  const { showToast } = useToastStore();

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      setIsLoading(true);
      try {
        if (currentEnvironment?.id) {
          await environmentService.setActiveEnvironment(currentEnvironment.id).catch(() => {});
        }
        const data = await activityService.getActivities();
        if (isMounted) setActivities(data);
      } catch (err) {
        console.error("Erro ao carregar atividades:", err);
        if (isMounted) {
          showToast(
            err.response?.data?.detail || "Não foi possível carregar as atividades do ambiente.",
            "error"
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadActivities();
    return () => {
      isMounted = false;
    };
  }, [currentEnvironment?.id, showToast]);

  // Metrics computation
  const totalCount = activities.length;
  const completedCount = activities.filter((a) => a.completed).length;
  const pendingCount = activities.filter((a) => !a.completed).length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMedsCount = activities.filter(
    (a) => a.date === todayStr && a.category === "MEDICATION"
  ).length;

  // Handlers
  const handleToggleComplete = async (id) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    const nextState = !act.completed;

    try {
      const updated = await activityService.toggleActivityCompletion(id, nextState);
      setActivities((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated, completed: nextState } : item))
      );
      showToast(
        nextState
          ? `Atividade "${act.title}" concluída!`
          : `Atividade "${act.title}" desmarcada.`,
        nextState ? "success" : "info"
      );
    } catch (err) {
      console.error("Erro ao atualizar status da atividade:", err);
      showToast(
        err.response?.data?.detail || "Erro ao atualizar status da atividade.",
        "error"
      );
    }
  };

  const handleCreateOrUpdate = async (activityData) => {
    try {
      if (editingActivity?.id) {
        const updated = await activityService.updateActivity(editingActivity.id, {
          ...activityData,
          environmentId: currentEnvironment?.id,
        });
        setActivities((prev) =>
          prev.map((act) => (act.id === editingActivity.id ? updated : act))
        );
        showToast(`Atividade "${updated.title}" atualizada!`, "success");
      } else {
        const created = await activityService.createActivity({
          ...activityData,
          environmentId: currentEnvironment?.id,
        });
        setActivities((prev) => [created, ...prev]);
        showToast(`Nova atividade "${created.title}" agendada!`, "success");
      }
    } catch (err) {
      console.error("Erro ao salvar atividade:", err);
      showToast(err.response?.data?.detail || "Erro ao salvar atividade.", "error");
    }
    setEditingActivity(null);
  };

  const handleOpenEdit = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const act = activities.find((a) => a.id === id);
    if (window.confirm(`Tem certeza que deseja excluir a atividade "${act?.title}"?`)) {
      try {
        await activityService.deleteActivity(id);
        setActivities((prev) => prev.filter((a) => a.id !== id));
        showToast("Atividade excluída com sucesso.", "info");
      } catch (err) {
        console.error("Erro ao excluir atividade:", err);
        showToast(err.response?.data?.detail || "Erro ao excluir atividade.", "error");
      }
    }
  };

  const handleAddNewForDate = (dateStr) => {
    setEditingActivity({ date: dateStr });
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#202524] p-5 rounded-3xl border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0d5c5a]/10 text-[#0d5c5a] dark:text-[#8ed2d4] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">format_list_bulleted</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
              {totalCount}
            </span>
            <p className="text-xs text-secondary dark:text-[#b4cbcb] font-semibold">
              Total Agendadas
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#202524] p-5 rounded-3xl border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
              {completedCount}
            </span>
            <p className="text-xs text-secondary dark:text-[#b4cbcb] font-semibold">
              Concluídas
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#202524] p-5 rounded-3xl border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">pending</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
              {pendingCount}
            </span>
            <p className="text-xs text-secondary dark:text-[#b4cbcb] font-semibold">
              Pendentes
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#202524] p-5 rounded-3xl border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">pill</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
              {todayMedsCount}
            </span>
            <p className="text-xs text-secondary dark:text-[#b4cbcb] font-semibold">
              Remédios Hoje
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Mode Switcher & Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-white dark:bg-[#202524] p-1.5 rounded-2xl border border-outline-variant/30 shadow-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">view_list</span>
            <span>Visão em Lista</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              viewMode === "calendar"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            <span>Visão em Calendário</span>
          </button>
        </div>

        {canManageActivities ? (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto px-6 py-3 bg-[#0d5c5a] hover:bg-[#084846] text-white font-bold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Nova Atividade</span>
          </button>
        ) : (
          <div className="text-xs font-semibold text-secondary dark:text-[#b4cbcb] bg-surface-container dark:bg-[#252a29] px-4 py-2 rounded-2xl">
            Modo Visualização/Conclusão Ativo
          </div>
        )}
      </div>

      {/* Main Content Area: List vs Calendar */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#0d5c5a] dark:text-[#8ed2d4] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-secondary dark:text-[#b4cbcb]">
            Carregando atividades...
          </p>
        </div>
      ) : viewMode === "list" ? (
        <ActivityListView
          activities={activities}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          canManageActivities={canManageActivities}
          canInteractActivities={canInteractActivities}
        />
      ) : (
        <ActivityCalendarView
          activities={activities}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          canManageActivities={canManageActivities}
          canInteractActivities={canInteractActivities}
          onAddNewForDate={handleAddNewForDate}
        />
      )}

      {/* Create / Edit Form Modal */}
      {canManageActivities && (
        <ActivityFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingActivity(null);
          }}
          onSubmit={handleCreateOrUpdate}
          initialData={editingActivity}
        />
      )}
    </div>
  );
}
