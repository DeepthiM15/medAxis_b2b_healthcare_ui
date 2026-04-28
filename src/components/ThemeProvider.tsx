import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAuthStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <>{children}</>
}
