import { useState, useEffect } from "react";
import { humorService } from "../../services/humorService";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { useToastStore } from "../../stores/toastStore";

const EMOJI_MOODS = [
  { id: "VERY_HAPPY", label: "Muito Bem", emoji: "😆", icon: "sentiment_very_satisfied" },
  { id: "HAPPY", label: "Bem", emoji: "😊", icon: "sentiment_satisfied" },
  { id: "NEUTRAL", label: "Neutro", emoji: "😐", icon: "sentiment_neutral" },
  { id: "BAD", label: "Mal", emoji: "😟", icon: "sentiment_dissatisfied" },
  { id: "VERY_BAD", label: "Muito Mal", emoji: "😭", icon: "sentiment_very_dissatisfied" },
];

export default function MoodTrackerCard({ mode = "select", onSelectMood }) {
  const [selectedMood, setSelectedMood] = useState("HAPPY");
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("Sem registros hoje");
  const [observation, setObservation] = useState("");
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const currentEnvironment = useEnvironmentStore((s) => s.currentEnvironment);
  const { showToast } = useToastStore();

  useEffect(() => {
    if (!currentEnvironment?.id) return;
    let isMounted = true;

    humorService
      .getHumors()
      .then((list) => {
        if (!isMounted) return;
        setHistory(list);
        if (list.length > 0) {
          const latest = list[0];
          setSelectedMood(latest.humor || "HAPPY");
          if (latest.registrationTime) {
            setLastUpdatedLabel(
              new Date(latest.registrationTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            );
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [currentEnvironment?.id]);

  const handleSelect = async (id, label) => {
    setSelectedMood(id);
    if (onSelectMood) onSelectMood(id, label);

    if (!currentEnvironment?.id) {
      showToast("Selecione e ative um ambiente para salvar o registro de humor.", "info");
      return;
    }

    setIsSaving(true);
    try {
      const created = await humorService.createHumor({
        humor: id,
        observation: observation.trim() || undefined,
      });
      setHistory((prev) => [created, ...prev]);
      setObservation("");
      const timestamp = created.registrationTime
        ? new Date(created.registrationTime)
        : new Date();
      setLastUpdatedLabel(
        timestamp.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      showToast(`Humor "${label}" registrado com sucesso!`, "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Erro ao registrar humor.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHumor = async (id) => {
    try {
      await humorService.deleteHumor(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
      showToast("Registro de humor removido.", "info");
    } catch {
      showToast("Não foi possível remover o registro de humor.", "error");
    }
  };

  const isElderlyView = mode === "select";

  return (
    <div className="bg-[#f2f5f3] dark:bg-[#252a29] p-8 md:p-10 rounded-[2.5rem] shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
            {isElderlyView
              ? "Como você está se sentindo agora?"
              : "Registro de Humor"}
          </h2>
          <p className="text-secondary dark:text-[#b4cbcb] text-base md:text-lg font-light mt-1">
            {isElderlyView
              ? "Escolha a imagem que melhor combina com você."
              : "Acompanhamento do estado emocional no ambiente ativo."}
          </p>
        </div>

        <span className="self-start md:self-auto px-4 py-1.5 bg-black/5 dark:bg-white/10 text-secondary dark:text-[#b4cbcb] text-xs font-semibold rounded-full">
          Última atualização: {lastUpdatedLabel}
        </span>
      </div>

      {/* Optional observation input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="moodObservation"
          placeholder="Observação opcional antes de registrar (ex.: Dormiu bem hoje)"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          disabled={isSaving}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#191c1b] border border-outline-variant/40 text-sm text-on-surface dark:text-[#e1e3e0] focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {EMOJI_MOODS.map((item) => {
          const isSelected = selectedMood === item.id;
          return (
            <button
              type="button"
              key={item.id}
              disabled={isSaving}
              onClick={() => handleSelect(item.id, item.label)}
              className={`bg-white dark:bg-[#343a39] p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer shadow-xs border ${
                isSelected
                  ? "border-[#0d5c5a] dark:border-[#8ed2d4] ring-4 ring-[#0d5c5a]/20 scale-105 shadow-md"
                  : "border-transparent hover:border-black/10 hover:scale-102"
              }`}
            >
              {isElderlyView ? (
                <span className="text-5xl md:text-6xl">{item.emoji}</span>
              ) : (
                <span
                  className={`material-symbols-outlined text-4xl ${
                    isSelected ? "text-[#0d5c5a] dark:text-[#8ed2d4]" : "text-secondary"
                  }`}
                >
                  {item.icon}
                </span>
              )}
              <span className="font-extrabold text-on-surface dark:text-[#e1e3e0] text-sm md:text-base text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {!isElderlyView && history.length > 0 && (
        <div className="pt-4 border-t border-outline-variant/30 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb]">
            Últimos Registros
          </h3>
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {history.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between bg-white dark:bg-[#191c1b] px-4 py-2.5 rounded-2xl text-xs"
              >
                <div>
                  <span className="font-bold text-on-surface dark:text-[#e1e3e0]">
                    {entry.humorLabel || entry.humor}
                  </span>
                  {entry.observation && (
                    <span className="text-secondary dark:text-[#b4cbcb] ml-2">
                      — {entry.observation}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary dark:text-[#b4cbcb]">
                    {entry.registrationTime
                      ? new Date(entry.registrationTime).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteHumor(entry.id)}
                    title="Remover registro"
                    className="text-secondary hover:text-red-500 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
