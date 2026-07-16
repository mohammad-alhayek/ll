import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import app from './config';

let messaging: Messaging | null = null;

export function getFirebaseMessaging(): Messaging | null {
  try {
    messaging = getMessaging(app);
    return messaging;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<string | null> {
  const msg = getFirebaseMessaging();
  if (!msg) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    const token = await getToken(msg, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch {
    return null;
  }
}

export function onForegroundMessage(callback: (payload: unknown) => void) {
  const msg = getFirebaseMessaging();
  if (!msg) return () => {};
  return onMessage(msg, callback);
}
