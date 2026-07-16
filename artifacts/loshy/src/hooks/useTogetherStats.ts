import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { AppState } from '@/types';

export function useTogetherStats() {
  const [stats, setStats] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'appState', 'global'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStats({
          togetherSince: d.togetherSince ?? '2025-06-10',
          totalLetters: d.totalLetters ?? 0,
          totalImages: d.totalImages ?? 0,
          totalSongs: d.totalSongs ?? 0,
          totalReminders: d.totalReminders ?? 0,
          lastUpdated: d.lastUpdated instanceof Timestamp ? d.lastUpdated.toDate() : new Date(),
        });
      } else {
        setStats({ togetherSince: '2025-06-10', totalLetters: 0, totalImages: 0, totalSongs: 0, totalReminders: 0, lastUpdated: new Date() });
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { stats, loading };
}
