'use client'
import { useState } from 'react'
import { Plus, Search, Eye, Edit2, Trash2, FileText, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import { formatRp } from '@/lib/format'


const mockPRs = [
  { id: 'PR-2024-089', title: 'Pengadaan ATK Kantor Q4', requester: 'Budi Santoso', department: 'Finance', totalAmount: 15500000, status: 'PENDING', priority: 'NORMAL', createdAt: '2024-11-18', items: 8 },
  { id: 'PR-2024-088', title: 'Pembelian Furniture Ruang Rapat', requester: 'Siti Rahayu', department: 'HRD', totalAmount: 85000000, status: 'APPROVED', priority: 'HIGH', createdAt: '2024-11-17', items: 5 },
  { id: 'PR-2024-087', title: 'Server & Networking Equipment', requester: 'Andi Wijaya', department: 'IT', totalAmount: 320000000, status: 'APPROVED', priority: 'URGENT', createdAt: '2024-11-15', items: 12 },
  { id: 'PR-2024-086', title: 'Seragam Karyawan 2025', requester: 'Maya Sari', department: 'HRD', totalAmount: 48000000, status: 'DRAFT', priority: 'LOW', createdAt: '2024-11-14', items: 3 },
  { id: 'PR-2024-085', title: 'Perlengkapan Safety K3', requester: 'Rudi Hermawan', department: 'Produksi', totalAmount: 32500000, status: 'REJECTED', priority: 'HIGH', createdAt: '2024-11-12', items: 15 },
  { id: 'PR-2024-084', title: 'Peralatan Dapur Kantin', requester: 'Linda Kusuma', department: 'GA', totalAmount: 12000000, status: 'PENDING', priority: 'NORMAL', createdAt: '2024-11-11', items: 7 },
  { id: 'PR-2024-083', title: 'Pembelian Kendaraan Operasional', requester: 'Doni Prakoso', department: 'Logistik', totalAmount: 450000000, status: 'APPROVED', priority: 'URGENT', createdAt: '2024-11-10', items: 2 },
  { id: 'PR-2024-082', title: 'Software Lisensi Microsoft 365', requester: 'Andi Wijaya', department: 'IT', totalAmount: 95000000, status: 'APPROVED', priority: 'NORMAL', createdAt: '2024-11-08', items: 1 },
]

const statusConfig: Record<string, { cls: string; label: string }> = {
  DRAFT:    { cls: 'badge badge-muted badge-dot',   label: 'Draft' },
  PENDING:  { cls: 'badge badge-warning badge-dot', label: 'Pending' },
  APPROVED: { cls: 'badge badge-success badge-dot', label: 'Approved' },
  REJECTED: { cls: 'badge badge-danger badge-dot',  label: 'Rejected' },
  CANCELLED:{ cls: 'badge badge-muted badge-dot',   label: 'Dibatalkan' },
}

const priorityConfig: Record<string, { cls: string; label: string }> = {
  LOW:    { cls: 'badge badge-muted',   label: 'Rendah' },
  NORMAL: { cls: 'badge badge-info',    label: 'Normal' },
  HIGH:   { cls: 'badge badge-warning', label: 'Tinggi' },
  URGENT: { cls: 'badge badge-danger',  label: 'Urgent' },
}



export default function PurchaseRequestPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockPRs.filter(pr => {
    const matchSearch = pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.id.toLowerCase().includes(search.toLowerCase()) ||
      pr.requester.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || pr.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: mockPRs.length,
    draft: mockPRs.filter(p => p.status === 'DRAFT').length,
    pending: mockPRs.filter(p => p.status === 'PENDING').length,
    approved: mockPRs.filter(p => p.status === 'APPROVED').length,
    rejected: mockPRs.filter(p => p.status === 'REJECTED').length,
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Request</h1>
          <p className="page-desc">Kelola permintaan pembelian barang dan jasa</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} id="btn-new-pr">
            <Plus size={15} /> Buat PR Baru
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total', value: stats.total, cls: 'badge-primary', active: 'ALL' },
          { label: 'Draft', value: stats.draft, cls: 'badge-muted', active: 'DRAFT' },
          { label: 'Pending', value: stats.pending, cls: 'badge-warning', active: 'PENDING' },
          { label: 'Approved', value: stats.approved, cls: 'badge-success', active: 'APPROVED' },
          { label: 'Rejected', value: stats.rejected, cls: 'badge-danger', active: 'REJECTED' },
        ].map(s => (
          <div
            key={s.label}
            className="card"
            onClick={() => setStatusFilter(s.active)}
            style={{
              cursor: 'pointer',
              padding: '14px 16px',
              borderColor: statusFilter === s.active ? 'var(--primary)' : 'var(--border-color)',
              background: statusFilter === s.active ? 'var(--primary-bg)' : 'var(--bg-card)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Cari PR, ID, pemohon..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select className="form-control" style={{ width: 'auto' }}>
          <option>Semua Departemen</option>
          <option>Finance</option>
          <option>HRD</option>
          <option>IT</option>
          <option>Produksi</option>
          <option>GA</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>No. PR</th>
                <th>Judul</th>
                <th>Pemohon</th>
                <th>Departemen</th>
                <th>Item</th>
                <th>Total Nilai</th>
                <th>Prioritas</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pr => (
                <tr key={pr.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: 'var(--primary)', fontWeight: 600 }}>
                      {pr.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pr.title}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{pr.requester}</td>
                  <td><span className="badge badge-muted">{pr.department}</span></td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{pr.items}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatRp(pr.totalAmount)}</td>
                  <td><span className={priorityConfig[pr.priority]?.cls}>{priorityConfig[pr.priority]?.label}</span></td>
                  <td><span className={statusConfig[pr.status]?.cls}>{statusConfig[pr.status]?.label}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{pr.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <Link href={`/purchase-request/${pr.id}`} className="btn btn-ghost btn-icon btn-sm" title="Lihat Detail">
                        <Eye size={14} />
                      </Link>
                      {pr.status === 'DRAFT' && (
                        <button className="btn btn-ghost btn-icon btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                      )}
                      {(pr.status === 'DRAFT' || pr.status === 'REJECTED') && (
                        <button className="btn btn-ghost btn-icon btn-sm" title="Hapus" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state">
                      <div className="empty-state-icon"><FileText size={28} /></div>
                      <div className="empty-state-title">Tidak ada data</div>
                      <div className="empty-state-desc">Belum ada Purchase Request yang sesuai filter</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Menampilkan {filtered.length} dari {mockPRs.length} data
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm">‹ Prev</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-secondary btn-sm">Next ›</button>
          </div>
        </div>
      </div>

      {/* Modal Form PR Baru */}
      {showModal && <PRFormModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function PRFormModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState([{ product: '', qty: 1, price: 0 }])

  const addItem = () => setItems(p => [...p, { product: '', qty: 1, price: 0 }])
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i))

  const total = items.reduce((s, it) => s + it.qty * it.price, 0)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-xl">
        <div className="modal-header">
          <h2 className="modal-title">Buat Purchase Request Baru</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Judul PR <span className="form-required">*</span></label>
              <input className="form-control" placeholder="Contoh: Pengadaan ATK Q4 2024" />
            </div>
            <div className="form-group">
              <label className="form-label">Departemen <span className="form-required">*</span></label>
              <select className="form-control">
                <option value="">Pilih Departemen</option>
                <option>Finance</option>
                <option>HRD</option>
                <option>IT</option>
                <option>Produksi</option>
                <option>GA</option>
                <option>Logistik</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioritas</label>
              <select className="form-control">
                <option value="NORMAL">Normal</option>
                <option value="LOW">Rendah</option>
                <option value="HIGH">Tinggi</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Dibutuhkan</label>
              <input type="date" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Deskripsi / Alasan</label>
              <textarea className="form-control" placeholder="Jelaskan kebutuhan dan alasan pengadaan..." />
            </div>
          </div>

          <div className="divider" />

          {/* Items */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Detail Item</h4>
            <button className="btn btn-secondary btn-sm" onClick={addItem}>
              <Plus size={13} /> Tambah Item
            </button>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Produk / Item</th>
                  <th>Qty</th>
                  <th>Satuan</th>
                  <th>Harga Estimasi</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td>
                      <input
                        className="form-control"
                        placeholder="Nama item..."
                        value={item.product}
                        onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, product: e.target.value } : x))}
                        style={{ marginBottom: 0 }}
                      />
                    </td>
                    <td style={{ width: 80 }}>
                      <input
                        type="number"
                        className="form-control"
                        value={item.qty}
                        min={1}
                        onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, qty: +e.target.value } : x))}
                        style={{ marginBottom: 0 }}
                      />
                    </td>
                    <td style={{ width: 100 }}>
                      <select className="form-control" style={{ marginBottom: 0 }}>
                        <option>Pcs</option>
                        <option>Unit</option>
                        <option>Box</option>
                        <option>Rim</option>
                        <option>Kg</option>
                        <option>Liter</option>
                      </select>
                    </td>
                    <td style={{ width: 160 }}>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={item.price || ''}
                        onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, price: +e.target.value } : x))}
                        style={{ marginBottom: 0 }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {formatRp(item.qty * item.price)}
                    </td>
                    <td>
                      {items.length > 1 && (
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeItem(i)} style={{ color: 'var(--danger)' }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <div style={{ background: 'var(--bg-hover)', borderRadius: 10, padding: '12px 20px', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Total Estimasi</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{formatRp(total)}</div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Catatan Tambahan</label>
            <textarea className="form-control" placeholder="Catatan untuk approver..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-secondary">Simpan Draft</button>
          <button className="btn btn-primary">Submit PR</button>
        </div>
      </div>
    </div>
  )
}


