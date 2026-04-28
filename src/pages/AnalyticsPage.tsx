import { useState } from 'react'
import { useAuthStore as _useAuthStore } from '../store/authStore'
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Users,
  ShieldCheck,
  DollarSign,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ─── Data ─────────────────────────────────────────────────────────────────────

const monthlyGrowth = [
  { month: 'Jul', new: 210, returning: 340, discharged: 180 },
  { month: 'Aug', new: 245, returning: 360, discharged: 210 },
  { month: 'Sep', new: 228, returning: 375, discharged: 195 },
  { month: 'Oct', new: 270, returning: 390, discharged: 240 },
  { month: 'Nov', new: 255, returning: 410, discharged: 225 },
  { month: 'Dec', new: 190, returning: 380, discharged: 170 },
  { month: 'Jan', new: 280, returning: 420, discharged: 255 },
  { month: 'Feb', new: 310, returning: 445, discharged: 280 },
  { month: 'Mar', new: 295, returning: 460, discharged: 265 },
  { month: 'Apr', new: 340, returning: 475, discharged: 305 },
]

const insuranceData = [
  { month: 'Jul', approved: 82, pending: 12, rejected: 6 },
  { month: 'Aug', approved: 78, pending: 14, rejected: 8 },
  { month: 'Sep', approved: 85, pending: 10, rejected: 5 },
  { month: 'Oct', approved: 80, pending: 13, rejected: 7 },
  { month: 'Nov', approved: 88, pending: 9,  rejected: 3 },
  { month: 'Dec', approved: 74, pending: 17, rejected: 9 },
  { month: 'Jan', approved: 86, pending: 10, rejected: 4 },
  { month: 'Feb', approved: 90, pending: 7,  rejected: 3 },
  { month: 'Mar', approved: 87, pending: 9,  rejected: 4 },
  { month: 'Apr', approved: 92, pending: 6,  rejected: 2 },
]

const revenueData = [
  { month: 'Jul', inpatient: 124, outpatient: 68, procedures: 45 },
  { month: 'Aug', inpatient: 138, outpatient: 74, procedures: 52 },
  { month: 'Sep', inpatient: 130, outpatient: 71, procedures: 48 },
  { month: 'Oct', inpatient: 152, outpatient: 82, procedures: 58 },
  { month: 'Nov', inpatient: 145, outpatient: 79, procedures: 55 },
  { month: 'Dec', inpatient: 118, outpatient: 65, procedures: 40 },
  { month: 'Jan', inpatient: 160, outpatient: 88, procedures: 62 },
  { month: 'Feb', inpatient: 174, outpatient: 94, procedures: 68 },
  { month: 'Mar', inpatient: 168, outpatient: 91, procedures: 65 },
  { month: 'Apr', inpatient: 185, outpatient: 102, procedures: 74 },
]

