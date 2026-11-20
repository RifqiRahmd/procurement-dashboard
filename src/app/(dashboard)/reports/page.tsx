'use client'
import { useState } from 'react'
import { Download, FileText, BarChart2, TrendingUp, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

const prReportData = [
  { period: 'Jul', submitted: 18, approved: 15, rejected: 2, totalValue: 285 },
  { period: 'Agu', submitted: 15, approved: 13, rejected: 1, totalValue: 198 },
  { period: 'Sep', submitted: 22, approved: 19, rejected: 2, totalValue: 412 },
  { period: 'Okt', submitted: 28, approved: 24, rejected: 3, totalValue: 580 },
  { period: 'Nov', submitted: 24, approved: 21, rejected: 2, totalValue: 490 },
]

const vendorReport = [
  { vendor: 'PT Maju Jaya', po: 24, value: 485, onTime: 92 },
  { vendor: 'CV Sukses Makmur', po: 18, value: 320, onTime: 88 },
  { vendor: 'PT Indo Supplies', po: 15, value: 275, onTime: 95 },
  { vendor: 'UD Berkah Abadi', po: 12, value: 198, onTime: 83 },
  { vendor: 'PT Global Trade', po: 10, value: 165, onTime: 90 },
]

const categorySpend = [
  { category: 'Electronics', value: 420 },
  { category: 'Furniture', value: 180 },
  { category: 'Office Supplies', value: 95 },
  { category: 'Industrial', value: 320 },
  { category: 'Safety', value: 85 },
  { category: 'Vehicles', value: 450 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 12 }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 500 }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('2024-07-01')
  const [dateTo, setDateTo] = useState('2024-11-30')
  const [activeReport, setActiveReport] = useState<'pr' | 'po' | 'vendor' | 'spend'>('pr')

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan & Analitik</h1>
          <p className="page-desc">Analisis data pengadaan dan realisasi anggaran</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" id="export-excel-btn">
            <Download size={14} /> Export Excel
          </button>
          <button className="btn btn-primary btn-sm" id="export-pdf-btn">
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Periode:</span>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 'auto' }} />
          </div>
          <span style={{ color: 'var(--text-muted)' }}>s/d</span>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 'auto' }} />
          </div>
          <button className="btn btn-primary btn-sm">Tampilkan</button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="tabs">
        {[
          { key: 'pr', label: 'Laporan PR' },
          { key: 'po', label: 'Laporan PO' },
          { key: 'vendor', label: 'Per Vendor' },
          { key: 'spend', label: 'Pengeluaran Per Kategori' },
        ].map(t => (
          <button key={t.key} className={`tab ${activeReport === t.key ? 'active' : ''}`} onClick={() => setActiveReport(t.key as any)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeReport === 'pr' && (
        <>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Total PR Diajukan', value: '107', sub: 'Jul–Nov 2024', color: '#6C63FF' },
              { label: 'PR Disetujui', value: '92', sub: '86% approval rate', color: '#22C55E' },
              { label: 'PR Ditolak', value: '10', sub: '9.3% rejection rate', color: '#EF4444' },
              { label: 'Total Nilai', value: 'Rp 1,96 M', sub: 'Est. anggaran', color: '#F59E0B' },
            ].map(k => (
              <div key={k.label} className="card" style={{ padding: '16px 18px', borderTop: `3px solid ${k.color}` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{k.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Tren Purchase Request</h3>
                <p className="card-subtitle">Jumlah PR per bulan (Jul–Nov 2024)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={prReportData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={16} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="period" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="submitted" name="Diajukan" fill="#6C63FF" radius={[4,4,0,0]} />
                <Bar dataKey="approved" name="Disetujui" fill="#22C55E" radius={[4,4,0,0]} />
                <Bar dataKey="rejected" name="Ditolak" fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="card-title">Detail Laporan per Periode</h3>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Periode</th>
                    <th>PR Diajukan</th>
                    <th>PR Disetujui</th>
                    <th>PR Ditolak</th>
                    <th>Approval Rate</th>
                    <th>Total Nilai (Jt Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {prReportData.map(row => (
                    <tr key={row.period}>
                      <td style={{ fontWeight: 700 }}>{row.period} 2024</td>
                      <td>{row.submitted}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{row.approved}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{row.rejected}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${Math.round(row.approved/row.submitted*100)}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {Math.round(row.approved/row.submitted*100)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rp {row.totalValue} Jt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeReport === 'vendor' && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3 className="card-title">Performa Vendor</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={vendorReport} margin={{ top: 5, right: 10, left: -20, bottom: 40 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="vendor" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" name="Nilai PO (Jt Rp)" fill="#6C63FF" radius={[4,4,0,0]} />
                <Bar dataKey="onTime" name="Ketepatan Waktu (%)" fill="#22C55E" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr><th>Vendor</th><th>Total PO</th><th>Total Nilai (Jt)</th><th>On-Time Delivery</th><th>Rating</th></tr>
                </thead>
                <tbody>
                  {vendorReport.map(v => (
                    <tr key={v.vendor}>
                      <td style={{ fontWeight: 600 }}>{v.vendor}</td>
                      <td>{v.po}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rp {v.value} Jt</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${v.onTime}%`, background: v.onTime >= 90 ? 'var(--success)' : 'var(--warning)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{v.onTime}%</span>
                        </div>
                      </td>
                      <td style={{ color: '#F59E0B', fontWeight: 700 }}>★ {(v.onTime / 20).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeReport === 'spend' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pengeluaran Per Kategori</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySpend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="category" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Nilai (Jt Rp)" fill="#6C63FF" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'po' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Laporan Purchase Order</h3>
            <p className="card-subtitle">Statistik PO per periode</p>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon"><BarChart2 size={28} /></div>
            <div className="empty-state-title">Laporan PO</div>
            <div className="empty-state-desc">Pilih filter periode di atas untuk menampilkan laporan PO</div>
          </div>
        </div>
      )}
    </div>
  )
}
