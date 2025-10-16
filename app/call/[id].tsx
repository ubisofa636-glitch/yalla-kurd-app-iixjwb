
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { mockUsers } from '@/data/mockData';
import UserAvatar from '@/components/UserAvatar';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

export default function CallScreen() {
  const { id } = useLocalSearchParams();
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'active' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  const otherUser = mockUsers.find(u => u.id === id);

  useEffect(() => {
    // Simulate call connection
    const timer1 = setTimeout(() => {
      setCallStatus('ringing');
    }, 1000);

    const timer2 = setTimeout(() => {
      setCallStatus('active');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      router.back();
    }, 500);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  if (!otherUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </SafeAreaView>
    );
  }

  const getStatusText = () => {
    switch (callStatus) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Ringing...';
      case 'active':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call Ended';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Voice Call - WebRTC Integration Required
          </Text>
          <Text style={styles.infoSubtext}>
            This is a demo screen. To enable real voice calls, integrate with:
          </Text>
          <View style={styles.providersList}>
            <Text style={styles.providerText}>- Agora SDK</Text>
            <Text style={styles.providerText}>- Twilio Video</Text>
            <Text style={styles.providerText}>- WebRTC Native</Text>
          </View>
        </View>

        <View style={styles.userSection}>
          <UserAvatar
            photoUrl={otherUser.photoUrl}
            name={otherUser.name}
            size={140}
          />
          <Text style={styles.userName}>{otherUser.name}</Text>
          <Text style={styles.callStatus}>{getStatusText()}</Text>
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={handleToggleMute}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={isMuted ? 'mic.slash.fill' : 'mic.fill'}
                size={28}
                color={isMuted ? colors.card : colors.text}
              />
              <Text style={[styles.controlLabel, isMuted && styles.controlLabelActive]}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
              onPress={handleToggleSpeaker}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="speaker.wave.3.fill"
                size={28}
                color={isSpeaker ? colors.card : colors.text}
              />
              <Text style={[styles.controlLabel, isSpeaker && styles.controlLabelActive]}>
                Speaker
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
            activeOpacity={0.7}
          >
            <IconSymbol name="phone.down.fill" size={32} color={colors.card} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  infoSection: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoSubtext: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  providersList: {
    alignItems: 'center',
  },
  providerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  userSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  controlsSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  controlButtonActive: {
    backgroundColor: colors.primary,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
  },
  controlLabelActive: {
    color: colors.card,
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 16px rgba(244, 67, 54, 0.4)',
    elevation: 6,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
});
