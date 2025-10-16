
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockUsers } from '@/data/mockData';
import { MatchProfile } from '@/types';
import UserAvatar from '@/components/UserAvatar';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function MatchesScreen() {
  const [matches] = useState<MatchProfile[]>(
    mockUsers.map((user, index) => ({
      userId: user.id,
      user,
      matchScore: Math.floor(Math.random() * 30) + 70,
      commonInterests: user.interests?.slice(0, 2) || [],
    }))
  );

  const handleLike = (userId: string) => {
    console.log('Liked user:', userId);
    // In a real app, this would send a like to the backend
  };

  const handlePass = (userId: string) => {
    console.log('Passed user:', userId);
    // In a real app, this would skip this user
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const renderMatchCard = ({ item }: { item: MatchProfile }) => (
    <View style={[commonStyles.card, styles.matchCard]}>
      <TouchableOpacity
        onPress={() => handleViewProfile(item.userId)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <UserAvatar
            photoUrl={item.user.photoUrl}
            name={item.user.name}
            size={120}
            showOnline
            isOnline={item.user.isOnline}
          />
          <View style={styles.matchBadge}>
            <IconSymbol name="heart.fill" size={16} color={colors.card} />
            <Text style={styles.matchScore}>{item.matchScore}%</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.matchName}>{item.user.name}</Text>
          {item.user.age && (
            <Text style={styles.matchAge}>{item.user.age} years old</Text>
          )}
          {item.user.location && (
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.matchLocation}>{item.user.location}</Text>
            </View>
          )}
          {item.user.bio && (
            <Text style={styles.matchBio} numberOfLines={3}>
              {item.user.bio}
            </Text>
          )}
          {item.commonInterests.length > 0 && (
            <View style={styles.interestsSection}>
              <Text style={styles.interestsTitle}>Common Interests</Text>
              <View style={styles.interestsContainer}>
                {item.commonInterests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handlePass(item.userId)}
          activeOpacity={0.7}
        >
          <IconSymbol name="xmark" size={28} color={colors.error} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleLike(item.userId)}
          activeOpacity={0.7}
        >
          <IconSymbol name="heart.fill" size={28} color={colors.card} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSubtitle}>
          Find people with similar interests
        </Text>
      </View>
      <FlatList
        data={matches}
        keyExtractor={item => item.userId}
        renderItem={renderMatchCard}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS !== 'ios' && styles.listContentWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 24}
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 16,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  matchCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    width: CARD_WIDTH,
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: 16,
    position: 'relative',
  },
  matchBadge: {
    position: 'absolute',
    top: 24,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.highlight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  matchScore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  cardContent: {
    paddingTop: 16,
  },
  matchName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  matchAge: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12,
  },
  matchLocation: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  matchBio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  interestsSection: {
    marginTop: 8,
  },
  interestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.card,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  passButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.error,
  },
  likeButton: {
    backgroundColor: colors.highlight,
  },
});
