import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { mapReminder } from '@/services/reminderService';
import type { Reminder } from '@/types';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reminders'), orderBy('dateTime', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setReminders(snap.docs.map(d => mapReminder(d.id, d.data() as Record<string, unknown>)));
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, []);

  return { reminders, loading, error };
}
