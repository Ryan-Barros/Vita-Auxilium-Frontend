import { useEffect, useState } from "react";
import { useMonitoringStore } from "../../stores/monitoringStore";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { useAuthStore } from "../../stores/authStore";
import { useToastStore } from "../../stores/toastStore";
import { getCapabilities } from "../../config/profileCapabilities";
import { environmentService } from "../../services/environmentService";
import { deviceService } from "../../services/deviceService";
import VitalCard from "../../components/Monitoring/VitalCard";
import HeartRateChart from "../../components/Monitoring/HeartRateChart";
import DeviceStatusCard from "../../components/Monitoring/DeviceStatusCard";
import AlertsNotificationFeed from "../../components/Monitoring/AlertsNotificationFeed";
import VitalsHistoryTable from "../../components/Monitoring/VitalsHistoryTable";

/**
 * MonitoringPage (Perfil Familiar / Cuidador)
 * Tela de monitoramento de sinais vitais e telemetria de dispositivos IoT do idoso.
 */
export default function MonitoringPage() {
  const { currentEnvironment } = useEnvironmentStore();
  const user = useAuthStore((s) => s.user);
  const { canManageDevices } = getCapabilities(user?.profile);

  const {
    vitals,
    telemetryHistory,
    alerts,
    timeframe,
    loading,
    simulating,
    fetchVitalsData,
    setTimeframe,
    simulateIoTReading,
    markAlertAsRead,
  } = useMonitoringStore();

  const { showToast } = useToastStore();
  const [devicesList, setDevicesList] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const registeredDevice =
    devicesList.find((d) => d.id === selectedDeviceId) ||
    devicesList[0] ||
    null;

  useEffect(() => {
    let active = true;
    const envId = currentEnvironment?.id;
    fetchVitalsData(envId || "elderly-1");

    if (envId) {
      environmentService
        .setActiveEnvironment(envId)
        .then(() => deviceService.getEnvironmentDevices())
        .then((list) => {
          if (!active) return;
          const safeList = Array.isArray(list) ? list : [];
          setDevicesList(safeList);
          if (safeList.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(safeList[0].id);
          }
        })
        .catch(() => {
          if (active) setDevicesList([]);
        });
    }

    return () => {
      active = false;
    };
  }, [fetchVitalsData, currentEnvironment?.id, selectedDeviceId]);

  const handleSimulateIoT = async () => {
    await simulateIoTReading(currentEnvironment?.id || "elderly-1");
    showToast("Nova leitura de telemetria IoT simulada com sucesso!", "success");
  };

  const handleRefresh = async () => {
    const envId = currentEnvironment?.id;
    await fetchVitalsData(envId || "elderly-1");
    if (envId) {
      try {
        await environmentService.setActiveEnvironment(envId);
        const list = await deviceService.getEnvironmentDevices();
        const safeList = Array.isArray(list) ? list : [];
        setDevicesList(safeList);
        if (safeList.length > 0 && !safeList.some((d) => d.id === selectedDeviceId)) {
          setSelectedDeviceId(safeList[0].id);
        }
      } catch {
        setDevicesList([]);
      }
    }
    showToast("Dados de telemetria atualizados.", "info");
  };

  const handleCreateDevice = async (payload) => {
    try {
      const created = await deviceService.createDevice(payload);
      setDevicesList((prev) => [...prev, created]);
      setSelectedDeviceId(created.id);
      showToast("Dispositivo IoT vinculado ao ambiente com sucesso!", "success");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível vincular o dispositivo IoT.";
      showToast(msg, "error");
      throw err;
    }
  };

  const handleUpdateDevice = async (deviceId, payload) => {
    try {
      const updated = await deviceService.updateDevice(deviceId, payload);
      setDevicesList((prev) => prev.map((d) => (d.id === deviceId ? updated : d)));
      showToast("Nome do dispositivo atualizado com sucesso!", "success");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível atualizar o dispositivo.";
      showToast(msg, "error");
      throw err;
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      await deviceService.deleteDevice(deviceId);
      setDevicesList((prev) => prev.filter((d) => d.id !== deviceId));
      setSelectedDeviceId((prev) => (prev === deviceId ? null : prev));
      showToast("Dispositivo IoT desvinculado do ambiente.", "info");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível remover o dispositivo.";
      showToast(msg, "error");
    }
  };

  if (loading && !vitals) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#004f51] border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary dark:text-[#b4cbcb] font-semibold text-sm">
          Carregando sinais vitais do dispositivo IoT...
        </p>
      </div>
    );
  }

  const {
    elderlyName = "Dona Helena Silva",
    heartRate,
    oxygenLevel,
    bloodPressure,
    bodyTemperature,
    steps,
    fallDetection,
    device,
  } = vitals || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho do Monitoramento */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2 bg-primary/10 text-primary dark:bg-[#8ed2d4]/20 dark:text-[#8ed2d4] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">monitor_heart</span>
            </span>
            <h1 className="text-3xl font-extrabold text-on-surface dark:text-[#e1e3e0] tracking-tight">
              Monitoramento de Sinais Vitais
            </h1>
          </div>
          <p className="text-secondary dark:text-[#b4cbcb] text-base font-light">
            Ambiente:{" "}
            <span className="font-bold text-on-surface dark:text-[#e1e3e0]">
              {currentEnvironment?.name || "Ambiente Ativo"}
            </span>{" "}
            •{" "}
            <span className="font-semibold text-primary dark:text-[#8ed2d4]">
              {registeredDevice?.name || elderlyName}
            </span>
          </p>
        </div>

        {/* Grupo de Ações de Atualização & Simulação IoT */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2.5 bg-surface-container-low dark:bg-[#252a29] hover:bg-surface-container dark:hover:bg-[#2e312f] text-on-surface dark:text-[#e1e3e0] rounded-2xl text-xs font-bold transition-all border border-outline-variant/30 flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>
              refresh
            </span>
            <span>Atualizar Dados</span>
          </button>

          <button
            onClick={handleSimulateIoT}
            disabled={simulating}
            className="px-5 py-2.5 bg-[#004f51] hover:bg-[#1d686a] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className={`material-symbols-outlined text-lg ${simulating ? "animate-pulse" : ""}`}>
              sensors
            </span>
            <span>{simulating ? "Inspecionando IoT..." : "Simular Ingestão IoT"}</span>
          </button>
        </div>
      </header>

      {/* Grade de KPIs / Cards de Sinais Vitais Principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Frequência Cardíaca */}
        <VitalCard
          title="Frequência Cardíaca"
          value={heartRate?.current || 74}
          unit={heartRate?.unit || "BPM"}
          status={heartRate?.status || "normal"}
          icon="favorite"
          iconBgColor="bg-red-100 dark:bg-red-950/40"
          iconTextColor="text-red-600 dark:text-red-400"
          minMax={{ min: heartRate?.minToday || 62, max: heartRate?.maxToday || 108 }}
          lastUpdated={heartRate?.lastUpdated}
        />

        {/* 2. Oxigenação do Sangue */}
        <VitalCard
          title="Oxigenação (SpO2)"
          value={oxygenLevel?.current || 98}
          unit={oxygenLevel?.unit || "%"}
          status={oxygenLevel?.status || "normal"}
          icon="air"
          iconBgColor="bg-cyan-100 dark:bg-cyan-950/40"
          iconTextColor="text-cyan-600 dark:text-cyan-400"
          minMax={{ min: oxygenLevel?.minToday || 95, max: oxygenLevel?.maxToday || 99 }}
          lastUpdated={oxygenLevel?.lastUpdated}
        />

        {/* 3. Pressão Arterial */}
        <VitalCard
          title="Pressão Arterial"
          value={bloodPressure?.formatted || "122/78"}
          unit={bloodPressure?.unit || "mmHg"}
          subtitle={`Classificação: ${bloodPressure?.category || "Normal"}`}
          status={bloodPressure?.status || "normal"}
          icon="vital_signs"
          iconBgColor="bg-[#004f51]/10 dark:bg-[#8ed2d4]/20"
          iconTextColor="text-[#004f51] dark:text-[#8ed2d4]"
          lastUpdated={bloodPressure?.lastUpdated}
        />

        {/* 4. Temperatura Corporal */}
        <VitalCard
          title="Temperatura"
          value={bodyTemperature?.current || 36.6}
          unit={bodyTemperature?.unit || "°C"}
          subtitle={`Estado: ${bodyTemperature?.category || "Afebril"}`}
          status={bodyTemperature?.status || "normal"}
          icon="thermostat"
          iconBgColor="bg-amber-100 dark:bg-amber-950/40"
          iconTextColor="text-amber-600 dark:text-amber-400"
          lastUpdated={bodyTemperature?.lastUpdated}
        />

        {/* 5. Atividade & Passos */}
        <VitalCard
          title="Mobilidade & Passos"
          value={steps?.current ? steps.current.toLocaleString() : "3.840"}
          unit={`/ ${steps?.target || 5000} passos`}
          subtitle={`${steps?.calories || 245} kcal • ${steps?.distanceKm || 2.3} km`}
          status="normal"
          icon="directions_walk"
          iconBgColor="bg-emerald-100 dark:bg-emerald-950/40"
          iconTextColor="text-emerald-600 dark:text-emerald-400"
          lastUpdated="Meta diária"
        />

        {/* 6. Detecção de Quedas (Acelerômetro IoT) */}
        <VitalCard
          title="Detecção de Quedas"
          value={fallDetection?.hasFall ? "Alerta" : "Seguro"}
          subtitle={fallDetection?.lastEvent || "Nenhuma queda registrada hoje"}
          status={fallDetection?.hasFall ? "alert" : "normal"}
          icon="accessibility_new"
          iconBgColor="bg-purple-100 dark:bg-purple-950/40"
          iconTextColor="text-purple-600 dark:text-purple-400"
          lastUpdated={fallDetection?.sensorStatus}
        />
      </section>

      {/* Seção Principal: Gráfico + Tabela (Esquerda) e Dispositivo + Alertas (Direita) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Coluna Esquerda Principal (2/3): Gráfico e Tabela de Registros */}
        <div className="lg:col-span-2 space-y-8">
          <HeartRateChart
            data={telemetryHistory}
            timeframe={timeframe}
            onTimeframeChange={(tf) => setTimeframe(tf, currentEnvironment?.id || "elderly-1")}
          />

          <VitalsHistoryTable data={telemetryHistory} />
        </div>

        {/* Coluna Lateral (1/3): Status do Dispositivo IoT e Feed de Alertas */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <DeviceStatusCard
            device={device}
            registeredDevice={registeredDevice}
            devicesList={devicesList}
            onSelectDevice={(id) => setSelectedDeviceId(id)}
            canManageDevices={canManageDevices}
            onSimulateRead={handleSimulateIoT}
            onCreateDevice={handleCreateDevice}
            onUpdateDevice={handleUpdateDevice}
            onDeleteDevice={handleDeleteDevice}
          />
          <AlertsNotificationFeed alerts={alerts} onMarkAsRead={markAlertAsRead} />
        </div>
      </section>
    </div>
  );
}
