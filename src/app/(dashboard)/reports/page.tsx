'use client'
import { useState } from 'react'
import { FileText, BarChart2, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts'
import DatePicker from '@/components/DatePicker'
import ExportDropdown from '@/components/ExportDropdown'
import { exportToCsv, exportToXlsx } from '@/lib/exportUtils'

// ─── Mock data ────────────────────────────────────────────────────────────────

const prReportData = [
  { period: 'Jul', submitted: 18, approved: 15, rejected: 2, totalValue: 285 },
  { period: 'Agu', submitted: 15, approved: 13, rejected: 1, totalValue: 198 },
  { period: 'Sep', submitted: 22, approved: 19, rejected: 2, totalValue: 412 },
  { period: 'Okt', submitted: 28, approved: 24, rejected: 3, totalValue: 580 },
  { period: 'Nov', submitted: 24, approved: 21, rejected: 2, totalValue: 490 },
]

const poReportData = [
  { period: 'Jul', sent: 14, received: 12, partial: 1, totalValue: 265 },
  { period: 'Agu', sent: 12, received: 10, partial: 2, totalValue: 185 },
  { period: 'Sep', sent: 19, received: 17, partial: 1, totalValue: 390 },
  { period: 'Okt', sent: 25, received: 22, partial: 2, totalValue: 540 },
  { period: 'Nov', sent: 21, received: 18, partial: 2, totalValue: 460 },
]

const vendorReport = [
  { vendor: 'PT Maju Jaya',       po: 24, value: 485, onTime: 92 },
  { vendor: 'CV Sukses Makmur',   po: 18, value: 320, onTime: 88 },
  { vendor: 'PT Indo Supplies',   po: 15, value: 275, onTime: 95 },
  { vendor: 'UD Berkah Abadi',    po: 12, value: 198, onTime: 83 },
  { vendor: 'PT Global Trade',    po: 10, value: 165, onTime: 90 },
]

const categorySpend = [
  { category: 'Electronics',     value: 420 },
  { category: 'Furniture',       value: 180 },
  { category: 'Office Supplies', value:  95 },
  { category: 'Industrial',      value: 320 },
  { category: 'Safety',          value:  85 },
  { category: 'Vehicles',        value: 450 },
]

// ─── Tooltip ──────────────────────────────────────────────────────────────────

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

// ─── Shortcut periods ─────────────────────────────────────────────────────────

const SHORTCUTS = [
  { label: 'Bulan ini',    from: '2026-11-01', to: '2026-11-30' },
  { label: '3 Bulan',      from: '2026-09-01', to: '2026-11-30' },
  { label: '6 Bulan',      from: '2026-06-01', to: '2026-11-30' },
  { label: 'Tahun ini',    from: '2026-01-01', to: '2026-12-31' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('2026-07-01')
  const [dateTo, setDateTo]     = useState('2026-11-30')
  const [activeReport, setActiveReport] = useState<'pr' | 'po' | 'vendor' | 'spend'>('pr')

  // ── Export helpers ──────────────────────────────────────────────────────────

  function getExportData(): { headers: string[]; rows: unknown[][] } {
    switch (activeReport) {
      case 'pr':
        return {
          headers: ['Periode', 'PR Diajukan', 'PR Disetujui', 'PR Ditolak', 'Approval Rate (%)', 'Total Nilai (Jt Rp)'],
          rows: prReportData.map(r => [
            `${r.period} 2026`, r.submitted, r.approved, r.rejected,
            Math.round(r.approved / r.submitted * 100),
            r.totalValue,
          ]),
        }
      case 'po':
        return {
          headers: ['Periode', 'PO Dikirim', 'PO Diterima', 'PO Sebagian', 'Total Nilai (Jt Rp)'],
          rows: poReportData.map(r => [
            `${r.period} 2026`, r.sent, r.received, r.partial, r.totalValue,
          ]),
        }
      case 'vendor':
        return {
          headers: ['Vendor', 'Total PO', 'Total Nilai (Jt Rp)', 'On-Time (%)', 'Rating'],
          rows: vendorReport.map(v => [
            v.vendor, v.po, v.value, v.onTime, (v.onTime / 20).toFixed(1),
          ]),
        }
      case 'spend':
        return {
          headers: ['Kategori', 'Nilai (Jt Rp)'],
          rows: categorySpend.map(c => [c.category, c.value]),
        }
    }
  }

  const reportName = {
    pr: 'laporan-pr', po: 'laporan-po',
    vendor: 'laporan-vendor', spend: 'laporan-pengeluaran',
  }[activeReport]

  const { headers, rows } = getExportData()

  // ── Export PDF (print current view) ────────────────────────────────────────
  function handleExportPdf() {
    window.print()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan &amp; Analitik</h1>
          <p className="page-desc">Analisis data pengadaan dan realisasi anggaran</p>
        </div>
        <div className="page-actions">
          <ExportDropdown
            label="Export Data"
            onExportCsv={() => exportToCsv(reportName, headers, rows)}
            onExportXlsx={() => exportToXlsx(reportName, headers, rows)}
          />
          <button className="btn btn-primary btn-sm" onClick={handleExportPdf}>
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Period Filter ── */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

          {/* Shortcut buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SHORTCUTS.map(s => {
              const active = dateFrom === s.from && dateTo === s.to
              return (
                <button
                  key={s.label}
                  onClick={() => { setDateFrom(s.from); setDateTo(s.to) }}
                  className={active ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                  style={{ fontSize: 12 }}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          <div style={{ width: 1, height: 28, background: 'var(--border-color)', margin: '0 4px' }} />

          {/* From */}
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Dari</span>
          <div style={{ width: 170 }}>
            <DatePicker
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Tanggal mulai"
              max={dateTo || undefined}
            />
          </div>

          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>s/d</span>

          {/* To */}
          <div style={{ width: 170 }}>
            <DatePicker
              value={dateTo}
              onChange={setDateTo}
              placeholder="Tanggal akhir"
              min={dateFrom || undefined}
            />
          </div>

          {/* Active range label */}
          {dateFrom && dateTo && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Menampilkan: {dateFrom} — {dateTo}
            </span>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {([
          { key: 'pr',     label: 'Laporan PR' },
          { key: 'po',     label: 'Laporan PO' },
          { key: 'vendor', label: 'Per Vendor' },
          { key: 'spend',  label: 'Per Kategori' },
        ] as const).map(t => (
          <button
            key={t.key}
            className={`tab ${activeReport === t.key ? 'active' : ''}`}
            onClick={() => setActiveReport(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════ PR ══════════ */}
      {activeReport === 'pr' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Total PR Diajukan', value: '107', sub: 'Jul–Nov 2026',         color: '#6C63FF' },
              { label: 'PR Disetujui',      value: '92',  sub: '86% approval rate',    color: '#22C55E' },
              { label: 'PR Ditolak',        value: '10',  sub: '9.3% rejection rate',  color: '#EF4444' },
              { label: 'Total Nilai',        value: 'Rp 1,96 M', sub: 'Est. anggaran', color: '#F59E0B' },
            ].map(k => (
              <div key={k.label} className="card" style={{ padding: '16px 18px', borderTop: `3px solid ${k.color}` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{k.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Tren Purchase Request</h3>
                <p className="card-subtitle">Jumlah PR per bulan</p>
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
                <Bar dataKey="approved"  name="Disetujui" fill="#22C55E" radius={[4,4,0,0]} />
                <Bar dataKey="rejected"  name="Ditolak"   fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Detail Laporan per Periode</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{prReportData.length} periode</span>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Periode</th><th>PR Diajukan</th><th>PR Disetujui</th>
                    <th>PR Ditolak</th><th>Approval Rate</th><th>Total Nilai (Jt Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {prReportData.map(row => (
                    <tr key={row.period}>
                      <td style={{ fontWeight: 700 }}>{row.period} 2026</td>
                      <td>{row.submitted}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{row.approved}</td>
                      <td style={{ color: 'var(--danger)',  fontWeight: 600 }}>{row.rejected}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${Math.round(row.approved/row.submitted*100)}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{Math.round(row.approved/row.submitted*100)}%</span>
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

      {/* ══════════ PO ══════════ */}
      {activeReport === 'po' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Total PO Dibuat',  value: '91',       sub: 'Jul–Nov 2026',      color: '#6C63FF' },
              { label: 'PO Diterima',       value: '79',       sub: '86.8% completion',  color: '#22C55E' },
              { label: 'PO Sebagian',       value: '8',        sub: 'Perlu tindak lanjut', color: '#F59E0B' },
              { label: 'Total Nilai',        value: 'Rp 1,84 M', sub: 'Nilai kontrak',   color: '#3B82F6' },
            ].map(k => (
              <div key={k.label} className="card" style={{ padding: '16px 18px', borderTop: `3px solid ${k.color}` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{k.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Tren Purchase Order</h3>
                <p className="card-subtitle">Jumlah PO per bulan</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={poReportData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={16} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="period" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sent"     name="Dikirim"  fill="#6C63FF" radius={[4,4,0,0]} />
                <Bar dataKey="received" name="Diterima" fill="#22C55E" radius={[4,4,0,0]} />
                <Bar dataKey="partial"  name="Sebagian" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Detail Laporan PO per Periode</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{poReportData.length} periode</span>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Periode</th><th>PO Dikirim</th><th>PO Diterima</th>
                    <th>PO Sebagian</th><th>Completion Rate</th><th>Total Nilai (Jt Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {poReportData.map(row => (
                    <tr key={row.period}>
                      <td style={{ fontWeight: 700 }}>{row.period} 2026</td>
                      <td>{row.sent}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{row.received}</td>
                      <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{row.partial}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${Math.round(row.received/row.sent*100)}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{Math.round(row.received/row.sent*100)}%</span>
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

      {/* ══════════ Vendor ══════════ */}
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
                <Bar dataKey="value"  name="Nilai PO (Jt Rp)"        fill="#6C63FF" radius={[4,4,0,0]} />
                <Bar dataKey="onTime" name="Ketepatan Waktu (%)"      fill="#22C55E" radius={[4,4,0,0]} />
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

      {/* ══════════ Spend per Kategori ══════════ */}
      {activeReport === 'spend' && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3 className="card-title">Pengeluaran Per Kategori</h3>
              <p className="card-subtitle">Distribusi nilai pengadaan per kategori barang/jasa</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categorySpend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Nilai (Jt Rp)" fill="#6C63FF" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Rincian Per Kategori</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{categorySpend.length} kategori</span>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr><th>Kategori</th><th>Nilai (Jt Rp)</th><th>Porsi</th></tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = categorySpend.reduce((s, c) => s + c.value, 0)
                    return categorySpend
                      .slice()
                      .sort((a, b) => b.value - a.value)
                      .map(c => (
                        <tr key={c.category}>
                          <td style={{ fontWeight: 600 }}>{c.category}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rp {c.value} Jt</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="progress-bar" style={{ width: 100 }}>
                                <div className="progress-fill" style={{ width: `${Math.round(c.value / total * 100)}%` }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>{Math.round(c.value / total * 100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
