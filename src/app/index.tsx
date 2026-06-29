import { Border, Colors, Spacing } from "@/constants/theme";
import { usePeopleStore } from "@/store/usePeopleStore";
import { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function PeopleListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  const { people, loading, error, isOfflineMode, lastSynced, fetchPeople } =
    usePeopleStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;

    const query = searchQuery.toLowerCase().trim();

    return people.filter((person) => person.name.toLowerCase().includes(query));
  }, [people, searchQuery]);

  const formattedSyncTime = useMemo(() => {
    if (!lastSynced) return "";

    try {
      const date = new Date(lastSynced);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }, [lastSynced]);

  const handleRetry = () => fetchPeople(true);

  const renderItem = ({ item }: { item: Person }) => {
    let saberColor: string = colors.accent;

    if (item.gender === "female") {
      saberColor = "#EC4899";
    } else if (item.gender === "n/a" || item.gender === "none") {
      saberColor = colors.warning;
    } else if (
      item.name.toLowerCase().includes("vader") ||
      item.name.toLowerCase().includes("palpatine") ||
      item.name.toLowerCase().includes("maul")
    ) {
      saberColor = colors.danger;
    }

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
        onPress={() => router.push(`/details/${item.id}`)}
      >
        <View style={[styles.saberBar, { backgroundColor: saberColor }]} />

        <View style={styles.cardContent}>
          <Text style={[styles.characterName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.backgroundSelected },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                🎂 {item.birth_year}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.backgroundSelected },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                👤 {item.gender}
              </Text>
            </View>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={saberColor}
          style={styles.chevron}
        />
      </TouchableOpacity>
    );
  };

  if (loading && people.length === 0) {
    return (
      <View
        style={[
          styles.centeredContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Decrypting Star Wars Archives...
        </Text>
      </View>
    );
  }

  if (error && people.length === 0) {
    return (
      <View
        style={[
          styles.centeredContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Transmission Interrupted
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Re-establish Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {isOfflineMode && (
        <View
          style={[styles.offlineBanner, { backgroundColor: colors.warning }]}
        >
          <Ionicons name="wifi" size={16} color="#0F172A" />
          <Text style={styles.offlineBannerText}>
            Offline Database{" "}
            {formattedSyncTime ? `(Synced at ${formattedSyncTime})` : ""}
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.backgroundElement,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search characters by name..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredPeople}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRetry}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-sharp"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No records found in this sector.
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.four,
  },
  loadingText: {
    marginTop: Spacing.two,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Spacing.four,
    lineHeight: 20,
  },
  retryButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Border.radius.medium,
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: "#060B13",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.one,
    gap: Spacing.one,
  },
  offlineBannerText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 12,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: Border.width.thin,
    borderRadius: Border.radius.medium,
    paddingHorizontal: Spacing.two,
  },
  searchIcon: {
    marginRight: Spacing.one,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: "100%",
    padding: 0,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: Border.width.thin,
    borderRadius: Border.radius.medium,
    marginBottom: Spacing.two,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saberBar: {
    width: 5,
    alignSelf: "stretch",
  },
  cardContent: {
    flex: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  characterName: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  badgeRow: {
    flexDirection: "row",
    gap: Spacing.one,
    marginTop: Spacing.half,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.one,
    borderRadius: Border.radius.small,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chevron: {
    paddingRight: Spacing.three,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
