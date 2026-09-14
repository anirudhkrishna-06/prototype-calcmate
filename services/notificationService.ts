export type NotificationPreference = {
  enabled: boolean;
  updatedAt: string;
};

let currentPreference: NotificationPreference = {
  enabled: true,
  updatedAt: new Date().toISOString(),
};

export function configureNotifications(enabled: boolean): NotificationPreference {
  currentPreference = {
    enabled,
    updatedAt: new Date().toISOString(),
  };

  return currentPreference;
}

export function getNotificationPreference() {
  return currentPreference;
}
