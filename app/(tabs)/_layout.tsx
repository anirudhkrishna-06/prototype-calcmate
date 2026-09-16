import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { useAppSettings } from '@/contexts/AppSettingsContext';

export default function TabsLayout() {
  const { colors } = useAppSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: Platform.OS === 'android' ? 12 : 16,
          height: Platform.OS === 'web' ? 72 : 76,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderTopWidth: 0,
          borderRadius: 28,
          shadowColor: '#0F4C45',
          shadowOpacity: 0.14,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 16,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'android' ? 8 : 10,
          paddingHorizontal: 6,
        },
        tabBarActiveTintColor: '#0F4C45',
        tabBarInactiveTintColor: colors.textSecondary,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 0,
          maxWidth: '100%',
          borderRadius: 22,
          marginHorizontal: 1,
          paddingHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          textAlign: 'center',
          marginTop: 3,
          flexShrink: 0,
          flexWrap: 'nowrap',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="students-page"
        options={{
          title: 'Students',
          tabBarIcon: ({ color }) => <Feather name="users" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assessment-management"
        options={{
          title: 'Assessments',
          tabBarIcon: ({ color }) => <Feather name="clipboard" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: 'AI',
          tabBarIcon: ({ color }) => <Feather name="cpu" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics-dashboard"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <Feather name="bar-chart" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
