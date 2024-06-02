import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IAuthService } from './IAuthService';
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthService } from './AuthService';

setPersistence(auth, browserLocalPersistence);

export interface AuthContextType {
  loading: boolean;
  authService: IAuthService;
}

/**
 * Context object for authentication.
 */
const AuthContext = createContext<AuthContextType>({
  loading: true,
  authService: new AuthService()
});

/**
 * Provides authentication context to its children components.
 *
 * @param {React.ReactNode} children - The child components to be wrapped by the AuthProvider.
 * @returns {JSX.Element} The AuthProvider component.
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const authService = useContext(AuthContext);

  const authContextValue: AuthContextType = useMemo(
    () => ({
      loading: loading,
      authService: authService.authService
    }),
    [loading, authService]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return unsubscribe;
  }, [loading]);

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
