
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

export interface PlaybackState {
  isPlaying: boolean;
  duration: number;
  position: number;
}

export const useAudioPlayer = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    duration: 0,
    position: 0,
  });
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async (uri: string) => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      console.log('Loading sound from:', uri);
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  const pauseSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
    } catch (error) {
      console.error('Failed to pause sound:', error);
    }
  };

  const resumeSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Failed to resume sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setPlaybackState({
        isPlaying: false,
        duration: 0,
        position: 0,
      });
    } catch (error) {
      console.error('Failed to stop sound:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackState({
        isPlaying: status.isPlaying,
        duration: status.durationMillis || 0,
        position: status.positionMillis || 0,
      });

      if (status.didJustFinish) {
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: false,
          position: 0,
        }));
      }
    }
  };

  return {
    playbackState,
    playSound,
    pauseSound,
    resumeSound,
    stopSound,
  };
};
