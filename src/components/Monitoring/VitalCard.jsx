/**
 * VitalCard Component
 * Exibe a medição atual de um sinal vital (BPM, SpO2, Pressão, Temperatura, Passos, Quedas)
 * com indicador de normalidade, min/máx e ícone estilizado.
 */
export default function VitalCard({
  title,
  value,
  unit,
  subtitle,
  status = "normal",
  icon,
  iconBgColor = "bg-primary/10 dark:bg-[#8ed2d4]/20",
  iconTextColor = "text-primary dark:text-[#8ed2d4]",
  minMax,
  lastUpdated,
}) {
  const getBadgeStyle = () => {
    switch (status) {
      case "alert":
        return "bg-error-container text-on-error-container dark:bg-red-900/40 dark:text-red-300";
      case "warning":
        return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300";
      case "normal":
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "alert":
        return "Atenção";
      case "warning":
        return "Elevado";
      case "normal":
      default:
        return "Estável";
    }
  };

  return (
    <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] border border-outline-variant/20 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
      <div>
        {/* Superior: Ícone e Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${iconBgColor}`}
          >
            <span className={`material-symbols-outlined text-3xl ${iconTextColor}`}>
              {icon}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeStyle()}`}
          >
            {getStatusLabel()}
          </span>
        </div>

        {/* Título e Valor Principal */}
        <span className="block text-secondary dark:text-[#b4cbcb] text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </span>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-secondary dark:text-[#b4cbcb] text-base font-semibold">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Rodapé: Subtítulo, Min/Max ou Horário */}
      <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-secondary dark:text-[#b4cbcb]">
        {minMax ? (
          <span>Min: {minMax.min} | Máx: {minMax.max}</span>
        ) : (
          <span>{subtitle || "Sinais dentro do esperado"}</span>
        )}
        {lastUpdated && <span className="opacity-75">{lastUpdated}</span>}
      </div>
    </div>
  );
}
