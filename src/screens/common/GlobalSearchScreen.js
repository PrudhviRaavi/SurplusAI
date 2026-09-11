import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchService } from '../../services/search/searchService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const GlobalSearchScreen = ({ onBack, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState({
    recentSearches: [],
    donations: [],
    organizations: [],
    categories: [],
  });

  const handleSearch = async (text) => {
    setQuery(text);
    setIsSearching(true);
    const res = await searchService.search(text);
    setResults(res);
    setIsSearching(false);
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Search Input Header */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.searchInputBox}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search food, organizations..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isSearching ? (
          <View style={styles.stateCard}>
            <Ionicons name="sync" size={24} color={colors.primary} />
            <Text style={styles.stateText}>Searching across FoodShareAI network...</Text>
          </View>
        ) : query.length > 0 &&
          results.donations.length === 0 &&
          results.organizations.length === 0 ? (
          <View style={styles.stateCard}>
            <Ionicons name="search" size={32} color={colors.gold} />
            <Text style={styles.stateTitle}>No results found.</Text>
            <Text style={styles.stateSub}>Try searching for another food item or organization.</Text>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            {/* Recent Searches */}
            {query.length === 0 && results.recentSearches.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionHeaderTag}>RECENT SEARCHES</Text>
                <View style={styles.chipsRow}>
                  {results.recentSearches.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => handleSearch(item)}
                      style={styles.chip}
                    >
                      <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                      <Text style={styles.chipText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Food Donations Results */}
            {results.donations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeaderTag}>SURPLUS FOOD LISTINGS ({results.donations.length})</Text>
                {results.donations.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    activeOpacity={0.8}
                    onPress={() => onSelectResult && onSelectResult(d)}
                    style={styles.resultCard}
                  >
                    <View style={styles.iconCircle}>
                      <Ionicons name="fast-food-outline" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.resultCol}>
                      <Text style={styles.resultTitle}>{d.title}</Text>
                      <Text style={styles.resultSub}>{d.quantity} · Donor: {d.donor} ({d.distance})</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Organizations Results */}
            {results.organizations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeaderTag}>ORGANIZATIONS ({results.organizations.length})</Text>
                {results.organizations.map((org) => (
                  <TouchableOpacity
                    key={org.id}
                    activeOpacity={0.8}
                    onPress={() => onSelectResult && onSelectResult(org)}
                    style={styles.resultCard}
                  >
                    <View style={styles.iconCircle}>
                      <Ionicons name="business-outline" size={18} color={colors.gold} />
                    </View>
                    <View style={styles.resultCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.resultTitle}>{org.name}</Text>
                        {org.verified && (
                          <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                        )}
                      </View>
                      <Text style={styles.resultSub}>{org.type} · {org.distance} away</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 30,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 20,
  },
  stateTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
  },
  stateSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  stateText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  recentSection: {
    marginBottom: 20,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  resultSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
