import { useMemo } from 'react';
import { useLetters } from './useLetters';
import type { Letter } from '@/types';

export interface Memory {
  letterId: string;
  letterTitle: string;
  authorRole: 'mohammad' | 'loshy';
  imageUrl: string;
  createdAt: Date;
}

export function useMemories() {
  const { letters, loading, error } = useLetters();

  const memories = useMemo<Memory[]>(() => {
    return letters
      .flatMap(letter =>
        letter.images.map(url => ({
          letterId: letter.id,
          letterTitle: letter.title,
          authorRole: letter.authorRole,
          imageUrl: url,
          createdAt: letter.createdAt,
        }))
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [letters]);

  return { memories, loading, error };
}

export function useRandomMemory(letters: Letter[]): Letter | null {
  if (!letters.length) return null;
  const idx = Math.floor(Math.random() * letters.length);
  return letters[idx];
}
