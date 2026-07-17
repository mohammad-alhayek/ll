import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { todayStr, isYesterday } from "@/utils/dateUtils";
import type { Streak } from "@/types";

const streakRef = () => doc(db, "streak", "current");

export async function getStreak(): Promise<Streak | null> {
  try {
    const snap = await getDoc(streakRef());
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      currentStreak: d.currentStreak ?? 0,
      longestStreak: d.longestStreak ?? 0,
      lastLetterDate: d.lastLetterDate ?? "",
      startDate: d.startDate ?? "",
      updatedAt: d.updatedAt?.toDate() ?? new Date(),
    };
  } catch {
    return null;
  }
}

export async function updateStreakOnNewLetter(): Promise<void> {
  try {
    const today = todayStr();
    const snap = await getDoc(streakRef());

    if (!snap.exists()) {
      await setDoc(streakRef(), {
        currentStreak: 1,
        longestStreak: 1,
        lastLetterDate: today,
        startDate: today,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const data = snap.data();
    const lastDate: string = data.lastLetterDate ?? "";
    const current: number = data.currentStreak ?? 0;
    const longest: number = data.longestStreak ?? 0;

    if (lastDate === today) return; // already written today

    const newStreak = isYesterday(lastDate) ? current + 1 : 1;
    const newLongest = Math.max(longest, newStreak);

    await updateDoc(streakRef(), {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastLetterDate: today,
      startDate: newStreak === 1 ? today : data.startDate,
      updatedAt: serverTimestamp(),
    });
  } catch {
    /* ignore */
  }
}
