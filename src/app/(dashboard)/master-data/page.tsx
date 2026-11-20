'use client'
import { useState } from 'react'
import { Plus, Search, Eye, Edit2, Trash2, Package } from 'lucide-react'

const mockProducts = [
  { id: 'P001', code: 'PRD-001', name: 'Kertas HVS A4 80gsm', category: 'Office Supplies', unit: 'Rim', price: 65000, stock: 150, status: true },
  { id: 'P002', code: 'PRD-002', name: 'Pulpen Pilot G-1 Hitam', category: 'Office Supplies', unit: 'Pcs', price: 8500, stock: 480, status: true },
  { id: 'P003', code: 'PRD-003', name: 'Laptop Lenovo ThinkPad E14', category: 'Electronics', unit: 'Unit', price: 12500000, stock: 10, status: true },
  { id: 'P004', code: 'PRD-004', name: 'Kursi Ergonomis Tipe-A', category: 'Furniture', unit: 'Unit', price: 2800000, stock: 20, status: true },
  { id: 'P005', code: 'PRD-005', name: 'Helm Safety SNI', category: 'Safety', unit: 'Pcs', price: 185000, stock: 100, status: true },
  { id: 'P006', code: 'PRD-006', name: 'Toner Printer HP LaserJet', category: 'Office Supplies', unit: 'Unit', price: 350000, stock: 30, status: false },
  { id: 'P007', code: 'PRD-007', name: 'Meja Kerja 120x70cm', category: 'Furniture', unit: 'Unit', price: 1500000, stock: 15, status: true },
  { id: 'P008', code: 'PRD-008', name: 'Genset 5000 Watt', category: 'Industrial', unit: 'Unit', price: 18500000, stock: 5, status: true },
]

function formatRp(val: number) { return 'Rp ' + val.toLocaleString('id-ID') }

export default function MasterDataPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<typeof mockProducts[0] | null>(null)

  const categories = ['ALL', ...Array.from(new Set(mockProducts.map(p => p.category)))]

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'ALL' || p.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Master Data Produk</h1>
          <p className="page-desc">Kelola katalog produk dan barang</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)} id="btn-new-product">
            <Plus size={15} /> Tambah Produk
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Produk', value: mockProducts.length },
          { label: 'Aktif', value: mockProducts.filter(p => p.status).length },
          { label: 'Non-Aktif', value: mockProducts.filter(p => !p.status).length },
          { label: 'Kategori', value: categories.length - 1 },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Cari produk, kode..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tabs" style={{ margin: 0, border: 'none' }}>
          {categories.map(cat => (
            <button key={cat} className={`tab ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)} style={{ padding: '6px 14px', fontSize: 12 }}>
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Harga Estimasi</th>
                <th>Stok</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: 'var(--primary)', fontWeight: 600 }}>
                      {p.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={15} style={{ color: 'var(--primary)' }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{p.category}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.unit}</td>
                  <td style={{ fontWeight: 700 }}>{formatRp(p.price)}</td>
                  <td>
                    <span style={{ color: p.stock < 20 ? 'var(--warning)' : 'var(--text-primary)', fontWeight: 600 }}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td><span className={p.status ? 'badge badge-success badge-dot' : 'badge badge-danger badge-dot'}>{p.status ? 'Aktif' : 'Non-Aktif'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditProduct(p)}><Edit2 size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Hapus" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="empty-state">
                  <div className="empty-state-icon"><Package size={28} /></div>
                  <div className="empty-state-title">Tidak ada produk</div>
                </div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Menampilkan {filtered.length} dari {mockProducts.length} produk</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm">‹ Prev</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-secondary btn-sm">Next ›</button>
          </div>
        </div>
      </div>

      {(showModal || editProduct) && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null) }}
        />
      )}
    </div>
  )
}

function ProductFormModal({ product, onClose }: { product: typeof mockProducts[0] | null; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Nama Produk <span className="form-required">*</span></label>
              <input className="form-control" defaultValue={product?.name} placeholder="Nama produk..." />
            </div>
            <div className="form-group">
              <label className="form-label">Kode Produk</label>
              <input className="form-control" defaultValue={product?.code} placeholder="Auto-generate" />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-control" defaultValue={product?.category}>
                <option>Office Supplies</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Safety</option>
                <option>Industrial</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Satuan</label>
              <select className="form-control" defaultValue={product?.unit}>
                <option>Pcs</option>
                <option>Unit</option>
                <option>Box</option>
                <option>Rim</option>
                <option>Kg</option>
                <option>Liter</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Harga Estimasi (Rp)</label>
              <input type="number" className="form-control" defaultValue={product?.price} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Stok Awal</label>
              <input type="number" className="form-control" defaultValue={product?.stock} placeholder="0" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Deskripsi</label>
              <textarea className="form-control" placeholder="Deskripsi produk..." />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control">
                <option value="true">Aktif</option>
                <option value="false">Non-Aktif</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary">Simpan</button>
        </div>
      </div>
    </div>
  )
}
