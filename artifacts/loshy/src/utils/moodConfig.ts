import type { Mood } from '@/types';

export interface MoodConfig {
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  darkColor: string;
  darkBgColor: string;
}

export const MOOD_CONFIG: Record<Mood, MoodConfig> = {
  love: {
    emoji: '❤️',
    label: 'Love',
    color: '#E87BAA',
    bgColor: '#FFF0F5',
    darkColor: '#F4A3C0',
    darkBgColor: '#3D1A2A',
  },
  missyou: {
    emoji: '🥺',
    label: 'Miss You',
    color: '#9B7EC8',
    bgColor: '#F5F0FF',
    darkColor: '#B99EDE',
    darkBgColor: '#2A1A3D',
  },
  happy: {
    emoji: '😊',
    label: 'Happy',
    color: '#F4A830',
    bgColor: '#FFF8EC',
    darkColor: '#F9CC7A',
    darkBgColor: '#3D2E0A',
  },
  cute: {
    emoji: '🌸',
    label: 'Cute',
    color: '#F2748E',
    bgColor: '#FFF0F2',
    darkColor: '#F5A0B0',
    darkBgColor: '#3D1520',
  },
  sad: {
    emoji: '😔',
    label: 'Sad',
    color: '#6B9EC8',
    bgColor: '#EFF5FF',
    darkColor: '#90B8DE',
    darkBgColor: '#0F2030',
  },
  sleepy: {
    emoji: '😴',
    label: 'Sleepy',
    color: '#7B9E8A',
    bgColor: '#F0F8F3',
    darkColor: '#9ABDA9',
    darkBgColor: '#1A2D22',
  },
  proud: {
    emoji: '💪',
    label: 'Proud',
    color: '#E88B3A',
    bgColor: '#FFF5EC',
    darkColor: '#F4B070',
    darkBgColor: '#3D1E00',
  },
  celebration: {
    emoji: '🎉',
    label: 'Celebration',
    color: '#D4A017',
    bgColor: '#FFFAEC',
    darkColor: '#E8C850',
    darkBgColor: '#302500',
  },
  thankful: {
    emoji: '🥹',
    label: 'Thankful',
    color: '#6BAACC',
    bgColor: '#EEF8FF',
    darkColor: '#8EC8E8',
    darkBgColor: '#0A2030',
  },
  random: {
    emoji: '✨',
    label: 'Random',
    color: '#E87BAA',
    bgColor: '#FFF9FB',
    darkColor: '#F4A3C0',
    darkBgColor: '#2D1520',
  },
};

export function getMoodConfig(mood: Mood): MoodConfig {
  return MOOD_CONFIG[mood] ?? MOOD_CONFIG.random;
}
