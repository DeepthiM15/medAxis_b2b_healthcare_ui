import { useEffect, useRef } from 'react'
import { useAuthStore, type AppNotification } from '../store/authStore'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Check,
  Trash2,
  X,
} from 'lucide-react'

// ─── Icon map ─────────────────────────────────────────────────────────────────
const typeConfig: Record<AppNotification['type'], { Icon: React.ElementType; bg: string; iconColor: string }> = {
  success: { Icon: CheckCircle2, bg: 'bg-emerald-50',  iconColor: 'text-emerald-600' },
  warning: { Icon: AlertTriangle, bg: 'bg-amber-50',   iconColor: 'text-amber-600' },
  error:   { Icon: XCircle,      bg: 'bg-rose-50',     iconColor: 'text-rose-600' },
  info:    { Icon: Info,         bg: 'bg-blue-50',     iconColor: 'text-blue-600' },
}

function formatTime(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60)   return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Bell trigger button (exported for use in Navbar) ─────────────────────────
interface BellButtonProps {
  onClick: () => void
  open: boolean
}

export function BellButton({ onClick, open }: BellButtonProps) {
  const notifications = useAuthStore((s) => s.notifications)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <button
      onClick={onClick}
      className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        open ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Bell size={16} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border-2 border-white">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────
interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
}

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const { notifications, markNotificationRead, markAllRead, clearNotifications } = useAuthStore()
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900 text-sm">Notifications</p>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">All caught up</p>
            <p className="text-xs text-slate-400 mt-0.5">No new notifications</p>
          </div>
        ) : (
          notifications.map((n) => {
            const c = typeConfig[n.type]
            const Icon = c.Icon
            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !n.read ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${c.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{formatTime(n.timestamp)}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
