import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuthStore } from '../store/authStore'
import { Activity, ChevronRight, LogOut, Search } from 'lucide-react'
import NotificationsPanel, { BellButton } from './NotificationsPanel'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  breadcrumb: string
  contextText?: string
}

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/patients',  label: 'Patients' },
]

export default function Navbar({ breadcrumb, contextText }: NavbarProps) {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)

  async function handleSignOut() {
    await signOut(auth)
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 h-[60px] flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.4)]">

      {/* Left — brand + breadcrumb */}
      <div className="flex items-center gap-0">
        <div className="flex items-center gap-2.5 pr-4">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-[15px]">MedAxis</span>
        </div>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <div className="flex items-center gap-1.5 px-4">
          <span className="text-slate-400 text-xs font-medium">Clinic</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-700 text-xs font-semibold">{breadcrumb}</span>
        </div>
        {contextText && (
          <>
            <div className="hidden lg:block w-px h-5 bg-slate-200 mx-1" />
            <div className="hidden lg:flex items-center gap-2 px-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-medium">{contextText}</span>
            </div>
          </>
        )}
      </div>

        {/* Center — nav links */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
            {label}
          </NavLink>
        ))}
      </nav>

        {/* Right — search + bell + user + sign out */}
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all rounded-lg px-3 py-1.5 text-xs text-slate-400 cursor-pointer w-48">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>Search patients, claims, records…</span>
            <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />

        {/* Notifications bell + panel */}
        <div className="relative">
          <BellButton onClick={() => setNotifOpen((v) => !v)} open={notifOpen} />
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />

          <ThemeToggle />

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Physician · Admin</p>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
    </header>
  )
}
