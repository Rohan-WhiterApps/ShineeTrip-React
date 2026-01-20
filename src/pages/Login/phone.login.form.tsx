"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { sendPhoneOTP, validatePhoneNumber, verifyOTP } from "@/Firebase/firebasevalidation"

interface Country {
  name: string
  code: string
  flag: string
  phone: string
}

const countries: Country[] = [
  { name: "India", code: "IN", flag: "🇮🇳", phone: "+91" },
  { name: "United States", code: "US", flag: "🇺🇸", phone: "+1" },
  { name: "United Kingdom", code: "UK", flag: "🇬🇧", phone: "+44" },
  { name: "Canada", code: "CA", flag: "🇨🇦", phone: "+1" },
  { name: "Australia", code: "AU", flag: "🇦🇺", phone: "+61" },
]

type AuthStep = "phone" | "otp"

export function PhoneLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState<AuthStep>("phone")
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [consentChecked, setConsentChecked] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSendOTP = async () => {
    setError("")
    setSuccess("")

    if (!validatePhoneNumber(phone, selectedCountry.phone)) {
      setError("Please enter a valid phone number")
      return
    }

    setLoading(true)
    try {
      const result = await sendPhoneOTP(phone, selectedCountry.phone)
      setConfirmationResult(result)
      setStep("otp")
      setResendTimer(30)
      setSuccess("OTP sent successfully! Check your phone.")
      setTimeout(() => inputRefs[0].current?.focus(), 100)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus()
    }

    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOTP(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleVerifyOTP = async (otpValue?: string) => {
    const otpCode = otpValue || otp.join("")
    setError("")
    setSuccess("")

    if (!otpCode || otpCode.length !== 6) {
      setError("OTP must be 6 digits")
      return
    }

    setLoading(true)
    try {
      const user = await verifyOTP(confirmationResult, otpCode)
      if (user) {
        console.log("user logged data from phone", user)
        setSuccess("Login successful!")
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    setSuccess("")
    handleSendOTP()
  }

  const handleEditPhone = () => {
    setStep("phone")
    setOtp(["", "", "", "", "", ""])
    setError("")
    setSuccess("")
  }

  return (
    <div className="w-full space-y-4">
      <div id="recaptcha-container"></div>

      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Country/Region</label>
            <Select
              value={selectedCountry.code}
              onValueChange={(code) => {
                const country = countries.find((c) => c.code === code)
                if (country) setSelectedCountry(country)
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-full h-12 border-gray-300 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>
                        {country.name} ({country.phone})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone number</label>
            <div className="flex items-center gap-2">
              <span className="px-3 h-12 border border-gray-300 rounded-lg bg-gray-50 flex items-center text-gray-700 font-medium">
                {selectedCountry.phone}
              </span>
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                className="h-12 border-gray-300 text-gray-900 placeholder:text-gray-400 flex-1"
              />
            </div>
          </div>

          <div className="text-xs text-gray-600">
            We'll call or text you to confirm your number. Standard message and data rates apply.{" "}
            <Link to="/privacy-policy" className="underline" onClick={onSuccess}>
              Privacy Policy
            </Link>
          </div>

          <Button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full h-12 text-white font-semibold rounded-lg transition-all disabled:opacity-50 hover:opacity-90"
            style={{
              background: 'linear-gradient(180.95deg, #AB7E29 0.87%, #EFD08D 217.04%)',
              boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Verify OTP</h3>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-gray-600">
                  Enter 6 digit OTP sent to {selectedCountry.phone}-{phone}
                </p>
                <button
                  onClick={handleEditPhone}
                  className="text-blue-600 hover:text-blue-700"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-16 h-16 text-center text-2xl font-semibold border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              ))}
            </div>

            <div className="text-sm text-gray-600">
              Didn't get the OTP?{" "}
              {resendTimer > 0 ? (
                <span>
                  Resend OTP in{" "}
                  <span className="font-medium">
                    00:{resendTimer.toString().padStart(2, "0")}
                  </span>
                </span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  Resend
                </button>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="consent" className="text-xs text-gray-600 cursor-pointer">
                I agree to receive updates & messages such as OTP, booking details on SMS.
              </label>
            </div>

            <Button
              onClick={() => handleVerifyOTP()}
              disabled={loading || !consentChecked}
              className="w-full h-12 text-white font-semibold rounded-lg transition-all disabled:opacity-50 hover:opacity-90"
              style={{
                background: 'linear-gradient(180.95deg, #AB7E29 0.87%, #EFD08D 217.04%)',
                boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}