
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockMessages, mockUsers, currentUser } from '@/data/mockData';
import { Message } from '@/types';
import MessageBubble from '@/components/MessageBubble';
import UserAvatar from '@/components/UserAvatar';
import { IconSymbol } from '@/components/IconSymbol';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  
  const { recordingState, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
  const { playbackState, playSound, pauseSound, stopSound } = useAudioPlayer();

  const otherUser = mockUsers.find(u => u.id === id);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: 'chat-1',
      senderId: currentUser.id,
      receiverId: id as string,
      type: 'text',
      content: inputText.trim(),
      timestamp: new Date(),
      isRead: false,
      isSent: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (!success) {
      Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    const uri = await stopRecording();
    if (uri) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId: 'chat-1',
        senderId: currentUser.id,
        receiverId: id as string,
        type: 'voice',
        content: 'Voice message',
        voiceUrl: uri,
        voiceDuration: recordingState.duration,
        timestamp: new Date(),
        isRead: false,
        isSent: true,
      };

      setMessages([...messages, newMessage]);
    }
  };

  const handlePlayVoice = async (message: Message) => {
    if (playingMessageId === message.id) {
      if (playbackState.isPlaying) {
        await pauseSound();
      } else {
        await playSound(message.voiceUrl || '');
      }
    } else {
      await stopSound();
      setPlayingMessageId(message.id);
      await playSound(message.voiceUrl || '');
    }
  };

  const handleCall = () => {
    router.push(`/call/${id}`);
  };

  if (!otherUser) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </SafeAreaView>
    );
  }

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
              onPress={handleCall}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <IconSymbol name="phone.fill" size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerCenter: () => (
            <TouchableOpacity
              onPress={() => router.push(`/user/${id}`)}
              style={styles.headerCenter}
              activeOpacity={0.7}
            >
              <UserAvatar
                photoUrl={otherUser.photoUrl}
                name={otherUser.name}
                size={36}
                showOnline
                isOnline={otherUser.isOnline}
              />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{otherUser.name}</Text>
                <Text style={styles.headerStatus}>
                  {otherUser.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwn={item.senderId === currentUser.id}
              onPlayVoice={() => handlePlayVoice(item)}
              isPlaying={playingMessageId === item.id && playbackState.isPlaying}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputContainer}>
          {recordingState.isRecording ? (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>
                  {Math.floor(recordingState.duration / 60)}:
                  {(recordingState.duration % 60).toString().padStart(2, '0')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={cancelRecording}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <IconSymbol name="xmark" size={20} color={colors.error} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleStopRecording}
                style={styles.stopButton}
                activeOpacity={0.7}
              >
                <IconSymbol name="checkmark" size={20} color={colors.card} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.textSecondary}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity
                  onPress={handleStartRecording}
                  style={styles.micButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="mic.fill" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleSendMessage}
                style={[
                  styles.sendButton,
                  inputText.trim().length === 0 && styles.sendButtonDisabled,
                ]}
                activeOpacity={0.7}
                disabled={inputText.trim().length === 0}
              >
                <IconSymbol
                  name="arrow.up"
                  size={20}
                  color={colors.card}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messagesList: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
  },
  micButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
});
