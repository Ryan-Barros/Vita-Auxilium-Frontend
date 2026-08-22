import { useState } from "react";
import CreateEnvironmentModal from "./CreateEnvironmentModal";

const INITIAL_ENVIRONMENTS = [
  {
    id: 1,
    name: "Família Silva",
    responsible: "Sr. Ricardo Silva",
    status: "ATIVO",
  },
  {
    id: 2,
    name: "Família Helena",
    responsible: "Dra. Maria Helena",
    status: "OFFLINE",
  },
];

export default function FamilyEnvironmentsGrid({ canManageEnvironments = true }) {
  const [environments, setEnvironments] = useState(INITIAL_ENVIRONMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateEnvironment = (newEnv) => {
    setEnvironments([...environments, newEnv]);
  };

  const handleDeleteEnvironment = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o ambiente "${name}"?`)) {
      setEnvironments(environments.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Main Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
            Famílias sob Cuidado
          </h2>
          <p className="text-secondary dark:text-[#b4cbcb] text-base font-normal mt-2 leading-relaxed">
            Gerencie os grupos familiares e monitore a segurança e o bem-estar das pessoas que você ama em tempo real.
          </p>
        </div>

        {canManageEnvironments && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-3 bg-[#0d5c5a] hover:bg-[#084846] text-white font-bold px-7 py-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer self-start lg:self-auto text-base"
          >
            <span className="material-symbols-outlined text-2xl">person_add</span>
            <span>Cadastrar Novo Ambiente</span>
          </button>
        )}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {environments.map((env) => (
          <div
            key={env.id}
            className="bg-[#e4e8e5] dark:bg-[#282d2c] rounded-[2.5rem] p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all border border-black/5 dark:border-white/5"
          >
            {/* Top Row: Icon + Status Pill */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-white dark:bg-[#343a39] rounded-2xl flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[#0d5c5a] dark:text-[#8ed2d4] text-3xl">
                  groups
                </span>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  env.status === "ATIVO"
                    ? "bg-[#ccebe5] text-[#0d5c5a] dark:bg-[#0d5c5a]/40 dark:text-[#9fe4e6]"
                    : "bg-[#d8ddda] text-secondary dark:bg-white/10 dark:text-gray-300"
                }`}
              >
                {env.status}
              </span>
            </div>

            {/* Info */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0] mb-3">
                {env.name}
              </h3>
              <div className="flex items-center gap-2 text-secondary dark:text-[#b4cbcb] text-sm font-medium">
                <span className="material-symbols-outlined text-base">person</span>
                <span>
                  Responsável: <strong className="text-on-surface dark:text-[#e1e3e0]">{env.responsible}</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                className="w-full py-4 bg-white dark:bg-[#343a39] hover:bg-white/90 text-[#0d5c5a] dark:text-[#9fe4e6] font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer text-base"
              >
                <span>Entrar</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

              {canManageEnvironments && (
                <div className="flex items-center gap-3">
                  <button
                    title="Configurações do Ambiente"
                    className="flex-1 py-3 bg-white/70 dark:bg-white/5 hover:bg-white text-secondary hover:text-primary rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">settings</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEnvironment(env.id, env.name)}
                    title="Excluir Ambiente"
                    className="flex-1 py-3 bg-white/70 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/30 text-secondary hover:text-red-600 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl text-red-500">delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Dashed Add Card */}
        {canManageEnvironments && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-outline-variant/70 dark:border-outline/40 hover:border-[#0d5c5a] dark:hover:border-[#8ed2d4] bg-surface-container-low/40 dark:bg-white/2 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-lg group min-h-[360px]"
          >
            <div className="w-16 h-16 bg-white dark:bg-[#2e312f] rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#0d5c5a] dark:text-[#8ed2d4] text-3xl">
                person_add
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface dark:text-[#e1e3e0] mb-2">
              Novo Ambiente
            </h3>
            <p className="text-secondary dark:text-[#b4cbcb] text-sm font-normal max-w-xs leading-relaxed">
              Adicione um novo ambiente familiar para expandir sua rede de cuidados e segurança.
            </p>
          </div>
        )}
      </div>

      <CreateEnvironmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEnvironment}
      />
    </div>
  );
}
