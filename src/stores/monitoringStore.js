import { create } from "zustand";
import {
  getLatestVitals,
  getTelemetryHistory,
  getTelemetryAlerts,
  triggerSimulatedTelemetry,
} from "../services/monitoringService";

export const useMonitoringStore = create((set, get) => ({
  vitals: null,
  telemetryHistory: [],
  alerts: [],
  timeframe: "today",
  loading: false,
  simulating: false,
  error: null,

  // Carregar dados de monitoramento
  fetchVitalsData: async (elderlyId) => {
    set({ loading: true, error: null });
    try {
      const [vitalsData, historyData, alertsData] = await Promise.all([
        getLatestVitals(elderlyId),
        getTelemetryHistory(elderlyId, get().timeframe),
        getTelemetryAlerts(elderlyId),
      ]);

      set({
        vitals: vitalsData,
        telemetryHistory: historyData,
        alerts: alertsData,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Erro ao carregar dados de telemetria.",
        loading: false,
      });
    }
  },

  // Alterar o período do histórico (Hoje, Semana, Mês)
  setTimeframe: async (timeframe, elderlyId) => {
    set({ timeframe, loading: true });
    try {
      const historyData = await getTelemetryHistory(elderlyId, timeframe);
      set({ telemetryHistory: historyData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Simular uma nova leitura vinda de um dispositivo IoT em tempo real
  simulateIoTReading: async (elderlyId, customData) => {
    set({ simulating: true });
    try {
      const newPoint = await triggerSimulatedTelemetry(elderlyId, customData);

      const currentVitals = get().vitals;
      if (currentVitals) {
        const updatedVitals = {
          ...currentVitals,
          heartRate: {
            ...currentVitals.heartRate,
            current: newPoint.heartRate,
            lastUpdated: "Agora mesmo",
          },
          oxygenLevel: {
            ...currentVitals.oxygenLevel,
            current: newPoint.oxygen,
            lastUpdated: "Agora mesmo",
          },
          bloodPressure: {
            ...currentVitals.bloodPressure,
            systolic: newPoint.systolic,
            diastolic: newPoint.diastolic,
            formatted: `${newPoint.systolic}/${newPoint.diastolic}`,
            lastUpdated: "Agora mesmo",
          },
          device: {
            ...currentVitals.device,
            lastSync: `Hoje, ${newPoint.timestamp}`,
          },
        };

        // Adicionar o ponto ao gráfico temporal
        const updatedHistory = [
          ...get().telemetryHistory,
          {
            label: newPoint.timestamp,
            heartRate: newPoint.heartRate,
            oxygen: newPoint.oxygen,
            systolic: newPoint.systolic,
          },
        ];

        // Se o BPM simulado for atípico (>85), gera um alerta dinâmico
        const updatedAlerts = [...get().alerts];
        if (newPoint.heartRate > 85) {
          updatedAlerts.unshift({
            id: Date.now(),
            timestamp: `Hoje, ${newPoint.timestamp}`,
            title: "Frequência Cardíaca Elevada (IoT)",
            description: `Sensor IoT detectou ${newPoint.heartRate} BPM em repouso/atividade.`,
            type: "warning",
            read: false,
          });
        }

        set({
          vitals: updatedVitals,
          telemetryHistory: updatedHistory,
          alerts: updatedAlerts,
          simulating: false,
        });
      } else {
        set({ simulating: false });
      }
    } catch {
      set({ simulating: false });
    }
  },

  // Marcar alerta como lido
  markAlertAsRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((item) =>
        item.id === alertId ? { ...item, read: true } : item
      ),
    }));
  },
}));
