import { useState } from "react";

const EMOJI_MOODS = [
  { id: "VERY_HAPPY", label: "Muito Bem", emoji: "😆", icon: "sentiment_very_satisfied" },
  { id: "HAPPY", label: "Bem", emoji: "😊", icon: "sentiment_satisfied" },
  { id: "NEUTRAL", label: "Neutro", emoji: "😐", icon: "sentiment_neutral" },
  { id: "BAD", label: "Mal", emoji: "😟", icon: "sentiment_dissatisfied" },
  { id: "VERY_BAD", label: "Muito Mal", emoji: "😭", icon: "sentiment_very_dissatisfied" },
];

export default function MoodTrackerCard({ mode = "select", onSelectMood, lastUpdated = "08:30" }) {
  const [selectedMood, setSelectedMood] = useState("HAPPY");

  const handleSelect = (id, label) => {
    setSelectedMood(id);
    if (onSelectMood) onSelectMood(id, label);
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
              : "Acompanhamento do estado emocional de Sra. Helena."}
          </p>
        </div>

        {!isElderlyView && (
          <span className="self-start md:self-auto px-4 py-1.5 bg-black/5 dark:bg-white/10 text-secondary dark:text-[#b4cbcb] text-xs font-semibold rounded-full">
            Última atualização: {lastUpdated}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {EMOJI_MOODS.map((item) => {
          const isSelected = selectedMood === item.id;
          return (
            <button
              key={item.id}
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
    </div>
  );
}
