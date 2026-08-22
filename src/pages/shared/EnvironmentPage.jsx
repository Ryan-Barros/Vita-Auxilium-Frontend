import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { getCapabilities } from "../../config/profileCapabilities";

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
  
  // Active profile fallback to user profile or default to FAMILY
  const initialProfile = (user?.profile || user?.role || "FAMILY").toUpperCase();
  const [activeProfile, setActiveProfile] = useState(initialProfile);

  const capabilities = getCapabilities(activeProfile);

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

      {/* DYNAMIC LAYOUT ACCORDING TO PROFILE & CAPABILITIES */}

      {/* 1. ELDERLY PROFILE LAYOUT */}
      {activeProfile === "ELDERLY" && (
        <div className="space-y-10">
          <header className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Bom dia, Dona Maria!
            </h1>
            <p className="text-secondary dark:text-[#b4cbcb] text-xl font-light">
              É um prazer ver você hoje. Vamos conferir sua rotina?
            </p>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NextActivityCard showConcludeButton={true} />
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
          <CaregiverHeaderCard />

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
              Bem-vindo de volta, Família Silva
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
