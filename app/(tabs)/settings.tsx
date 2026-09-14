import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppSettings } from '@/contexts/AppSettingsContext';
import { students } from '../../data/tamilStudentData';

const teacherProfile = {
  name: 'Mary',
  role: 'Class Teacher',
  teacherId: 'CAL-2026-045',
  school: 'Government Primary School, Chennai South',
  gradesHandled: 'Grades 1 - 5',
  subjectsHandled: 'Mathematics, English, Science, Social Studies',
  academicYear: '2026 - 2027',
};

const appInformation = {
  version: '2.8.3',
  build: 'Build 44',
  storageUsage: '68% used - 2.4 GB available',
};

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  switchValue,
  onSwitch,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  switchValue?: boolean;
  onSwitch?: (value: boolean) => void;
}) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.rowIcon, { backgroundColor: colors.surfaceSoft }]}>
          <Feather name={icon} size={18} color={colors.primary} />
        </View>
        <View style={styles.settingCopy}>
          <Text style={[styles.settingTitle, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          {subtitle ? (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {typeof switchValue === 'boolean' ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitch}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">
          {value}
        </Text>
      )}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">{value}</Text>
    </View>
  );
}

export default function SettingsPage() {
  const {
    darkMode,
    notificationsEnabled,
    syncStatus,
    lastSyncTime,
    backupTimestamp,
    backupStatus,
    colors,
    setDarkMode,
    setNotificationsEnabled,
    runBackup,
  } = useAppSettings();

  const statusColor = syncStatus === 'Online' ? colors.success : syncStatus === 'Syncing' ? colors.warning : colors.danger;
  const backupColor = backupStatus === 'Success' ? colors.success : backupStatus === 'Failed' ? colors.danger : colors.warning;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View style={styles.headerCopy}>
            <Text style={[styles.crumb, { color: colors.success }]}>Calcmate Control</Text>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          </View>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.86} onPress={runBackup}>
            <Feather name="save" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={styles.profileTop}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.surfaceSoft }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>M</Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={[styles.teacherName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{teacherProfile.name}</Text>
              <Text style={[styles.teacherTitle, { color: colors.textSecondary }]} numberOfLines={2} ellipsizeMode="tail">
                {teacherProfile.role} - {teacherProfile.school}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.sectionHead, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>App Preferences</Text>
            <Feather name="settings" size={18} color={colors.primary} />
          </View>

          <SettingRow icon="moon" title="Dark Mode" subtitle="Apply app-wide dark theme" switchValue={darkMode} onSwitch={setDarkMode} />
          <SettingRow icon="bell" title="Notifications" subtitle="Class reminders and sync alerts" switchValue={notificationsEnabled} onSwitch={setNotificationsEnabled} />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.sectionHead, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sync & Storage</Text>
            <Feather name="hard-drive" size={18} color={colors.primary} />
          </View>

          <View style={styles.statusPanel}>
            <View style={[styles.statusChip, { backgroundColor: colors.surfaceSoft }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusChipText, { color: statusColor }]} numberOfLines={1}>{syncStatus}</Text>
            </View>
            <Text style={[styles.lastSyncText, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
              Last Sync: {lastSyncTime}
            </Text>
          </View>

          <SettingRow icon="wifi" title="Offline Storage Status" subtitle="Local classroom cache" value={syncStatus} />
          <SettingRow icon="clock" title="Last Sync Time" subtitle="Updated from connectivity service" value={lastSyncTime} />
          <SettingRow icon="database" title="Data Backup" subtitle={`Status: ${backupStatus}`} value={backupTimestamp} />

          <TouchableOpacity style={[styles.backupButton, { backgroundColor: colors.primary }]} activeOpacity={0.86} onPress={runBackup}>
            <Feather name={backupStatus === 'Failed' ? 'alert-circle' : 'upload-cloud'} size={18} color="#FFFFFF" />
            <Text style={styles.backupButtonText} numberOfLines={1} ellipsizeMode="tail">
              Backup Now - {backupStatus}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.backupState, { color: backupColor }]} numberOfLines={1} ellipsizeMode="tail">
            Latest backup: {backupTimestamp}
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.sectionHead, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Teacher Profile</Text>
            <Feather name="user-check" size={18} color={colors.primary} />
          </View>

          <InfoRow label="Name" value={teacherProfile.name} />
          <InfoRow label="Role" value={teacherProfile.role} />
          <InfoRow label="Teacher ID" value={teacherProfile.teacherId} />
          <InfoRow label="School" value={teacherProfile.school} />
          <InfoRow label="Grades Handled" value={teacherProfile.gradesHandled} />
          <InfoRow label="Subjects Handled" value={teacherProfile.subjectsHandled} />
          <InfoRow label="Total Students" value={students.length} />
          <InfoRow label="Academic Year" value={teacherProfile.academicYear} />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.sectionHead, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Information</Text>
            <Feather name="info" size={18} color={colors.primary} />
          </View>

          <InfoRow label="Version" value={appInformation.version} />
          <InfoRow label="Build" value={appInformation.build} />
          <InfoRow label="Storage Usage" value={appInformation.storageUsage} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 104 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1, minWidth: 0 },
  crumb: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '900', marginTop: 5 },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  profileCard: {
    borderRadius: 16,
    padding: 15,
    marginTop: 16,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatarCircle: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900' },
  profileMeta: { flex: 1, minWidth: 0 },
  teacherName: { fontSize: 22, fontWeight: '900' },
  teacherTitle: { fontSize: 13, lineHeight: 18, fontWeight: '700', marginTop: 4 },
  sectionCard: {
    borderRadius: 16,
    padding: 15,
    marginTop: 14,
    borderWidth: 1,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, gap: 10 },
  sectionTitle: { flex: 1, minWidth: 0, fontSize: 18, fontWeight: '900' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 13, borderBottomWidth: 1 },
  settingLeft: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowIcon: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1, minWidth: 0 },
  settingTitle: { fontWeight: '900', fontSize: 14 },
  settingSubtitle: { fontWeight: '700', fontSize: 12, marginTop: 3 },
  rowValue: { maxWidth: '42%', minWidth: 92, textAlign: 'right', fontWeight: '800', fontSize: 12, lineHeight: 16, flexShrink: 1 },
  statusPanel: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 13, marginBottom: 3 },
  statusChip: { minHeight: 34, borderRadius: 17, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: 12, fontWeight: '900' },
  lastSyncText: { flex: 1, minWidth: 0, fontSize: 12, fontWeight: '700' },
  backupButton: { minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 12, marginTop: 14 },
  backupButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', flexShrink: 1 },
  backupState: { fontSize: 12, fontWeight: '800', marginTop: 9 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingVertical: 12, borderBottomWidth: 1 },
  infoLabel: { flex: 0.42, minWidth: 0, fontSize: 12, fontWeight: '800' },
  infoValue: { flex: 0.58, minWidth: 0, textAlign: 'right', fontSize: 13, lineHeight: 18, fontWeight: '900' },
});
