import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";

export function useStreak() {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const dates = snap.docs
        .map((doc) => {
          const data = doc.data();

          return data.createdAt?.toDate().toISOString().split("T")[0];
        })
        .filter(Boolean);

      if (dates.length === 0) {
        setStreak({
          currentStreak: 0,
          longestStreak: 0,
        });
        return;
      }

      let current = 1;
      let longest = 1;

      for (let i = 1; i < dates.length; i++) {
        const previous = new Date(dates[i - 1]);
        const currentDate = new Date(dates[i]);

        const diff =
          (previous.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          current++;
        } else if (diff > 1) {
          break;
        }

        if (current > longest) {
          longest = current;
        }
      }

      setStreak({
        currentStreak: current,
        longestStreak: longest,
      });
    });

    return unsub;
  }, []);

  return { streak };
}
