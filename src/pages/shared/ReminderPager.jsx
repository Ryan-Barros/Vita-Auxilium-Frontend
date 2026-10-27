import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { useToastStore } from "../../stores/toastStore";
import { getCapabilities } from "../../config/profileCapabilities";
import { reminderService } from "../../services/reminderService";
import { environmentService } from "../../services/environmentService";

export default function ReminderPager() {
  const { user } = useAuthStore();
  const currentEnvironment = useEnvironmentStore((s) => s.currentEnvironment);
  const initialProfile = (user?.profile || user?.role || "FAMILY").toUpperCase();
  const [activeProfile, setActiveProfile] = useState(initialProfile);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("10:00");
  const [recurring, setRecurring] = useState("Todos os dias");
  const [category, setCategory] = useState("HEALTH");
  const [description, setDescription] = useState("");

  const { showToast } = useToastStore();
  const capabilities = getCapabilities(activeProfile);

  useEffect(() => {
    let isMounted = true;

    async function loadReminders() {
      setIsLoading(true);
      try {
        if (currentEnvironment?.id) {
          await environmentService.setActiveEnvironment(currentEnvironment.id).catch(() => {});
        }
        const data = await reminderService.getReminders();
        if (isMounted) setReminders(data);
      } catch (err) {
        console.error("Erro ao carregar lembretes:", err);
        if (isMounted) {
          showToast(
            err.response?.data?.detail || "Erro ao carregar lembretes do ambiente.",
            "error"
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReminders();
    return () => {
      isMounted = false;
    };
  }, [currentEnvironment?.id, showToast]);

  const handleToggleComplete = async (id) => {
    const rem = reminders.find((r) => r.id === id);
    if (!rem) return;
    const nextState = !rem.completed;

    try {
      const updated = await reminderService.toggleReminderCompletion(id, nextState);
      setReminders((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated, completed: nextState } : item))
      );
      showToast(
        nextState ? `Lembrete "${rem.title}" concluído!` : `Lembrete "${rem.title}" desmarcado.`,
        nextState ? "success" : "info"
      );
    } catch (err) {
      console.error("Erro ao alterar status do lembrete:", err);
      showToast(err.response?.data?.detail || "Erro ao atualizar lembrete.", "error");
    }
  };

  const handleOpenCreateModal = () => {
    setEditingReminder(null);
    setTitle("");
    setTime("10:00");
    setRecurring("Todos os dias");
    setCategory("HEALTH");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rem) => {
    setEditingReminder(rem);
    setTitle(rem.title || "");
    setTime(rem.time || "10:00");
    setRecurring(rem.recurring || (rem.loop ? "Todos os dias" : "Único"));
    setCategory(rem.category || "HEALTH");
    setDescription(rem.description || "");
    setIsModalOpen(true);
  };

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingReminder?.id) {
        const updated = await reminderService.updateReminder(editingReminder.id, {
          title: title.trim(),
          time,
          recurring,
          category,
          description,
          environmentId: currentEnvironment?.id,
        });
        setReminders((prev) =>
          prev.map((item) => (item.id === editingReminder.id ? updated : item))
        );
        showToast(`Lembrete "${updated.title}" atualizado com sucesso!`, "success");
      } else {
        const newReminder = await reminderService.createReminder({
          title: title.trim(),
          time,
          recurring,
          category,
          description,
          environmentId: currentEnvironment?.id,
        });
        setReminders((prev) => [newReminder, ...prev]);
        showToast(`Lembrete "${newReminder.title}" criado com sucesso!`, "success");
      }

      setEditingReminder(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar lembrete:", err);
      showToast(err.response?.data?.detail || "Erro ao salvar lembrete.", "error");
    }
  };

  const handleDeleteReminder = async (id, reminderTitle) => {
    if (window.confirm(`Deseja excluir o lembrete "${reminderTitle}"?`)) {
      try {
        await reminderService.deleteReminder(id);
        setReminders((prev) => prev.filter((r) => r.id !== id));
        showToast("Lembrete removido com sucesso.", "info");
      } catch (err) {
        console.error("Erro ao excluir lembrete:", err);
        showToast(err.response?.data?.detail || "Erro ao excluir lembrete.", "error");
      }
    }
  };

  const totalCount = reminders.length;
  const completedCount = reminders.filter((r) => r.completed).length;
  const pendingCount = reminders.filter((r) => !r.completed).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Selector Banner */}
      <div className="bg-white dark:bg-[#202524] p-4 rounded-3xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-secondary dark:text-[#b4cbcb] text-sm font-semibold px-2">
          <span className="material-symbols-outlined text-xl text-[#0d5c5a] dark:text-[#8ed2d4]">
            tune
          </span>
          <span>Simular Visualização como:</span>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low dark:bg-[#191c1b] p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveProfile("FAMILY")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "FAMILY"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            Familiar
          </button>
          <button
            type="button"
            onClick={() => setActiveProfile("CAREGIVER")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "CAREGIVER"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            Cuidador
          </button>
          <button
            type="button"
            onClick={() => setActiveProfile("ELDERLY")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "ELDERLY"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            Idoso
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Lembretes e Avisos
            </h1>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#0d5c5a]/10 text-[#0d5c5a] dark:text-[#8ed2d4] border border-[#0d5c5a]/20">
              {activeProfile === "FAMILY" && "Perfil Familiar"}
              {activeProfile === "CAREGIVER" && "Perfil Cuidador"}
              {activeProfile === "ELDERLY" && "Perfil Idoso"}
            </span>
          </div>

          <p className="text-secondary dark:text-[#b4cbcb] text-base font-light mt-1">
            {activeProfile === "FAMILY" &&
              "Configure lembretes recorrentes de cuidados, medicação e bem-estar do idoso."}
            {activeProfile === "CAREGIVER" &&
              "Acompanhe os avisos e marque as tarefas concluídas durante seu plantão."}
            {activeProfile === "ELDERLY" &&
              "Veja seus avisos diários de saúde e cuidados diários com praticidade."}
          </p>
        </div>

        {capabilities.canManageActivities && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-[#0d5c5a] hover:bg-[#084846] text-white font-bold px-6 py-3 rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer self-start md:self-auto text-sm"
          >
            <span className="material-symbols-outlined text-xl">notifications_active</span>
            <span>Novo Lembrete</span>
          </button>
        )}
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#202524] p-5 rounded-3xl border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0d5c5a]/10 text-[#0d5c5a] dark:text-[#8ed2d4] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
              {totalCount}
            </span>
            <p className="text-xs text-secondary dark:text-[#b4cbcb] font-semibold">
              Total de Lembretes
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
              Concluídos Hoje
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
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#0d5c5a] dark:text-[#8ed2d4] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-secondary dark:text-[#b4cbcb]">
            Carregando lembretes...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="bg-[#e4e8e5] dark:bg-[#282d2c] p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-xs border border-black/5 dark:border-white/5"
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(rem.id)}
                  disabled={!capabilities.canInteractActivities}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                    rem.completed
                      ? "bg-emerald-600 text-white"
                      : "bg-white dark:bg-[#343a39] text-[#0d5c5a] dark:text-[#8ed2d4] hover:bg-[#0d5c5a] hover:text-white"
                  }`}
                  title={rem.completed ? "Desmarcar" : "Concluir Lembrete"}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {rem.completed ? "check" : "notifications"}
                  </span>
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-lg font-bold text-on-surface dark:text-[#e1e3e0] ${
                        rem.completed ? "line-through opacity-70" : ""
                      }`}
                    >
                      {rem.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/70 dark:bg-white/10 text-secondary dark:text-[#b4cbcb]">
                      {rem.recurring}
                    </span>
                  </div>

                  {rem.description && (
                    <p className="text-sm text-secondary dark:text-[#b4cbcb] font-medium">
                      {rem.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-secondary dark:text-[#b4cbcb] pt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#0d5c5a] dark:text-[#8ed2d4]">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {rem.time}
                    </span>
                  </div>
                </div>
              </div>

              {capabilities.canManageActivities && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(rem)}
                    className="p-3 text-secondary hover:text-primary rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Editar Lembrete"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteReminder(rem.id, rem.title)}
                    className="p-3 text-secondary hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                    title="Excluir Lembrete"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {reminders.length === 0 && (
            <div className="bg-[#e4e8e5] dark:bg-[#282d2c] p-10 rounded-3xl text-center space-y-2 border border-black/5 dark:border-white/5">
              <span className="material-symbols-outlined text-5xl text-outline text-secondary dark:text-[#b4cbcb]">
                notifications_off
              </span>
              <h3 className="text-lg font-bold text-on-surface dark:text-[#e1e3e0]">
                Não há nenhum lembrete cadastrado ainda
              </h3>
              <p className="text-sm text-secondary dark:text-[#b4cbcb]">
                Cadastre um novo lembrete para acompanhar a rotina e avisos.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface dark:bg-[#232726] border border-outline-variant/40 text-on-surface dark:text-[#e1e3e0] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary dark:text-[#8ed2d4]">
                <span className="material-symbols-outlined text-2xl">
                  {editingReminder ? "edit_notifications" : "notifications_active"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface dark:text-[#e1e3e0]">
                  {editingReminder ? "Editar Lembrete" : "Novo Lembrete Recorrente"}
                </h2>
                <p className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Agende avisos para hidratação, aferição ou cuidados.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
                  Título do Lembrete *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ex: Beber 250ml de água"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
                    Horário
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
                    Frequência
                  </label>
                  <select
                    name="recurring"
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors"
                  >
                    <option value="Todos os dias">Todos os dias</option>
                    <option value="Único">Apenas hoje (Único)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows="3"
                  name="description"
                  placeholder="Instruções adicionais..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-secondary hover:bg-surface-container text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md active:scale-95 text-sm cursor-pointer"
                >
                  {editingReminder ? "Salvar Alterações" : "Criar Lembrete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
