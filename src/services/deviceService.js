import api from "./api";

export const deviceService = {
  async getEnvironmentDevices(params = {}) {
    const response = await api.get("/device", { params });
    return Array.isArray(response.data)
      ? response.data
      : (response.data?.content ?? []);
  },

  async createDevice({ name, tokenHash, deviceToken, environmentId }) {
    const rawToken = tokenHash || deviceToken;
    const response = await api.post("/device", {
      name: name.trim(),
      tokenHash: rawToken ? rawToken.trim() : undefined,
      deviceToken: rawToken ? rawToken.trim() : undefined,
      environmentId: environmentId || undefined,
    });
    return response.data;
  },

  async updateDevice(id, { name }) {
    const response = await api.patch(`/device/${id}`, { name: name.trim() });
    return response.data;
  },

  async deleteDevice(id) {
    await api.delete(`/device/${id}`);
    return true;
  },
};

export default deviceService;
