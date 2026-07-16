import { useEffect, useState } from 'react';
import {
  collection, doc, onSnapshot, query, orderBy, where,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { mapLetter } from '@/services/letterService';
import type { Letter } from '@/types';

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'letters'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLetters(snap.docs.map(d => mapLetter(d.id, d.data() as Record<string, unknown>)));
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, []);

  return { letters, loading, error };
}

export function useFavoriteLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'letters'),
      where('isFavorite', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setLetters(snap.docs.map(d => mapLetter(d.id, d.data() as Record<string, unknown>)));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { letters, loading };
}

export function useLetter(id: string | null) {
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, 'letters', id), (snap) => {
      if (snap.exists()) setLetter(mapLetter(snap.id, snap.data() as Record<string, unknown>));
      else setLetter(null);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  return { letter, loading };
}
