import { useState, useMemo } from 'react'
import {
  LayoutGrid,
  List,
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Calendar,
  Stethoscope,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Search,
} from 'lucide-react'
import Navbar from '../components/Navbar'

// ─── Patient data ─────────────────────────────────────────────────────────────
export interface Patient {
  id: string
  name: string
  initials: string
  color: string
  age: number
  gender: 'M' | 'F'
  condition: string
  insurance: 'Approved' | 'Pending' | 'Rejected' | 'Uninsured'
  admissionDate: string
  doctor: string
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  lastUpdated: string
}

const patients: Patient[] = [
  { id: 'P-1042', name: 'Sarah Mitchell',   initials: 'SM', color: 'bg-violet-500',  age: 34, gender: 'F', condition: 'Hypertension',            insurance: 'Approved',  admissionDate: '22 Apr 2026', doctor: 'Dr. Reyes',    riskLevel: 'Low',      lastUpdated: '2 hrs ago' },
  { id: 'P-1041', name: 'James Okafor',     initials: 'JO', color: 'bg-rose-500',    age: 57, gender: 'M', condition: 'Type 2 Diabetes',          insurance: 'Pending',   admissionDate: '19 Apr 2026', doctor: 'Dr. Nair',     riskLevel: 'High',     lastUpdated: '30 min ago' },
  { id: 'P-1040', name: 'Priya Nair',       initials: 'PN', color: 'bg-emerald-500', age: 29, gender: 'F', condition: 'Asthma',                   insurance: 'Approved',  admissionDate: '20 Apr 2026', doctor: 'Dr. Kapoor',   riskLevel: 'Low',      lastUpdated: '1 hr ago' },
  { id: 'P-1039', name: 'Carlos Rivera',    initials: 'CR', color: 'bg-blue-500',    age: 68, gender: 'M', condition: 'Coronary Artery Disease',  insurance: 'Approved',  admissionDate: '15 Apr 2026', doctor: 'Dr. Chen',     riskLevel: 'Critical', lastUpdated: '15 min ago' },
  { id: 'P-1038', name: 'Mei Tanaka',       initials: 'MT', color: 'bg-amber-500',   age: 41, gender: 'F', condition: 'Migraine',                 insurance: 'Uninsured', admissionDate: '21 Apr 2026', doctor: 'Dr. Patel',    riskLevel: 'Medium',   lastUpdated: '4 hrs ago' },
  { id: 'P-1037', name: 'Robert Chen',      initials: 'RC', color: 'bg-cyan-500',    age: 52, gender: 'M', condition: 'Chronic Kidney Disease',   insurance: 'Approved',  admissionDate: '14 Apr 2026', doctor: 'Dr. Reyes',    riskLevel: 'High',     lastUpdated: '1 hr ago' },
  { id: 'P-1036', name: 'Amara Diallo',     initials: 'AD', color: 'bg-pink-500',    age: 36, gender: 'F', condition: 'Lupus',                    insurance: 'Pending',   admissionDate: '18 Apr 2026', doctor: 'Dr. Williams', riskLevel: 'Medium',   lastUpdated: '3 hrs ago' },
  { id: 'P-1035', name: 'Linda Park',       initials: 'LP', color: 'bg-indigo-500',  age: 63, gender: 'F', condition: 'Osteoporosis',             insurance: 'Approved',  admissionDate: '10 Apr 2026', doctor: 'Dr. Kapoor',   riskLevel: 'Low',      lastUpdated: '6 hrs ago' },
  { id: 'P-1034', name: 'David Osei',       initials: 'DO', color: 'bg-teal-500',    age: 45, gender: 'M', condition: 'Crohn\'s Disease',         insurance: 'Rejected',  admissionDate: '11 Apr 2026', doctor: 'Dr. Nair',     riskLevel: 'High',     lastUpdated: '2 hrs ago' },
  { id: 'P-1033', name: 'Nina Petrov',      initials: 'NP', color: 'bg-orange-500',  age: 27, gender: 'F', condition: 'Anxiety Disorder',         insurance: 'Approved',  admissionDate: '17 Apr 2026', doctor: 'Dr. Patel',    riskLevel: 'Low',      lastUpdated: '5 hrs ago' },
  { id: 'P-1032', name: 'Ahmed Al-Rashid',  initials: 'AA', color: 'bg-lime-600',    age: 71, gender: 'M', condition: 'Parkinson\'s Disease',     insurance: 'Approved',  admissionDate: '8 Apr 2026',  doctor: 'Dr. Chen',     riskLevel: 'Critical', lastUpdated: '20 min ago' },
  { id: 'P-1031', name: 'Fatima Hassan',    initials: 'FH', color: 'bg-fuchsia-500', age: 33, gender: 'F', condition: 'Rheumatoid Arthritis',     insurance: 'Pending',   admissionDate: '16 Apr 2026', doctor: 'Dr. Williams', riskLevel: 'Medium',   lastUpdated: '45 min ago' },
]

