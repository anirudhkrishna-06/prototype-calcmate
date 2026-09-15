import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { configureNotifications } from '@/services/notificationService';

type SyncStatus = 'Online' | 'Offline' | 'Syncing';
type BackupStatus = 'Success' | 'Failed' | 'Pending';

type AppSettingsContextValue = {
  darkMode: boolean;
  notificationsEnabled: boolean;
  syncStatus: SyncStatus;
  lastSyncTime: string;
  backupTimestamp: string;
  backupStatus: BackupStatus;
  colors: AppThemeColors;
  setDarkMode: (enabled: boolean) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  runBackup: () => Promise<void>;
};

export type AppThemeColors = {
  background: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
};

const SETTINGS_KEY = 'calcmate-app-settings-v1';

const lightColors: AppThemeColors = {
  background: '#F6F8F7',
  surface: '#FFFFFF',
  surfaceSoft: '#F0F5F4',
  text: '#1A2B4C',
  textSecondary: '#5C6B73',
  primary: '#1A5C50',
  border: '#DDE7E5',
  success: '#006A4E',
  warning: '#A96716',
  danger: '#B9423A',
  shadow: '#1A2B4C',
};

const darkColors: AppThemeColors = {
  background: '#0F1718',
  surface: '#172224',
  surfaceSoft: '#223033',
  text: '#EEF6F4',
  textSecondary: '#A8BAB6',
  primary: '#5EC6AD',
  border: '#314246',
  success: '#72D9B8',
  warning: '#F1B866',
  danger: '#F28B82',
  shadow: '#000000',
};

const defaultContext: AppSettingsContextValue = {
  darkMode: false,
  notificationsEnabled: true,
  syncStatus: 'Online',
  lastSyncTime: 'Not synced yet',
  backupTimestamp: 'No backup yet',
  backupStatus: 'Pending',
  colors: lightColors,
  setDarkMode: async () => undefined,
  setNotificationsEnabled: async () => undefined,
  runBackup: async () => undefined,
};

const AppSettingsContext = createContext<AppSettingsContextValue>(defaultContext);

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(defaultContext.darkMode);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(defaultContext.notificationsEnabled);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('Syncing');
  const [lastSyncTime, setLastSyncTime] = useState(defaultContext.lastSyncTime);
  const [backupTimestamp, setBackupTimestamp] = useState(defaultContext.backupTimestamp);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>(defaultContext.backupStatus);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((rawSettings) => {
      if (!rawSettings) return;
      const parsed = JSON.parse(rawSettings) as Partial<{
        darkMode: boolean;
        notificationsEnabled: boolean;
        lastSyncTime: string;
        backupTimestamp: string;
        backupStatus: BackupStatus;
      }>;

      setDarkModeState(Boolean(parsed.darkMode));
      setNotificationsEnabledState(parsed.notificationsEnabled ?? true);
      setLastSyncTime(parsed.lastSyncTime ?? defaultContext.lastSyncTime);
      setBackupTimestamp(parsed.backupTimestamp ?? defaultContext.backupTimestamp);
      setBackupStatus(parsed.backupStatus ?? defaultContext.backupStatus);
    }).catch(() => {
      setBackupStatus('Failed');
    });
  }, []);

  useEffect(() => {
    configureNotifications(notificationsEnabled);
  }, [notificationsEnabled]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setSyncStatus('Offline');
        return;
      }

      setSyncStatus('Syncing');
      const timer = setTimeout(() => {
        setSyncStatus('Online');
        setLastSyncTime(formatTimestamp(new Date()));
      }, 700);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  const persist = useCallback(async (updates: Partial<{
    darkMode: boolean;
    notificationsEnabled: boolean;
    lastSyncTime: string;
    backupTimestamp: string;
    backupStatus: BackupStatus;
  }>) => {
    const rawSettings = await AsyncStorage.getItem(SETTINGS_KEY);
    const current = rawSettings ? JSON.parse(rawSettings) : {};
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...updates }));
  }, []);

  const setDarkMode = useCallback(async (enabled: boolean) => {
    setDarkModeState(enabled);
    await persist({ darkMode: enabled });
  }, [persist]);

  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    configureNotifications(enabled);
    await persist({ notificationsEnabled: enabled });
  }, [persist]);

  const runBackup = useCallback(async () => {
    const timestamp = formatTimestamp(new Date());
    setBackupStatus('Success');
    setBackupTimestamp(timestamp);
    await persist({ backupStatus: 'Success', backupTimestamp: timestamp });
  }, [persist]);

  useEffect(() => {
    if (syncStatus !== 'Online') return;

    const timer = setTimeout(() => {
      void runBackup();
    }, 900);

    return () => clearTimeout(timer);
  }, [runBackup, syncStatus]);

  const value = useMemo<AppSettingsContextValue>(() => ({
    darkMode,
    notificationsEnabled,
    syncStatus,
    lastSyncTime,
    backupTimestamp,
    backupStatus,
    colors: darkMode ? darkColors : lightColors,
    setDarkMode,
    setNotificationsEnabled,
    runBackup,
  }), [backupStatus, backupTimestamp, darkMode, lastSyncTime, notificationsEnabled, syncStatus]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
