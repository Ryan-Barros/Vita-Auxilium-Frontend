export const PROFILE_CAPABILITIES = {
  FAMILY: {
    canManageDevices: true,
    canViewHealthData: true,
    canManageActivities: true,
    canInteractActivities: true,
    canViewActivitys: true,
    canTriggerEmergency: false,
    canManageEnvironments: true,
    canSwitchEnvironment: true,
  },
  CAREGIVER: {
    canManageDevices: false,
    canViewHealthData: true,
    canManageActivities: false,
    canInteractActivities: true,
    canViewActivitys: true,
    canTriggerEmergency: true,
    canManageEnvironments: false,
    canSwitchEnvironment: true,
  },
  ELDERLY: {
    canManageDevices: false,
    canViewHealthData: false,
    canManageActivities: false,
    canInteractActivities: true,
    canViewActivitys: true,
    canTriggerEmergency: true,
    canManageEnvironments: false,
    canSwitchEnvironment: false,
  },
};

export function getCapabilities(profile) {
  const normalizedProfile = (profile || "FAMILY").toUpperCase();
  return PROFILE_CAPABILITIES[normalizedProfile] || PROFILE_CAPABILITIES.FAMILY;
}
