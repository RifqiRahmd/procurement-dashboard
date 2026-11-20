'use client'
import { useState } from 'react'
import { Plus, Search, Eye, Edit2, Download, ShoppingCart, FileCheck, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatRp } from '@/lib/format'

const mockPOs = [
  { id: 'PO-2024-052', prId: 'PR-2024-087', vendor: 'PT Maju Jaya', title: 'Komputer Server', totalAmount: 320000000, status: 'SENT', orderDate: '2024-11-16', deliveryDate: '2024-11-30', items: 12 },
  { id: 'PO-2024-051', prId: 'PR-2024-086', vendor: 'CV Sukses Makmur', title: 'Alat Kebersihan', totalAmount: 12500000, status: 'RECEIVED', orderDate: '2024-11-14', deliveryDate: '2024-11-20', items: 6 },
  { id: 'PO-2024-050', prId: 'PR-2024-085', vendor: 'PT Indo Supplies', title: 'Peralatan Safety', totalAmount: 32500000, status: 'DRAFT', orderDate: '2024-11-13', deliveryDate: '2024-11-28', items: 15 },
  { id: 'PO-2024-049', prId: 'PR-2024-084', vendor: 'UD Berkah Abadi', title: 'Perlengkapan Dapur', totalAmount: 11000000, status: 'PARTIAL', orderDate: '2024-11-12', deliveryDate: '2024-11-22', items: 7 },
  { id: 'PO-2024-048', prId: 'PR-2024-083', vendor: 'PT Global Trade', title: 'Kendaraan Operasional', totalAmount: 450000000, status: 'RECEIVED', orderDate: '2024-11-10', deliveryDate: '2024-11-20', items: 2 },
  { id: 'PO-2024-047', prId: 'PR-2024-082', vendor: 'PT Maju Jaya', title: 'Software Lisensi', totalAmount: 95000000, status: 'SENT', orderDate: '2024-11-08', deliveryDate: '2024-11-18', items: 1 },
]

const statusConfig: Record<string, { cls: string; label: string }> = {
  DRAFT:    { cls: 'badge badge-muted badge-dot',   label: 'Draft' },
  SENT:     { cls: 'badge badge-info badge-dot',    label: 'Dikirim' },
  RECEIVED: { cls: 'badge badge-success badge-dot', label: 'Diterima' },
  PARTIAL:  { cls: 'badge badge-warning badge-dot', label: 'Sebagian' },
  CANCELLED:{ cls: 'badge badge-danger badge-dot',  label: 'Dibatalkan' },
}



