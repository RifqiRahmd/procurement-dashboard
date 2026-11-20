'use client'
import { useState, useEffect } from 'react'
import { Plus, Search, Eye, Download, Receipt, CheckCircle, Clock } from 'lucide-react'
import { formatRp } from '@/lib/format'


const mockInvoices = [
  { id: 'INV-2024-031', poId: 'PO-2024-051', vendor: 'CV Sukses Makmur', invoiceDate: '2024-11-20', dueDate: '2024-12-20', totalAmount: 12500000, paidAmount: 0, status: 'PENDING' },
  { id: 'INV-2024-030', poId: 'PO-2024-050', vendor: 'PT Indo Supplies', invoiceDate: '2024-11-18', dueDate: '2024-12-18', totalAmount: 32500000, paidAmount: 0, status: 'VERIFIED' },
  { id: 'INV-2024-029', poId: 'PO-2024-049', vendor: 'UD Berkah Abadi', invoiceDate: '2024-11-15', dueDate: '2024-12-15', totalAmount: 11000000, paidAmount: 11000000, status: 'PAID' },
  { id: 'INV-2024-028', poId: 'PO-2024-048', vendor: 'PT Global Trade', invoiceDate: '2024-11-12', dueDate: '2024-12-12', totalAmount: 450000000, paidAmount: 450000000, status: 'PAID' },
  { id: 'INV-2024-027', poId: 'PO-2024-047', vendor: 'PT Maju Jaya', invoiceDate: '2024-11-10', dueDate: '2024-12-10', totalAmount: 95000000, paidAmount: 0, status: 'PENDING' },
]

const statusConfig: Record<string, { cls: string; label: string }> = {
  PENDING:   { cls: 'badge badge-warning badge-dot', label: 'Menunggu Verifikasi' },
  VERIFIED:  { cls: 'badge badge-info badge-dot',    label: 'Terverifikasi' },
  PAID:      { cls: 'badge badge-success badge-dot', label: 'Lunas' },
  CANCELLED: { cls: 'badge badge-danger badge-dot',  label: 'Dibatalkan' },
}



export default function InvoicePage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
  }, [])

  const filtered = mockInvoices.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPending  = mockInvoices.filter(i => i.status === 'PENDING').reduce((s, i) => s + i.totalAmount, 0)
  const totalVerified = mockInvoices.filter(i => i.status === 'VERIFIED').reduce((s, i) => s + i.totalAmount, 0)
  const totalPaid     = mockInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.paidAmount, 0)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manajemen Invoice</h1>
          <p className="page-desc">Kelola tagihan dari vendor dan konfirmasi pembayaran</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} id="btn-new-invoice">
            <Plus size={15} /> Input Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Menunggu Verifikasi', value: formatRp(totalPending), count: mockInvoices.filter(i => i.status === 'PENDING').length, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Clock },
          { label: 'Siap Dibayar', value: formatRp(totalVerified), count: mockInvoices.filter(i => i.status === 'VERIFIED').length, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: Receipt },
          { label: 'Total Dibayar (Bulan Ini)', value: formatRp(totalPaid), count: mockInvoices.filter(i => i.status === 'PAID').length, color: '#22C55E', bg: 'rgba(34,197,94,0.12)', icon: CheckCircle },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                  {s.count} invoice · {s.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Cari invoice, vendor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">Semua Status</option>
          <option value="PENDING">Menunggu Verifikasi</option>
          <option value="VERIFIED">Terverifikasi</option>
          <option value="PAID">Lunas</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>No. PO</th>
                <th>Vendor</th>
                <th>Tgl Invoice</th>
                <th>Jatuh Tempo</th>
                <th>Total Tagihan</th>
                <th>Dibayar</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const isOverdue = now !== null && new Date(inv.dueDate) < new Date(now) && inv.status !== 'PAID'
                return (
                  <tr key={inv.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: '#F59E0B', fontWeight: 600 }}>
                        {inv.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{inv.poId}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{inv.vendor}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{inv.invoiceDate}</td>
                    <td>
                      <span style={{ fontSize: 12, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)', fontWeight: isOverdue ? 700 : 400 }}>
                        {isOverdue && '⚠️ '}{inv.dueDate}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatRp(inv.totalAmount)}</td>
                    <td style={{ color: inv.paidAmount > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {formatRp(inv.paidAmount)}
                    </td>
                    <td><span className={statusConfig[inv.status]?.cls}>{statusConfig[inv.status]?.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Detail"><Eye size={14} /></button>
                        {inv.status === 'PENDING' && (
                          <button className="btn btn-success btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>Verifikasi</button>
                        )}
                        {inv.status === 'VERIFIED' && (
                          <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>Bayar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9}><div className="empty-state">
                  <div className="empty-state-icon"><Receipt size={28} /></div>
                  <div className="empty-state-title">Tidak ada invoice</div>
                </div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Menampilkan {filtered.length} dari {mockInvoices.length} invoice</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm">‹ Prev</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-secondary btn-sm">Next ›</button>
          </div>
        </div>
      </div>

      {showModal && <InvoiceFormModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function InvoiceFormModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }])
  const addItem = () => setItems(p => [...p, { desc: '', qty: 1, price: 0 }])
  const total = items.reduce((s, it) => s + it.qty * it.price, 0)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-xl">
        <div className="modal-header">
          <h2 className="modal-title">Input Invoice Baru</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">No. Invoice Vendor <span className="form-required">*</span></label>
              <input className="form-control" placeholder="INV/2024/XXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">Referensi PO <span className="form-required">*</span></label>
              <select className="form-control">
                <option value="">Pilih PO</option>
                <option>PO-2024-052 — PT Maju Jaya</option>
                <option>PO-2024-050 — PT Indo Supplies</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Invoice</label>
              <input type="date" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Jatuh Tempo</label>
              <input type="date" className="form-control" />
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700 }}>Detail Item Invoice</h4>
            <button className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Tambah Item</button>
          </div>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
            <table>
              <thead><tr><th>#</th><th>Deskripsi</th><th>Qty</th><th>Harga Satuan</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td><input className="form-control" placeholder="Nama barang/jasa..." value={item.desc} onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} style={{ marginBottom: 0 }} /></td>
                    <td style={{ width: 80 }}><input type="number" className="form-control" value={item.qty} min={1} onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, qty: +e.target.value } : x))} style={{ marginBottom: 0 }} /></td>
                    <td style={{ width: 160 }}><input type="number" className="form-control" placeholder="0" value={item.price || ''} onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, price: +e.target.value } : x))} style={{ marginBottom: 0 }} /></td>
                    <td style={{ fontWeight: 700 }}>{formatRp(item.qty * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <div style={{ background: 'var(--bg-hover)', borderRadius: 10, padding: '12px 20px', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Total Invoice</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{formatRp(total)}</div>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Catatan</label>
            <textarea className="form-control" placeholder="Catatan pembayaran..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary">Simpan Invoice</button>
        </div>
      </div>
    </div>
  )
}


