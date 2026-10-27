import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { environmentService } from "../../services/environmentService";
import { activityService } from "../../services/activityService";
import { reminderService } from "../../services/reminderService";
import { deviceService } from "../../services/deviceService";
import { humorService } from "../../services/humorService";

const HUMOR_LABEL_MAP = {
  VERY_HAPPY: "Muito Feliz",
  HAPPY: "Feliz",
  NEUTRAL: "Tranquilo(a)",
  SAD: "Triste",
  ANGRY: "Irritado(a)",
  BAD: "Triste",
  VERY_BAD: "Infeliz",
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { currentEnvironment } = useEnvironmentStore();

  const [activities, setActivities] = useState([]);
  const [remindersCount, setRemindersCount] = useState(0);
  const [deviceName, setDeviceName] = useState("Nenhum vinculado");
  const [latestMood, setLatestMood] = useState("Sem registro");

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      if (!currentEnvironment?.id) return;
      try {
        await environmentService.setActiveEnvironment(currentEnvironment.id);
      } catch {
        // ignore if already active
      }

      const [actsRes, remsRes, devsRes, moodRes] = await Promise.allSettled([
        activityService.getActivities(),
        reminderService.getReminders(),
        deviceService.getEnvironmentDevices(),
        humorService.getLatestHumor(),
      ]);

      if (!mounted) return;

      if (actsRes.status === "fulfilled" && Array.isArray(actsRes.value)) {
        setActivities(actsRes.value);
      }
      if (remsRes.status === "fulfilled" && Array.isArray(remsRes.value)) {
        setRemindersCount(remsRes.value.filter((r) => !r.completed).length);
      }
      if (devsRes.status === "fulfilled" && Array.isArray(devsRes.value)) {
        setDeviceName(
          devsRes.value.length > 0 ? devsRes.value[0].name : "Nenhum vinculado"
        );
      }
      if (moodRes.status === "fulfilled" && moodRes.value?.humorRange) {
        setLatestMood(
          HUMOR_LABEL_MAP[moodRes.value.humorRange] || moodRes.value.humorRange
        );
      }
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [currentEnvironment?.id]);

  const pendingActivities = activities.filter((a) => !a.completed);
  const todayFormatted = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary dark:text-[#8ed2d4] mb-2 transition-colors duration-300">
            Bem-vindo(a), {user?.name || "Família"}
          </h1>
          <p className="text-secondary dark:text-[#b4cbcb] text-xl font-light transition-colors duration-300">
            {currentEnvironment?.name
              ? `Ambiente: ${currentEnvironment.name} • Hoje, ${todayFormatted}`
              : `Selecione um ambiente de cuidado • Hoje, ${todayFormatted}`}
          </p>
        </div>

        {!currentEnvironment && (
          <button
            type="button"
            onClick={() => navigate("/environments")}
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-2xl shadow-sm hover:bg-primary-container transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">home_health</span>
            <span>Selecionar Ambiente</span>
          </button>
        )}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => navigate("/activities")}
          className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-primary/20 dark:hover:border-[#8ed2d4]/20"
        >
          <div className="bg-primary/10 dark:bg-[#8ed2d4]/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4] text-3xl">
              event_available
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Atividades Pendentes
          </span>
          <span className="text-4xl font-bold text-on-surface dark:text-[#e1e3e0]">
            {String(pendingActivities.length).padStart(2, "0")}
          </span>
        </div>

        <div
          onClick={() => navigate("/reminders")}
          className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-tertiary/20 dark:hover:border-tertiary-fixed-dim/20"
        >
          <div className="bg-tertiary/10 dark:bg-tertiary-fixed-dim/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-tertiary dark:text-tertiary-fixed-dim text-3xl">
              notifications_active
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Lembretes Ativos
          </span>
          <span className="text-4xl font-bold text-on-surface dark:text-[#e1e3e0]">
            {String(remindersCount).padStart(2, "0")}
          </span>
        </div>

        <div
          onClick={() => navigate("/monitoring")}
          className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-primary-container/20 dark:hover:border-primary-container/40"
        >
          <div className="bg-primary-container/10 dark:bg-primary-container/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary-container dark:text-[#9fe4e6] text-3xl">
              watch
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Monitoramento Relógio
          </span>
          <span className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
            {deviceName}
          </span>
        </div>

        <div
          onClick={() => navigate("/activities")}
          className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-on-tertiary-fixed-variant/20 dark:hover:border-tertiary-fixed/30"
        >
          <div className="bg-tertiary-fixed-dim/20 dark:bg-tertiary-fixed/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span
              className="material-symbols-outlined text-on-tertiary-fixed-variant dark:text-tertiary-fixed text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              sentiment_satisfied
            </span>
          </div>
          <span className="block text-secondary dark:text-[#b4cbcb] text-sm font-medium uppercase tracking-wider mb-1">
            Último Humor
          </span>
          <span className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
            {latestMood}
          </span>
        </div>
      </section>

      <section>
        <div className="bg-surface-container-highest dark:bg-[#2e312f] p-8 md:p-10 rounded-[2.5rem] shadow-sm transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
              Próximas Atividades
            </h3>
            <button
              type="button"
              onClick={() => navigate("/activities")}
              className="px-8 py-3 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Gerenciar Atividades
            </button>
          </div>

          {pendingActivities.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface-container-low/50 dark:bg-white/5">
              <p className="text-secondary dark:text-[#b4cbcb] font-medium">
                {currentEnvironment
                  ? "Nenhuma atividade pendente para este ambiente."
                  : "Selecione um ambiente para visualizar as atividades agendadas."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate("/activities")}
                  className="flex items-start gap-4 p-4 rounded-3xl hover:bg-surface-container-low/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-3 h-14 bg-primary dark:bg-[#8ed2d4] rounded-full mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-primary dark:text-[#8ed2d4]">
                      {act.time || "Hoje"} • {act.category || "ROTINA"}
                    </span>
                    <p className="text-on-surface dark:text-[#e1e3e0] text-xl font-medium">
                      {act.title}
                    </p>
                    <span className="text-sm text-secondary dark:text-[#b4cbcb]">
                      {act.description || "Agendado"}
                    </span>
                  </div>
                </div>
              ))}

              <div
                onClick={() => navigate("/activities")}
                className="flex items-center justify-center p-4 rounded-3xl border-2 border-dashed border-outline-variant dark:border-outline/40 hover:border-primary/50 dark:hover:border-[#8ed2d4]/50 transition-colors cursor-pointer group"
              >
                <div className="text-center">
                  <span className="material-symbols-outlined text-outline dark:text-[#bec9c8] group-hover:text-primary dark:group-hover:text-[#8ed2d4] transition-colors text-3xl">
                    more_horiz
                  </span>
                  <p className="text-sm font-medium text-secondary dark:text-[#b4cbcb] group-hover:text-primary dark:group-hover:text-[#8ed2d4] transition-colors">
                    Ver todas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
