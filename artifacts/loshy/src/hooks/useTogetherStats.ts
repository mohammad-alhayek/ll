import { useEffect, useState } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export function useTogetherStats() {
  const [stats, setStats] = useState({
    totalLetters: 0,
    totalImages: 0,
    totalSongs: 0,
    totalReminders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "appState", "global"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        setStats({
          totalLetters: data.totalLetters ?? 0,
          totalImages: data.totalImages ?? 0,
          totalSongs: data.totalSongs ?? 0,
          totalReminders: data.totalReminders ?? 0,
        });
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { stats, loading };
}
