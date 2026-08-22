export default function WellnessTipCard({
  title = "Dica de Bem-estar",
  tipText = "Manter a hidratação constante ajuda na clareza mental e na disposição da Sra. Helena hoje.",
  imageSrc = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800",
}) {
  return (
    <div className="relative rounded-[2.5rem] overflow-hidden min-h-[320px] shadow-lg flex flex-col justify-end p-6 md:p-8 h-full">
      <img
        src={imageSrc}
        alt="Ambiente calmo e saudável"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Glassmorphic Overlay */}
      <div className="relative z-10 bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 rounded-3xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-extrabold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-300">lightbulb</span>
          <span>{title}</span>
        </h3>
        <p className="text-sm font-medium leading-relaxed text-slate-100">
          {tipText}
        </p>
      </div>
    </div>
  );
}
