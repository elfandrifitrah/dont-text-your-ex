import {
  Timestamp,
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { getFirebaseAuth, getFirestoreDb } from '@/src/lib/firebase';

export const NICKNAME_MAX = 30;
export const COMMENT_MAX = 1000;

export type CommentDoc = {
  id: string;
  uid: string;
  nickname: string;
  text: string;
  createdAt: Date | null;
  hidden?: boolean;
};

export function validateCommentInput(nickname: string, text: string): string | null {
  const nick = nickname.trim().replace(/\s+/g, ' ');
  const body = text.trim();
  if (nick.length < 1 || nick.length > NICKNAME_MAX) {
    return `Nickname must be 1–${NICKNAME_MAX} characters.`;
  }
  if (body.length < 1 || body.length > COMMENT_MAX) {
    return `Comment must be 1–${COMMENT_MAX} characters.`;
  }
  return null;
}

export async function postComment(nickname: string, text: string): Promise<string> {
  const error = validateCommentInput(nickname, text);
  if (error) throw new Error(error);

  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sign in or continue as guest before posting.');
  }

  const nick = nickname.trim().replace(/\s+/g, ' ');
  const body = text.trim();
  const ref = await addDoc(collection(getFirestoreDb(), 'comments'), {
    uid: user.uid,
    nickname: nick,
    text: body,
    createdAt: serverTimestamp(),
    hidden: false,
  });
  return ref.id;
}

export function subscribeComments(
  onData: (comments: CommentDoc[]) => void,
  onError?: (message: string) => void,
): () => void {
  const q = query(
    collection(getFirestoreDb(), 'comments'),
    orderBy('createdAt', 'desc'),
    limit(100),
  );

  return onSnapshot(
    q,
    (snap) => {
      const rows: CommentDoc[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.hidden === true) return;
        const createdAt =
          data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;
        rows.push({
          id: docSnap.id,
          uid: typeof data.uid === 'string' ? data.uid : '',
          nickname:
            typeof data.nickname === 'string' && data.nickname.trim()
              ? data.nickname.trim()
              : 'Anonymous',
          text: typeof data.text === 'string' ? data.text : '',
          createdAt,
          hidden: data.hidden === true,
        });
      });
      onData(rows);
    },
    () => {
      onError?.('Comments could not be loaded. Pull to retry.');
    },
  );
}
