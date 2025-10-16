
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockUsers } from '@/data/mockData';
import UserAvatar from '@/components/UserAvatar';
import { IconSymbol } from '@/components/IconSymbol';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const user = mockUsers.find(u => u.id === id);
  const [isFavorite, setIsFavorite] = useState(user?.isFavorite || false);
  const [isContact, setIsContact] = useState(false);

  if (!user) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </SafeAreaView>
    );
  }

  const handleAddContact = () => {
    setIsContact(true);
    Alert.alert('Success', `${user.name} has been added to your contacts!`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleMessage = () => {
    if (!isContact) {
      Alert.alert(
        'Add Contact First',
        'You need to add this person as a contact before messaging them.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Contact', onPress: handleAddContact },
        ]
      );
      return;
    }
    router.push(`/chat/${id}`);
  };

  const handleCall = () => {
    if (!isContact) {
      Alert.alert(
        'Add Contact First',
        'You need to add this person as a contact before calling them.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Contact', onPress: handleAddContact },
        ]
      );
      return;
    }
    router.push(`/call/${id}`);
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={isFavorite ? 'heart.fill' : 'heart'}
                size={22}
                color={isFavorite ? colors.highlight : colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[commonStyles.card, styles.profileCard]}>
          <UserAvatar
            photoUrl={user.photoUrl}
            name={user.name}
            size={120}
            showOnline
            isOnline={user.isOnline}
          />
          <Text style={styles.userName}>{user.name}</Text>
          {user.age && (
            <Text style={styles.userAge}>{user.age} years old</Text>
          )}
          {user.location && (
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.userLocation}>{user.location}</Text>
            </View>
          )}
        </View>

        {user.bio && (
          <View style={[commonStyles.card, styles.section]}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="text.alignleft" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {user.interests && user.interests.length > 0 && (
          <View style={[commonStyles.card, styles.section]}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="star.fill" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Interests</Text>
            </View>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          {!isContact && (
            <TouchableOpacity
              style={[styles.actionButton, styles.addContactButton]}
              onPress={handleAddContact}
              activeOpacity={0.7}
            >
              <IconSymbol name="person.badge.plus" size={20} color={colors.card} />
              <Text style={styles.actionButtonText}>Add Contact</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleMessage}
            activeOpacity={0.7}
          >
            <IconSymbol name="message.fill" size={20} color={colors.card} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.card} />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  profileCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  userAge: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userLocation: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  bioText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.card,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  addContactButton: {
    backgroundColor: colors.secondary,
  },
  messageButton: {
    backgroundColor: colors.primary,
  },
  callButton: {
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
});