const deptDistribution = [
  { name: 'Cardiology',  value: 22, color: '#3b82f6' },
  { name: 'Neurology',   value: 14, color: '#8b5cf6' },
  { name: 'Orthopedics', value: 18, color: '#06b6d4' },
  { name: 'Pediatrics',  value: 11, color: '#10b981' },
  { name: 'Oncology',    value: 9,  color: '#f59e0b' },
  { name: 'General',     value: 26, color: '#64748b' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type Range = '3M' | '6M' | 'All'

// ─── Shared tooltip ───────────────────────────────────────────────────────────
function ChartTooltipBox({
  active,
  payload,
  label,
  unit = '',
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  unit?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 text-xs min-w-[130px]">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-slate-500 capitalize">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-slate-800">
            {unit}{p.value}{unit === '' ? '' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── KPI strip ────────────────────────────────────────────────────────────────
const kpis = [
  {
    label: 'Total Patients (YTD)',
    value: '3,142',
    change: '+18.4%',
    positive: true,
    Icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Avg Approval Rate',
    value: '84.2%',
    change: '+6.1%',
    positive: true,
    Icon: ShieldCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Total Revenue (YTD)',
    value: '$1.48M',
    change: '+22.7%',
    positive: true,
    Icon: DollarSign,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    label: 'Claim Rejection Rate',
    value: '5.1%',
    change: '-2.3%',
    positive: true,
    Icon: BarChart2,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
]

// ─── Custom Pie label ─────────────────────────────────────────────────────────
function PieLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name,
}: {
  cx: number; cy: number; midAngle: number
  innerRadius: number; outerRadius: number
  percent: number; name: string
}) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (percent < 0.07) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── Range pill selector ──────────────────────────────────────────────────────
function RangePicker({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      {(['3M', '6M', 'All'] as Range[]).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
            value === r
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

function sliceData<T>(data: T[], range: Range): T[] {
  if (range === '3M') return data.slice(-3)
  if (range === '6M') return data.slice(-6)
  return data
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [growthRange, setGrowthRange] = useState<Range>('All')
  const [revenueRange, setRevenueRange] = useState<Range>('All')
  const [insuranceRange, setInsuranceRange] = useState<Range>('All')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar breadcrumb="Analytics" contextText="Live Data" />

      {/* ── Main ── */}
      <main className="flex-1 p-6 lg:p-8 max-w-screen-xl mx-auto w-full">

        {/* Page header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Clinical and operational insights — FY 2025–26
          </p>
        </div>

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {kpis.map(({ label, value, change, positive, Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs font-medium">{label}</p>
                <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
              <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
                {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {change}
                <span className="text-slate-400 font-normal ml-0.5">vs last year</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Row 1: Patient Growth + Insurance ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

          {/* Monthly Patient Growth */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-semibold text-slate-900">Monthly Patient Growth</h2>
                <p className="text-xs text-slate-400 mt-0.5">New admissions, returning & discharged</p>
              </div>
              <RangePicker value={growthRange} onChange={setGrowthRange} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={sliceData(monthlyGrowth, growthRange)}
                margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gReturn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDisch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipBox />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area type="monotone" dataKey="new" name="New" stroke="#3b82f6" strokeWidth={2} fill="url(#gNew)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="returning" name="Returning" stroke="#8b5cf6" strokeWidth={2} fill="url(#gReturn)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="discharged" name="Discharged" stroke="#10b981" strokeWidth={2} fill="url(#gDisch)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Insurance Approval Ratio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-semibold text-slate-900">Insurance Approval Ratio</h2>
                <p className="text-xs text-slate-400 mt-0.5">Approved vs pending vs rejected claims (%)</p>
              </div>
              <RangePicker value={insuranceRange} onChange={setInsuranceRange} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={sliceData(insuranceData, insuranceRange)}
                margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                barSize={22}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<ChartTooltipBox unit="%" />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 2: Revenue Trends + Dept Distribution ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Revenue Trends — spans 2 cols */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-semibold text-slate-900">Revenue Trends</h2>
                <p className="text-xs text-slate-400 mt-0.5">Inpatient, outpatient & procedures revenue (USD $k)</p>
              </div>
              <RangePicker value={revenueRange} onChange={setRevenueRange} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={sliceData(revenueData, revenueRange)}
                margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="k" />
                <Tooltip content={<ChartTooltipBox unit="$" />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="inpatient"
                  name="Inpatient"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="outpatient"
                  name="Outpatient"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="procedures"
                  name="Procedures"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  strokeDasharray="5 3"
                  dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department-wise Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-900">Dept. Patient Distribution</h2>
              <p className="text-xs text-slate-400 mt-0.5">Share of total admissions by department</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deptDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {deptDistribution.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload as { name: string; value: number; color: string }
                      return (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-3 py-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="font-semibold text-slate-700">{d.name}</span>
                          </div>
                          <p className="text-slate-500 mt-1"><span className="font-bold text-slate-800">{d.value}%</span> of admissions</p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {deptDistribution.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[11px] text-slate-600 truncate">{d.name}</span>
                    <span className="ml-auto text-[11px] font-semibold text-slate-800">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
