import api from "./api";

/**
 * Serviço de API para telemetria e monitoramento de sinais vitais
 */

// Buscar os sinais vitais mais recentes do idoso (por id do idoso ou ambiente)
export async function getLatestVitals(elderlyId) {
  try {
    const response = await api.get(`/telemetry/vitals/latest`, {
      params: { elderlyId },
    });
    return response.data;
  } catch (error) {
    // Fallback com dados de demonstração caso o backend ainda não possua o endpoint de telemetria ativo
    console.info("Usando dados de demonstração para telemetria de sinais vitais:", error.message);
    return getMockVitalsData();
  }
}

// Buscar histórico de telemetria por período (today, week, month)
export async function getTelemetryHistory(elderlyId, timeframe = "today") {
  try {
    const response = await api.get(`/telemetry/vitals/history`, {
      params: { elderlyId, timeframe },
    });
    return response.data;
  } catch {
    return getMockTelemetryHistory(timeframe);
  }
}

// Buscar alertas recentes de telemetria
export async function getTelemetryAlerts(elderlyId) {
  try {
    const response = await api.get(`/telemetry/alerts`, {
      params: { elderlyId },
    });
    return response.data;
  } catch {
    return getMockTelemetryAlerts();
  }
}

// Simular disparo manual de telemetria (para demonstração de IoT)
export async function triggerSimulatedTelemetry(elderlyId, customData = {}) {
  try {
    const response = await api.post(`/device/telemetry/simulate`, {
      elderlyId,
      ...customData,
    });
    return response.data;
  } catch {
    // Retorna leitura simulada instantânea
    return generateRandomTelemetryPoint(customData);
  }
}

/* =========================================================================
   DADOS MOCK PARA DEMONSTRAÇÃO E TESTES DE TELEMETRIA IOT
   ========================================================================= */

function getMockVitalsData() {
  return {
    elderlyName: "Dona Helena Silva",
    elderlyAge: 78,
    heartRate: {
      current: 74,
      unit: "BPM",
      status: "normal", // 'normal', 'warning', 'alert'
      minToday: 62,
      maxToday: 108,
      lastUpdated: "Há 2 min",
    },
    oxygenLevel: {
      current: 98,
      unit: "%",
      status: "normal",
      minToday: 95,
      maxToday: 99,
      lastUpdated: "Há 2 min",
    },
    bloodPressure: {
      systolic: 122,
      diastolic: 78,
      formatted: "122/78",
      unit: "mmHg",
      status: "normal",
      category: "Normal",
      lastUpdated: "Há 15 min",
    },
    bodyTemperature: {
      current: 36.6,
      unit: "°C",
      status: "normal",
      category: "Afebril",
      lastUpdated: "Há 30 min",
    },
    steps: {
      current: 3840,
      target: 5000,
      calories: 245,
      distanceKm: 2.3,
      unit: "passos",
      status: "normal",
    },
    fallDetection: {
      hasFall: false,
      status: "safe", // 'safe', 'alert'
      lastEvent: "Nenhuma queda registrada hoje",
      sensorStatus: "Ativo • Acelerômetro 3D",
    },
    device: {
      name: "Samsung Galaxy Watch 6",
      model: "SM-R930",
      battery: 84,
      connectionStatus: "connected", // 'connected', 'offline', 'syncing'
      lastSync: "Hoje, 14:32:05",
      signalStrength: "Forte (98%)",
    },
  };
}

function getMockTelemetryHistory(timeframe) {
  if (timeframe === "week") {
    return [
      { label: "Seg", heartRate: 72, oxygen: 98, systolic: 120, steps: 4100 },
      { label: "Ter", heartRate: 75, oxygen: 97, systolic: 124, steps: 3900 },
      { label: "Qua", heartRate: 78, oxygen: 98, systolic: 122, steps: 5200 },
      { label: "Qui", heartRate: 71, oxygen: 99, systolic: 118, steps: 4600 },
      { label: "Sex", heartRate: 76, oxygen: 97, systolic: 125, steps: 4800 },
      { label: "Sáb", heartRate: 74, oxygen: 98, systolic: 121, steps: 3200 },
      { label: "Dom", heartRate: 73, oxygen: 98, systolic: 120, steps: 3840 },
    ];
  }

  // Fallback 'today' por horas
  return [
    { label: "06:00", heartRate: 64, oxygen: 99, systolic: 116 },
    { label: "08:00", heartRate: 76, oxygen: 98, systolic: 122 },
    { label: "10:00", heartRate: 82, oxygen: 97, systolic: 126 },
    { label: "12:00", heartRate: 75, oxygen: 98, systolic: 120 },
    { label: "14:00", heartRate: 74, oxygen: 98, systolic: 122 },
    { label: "16:00", heartRate: 88, oxygen: 96, systolic: 128 },
    { label: "18:00", heartRate: 78, oxygen: 98, systolic: 124 },
    { label: "20:00", heartRate: 72, oxygen: 99, systolic: 119 },
  ];
}

function getMockTelemetryAlerts() {
  return [
    {
      id: 1,
      timestamp: "Hoje, 16:35",
      title: "Frequência cardíaca em caminhada",
      description: "Leve elevação para 88 BPM durante atividade física programada.",
      type: "info", // 'info', 'warning', 'critical'
      read: true,
    },
    {
      id: 2,
      timestamp: "Hoje, 12:00",
      title: "Lembrete de Medicamento Concluído",
      description: "Anti-hipertensivo registrado pelo cuidador com sinais estáveis.",
      type: "info",
      read: true,
    },
    {
      id: 3,
      timestamp: "Ontem, 21:15",
      title: "Alerta de Bateria do Relógio",
      description: "Nível de bateria do Samsung Galaxy Watch atingiu 15%. Dispositivo recarregado.",
      type: "warning",
      read: true,
    },
  ];
}

function generateRandomTelemetryPoint(overrides = {}) {
  const randomBpm = Math.floor(Math.random() * (92 - 68 + 1)) + 68;
  const randomSpO2 = Math.floor(Math.random() * (100 - 96 + 1)) + 96;
  const randomSystolic = Math.floor(Math.random() * (128 - 118 + 1)) + 118;
  const randomDiastolic = Math.floor(Math.random() * (82 - 74 + 1)) + 74;

  return {
    heartRate: overrides.heartRate || randomBpm,
    oxygen: overrides.oxygen || randomSpO2,
    bloodPressure: `${overrides.systolic || randomSystolic}/${overrides.diastolic || randomDiastolic}`,
    systolic: overrides.systolic || randomSystolic,
    diastolic: overrides.diastolic || randomDiastolic,
    timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}
