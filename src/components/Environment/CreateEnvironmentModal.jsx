import { useState } from "react";
import { environmentService } from "../../services/environmentService";
import { useToastStore } from "../../stores/toastStore";

export default function CreateEnvironmentModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  initialData = null,
}) {
  const isEditing = Boolean(initialData?.id);
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [name, setName] = useState(() => initialData?.environmentName || initialData?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();

  if (initialData !== prevInitialData || isOpen !== prevIsOpen) {
    setPrevInitialData(initialData);
    setPrevIsOpen(isOpen);
    setName(initialData?.environmentName || initialData?.name || "");
  }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (name.trim().length < 5) {
      showToast("O nome do ambiente deve ter pelo menos 5 caracteres.", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        const updated = await environmentService.updateEnvironment(initialData.id, {
          environmentName: name.trim(),
        });
        showToast(
          `Ambiente "${updated.environmentName || name.trim()}" atualizado com sucesso!`,
          "success"
        );
        if (onUpdate) onUpdate(updated);
      } else {
        const created = await environmentService.createEnvironment({
          environmentName: name.trim(),
        });
        showToast(
          `Ambiente "${created.environmentName || name.trim()}" criado com sucesso!`,
          "success"
        );
        if (onCreate) onCreate(created);
      }
      setName("");
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erro ao salvar ambiente no servidor.";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface dark:bg-[#232726] border border-outline-variant/40 text-on-surface dark:text-[#e1e3e0] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Fechar modal"
          className="absolute top-5 right-5 text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary dark:text-[#8ed2d4]">
            <span className="material-symbols-outlined text-2xl">
              {isEditing ? "edit_square" : "person_add"}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-[#e1e3e0]">
              {isEditing ? "Editar Ambiente" : "Cadastrar Novo Ambiente"}
            </h2>
            <p className="text-sm text-secondary dark:text-[#b4cbcb]">
              {isEditing
                ? "Atualize o nome de identificação do ambiente familiar."
                : "Crie um ambiente familiar para acompanhamento e segurança."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="environment-name-input"
              className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5"
            >
              Nome do Ambiente / Família *
            </label>
            <input
              id="environment-name-input"
              name="environmentName"
              type="text"
              required
              minLength={5}
              placeholder="Ex: Família Souza (mínimo 5 caracteres)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors"
            />
          </div>

          {isEditing && initialData?.environmentCode && (
            <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/30">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb]">
                Código de Convite do Ambiente
              </span>
              <span className="font-mono text-base font-extrabold text-primary dark:text-[#8ed2d4]">
                {initialData.environmentCode}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-secondary hover:bg-surface-container text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md active:scale-95 text-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  <span>Salvando...</span>
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Criar Ambiente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
