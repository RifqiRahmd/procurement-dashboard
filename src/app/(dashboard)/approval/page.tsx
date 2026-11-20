'use client'
import { useState } from 'react'
import { CheckCircle, XCircle, Clock, MessageSquare, FileText } from 'lucide-react'

const mockApprovals = [
  { id: 'APR-001', prId: 'PR-2024-089', title: 'Pengadaan ATK Kantor Q4', requester: 'Budi Santoso', department: 'Finance', totalAmount: 15500000, priority: 'NORMAL', level: 1, createdAt: '2024-11-18 09:30', items: 8, status: 'PENDING' },
  { id: 'APR-002', prId: 'PR-2024-084', title: 'Peralatan Dapur Kantin', requester: 'Linda Kusuma', department: 'GA', totalAmount: 12000000, priority: 'NORMAL', level: 1, createdAt: '2024-11-17 14:15', items: 7, status: 'PENDING' },
  { id: 'APR-003', prId: 'PR-2024-086', title: 'Seragam Karyawan 2025', requester: 'Maya Sari', department: 'HRD', totalAmount: 48000000, priority: 'LOW', level: 2, createdAt: '2024-11-16 11:00', items: 3, status: 'PENDING' },
]

const historyApprovals = [
  { id: 'APR-004', prId: 'PR-2024-088', title: 'Pembelian Furniture Ruang Rapat', requester: 'Siti Rahayu', totalAmount: 85000000, status: 'APPROVED', actionAt: '2024-11-17 15:30', comment: 'Disetujui, budget sesuai alokasi Q4.' },
  { id: 'APR-005', prId: 'PR-2024-085', title: 'Perlengkapan Safety K3', requester: 'Rudi Hermawan', totalAmount: 32500000, status: 'REJECTED', actionAt: '2024-11-16 10:00', comment: 'Spesifikasi tidak sesuai standar. Mohon revisi.' },
  { id: 'APR-006', prId: 'PR-2024-087', title: 'Server & Networking Equipment', requester: 'Andi Wijaya', totalAmount: 320000000, status: 'APPROVED', actionAt: '2024-11-15 16:45', comment: 'Approved dengan catatan: lakukan tender minimal 3 vendor.' },
]

function formatRp(val: number) { return 'Rp ' + val.toLocaleString('id-ID') }

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'history'>('inbox')
  const [selectedPR, setSelectedPR] = useState<typeof mockApprovals[0] | null>(null)
  const [comment, setComment] = useState('')

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Approval Workflow</h1>
          <p className="page-desc">Kelola persetujuan Purchase Request</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700 }}>
            <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
            {mockApprovals.length} Menunggu Persetujuan
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
          Inbox Approval ({mockApprovals.length})
        </button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Riwayat
        </button>
      </div>

      {activeTab === 'inbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mockApprovals.map(apr => (
            <div key={apr.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Icon */}
                <div style={{ width: 44, height: 44, background: 'var(--warning-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} style={{ color: 'var(--warning)' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: 'var(--primary)', fontWeight: 600 }}>
                          {apr.prId}
                        </span>
                        <span className={`badge ${apr.priority === 'URGENT' ? 'badge-danger' : apr.priority === 'HIGH' ? 'badge-warning' : 'badge-muted'}`}>
                          {apr.priority}
                        </span>
                        <span className="badge badge-info">Level {apr.level}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{apr.title}</h3>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>👤 {apr.requester}</span>
                        <span>🏢 {apr.department}</span>
                        <span>📦 {apr.items} item</span>
                        <span>🕐 {apr.createdAt}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Total Nilai</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{formatRp(apr.totalAmount)}</div>
                    </div>
                  </div>

                  {/* Comment field + actions */}
                  <div style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: 14, marginTop: 10 }}>
                    <textarea
                      className="form-control"
                      placeholder="Tambahkan komentar (opsional)..."
                      style={{ marginBottom: 10, minHeight: 60 }}
                      value={selectedPR?.id === apr.id ? comment : ''}
                      onChange={e => { setSelectedPR(apr); setComment(e.target.value) }}
                    />
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPR(apr)}>
                        <FileText size={13} /> Detail PR
                      </button>
                      <button className="btn btn-danger btn-sm">
                        <XCircle size={14} /> Tolak
                      </button>
                      <button className="btn btn-success btn-sm">
                        <CheckCircle size={14} /> Setujui
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {mockApprovals.length === 0 && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon"><CheckCircle size={28} /></div>
                <div className="empty-state-title">Semua sudah diproses</div>
                <div className="empty-state-desc">Tidak ada PR yang menunggu persetujuan</div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>No. PR</th>
                  <th>Judul</th>
                  <th>Pemohon</th>
                  <th>Total Nilai</th>
                  <th>Status</th>
                  <th>Waktu Aksi</th>
                  <th>Komentar</th>
                </tr>
              </thead>
              <tbody>
                {historyApprovals.map(h => (
                  <tr key={h.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5, color: 'var(--primary)', fontWeight: 600 }}>
                        {h.prId}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{h.requester}</td>
                    <td style={{ fontWeight: 700 }}>{formatRp(h.totalAmount)}</td>
                    <td>
                      <span className={h.status === 'APPROVED' ? 'badge badge-success badge-dot' : 'badge badge-danger badge-dot'}>
                        {h.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{h.actionAt}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12, maxWidth: 200 }}>
                      <span style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: 6, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.comment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
