import { createContext, useContext } from "react";
import useFirebaseAuth from "@/app/_lib/firebase/useAuth.jsx";

const authContext = createContext({
  authUser: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
