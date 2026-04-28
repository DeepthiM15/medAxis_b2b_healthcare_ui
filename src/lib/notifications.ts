let swRegistration: ServiceWorkerRegistration | null = null

export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    swRegistration = await navigator.serviceWorker.register('/sw.js')
  } catch {
    // SW registration is non-critical — fail silently
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

export async function showBrowserNotification(
  title: string,
  body: string,
  tag = 'medaxis'
): Promise<void> {
  const permission = await requestNotificationPermission()
  if (permission !== 'granted') return

  try {
    // Prefer SW notification (works when tab is backgrounded)
    const reg = swRegistration ?? (await navigator.serviceWorker.ready.catch(() => null))
    if (reg) {
      await reg.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag,
        requireInteraction: false,
      })
    } else {
      new Notification(title, { body, icon: '/favicon.svg' })
    }
  } catch {
    // Fallback to basic Notification API
    try { new Notification(title, { body }) } catch { /* no-op */ }
  }
}

export type DemoEvent =
  | 'patient_admitted'
  | 'claim_approved'
  | 'claim_rejected'
  | 'vitals_alert'
  | 'lab_ready'
  | 'appointment_reminder'

const demoPayloads: Record<DemoEvent, { title: string; body: string; tag: string }> = {
  patient_admitted:     { title: 'New Patient Admitted',      body: 'Robert Chen (P-1050) has been admitted to Cardiology.',       tag: 'admission' },
  claim_approved:       { title: 'Insurance Claim Approved',  body: 'Claim #CLM-8821 for Sarah Mitchell — $2,400 approved.',       tag: 'claim' },
  claim_rejected:       { title: 'Insurance Claim Rejected',  body: 'Claim #CLM-8819 for David Osei requires re-submission.',      tag: 'claim' },
  vitals_alert:         { title: '⚠ Vitals Alert',            body: 'Carlos Rivera — BP 168/102. Immediate attention required.',    tag: 'vitals' },
  lab_ready:            { title: 'Lab Results Ready',         body: 'Blood panel results for Priya Nair are now available.',        tag: 'lab' },
  appointment_reminder: { title: 'Upcoming Appointment',      body: 'James Okafor — Cardiology consult at 02:15 PM today.',        tag: 'appointment' },
}

export async function fireDemoNotification(event: DemoEvent): Promise<void> {
  const p = demoPayloads[event]
  await showBrowserNotification(p.title, p.body, p.tag)
}

export function getDemoPayload(event: DemoEvent) {
  return demoPayloads[event]
}
