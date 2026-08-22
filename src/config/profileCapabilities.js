export const PROFILE_CAPABILITIES = {
  FAMILY: {
    canManageDevices: true,
    canViewHealthData: true,
    canManageActivities: true,
    canViewActivitys: true,
    canTriggerEmergency: false,
    canManageEnvironments: true,
  },
  CAREGIVER: {
    canManageDevices: false,
    canViewHealthData: true,
    canManageActivities: false,
    canViewActivitys: true,
    canTriggerEmergency: true,
    canManageEnvironments: false,
  },
  ELDERLY: {
    canManageDevices: false,
    canViewHealthData: false,
    canManageActivities: false,
    canViewActivitys: true,
    canTriggerEmergency: true,
    canManageEnvironments: false,
  },
};

export function getCapabilities(profile) {
  const normalizedProfile = (profile || "FAMILY").toUpperCase();
  return PROFILE_CAPABILITIES[normalizedProfile] || PROFILE_CAPABILITIES.FAMILY;
}
