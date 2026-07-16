import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ALLOWED_ROLES: Record<string, { role: 'mohammad' | 'loshy'; name: string; initials: string }> = {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Check if user profile exists in Firestore
      try {
        const profileRef = doc(db, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          // User not in our allowed list — sign them out immediately
          await signOut(auth);
          setUser(null);
          setProfile(null);
          setError('Access denied. This app is private.');
          setLoading(false);
          return;
        }

        const data = profileSnap.data() as UserProfile;
        setUser(firebaseUser);
        setProfile(data);
        setError(null);
      } catch {
        await signOut(auth);
        setUser(null);
        setProfile(null);
        setError('Failed to verify access.');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profileRef = doc(db, 'users', cred.user.uid);
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        await signOut(auth);
        throw new Error('Access denied. This app is private.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
