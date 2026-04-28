import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { fireDemoNotification, getDemoPayload, type DemoEvent } from '../lib/notifications'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// ─── Mock data ────────────────────────────────────────────────────────────────
const patientTrend = [
  { day: 'Mon', patients: 38, discharged: 22 },
  { day: 'Tue', patients: 52, discharged: 31 },
  { day: 'Wed', patients: 45, discharged: 28 },
  { day: 'Thu', patients: 61, discharged: 40 },
  { day: 'Fri', patients: 55, discharged: 35 },
  { day: 'Sat', patients: 30, discharged: 18 },
  { day: 'Sun', patients: 22, discharged: 12 },
]

const recentPatients = [
  {
    id: 'P-1042',
    name: 'Sarah Mitchell',
    age: 34,
    condition: 'Hypertension',
    status: 'Active',
    lastVisit: '28 Apr 2026',
    initials: 'SM',
    color: 'bg-violet-500',
  },
  {
    id: 'P-1041',
    name: 'James Okafor',
    age: 57,
    condition: 'Type 2 Diabetes',
    status: 'Critical',
    lastVisit: '27 Apr 2026',
    initials: 'JO',
    color: 'bg-rose-500',
  },
  {
    id: 'P-1040',
    name: 'Priya Nair',
    age: 29,
    condition: 'Asthma',
    status: 'Stable',
    lastVisit: '27 Apr 2026',
    initials: 'PN',
    color: 'bg-emerald-500',
  },
  {
    id: 'P-1039',
    name: 'Carlos Rivera',
    age: 68,
    condition: 'Coronary Artery Disease',
    status: 'Active',
    lastVisit: '26 Apr 2026',
    initials: 'CR',
    color: 'bg-blue-500',
  },
  {
    id: 'P-1038',
    name: 'Mei Tanaka',
    age: 41,
    condition: 'Migraine',
    status: 'Stable',
    lastVisit: '25 Apr 2026',
    initials: 'MT',
    color: 'bg-amber-500',
  },
]

const appointments = [
  { time: '09:00 AM', name: 'Sarah Mitchell', type: 'Follow-up', duration: '30 min', color: 'bg-violet-500' },
  { time: '10:30 AM', name: 'Robert Chen', type: 'New Patient', duration: '60 min', color: 'bg-blue-500' },
  { time: '12:00 PM', name: 'Amara Diallo', type: 'Lab Review', duration: '20 min', color: 'bg-emerald-500' },
  { time: '02:15 PM', name: 'James Okafor', type: 'Cardiology', duration: '45 min', color: 'bg-rose-500' },
  { time: '04:00 PM', name: 'Linda Park', type: 'Routine Check', duration: '30 min', color: 'bg-amber-500' },
]

const timeline = [
  {
    Icon: CheckCircle2,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    text: 'Lab results uploaded for Sarah Mitchell',
    time: '10 min ago',
  },
  {
    Icon: AlertCircle,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    text: 'Pending claim — $1,240 for James Okafor',
    time: '32 min ago',
  },
  {
    Icon: Users,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    text: '3 new patients registered today',
    time: '1 hr ago',
  },
  {
    Icon: Heart,
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    text: 'Vitals alert: Carlos Rivera — BP 160/98',
    time: '2 hr ago',
  },
  {
    Icon: FileText,
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    text: 'Discharge summary sent for P-1035',
    time: '3 hr ago',
  },
]

