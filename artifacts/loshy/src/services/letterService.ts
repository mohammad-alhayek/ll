import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, Timestamp, increment,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Letter, Mood } from '@/types';
import { uploadLetterImage, uploadVoiceNote, deleteFile } from './storageService';
import { updateStreakOnNewLetter } from './streakService';

const lettersCol = () => collection(db, 'letters');

function toDate(v: unknown): Date {
  if (!v) return new Date();
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  return new Date(v as string);
}

export function mapLetter(id: string, data: Record<string, unknown>): Letter {
  return {
    id,
    authorUid: data.authorUid as string,
    authorRole: data.authorRole as 'mohammad' | 'loshy',
    title: data.title as string,
    body: data.body as string,
    mood: data.mood as Mood,
    language: (data.language as 'en' | 'ar') ?? 'en',
    isRead: Boolean(data.isRead),
    isLiked: Boolean(data.isLiked),
    isFavorite: Boolean(data.isFavorite),
    voiceNoteUrl: (data.voiceNoteUrl as string) ?? null,
    voiceNoteDuration: (data.voiceNoteDuration as number) ?? null,
    spotifyUrl: (data.spotifyUrl as string) ?? null,
    youtubeUrl: (data.youtubeUrl as string) ?? null,
    songTitle: (data.songTitle as string) ?? null,
    images: (data.images as string[]) ?? [],
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export interface CreateLetterInput {
  authorUid: string;
  authorRole: 'mohammad' | 'loshy';
  title: string;
  body: string;
  mood: Mood;
  language: 'en' | 'ar';
  spotifyUrl?: string;
  youtubeUrl?: string;
  songTitle?: string;
  imageFiles?: File[];
  voiceBlob?: Blob;
}

export async function createLetter(input: CreateLetterInput): Promise<string> {
  const docRef = await addDoc(lettersCol(), {
    authorUid: input.authorUid,
    authorRole: input.authorRole,
    title: input.title,
    body: input.body,
    mood: input.mood,
    language: input.language,
    isRead: false,
    isLiked: false,
    isFavorite: false,
    voiceNoteUrl: null,
    voiceNoteDuration: null,
    spotifyUrl: input.spotifyUrl ?? null,
    youtubeUrl: input.youtubeUrl ?? null,
    songTitle: input.songTitle ?? null,
    images: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const updates: Record<string, unknown> = {};

  // Upload images
  if (input.imageFiles?.length) {
    const urls = await Promise.all(
      input.imageFiles.map((f, i) => uploadLetterImage(docRef.id, f, i))
    );
    updates.images = urls;
  }

  // Upload voice note
  if (input.voiceBlob) {
    const voiceUrl = await uploadVoiceNote(docRef.id, input.voiceBlob);
    updates.voiceNoteUrl = voiceUrl;
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  }

  // Update stats
  try {
    await updateDoc(doc(db, 'appState', 'global'), {
      totalLetters: increment(1),
      totalImages: increment((input.imageFiles?.length ?? 0)),
      totalSongs: input.spotifyUrl || input.youtubeUrl ? increment(1) : increment(0),
      lastUpdated: serverTimestamp(),
    });
    await updateStreakOnNewLetter();
  } catch { /* ignore if docs don't exist yet */ }

  return docRef.id;
}

export async function updateLetter(id: string, updates: Partial<Letter>): Promise<void> {
  const ref = doc(db, 'letters', id);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}

export async function deleteLetter(letter: Letter): Promise<void> {
  // Delete media files
  await Promise.allSettled([
    ...letter.images.map(url => deleteFile(url)),
    letter.voiceNoteUrl ? deleteFile(letter.voiceNoteUrl) : Promise.resolve(),
  ]);
  await deleteDoc(doc(db, 'letters', letter.id));
  try {
    await updateDoc(doc(db, 'appState', 'global'), {
      totalLetters: increment(-1),
      totalImages: increment(-(letter.images.length)),
      lastUpdated: serverTimestamp(),
    });
  } catch { /* ignore */ }
}

export async function toggleLike(id: string, isLiked: boolean): Promise<void> {
  await updateDoc(doc(db, 'letters', id), { isLiked, updatedAt: serverTimestamp() });
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  await updateDoc(doc(db, 'letters', id), { isFavorite, updatedAt: serverTimestamp() });
}

export async function markAsRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'letters', id), { isRead: true, updatedAt: serverTimestamp() });
}
