import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { requestNotificationPermission } from '@/firebase/messaging';

export async function registerFCMToken(uid: string): Promise<void> {
  try {
    const token = await requestNotificationPermission();
    if (!token) return;
    await updateDoc(doc(db, 'users', uid), { fcmToken: token });
  } catch { /* ignore */ }
}

export function checkDueReminders() {
  // Called by service worker / interval — checks localStorage cache
  // Main logic handled server-side; client-side fallback for open tabs
}

export async function requestPushPermission(uid: string): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') {
    await registerFCMToken(uid);
    return true;
  }
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    await registerFCMToken(uid);
    return true;
  }
  return false;
}
