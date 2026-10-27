import { useState } from "react";

/**
 * HeartRateChart Component
 * Gráfico interativo SVG responsivo para tendências de sinais vitais ao longo do tempo.
 */
export default function HeartRateChart({
  data = [],
  timeframe = "today",
  onTimeframeChange,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-container-highest dark:bg-[#2e312f] p-8 rounded-[2.5rem] flex items-center justify-center text-secondary">
        Nenhum dado de telemetria registrado para o período.
      </div>
    );
  }

  // Dimensões do SVG
  const width = 600;
  const height = 220;
  const padding = { top: 30, right: 30, bottom: 40, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Obter min e max para escala no eixo Y
  const bpmValues = data.map((d) => d.heartRate || 70);
  const minY = Math.min(...bpmValues, 50);
  const maxY = Math.max(...bpmValues, 110);

  const getX = (index) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    return height - padding.bottom - ((val - minY) / (maxY - minY)) * chartHeight;
  };

  // Gerar caminho da linha suave (SVG path)
  const points = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.heartRate || 70),
    data: d,
  }));

  const linePath = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
  }, "");

  // Caminho da área sob a curva (para gradiente)
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`;

  // Zona Normal de Repouso (60 - 100 BPM)
  const normalTopY = getY(100);
  const normalBottomY = getY(60);
  const normalZoneHeight = Math.max(0, normalBottomY - normalTopY);

  return (
    <div className="bg-surface-container-highest dark:bg-[#2e312f] p-6 md:p-8 rounded-[2.5rem] shadow-xs">
      {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004f51] dark:text-[#8ed2d4] text-2xl">
              ecg
            </span>
            <h3 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0]">
              Frequência Cardíaca (BPM)
            </h3>
          </div>
          <p className="text-secondary dark:text-[#b4cbcb] text-sm mt-0.5">
            Evolução dos batimentos por minuto registrados pelo relógio IoT
          </p>
        </div>

        {/* Seletor de Período */}
        <div className="flex items-center gap-1 bg-surface-container-low dark:bg-[#191c1b] p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => onTimeframeChange && onTimeframeChange("today")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeframe === "today"
                ? "bg-[#004f51] text-white shadow-xs"
                : "text-secondary hover:text-primary dark:text-[#b4cbcb]"
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => onTimeframeChange && onTimeframeChange("week")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeframe === "week"
                ? "bg-[#004f51] text-white shadow-xs"
                : "text-secondary hover:text-primary dark:text-[#b4cbcb]"
            }`}
          >
            Últimos 7 dias
          </button>
        </div>
      </div>

      {/* Container SVG Responsivo */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="bpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#004f51" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#004f51" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Faixa Alvo Normal (60 - 100 BPM) */}
          <rect
            x={padding.left}
            y={normalTopY}
            width={chartWidth}
            height={normalZoneHeight}
            fill="#10b981"
            fillOpacity="0.08"
            rx="4"
          />
          <text
            x={width - padding.right - 5}
            y={normalTopY + 12}
            textAnchor="end"
            className="text-[10px] fill-emerald-600 dark:fill-emerald-400 font-semibold"
          >
            Faixa Normal (60-100)
          </text>

          {/* Linhas de Grade Horizontal */}
          {[60, 80, 100].map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#bec9c8"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 3}
                textAnchor="end"
                className="text-[10px] fill-secondary dark:fill-[#b4cbcb]"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Área Gradiente */}
          <path d={areaPath} fill="url(#bpmGradient)" />

          {/* Linha Principal */}
          <path
            d={linePath}
            fill="none"
            stroke="#004f51"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-[#8ed2d4]"
          />

          {/* Pontos de Medição e Interação */}
          {points.map((pt, i) => (
            <g
              key={i}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Rótulo Eixo X (Hora/Dia) */}
              <text
                x={pt.x}
                y={height - 12}
                textAnchor="middle"
                className="text-[11px] font-semibold fill-secondary dark:fill-[#b4cbcb]"
              >
                {pt.data.label}
              </text>

              {/* Círculo Interno do Ponto */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                className="fill-[#004f51] dark:fill-[#8ed2d4] stroke-white dark:stroke-[#2e312f]"
                strokeWidth="2.5"
              />

              {/* Halo de Hover */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="10"
                className="fill-[#004f51]/20 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip ao passar o mouse */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-inverse-surface text-inverse-on-surface p-2.5 rounded-xl text-xs font-bold shadow-lg pointer-events-none transition-all transform -translate-x-1/2 -translate-y-12"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#8ed2d4]">
                favorite
              </span>
              <span>{hoveredPoint.data.heartRate} BPM</span>
            </div>
            <div className="text-[10px] text-inverse-on-surface/80 font-normal">
              {hoveredPoint.data.label} • SpO2: {hoveredPoint.data.oxygen || 98}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

