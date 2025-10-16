
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  location?: string;
  age?: number;
  interests?: string[];
  isOnline: boolean;
  lastSeen?: Date;
  isFavorite?: boolean;
}

export interface Contact {
  id: string;
  userId: string;
  user: User;
  addedAt: Date;
  isMutual: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'voice';
  content: string;
  voiceUrl?: string;
  voiceDuration?: number;
  timestamp: Date;
  isRead: boolean;
  isSent: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface VoiceCall {
  id: string;
  callerId: string;
  receiverId: string;
  status: 'calling' | 'ringing' | 'active' | 'ended' | 'missed' | 'declined';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface MatchProfile {
  userId: string;
  user: User;
  matchScore: number;
  commonInterests: string[];
}
