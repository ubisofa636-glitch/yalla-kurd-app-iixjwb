
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface UserAvatarProps {
  photoUrl?: string;
  name: string;
  size?: number;
  showOnline?: boolean;
  isOnline?: boolean;
}

export default function UserAvatar({
  photoUrl,
  name,
  size = 50,
  showOnline = false,
  isOnline = false,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size / 2.5 }]}>{initials}</Text>
        </View>
      )}
      {showOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: size / 5,
              height: size / 5,
              borderRadius: size / 10,
              backgroundColor: isOnline ? colors.online : colors.offline,
              borderWidth: size / 25,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.border,
  },
  placeholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.card,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: colors.card,
  },
});
