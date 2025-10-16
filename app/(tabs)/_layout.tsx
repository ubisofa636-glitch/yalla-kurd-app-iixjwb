
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'person.2.fill',
      label: 'Contacts',
    },
    {
      name: 'search',
      route: '/(tabs)/search',
      icon: 'magnifyingglass',
      label: 'Discover',
    },
    {
      name: 'matches',
      route: '/(tabs)/matches',
      icon: 'heart.fill',
      label: 'Matches',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="person.2.fill" drawable="ic_contacts" />
          <Label>Contacts</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Icon sf="magnifyingglass" drawable="ic_search" />
          <Label>Discover</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="matches">
          <Icon sf="heart.fill" drawable="ic_matches" />
          <Label>Matches</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="matches" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={320} />
    </>
  );
}
