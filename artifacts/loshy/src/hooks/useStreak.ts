import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Streak } from '@/types';
import { Timestamp } from 'firebase/firestore';

export function useStreak() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'streak', 'current'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStreak({
          currentStreak: d.currentStreak ?? 0,
          longestStreak: d.longestStreak ?? 0,
          lastLetterDate: d.lastLetterDate ?? '',
          startDate: d.startDate ?? '',
          updatedAt: d.updatedAt instanceof Timestamp ? d.updatedAt.toDate() : new Date(),
        });
      } else {
        setStreak({ currentStreak: 0, longestStreak: 0, lastLetterDate: '', startDate: '', updatedAt: new Date() });
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { streak, loading };
}