export default function PurchaseOrderPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockPOs.filter(po => {
    const matchSearch = po.title.toLowerCase().includes(search.toLowerCase()) ||
      po.id.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || po.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: mockPOs.length,
    draft: mockPOs.filter(p => p.status === 'DRAFT').length,
    sent: mockPOs.filter(p => p.status === 'SENT').length,
    received: mockPOs.filter(p => p.status === 'RECEIVED').length,
    partial: mockPOs.filter(p => p.status === 'PARTIAL').length,
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Order</h1>
          <p className="page-desc">Kelola pesanan pembelian ke vendor</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} id="btn-new-po">
            <Plus size={15} /> Buat PO Baru
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total', value: stats.total, active: 'ALL' },
          { label: 'Draft', value: stats.draft, active: 'DRAFT' },
          { label: 'Dikirim', value: stats.sent, active: 'SENT' },
          { label: 'Diterima', value: stats.received, active: 'RECEIVED' },
          { label: 'Sebagian', value: stats.partial, active: 'PARTIAL' },
        ].map(s => (
          <div key={s.label} className="card" onClick={() => setStatusFilter(s.active)} style={{
            cursor: 'pointer', padding: '14px 16px',
            borderColor: statusFilter === s.active ? 'var(--primary)' : 'var(--border-color)',
            background: statusFilter === s.active ? 'var(--primary-bg)' : 'var(--bg-card)',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Cari PO, vendor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Dikirim</option>
          <option value="RECEIVED">Diterima</option>
          <option value="PARTIAL">Sebagian</option>
        </select>
        <select className="form-control" style={{ width: 'auto' }}>
          <option>Semua Vendor</option>
          <option>PT Maju Jaya</option>
          <option>CV Sukses Makmur</option>
          <option>PT Indo Supplies</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>No. PO</th>
                <th>No. PR</th>
                <th>Vendor</th>
                <th>Keterangan</th>
                <th>Item</th>
                <th>Total Nilai</th>
                <th>Tgl Order</th>
                <th>Tgl Kirim</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => (
                <tr key={po.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: '#22C55E', fontWeight: 600 }}>
                      {po.id}
                    </span>
                  </td>
                  <td>
                    <Link href={`/purchase-request/${po.prId}`} style={{ color: 'var(--primary)', fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>
                      {po.prId}
                    </Link>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{po.vendor}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{po.title}</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{po.items}</td>
                  <td style={{ fontWeight: 700 }}>{formatRp(po.totalAmount)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{po.orderDate}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{po.deliveryDate}</td>
                  <td><span className={statusConfig[po.status]?.cls}>{statusConfig[po.status]?.label}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <Link href={`/purchase-order/${po.id}`} className="btn btn-ghost btn-icon btn-sm" title="Detail">
                        <Eye size={14} />
                      </Link>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Download PDF">
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><ShoppingCart size={28} /></div>
                    <div className="empty-state-title">Tidak ada data</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Menampilkan {filtered.length} dari {mockPOs.length} data</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm">‹ Prev</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-secondary btn-sm">Next ›</button>
          </div>
        </div>
      </div>

      {showModal && <POFormModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function POFormModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }])
  const addItem = () => setItems(p => [...p, { desc: '', qty: 1, price: 0 }])
  const total = items.reduce((s, it) => s + it.qty * it.price, 0)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-xl">
        <div className="modal-header">
          <h2 className="modal-title">Buat Purchase Order Baru</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Referensi PR</label>
              <select className="form-control">
                <option value="">Pilih PR (opsional)</option>
                <option>PR-2024-088 — Furniture Ruang Rapat</option>
                <option>PR-2024-087 — Server & Networking</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Vendor <span className="form-required">*</span></label>
              <select className="form-control">
                <option value="">Pilih Vendor</option>
                <option>PT Maju Jaya</option>
                <option>CV Sukses Makmur</option>
                <option>PT Indo Supplies</option>
                <option>UD Berkah Abadi</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Order</label>
              <input type="date" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Pengiriman</label>
              <input type="date" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Syarat Pembayaran</label>
              <select className="form-control">
                <option>Net 30</option>
                <option>Net 14</option>
                <option>Net 60</option>
                <option>COD</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Pengiriman</label>
              <input className="form-control" placeholder="Alamat lengkap..." />
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700 }}>Detail Item</h4>
            <button className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Tambah Item</button>
          </div>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
            <table>
              <thead><tr><th>#</th><th>Deskripsi</th><th>Qty</th><th>Satuan</th><th>Harga</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td><input className="form-control" placeholder="Nama barang..." value={item.desc} onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} style={{ marginBottom: 0 }} /></td>
                    <td style={{ width: 80 }}><input type="number" className="form-control" value={item.qty} min={1} onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, qty: +e.target.value } : x))} style={{ marginBottom: 0 }} /></td>
                    <td style={{ width: 100 }}><select className="form-control" style={{ marginBottom: 0 }}><option>Pcs</option><option>Unit</option><option>Box</option></select></td>
                    <td style={{ width: 160 }}><input type="number" className="form-control" placeholder="0" value={item.price || ''} onChange={e => setItems(p => p.map((x, idx) => idx === i ? { ...x, price: +e.target.value } : x))} style={{ marginBottom: 0 }} /></td>
                    <td style={{ fontWeight: 700 }}>{formatRp(item.qty * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <div style={{ background: 'var(--bg-hover)', borderRadius: 10, padding: '12px 20px', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Total PO</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{formatRp(total)}</div>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Catatan</label>
            <textarea className="form-control" placeholder="Catatan untuk vendor..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-secondary">Simpan Draft</button>
          <button className="btn btn-primary">Kirim PO</button>
        </div>
      </div>
    </div>
  )
}



