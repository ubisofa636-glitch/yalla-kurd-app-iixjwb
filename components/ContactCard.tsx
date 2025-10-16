
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Contact } from '@/types';
import { colors, commonStyles } from '@/styles/commonStyles';
import UserAvatar from './UserAvatar';
import { IconSymbol } from './IconSymbol';

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  onCall?: () => void;
}

export default function ContactCard({ contact, onPress, onCall }: ContactCardProps) {
  const { user } = contact;

  return (
    <TouchableOpacity
      style={[commonStyles.card, styles.card]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <UserAvatar
          photoUrl={user.photoUrl}
          name={user.name}
          size={60}
          showOnline
          isOnline={user.isOnline}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            {user.isFavorite && (
              <IconSymbol name="heart.fill" size={16} color={colors.highlight} />
            )}
          </View>
          {user.bio && (
            <Text style={styles.bio} numberOfLines={1}>
              {user.bio}
            </Text>
          )}
          {user.location && (
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          )}
        </View>
        {onCall && (
          <TouchableOpacity
            style={styles.callButton}
            onPress={onCall}
            activeOpacity={0.7}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.card} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  bio: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
