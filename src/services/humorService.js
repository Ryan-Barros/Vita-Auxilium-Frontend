import api from "./api";

export const humorService = {
  async getHumors(params = {}) {
    const response = await api.get("/humor", { params });
    return Array.isArray(response.data)
      ? response.data
      : (response.data?.content ?? []);
  },

  async getLatestHumor() {
    const response = await api.get("/humor/latest");
    if (response.status === 204 || !response.data) {
      return null;
    }
    return response.data;
  },

  async createHumor({ humor, observation = "", intensity, activityId }) {
    const response = await api.post("/humor", {
      humor,
      observation: observation || undefined,
      intensity: intensity || undefined,
      activityId: activityId || undefined,
    });
    return response.data;
  },

  async deleteHumor(id) {
    await api.delete(`/humor/${id}`);
    return true;
  },
};

export default humorService;
