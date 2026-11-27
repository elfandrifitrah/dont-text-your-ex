import { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { getFirestoreDb } from '@/src/lib/firebase';

export type UserProfileFields = {
  displayName?: string;
  currentDay?: number;
};

/** Ensure users/{uid} exists after any successful auth. */
export async function ensureUserProfile(
  user: User,
  fields: UserProfileFields = {},
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: fields.displayName?.slice(0, 40) ?? '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      currentDay: fields.currentDay ?? 1,
    });
    return;
  }

  const patch: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (fields.displayName != null) {
    patch.displayName = fields.displayName.slice(0, 40);
  }
  if (fields.currentDay != null) {
    patch.currentDay = Math.min(30, Math.max(1, fields.currentDay));
  }
  await updateDoc(ref, patch);
}
