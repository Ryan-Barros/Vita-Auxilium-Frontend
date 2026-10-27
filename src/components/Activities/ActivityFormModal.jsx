import { useState } from "react";

const CATEGORIES = [
  { id: "MEDICATION", label: "Medicamento", icon: "medical_services" },
  { id: "MEAL", label: "Alimentação", icon: "restaurant" },
  { id: "EXERCISE", label: "Exercício / Fisioterapia", icon: "fitness_center" },
  { id: "APPOINTMENT", label: "Consulta / Exame", icon: "medical_information" },
  { id: "HYGIENE", label: "Higiene / Cuidado", icon: "clean_hands" },
  { id: "ROUTINE", label: "Rotina / Lazer", icon: "schedule" },
];

const PRIORITIES = [
  { id: "HIGH", label: "Alta", color: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300" },
  { id: "MEDIUM", label: "Média", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  { id: "LOW", label: "Baixa", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
];

function getInitialForm(initialData) {
  const today = new Date().toISOString().split("T")[0];
  if (initialData) {
    return {
      title: initialData.title || "",
      date: initialData.date || today,
      time: initialData.time || "09:00",
      category: initialData.category || "MEDICATION",
      priority: initialData.priority || "MEDIUM",
      description: initialData.description || "",
      environment: initialData.environment || "Casa Principal",
    };
  }
  return {
    title: "",
    date: today,
    time: "09:00",
    category: "MEDICATION",
    priority: "MEDIUM",
    description: "",
    environment: "Casa Principal",
  };
}

export default function ActivityFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [formData, setFormData] = useState(() => getInitialForm(initialData));

  if (initialData !== prevInitialData || isOpen !== prevIsOpen) {
    setPrevInitialData(initialData);
    setPrevIsOpen(isOpen);
    setFormData(getInitialForm(initialData));
  }

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.time) return;
    
    onSubmit({
      ...formData,
      id: initialData?.id || Date.now(),
      completed: initialData ? initialData.completed : false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white dark:bg-[#202524] w-full max-w-lg rounded-3xl shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low dark:bg-[#252a29]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0d5c5a] text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">
                {initialData ? "edit_calendar" : "add_task"}
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-on-surface dark:text-[#e1e3e0]">
                {initialData ? "Editar Atividade" : "Nova Atividade"}
              </h3>
              <p className="text-xs text-secondary dark:text-[#b4cbcb]">
                {initialData ? "Atualize as informações da agenda" : "Cadastre um novo compromisso ou rotina"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Título da Atividade *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Tomar medicação da manhã"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-outline-variant/50 bg-surface dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5c5a]"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-outline-variant/50 bg-surface dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5c5a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
                Horário *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-outline-variant/50 bg-surface dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5c5a]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#0d5c5a] bg-[#0d5c5a]/10 text-[#0d5c5a] dark:text-[#8ed2d4] font-bold"
                        : "border-outline-variant/30 text-secondary dark:text-[#b4cbcb] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Prioridade
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = formData.priority === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setFormData({ ...formData, priority: p.id })}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${p.color} border-current shadow-xs`
                        : "border-outline-variant/30 text-secondary opacity-70 hover:opacity-100"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description / Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary dark:text-[#b4cbcb] mb-1.5">
              Instruções / Observações
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Tomar acompanhado de um copo d'água após as refeições"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-outline-variant/50 bg-surface dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0] text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5c5a] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-outline-variant/40 text-secondary hover:text-primary font-bold text-sm cursor-pointer transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#0d5c5a] hover:bg-[#084846] text-white font-bold text-sm shadow-sm active:scale-95 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              <span>{initialData ? "Salvar Alterações" : "Criar Atividade"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
