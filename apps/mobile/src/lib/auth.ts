import {
  EmailAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  linkWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/src/lib/firebase';
import { ensureUserProfile } from '@/src/lib/users';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertPassword(password: string) {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
}

async function afterAuth(cred: UserCredential, displayName?: string): Promise<User> {
  if (displayName?.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim().slice(0, 40) });
  }
  await ensureUserProfile(cred.user, {
    displayName: displayName?.trim() || cred.user.displayName || '',
  });
  return cred.user;
}

/** Sign up; if already a guest, link email/password onto the anonymous uid. */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  assertPassword(password);
  const auth = getFirebaseAuth();
  const normalized = normalizeEmail(email);
  const current = auth.currentUser;

  if (current?.isAnonymous) {
    const credential = EmailAuthProvider.credential(normalized, password);
    try {
      const linked = await linkWithCredential(current, credential);
      return afterAuth(linked, displayName);
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      if (code === 'auth/email-already-in-use' || code === 'auth/credential-already-in-use') {
        throw new Error(
          'That email is already registered. Sign in instead — guest data stays local until we add merge.',
        );
      }
      throw err;
    }
  }

  const cred = await createUserWithEmailAndPassword(auth, normalized, password);
  return afterAuth(cred, displayName);
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(
    auth,
    normalizeEmail(email),
    password,
  );
  return afterAuth(cred);
}

export async function continueAsGuest(): Promise<User> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await ensureUserProfile(auth.currentUser);
    return auth.currentUser;
  }
  const cred = await signInAnonymously(auth);
  return afterAuth(cred);
}

/** Link email/password to the current anonymous session (upgrade). */
export async function upgradeGuestWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  assertPassword(password);
  const auth = getFirebaseAuth();
  const current = auth.currentUser;
  if (!current) {
    throw new Error('No session to upgrade. Continue as guest first.');
  }
  if (!current.isAnonymous) {
    throw new Error('Already signed in with a full account.');
  }
  const credential = EmailAuthProvider.credential(normalizeEmail(email), password);
  const linked = await linkWithCredential(current, credential);
  return afterAuth(linked, displayName);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, normalizeEmail(email));
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export function authErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Something went wrong. Try again.';
  const code = 'code' in err ? String((err as { code: string }).code) : '';
  const message = 'message' in err ? String((err as { message: string }).message) : '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'That email is already registered. Sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak — use at least 8 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled yet in Firebase Console.';
    default:
      return message || 'Something went wrong. Try again.';
  }
}
