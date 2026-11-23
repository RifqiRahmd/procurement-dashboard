'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Edit2, Download } from 'lucide-react'

const mockPRDetail = {
  id: 'PR-2026-089',
  title: 'Pengadaan ATK Kantor Q4 2026',
  requester: 'Budi Santoso',
  department: 'Finance',
  priority: 'NORMAL',
  status: 'PENDING',
  neededDate: '2026-12-15',
  createdAt: '2026-11-18 09:30',
  updatedAt: '2026-11-18 11:00',
  description: 'Pengadaan alat tulis kantor untuk kebutuhan operasional departemen Finance selama Kuartal 4 tahun 2026. Barang-barang ini dibutuhkan untuk mendukung pekerjaan sehari-hari.',
  notes: 'Mohon diproses segera sebelum akhir November 2026.',
  totalAmount: 15500000,
  items: [
    { no: 1, product: 'Kertas HVS A4 80gsm', qty: 20, unit: 'Rim', unitPrice: 65000, total: 1300000 },
    { no: 2, product: 'Pulpen Pilot G-1 Hitam', qty: 10, unit: 'Box', unitPrice: 85000, total: 850000 },
    { no: 3, product: 'Tinta Printer HP 680 Black', qty: 5, unit: 'Pcs', unitPrice: 85000, total: 425000 },
    { no: 4, product: 'Map Plastik Folio', qty: 50, unit: 'Pcs', unitPrice: 5000, total: 250000 },
    { no: 5, product: 'Stapler Kenko No. 10', qty: 3, unit: 'Pcs', unitPrice: 35000, total: 105000 },
    { no: 6, product: 'Isi Stapler No. 10', qty: 10, unit: 'Box', unitPrice: 8500, total: 85000 },
    { no: 7, product: 'Spidol Whiteboard', qty: 2, unit: 'Set', unitPrice: 45000, total: 90000 },
    { no: 8, product: 'Sticky Notes 3x3 inch', qty: 20, unit: 'Pak', unitPrice: 12000, total: 240000 },
  ],
  approvals: [
    { level: 1, role: 'Manager Finance', approver: 'Dewi Kartika', status: 'PENDING', comment: null, actionAt: null },
    { level: 2, role: 'General Manager', approver: 'Bapak Santoso', status: 'PENDING', comment: null, actionAt: null },
  ],
}

function formatRp(val: number) { return 'Rp ' + val.toLocaleString('id-ID') }

export default function PRDetailPage() {
  const params = useParams()

  const statusConfig: Record<string, { cls: string; label: string }> = {
    DRAFT: { cls: 'badge badge-muted', label: 'Draft' },
    PENDING: { cls: 'badge badge-warning', label: 'Pending Approval' },
    APPROVED: { cls: 'badge badge-success', label: 'Approved' },
    REJECTED: { cls: 'badge badge-danger', label: 'Rejected' },
  }

  const pr = mockPRDetail

  return (
    <div className="animate-fade-in">
      {/* Back + Actions */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/purchase-request" className="btn btn-ghost btn-icon">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-hover)', padding: '2px 9px', borderRadius: 6, color: 'var(--primary)', fontWeight: 700 }}>
                {pr.id}
              </span>
              <span className={statusConfig[pr.status]?.cls}>{statusConfig[pr.status]?.label}</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 18, marginTop: 4 }}>{pr.title}</h1>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export PDF</button>
          {pr.status === 'DRAFT' && <button className="btn btn-primary btn-sm"><Edit2 size={14} /> Edit</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Info Card */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>Informasi PR</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Pemohon</span>
                <span className="detail-value">{pr.requester}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Departemen</span>
                <span className="detail-value">{pr.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Prioritas</span>
                <span className="detail-value"><span className="badge badge-info">{pr.priority}</span></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tanggal Dibutuhkan</span>
                <span className="detail-value">{pr.neededDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dibuat</span>
                <span className="detail-value">{pr.createdAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Diperbarui</span>
                <span className="detail-value">{pr.updatedAt}</span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Deskripsi</span>
                <span className="detail-value" style={{ lineHeight: 1.7 }}>{pr.description}</span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Catatan</span>
                <span style={{ background: 'var(--bg-hover)', padding: '10px 14px', borderRadius: 8, borderLeft: '3px solid var(--warning)', fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
                  {pr.notes}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">Detail Item ({pr.items.length})</h3>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama Produk / Item</th>
                    <th>Qty</th>
                    <th>Satuan</th>
                    <th>Harga Satuan</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pr.items.map(item => (
                    <tr key={item.no}>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.no}</td>
                      <td style={{ fontWeight: 500 }}>{item.product}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.qty}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{item.unit}</td>
                      <td>{formatRp(item.unitPrice)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatRp(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-primary)' }}>
                    <td colSpan={5} style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>
                      TOTAL ESTIMASI
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: 15, color: 'var(--primary)' }}>
                      {formatRp(pr.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right column — Approval Timeline */}
        <div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 16 }}>Status Approval</h3>
            <div className="timeline">
              {/* Submitted */}
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: 'var(--success-bg)' }}>
                  <FileText size={14} style={{ color: 'var(--success)' }} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">PR Diajukan</div>
                  <div className="timeline-time">{pr.createdAt} · oleh {pr.requester}</div>
                </div>
              </div>

              {pr.approvals.map(apr => (
                <div key={apr.level} className="timeline-item">
                  <div className="timeline-dot" style={{
                    background: apr.status === 'APPROVED' ? 'var(--success-bg)' : apr.status === 'REJECTED' ? 'var(--danger-bg)' : 'var(--bg-hover)',
                  }}>
                    {apr.status === 'APPROVED' ? <CheckCircle size={14} style={{ color: 'var(--success)' }} /> :
                     apr.status === 'REJECTED' ? <XCircle size={14} style={{ color: 'var(--danger)' }} /> :
                     <Clock size={14} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Level {apr.level} — {apr.role}</div>
                    <div className="timeline-time">
                      {apr.approver} ·{' '}
                      <span className={
                        apr.status === 'APPROVED' ? 'text-success' :
                        apr.status === 'REJECTED' ? 'text-danger' : 'text-muted'
                      }>
                        {apr.status === 'PENDING' ? 'Menunggu' : apr.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    </div>
                    {apr.comment && (
                      <div className="timeline-note">{apr.comment}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pr.status === 'PENDING' && (
              <div style={{ marginTop: 20, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Aksi Cepat</div>
                <textarea className="form-control" placeholder="Tambah komentar..." style={{ minHeight: 60, marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger w-full btn-sm"><XCircle size={13} /> Tolak</button>
                  <button className="btn btn-success w-full btn-sm"><CheckCircle size={13} /> Setujui</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="card" style={{ marginTop: 14 }}>
            <h3 className="card-title" style={{ marginBottom: 14 }}>Ringkasan Nilai</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Jumlah Item</span>
                <span style={{ fontWeight: 600 }}>{pr.items.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatRp(pr.totalAmount)}</span>
              </div>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total Estimasi</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{formatRp(pr.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
