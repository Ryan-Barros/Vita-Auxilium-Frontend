import { useState } from "react";

/**
 * DeviceStatusCard Component
 * Exibe o status da telemetria do relógio inteligente/dispositivo IoT
 * e permite o CRUD (vincular múltiplos dispositivos, alternar visualização, renomear e desvincular).
 */
export default function DeviceStatusCard({
  device,
  registeredDevice,
  devicesList = [],
  onSelectDevice,
  canManageDevices = false,
  onSimulateRead,
  onCreateDevice,
  onUpdateDevice,
  onDeleteDevice,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [serialOrToken, setSerialOrToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getBatteryColor = (level) => {
    if (level < 20) return "text-red-500 bg-red-100 dark:bg-red-950/40";
    if (level < 50) return "text-amber-500 bg-amber-100 dark:bg-amber-950/40";
    return "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40";
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setName("");
    setSerialOrToken(
      `VITA-IOT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    );
    setModalOpen(true);
  };

  const openEditModal = () => {
    if (!registeredDevice) return;
    setIsEditing(true);
    setName(registeredDevice.name || "");
    setSerialOrToken("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (isEditing && registeredDevice) {
        await onUpdateDevice?.(registeredDevice.id, { name: name.trim() });
      } else {
        await onCreateDevice?.({
          name: name.trim(),
          tokenHash: serialOrToken.trim(),
          deviceToken: serialOrToken.trim(),
        });
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const displayName = registeredDevice?.name || device?.name || "Dispositivo IoT";
  const isRegistered = Boolean(registeredDevice?.id);

  return (
    <div className="bg-surface-container-low dark:bg-[#2e312f] p-6 rounded-[2rem] border border-outline-variant/20 shadow-xs flex flex-col justify-between">
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 dark:bg-[#8ed2d4]/20 rounded-2xl">
              <span className="material-symbols-outlined text-primary dark:text-[#8ed2d4] text-2xl">
                watch
              </span>
            </div>
            <div>
              <h4 className="font-bold text-on-surface dark:text-[#e1e3e0] text-base">
                {isRegistered ? displayName : "Nenhum Relógio Vinculado"}
              </h4>
              <p className="text-xs text-secondary dark:text-[#b4cbcb]">
                {isRegistered
                  ? `${device?.model || "ESP32 + MAX30102/MPU6050"} • Vinculado`
                  : "Cadastre o dispositivo IoT do ambiente"}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isRegistered
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isRegistered ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{isRegistered ? "Online" : "Pendente"}</span>
          </div>
        </div>

        {/* Seletor quando houver múltiplos dispositivos no ambiente */}
        {devicesList.length > 1 && (
          <div className="mb-4 p-2.5 bg-surface dark:bg-[#202524] rounded-xl border border-outline-variant/20">
            <label className="text-[11px] font-bold text-secondary dark:text-[#b4cbcb] block mb-1.5">
              Dispositivo Ativo ({devicesList.length} cadastrados):
            </label>
            <select
              value={registeredDevice?.id || ""}
              onChange={(e) => onSelectDevice?.(e.target.value)}
              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low dark:bg-[#2e312f] text-on-surface dark:text-[#e1e3e0] focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              {devicesList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Detalhes Técnicos */}
        {device && (
          <div className="space-y-3 my-4 pt-2 border-t border-outline-variant/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary dark:text-[#b4cbcb] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  battery_charging_full
                </span>
                Bateria do Relógio
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-bold ${getBatteryColor(
                  device.battery
                )}`}
              >
                {device.battery}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary dark:text-[#b4cbcb] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">sync</span>
                Última Leitura
              </span>
              <span className="font-semibold text-on-surface dark:text-[#e1e3e0]">
                {device.lastSync}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary dark:text-[#b4cbcb] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">wifi</span>
                Sinal de Dados
              </span>
              <span className="font-semibold text-on-surface dark:text-[#e1e3e0]">
                {device.signalStrength}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ações de Gerenciamento CRUD e Simulação */}
      <div className="pt-3 border-t border-outline-variant/20 space-y-2.5">
        {canManageDevices && (
          <div className="flex flex-col gap-2">
            {isRegistered && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openEditModal}
                  className="flex-1 py-2 px-3 bg-surface-container-highest dark:bg-[#3a3f3d] hover:bg-primary/15 text-on-surface dark:text-[#e1e3e0] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Renomear</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDevice?.(registeredDevice.id)}
                  className="py-2 px-3 bg-error-container/60 hover:bg-error-container text-error dark:text-red-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  title="Desvincular Dispositivo"
                >
                  <span className="material-symbols-outlined text-sm">
                    link_off
                  </span>
                  <span>Remover</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={openCreateModal}
              className="w-full py-2.5 px-4 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-base">
                add_link
              </span>
              <span>
                {isRegistered
                  ? "Adicionar Outro Dispositivo"
                  : "Cadastrar Dispositivo IoT"}
              </span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onSimulateRead}
          className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 text-primary dark:text-[#8ed2d4] dark:bg-[#8ed2d4]/10 dark:hover:bg-[#8ed2d4]/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span className="material-symbols-outlined text-base">sensors</span>
          <span>Simular Leitura de Telemetria (IoT)</span>
        </button>
      </div>

      {/* Modal de Cadastro / Edição de Dispositivo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface dark:bg-[#202524] rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface dark:text-[#e1e3e0]">
                {isEditing ? "Renomear Dispositivo" : "Cadastrar Dispositivo IoT"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-secondary hover:text-on-surface cursor-pointer p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-secondary dark:text-[#b4cbcb]">
              {isEditing
                ? "Atualize o nome de exibição deste relógio inteligente."
                : "Informe o nome de identificação e o token de hardware gerado para o dispositivo do ambiente."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface dark:text-[#e1e3e0] block mb-1">
                  Nome do Dispositivo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Relógio do Vovô João"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low dark:bg-[#2e312f] text-on-surface dark:text-[#e1e3e0] focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="text-xs font-bold text-on-surface dark:text-[#e1e3e0] block mb-1">
                    Token de Hardware (IoT)
                  </label>
                  <input
                    type="text"
                    value={serialOrToken}
                    onChange={(e) => setSerialOrToken(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low dark:bg-[#2e312f] text-on-surface dark:text-[#e1e3e0] focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                  <span className="text-[10px] text-secondary dark:text-[#b4cbcb] mt-1 block">
                    Copie este token para gravar no firmware ESP32 do relógio.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-secondary hover:bg-surface-container-highest cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {submitting
                    ? "Salvando..."
                    : isEditing
                    ? "Salvar Nome"
                    : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
