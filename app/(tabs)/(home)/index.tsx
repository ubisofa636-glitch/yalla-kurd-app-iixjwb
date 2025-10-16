
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockContacts } from '@/data/mockData';
import ContactCard from '@/components/ContactCard';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const [contacts] = useState(mockContacts);

  const handleContactPress = (contactId: string) => {
    router.push(`/chat/${contactId}`);
  };

  const handleCallPress = (contactId: string) => {
    router.push(`/call/${contactId}`);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Contacts</Text>
      <Text style={styles.headerSubtitle}>
        {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="person.2.fill" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Contacts Yet</Text>
      <Text style={styles.emptyText}>
        Add contacts to start chatting and making calls
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/search')}
        activeOpacity={0.7}
      >
        <IconSymbol name="plus" size={20} color={colors.card} />
        <Text style={styles.addButtonText}>Find People</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onPress={() => handleContactPress(item.userId)}
            onCall={() => handleCallPress(item.userId)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS !== 'ios' && styles.listContentWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
