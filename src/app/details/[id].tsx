import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePeopleStore } from '@/store/usePeopleStore';
import { Colors, Spacing, Border } from '@/constants/theme';

export default function PersonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'light' ? Colors.light : Colors.dark;

  const { people, loading, fetchPeople } = usePeopleStore();

  // If store is empty, try to fetch/load cache
  useEffect(() => {
    if (people.length === 0) {
      fetchPeople();
    }
  }, [people, fetchPeople]);

  const person = people.find((p) => p.id === id);

  if (loading && !person) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Retrieving Dossier...
        </Text>
      </View>
    );
  }

  if (!person) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="eye-off-outline" size={64} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Record Restricted
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          The specified character dossier could not be found or retrieved from the database.
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.accent }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Return to Archives</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Choose Saber accent color for layout
  let saberColor: string = colors.accent;
  if (person.gender === 'female') {
    saberColor = '#EC4899';
  } else if (person.gender === 'n/a' || person.gender === 'none') {
    saberColor = colors.warning;
  } else if (person.name.toLowerCase().includes('vader') || person.name.toLowerCase().includes('palpatine') || person.name.toLowerCase().includes('maul')) {
    saberColor = colors.danger;
  }

  // Format physical metrics
  const displayHeight = person.height === 'unknown' ? 'Unknown' : `${person.height} cm`;
  const displayMass = person.mass === 'unknown' ? 'Unknown' : `${person.mass} kg`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Character Name & lightsaber line header */}
      <View style={styles.nameHeader}>
        <Text style={[styles.nameText, { color: colors.text }]}>
          {person.name}
        </Text>
        <View style={[styles.saberDivider, { backgroundColor: saberColor }]} />
      </View>

      {/* Profile Metrics Grid */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Physical Profile
      </Text>
      <View style={styles.grid}>
        <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.gridCardLabel, { color: colors.textSecondary }]}>Height</Text>
          <Text style={[styles.gridCardValue, { color: colors.text }]}>{displayHeight}</Text>
        </View>

        <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.gridCardLabel, { color: colors.textSecondary }]}>Mass</Text>
          <Text style={[styles.gridCardValue, { color: colors.text }]}>{displayMass}</Text>
        </View>

        <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.gridCardLabel, { color: colors.textSecondary }]}>Gender</Text>
          <Text style={[styles.gridCardValue, { color: colors.text, textTransform: 'capitalize' }]}>
            {person.gender}
          </Text>
        </View>

        <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.gridCardLabel, { color: colors.textSecondary }]}>Birth Year</Text>
          <Text style={[styles.gridCardValue, { color: colors.text }]}>{person.birth_year}</Text>
        </View>
      </View>

      {/* Appearance Details List */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Appearance Dossier
      </Text>
      <View style={[styles.infoList, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <View style={styles.infoRowLeft}>
            <Ionicons name="color-palette-outline" size={20} color={saberColor} />
            <Text style={[styles.infoRowLabel, { color: colors.text }]}>Skin Tone</Text>
          </View>
          <Text style={[styles.infoRowValue, { color: colors.textSecondary }]}>
            {person.skin_color}
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <View style={styles.infoRowLeft}>
            <Ionicons name="eye-outline" size={20} color={saberColor} />
            <Text style={[styles.infoRowLabel, { color: colors.text }]}>Eye Color</Text>
          </View>
          <Text style={[styles.infoRowValue, { color: colors.textSecondary }]}>
            {person.eye_color}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoRowLeft}>
            <Ionicons name="cut-outline" size={20} color={saberColor} />
            <Text style={[styles.infoRowLabel, { color: colors.text }]}>Hair Color</Text>
          </View>
          <Text style={[styles.infoRowValue, { color: colors.textSecondary }]}>
            {person.hair_color}
          </Text>
        </View>
      </View>

      {/* Affiliation & Stats */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Database Records
      </Text>
      <View style={styles.recordsGrid}>
        <View style={[styles.recordBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.recordCount, { color: saberColor }]}>
            {person.films?.length ?? 0}
          </Text>
          <Text style={[styles.recordLabel, { color: colors.textSecondary }]}>Films</Text>
        </View>

        <View style={[styles.recordBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.recordCount, { color: saberColor }]}>
            {person.starships?.length ?? 0}
          </Text>
          <Text style={[styles.recordLabel, { color: colors.textSecondary }]}>Starships</Text>
        </View>

        <View style={[styles.recordBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.recordCount, { color: saberColor }]}>
            {person.vehicles?.length ?? 0}
          </Text>
          <Text style={[styles.recordLabel, { color: colors.textSecondary }]}>Vehicles</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  loadingText: {
    marginTop: Spacing.two,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.four,
    lineHeight: 20,
  },
  backButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Border.radius.medium,
  },
  backButtonText: {
    color: '#060B13',
    fontWeight: '900',
    fontSize: 15,
  },
  nameHeader: {
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
  },
  saberDivider: {
    height: 3,
    width: '60%',
    borderRadius: Border.radius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.two,
    marginLeft: Spacing.one,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  gridCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.three,
    borderWidth: Border.width.thin,
    borderRadius: Border.radius.medium,
    gap: Spacing.half,
  },
  gridCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridCardValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  infoList: {
    borderWidth: Border.width.thin,
    borderRadius: Border.radius.medium,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: Border.width.thin,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  infoRowLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  recordsGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  recordBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderWidth: Border.width.thin,
    borderRadius: Border.radius.medium,
    gap: Spacing.half,
  },
  recordCount: {
    fontSize: 24,
    fontWeight: '900',
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
