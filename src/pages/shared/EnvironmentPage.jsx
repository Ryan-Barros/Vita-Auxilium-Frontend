import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { getCapabilities } from "../../config/profileCapabilities";
import { activityService } from "../../services/activityService";
import { useToastStore } from "../../stores/toastStore";

import NextActivityCard from "../../components/Environment/NextActivityCard";
import FamilyGreetingCard from "../../components/Environment/FamilyGreetingCard";
import MoodTrackerCard from "../../components/Environment/MoodTrackerCard";
import CalmnessMomentCard from "../../components/Environment/CalmnessMomentCard";
import CaregiverHeaderCard from "../../components/Environment/CaregiverHeaderCard";
import UpcomingActivitiesList from "../../components/Environment/UpcomingActivitiesList";
import WellnessTipCard from "../../components/Environment/WellnessTipCard";
import FamilyEnvironmentsGrid from "../../components/Environment/FamilyEnvironmentsGrid";

export default function EnvironmentPage() {
  const { user } = useAuthStore();
  const { currentEnvironment } = useEnvironmentStore();
  const { showToast } = useToastStore();

  const initialProfile = (user?.profile || user?.role || "FAMILY").toUpperCase();
  const [activeProfile, setActiveProfile] = useState(initialProfile);
  const [nextActivity, setNextActivity] = useState(null);

  const capabilities = getCapabilities(activeProfile);
  const userName =
    user?.name || user?.userName || (user?.email ? user.email.split("@")[0] : "Usuário");

  useEffect(() => {
    if (!currentEnvironment) return;
    let isMounted = true;
    activityService
      .getActivities()
      .then((list) => {
        if (!isMounted) return;
        const pending = list.find((a) => !a.completed) || list[0] || null;
        setNextActivity(pending);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [currentEnvironment]);

  const handleToggleNextActivity = async (completed) => {
    if (!nextActivity) return;
    try {
      const updated = await activityService.toggleActivityCompletion(nextActivity.id, completed);
      setNextActivity(updated);
      showToast(
        completed ? "Atividade concluída com sucesso!" : "Atividade marcada como pendente.",
        "success"
      );
    } catch {
      showToast("Não foi possível atualizar a atividade.", "error");
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Profile Selector Banner (Preview / Dynamic Toggle) */}
      <div className="bg-white dark:bg-[#252a29] p-4 rounded-3xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-secondary dark:text-[#b4cbcb] text-sm font-semibold px-2">
          <span className="material-symbols-outlined text-xl text-[#0d5c5a] dark:text-[#8ed2d4]">
            tune
          </span>
          <span>Visualizando Ambiente como:</span>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low dark:bg-[#191c1b] p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveProfile("FAMILY")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "FAMILY"
                ? "bg-[#0d5c5a] text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Familiar
          </button>
          <button
            type="button"
            onClick={() => setActiveProfile("CAREGIVER")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "CAREGIVER"
                ? "bg-[#0d5c5a] text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Cuidador
          </button>
          <button
            type="button"
            onClick={() => setActiveProfile("ELDERLY")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeProfile === "ELDERLY"
                ? "bg-[#0d5c5a] text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Idoso
          </button>
        </div>
      </div>

      {/* 1. ELDERLY PROFILE LAYOUT */}
      {activeProfile === "ELDERLY" && (
        <div className="space-y-10">
          <header className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Bom dia, {userName}!
            </h1>
            <p className="text-secondary dark:text-[#b4cbcb] text-xl font-light">
              É um prazer ver você hoje. Vamos conferir sua rotina?
            </p>
          </header>

          {!currentEnvironment && (
            <FamilyEnvironmentsGrid canManageEnvironments={false} />
          )}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NextActivityCard
                activity={nextActivity}
                onToggle={handleToggleNextActivity}
                showConcludeButton={true}
              />
            </div>
            <div>
              <FamilyGreetingCard />
            </div>
          </section>

          <MoodTrackerCard mode="select" />

          <CalmnessMomentCard />
        </div>
      )}

      {/* 2. CAREGIVER PROFILE LAYOUT */}
      {activeProfile === "CAREGIVER" && (
        <div className="space-y-10">
          <CaregiverHeaderCard caregiverName={userName} />

          <FamilyEnvironmentsGrid canManageEnvironments={false} />

          <MoodTrackerCard mode="caregiver" />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <UpcomingActivitiesList canManageActivities={capabilities.canManageActivities} />
            </div>
            <div>
              <WellnessTipCard />
            </div>
          </section>
        </div>
      )}

      {/* 3. FAMILY PROFILE LAYOUT */}
      {activeProfile === "FAMILY" && (
        <div className="space-y-10">
          <header className="border-b border-outline-variant/30 pb-6">
            <h1 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Gerenciar Ambientes
            </h1>
            <p className="text-secondary dark:text-[#b4cbcb] text-base font-light mt-1">
              Bem-vindo de volta, {userName}
            </p>
          </header>

          <FamilyEnvironmentsGrid canManageEnvironments={capabilities.canManageEnvironments} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            <div className="lg:col-span-2">
              <UpcomingActivitiesList canManageActivities={capabilities.canManageActivities} />
            </div>
            <div>
              <MoodTrackerCard mode="family_summary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
