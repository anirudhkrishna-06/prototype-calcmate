import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AssessmentDetailPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.crumb}>Assessment Centre</Text>
            <Text style={styles.title}>Assessment Detail</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color="#163C40" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fractions Assessment</Text>
          <Text style={styles.cardMeta}>Grade 4 · Mathematics · Sep 15</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}><Text style={styles.statValue}>78%</Text><Text style={styles.statLabel}>Average</Text></View>
            <View style={styles.statBox}><Text style={styles.statValue}>42</Text><Text style={styles.statLabel}>Learners</Text></View>
            <View style={styles.statBox}><Text style={styles.statValue}>Live</Text><Text style={styles.statLabel}>Status</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assessment Flow</Text>
          <Text style={styles.detailText}>Warm-up: 8 min</Text>
          <Text style={styles.detailText}>Assessment: 40 min</Text>
          <Text style={styles.detailText}>Feedback: 12 min</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef4f4' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  crumb: { color: '#126B65', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#163C40', fontSize: 30, fontWeight: '800', marginTop: 8 },
  headerButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 3 },
  cardTitle: { color: '#163C40', fontSize: 20, fontWeight: '800' },
  cardMeta: { color: '#607878', fontSize: 12, fontWeight: '700', marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  statBox: { flex: 1, backgroundColor: '#F8FBFA', borderRadius: 14, padding: 12, alignItems: 'center', marginHorizontal: 4 },
  statValue: { color: '#163C40', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#607878', fontSize: 11, fontWeight: '700', marginTop: 4 },
  detailText: { color: '#607878', fontSize: 13, fontWeight: '700', marginTop: 12 },
});
