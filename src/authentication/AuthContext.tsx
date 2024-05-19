import React, { useContext, useEffect, useMemo, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import LoginFormValues from "./ILoginFormValues";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";
import PageLoading from "../components/PageLoading";

export interface IAuth {
    user: User | null;  //type User comes from firebase
    loading: boolean;
    loginWithEmailAndPassword: (creds: LoginFormValues, onSuccess : () => void, onFailure : (reason: string) => void) => Promise<void>;

    loginWithGoogle: (onSuccess: () => void, onFailure: (reason: string) => void) => Promise<void>;
    logout: (onFailure: (reason: string) => void) => Promise<void>;
}

export const AuthContext = React.createContext<IAuth>({
    user: auth.currentUser,
    loading: false,
    loginWithEmailAndPassword: async (_creds: LoginFormValues, _onSuccess: () => void, _onFailure: (reason: string) => void): Promise<void> => {},
    loginWithGoogle: async (_onSuccess: () => void, _onFailure: (reason: string) => void): Promise<void> => {},
    logout: async (_onFailure: (reason: string) => void) => { },
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    //Sign in
    const loginWithEmailAndPassword = async (creds: LoginFormValues, onSuccess: () => void, onFailure: (reason: string) => void) => {
        setIsLoading(true);
        AuthService.login(creds)
            .then(userCredential => {
                const { user } = userCredential;
                if (user) {
                    setCurrentUser(user);
                    onSuccess();
                }
                else {
                    setIsLoading(false);
                    onFailure("כניסה נכשלה, נסה שוב.");
                }
            }).catch(error => {
                if (error.code === 'auth/wrong-password') {
                    onFailure("סיסמה או מייל שגויים.");

                } else if (error.code === 'auth/too-many-requests') {
                    onFailure("ניסיונות כניסה רבים מדי, נסה שוב מאוחר יותר.");
                }
                else {
                    onFailure("כניסה נכשלה, נסה שוב.");
                }
                setIsLoading(false);
                
            });
    }

  const loginWithGoogle = async (onSuccess: () => void, onFailure: (reason: string) => void) => {
    AuthService.loginWithGoogle()
      .then(creds => {
        const { user } = creds;
        if (user) {
          setCurrentUser(user);
          onSuccess();
        } else {
            onFailure("כניסה נכשלה, נסה שוב.");
        }
      })
      .catch(error => {
            onFailure("כניסה נכשלה, נסה שוב.\n" + error.message);
      });
  };

    //Sign out
    const logout = async (onFailure: (reason: string) => void) => {
        setIsLoading(true);
        try {
            await AuthService.logout();
            setCurrentUser(null);
            navigate('/login', { replace: true });
        } catch (error) {
            setIsLoading(false);
            onFailure("התנתקות נכשלה, נסה שוב");   
        }
    };

    const authValues: IAuth = useMemo(
        () => ({
            user: currentUser,
            loading: isLoading,
            loginWithEmailAndPassword: loginWithEmailAndPassword,
            loginWithGoogle: loginWithGoogle,
            logout: logout
        }),
        [currentUser, isLoading, loginWithEmailAndPassword, loginWithGoogle, logout]
    );

    useEffect(() => {
        //onAuthStateChanged check if the user is still logged in or not
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setIsAuthLoading(false);
        });
        return unsubscribe;
    }, []);

    //If loading for the first time when visiting the page
    if (isAuthLoading) return <PageLoading />;

    return (
        <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;