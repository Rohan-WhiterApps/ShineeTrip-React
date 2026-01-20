import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwsybOrtnQ_gilEznM1ov-R3pTkD3rtVI",
  authDomain: "shineetrip-46caf.firebaseapp.com",
  projectId: "shineetrip-46caf",
  storageBucket: "shineetrip-46caf.firebasestorage.app",
  messagingSenderId: "476596177275",
  appId: "1:476596177275:web:cd7a81620917238edd15de",
  measurementId: "G-C1DR9TXZLW"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Authentication instance
export const auth = getAuth(app);
auth.useDeviceLanguage();

// 🔹 Social providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// 🔹 OTP helpers
export { RecaptchaVerifier, signInWithPhoneNumber };

// 🔹 Google Sign-In function
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("✅ Signed in:", user);
  } catch (error) {
    console.error("❌ Error during Google sign-in:", error);
  }
};
