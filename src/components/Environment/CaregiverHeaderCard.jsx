export default function CaregiverHeaderCard({
  caregiverName = "Ana",
  elderName = "Sra. Helena",
  dateText = "12 de Outubro",
  completedCount = 8,
  totalCount = 12,
}) {
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Greeting Card */}
      <div className="lg:col-span-2 bg-[#eef2ee] dark:bg-[#252a29] p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between shadow-xs">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d5c5a] dark:text-[#8ed2d4] tracking-tight mb-3">
            Bom dia, {caregiverName}
          </h1>
          <p className="text-secondary dark:text-[#b4cbcb] text-base md:text-lg font-light leading-relaxed max-w-xl">
            Hoje é um novo dia para cuidar com excelência e empatia. Aqui está o que temos para a {elderName}.
          </p>
        </div>

        <div className="mt-8 self-start">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#343a39] text-[#0d5c5a] dark:text-[#8ed2d4] font-bold text-sm rounded-full shadow-xs">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span>{dateText}</span>
          </span>
        </div>
      </div>

      {/* Right Progress Count Card */}
      <div className="bg-[#4d5784] text-white p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-9xl">task_alt</span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-slate-300 font-bold block mb-4">
            Progresso do Dia
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-extrabold tracking-tight">
              {String(completedCount).padStart(2, "0")}
            </span>
            <span className="text-2xl text-slate-300 font-medium">/ {totalCount}</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-slate-200 mt-2 block font-medium">
            {percentage}% das atividades concluídas
          </span>
        </div>
      </div>
    </div>
  );
}
