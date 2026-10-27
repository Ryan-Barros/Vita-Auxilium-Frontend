import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { getCapabilities } from "../../config/profileCapabilities";
import ActivitiesContainer from "../../components/Activities/ActivitiesContainer";

export default function ActivitiesPage() {
  const { user } = useAuthStore();
  
  // Default to authenticated user's profile, falling back to FAMILY
  const initialProfile = (user?.profile || user?.role || "FAMILY").toUpperCase();
  const [activeProfile, setActiveProfile] = useState(initialProfile);

  const capabilities = getCapabilities(activeProfile);

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Selector Banner (Preview / Dynamic Toggle) */}
      <div className="bg-white dark:bg-[#202524] p-4 rounded-3xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-secondary dark:text-[#b4cbcb] text-sm font-semibold px-2">
          <span className="material-symbols-outlined text-xl text-[#0d5c5a] dark:text-[#8ed2d4]">
            tune
          </span>
          <span>Simular Visualização como:</span>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low dark:bg-[#191c1b] p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveProfile("FAMILY")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "FAMILY"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            Familiar
          </button>
          <button
            onClick={() => setActiveProfile("CAREGIVER")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "CAREGIVER"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            Cuidador
          </button>
          <button
            onClick={() => setActiveProfile("ELDERLY")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "ELDERLY"
                ? "bg-[#0d5c5a] text-white shadow-xs"
                : "text-secondary hover:text-primary"
            }`}
          >
            Idoso
          </button>
        </div>
      </div>

      {/* Profile Tailored Page Header */}
      <header className="border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              {activeProfile === "FAMILY" && "Gestão de Atividades e Rotinas"}
              {activeProfile === "CAREGIVER" && "Acompanhamento de Atividades"}
              {activeProfile === "ELDERLY" && "Minhas Atividades e Lembretes"}
            </h1>

            {/* Profile Tag Badge */}
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#0d5c5a]/10 text-[#0d5c5a] dark:text-[#8ed2d4] border border-[#0d5c5a]/20">
              {activeProfile === "FAMILY" && "Perfil Familiar"}
              {activeProfile === "CAREGIVER" && "Perfil Cuidador"}
              {activeProfile === "ELDERLY" && "Perfil Idoso"}
            </span>
          </div>

          <p className="text-secondary dark:text-[#b4cbcb] text-base font-light mt-1">
            {activeProfile === "FAMILY" &&
              "Cadastre, monitore e edite os compromissos, medicação e tarefas do dia a dia."}
            {activeProfile === "CAREGIVER" &&
              "Confira a programação do idoso e marque as tarefas concluídas ao longo do seu turno."}
            {activeProfile === "ELDERLY" &&
              "Acompanhe seus horários de remédios, refeições e momentos de lazer com facilidade."}
          </p>
        </div>
      </header>

      {/* Activities Component Container */}
      <ActivitiesContainer
        canManageActivities={capabilities.canManageActivities}
        canInteractActivities={capabilities.canInteractActivities}
      />
    </div>
  );
}
