import api from "./api";

export async function getActivityReportByEnvironmentId(id) {
    return await api.get(`/report/environment/activity/${id}`);
}

export async function getSensorialReportByEnvironmentId(id) {
    return await api.get(`/report/environment/sensorial/${id}`);
}