// ─── Config maps ──────────────────────────────────────────────────────────────
const riskConfig: Record<Patient['riskLevel'], { label: string; dot: string; badge: string }> = {
  Low:      { label: 'Low',      dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  Medium:   { label: 'Medium',   dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  High:     { label: 'High',     dot: 'bg-orange-500',  badge: 'bg-orange-50 text-orange-700 border-orange-100' },
  Critical: { label: 'Critical', dot: 'bg-rose-500',    badge: 'bg-rose-50 text-rose-700 border-rose-100' },
}

const insuranceConfig: Record<Patient['insurance'], { icon: React.ElementType; badge: string }> = {
  Approved:  { icon: CheckCircle2,   badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  Pending:   { icon: Clock,          badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  Rejected:  { icon: XCircle,        badge: 'bg-rose-50 text-rose-700 border-rose-100' },
  Uninsured: { icon: AlertTriangle,  badge: 'bg-slate-100 text-slate-600 border-slate-200' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: Patient['riskLevel'] }) {
  const c = riskConfig[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${level === 'Critical' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}

function InsuranceBadge({ status }: { status: Patient['insurance'] }) {
  const c = insuranceConfig[status]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.badge}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

// ─── Grid card ────────────────────────────────────────────────────────────────
function PatientCard({ p }: { p: Patient }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {p.initials}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-tight">
              {p.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{p.id} · {p.gender === 'M' ? 'Male' : 'Female'}, {p.age} yrs</p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors mt-0.5 shrink-0" />
      </div>

      {/* Condition */}
      <div className="bg-slate-50 rounded-xl px-3 py-2.5">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">Condition</p>
        <p className="text-sm font-semibold text-slate-800">{p.condition}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <RiskBadge level={p.riskLevel} />
        <InsuranceBadge status={p.insurance} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
        <div className="flex items-start gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 leading-none">Admitted</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{p.admissionDate}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400 leading-none">Doctor</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{p.doctor}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <RefreshCw className="w-3 h-3 text-slate-300" />
        <p className="text-[10px] text-slate-400">Updated {p.lastUpdated}</p>
      </div>
    </div>
  )
}

// ─── List row ─────────────────────────────────────────────────────────────────
function PatientRow({ p }: { p: Patient }) {
  return (
    <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1.1fr_1.1fr_1fr_0.8fr] gap-4 items-center px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-100 last:border-0">
      {/* Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {p.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{p.name}</p>
          <p className="text-[10px] text-slate-400">{p.id}</p>
        </div>
      </div>
      {/* Condition */}
      <p className="text-xs text-slate-600 font-medium truncate">{p.condition}</p>
      {/* Age */}
      <p className="text-xs text-slate-600">{p.age} yrs · {p.gender}</p>
      {/* Insurance */}
      <InsuranceBadge status={p.insurance} />
      {/* Admission */}
      <p className="text-xs text-slate-500">{p.admissionDate}</p>
      {/* Doctor */}
      <p className="text-xs text-slate-600 font-medium truncate">{p.doctor}</p>
      {/* Risk */}
      <RiskBadge level={p.riskLevel} />
      {/* Updated */}
      <p className="text-[10px] text-slate-400 text-right">{p.lastUpdated}</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type ViewMode = 'grid' | 'list'
type RiskFilter = 'All' | Patient['riskLevel']
type InsuranceFilter = 'All' | Patient['insurance']

export default function PatientsPage() {

  const [view, setView] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All')
  const [insuranceFilter, setInsuranceFilter] = useState<InsuranceFilter>('All')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q)
      const matchRisk = riskFilter === 'All' || p.riskLevel === riskFilter
      const matchIns = insuranceFilter === 'All' || p.insurance === insuranceFilter
      return matchSearch && matchRisk && matchIns
    })
  }, [search, riskFilter, insuranceFilter])

  const riskCounts = useMemo(() => {
    const counts: Record<string, number> = { All: patients.length, Low: 0, Medium: 0, High: 0, Critical: 0 }
    patients.forEach((p) => counts[p.riskLevel]++)
    return counts
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar breadcrumb="Patients" contextText={`${patients.length} total patients`} />

      {/* ── Main ── */}
      <main className="flex-1 p-6 lg:p-8 max-w-screen-xl mx-auto w-full">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {filtered.length} of {patients.length} patients
              {(riskFilter !== 'All' || insuranceFilter !== 'All' || search) && (
                <span className="ml-1 text-blue-500 font-medium">· filtered</span>
              )}
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 self-start sm:self-auto">
            <span className="text-blue-300 font-bold text-base leading-none">+</span>
            Add Patient
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, condition, doctor…"
              className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Risk:</span>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              {(['All', 'Low', 'Medium', 'High', 'Critical'] as RiskFilter[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                    riskFilter === r
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {r}
                  {r !== 'All' && (
                    <span className={`ml-1 ${riskFilter === r ? 'text-slate-400' : 'text-slate-300'}`}>
                      {riskCounts[r]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Insurance filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                insuranceFilter !== 'All'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Insurance{insuranceFilter !== 'All' ? `: ${insuranceFilter}` : ''}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showFilters && (
              <div className="absolute top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 min-w-[150px]">
                {(['All', 'Approved', 'Pending', 'Rejected', 'Uninsured'] as InsuranceFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInsuranceFilter(s); setShowFilters(false) }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                      insuranceFilter === s
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setView('grid')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                view === 'grid'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                view === 'list'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>

        {/* ── Risk summary strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {(['Critical', 'High', 'Medium', 'Low'] as Patient['riskLevel'][]).map((level) => {
            const c = riskConfig[level]
            const count = patients.filter((p) => p.riskLevel === level).length
            return (
              <button
                key={level}
                onClick={() => setRiskFilter(riskFilter === level ? 'All' : level)}
                className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 hover:shadow-sm transition-all text-left ${
                  riskFilter === level ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot} ${level === 'Critical' ? 'animate-pulse' : ''}`} />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{level} Risk</p>
                  <p className="text-xl font-bold text-slate-900 leading-tight">{count}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">No patients found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setRiskFilter('All'); setInsuranceFilter('All') }}
              className="mt-4 text-xs text-blue-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Grid view ── */}
        {view === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => <PatientCard key={p.id} p={p} />)}
          </div>
        )}

        {/* ── List view ── */}
        {view === 'list' && filtered.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* List header */}
            <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1.1fr_1.1fr_1fr_0.8fr] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50">
              {['Patient', 'Condition', 'Age / Sex', 'Insurance', 'Admitted', 'Doctor', 'Risk Level', 'Updated'].map((h) => (
                <p key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  {h}
                  {['Patient', 'Admitted'].includes(h) && <Filter className="w-2.5 h-2.5 opacity-50" />}
                </p>
              ))}
            </div>
            {filtered.map((p) => <PatientRow key={p.id} p={p} />)}
          </div>
        )}

      </main>
    </div>
  )
}
