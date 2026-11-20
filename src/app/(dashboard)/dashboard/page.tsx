'use client'
import { TrendingUp, TrendingDown, ShoppingCart, FileText, Truck, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const prMonthlyData = [
  { month: 'Jun', pr: 12, po: 8, approved: 10 },
  { month: 'Jul', pr: 18, po: 14, approved: 15 },
  { month: 'Agu', pr: 15, po: 11, approved: 13 },
  { month: 'Sep', pr: 22, po: 17, approved: 19 },
  { month: 'Okt', pr: 28, po: 22, approved: 24 },
  { month: 'Nov', pr: 24, po: 19, approved: 21 },
]

const budgetData = [
  { month: 'Jun', budget: 120, actual: 98 },
  { month: 'Jul', budget: 150, actual: 142 },
  { month: 'Agu', budget: 130, actual: 115 },
  { month: 'Sep', budget: 180, actual: 172 },
  { month: 'Okt', budget: 200, actual: 188 },
  { month: 'Nov', budget: 175, actual: 162 },
]

const statusData = [
  { name: 'Approved', value: 68, color: '#22C55E' },
  { name: 'Pending', value: 20, color: '#F59E0B' },
  { name: 'Draft', value: 8,  color: '#6C63FF' },
  { name: 'Rejected', value: 4, color: '#EF4444' },
]

const topVendors = [
  { name: 'PT Maju Jaya', po: 24, amount: 'Rp 485 Jt', rating: 4.8 },
  { name: 'CV Sukses Makmur', po: 18, amount: 'Rp 320 Jt', rating: 4.5 },
  { name: 'PT Indo Supplies', po: 15, amount: 'Rp 275 Jt', rating: 4.3 },
  { name: 'UD Berkah Abadi', po: 12, amount: 'Rp 198 Jt', rating: 4.6 },
  { name: 'PT Global Trade', po: 10, amount: 'Rp 165 Jt', rating: 4.1 },
]

const recentActivities = [
  { id: 'PR-2024-089', type: 'PR', title: 'Pengadaan ATK Kantor Q4', status: 'PENDING', time: '10 menit lalu', user: 'Budi S.' },
  { id: 'PO-2024-052', type: 'PO', title: 'PO Komputer Server', status: 'SENT', time: '1 jam lalu', user: 'Admin' },
  { id: 'PR-2024-088', type: 'PR', title: 'Pembelian Furniture Ruang Rapat', status: 'APPROVED', time: '2 jam lalu', user: 'Siti R.' },
  { id: 'INV-2024-031', type: 'INV', title: 'Invoice PT Maju Jaya', status: 'VERIFIED', time: '3 jam lalu', user: 'Manager' },
  { id: 'PO-2024-051', type: 'PO', title: 'PO Alat Kebersihan', status: 'RECEIVED', time: '5 jam lalu', user: 'Admin' },
]

const kpiCards = [
  {
    label: 'Total PR Bulan Ini',
    value: '24',
    change: '+12%',
    up: true,
    icon: FileText,
    color: '#6C63FF',
    bg: 'rgba(108,99,255,0.12)',
  },
  {
    label: 'Total PO Aktif',
    value: '19',
    change: '+8%',
    up: true,
    icon: ShoppingCart,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.12)',
  },
  {
    label: 'Total Vendor',
    value: '48',
    change: '+3',
    up: true,
    icon: Truck,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.12)',
  },
  {
    label: 'Budget Terpakai',
    value: 'Rp 1,62 M',
    change: '-5%',
    up: false,
    icon: DollarSign,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
  },
]

function statusBadge(status: string) {
  const map: Record<string, { cls: string; label: string }> = {
    PENDING:  { cls: 'badge badge-warning badge-dot', label: 'Pending' },
    APPROVED: { cls: 'badge badge-success badge-dot', label: 'Approved' },
    REJECTED: { cls: 'badge badge-danger badge-dot',  label: 'Rejected' },
    DRAFT:    { cls: 'badge badge-muted badge-dot',   label: 'Draft' },
    SENT:     { cls: 'badge badge-info badge-dot',    label: 'Dikirim' },
    RECEIVED: { cls: 'badge badge-success badge-dot', label: 'Diterima' },
    VERIFIED: { cls: 'badge badge-primary badge-dot', label: 'Terverifikasi' },
  }
  const s = map[status] || { cls: 'badge badge-muted', label: status }
  return <span className={s.cls}>{s.label}</span>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: 12,
      }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 500 }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  return (
    <div className="animate-fade-in">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((k) => {
          const Icon = k.icon
          return (
            <div className="kpi-card" key={k.label} style={{ ['--kpi-color' as string]: k.color, ['--kpi-bg' as string]: k.bg }}>
              <div className="kpi-icon-wrap">
                <Icon size={20} style={{ color: k.color }} />
              </div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className={`kpi-change ${k.up ? 'up' : 'down'}`}>
                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{k.change} vs bulan lalu</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        {/* Area Chart PR vs PO */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Tren PR & PO</h3>
              <p className="card-subtitle">6 bulan terakhir</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={prMonthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="pr" name="PR" stroke="#6C63FF" strokeWidth={2.5} fill="url(#gradPR)" dot={false} />
              <Area type="monotone" dataKey="po" name="PO" stroke="#22C55E" strokeWidth={2.5} fill="url(#gradPO)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Status PR */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Status PR</h3>
              <p className="card-subtitle">Distribusi bulan ini</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8, justifyContent: 'center' }}>
            {statusData.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>{s.name} <strong style={{ color: 'var(--text-primary)' }}>{s.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        {/* Budget Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Realisasi Anggaran</h3>
              <p className="card-subtitle">Budget vs Aktual (dalam juta Rp)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="budget" name="Budget" fill="#6C63FF" radius={[4, 4, 0, 0]} opacity={0.5} />
              <Bar dataKey="actual" name="Aktual" fill="#6C63FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendors */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Vendor</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topVendors.map((v, i) => (
              <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: i === 0 ? 'var(--primary)' : 'var(--bg-hover)',
                  color: i === 0 ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.po} PO · {v.amount}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', flexShrink: 0 }}>★ {v.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Aktivitas Terbaru</h3>
            <p className="card-subtitle">Transaksi dan perubahan status terkini</p>
          </div>
          <a href="/purchase-request" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>Lihat Semua</a>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID / Dokumen</th>
                <th>Tipe</th>
                <th>Keterangan</th>
                <th>Status</th>
                <th>User</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: 'var(--primary)', fontWeight: 600 }}>
                      {a.id}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      a.type === 'PR' ? 'badge-primary' :
                      a.type === 'PO' ? 'badge-success' : 'badge-warning'
                    }`}>{a.type}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{a.title}</td>
                  <td>{statusBadge(a.status)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.user}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {a.time}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
