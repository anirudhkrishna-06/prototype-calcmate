// File: app/(tabs)/index.tsx
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Shadow } from '@/constants/theme';
import { upcomingClass } from '@/data/mockData';

const today = 'Friday, August 21';

const otherGroupRows = [
  {
    id: 'g1',
    grade: 'Grade 1',
    subject: 'Division',
    minutes: '12 min',
    label: 'PARALLEL',
    route: '/groups/g1' as const,
    chipBackground: '#182748',
    chipColor: '#FFFFFF',
    iconTone: '#1A2B4C',
  },
  {
    id: 'g2',
    grade: 'Grade 2',
    subject: 'Decimals',
    minutes: '8 min',
    label: 'PARALLEL',
    route: '/groups/g2' as const,
    chipBackground: '#0E6D67',
    chipColor: '#F7FFFD',
    iconTone: '#0E6D67',
  },
  {
    id: 'g3',
    grade: 'Grade 3',
    subject: 'Decimals',
    minutes: '8 min',
    label: 'INDEPENDENT',
    route: '/groups/g3' as const,
    chipBackground: '#C28F1D',
    chipColor: '#FFF9E8',
    iconTone: '#C28F1D',
  },
] as const;

function DivisionGlyph({ color }: { color: string }) {
  return (
    <View style={[styles.microGlyph, { borderColor: color }]}>
      <View style={[styles.microGlyphBar, { backgroundColor: color }]} />
      <View style={[styles.microDot, { backgroundColor: color, top: 3, left: 7 }]} />
      <View style={[styles.microDot, { backgroundColor: color, bottom: 3, left: 7 }]} />
    </View>
  );
}

