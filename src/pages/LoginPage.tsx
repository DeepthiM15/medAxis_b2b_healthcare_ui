import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuthStore } from '../store/authStore'
import ThemeToggle from '../components/ThemeToggle'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Activity,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react'

// ─── Demo credentials banner ──────────────────────────────────────────────────
const DEMO_EMAIL = 'demo@medaxis.io'
const DEMO_PASSWORD = 'demo1M'

// ─── Illustration side feature pills ─────────────────────────────────────────
const features = [
  {
    icon: Shield,
    label: 'HIPAA Compliant',
    description: 'End-to-end encrypted data',
  },
  {
    icon: Users,
    label: 'Team Collaboration',
    description: 'Shared patient records & notes',
  },
  {
    icon: BarChart3,
    label: 'Real-time Analytics',
    description: 'Actionable clinical insights',
  },
  {
    icon: Activity,
    label: 'Live Monitoring',
    description: 'Patient vitals & alerts',
  },
]

// ─── Validation helpers ───────────────────────────────────────────────────────
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface PasswordStrength {
  minLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
}

function checkPassword(password: string): PasswordStrength {
  return {
    minLength: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }
}

function isPasswordValid(password: string): boolean {
  const r = checkPassword(password)
  return r.minLength && r.hasUpper && r.hasLower && r.hasNumber
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before retrying.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact your administrator.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setLoading } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        setUser(user)
        navigate('/dashboard', { replace: true })
      }
    })
    return unsub
  }, [navigate, setUser, setLoading])

  // Field-level validation
  const emailError =
    touched.email && !validateEmail(email) ? 'Enter a valid email address.' : ''
  const passwordRules = checkPassword(password)
  const passwordValid = isPasswordValid(password)
  const passwordError =
    touched.password && !passwordValid ? 'Password does not meet the requirements below.' : ''

  const isFormValid = validateEmail(email) && passwordValid

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!isFormValid) return

    setIsSubmitting(true)
    setError('')

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(mapFirebaseError(code))
    } finally {
      setIsSubmitting(false)
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setTouched({ email: true, password: true })
    setError('')
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* ── Left illustration panel ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden flex-col justify-between p-12">
        {/* Decorative background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-indigo-500/20 blur-[80px]" />
        <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full bg-cyan-400/10 blur-[60px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            MedAxis
          </span>
          <span className="ml-1 text-[10px] font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
            Enterprise
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center mt-12">
          <div className="mb-8">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Healthcare Platform
            </p>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-5">
              Delivering better
              <br />
              care,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                intelligently.
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              A unified platform for clinical teams to manage patients, analyze
              outcomes, and collaborate across departments — all in real time.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-1 gap-3 max-w-sm">
            {features.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-slate-400 text-xs">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-slate-400 text-xs">
            Trusted by{' '}
            <span className="text-white font-medium">2,400+ clinicians</span>{' '}
            across 18 hospitals
          </p>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-slate-50 dark:bg-slate-950 relative">
        {/* Theme toggle — top right */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            MedAxis
          </span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Sign in to your account
            </h2>
            <p className="text-slate-500 text-sm">
              Enter your credentials to access the platform.
            </p>
          </div>

          {/* Demo credentials banner */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full mb-6 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left hover:bg-blue-100 transition-colors group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-blue-800 text-xs font-semibold">
                Demo account — click to autofill
              </p>
              <p className="text-blue-600 text-xs truncate">
                {DEMO_EMAIL} · {DEMO_PASSWORD}
              </p>
            </div>
            <span className="text-blue-400 text-xs font-medium group-hover:text-blue-600 shrink-0">
              Fill →
            </span>
          </button>

          {/* Global error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    emailError ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 outline-none transition-all
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${
                      emailError
                        ? 'border-red-300 ring-2 ring-red-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    passwordError ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 outline-none transition-all
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${
                      passwordError
                        ? 'border-red-300 ring-2 ring-red-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              )}

              {/* Password requirements checklist */}
              {(touched.password || password.length > 0) && (
                <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {[
                    { label: '6+ characters', met: passwordRules.minLength },
                    { label: '1 uppercase letter', met: passwordRules.hasUpper },
                    { label: '1 lowercase letter', met: passwordRules.hasLower },
                    { label: '1 number', met: passwordRules.hasNumber },
                  ].map(({ label, met }) => (
                    <li key={label} className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full shrink-0 transition-colors ${
                          met ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      >
                        {met && (
                          <svg viewBox="0 0 10 8" className="w-2 h-2 text-white fill-current">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        )}
                      </span>
                      <span className={met ? 'text-emerald-700' : 'text-slate-400'}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all
                ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow-md'
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs text-slate-400">
                Need access?
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Contact your{' '}
            <span className="font-medium text-slate-700">
              system administrator
            </span>{' '}
            to request an account.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-400 space-x-4">
          <span>© 2026 MedAxis Inc.</span>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  )
}
