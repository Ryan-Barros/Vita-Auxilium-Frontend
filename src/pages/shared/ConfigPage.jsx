import { useState, useEffect } from "react";
import { fonte } from "../../utils/fonte";
import { useToastStore } from "../../stores/toastStore";

/**
 * ConfigPage
 * Configurações de acessibilidade visual (escala tipográfica Lexend e modo escuro).
 */
export default function ConfigPage() {
  const showToast = useToastStore((s) => s.showToast);
  const [fontScale, setFontScale] = useState(
    () => localStorage.getItem("vita-font-scale") || "NORMAL"
  );
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const scaleMap = {
      PEQUENA: "14px",
      NORMAL: "16px",
      GRANDE: "18px",
    };
    document.documentElement.style.fontSize = scaleMap[fontScale] || "16px";
    localStorage.setItem("vita-font-scale", fontScale);
  }, [fontScale]);

  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("vita-theme", next ? "dark" : "light");
    showToast(
      next ? "Modo escuro ativado." : "Modo claro ativado.",
      "info"
    );
  };

  const handleSelectFont = (scale) => {
    setFontScale(scale);
    showToast(`Tamanho da fonte ajustado para ${scale}.`, "success");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <header className="border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2.5 bg-primary/10 text-primary dark:bg-[#8ed2d4]/20 dark:text-[#8ed2d4] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              accessibility_new
            </span>
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Acessibilidade e Aparência
            </h1>
            <p className="text-secondary dark:text-[#b4cbcb] text-sm">
              Ajuste o tamanho da leitura e o contraste visual do VitaAuxilium.
            </p>
          </div>
        </div>
      </header>

      {/* Escala de Fonte */}
      <section className="bg-surface-container-lowest dark:bg-[#252a29] rounded-[2rem] p-8 border border-outline-variant/20 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4]">
            format_size
          </span>
          <h2 className="text-lg font-bold text-on-surface dark:text-[#e1e3e0]">
            Escala de Fonte (Lexend)
          </h2>
        </div>
        <p className="text-sm text-secondary dark:text-[#b4cbcb]">
          Escolha o tamanho de texto mais confortável para leitura diária:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {fonte.map((scale) => {
            const isSelected = fontScale === scale;
            return (
              <button
                key={scale}
                type="button"
                onClick={() => handleSelectFont(scale)}
                className={`p-4 rounded-2xl border-2 font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isSelected
                    ? "border-primary dark:border-[#8ed2d4] bg-primary/10 dark:bg-[#8ed2d4]/15 text-primary dark:text-[#8ed2d4]"
                    : "border-outline-variant/40 text-secondary dark:text-[#b4cbcb] hover:border-primary/40"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  text_fields
                </span>
                <span>{scale}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tema Claro / Escuro */}
      <section className="bg-surface-container-lowest dark:bg-[#252a29] rounded-[2rem] p-8 border border-outline-variant/20 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-on-surface dark:text-[#e1e3e0] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4]">
              {darkMode ? "dark_mode" : "light_mode"}
            </span>
            <span>Modo Escuro</span>
          </h2>
          <p className="text-sm text-secondary dark:text-[#b4cbcb]">
            Reduz o brilho da tela em ambientes com pouca iluminação.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleDark}
          className="px-5 py-3 rounded-2xl bg-primary text-on-primary hover:bg-primary-container font-bold text-sm transition-all cursor-pointer active:scale-95"
        >
          {darkMode ? "Mudar para Modo Claro" : "Ativar Modo Escuro"}
        </button>
      </section>
    </div>
  );
}
