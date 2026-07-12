import { createContext, PropsWithChildren, useContext } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const initialValue: AuthContextType = {
  isLoggedIn: false,
  isLoading: false,
  signIn: () => { },
  signOut: () => { }
};

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <AuthContext.Provider value={initialValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
