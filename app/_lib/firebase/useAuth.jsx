import { useState, useEffect } from "react";
import { auth } from "./clientApp";
import { onAuthStateChanged as _onAuthStateChanged } from "firebase/auth";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    setLoading(true);
    if (!authState) {
      setAuthUser(null);
    } else {
      setAuthUser(formatAuthUser(authState));
    }
    setLoading(false);
  };

  const onAuthStateChanged = (cb) => {
    return _onAuthStateChanged(auth, cb);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}
