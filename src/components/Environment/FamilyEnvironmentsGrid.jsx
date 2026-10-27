import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { useToastStore } from "../../stores/toastStore";
import { environmentService } from "../../services/environmentService";
import CreateEnvironmentModal from "./CreateEnvironmentModal";

export default function FamilyEnvironmentsGrid({
  canManageEnvironments = true,
  onEnvironmentActivated,
}) {
  const [environments, setEnvironments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const currentEnvironment = useEnvironmentStore((s) => s.currentEnvironment);
  const selectEnvironment = useEnvironmentStore((s) => s.selectEnvironment);
  const clearEnvironment = useEnvironmentStore((s) => s.clearEnvironment);
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    environmentService
      .getEnvironments()
      .then((data) => {
        if (isMounted) setEnvironments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao carregar ambientes:", err);
        if (isMounted) {
          showToast("Não foi possível carregar a lista de ambientes do servidor.", "error");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleEnterEnvironment = async (env) => {
    const envName = env.environmentName || env.name || "Ambiente";
    try {
      await environmentService.setActiveEnvironment(env.id);
    } catch (err) {
      console.warn("Aviso ao persistir ambiente ativo no servidor:", err);
    }
    const normalizedEnv = { ...env, name: envName, environmentName: envName };
    selectEnvironment(normalizedEnv);
    if (onEnvironmentActivated) onEnvironmentActivated(normalizedEnv);
    showToast(`Ambiente "${envName}" ativado.`, "success");
    navigate("/activities");
  };

  const handleCreateEnvironment = async (newEnv) => {
    setEnvironments((prev) => [newEnv, ...prev]);
    const envName = newEnv.environmentName || newEnv.name || "Ambiente";
    const normalizedEnv = { ...newEnv, name: envName, environmentName: envName };
    selectEnvironment(normalizedEnv);
    if (onEnvironmentActivated) onEnvironmentActivated(normalizedEnv);
  };

  const handleUpdateEnvironment = (updatedEnv) => {
    setEnvironments((prev) =>
      prev.map((env) => (env.id === updatedEnv.id ? updatedEnv : env))
    );
    if (currentEnvironment?.id === updatedEnv.id) {
      const envName = updatedEnv.environmentName || updatedEnv.name || "Ambiente";
      selectEnvironment({ ...updatedEnv, name: envName, environmentName: envName });
    }
    setEditingEnvironment(null);
  };

  const handleOpenEdit = (env) => {
    setEditingEnvironment(env);
    setIsModalOpen(true);
  };

  const handleDeleteEnvironment = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja desativar e remover o ambiente "${name}"?`)) {
      return;
    }
    try {
      await environmentService.deleteEnvironment(id);
      setEnvironments((prev) => prev.filter((e) => e.id !== id));
      if (currentEnvironment?.id === id) {
        clearEnvironment();
      }
      showToast(`Ambiente "${name}" removido com sucesso.`, "info");
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Não foi possível excluir o ambiente no servidor.";
      showToast(msg, "error");
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    const cleaned = inviteCode.trim().toUpperCase();
    if (!cleaned) return;

    setIsJoining(true);
    try {
      const joined = await environmentService.joinEnvironment(cleaned);
      setEnvironments((prev) =>
        prev.some((item) => item.id === joined.id) ? prev : [joined, ...prev]
      );
      const envName = joined.environmentName || joined.name || "Ambiente";
      const normalizedEnv = { ...joined, name: envName, environmentName: envName };
      selectEnvironment(normalizedEnv);
      if (onEnvironmentActivated) onEnvironmentActivated(normalizedEnv);
      showToast(`Você ingressou no ambiente "${envName}"!`, "success");
      setInviteCode("");
      setIsJoinModalOpen(false);
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Código de convite inválido, expirado ou já utilizado.";
      showToast(msg, "error");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Main Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0]">
            Famílias sob Cuidado
          </h2>
          <p className="text-secondary dark:text-[#b4cbcb] text-base font-normal mt-2 leading-relaxed">
            Gerencie os grupos familiares, compartilhe o código de convite ou ingresse em um ambiente existente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-surface-container-highest dark:bg-[#282d2c] hover:bg-secondary-container text-primary dark:text-[#8ed2d4] font-bold px-5 py-4 rounded-2xl border border-outline-variant/40 active:scale-95 transition-all cursor-pointer text-sm"
          >
            <span className="material-symbols-outlined text-xl">key</span>
            <span>Entrar com Código</span>
          </button>

          {canManageEnvironments && (
            <button
              type="button"
              onClick={() => {
                setEditingEnvironment(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-3 bg-[#0d5c5a] hover:bg-[#084846] text-white font-bold px-7 py-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer text-base"
            >
              <span className="material-symbols-outlined text-2xl">person_add</span>
              <span>Cadastrar Novo Ambiente</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#0d5c5a] dark:text-[#8ed2d4] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-secondary dark:text-[#b4cbcb]">
            Carregando ambientes...
          </p>
        </div>
      ) : (
        /* Grid of Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {environments.map((env) => {
            const envName = env.environmentName || env.name || "Ambiente sem Nome";
            const envCode = env.environmentCode || env.code || null;
            const responsibleName =
              env.responsible ||
              (env.members && env.members.length > 0 && env.members[0].userName
                ? env.members[0].userName
                : "Familiar Responsável");
            const isCurrentActive = currentEnvironment?.id === env.id;

            return (
              <div
                key={env.id}
                className={`bg-[#e4e8e5] dark:bg-[#282d2c] rounded-[2.5rem] p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all border ${
                  isCurrentActive
                    ? "border-2 border-[#0d5c5a] dark:border-[#8ed2d4]"
                    : "border-black/5 dark:border-white/5"
                }`}
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
                      isCurrentActive
                        ? "bg-[#0d5c5a] text-white"
                        : "bg-[#ccebe5] text-[#0d5c5a] dark:bg-[#0d5c5a]/40 dark:text-[#9fe4e6]"
                    }`}
                  >
                    {isCurrentActive ? "AMBIENTE ATIVO" : "ATIVO"}
                  </span>
                </div>

                {/* Info */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-on-surface dark:text-[#e1e3e0] mb-3">
                    {envName}
                  </h3>
                  {envCode && (
                    <p className="text-xs font-mono text-[#0d5c5a] dark:text-[#8ed2d4] mb-2 font-bold">
                      Código de convite: {envCode}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-secondary dark:text-[#b4cbcb] text-sm font-medium">
                    <span className="material-symbols-outlined text-base">person</span>
                    <span>
                      Responsável:{" "}
                      <strong className="text-on-surface dark:text-[#e1e3e0]">
                        {responsibleName}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleEnterEnvironment(env)}
                    className="w-full py-4 bg-white dark:bg-[#343a39] hover:bg-white/90 text-[#0d5c5a] dark:text-[#9fe4e6] font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer text-base active:scale-98"
                  >
                    <span>{isCurrentActive ? "Acessar Rotina" : "Ativar e Entrar"}</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>

                  {canManageEnvironments && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(env)}
                        title="Editar Nome do Ambiente"
                        className="flex-1 py-3 bg-white/70 dark:bg-white/5 hover:bg-white text-secondary hover:text-primary rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEnvironment(env.id, envName)}
                        title="Excluir Ambiente"
                        className="flex-1 py-3 bg-white/70 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/30 text-secondary hover:text-red-600 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg text-red-500">
                          delete
                        </span>
                        <span>Excluir</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {environments.length === 0 && (
            <div className="col-span-full py-12 text-center text-secondary dark:text-[#b4cbcb]">
              <span className="material-symbols-outlined text-5xl mb-2 text-outline">
                folder_open
              </span>
              <p className="text-base font-semibold">Nenhum ambiente encontrado.</p>
              <p className="text-xs">
                Cadastre um novo ambiente ou clique em &quot;Entrar com Código&quot; para ingressar.
              </p>
            </div>
          )}

          {/* Dashed Add Card */}
          {canManageEnvironments && (
            <div
              onClick={() => {
                setEditingEnvironment(null);
                setIsModalOpen(true);
              }}
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
      )}

      <CreateEnvironmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEnvironment(null);
        }}
        onCreate={handleCreateEnvironment}
        onUpdate={handleUpdateEnvironment}
        initialData={editingEnvironment}
      />

      {/* Join By Invite Code Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface dark:bg-[#232726] border border-outline-variant/40 text-on-surface dark:text-[#e1e3e0] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary dark:text-[#8ed2d4]">
                <span className="material-symbols-outlined text-2xl">key</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface dark:text-[#e1e3e0]">
                  Ingressar com Código
                </h2>
                <p className="text-sm text-secondary dark:text-[#b4cbcb]">
                  Digite o código de 11 caracteres compartilhado pelo familiar.
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div>
                <label
                  htmlFor="invite-code-input"
                  className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5"
                >
                  Código de Convite (INV...) *
                </label>
                <input
                  id="invite-code-input"
                  name="code"
                  type="text"
                  required
                  maxLength={11}
                  autocorrect="off"
                  autocapitalize="characters"
                  spellcheck="false"
                  placeholder="Ex: INV23456789"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 font-mono uppercase bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-base font-bold tracking-widest transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  disabled={isJoining}
                  className="px-5 py-2.5 rounded-xl font-semibold text-secondary hover:bg-surface-container text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isJoining}
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md active:scale-95 text-sm cursor-pointer disabled:opacity-50"
                >
                  {isJoining ? "Ingressando..." : "Entrar no Ambiente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
