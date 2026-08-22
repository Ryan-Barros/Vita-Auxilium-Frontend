import { useState } from "react";

export default function CalmnessMomentCard() {
  const [isRelaxing, setIsRelaxing] = useState(false);
  const [seconds, setSeconds] = useState(10);

  const startRelaxation = () => {
    setIsRelaxing(true);
    setSeconds(10);

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRelaxing(false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-[#4c5880] text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
      <div className="space-y-4 max-w-xl">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Momento de Calma
        </h2>
        <p className="text-slate-100 text-base md:text-lg font-light leading-relaxed">
          Respire fundo por 10 segundos. Aprecie a beleza do dia e relaxe seus ombros.
        </p>

        <button
          onClick={startRelaxation}
          disabled={isRelaxing}
          className="mt-4 bg-white text-[#4c5880] hover:bg-slate-100 font-extrabold px-8 py-4 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer text-base md:text-lg disabled:opacity-80"
        >
          <span className="material-symbols-outlined text-2xl">spa</span>
          <span>
            {isRelaxing ? `Relaxando... (${seconds}s)` : "Começar Relaxamento"}
          </span>
        </button>
      </div>

      <div className="w-full md:w-72 h-48 rounded-[2rem] overflow-hidden shadow-inner flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800"
          alt="Caminho iluminado na floresta"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
