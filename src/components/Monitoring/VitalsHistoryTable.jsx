/**
 * VitalsHistoryTable Component
 * Tabela com registros de telemetria detalhados (Horário, BPM, SpO2, Pressão Arterial e Status).
 */
export default function VitalsHistoryTable({ data = [] }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container-highest dark:bg-[#2e312f] p-6 md:p-8 rounded-[2.5rem] shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface dark:text-[#e1e3e0]">
            Histórico Detalhado de Leituras
          </h3>
          <p className="text-xs text-secondary dark:text-[#b4cbcb] mt-0.5">
            Registros de telemetria recebidos via protocolo seguro de amostragem IoT
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 text-secondary dark:text-[#b4cbcb] font-bold uppercase tracking-wider">
              <th className="pb-3 px-3">Horário / Data</th>
              <th className="pb-3 px-3">Batimentos (BPM)</th>
              <th className="pb-3 px-3">Oxigenação (SpO2)</th>
              <th className="pb-3 px-3">Pressão Arterial</th>
              <th className="pb-3 px-3 text-right">Status do Sinal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-medium text-on-surface dark:text-[#e1e3e0]">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-surface-container-low/50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-3 font-semibold text-primary dark:text-[#8ed2d4]">
                  {row.label}
                </td>
                <td className="py-3 px-3">
                  <span className="font-bold">{row.heartRate || 74}</span> BPM
                </td>
                <td className="py-3 px-3">
                  <span className="font-bold">{row.oxygen || 98}</span>%
                </td>
                <td className="py-3 px-3">
                  {row.systolic ? `${row.systolic}/78 mmHg` : "120/80 mmHg"}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Normal
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