const departments = [
  { name: 'Cardiology',   patients: 38, satisfaction: 96, utilization: 88, color: '#3b82f6' },
  { name: 'Neurology',    patients: 24, satisfaction: 91, utilization: 74, color: '#8b5cf6' },
  { name: 'Orthopedics',  patients: 31, satisfaction: 94, utilization: 82, color: '#06b6d4' },
  { name: 'Pediatrics',   patients: 19, satisfaction: 98, utilization: 65, color: '#10b981' },
  { name: 'Oncology',     patients: 15, satisfaction: 89, utilization: 71, color: '#f59e0b' },
  { name: 'General',      patients: 45, satisfaction: 93, utilization: 91, color: '#64748b' },
]

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: 'bg-blue-50 text-blue-700 border-blue-100',
    Critical: 'bg-rose-50 text-rose-700 border-rose-100',
    Stable: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] ?? 'bg-slate-100 text-slate-600'}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Critical'
            ? 'bg-rose-500 animate-pulse'
            : status === 'Active'
            ? 'bg-blue-500'
            : 'bg-emerald-500'
        }`}
      />
      {status}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  sub: string
  positive: boolean
  change: string
  Icon: React.ElementType
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, sub, positive, change, Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} size={18} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
        {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {change}
        <span className="text-slate-400 font-normal ml-0.5">vs last week</span>
      </div>
    </div>
  )
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-slate-500">
          <span className="font-medium text-slate-800">{p.value}</span>{' '}
          {p.name === 'patients' ? 'admitted' : 'discharged'}
        </p>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  useNavigate() // keep router context active
  const { addNotification } = useAuthStore()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  async function triggerNotification(event: DemoEvent) {
    const p = getDemoPayload(event)
    const typeMap: Record<DemoEvent, 'success' | 'warning' | 'error' | 'info'> = {
      patient_admitted:     'info',
      claim_approved:       'success',
      claim_rejected:       'error',
      vitals_alert:         'warning',
      lab_ready:            'info',
      appointment_reminder: 'info',
    }
    addNotification({ type: typeMap[event], title: p.title, message: p.body })
    await fireDemoNotification(event)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        breadcrumb="Operations Dashboard"
        contextText={`Today's Overview · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
      />

      {/* ── Main ── */}
      <main className="flex-1 p-6 lg:p-8 max-w-screen-xl mx-auto w-full">

        {/* Welcome row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good morning, Dr. Deepthi</h1>
            <p className="text-slate-500 text-sm mt-0.5">{today} · Here's what's happening at your clinic today.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            <span className="text-blue-300 font-bold text-base leading-none">+</span>
            New Appointment
          </button>
        </div>

        {/* ── Demo notification triggers ── */}
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl px-5 py-4 mb-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="shrink-0">
              <p className="text-xs font-bold text-slate-700">Simulate Notifications</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fires browser + in-app alerts for demo</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { event: 'patient_admitted'    as DemoEvent, label: '+ New Admission',  color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
                  { event: 'claim_approved'       as DemoEvent, label: 'Claim Approved',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                  { event: 'claim_rejected'       as DemoEvent, label: 'Claim Rejected',   color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
                  { event: 'vitals_alert'         as DemoEvent, label: 'Vitals Alert',     color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
                  { event: 'lab_ready'            as DemoEvent, label: 'Lab Results',      color: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100' },
                  { event: 'appointment_reminder' as DemoEvent, label: 'Appointment',      color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' },
                ]
              ).map(({ event, label, color }) => (
                <button
                  key={event}
                  onClick={() => triggerNotification(event)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard
            label="Total Patients"
            value="1,284"
            sub="Registered this year"
            positive
            change="+8.2%"
            Icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            label="Active Cases"
            value="142"
            sub="Currently admitted"
            positive
            change="+12%"
            Icon={Activity}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
          <StatCard
            label="Pending Claims"
            value="9"
            sub="Awaiting insurance"
            positive={false}
            change="-2 claims"
            Icon={FileText}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            label="Patient Satisfaction"
            value="94.2%"
            sub="Based on 318 reviews"
            positive
            change="+2.1%"
            Icon={Heart}
            iconBg="bg-rose-50"
            iconColor="text-rose-500"
          />
        </div>

        {/* ── Two-column body ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* Patient flow chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-slate-900">Patient Flow</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Admissions vs discharges — this week</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Admitted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    Discharged
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={patientTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#gradBlue)"
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="discharged"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    fill="url(#gradGreen)"
                    dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#34d399', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Patients table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900">Recent Patients</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Last 5 patient interactions</p>
                </div>
                <button className="flex items-center gap-0.5 text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors leading-none">
                  View all <ChevronRight className="w-3 h-3 mt-px" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {recentPatients.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <div className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-400">{p.condition} · Age {p.age}</p>
                    </div>
                    <div className="hidden sm:block text-xs text-slate-400 text-right shrink-0">
                      <p className="font-medium text-slate-600">{p.id}</p>
                      <p>{p.lastVisit}</p>
                    </div>
                    <StatusBadge status={p.status} />
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column (1/3) ── */}
          <div className="flex flex-col gap-6">

            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900">Today's Appointments</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{appointments.length} scheduled</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {appointments.map((appt) => (
                  <div key={appt.time} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="text-right shrink-0 w-16">
                      <p className="text-xs font-bold text-slate-700">{appt.time}</p>
                      <p className="text-[10px] text-slate-400">{appt.duration}</p>
                    </div>
                    <div className={`w-1 h-8 rounded-full ${appt.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{appt.name}</p>
                      <p className="text-xs text-slate-400">{appt.type}</p>
                    </div>
                    <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900">Activity</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Recent clinic activity</p>
                </div>
                <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Clear
                </button>
              </div>
              <div className="px-5 py-3 flex flex-col gap-3">
                {timeline.map(({ Icon, bg, iconColor, text, time }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-md ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-3 h-3 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">{text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Department Performance ── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900">Department Performance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Patient load, satisfaction & bed utilization — current month</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              April 2026
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

            {/* Bar chart — patient load */}
            <div className="p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Patient Load by Department</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={departments} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
                          <p className="font-semibold text-slate-700 mb-0.5">{label}</p>
                          <p className="text-slate-500"><span className="font-medium text-slate-800">{payload[0].value}</span> patients</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="patients" radius={[6, 6, 0, 0]}>
                    {departments.map((d) => (
                      <Cell key={d.name} fill={d.color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table — satisfaction + utilization */}
            <div className="p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Satisfaction & Bed Utilization</p>
              <div className="flex flex-col gap-3">
                {departments.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-xs font-medium text-slate-700 w-24 shrink-0">{d.name}</span>

                    {/* Satisfaction */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${d.satisfaction}%`, backgroundColor: d.color, opacity: 0.8 }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 w-8 text-right">{d.satisfaction}%</span>
                    </div>

                    {/* Utilization */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${d.utilization}%`, backgroundColor: d.color, opacity: 0.45 }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 w-8 text-right">{d.utilization}%</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 mt-1 pt-3 border-t border-slate-100">
                  <span className="w-2 h-2 shrink-0" />
                  <span className="text-[10px] text-slate-400 w-24 shrink-0" />
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="w-3 h-1.5 bg-slate-300 rounded-full" />
                    <span className="text-[10px] text-slate-400">Satisfaction</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="w-3 h-1.5 bg-slate-200 rounded-full" />
                    <span className="text-[10px] text-slate-400">Bed utilization</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