function DecimalGlyph({ color }: { color: string }) {
  return (
    <View style={[styles.microGlyph, { borderColor: color }]}>
      <View style={styles.matrixRow}>
        <View style={[styles.matrixDot, { backgroundColor: color }]} />
        <View style={[styles.matrixDot, { backgroundColor: color }]} />
      </View>
      <View style={styles.matrixRow}>
        <View style={[styles.matrixDot, { backgroundColor: color }]} />
        <View style={[styles.matrixDot, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function GlyphForRow({ index, color }: { index: number; color: string }) {
  return index === 0 ? <DivisionGlyph color={color} /> : <DecimalGlyph color={color} />;
}

function PatternIcon({
  name,
  size,
  color,
  style,
}: {
  name: React.ComponentProps<typeof Feather>['name'];
  size: number;
  color: string;
  style?: any;
}) {
  return <Feather name={name} size={size} color={color} style={style} />;
}

export default function HomeScreen() {
  const router = useRouter();
  const floatA = React.useRef(new Animated.Value(0)).current;
  const floatB = React.useRef(new Animated.Value(0)).current;
  const floatC = React.useRef(new Animated.Value(0)).current;
  const aiPulse = React.useRef(new Animated.Value(0)).current;
  const intro = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.delay(80),
        Animated.stagger(
          130,
          intro.map((value) =>
            Animated.spring(value, {
              toValue: 1,
              damping: 15,
              stiffness: 145,
              mass: 0.75,
              useNativeDriver: true,
            })
          )
        ),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatA, {
            toValue: 1,
            duration: 5200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatA, {
            toValue: 0,
            duration: 5200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatB, {
            toValue: 1,
            duration: 6400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatB, {
            toValue: 0,
            duration: 6400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatC, {
            toValue: 1,
            duration: 7200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatC, {
            toValue: 0,
            duration: 7200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(aiPulse, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(aiPulse, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [aiPulse, floatA, floatB, floatC, intro]);

  const headerAnim = {
    opacity: intro[0],
    transform: [
      {
        translateY: intro[0].interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  const attendanceAnim = {
    opacity: intro[1],
    transform: [
      {
        translateY: intro[1].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const heroAnim = {
    opacity: intro[2],
    transform: [
      {
        translateY: intro[2].interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
      {
        scale: intro[2].interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1],
        }),
      },
    ],
  };

  const groupsAnim = {
    opacity: intro[3],
    transform: [
      {
        translateY: intro[3].interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  const scheduleAnim = {
    opacity: intro[3],
    transform: [
      {
        translateY: intro[3].interpolate({
          inputRange: [0, 1],
          outputRange: [28, 0],
        }),
      },
    ],
  };

  const aiGlowScale = aiPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.08],
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View pointerEvents="none" style={styles.backdrop}>
        <PatternIcon
          name="book-open"
          size={56}
          color="rgba(26,43,76,0.10)"
          style={[styles.patternIcon, styles.patternTopLeft]}
        />
        <PatternIcon
          name="compass"
          size={38}
          color="rgba(26,43,76,0.12)"
          style={[styles.patternIcon, styles.patternTopRight]}
        />
        <PatternIcon
          name="globe"
          size={40}
          color="rgba(26,43,76,0.11)"
          style={[styles.patternIcon, styles.patternMidRight]}
        />
        <PatternIcon
          name="book"
          size={44}
          color="rgba(26,43,76,0.10)"
          style={[styles.patternIcon, styles.patternBottomLeft]}
        />
        <PatternIcon
          name="circle"
          size={34}
          color="rgba(26,43,76,0.08)"
          style={[styles.patternIcon, styles.patternUpperMidLeft]}
        />
        <PatternIcon
          name="compass"
          size={48}
          color="rgba(26,43,76,0.08)"
          style={[styles.patternIcon, styles.patternLowerMid]}
        />
        <PatternIcon
          name="globe"
          size={28}
          color="rgba(26,43,76,0.10)"
          style={[styles.patternIcon, styles.patternBottomRight]}
        />
        <Animated.View
          style={[
            styles.glowOrbTop,
            {
              opacity: floatA.interpolate({
                inputRange: [0, 1],
                outputRange: [0.26, 0.44],
              }),
              transform: [
                {
                  translateY: floatA.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 14],
                  }),
                },
                {
                  translateX: floatA.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  }),
                },
                {
                  scale: floatA.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.06],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glowOrbBottom,
            {
              opacity: floatB.interpolate({
                inputRange: [0, 1],
                outputRange: [0.18, 0.34],
              }),
              transform: [
                {
                  translateY: floatB.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -12],
                  }),
                },
                {
                  translateX: floatB.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 8],
                  }),
                },
                {
                  scale: floatB.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.04],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.headerBlock, headerAnim]}>
          <View>
            <Text style={styles.greeting}>Good morning, Anirudh</Text>
            <Text style={styles.date}>{today}</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/(tabs)/students' as never)}
              style={styles.profileButton}
            >
              <View style={styles.profileRing}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileInitial}>A</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/settings' as never)}
              style={styles.settingsButton}
            >
              <Feather name="settings" size={20} color="#6B6F74" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.cardStack, attendanceAnim]}>
          <View style={styles.attendanceCard}>
            <Text style={styles.attendanceLabel}>Do not forget!</Text>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/attendance' as never)}
              style={styles.attendanceAction}
            >
              <Text style={styles.attendanceActionText}>Mark attendance</Text>
              <Feather name="arrow-right" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.cardStack, heroAnim]}>
          <View style={styles.heroCard}>
            <View style={styles.heroSheen} />
            <View style={styles.heroAccentOne} />
            <View style={styles.heroAccentTwo} />

            <View style={styles.heroTopRow}>
              <View style={styles.heroCopy}>
                <Text style={styles.upNextLabel}>UP NEXT</Text>
                <Text style={styles.gradeText}>{upcomingClass.grade}</Text>
                <Text style={styles.subjectText}>{upcomingClass.subject}</Text>
                <Text style={styles.topicText}>{upcomingClass.concept}</Text>
              </View>

              <View style={styles.heroInstrumentWrap}>
                <View style={styles.heroInstrumentColumn}>
                  <View style={styles.heroInstrumentGlow} />
                  <MaterialCommunityIcons name="ruler" size={42} color="#DCCF96" />
                </View>
                <View style={[styles.heroInstrumentColumn, { left: undefined, right: 0, top: 2 }]}>
                  <MaterialCommunityIcons name="compass-outline" size={44} color="#DCCF96" />
                </View>
              </View>
            </View>

            <View style={styles.priorityPill}>
              <View style={styles.priorityDot} />
              <Text style={styles.priorityText}>{upcomingClass.studentsNeedingAttention} priorities</Text>
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeIconBox}>
                <Feather name="clock" size={14} color="#8E9CFF" />
              </View>
              <Text style={styles.timeText}>
                {upcomingClass.time} — {upcomingClass.endTime}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: '/pre-class',
                  params: { groupId: upcomingClass.groupId },
                } as never)
              }
              style={styles.heroButton}
            >
              <Text style={styles.heroButtonText}>View class</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.cardStack, groupsAnim]}>
          <View style={styles.groupsCard}>
            <Text style={styles.groupsTitle}>Other groups</Text>

            {otherGroupRows.map((group, index) => (
              <TouchableOpacity
                key={group.id}
                activeOpacity={0.88}
                onPress={() => router.push(group.route as never)}
                style={[
                  styles.groupRow,
                  index !== otherGroupRows.length - 1 && styles.groupRowBorder,
                ]}
              >
                <View style={styles.groupLeft}>
                  <Text style={styles.groupGrade}>{group.grade}</Text>
                  <View style={styles.groupGlyphWrap}>
                    <GlyphForRow index={index} color={group.iconTone} />
                  </View>
                  <Text style={styles.groupSubject}>{group.subject}</Text>
                  <Text style={styles.groupDivider}>|</Text>
                  <Text style={styles.groupMinutes}>{group.minutes}</Text>
                </View>

                <View style={[styles.modeChip, { backgroundColor: group.chipBackground }]}>
                  <Text style={[styles.modeChipText, { color: group.chipColor }]}>{group.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.scheduleWrap, scheduleAnim]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/schedule' as never)}
            style={styles.scheduleButton}
          >
            <Text style={styles.scheduleButtonText}>Today&apos;s schedule</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>

      <View style={styles.floatingAIWrap} pointerEvents="box-none">
        <Animated.View
          pointerEvents="none"
          style={[
            styles.aiHalo,
            {
              opacity: aiPulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.38, 0.16],
              }),
              transform: [{ scale: aiGlowScale }],
            },
          ]}
        />
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => router.push('/ai' as never)}
          style={styles.aiButton}
        >
          <Text style={styles.aiButtonText}>AI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F3E9',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  patternIcon: {
    position: 'absolute',
  },
  patternTopLeft: {
    top: 16,
    left: -18,
    transform: [{ rotate: '-8deg' }],
  },
  patternTopRight: {
    top: 28,
    right: 10,
    transform: [{ rotate: '14deg' }],
  },
  patternMidRight: {
    top: 178,
    right: -8,
    transform: [{ rotate: '11deg' }],
  },
  patternBottomLeft: {
    left: -10,
    bottom: 188,
    transform: [{ rotate: '-12deg' }],
  },
  patternUpperMidLeft: {
    top: 176,
    left: -8,
    transform: [{ rotate: '15deg' }],
  },
  patternLowerMid: {
    bottom: 116,
    left: 16,
    transform: [{ rotate: '-12deg' }],
  },
  patternBottomRight: {
    right: 22,
    bottom: 132,
    transform: [{ rotate: '10deg' }],
  },
  glowOrbTop: {
    position: 'absolute',
    top: 84,
    right: -36,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(25, 120, 117, 0.08)',
  },
  glowOrbBottom: {
    position: 'absolute',
    left: -30,
    bottom: 108,
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: 'rgba(23, 37, 72, 0.06)',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 132,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingTop: 2,
  },
  greeting: {
    color: Colors.primary,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '500',
    letterSpacing: -0.6,
  },
  date: {
    marginTop: 8,
    color: '#6E726D',
    fontSize: 18,
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    padding: 1,
    borderWidth: 1,
    borderColor: 'rgba(26,43,76,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4D7C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CFD6D1',
    backgroundColor: 'rgba(255,255,255,0.74)',
  },
  cardStack: {
    marginBottom: 14,
  },
  attendanceCard: {
    borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...Shadow.card,
  },
  attendanceLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  attendanceAction: {
    minWidth: 176,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: '#137A75',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0E4E4B',
    shadowOpacity: 0.26,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  attendanceActionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
    backgroundColor: '#17284D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#111C39',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
  heroSheen: {
    position: 'absolute',
    top: -84,
    right: -96,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(31, 146, 105, 0.52)',
  },
  heroAccentOne: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 110,
    height: 110,
    borderBottomLeftRadius: 110,
    backgroundColor: 'rgba(92, 172, 111, 0.18)',
  },
  heroAccentTwo: {
    position: 'absolute',
    left: -42,
    bottom: -32,
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: 'rgba(20, 28, 61, 0.18)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroCopy: {
    flex: 1,
  },
  upNextLabel: {
    color: 'rgba(238, 240, 242, 0.42)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  gradeText: {
    color: Colors.white,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '500',
    letterSpacing: -0.6,
  },
  subjectText: {
    color: Colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  topicText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 6,
  },
  heroInstrumentWrap: {
    width: 106,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  heroInstrumentColumn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 4,
    top: 18,
  },
  heroInstrumentGlow: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 58,
    backgroundColor: 'rgba(255, 215, 130, 0.12)',
  },
  priorityPill: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F4D37D',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#E0A93F',
    shadowOpacity: 0.38,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#FFF4D0',
  },
  priorityText: {
    color: '#3D2A06',
    fontSize: 13,
    fontWeight: '500',
  },
  timeRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130, 142, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  heroButton: {
    marginTop: 18,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#15213D',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#08101D',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  groupsCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.78)',
    ...Shadow.card,
  },
  groupsTitle: {
    color: '#6E6F68',
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 8,
  },
  groupRow: {
    minHeight: 34,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 10,
  },
  groupRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(45, 59, 74, 0.06)',
  },
  groupLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  groupGrade: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '400',
  },
  groupGlyphWrap: {
    marginLeft: 6,
    marginRight: 6,
  },
  groupSubject: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '400',
  },
  groupDivider: {
    color: '#70767C',
    fontSize: 16,
    marginHorizontal: 6,
  },
  groupMinutes: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '400',
  },
  modeChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeChipText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scheduleWrap: {
    marginTop: 2,
  },
  scheduleButton: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#1C8A84',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: '#0F5B57',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  scheduleButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  floatingAIWrap: {
    position: 'absolute',
    right: 18,
    bottom: 26,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHalo: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(119, 57, 181, 0.36)',
  },
  aiButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#142241',
    borderWidth: 4,
    borderColor: 'rgba(190, 85, 202, 0.26)',
    shadowColor: '#541E84',
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  aiButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  microGlyph: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  microGlyphBar: {
    width: 1.5,
    height: 12,
    borderRadius: 1,
  },
  microDot: {
    position: 'absolute',
    width: 2.5,
    height: 2.5,
    borderRadius: 2.5,
  },
  matrixRow: {
    flexDirection: 'row',
    gap: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 2.5,
  },
});
