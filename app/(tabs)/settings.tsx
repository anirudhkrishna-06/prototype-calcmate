import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppSettings } from '@/contexts/AppSettingsContext';
import {
  classroomSetup,
  getTimetableSlotsForDay,
  schoolDays,
  type SchoolDay,
} from '@/data/classroomSetup';

const teacherProfile = {
  name: 'Mary',
  school: 'Government Primary School, Chennai South',
  classLevelsHandled: 'Grades 1 to 5',
  academicYear: '2026-27',
};

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
}) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]} numberOfLines={2}>{title}</Text>
        <View style={[styles.sectionIcon, { backgroundColor: colors.surfaceSoft }]}>
          <Feather name={icon} size={17} color={colors.primary} />
        </View>
      </View>
      {children}
    </View>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceSoft }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>{title}</Text>
        <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={3}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  accent?: string;
}) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surfaceSoft }]}>
        <Feather name={icon} size={17} color={accent ?? colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]} numberOfLines={2}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={4}>{value}</Text>
      </View>
    </View>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.statusPill, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusPillText, { color }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function TimetableSlotRow({
  grade,
  subject,
  topic,
  time,
  isBreak,
}: {
  grade: string;
  subject: string;
  topic: string;
  time: string;
  isBreak: boolean;
}) {
  const { colors } = useAppSettings();

  return (
    <View style={[styles.slotRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.slotTimePill, { backgroundColor: colors.surfaceSoft }]}>
        <Text style={[styles.slotTimeText, { color: colors.primary }]} numberOfLines={1}>{time}</Text>
      </View>
      <View style={styles.slotCopy}>
        <View style={styles.slotLabelRow}>
          <View style={[styles.slotGradeBadge, { backgroundColor: isBreak ? colors.border : colors.primary }]}>
            <Text style={styles.slotGradeText} numberOfLines={1}>{isBreak ? 'Break' : grade.replace('Grade ', 'G')}</Text>
          </View>
          <Text style={[styles.slotSubject, { color: colors.text }]} numberOfLines={1}>{subject}</Text>
        </View>
        <Text style={[styles.slotSubtitle, { color: colors.textSecondary }]} numberOfLines={2}>{topic}</Text>
      </View>
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
  } = useAppSettings();
  const [selectedDay, setSelectedDay] = useState<SchoolDay>('Monday');

  const syncColor = syncStatus === 'Online' ? colors.success : syncStatus === 'Syncing' ? colors.warning : colors.danger;
  const backupColor = backupStatus === 'Success' ? colors.success : backupStatus === 'Failed' ? colors.danger : colors.warning;
  const selectedDaySlots = useMemo(() => getTimetableSlotsForDay(selectedDay), [selectedDay]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View style={styles.headerCopy}>
            <Text style={[styles.crumb, { color: colors.success }]} numberOfLines={1}>Calcmate Control</Text>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>Settings</Text>
          </View>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.surfaceSoft }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>M</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={[styles.teacherName, { color: colors.text }]} numberOfLines={1}>Mary</Text>
            <Text style={[styles.teacherSchool, { color: colors.textSecondary }]} numberOfLines={3}>{teacherProfile.school}</Text>
            <Text style={[styles.teacherMeta, { color: colors.textSecondary }]} numberOfLines={1}>
              {teacherProfile.classLevelsHandled} - {teacherProfile.academicYear}
            </Text>
          </View>
        </View>

        <SectionCard title="Timetable" icon="calendar">
          <InfoRow icon="calendar" label="School Week" value={classroomSetup.schoolWeek} />
          <InfoRow icon="grid" label="Periods Per Day" value={`${classroomSetup.periodsPerDay} periods`} />
          <InfoRow icon="clock" label="Default Period Duration" value={classroomSetup.defaultPeriodDuration} />
          <InfoRow icon="coffee" label="Break Time" value={classroomSetup.breakTime} />
          <InfoRow icon="bell" label="Reminder Window" value={classroomSetup.reminderWindow} />

          <View style={styles.daySelectorRow}>
            {schoolDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: selectedDay === day ? colors.primary : colors.surfaceSoft,
                    borderColor: selectedDay === day ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.82}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[styles.dayChipText, { color: selectedDay === day ? '#FFFFFF' : colors.text }]}
                  numberOfLines={1}
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.timetablePanel, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Text style={[styles.timetableTitle, { color: colors.text }]}>{selectedDay} Timetable</Text>
            <Text style={[styles.timetableCaption, { color: colors.textSecondary }]}>
              Used to manage multi-grade teaching schedules.
            </Text>
            {selectedDaySlots.map((slot) => (
              <TimetableSlotRow
                key={`${slot.day}-${slot.startTime}-${slot.grade}`}
                grade={slot.grade}
                subject={slot.subject}
                topic={slot.topic}
                time={`${slot.startTime}-${slot.endTime}`}
                isBreak={slot.kind === 'break'}
              />
            ))}
          </View>
        </SectionCard>

        <SectionCard title="App Settings" icon="settings">
          <ToggleRow
            icon="moon"
            title="Dark Mode"
            subtitle="Applies the saved theme across navigation, cards, and teacher tools."
            value={darkMode}
            onValueChange={(value) => void setDarkMode(value)}
          />
          <ToggleRow
            icon="bell"
            title="Notifications"
            subtitle="Class reminders and sync alerts use this saved preference."
            value={notificationsEnabled}
            onValueChange={(value) => void setNotificationsEnabled(value)}
          />
        </SectionCard>

        <SectionCard title="Backup Status" icon="cloud">
          <View style={styles.statusRow}>
            <StatusPill label={syncStatus} color={syncColor} />
            <StatusPill label={backupStatus} color={backupColor} />
          </View>
          <InfoRow icon="clock" label="Last Sync" value={lastSyncTime} accent={syncColor} />
          <InfoRow icon="database" label="Automatic Backup" value={backupTimestamp} accent={backupColor} />
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Backup runs automatically when the app is online. Manual backup controls are not required.
          </Text>
        </SectionCard>

        <SectionCard title="Other Settings" icon="sliders">
          <InfoRow icon="layers" label="Class Levels Handled" value={teacherProfile.classLevelsHandled} />
          <InfoRow icon="book-open" label="Academic Year" value={teacherProfile.academicYear} />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 104 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCopy: { flex: 1, minWidth: 0 },
  crumb: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '900', marginTop: 4 },
  profileCard: {
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: { width: 54, height: 54, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900' },
  profileCopy: { flex: 1, minWidth: 0 },
  teacherName: { fontSize: 22, lineHeight: 28, fontWeight: '900' },
  teacherSchool: { fontSize: 13, lineHeight: 18, fontWeight: '700', marginTop: 3 },
  teacherMeta: { fontSize: 12, lineHeight: 17, fontWeight: '800', marginTop: 5 },
  sectionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    marginTop: 14,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 12, borderBottomWidth: 1 },
  sectionTitle: { flex: 1, minWidth: 0, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  sectionIcon: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 13, borderBottomWidth: 1 },
  rowIcon: { width: 38, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14, lineHeight: 19, fontWeight: '900' },
  rowSubtitle: { fontSize: 12, lineHeight: 17, fontWeight: '700', marginTop: 3 },
  infoLabel: { fontSize: 11, lineHeight: 15, fontWeight: '900', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, lineHeight: 20, fontWeight: '900', marginTop: 3 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 13 },
  statusPill: { minHeight: 34, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusPillText: { fontSize: 12, fontWeight: '900' },
  helperText: { fontSize: 12, lineHeight: 18, fontWeight: '700', marginTop: 10 },
  daySelectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 14 },
  dayChip: {
    minWidth: 48,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipText: { fontSize: 12, fontWeight: '900' },
  timetablePanel: { borderWidth: 1, borderRadius: 8, padding: 14, marginTop: 12 },
  timetableTitle: { fontSize: 16, lineHeight: 21, fontWeight: '900' },
  timetableCaption: { fontSize: 12, lineHeight: 17, fontWeight: '700', marginTop: 3, marginBottom: 8 },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1 },
  slotTimePill: { width: 108, minHeight: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  slotTimeText: { fontSize: 12, fontWeight: '900' },
  slotCopy: { flex: 1, minWidth: 0 },
  slotLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  slotGradeBadge: { minWidth: 42, minHeight: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  slotGradeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  slotSubject: { flex: 1, minWidth: 0, fontSize: 15, lineHeight: 20, fontWeight: '900' },
  slotSubtitle: { fontSize: 12, lineHeight: 17, fontWeight: '700', marginTop: 5 },
});
