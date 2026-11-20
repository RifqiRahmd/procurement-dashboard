'use client'
import { useState } from 'react'
import { Plus, Search, Eye, Edit2, Phone, Mail, MapPin, Star, Trash2, Building2 } from 'lucide-react'

const mockVendors = [
  { id: 'V001', code: 'VND-001', name: 'PT Maju Jaya', category: 'Electronics', email: 'info@majujaya.co.id', phone: '021-55123456', city: 'Jakarta', npwp: '01.234.567.8-091.000', status: true, totalPO: 24, totalAmount: 485000000, rating: 4.8 },
  { id: 'V002', code: 'VND-002', name: 'CV Sukses Makmur', category: 'Office Supplies', email: 'cv.sukses@gmail.com', phone: '022-71234567', city: 'Bandung', npwp: '02.345.678.9-012.000', status: true, totalPO: 18, totalAmount: 320000000, rating: 4.5 },
  { id: 'V003', code: 'VND-003', name: 'PT Indo Supplies', category: 'Industrial', email: 'indo@supplies.id', phone: '031-45678901', city: 'Surabaya', npwp: '03.456.789.0-123.000', status: true, totalPO: 15, totalAmount: 275000000, rating: 4.3 },
  { id: 'V004', code: 'VND-004', name: 'UD Berkah Abadi', category: 'Food & Beverage', email: 'berkah@abadi.com', phone: '0274-567890', city: 'Yogyakarta', npwp: '04.567.890.1-234.000', status: true, totalPO: 12, totalAmount: 198000000, rating: 4.6 },
  { id: 'V005', code: 'VND-005', name: 'PT Global Trade', category: 'Vehicles', email: 'global@trade.co.id', phone: '021-67890123', city: 'Jakarta', npwp: '05.678.901.2-345.000', status: false, totalPO: 10, totalAmount: 165000000, rating: 4.1 },
  { id: 'V006', code: 'VND-006', name: 'CV Cahaya Mas', category: 'Furniture', email: 'cahaya@mas.id', phone: '0361-789012', city: 'Bali', npwp: '06.789.012.3-456.000', status: true, totalPO: 8, totalAmount: 142000000, rating: 4.4 },
]

function formatRp(val: number) { return 'Rp ' + val.toLocaleString('id-ID') }

export default function VendorPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<typeof mockVendors[0] | null>(null)
  const [view, setView] = useState<'grid' | 'table'>('table')

  const filtered = mockVendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manajemen Vendor</h1>
          <p className="page-desc">Kelola data pemasok dan supplier</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)} id="btn-new-vendor">
            <Plus size={15} /> Tambah Vendor
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Vendor', value: mockVendors.length, color: '#6C63FF', bg: 'rgba(108,99,255,0.12)' },
          { label: 'Aktif', value: mockVendors.filter(v => v.status).length, color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
          { label: 'Non-Aktif', value: mockVendors.filter(v => !v.status).length, color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
          { label: 'Kategori', value: new Set(mockVendors.map(v => v.category)).size, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Cari nama, kode, kota..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }}>
          <option>Semua Kategori</option>
          <option>Electronics</option>
          <option>Office Supplies</option>
          <option>Industrial</option>
          <option>Food & Beverage</option>
        </select>
        <select className="form-control" style={{ width: 'auto' }}>
          <option>Semua Status</option>
          <option>Aktif</option>
          <option>Non-Aktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Vendor</th>
                <th>Kategori</th>
                <th>Kota</th>
                <th>Kontak</th>
                <th>Total PO</th>
                <th>Total Nilai</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: 'var(--primary)', fontWeight: 600 }}>
                      {v.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: 'linear-gradient(135deg, var(--primary), #A855F7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{v.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.npwp}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{v.category}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} style={{ color: 'var(--text-muted)' }} /> {v.city}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}><Phone size={11} /> {v.phone}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', marginTop: 2 }}><Mail size={11} /> {v.email}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{v.totalPO}</td>
                  <td style={{ fontWeight: 700 }}>{formatRp(v.totalAmount)}</td>
                  <td>
                    <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 13 }}>
                      ★ {v.rating}
                    </span>
                  </td>
                  <td>
                    <span className={v.status ? 'badge badge-success badge-dot' : 'badge badge-danger badge-dot'}>
                      {v.status ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Detail" onClick={() => setSelectedVendor(v)}>
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Hapus" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Menampilkan {filtered.length} dari {mockVendors.length} vendor</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm">‹ Prev</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-secondary btn-sm">Next ›</button>
          </div>
        </div>
      </div>

      {showModal && <VendorFormModal onClose={() => setShowModal(false)} />}
      {selectedVendor && <VendorDetailModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
    </div>
  )
}

function VendorFormModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">Tambah Vendor Baru</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Nama Vendor <span className="form-required">*</span></label>
              <input className="form-control" placeholder="Nama perusahaan..." />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-control">
                <option value="">Pilih Kategori</option>
                <option>Electronics</option>
                <option>Office Supplies</option>
                <option>Industrial</option>
                <option>Food & Beverage</option>
                <option>Vehicles</option>
                <option>Furniture</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="email@vendor.com" />
            </div>
            <div className="form-group">
              <label className="form-label">No. Telepon</label>
              <input className="form-control" placeholder="021-xxxxxxxx" />
            </div>
            <div className="form-group">
              <label className="form-label">NPWP</label>
              <input className="form-control" placeholder="XX.XXX.XXX.X-XXX.XXX" />
            </div>
            <div className="form-group">
              <label className="form-label">Kota</label>
              <input className="form-control" placeholder="Jakarta" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Alamat Lengkap</label>
              <textarea className="form-control" placeholder="Alamat lengkap vendor..." />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Catatan</label>
              <textarea className="form-control" placeholder="Catatan tambahan..." />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary">Simpan Vendor</button>
        </div>
      </div>
    </div>
  )
}

function VendorDetailModal({ vendor, onClose }: { vendor: typeof mockVendors[0]; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>
              {vendor.name.charAt(0)}
            </div>
            <div>
              <h2 className="modal-title">{vendor.name}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{vendor.code}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Kategori</span><span className="detail-value">{vendor.category}</span></div>
            <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value"><span className={vendor.status ? 'badge badge-success' : 'badge badge-danger'}>{vendor.status ? 'Aktif' : 'Non-Aktif'}</span></span></div>
            <div className="detail-item"><span className="detail-label">Email</span><span className="detail-value">{vendor.email}</span></div>
            <div className="detail-item"><span className="detail-label">Telepon</span><span className="detail-value">{vendor.phone}</span></div>
            <div className="detail-item"><span className="detail-label">Kota</span><span className="detail-value">{vendor.city}</span></div>
            <div className="detail-item"><span className="detail-label">NPWP</span><span className="detail-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{vendor.npwp}</span></div>
          </div>
          <div className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'Total PO', value: vendor.totalPO, suffix: ' transaksi' },
              { label: 'Total Nilai', value: 'Rp ' + (vendor.totalAmount / 1e6).toFixed(0) + ' Jt', suffix: '' },
              { label: 'Rating', value: '★ ' + vendor.rating, suffix: '/5.0' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}{s.suffix}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Tutup</button>
          <button className="btn btn-primary"><Edit2 size={14} /> Edit Vendor</button>
        </div>
      </div>
    </div>
  )
}
