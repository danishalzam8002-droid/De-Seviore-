
'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mocked admin session since we're using dummy firebase config
    if (typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true") {
      setUser({ email: "danishalzam8002@gmail.com", uid: "admin" } as User);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, [auth]);

  return { user, loading };
}
