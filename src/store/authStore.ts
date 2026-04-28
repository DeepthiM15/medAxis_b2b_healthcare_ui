import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from 'firebase/auth'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isPatientView: boolean
  notifications: AppNotification[]
  theme: 'light' | 'dark'

  // Auth actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void

  // View toggle
  togglePatientView: () => void

  // Theme
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void

  // Notification actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllRead: () => void
  clearNotifications: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isPatientView: false,
      notifications: [],
      theme: 'light',

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      togglePatientView: () =>
        set((state) => ({ isPatientView: !state.isPatientView })),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      setTheme: (theme) => set({ theme }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: new Date(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'medaxis-auth',
      // Only persist non-sensitive UI state
      partialize: (state) => ({
        isPatientView: state.isPatientView,
        notifications: state.notifications,
        theme: state.theme,
      }),
    }
  )
)
