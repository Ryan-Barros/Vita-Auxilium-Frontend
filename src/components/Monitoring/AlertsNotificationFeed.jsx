/**
 * AlertsNotificationFeed Component
 * Feed interativo de alertas de telemetria e avisos de sinais vitais do idoso.
 */
export default function AlertsNotificationFeed({ alerts = [], onMarkAsRead }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] border border-outline-variant/20 text-center">
        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl mb-2">
          check_circle
        </span>
        <p className="text-sm font-semibold text-on-surface dark:text-[#e1e3e0]">
          Nenhum alerta recente registrado
        </p>
        <p className="text-xs text-secondary dark:text-[#b4cbcb] mt-1">
          Todos os parâmetros de telemetria estão estáveis.
        </p>
      </div>
    );
  }

  const getTypeStyle = (type) => {
    switch (type) {
      case "critical":
        return {
          icon: "error",
          iconColor: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50",
          border: "border-l-4 border-l-red-600",
        };
      case "warning":
        return {
          icon: "warning",
          iconColor: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50",
          border: "border-l-4 border-l-amber-500",
        };
      case "info":
      default:
        return {
          icon: "info",
          iconColor: "text-primary dark:text-[#8ed2d4] bg-primary/10 dark:bg-[#8ed2d4]/20",
          border: "border-l-4 border-l-primary dark:border-l-[#8ed2d4]",
        };
    }
  };

  return (
    <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] border border-outline-variant/20 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4] text-xl">
            notifications
          </span>
          <h4 className="font-bold text-on-surface dark:text-[#e1e3e0] text-base">
            Alertas de Telemetria
          </h4>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-primary/10 text-primary dark:text-[#8ed2d4] rounded-full">
          {alerts.length} eventos
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const style = getTypeStyle(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl bg-white dark:bg-[#202524] border border-outline-variant/20 shadow-2xs transition-all ${
                style.border
              } ${!alert.read ? "ring-1 ring-primary/20 dark:ring-[#8ed2d4]/30" : "opacity-80"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl flex-shrink-0 ${style.iconColor}`}>
                  <span className="material-symbols-outlined text-lg">{style.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="text-xs font-bold text-on-surface dark:text-[#e1e3e0] truncate">
                      {alert.title}
                    </h5>
                    <span className="text-[10px] text-secondary dark:text-[#b4cbcb] flex-shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-secondary dark:text-[#b4cbcb] leading-relaxed">
                    {alert.description}
                  </p>

                  {!alert.read && (
                    <button
                      onClick={() => onMarkAsRead && onMarkAsRead(alert.id)}
                      className="mt-2 text-[10px] font-bold text-primary dark:text-[#8ed2d4] hover:underline cursor-pointer"
                    >
                      Marcar como lido
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
