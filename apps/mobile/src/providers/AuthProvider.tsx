import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';

import { getFirebaseAuth, isFirebaseConfigured } from '@/src/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  isAnonymous: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
  isAnonymous: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      isAnonymous: Boolean(user?.isAnonymous),
    }),
    [user, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
