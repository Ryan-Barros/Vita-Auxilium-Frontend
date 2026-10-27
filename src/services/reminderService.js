import api from "./api";

function mapDtoToUi(dto) {
  const dateStr = dto.date || "";
  const [datePart, timeFullPart] = dateStr.includes("T")
    ? dateStr.split("T")
    : [new Date().toISOString().split("T")[0], "10:00:00"];
  const timePart = (timeFullPart || "10:00").slice(0, 5);

  return {
    id: dto.id,
    environmentId: dto.environmentId,
    categoryId: dto.categoryId,
    category: dto.categoryName || "HEALTH",
    title: dto.title || "Lembrete",
    description: dto.description || "",
    date: datePart,
    time: timePart,
    loop: Boolean(dto.loop),
    recurring: dto.loop ? "Todos os dias" : "Único",
    completed: Boolean(dto.completed),
    isActive: dto.isActive ?? true,
  };
}

function mapUiToPayload(reminderData) {
  const today = new Date().toISOString().split("T")[0];
  const datePart = reminderData.date || today;
  const timePart = (reminderData.time || "10:00").slice(0, 5);
  const loop =
    typeof reminderData.loop === "boolean"
      ? reminderData.loop
      : reminderData.recurring !== "Único";

  return {
    environmentId: reminderData.environmentId || undefined,
    categoryName: (reminderData.category || "HEALTH").toUpperCase(),
    title: (reminderData.title || "").trim(),
    description: reminderData.description || "",
    date: `${datePart}T${timePart}:00`,
    loop,
  };
}

export const reminderService = {
  async getReminders(params = {}) {
    const response = await api.get("/reminders", { params });
    const list = Array.isArray(response.data)
      ? response.data
      : (response.data?.content ?? []);
    return list.map(mapDtoToUi);
  },

  async createReminder(reminderData) {
    const payload = mapUiToPayload(reminderData);
    const response = await api.post("/reminders", payload);
    return {
      ...mapDtoToUi(response.data),
      recurring: reminderData.recurring || (payload.loop ? "Todos os dias" : "Único"),
    };
  },

  async updateReminder(id, reminderData) {
    const payload = mapUiToPayload(reminderData);
    const response = await api.patch(`/reminders/${id}`, payload);
    return {
      ...mapDtoToUi(response.data),
      recurring: reminderData.recurring || (payload.loop ? "Todos os dias" : "Único"),
    };
  },

  async toggleReminderCompletion(id, completed) {
    const response = await api.patch(`/reminders/${id}`, { completed });
    return mapDtoToUi(response.data);
  },

  async deleteReminder(id) {
    await api.delete(`/reminders/${id}`);
    return true;
  },
};

export default reminderService;
