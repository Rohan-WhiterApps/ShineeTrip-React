import {
  auth,
  googleProvider,
  facebookProvider,
} from "./firebase"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  type User,
} from "firebase/auth"

// ✅ Extend window type for TypeScript
declare global {
  interface Window {
    recaptchaVerifier?: import("firebase/auth").RecaptchaVerifier;
  }
}

// ✅ PHONE VALIDATION
export const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 8 && cleaned.length <= 15
}

// ✅ EMAIL VALIDATION
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ✅ Setup Recaptcha properly (browser-safe)
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (typeof window === "undefined") {
    throw new Error("Recaptcha must be initialized in a browser environment.")
  }

  if (!window.recaptchaVerifier) {
    // 🔥 Ensure auth is defined
    if (!auth) throw new Error("Firebase Auth is not initialized")

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, // ✅ Auth instance FIRST (v9+ syntax)
      containerId, // ✅ Element ID SECOND
      {
        size: "invisible",
        callback: (response: string) => {
          console.log("reCAPTCHA verified:", response)
        },
        "expired-callback": () => {
          console.warn("reCAPTCHA expired — resetting")
        },
      }
    )
  }
  return window.recaptchaVerifier
}

// ✅ SEND PHONE OTP
export const sendPhoneOTP = async (
  phoneNumber: string,
  countryCode: string,
  containerId = "recaptcha-container"
) => {
  try {
    const fullPhone = countryCode + phoneNumber.replace(/\D/g, "")
    if (!validatePhoneNumber(phoneNumber, countryCode)) {
      throw new Error("Invalid phone number format")
    }

    const verifier = setupRecaptcha(containerId)
    const confirmation = await signInWithPhoneNumber(auth, fullPhone, verifier)
    return confirmation
  } catch (error) {
    console.error("Error sending OTP:", error)
    throw error
  }
}

// ✅ VERIFY OTP
export const verifyOTP = async (confirmationResult: any, otp: string): Promise<User | null> => {
  try {
    const result = await confirmationResult.confirm(otp)
    return result.user
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

// ✅ GOOGLE LOGIN
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error: any) {
    console.error("Google sign-in error:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    throw error
  }
}

// ✅ FACEBOOK LOGIN
export const signInWithFacebook = async (): Promise<User | null> => {
  const result = await signInWithPopup(auth, facebookProvider)
  return result.user
}
