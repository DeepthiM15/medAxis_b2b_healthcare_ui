import { Sun, Moon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAuthStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
        isDark
          ? 'bg-slate-700 text-amber-400 hover:bg-slate-600'
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {isDark
        ? <Sun size={15} className="transition-transform rotate-0" />
        : <Moon size={15} className="transition-transform" />
      }
    </button>
  )
}
