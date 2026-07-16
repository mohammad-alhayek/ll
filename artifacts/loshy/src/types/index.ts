export type UserRole = 'mohammad' | 'loshy';

export interface UserProfile {
  uid: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  initials: string;
  fcmToken: string | null;
  language: 'en' | 'ar';
  theme: 'system' | 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  createdAt: Date;
}

export type Mood =
  | 'love'
  | 'missyou'
  | 'happy'
  | 'cute'
  | 'sad'
  | 'sleepy'
  | 'proud'
  | 'celebration'
  | 'thankful'
  | 'random';

export interface Letter {
  id: string;
  authorUid: string;
  authorRole: UserRole;
  title: string;
  body: string;
  mood: Mood;
  language: 'en' | 'ar';
  isRead: boolean;
  isLiked: boolean;
  isFavorite: boolean;
  voiceNoteUrl: string | null;
  voiceNoteDuration: number | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  songTitle: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ReminderRepeat = 'none' | 'daily' | 'weekly' | 'monthly';
export type ReminderStatus = 'pending' | 'completed' | 'missed';
export type ReminderReceiver = 'mohammad' | 'loshy' | 'both';

export interface Reminder {
  id: string;
  createdBy: string;
  title: string;
  description: string;
  dateTime: Date;
  repeat: ReminderRepeat;
  receiver: ReminderReceiver;
  status: ReminderStatus;
  notificationSent: boolean;
  createdAt: Date;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastLetterDate: string;
  startDate: string;
  updatedAt: Date;
}

export interface AppState {
  togetherSince: string;
  totalLetters: number;
  totalImages: number;
  totalSongs: number;
  totalReminders: number;
  lastUpdated: Date;
}

export interface Notification {
  id: string;
  recipientUid: string;
  type: 'new_letter' | 'reminder' | 'streak';
  title: string;
  body: string;
  relatedId: string | null;
  isRead: boolean;
  createdAt: Date;
}
