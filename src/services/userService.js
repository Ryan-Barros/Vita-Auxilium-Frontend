import api from "./api";

export const userService = {
  async getMe() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateMe(data) {
    const payload = {};
    if (data.name && data.name.trim()) payload.name = data.name.trim();
    if (data.phone && data.phone.trim()) payload.phone = data.phone.replace(/\D/g, "");
    if (data.password && data.password.trim()) payload.password = data.password;
    const response = await api.patch("/users/me", payload);
    return response.data;
  },

  async deactivateMe() {
    await api.delete("/users/me");
    return true;
  },

  async setActiveEnvironment(envId) {
    await api.patch(`/users/me/active-environment/${envId}`);
    return true;
  },
};

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export default userService;
