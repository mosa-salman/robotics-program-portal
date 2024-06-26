import {
  GoogleAuthProvider,
  UserCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from '../../firebase';
import LoginFormValues from '../components/Login/ILoginFormValues';
import { IAuthService } from './IAuthService';
import firebase from 'firebase/compat/app';

/**
 * Service responsible for handling authentication operations.
 */
export class AuthService implements IAuthService {
  async loginWithEmailAndPassword(creds: LoginFormValues): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, creds.email, creds.password);
  }

  async loginWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    return signOut(auth);
  }

  async generatePasswordResetLink(email: string): Promise<void> {
    const actionCodeSettings = {
      url: import.meta.env.VITE_REACT_APP_PASSWORD_RESET_REDIRECT,
      handleCodeInApp: true
    };

    return sendPasswordResetEmail(auth, email, actionCodeSettings);
  }

  async sendEmailVerification(): Promise<void> {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      return user.sendEmailVerification();
    } else {
      console.error('User is null.');
    }
  }

  isValidEmail(email: string) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  async changeEmail(newEmail: string): Promise<void> {
    const user = firebase.auth().currentUser;
    if (user !== null && this.isValidEmail(newEmail)) {
      user
        .updateEmail(newEmail)
        .then(function () {
          console.log('Email updated successfully.');

          return firebase.auth().updateCurrentUser(user);
        })
        .then(function () {
          console.log('Current user updated successfully.');
        })
        .catch(function (error) {
          console.error('Error updating email or current user:', error);
        });

      user
        .sendEmailVerification()
        .then(function () {
          console.log('Verification email sent.');
        })
        .catch(function (error) {
          console.error('Error sending verification email:', error);
        });
    } else {
      console.error('Email or user is null.');
    }
  }
}
