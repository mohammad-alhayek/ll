import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Reminder, ReminderRepeat, ReminderReceiver } from '@/types';
import { Timestamp } from 'firebase/firestore';

const remindersCol = () => collection(db, 'reminders');

function toDate(v: unknown): Date {
  if (!v) return new Date();
  if (v instanceof Timestamp) return v.toDate();
  if (v instanceof Date) return v;
  return new Date(v as string);
}

export function mapReminder(id: string, data: Record<string, unknown>): Reminder {
  return {
    id,
    createdBy: data.createdBy as string,
    title: data.title as string,
    description: (data.description as string) ?? '',
    dateTime: toDate(data.dateTime),
    repeat: (data.repeat as ReminderRepeat) ?? 'none',
    receiver: (data.receiver as ReminderReceiver) ?? 'both',
    status: (data.status as 'pending' | 'completed' | 'missed') ?? 'pending',
    notificationSent: Boolean(data.notificationSent),
    createdAt: toDate(data.createdAt),
  };
}

export interface CreateReminderInput {
  createdBy: string;
  title: string;
  description: string;
  dateTime: Date;
  repeat: ReminderRepeat;
  receiver: ReminderReceiver;
}

export async function createReminder(input: CreateReminderInput): Promise<string> {
  const docRef = await addDoc(remindersCol(), {
    createdBy: input.createdBy,
    title: input.title,
    description: input.description,
    dateTime: Timestamp.fromDate(input.dateTime),
    repeat: input.repeat,
    receiver: input.receiver,
    status: 'pending',
    notificationSent: false,
    createdAt: serverTimestamp(),
  });
  try {
    await updateDoc(doc(db, 'appState', 'global'), {
      totalReminders: increment(1),
      lastUpdated: serverTimestamp(),
    });
  } catch { /* ignore */ }
  return docRef.id;
}

export async function updateReminder(id: string, updates: Partial<Reminder>): Promise<void> {
  const ref = doc(db, 'reminders', id);
  const data: Record<string, unknown> = { ...updates };
  if (updates.dateTime instanceof Date) {
    data.dateTime = Timestamp.fromDate(updates.dateTime);
  }
  await updateDoc(ref, data);
}

export async function completeReminder(id: string): Promise<void> {
  await updateDoc(doc(db, 'reminders', id), { status: 'completed' });
}

export async function deleteReminder(id: string): Promise<void> {
  await deleteDoc(doc(db, 'reminders', id));
  try {
    await updateDoc(doc(db, 'appState', 'global'), {
      totalReminders: increment(-1),
      lastUpdated: serverTimestamp(),
    });
  } catch { /* ignore */ }
}
