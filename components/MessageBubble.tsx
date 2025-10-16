
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Message } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onPlayVoice?: () => void;
  isPlaying?: boolean;
}

export default function MessageBubble({
  message,
  isOwn,
  onPlayVoice,
  isPlaying = false,
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {message.type === 'text' ? (
          <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
            {message.content}
          </Text>
        ) : (
          <TouchableOpacity
            style={styles.voiceMessage}
            onPress={onPlayVoice}
            activeOpacity={0.7}
          >
            <View style={[styles.playButton, isOwn && styles.ownPlayButton]}>
              <IconSymbol
                name={isPlaying ? 'pause.fill' : 'play.fill'}
                size={16}
                color={isOwn ? colors.card : colors.primary}
              />
            </View>
            <View style={styles.waveform}>
              {[...Array(20)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: Math.random() * 20 + 10,
                      backgroundColor: isOwn ? colors.card : colors.primary,
                      opacity: isPlaying && i < 10 ? 1 : 0.5,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.duration, isOwn ? styles.ownText : styles.otherText]}>
              {formatDuration(message.voiceDuration || 0)}
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.footer}>
          <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
            {formatTime(message.timestamp)}
          </Text>
          {isOwn && (
            <IconSymbol
              name={message.isRead ? 'checkmark.circle.fill' : 'checkmark.circle'}
              size={14}
              color={message.isRead ? colors.accent : colors.card}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownText: {
    color: colors.card,
  },
  otherText: {
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  time: {
    fontSize: 11,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTime: {
    color: colors.textSecondary,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownPlayButton: {
    backgroundColor: colors.card,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 30,
  },
  waveBar: {
    width: 2,
    borderRadius: 1,
  },
  duration: {
    fontSize: 12,
    fontWeight: '500',
  },
});
