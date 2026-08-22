import { useState } from "react";

export default function CreateEnvironmentModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [responsible, setResponsible] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      id: Date.now(),
      name,
      responsible: responsible.trim() || "Você",
      status: "ATIVO",
    });

    setName("");
    setResponsible("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface dark:bg-[#232726] border border-outline-variant/40 text-on-surface dark:text-[#e1e3e0] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <span className="material-symbols-outlined text-2xl">person_add</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-[#e1e3e0]">
              Cadastrar Novo Ambiente
            </h2>
            <p className="text-sm text-secondary dark:text-[#b4cbcb]">
              Crie um ambiente familiar para acompanhamento e segurança.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Nome do Ambiente / Família
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Família Souza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Responsável Principal
            </label>
            <input
              type="text"
              placeholder="Ex: Sr. Ricardo Souza"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Descrição (Opcional)
            </label>
            <textarea
              rows="3"
              placeholder="Anotações sobre a rede de apoio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low dark:bg-[#191c1b] border border-outline-variant/50 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-secondary hover:bg-surface-container text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md active:scale-95 text-sm cursor-pointer"
            >
              Criar Ambiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
