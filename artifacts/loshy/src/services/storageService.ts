import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase/config';

export async function uploadFile(path: string, file: File | Blob): Promise<string> {
  const storageRef = ref(storage, path);
  const snap = await uploadBytes(storageRef, file);
  return getDownloadURL(snap.ref);
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // Ignore not-found errors
  }
}

export async function uploadLetterImage(letterId: string, file: File, index: number): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  return uploadFile(`letters/${letterId}/images/${index}_${Date.now()}.${ext}`, file);
}

export async function uploadVoiceNote(letterId: string, blob: Blob): Promise<string> {
  return uploadFile(`letters/${letterId}/voice_${Date.now()}.webm`, blob);
}

export async function uploadAvatar(role: 'mohammad' | 'loshy', file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  return uploadFile(`avatars/${role}.${ext}`, file);
}
