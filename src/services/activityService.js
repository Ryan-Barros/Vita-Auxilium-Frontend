import api from "./api";

const CATEGORY_ICONS = {
  MEDICATION: "medical_services",
  MEAL: "restaurant",
  EXERCISE: "fitness_center",
  APPOINTMENT: "medical_information",
  HYGIENE: "clean_hands",
  ROUTINE: "schedule",
};

function mapDtoToUi(dto) {
  const startStr = dto.activityStart || "";
  const [datePart, timeFullPart] = startStr.includes("T")
    ? startStr.split("T")
    : [new Date().toISOString().split("T")[0], "09:00:00"];
  const timePart = (timeFullPart || "09:00").slice(0, 5);
  const category = (dto.categoryName || "ROUTINE").toUpperCase();
  const completed = dto.activityStatus === "FINISHED";

  return {
    id: dto.id,
    environmentId: dto.environmentId,
    categoryId: dto.categoryId,
    title: dto.activityName || "Atividade",
    activityName: dto.activityName || "Atividade",
    description: dto.activityDescription || "",
    details: dto.activityDescription || "",
    date: datePart,
    time: timePart,
    activityStart: dto.activityStart,
    activityEnd: dto.activityEnd,
    category,
    icon: CATEGORY_ICONS[category] || "schedule",
    priority: dto.priority || "MEDIUM",
    completed,
    activityStatus: dto.activityStatus || "NOT_STARTED",
    active: dto.active ?? true,
  };
}

function mapUiToPayload(activityData) {
  const today = new Date().toISOString().split("T")[0];
  const dateStr = activityData.date || today;
  const timeStr = (activityData.time || "09:00").slice(0, 5);
  const activityStart = activityData.activityStart || `${dateStr}T${timeStr}:00`;
  const activityEnd = activityData.activityEnd || `${dateStr}T${timeStr}:00`;

  return {
    environmentId: activityData.environmentId || undefined,
    categoryName: (activityData.category || activityData.categoryName || "ROUTINE").toUpperCase(),
    activityName: (activityData.title || activityData.activityName || "").trim(),
    activityDescription: activityData.description ?? activityData.activityDescription ?? "",
    activityStart,
    activityEnd,
    activityStatus: activityData.completed ? "FINISHED" : (activityData.activityStatus || "NOT_STARTED"),
  };
}

export const activityService = {
  async getActivities(params = {}) {
    const response = await api.get("/activities", { params });
    const list = Array.isArray(response.data)
      ? response.data
      : (response.data?.content ?? []);
    return list.map(mapDtoToUi);
  },

  async createActivity(activityData) {
    const payload = mapUiToPayload(activityData);
    const response = await api.post("/activities", payload);
    return {
      ...mapDtoToUi(response.data),
      priority: activityData.priority || "MEDIUM",
    };
  },

  async updateActivity(id, activityData) {
    const payload = mapUiToPayload(activityData);
    const response = await api.patch(`/activities/${id}`, payload);
    return {
      ...mapDtoToUi(response.data),
      priority: activityData.priority || "MEDIUM",
    };
  },

  async toggleActivityCompletion(id, completed) {
    const activityStatus = completed ? "FINISHED" : "NOT_STARTED";
    const response = await api.patch(`/activities/${id}/status`, { activityStatus });
    return mapDtoToUi(response.data);
  },

  async deleteActivity(id) {
    await api.delete(`/activities/${id}`);
    return true;
  },
};

export default activityService;
